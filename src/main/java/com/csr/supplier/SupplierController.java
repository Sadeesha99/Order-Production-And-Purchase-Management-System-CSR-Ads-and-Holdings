package com.csr.supplier;

import com.csr.privilege.Privilege;
import com.csr.privilege.PrivilegeController;
import com.csr.user.UserDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
public class SupplierController {

    @Autowired
    private PrivilegeController privilegeController;

    @Autowired
    private SupplierDao supplierDao;

    @Autowired
    private SupplierStatusDao supplierStatusDao;

    @Autowired
    private UserDao userDao;


    @GetMapping(value = "/supplier/findall", produces = "application/json")
    public List<Supplier> getAllSupplier() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Supplier");
        if (!loggedUserPrivilege.getSel_privi()) {
            return new ArrayList<>();
        }
        return supplierDao.findAll();
    }


    @GetMapping(value = "/supplier/status/findall", produces = "application/json")
    public List<SupplierStatus> getAllSupplierStatus() {
        return supplierStatusDao.findAll();
    }

    @GetMapping(value = "/supplier")
    public ModelAndView supplerUI() {
        // Authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (!(privilegeController.getPrivilegeByModule(auth, "Supplier").getSel_privi())) {
            ModelAndView supplierModelAndViewError = new ModelAndView();
            supplierModelAndViewError.setViewName("error.html");
            return supplierModelAndViewError;
        } else {
            ModelAndView supplierModelAndView = new ModelAndView();
            supplierModelAndView.addObject("title", "Supplier Management");
            supplierModelAndView.addObject("navbartitle", "SUPPLIER MANAGEMENT MODULE");
            supplierModelAndView.addObject("loggeduser", auth.getName());
            supplierModelAndView.setViewName("supplier.html");
            return supplierModelAndView;
        }
    }

    @PostMapping(value = "/supplier")
    public String postSupplier(@RequestBody Supplier supplier) {
        // Authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Supplier");
        if (!loggedUserPrivilege.getIns_privi()) {
            return "Save did not completed : You dont have the privilege";
        }
        Supplier extSupplierByName = supplierDao.findByBusinessname(supplier.getBusinessname());
        if(extSupplierByName!=null){
            return "Save did not completed : This supplier name already exist in database..!";
        }
        try {
            String nexSupplierNo = supplierDao.getNxtSupplierNo();
            if (nexSupplierNo==null || nexSupplierNo.equals("")) {
                supplier.setSupplierno("SUP0001");
            } else {
                supplier.setSupplierno(nexSupplierNo);
            }

            supplier.setAdded_user_id(userDao.findByUsername(auth.getName()).getId());
            supplier.setAdded_time(LocalDateTime.now());
            supplierDao.save(supplier);
            return "OK";
        }catch (Exception e){
            return "Save not Completed : " + e.getMessage();
        }
    }

    @DeleteMapping(value = "/supplier")
    public String delSupplier (@RequestBody Supplier supplier) {
        // Authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Supplier");
        if (!loggedUserPrivilege.getDel_privi()) {
            return "Delete did not completed : You dont have the privilege";
        }
        Supplier extSupplier = supplierDao.getReferenceById(supplier.getId());
        if(extSupplier.equals(null)){
            return "Delete did not completed : This supplier do not exist in database..!";
        }
        if(extSupplier.getSupplier_status_id().equals(supplierStatusDao.getReferenceById(3))){
            return "Delete did not completed : This supplier do not exist in database..!";
        }
        try {
            supplier.setDeleted_user_id(userDao.findByUsername(auth.getName()).getId());
            supplier.setDeleted_time(LocalDateTime.now());
            supplier.setSupplier_status_id(supplierStatusDao.getReferenceById(3));
            supplierDao.save(supplier);
            return "OK";
        }catch (Exception e){
            return "Delete not Completed : " + e.getMessage();
        }
    }
    @PutMapping(value = "/supplier")
    public String UpdSupplier(@RequestBody Supplier supplier) {
        // Authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Supplier");
        if (!loggedUserPrivilege.getUpd_privi()) {
            return "Update did not completed : You dont have the privilege";
        }
        Supplier extSupplier = supplierDao.getReferenceById(supplier.getId());
        if(extSupplier.equals(null)){
            return "Update did not completed : This supplier do not exist in database..!";
        }
        try {
            supplier.setUpdated_user_id(userDao.findByUsername(auth.getName()).getId());
            supplier.setUpdated_time(LocalDateTime.now());
            supplierDao.save(supplier);
            return "OK";
        }catch (Exception e){
            return "Update not Completed : " + e.getMessage();
        }
    }



}
