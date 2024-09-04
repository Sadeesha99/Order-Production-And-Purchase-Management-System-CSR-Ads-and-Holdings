package com.csr.mrn;

import com.csr.material.*;
import com.csr.privilege.Privilege;
import com.csr.privilege.PrivilegeController;
import com.csr.product.Product;
import com.csr.product.ProductDao;
import com.csr.product.ProductHasMaterial;
import com.csr.purchaseorder.PurchaseOrder;
import com.csr.purchaseorder.PurchaseOrderDao;
import com.csr.purchaseorder.PurchaseOrderHasMaterial;
import com.csr.purchaseorder.PurchaseOrderStatusDao;
import com.csr.supplier.Supplier;
import com.csr.supplier.SupplierDao;
import com.csr.user.UserDao;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
public class MaterialReceivedNoteController {
    @Autowired
    private MaterialReceivedNoteDao materialReceivedNoteDao;
    @Autowired
    private MaterialReceivedNoteStatusDao materialReceivedNoteStatusDao;
    @Autowired
    private PrivilegeController privilegeController;
    @Autowired
    private SupplierDao supplierDao;
    @Autowired
    private PurchaseOrderDao purchaseOrderDao;
    @Autowired
    private PurchaseOrderStatusDao purchaseOrderStatusDao;
    @Autowired
    private MaterialDao materialDao;
    @Autowired
    private MaterialStatusDao materialStatusDao;
    @Autowired
    private MaterialInventoryLogDao materialInventoryLogDao;
    @Autowired
    private ProductDao productDao;
    @Autowired
    private UserDao userDao;



