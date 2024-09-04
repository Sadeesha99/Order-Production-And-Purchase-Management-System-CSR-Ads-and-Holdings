package com.csr.purchaseorder;

import com.csr.material.Material;
import com.csr.materialsupplierprice.MaterialSupplierPrice;
import com.csr.privilege.Privilege;
import com.csr.privilege.PrivilegeController;
import com.csr.supplier.Supplier;
import com.csr.supplier.SupplierDao;
import com.csr.user.UserDao;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
public class PurchaseOrderController {

    @Autowired
    private PrivilegeController privilegeController;

    @Autowired
    private PurchaseOrderDao purchaseOrderDao;

    @Autowired
    private PurchaseOrderStatusDao purchaseOrderStatusDao;

    @Autowired
    private SupplierDao supplierDao;

    @Autowired
    private UserDao userDao;


    @GetMapping(value = "/purchaseorder/findall", produces = "application/json")
    public List<PurchaseOrder> getAllPurchaseOrder() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "PurchaseOrder");
        if (!loggedUserPrivilege.getSel_privi()) {
            return new ArrayList<>();
        }
        return purchaseOrderDao.findAll();
    }
    @GetMapping(value = "/purchaseorder/send", produces = "application/json")
    @Transactional
    public List<PurchaseOrder> getAllSendPurchaseOrder() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "PurchaseOrder");
        if (!loggedUserPrivilege.getSel_privi()) {
            return new ArrayList<>();
        }
        List<PurchaseOrder> sendPOrderList = purchaseOrderDao.getSendPurchaseOrderList();
        for(PurchaseOrder porder : sendPOrderList){
            //If porder required date plus 14 days is after today then auto cancel the porder
            if(LocalDate.now().isAfter(porder.getRequired_date().plusDays(14))){
                porder.setPurchase_order_status_id(purchaseOrderStatusDao.getReferenceById(4));
                for (PurchaseOrderHasMaterial poHm : porder.getPurchaseOrderHasMaterialList()){
                    poHm.setPurchase_order_id(porder);
                }
                purchaseOrderDao.save(porder);
            }
        }
        return purchaseOrderDao.getSendPurchaseOrderList();
    }
    @GetMapping(value = "/purchaseorder/received", produces = "application/json")
    public List<PurchaseOrder> getAllReceivedPurchaseOrder() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "PurchaseOrder");
        if (!loggedUserPrivilege.getSel_privi()) {
            return new ArrayList<>();
        }
        return purchaseOrderDao.getReceivedPurchaseOrderList();
    }
    @GetMapping(value = "/purchaseorder/completed", produces = "application/json")
    public List<PurchaseOrder> getAllCompletedPurchaseOrder() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "PurchaseOrder");
        if (!loggedUserPrivilege.getSel_privi()) {
            return new ArrayList<>();
        }
        return purchaseOrderDao.getCompletedPurchaseOrderList();
    }
    @GetMapping(value = "/purchaseorder/canceled", produces = "application/json")
    public List<PurchaseOrder> getAllCanceledPurchaseOrder() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "PurchaseOrder");
        if (!loggedUserPrivilege.getSel_privi()) {
            return new ArrayList<>();
        }
        return purchaseOrderDao.getCanceledPurchaseOrderList();
    }
    @GetMapping(value = "/purchaseorder/validsuppliers", produces = "application/json")
    public List<Supplier> getAllSuppliersWithBestPrice() {
        return supplierDao.getSuppliersWithBestPriceForMaterial();
    }
    @GetMapping(value = "/purchaseorder/status/list", produces = "application/json")
    public List<PurchaseOrderStatus> getAllPurchaseOrderStatus() {
        return purchaseOrderStatusDao.findAll();
    }

    @GetMapping(value = "/purchaseorder/matlist/{id}", produces = "application/json")
    public List<Material> getBestPricedMaterialListForSupplier(@PathVariable("id") Integer id){
        return purchaseOrderDao.getMaterialListBySupplier(id);
    }
    @GetMapping(value = "/bestpurchaseprice/bymatid/{id}", produces = "application/json")
    public MaterialSupplierPrice getBestPricedMaterial(@PathVariable("id") Integer id){
        return purchaseOrderDao.getMaterialSupplierPriceOB(id);
    }

    @GetMapping(value = "/purchaseorder")
    public ModelAndView purchaseOrderUI() {
        // Authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "PurchaseOrder");
        if (!loggedUserPrivilege.getSel_privi()) {
            ModelAndView purchaseOrderModelAndViewError = new ModelAndView();
            purchaseOrderModelAndViewError.setViewName("error.html");
            return purchaseOrderModelAndViewError;
        } else {
            ModelAndView purchaseOrderModelAndView = new ModelAndView();
            purchaseOrderModelAndView.addObject("title", "Purchase Order Management");
            purchaseOrderModelAndView.addObject("navbartitle", "PURCHASE ORDER MANAGEMENT MODULE");
            purchaseOrderModelAndView.addObject("loggeduser", auth.getName());
            purchaseOrderModelAndView.setViewName("purchaseorder.html");
            return purchaseOrderModelAndView;
        }
    }

    @PostMapping(value = "/purchaseorder")
    @Transactional
    public String postPurchaseOrder(@RequestBody PurchaseOrder POrder){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "PurchaseOrder");
        if (!loggedUserPrivilege.getIns_privi()) {
            return "Submit did not completed : You dont have the privilege";
        }
        try {
            String nextPONumber = purchaseOrderDao.getNxtPurchaseOrderNo();
            if (nextPONumber == null || nextPONumber.equals("")) {
                POrder.setPurchase_order_no("PO00001");
            } else {
                POrder.setPurchase_order_no(nextPONumber);
            }
            POrder.setAdded_time(LocalDateTime.now());
            POrder.setAdded_user_id(userDao.findByUsername(auth.getName()).getId());
            for(PurchaseOrderHasMaterial pohasm : POrder.getPurchaseOrderHasMaterialList()){
                pohasm.setPurchase_order_id(POrder);
            }
            purchaseOrderDao.save(POrder);
            return "OK";
        }catch (Exception e){
            return "Purchase Order did not submitted." + (e.getMessage());
        }
    }

    @DeleteMapping(value = "/purchaseorder")
    @Transactional
    public String delPurchaseOrder(@RequestBody PurchaseOrder POrder){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "PurchaseOrder");
        if (!loggedUserPrivilege.getDel_privi()) {
            return "Cancellation did not completed : You dont have the privilege";
        }
        PurchaseOrder extPOrder = purchaseOrderDao.getReferenceById(POrder.getId());
        if(extPOrder==null){
            return "Cancellation did not completed : Purchase Order could not found in database.";
        }
        if(extPOrder.getPurchase_order_status_id().getId()!=1){
            return "Cancellation did not completed : Purchase Order cannot delete at this state.";
        }
        try {

            POrder.setDeleted_time(LocalDateTime.now());
            POrder.setDeleted_user_id(userDao.findByUsername(auth.getName()).getId());
            POrder.setPurchase_order_status_id(purchaseOrderStatusDao.getReferenceById(4));
            for(PurchaseOrderHasMaterial pohasm : POrder.getPurchaseOrderHasMaterialList()){
                pohasm.setPurchase_order_id(POrder);
            }
            purchaseOrderDao.save(POrder);
            return "OK";
        }catch (Exception e){
            return "Purchase Order did not submitted." + (e.getMessage());
        }
    }
}
