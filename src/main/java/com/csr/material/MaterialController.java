package com.csr.material;

import com.csr.privilege.Privilege;
import com.csr.privilege.PrivilegeController;
import com.csr.product.Product;
import com.csr.product.ProductDao;
import com.csr.product.ProductHasMaterial;
import com.csr.product.ProductHasMaterialDao;
import com.csr.user.UserDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
public class MaterialController {
    @Autowired
    private PrivilegeController privilegeController;
    @Autowired
    private MaterialDao materialDao;
    @Autowired
    private MaterialStatusDao materialStatusDao;
    @Autowired
    private MaterialUnitTypeDao materialUnitTypeDao;
    @Autowired
    private MaterialCategoryDao materialCategoryDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private MaterialInventoryLogDao materialInventoryLogDao;

    @Autowired
    private ProductDao productDao;

    @GetMapping(value = "/material/findall", produces = "application/json")
    public List<Material> getAllMaterial() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Material");
        if (!loggedUserPrivilege.getSel_privi()) {
            return new ArrayList<>();
        }
        return materialDao.findAll();
    }

    @GetMapping(value = "/material/lowstock", produces = "application/json")
    public List<Material> getAllLowStockOrderByIdDesc() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Material");
        if (!loggedUserPrivilege.getSel_privi()) {
            return new ArrayList<>();
        }
        return materialDao.getAllMatsLowStockOrderByDesc();
    }

    @GetMapping(value = "/material/instock", produces = "application/json")
    public List<Material> getAllInStockOrderByIdDesc() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Material");
        if (!loggedUserPrivilege.getSel_privi()) {
            return new ArrayList<>();
        }
        return materialDao.getAllMatsInStockOrderByDesc();
    }

    @GetMapping(value = "/material/outstock", produces = "application/json")
    public List<Material> getAllOutStockOrderByIdDesc() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Material");
        if (!loggedUserPrivilege.getSel_privi()) {
            return new ArrayList<>();
        }
        return materialDao.getAllMatsOutStockOrderByDesc();
    }
    @GetMapping(value = "/material/delstock", produces = "application/json")
    public List<Material> getAllDeletedStockOrderByIdDesc() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Material");
        if (!loggedUserPrivilege.getSel_privi()) {
            return new ArrayList<>();
        }
        return materialDao.getAllMatsDelStockOrderByDesc();
    }


    @GetMapping(value = "/material/status", produces = "application/json")
    public List<MaterialStatus> getAllMaterialStatus() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Material");
        if (!loggedUserPrivilege.getSel_privi()) {
            return new ArrayList<>();
        }
        return materialStatusDao.findAll();
    }

    @GetMapping(value = "/material/unittype", produces = "application/json")
    public List<MaterialUnitType> getAllMaterialUnitType() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Material");
        if (!loggedUserPrivilege.getSel_privi()) {
            return new ArrayList<>();
        }
        return materialUnitTypeDao.findAll();
    }

    @PostMapping(value = "/material/unittype")
    public String postMaterialUnitType(@RequestBody MaterialUnitType material_unit_type){
        //check for existing record
        MaterialUnitType extByMat_UnitTyp_1 = materialUnitTypeDao.findByName(material_unit_type.getName());
        MaterialUnitType extByMat_UnitTyp_2 = materialUnitTypeDao.findByName(material_unit_type.getName().toLowerCase());
        MaterialUnitType extByMat_UnitTyp_3 = materialUnitTypeDao.findByName(material_unit_type.getName().toUpperCase());
        if((extByMat_UnitTyp_1!=null)||(extByMat_UnitTyp_2!=null)||(extByMat_UnitTyp_3!=null)){
            return "Material Unit Type already exist..!";
        }

        MaterialUnitType extByMat_UnitTyp_4 = materialUnitTypeDao.findByName(material_unit_type.getSymbol());
        MaterialUnitType extByMat_UnitTyp_5 = materialUnitTypeDao.findByName(material_unit_type.getSymbol().toLowerCase());
        MaterialUnitType extByMat_UnitTyp_6 = materialUnitTypeDao.findByName(material_unit_type.getSymbol().toUpperCase());
        if((extByMat_UnitTyp_4!=null)||(extByMat_UnitTyp_5!=null)||(extByMat_UnitTyp_6!=null)){
            return "Material Unit Type already exist..!";
        }
        try {
            materialUnitTypeDao.save(material_unit_type);
            return "OK";
        }catch (Exception e){
            return "Save not Completed : " + e.getMessage();
        }
    }


    @GetMapping(value = "/material/category", produces = "application/json")
    public List<MaterialCategory> getAllMaterialCategory() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Material");
        if (!loggedUserPrivilege.getSel_privi()) {
            return new ArrayList<>();
        }
        return materialCategoryDao.findAll();
    }

    @GetMapping(value = "/material/validbycategory/{categoryID}", produces = "application/json")
    public List<Material> getValidMaterialByCategory(@PathVariable("categoryID") Integer categoryID) {
        return materialDao.getValidMaterialByCategory(categoryID);
    }
    @GetMapping(value = "/materialbyid/{id}", produces = "application/json")
    public Material getMaterialByID(@PathVariable("id") Integer id) {
        return materialDao.getReferenceById(id);
    }

    @PostMapping(value = "/material/category")
    public String postMaterialCategory(@RequestBody MaterialCategory material_category){
        //check for existing record
        MaterialCategory extByMat_category_1 = materialCategoryDao.findByName(material_category.getName());
        MaterialCategory extByMat_category_2 = materialCategoryDao.findByName(material_category.getName().toLowerCase());
        MaterialCategory extByMat_category_3 = materialCategoryDao.findByName(material_category.getName().toUpperCase());
        if((extByMat_category_1!=null)||(extByMat_category_2!=null)||(extByMat_category_3!=null)){
            return "Material Category already exist..!";
        }
        try {
            materialCategoryDao.save(material_category);
            return "OK";
        }catch (Exception e){
            return "Save not Completed : " + e.getMessage();
        }
    }

    @GetMapping(value = "/material", produces = "application/json")
    public ModelAndView getMaterialView() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Material");
        if (!loggedUserPrivilege.getSel_privi()) {
            ModelAndView materialModelAndViewError = new ModelAndView();
            materialModelAndViewError.setViewName("error.html");
            return materialModelAndViewError;
        } else {
            ModelAndView materailModelAndView = new ModelAndView();
            materailModelAndView.addObject("title", "Material Management");
            materailModelAndView.addObject("navbartitle", "MATERIAL MANAGEMENT MODULE");
            materailModelAndView.addObject("loggeduser", auth.getName());
            materailModelAndView.setViewName("material.html");
            return materailModelAndView;
        }
    }

    @PostMapping(value = "/material")
    public String postMappingEmployee(@RequestBody Material material) {
        // Authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Material");
        if (!loggedUserPrivilege.getIns_privi()) {
            return "Save did not completed : You dont have the privilege";
        }
        Material extMaterialByName = materialDao.getByName(material.getName());
        if (extMaterialByName != null) {
            return "Given name is already exist as a material.";
        }
        //decim
        //BigDecimal.compareTo(BigDecimal) output values -1,0,+1
        if (material.getMaterial_status_id().equals(materialStatusDao.getReferenceById(1))) {
            if (material.getCurrent_unit_stock() == null) {
                return "Material Status cannot be 'In-Stock' without valid Current Unit Stock";
            }
        } else {
            if ((material.getCurrent_unit_stock().compareTo(BigDecimal.ZERO) > 0)) {
                return "Material Status cannot be 'Out-Of-Stock' or 'Deleted' without valid Current Unit Stock";
            }
        }
        try {
            String nextMatNo = materialDao.getNextMaterialNo();
            if (nextMatNo == null || nextMatNo.equals("")) {
                material.setMatno("M00001");
            } else {
                material.setMatno(nextMatNo);
            }
            if ((material.getCurrent_unit_stock().compareTo(BigDecimal.ZERO) == 0) || (material.getCurrent_unit_stock() == null)) {
                MaterialStatus materialStatusOutofStock = materialStatusDao.getReferenceById(2);
                material.setMaterial_status_id(materialStatusOutofStock);
                material.setCurrent_unit_stock(BigDecimal.ZERO);
            }
            material.setAdded_time(LocalDateTime.now());
            material.setLast_intake_date(LocalDateTime.now());
            material.setAdded_user_id(userDao.findByUsername(auth.getName()).getId());

            materialDao.save(material);

            Material savedMaterial = materialDao.getReferenceById(material.getId());
            if(savedMaterial.getCurrent_unit_stock().compareTo(BigDecimal.ZERO)>0){
                MaterialInventoryLog materialInventoryLog = new MaterialInventoryLog();
                materialInventoryLog.setMaterial_id(materialDao.getReferenceById(material.getId()));
                materialInventoryLog.setInventory_up(true);
                materialInventoryLog.setLogged_quantity(savedMaterial.getCurrent_unit_stock());
                materialInventoryLog.setBefore_log_quantity(BigDecimal.ZERO);
                materialInventoryLog.setAfter_log_quantity(savedMaterial.getCurrent_unit_stock());
                materialInventoryLog.setLogged_year(((LocalDateTime.now()).toString().split("T")[0].split("-")[0]));
                materialInventoryLog.setLogged_month(((LocalDateTime.now()).toString().split("T")[0].split("-")[1]));
                materialInventoryLog.setLogged_date(((LocalDateTime.now()).toString().split("T")[0].split("-")[2]));
                materialInventoryLog.setLogged_time(LocalDateTime.now());
                materialInventoryLog.setAdded_user_id(userDao.findByUsername(auth.getName()).getId());
                try {
                    materialInventoryLogDao.save(materialInventoryLog);
                }catch (Exception e){
                    System.out.println("Material Log Update Failed : "+e.getMessage());
                }
            }


            return "OK";
        } catch (Exception e) {
            return "Save not Completed : " + e.getMessage();
        }
    }

    @DeleteMapping(value = "/material")
    public String deleteMappingMaterial(@RequestBody Material material) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Material");
        if (!loggedUserPrivilege.getDel_privi()) {
            return "You dont have the privilege to delete.";
        }

        //Checking for existing Material by material ID
        Material extMaterial = materialDao.getReferenceById(material.getId());
        if (extMaterial == null) {
            return "Material do not exist..!";
        }

        if ((extMaterial.getCurrent_unit_stock().compareTo(BigDecimal.ZERO) != 0)) {
            return "Material with Current Unit Stock cannot be deleted..!\n" + "Material Stock : " + extMaterial.getCurrent_unit_stock();
        }
        try {
            MaterialStatus materialStatusDeleted = materialStatusDao.getReferenceById(3);
            material.setMaterial_status_id(materialStatusDeleted);

            material.setDeleted_time(LocalDateTime.now());
            material.setDeleted_user_id(userDao.findByUsername(auth.getName()).getId());
            materialDao.save(material);
            return "OK";
        } catch (Exception e) {
            return "Delete Not Completed : " + e.getMessage();
        }

    }

    @PutMapping(value = "/material")
    public String putMappingMaterial(@RequestBody Material material) {
        Authentication authe = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(authe, "Material");
        if (!loggedUserPrivilege.getUpd_privi()) {
            return "You dont have the privilege to delete.";
        }
        //Checking for existing Material by material ID
        Material extMaterial = materialDao.getReferenceById(material.getId());
        if (extMaterial == null) {
            return "Delete not completed : Material do not exist..!";
        }
        if (material.getMaterial_status_id().equals(materialStatusDao.getReferenceById(1))) {
            if ((material.getCurrent_unit_stock().compareTo(BigDecimal.ZERO) == 0) || (material.getCurrent_unit_stock() == null)) {
                return "Material Status cannot be 'In-Stock' without valid Current Unit Stock";
            }
        } else if (material.getMaterial_status_id().equals(materialStatusDao.getReferenceById(4))) {
            if ((material.getCurrent_unit_stock().compareTo(material.getReorder_point()) > 0)) {
                return "Material Status cannot be 'Low-Stock' without Current Unit Stock being lower than ROP value.";
            }
        } else {
            if ((material.getCurrent_unit_stock().compareTo(BigDecimal.ZERO) > 0)) {
                return "Material Status cannot be 'Out-Of-Stock' or 'Deleted' without valid Current Unit Stock";
            }
        }

        try {

            //Checking if material unit price and profit percentage has changed, Compared to extMaterial profit percentage and unit price
            if ((extMaterial.getProfit_percentage().compareTo(material.getProfit_percentage()) != 0) || (extMaterial.getUnit_cost()).compareTo(material.getUnit_cost()) != 0) {
                //getting list of products with given material id
                List<Product> productsListByMatid = productDao.getProductListByMaterial(material.getId());
                //running for loop to do changes to those products
                for (Product productByMat : productsListByMatid) {
                    //correcting product has material records with new values from material
                    for (ProductHasMaterial phm : productByMat.getProductHasMaterialList()) {
                        //checking for material which has to be changed in the product has material table
                        if (phm.getMaterial_id().getId() == material.getId()) {
                            //setting values for product has material unit price and line price
                            phm.setMaterial_unit_price((material.getUnit_cost().multiply(material.getProfit_percentage().divide(new BigDecimal(100))).add(material.getUnit_cost())));
                            phm.setMaterial_line_price(((material.getUnit_cost().multiply(material.getProfit_percentage().divide(new BigDecimal(100))).add(material.getUnit_cost()))).multiply(phm.getReq_quantity()));
                        }
                    }
                    //creating a BigDecimal zero variable for product total price calculation..
                    BigDecimal productLineTotal = BigDecimal.ZERO;
                    for (ProductHasMaterial phasmat : productByMat.getProductHasMaterialList()) {
                        productLineTotal = productLineTotal.add(phasmat.getMaterial_line_price());
                        phasmat.setProduct_id(productByMat);
                    }
                    productByMat.setTotal_price(productLineTotal.add(productByMat.getService_charge()));
                    productDao.save(productByMat);
                }
            }

            material.setUpdated_time(LocalDateTime.now());
            material.setUpdated_user_id(userDao.findByUsername(authe.getName()).getId());
            materialDao.save(material);

            return "OK";
        } catch (Exception e) {
            return "Update Not Completed : " + e.getMessage();
        }
    }

    @PutMapping(value = "/materialroproqupdate")
    public String putMaterial(@RequestBody Material ropMaterial) {
        Authentication authe = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(authe, "Material");
        if (!loggedUserPrivilege.getUpd_privi()) {
            return "You dont have the privilege to delete.";
        }
        Material extMatInDB = materialDao.getReferenceById(ropMaterial.getId());
        if(extMatInDB==null){
            return "This material did not found in data base.";
        }

        try {
            ropMaterial.setUpdated_user_id(userDao.findByUsername(authe.getName()).getId());
            ropMaterial.setUpdated_time(LocalDateTime.now());
            ropMaterial.setCurrent_unit_stock(extMatInDB.getCurrent_unit_stock());
            if(ropMaterial.getCurrent_unit_stock().compareTo(ropMaterial.getReorder_point())>0){
                ropMaterial.setMaterial_status_id(materialStatusDao.getReferenceById(1));
            }
            if(ropMaterial.getCurrent_unit_stock().compareTo(ropMaterial.getReorder_point())<=0) {
                ropMaterial.setMaterial_status_id(materialStatusDao.getReferenceById(4));
            }
            if(ropMaterial.getCurrent_unit_stock().compareTo(BigDecimal.ZERO)==0) {
                ropMaterial.setMaterial_status_id(materialStatusDao.getReferenceById(2));
            }
            materialDao.save(ropMaterial);

            return "OK";
        } catch (Exception e) {
            return "Update Not Completed : " + e.getMessage();
        }
    }

    @PutMapping(value = "/materialinventorydown")
    public String putMaterialDownIn(@RequestBody Material matinvetoryDown) {
        Authentication authe = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(authe, "Material");
        if (!loggedUserPrivilege.getUpd_privi()) {
            return "You dont have the privilege to edit.";
        }
        Material extMatInDB = materialDao.getReferenceById(matinvetoryDown.getId());
        if(extMatInDB==null){
            return "This material did not found in data base.";
        }

        try {
            matinvetoryDown.setUpdated_user_id(userDao.findByUsername(authe.getName()).getId());
            matinvetoryDown.setUpdated_time(LocalDateTime.now());
            if(matinvetoryDown.getCurrent_unit_stock().compareTo(extMatInDB.getReorder_point())>0){
                matinvetoryDown.setMaterial_status_id(materialStatusDao.getReferenceById(1));
            }
            if(matinvetoryDown.getCurrent_unit_stock().compareTo(BigDecimal.ZERO)==0) {
                matinvetoryDown.setMaterial_status_id(materialStatusDao.getReferenceById(2));
            }else {
                matinvetoryDown.setMaterial_status_id(materialStatusDao.getReferenceById(4));
            }

            materialDao.save(matinvetoryDown);

            return "OK";
        } catch (Exception e) {
            return "Update Not Completed : " + e.getMessage();
        }
    }

    @GetMapping(value = "/materialinventorydown", produces = "application/json")
    public ModelAndView getInvetoryDownMaterialView() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Material");
        if (!loggedUserPrivilege.getSel_privi()) {
            ModelAndView materialModelAndViewError = new ModelAndView();
            materialModelAndViewError.setViewName("error.html");
            return materialModelAndViewError;
        } else {
            ModelAndView materailModelAndView = new ModelAndView();
            materailModelAndView.addObject("title", "Material Inventory Down Management");
            materailModelAndView.addObject("navbartitle", "MATERIAL INVENTORY DOWN MANAGEMENT MODULE");
            materailModelAndView.addObject("loggeduser", auth.getName());
            materailModelAndView.setViewName("materialinventorydown.html");
            return materailModelAndView;
        }
    }
}