    @GetMapping(value = "/mrn/findall", produces = "application/json")
    public List<MaterialReceivedNote> getAllMRN(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "MaterialReceivedNote");
        if (!loggedUserPrivilege.getSel_privi()) {
            return new ArrayList<>();
        }
        return materialReceivedNoteDao.findAll();
    }

    @GetMapping(value = "/mrn/status", produces = "application/json")
    public List<MaterialReceivedNoteStatus> getAllMRNStatus(){
        return materialReceivedNoteStatusDao.findAll();
    }

    @GetMapping(value = "/mrn/validsuppliers", produces = "application/json")
    public List<Supplier> getSupplierWithValidPurchaseOrder() {
        return supplierDao.getSupplierWithValidPO();
    }

    @GetMapping(value = "/mrn/polistbysupid/{id}", produces = "application/json")
    public List<PurchaseOrder> getSendPurchaseOrderListBySupplierId(@PathVariable("id") Integer id){
        List<PurchaseOrder> sendPOrderListBySupId = purchaseOrderDao.getSendPurchaseOrderListBySupId(id);
        for(PurchaseOrder porderItem : sendPOrderListBySupId){
            //If porder required date plus 14 days is after today then auto cancel the porder
            if(LocalDate.now().isAfter(porderItem.getRequired_date().plusDays(14))){
                porderItem.setPurchase_order_status_id(purchaseOrderStatusDao.getReferenceById(4));
                for (PurchaseOrderHasMaterial poHm : porderItem.getPurchaseOrderHasMaterialList()){
                    poHm.setPurchase_order_id(porderItem);
                }
                purchaseOrderDao.save(porderItem);
            }
        }
        return purchaseOrderDao.getSendPurchaseOrderListBySupId(id);
    }

    @GetMapping(value = "/mrn/matlistbypo/{id}", produces = "application/json")
    public List<Material> getBestPricedMaterialListForSupplier(@PathVariable("id") Integer id){
        return materialReceivedNoteDao.getMaterialListByPOid(id);
    }

    @GetMapping(value = "/mrn")
    public ModelAndView receivedQuotationUI() {
        // Authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "MaterialReceivedNote");
        if (!loggedUserPrivilege.getSel_privi()) {
            ModelAndView mrnModelAndViewError = new ModelAndView();
            mrnModelAndViewError.setViewName("error.html");
            return mrnModelAndViewError;
        } else {
            ModelAndView mrnModelAndView = new ModelAndView();
            mrnModelAndView.addObject("title", "Material Received Note Management");
            mrnModelAndView.addObject("navbartitle", "MATERIAL RECEIVED NOTE MANAGEMENT MODULE");
            mrnModelAndView.addObject("loggeduser", auth.getName());
            mrnModelAndView.setViewName("mrn.html");
            return mrnModelAndView;
        }
    }

    @PostMapping(value = "/mrn")
    @Transactional
    public String postPurchaseOrder(@RequestBody MaterialReceivedNote mrn){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "MaterialReceivedNote");
        if (!loggedUserPrivilege.getIns_privi()) {
            return "Submit did not completed : You dont have the privilege";
        }
        try {
            String nextMRNNo = materialReceivedNoteDao.getNxtMRNNo();
            if (nextMRNNo == null || nextMRNNo.equals("")) {
                mrn.setMrn_no("MRN00001");
            } else {
                mrn.setMrn_no(nextMRNNo);
            }

            for(MaterialReceivedNoteHasMaterial mrnhasm : mrn.getMaterialReceivedNoteHasMaterialList()){
                mrnhasm.setMaterial_received_note_id(mrn);
            }
            mrn.setAdded_time(LocalDateTime.now());
            mrn.setAdded_user_id(userDao.findByUsername(auth.getName()).getId());
            materialReceivedNoteDao.save(mrn);

            //Update Purchase Order to Received Status
            PurchaseOrder mrnPOrder = purchaseOrderDao.getReferenceById(mrn.getPurchase_order_id().getId());
            mrnPOrder.setPurchase_order_status_id(purchaseOrderStatusDao.getReferenceById(2));
            for (PurchaseOrderHasMaterial pohasm : mrnPOrder.getPurchaseOrderHasMaterialList()){
                pohasm.setPurchase_order_id(mrnPOrder);
            }
            purchaseOrderDao.save(mrnPOrder);

            //List of materials in MRN
            for(MaterialReceivedNoteHasMaterial mrnHasM : mrn.getMaterialReceivedNoteHasMaterialList()){
                //get one material as material object
                Material mrnMaterial = materialDao.getReferenceById(mrnHasM.getMaterial_id().getId());
                //create new inventory log for it and relevant data
                MaterialInventoryLog mrnMatInventoryLog = new MaterialInventoryLog();
                mrnMatInventoryLog.setMaterial_id(mrnMaterial);
                mrnMatInventoryLog.setMaterial_received_note_id(mrn);
                mrnMatInventoryLog.setLogged_quantity(mrnHasM.getQuantity());
                mrnMatInventoryLog.setBefore_log_quantity(mrnMaterial.getCurrent_unit_stock());

                //Set Material last intake and stock and update cost of the material unit
                mrnMaterial.setLast_intake_date(LocalDateTime.now());
                mrnMaterial.setLast_stock_intake(mrnHasM.getQuantity());
                mrnMaterial.setAll_time_total_stock(mrnMaterial.getAll_time_total_stock().add(mrnHasM.getQuantity()));
                mrnMaterial.setCurrent_unit_stock(mrnMaterial.getCurrent_unit_stock().add(mrnHasM.getQuantity()));
                mrnMaterial.setUnit_cost(mrnHasM.getPurchased_unit_price());

                //update Material status if it is higher than reorder point
                if(mrnMaterial.getCurrent_unit_stock().compareTo(mrnMaterial.getReorder_point())>0){
                    mrnMaterial.setMaterial_status_id(materialStatusDao.getReferenceById(1));
                }
                //Save Material
                materialDao.save(mrnMaterial);

                mrnMatInventoryLog.setInventory_up(true);
                mrnMatInventoryLog.setAfter_log_quantity(mrnMaterial.getCurrent_unit_stock());
                mrnMatInventoryLog.setLogged_year(((LocalDateTime.now()).toString().split("T")[0].split("-")[0]));
                mrnMatInventoryLog.setLogged_month(((LocalDateTime.now()).toString().split("T")[0].split("-")[1]));
                mrnMatInventoryLog.setLogged_date(((LocalDateTime.now()).toString().split("T")[0].split("-")[2]));
                mrnMatInventoryLog.setLogged_time(LocalDateTime.now());
                mrnMatInventoryLog.setAdded_user_id(userDao.findByUsername(auth.getName()).getId());
                materialInventoryLogDao.save(mrnMatInventoryLog);

                //Update price of all products with this material
                List<Product> productsListByMaterialid = productDao.getProductListByMaterial(mrnMaterial.getId());
                //running for loop to do changes to those products
                for (Product productByMaterial : productsListByMaterialid) {
                    //correcting product has material records with new values from material
                    for (ProductHasMaterial phm : productByMaterial.getProductHasMaterialList()) {
                        //checking for material which has to be changed in the product has material table
                        if (phm.getMaterial_id().getId() == mrnMaterial.getId()) {
                            //setting values for product has material unit price and line price
                            phm.setMaterial_unit_price((mrnMaterial.getUnit_cost().multiply(mrnMaterial.getProfit_percentage().divide(new BigDecimal(100))).add(mrnMaterial.getUnit_cost())));
                            phm.setMaterial_line_price(((mrnMaterial.getUnit_cost().multiply(mrnMaterial.getProfit_percentage().divide(new BigDecimal(100))).add(mrnMaterial.getUnit_cost()))).multiply(phm.getReq_quantity()));
                        }
                    }
                    //creating a BigDecimal zero variable for product total price calculation..
                    BigDecimal productLineTotal = BigDecimal.ZERO;
                    for (ProductHasMaterial phasmat : productByMaterial.getProductHasMaterialList()) {
                        productLineTotal = productLineTotal.add(phasmat.getMaterial_line_price());
                        phasmat.setProduct_id(productByMaterial);
                    }
                    productByMaterial.setTotal_price(productLineTotal.add(productByMaterial.getService_charge()));
                    //Save updated products
                    productDao.save(productByMaterial);
                }
            }

            return "OK";
        }catch (Exception e){
            return "MRN did not submitted." + (e.getMessage());
        }
    }


}
