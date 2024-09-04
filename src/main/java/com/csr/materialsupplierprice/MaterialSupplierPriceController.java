package com.csr.materialsupplierprice;

import com.csr.material.Material;
import com.csr.material.MaterialDao;
import com.csr.privilege.Privilege;
import com.csr.privilege.PrivilegeController;
import com.csr.quotationrequest.QuotationRequestDao;
import com.csr.receivedquotation.ReceivedQuotation;
import com.csr.receivedquotation.ReceivedQuotationDao;
import com.csr.receivedquotation.ReceivedQuotationHasMaterial;
import com.csr.receivedquotation.ReceivedQuotationStatusDao;
import com.csr.reports.MaterailUsageReport;
import com.csr.user.UserDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@RestController
public class MaterialSupplierPriceController {
    @Autowired
    private MaterialSupplierPriceDao materialSupplierPriceDao;
    @Autowired
    private PrivilegeController privilegeController;

    @Autowired
    private ReceivedQuotationDao receivedQuotationDao;

    @Autowired
    private MaterialDao materialDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private QuotationRequestDao quotationRequestDao;




    @GetMapping(value = "/materialsupplierprice/findall", produces = "application/json")
    public List<MaterialSupplierPrice> getAllReceivedQuotation() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "MaterialSupplierPrice");
        if (!loggedUserPrivilege.getSel_privi()) {
            return new ArrayList<>();
        }
        return materialSupplierPriceDao.findAll();
    }

    @GetMapping(value = "/materialsupplierpricedrq/{id}", produces = "application/json")
    public List<BestPriceRQEntity> getAllBestPricedReceivedQuotation(@PathVariable("id") Integer id) {
        String[][] queryDataList =  materialSupplierPriceDao.joinTableRQAndRQHasM(id);

        List<BestPriceRQEntity>  bestMaterialSupplierList = new ArrayList<>();

        for(String[] querdata:queryDataList){
            //Create new  Object and pass to array
            BestPriceRQEntity bestMaterialSupplierQR = new BestPriceRQEntity();
            bestMaterialSupplierQR.setRecieved_quotation_id(receivedQuotationDao.getReferenceById(Integer.parseInt(querdata[0])));
            bestMaterialSupplierQR.setQuotation_request_id(quotationRequestDao.getReferenceById(Integer.parseInt(querdata[1])));
            bestMaterialSupplierQR.setExpire_date(LocalDate.parse(querdata[2], DateTimeFormatter.ISO_LOCAL_DATE));
            bestMaterialSupplierQR.setMaterial_id(materialDao.getReferenceById(Integer.parseInt(querdata[3])));
            bestMaterialSupplierQR.setMaterial_unit_price(new BigDecimal(querdata[4]));
            bestMaterialSupplierList.add(bestMaterialSupplierQR);
        }

        return bestMaterialSupplierList;
    }
@GetMapping(value = "/materialsupplierpricedrqlist/{id}", produces = "application/json")
    public List<ReceivedQuotation> getAllBestPricedReceivedQuotationList(@PathVariable("id") Integer id) {
        String[][] queryDataList =  materialSupplierPriceDao.joinTableRQIDListAndRQHasM(id);
        List<ReceivedQuotation>  bestMaterialSupplierQRList = new ArrayList<>();
        for(String[] querdata:queryDataList){
            //Create new  Object and pass to array
             ReceivedQuotation receivedQuotation = receivedQuotationDao.getReferenceById(Integer.parseInt(querdata[0]));
            bestMaterialSupplierQRList.add(receivedQuotation);
        }
        return bestMaterialSupplierQRList;
    }

    @GetMapping(value = "/materialsupplierprice/materialList", produces = "application/json")
    public List<Material> getAllMaterialWithoutDel() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "MaterialSupplierPrice");
        if (!loggedUserPrivilege.getSel_privi()) {
            return new ArrayList<>();
        }
        return materialDao.getAllMatsWithoutDel();
    }

    @GetMapping(value = "/validqrformaterialsupplierprice/{id}", produces = "application/json")
    public List<ReceivedQuotation> getUserByID(@PathVariable("id") Integer id){
        List<ReceivedQuotation> validRQList = receivedQuotationDao.getValidQRListByMaterailId(id);
        for(ReceivedQuotation elementRQ : validRQList){
            if(LocalDate.now().isAfter(elementRQ.getExpire_date())){
                for(ReceivedQuotationHasMaterial rqhasm : elementRQ.getReceivedQuotationHasMaterialList()){
                    rqhasm.setReceived_quotation_id(elementRQ);
                }
                receivedQuotationDao.save(elementRQ);
            }
        }
        return receivedQuotationDao.getValidQRListByMaterailId(id);
    }
    @GetMapping(value = "/materialsupplierprice")
    public ModelAndView receivedQuotationUI() {
        // Authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "MaterialSupplierPrice");
        if (!loggedUserPrivilege.getSel_privi()) {
            ModelAndView mspAnalyzerModelAndViewError = new ModelAndView();
            mspAnalyzerModelAndViewError.setViewName("error.html");
            return mspAnalyzerModelAndViewError;
        } else {
            ModelAndView mspAnalyzerModelAndView = new ModelAndView();
            mspAnalyzerModelAndView.addObject("title", "Material Supplier And Price Management");
            mspAnalyzerModelAndView.addObject("navbartitle", "MATERIAL SUPPLIER AND PRICE MANAGEMENT MODULE");
            mspAnalyzerModelAndView.addObject("loggeduser", auth.getName());
            mspAnalyzerModelAndView.setViewName("materialsupplierpriceanalyzer.html");
            return mspAnalyzerModelAndView;
        }
    }

    @PutMapping(value = "/materialsupplierprice")
    public String putMSPSetPriceUpdate(@RequestBody MaterialSupplierPrice matSupPrice) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "MaterialSupplierPrice");
        if (!loggedUserPrivilege.getUpd_privi()) {
            return "Delete was not successful : You dont have the privilege";
        }

        try {
            MaterialSupplierPrice extMaterialSP = materialSupplierPriceDao.findByMaterialId(matSupPrice.getMaterial_id().getId());
            if(extMaterialSP==null){
                matSupPrice.setUpdated_time(LocalDateTime.now());
                matSupPrice.setUpdated_user_id(userDao.findByUsername(auth.getName()).getId());
                materialSupplierPriceDao.save(matSupPrice);
            }else{
                extMaterialSP.setUpdated_time(LocalDateTime.now());
                extMaterialSP.setUpdated_user_id(userDao.findByUsername(auth.getName()).getId());
                extMaterialSP.setSupplier_id(matSupPrice.getSupplier_id());
                extMaterialSP.setReceived_quotation_id(matSupPrice.getReceived_quotation_id());
                extMaterialSP.setBest_supplier_price(matSupPrice.getBest_supplier_price());
                materialSupplierPriceDao.save(extMaterialSP);
            }
            return "OK";

        } catch (Exception e) {
            return ("Save could not complete : " + e.getMessage());
        }
    }


}
