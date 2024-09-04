package com.csr.production;

import com.csr.customerorder.CustomerOrder;
import com.csr.customerorder.CustomerOrderDao;
import com.csr.customerorder.CustomerOrderHasProduct;
import com.csr.customerorder.CustomerOrderStatusDao;
import com.csr.material.*;
import com.csr.privilege.Privilege;
import com.csr.privilege.PrivilegeController;
import com.csr.product.ProductHasMaterial;
import com.csr.user.UserDao;
import jakarta.transaction.Transactional;
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
public class ProductionController {

    @Autowired
    private ProductionDao productionDao;

    @Autowired
    private ProductionLogDao productionLogDao;

    @Autowired
    private CustomerOrderDao customerOrderDao;

    @Autowired
    private ProductionStatusDao productionStatusDao;

    @Autowired
    private PrivilegeController privilegeController;

    @Autowired
    private UserDao userDao;

    @Autowired
    private CustomerOrderStatusDao customerOrderStatusDao;

    @Autowired
    private MaterialDao materialDao;

    @Autowired
    private MaterialStatusDao materialStatusDao;

    @Autowired
    private MaterialInventoryLogDao materialInventoryLogDao;


    @GetMapping(value = "/production")
    public ModelAndView productionUI() {
        // Authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Production");
        if (!loggedUserPrivilege.getSel_privi()) {
            ModelAndView productionModelAndViewError = new ModelAndView();
            productionModelAndViewError.setViewName("error.html");
            return productionModelAndViewError;
        } else {
            ModelAndView productionModelAndView = new ModelAndView();
            productionModelAndView.addObject("title", "Production Management");
            productionModelAndView.addObject("navbartitle", "PRODUCTION MANAGEMENT MODULE");
            productionModelAndView.addObject("loggeduser", auth.getName());
            productionModelAndView.setViewName("production.html");
            return productionModelAndView;
        }
    }

    @GetMapping(value = "/production/findall", produces = "application/json")
    public List<Production> getAllProduction() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Production");
        if (!loggedUserPrivilege.getSel_privi()) {
            return new ArrayList<>();
        }
        return productionDao.findAll();
    }

    @GetMapping(value = "/production/waiting/findall", produces = "application/json")
    @Transactional
    public List<Production> getAllWaitingProduction() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Production");
        if (!loggedUserPrivilege.getSel_privi()) {
            return new ArrayList<>();
        }else {
            List<Production> productionWaitingList = productionDao.getAllWaitingProduction();
            for(Production pListHasP: productionWaitingList ){
                for (ProductionHasMaterial phasMList: pListHasP.getProductionHasMaterialList()){
                    phasMList.setProduction_id(pListHasP);
                    phasMList.setAvailable_quantity(materialDao.getReferenceById(phasMList.getMaterial_id().getId()).getCurrent_unit_stock());
                }
                productionDao.save(pListHasP);
            }
            return productionDao.getAllWaitingProduction();
        }
    }

    @GetMapping(value = "/production/confirmed/findall", produces = "application/json")
    public List<Production> getAllConfirmedProduction() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Production");
        if (!loggedUserPrivilege.getSel_privi()) {
            return new ArrayList<>();
        }else {
            List<Production> productionConfirmedList = productionDao.getAllConfirmedProduction();
            for(Production pListHasP: productionConfirmedList ){
                for (ProductionHasMaterial phasMList: pListHasP.getProductionHasMaterialList()){
                    phasMList.setProduction_id(pListHasP);
                    phasMList.setAvailable_quantity(materialDao.getReferenceById(phasMList.getMaterial_id().getId()).getCurrent_unit_stock());
                }
                productionDao.save(pListHasP);
            }
            return productionDao.getAllConfirmedProduction();
        }
    }

    @GetMapping(value = "/production/onproduction/findall", produces = "application/json")
    public List<Production> getAllOnProductionProduction() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Production");
        if (!loggedUserPrivilege.getSel_privi()) {
            return new ArrayList<>();
        }else {
            List<Production> productionOnProductionList = productionDao.getAllOnProductionProduction();
            for(Production pListHasP: productionOnProductionList ){
                for (ProductionHasMaterial phasMList: pListHasP.getProductionHasMaterialList()){
                    phasMList.setProduction_id(pListHasP);
                    phasMList.setAvailable_quantity(materialDao.getReferenceById(phasMList.getMaterial_id().getId()).getCurrent_unit_stock());
                }
                productionDao.save(pListHasP);
            }
            return productionDao.getAllOnProductionProduction();
        }
    }

    @GetMapping(value = "/production/ready/findall", produces = "application/json")
    public List<Production> getAllReadyProduction() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Production");
        if (!loggedUserPrivilege.getSel_privi()) {
            return new ArrayList<>();
        }else {
            List<Production> productionReadyList = productionDao.getAllReadyProduction();
            for(Production pListHasP: productionReadyList ){
                for (ProductionHasMaterial phasMList: pListHasP.getProductionHasMaterialList()){
                    phasMList.setProduction_id(pListHasP);
                    phasMList.setAvailable_quantity(materialDao.getReferenceById(phasMList.getMaterial_id().getId()).getCurrent_unit_stock());
                }
                productionDao.save(pListHasP);
            }
            return productionDao.getAllReadyProduction();
        }
    }

    @GetMapping(value = "/production/cancel/findall", produces = "application/json")
    public List<Production> getAllCanceledProduction() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Production");
        if (!loggedUserPrivilege.getSel_privi()) {
            return new ArrayList<>();
        }else {
            List<Production> productionCancelList = productionDao.getAllCanceledProduction();
            for(Production pListHasP: productionCancelList ){
                for (ProductionHasMaterial phasMList: pListHasP.getProductionHasMaterialList()){
                    phasMList.setProduction_id(pListHasP);
                    phasMList.setAvailable_quantity(materialDao.getReferenceById(phasMList.getMaterial_id().getId()).getCurrent_unit_stock());
                }
                productionDao.save(pListHasP);
            }
            return productionDao.getAllCanceledProduction();
        }
    }

    @GetMapping(value = "/production/status/list", produces = "application/json")
    public List<ProductionStatus> getAllPStatus() {
        return productionStatusDao.findAll();
    }

    @GetMapping(value = "/getdatebyinvno/{no}", produces = "application/json")
    public CustomerOrder getOrderByNO(@PathVariable("no") String no) {
        CustomerOrder getOrderByNO = customerOrderDao.findByOrderno(no);
        return getOrderByNO;
    }

    @GetMapping(value = "/production/bycorderno/{orderno}", produces = "application/json")
    public List<Production> getProductionListByCorderNO(@PathVariable("orderno") String orderno) {
        return productionDao.getProductionByCorderNo(orderno);
    }

    @PutMapping(value = "/confirmproduction")
    public String putProductionConfirm(@RequestBody Production production) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Production");
        if (!loggedUserPrivilege.getUpd_privi()) {
            return "Delete was not successful : You dont have the privilege";
        }
        Production extProduction = productionDao.getReferenceById(production.getId());
        if (extProduction == null) {
            return "This production does not exist in database..!";
        }
        if (extProduction.getProduction_status_id().getId() != 1) {
            return "This production is not it the waiting state, So it cannot be confirmed again..!";
        }
        try {
            production.setProduction_status_id(productionStatusDao.getReferenceById(2));
            production.setUpdated_time(LocalDateTime.now());
            production.setUpdated_user_id(userDao.findByUsername(auth.getName()).getId());
            for (ProductionHasMaterial pham : production.getProductionHasMaterialList()) {
                pham.setProduction_id(production);
            }
            productionDao.save(production);
            return "OK";
        } catch (Exception e) {
            return ("Save could not complete : " + e.getMessage());
        }
    }

    @PutMapping(value = "/production")
    @Transactional
    public String putProduction(@RequestBody Production production) {
        //check for privileges
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Production");
        if (!loggedUserPrivilege.getUpd_privi()) {
            return "Delete was not successful : You dont have the privilege";
        }
        //check is production available in database
        Production extProduction = productionDao.getReferenceById(production.getId());
        if (extProduction == null) {
            return "This production does not exist in database..!";
        }
        //getting maximum quantity of production can happen and compare it with currently happened production
        BigDecimal maxCurrentQuantity = extProduction.getTotal_quantity().subtract(extProduction.getCompleted_quantity());
        BigDecimal currentQuantity = new BigDecimal((production.getCurrent_quantity()).toString());
        if (currentQuantity.compareTo(maxCurrentQuantity) > 0) {
            return "This Quantity cannot be right..!";
        }

        //Create a production log and add related data for it
        ProductionLog productionLog = new ProductionLog();
        productionLog.setProduction_quantity(production.getCurrent_quantity());
        productionLog.setBefore_log_quantity(extProduction.getCompleted_quantity());
        productionLog.setAfter_log_quantity(extProduction.getCompleted_quantity().add(production.getCurrent_quantity()));
        productionLog.setLogged_year(((LocalDateTime.now()).toString().split("T")[0].split("-")[0]));
        productionLog.setLogged_month(((LocalDateTime.now()).toString().split("T")[0].split("-")[1]));
        productionLog.setLogged_date(((LocalDateTime.now()).toString().split("T")[0].split("-")[2]));
        productionLog.setLogged_time(LocalDateTime.now());
        productionLog.setAdded_user_id(userDao.findByUsername(auth.getName()).getId());

        //Try updating production record
        try {
            production.setUpdated_time(LocalDateTime.now());
            production.setUpdated_user_id(userDao.findByUsername(auth.getName()).getId());


            //compare production quantity and set relavent status
            if (currentQuantity.compareTo(maxCurrentQuantity) == 0) {
                production.setProduction_status_id(productionStatusDao.getReferenceById(4));
                production.setCompleted_quantity(extProduction.getTotal_quantity());
                production.setCurrent_quantity(BigDecimal.ZERO);
            }
            if (currentQuantity.compareTo(maxCurrentQuantity) < 0) {
                production.setProduction_status_id(productionStatusDao.getReferenceById(3));
                production.setCompleted_quantity(extProduction.getCompleted_quantity().add(production.getCurrent_quantity()));
                production.setCurrent_quantity(BigDecimal.ZERO);
            }

            for (ProductionHasMaterial pham : production.getProductionHasMaterialList()) {
                pham.setProduction_id(production);
                pham.setAvailable_quantity(materialDao.getReferenceById(pham.getMaterial_id().getId()).getCurrent_unit_stock());

                BigDecimal remainingProductionQuantity = production.getTotal_quantity().subtract(production.getCompleted_quantity());
                for(ProductHasMaterial productHasMat : production.getProduct_id().getProductHasMaterialList()){
                    if(productHasMat.getMaterial_id().equals(pham.getMaterial_id())){
                        BigDecimal newReq_MatQuantity = remainingProductionQuantity.multiply(productHasMat.getReq_quantity());
                        pham.setReq_quantity(newReq_MatQuantity);
                    }
                }

            }

            productionDao.save(production);

            //Taking save object back from the database
            Production savedProduction = productionDao.getReferenceById(extProduction.getId());

            //Trying to save production log
            try {
                productionLog.setProduction_id(savedProduction);
                productionLogDao.save(productionLog);
            }catch (Exception e){
                System.out.println("Production Log did not saved : " + e.getMessage());
            }

            //list of productions with the same inv no as savedproduction
            List<Production> productionListByCOrder = productionDao.getProductionByCorderNo(savedProduction.getCorderno());
            //checking is any one of those productions are not in ready status.
            // If there is any production record under same inv number without completed production then corder cannot go to ready status
            Boolean isAllDone = true;
            for (Production productionRecord : productionListByCOrder) {
                if(productionRecord.getProduction_status_id().getId()!=4){
                    isAllDone = false;
                    break;
                }
            }
            //Create a new corder by corderno of production to update the corder status
            CustomerOrder cOrderOfProduction = customerOrderDao.findByOrderno(savedProduction.getCorderno());
            cOrderOfProduction.setUpdated_time(LocalDateTime.now());
            cOrderOfProduction.setUpdated_user_id(userDao.findByUsername(auth.getName()).getId());
            for(CustomerOrderHasProduct cohasp : cOrderOfProduction.getCustomerOrderHasProductList()){
                cohasp.setCustomer_order_id(cOrderOfProduction);
            }
            if(isAllDone){
                if(cOrderOfProduction.getRemaining_balance().compareTo(BigDecimal.ZERO)==0){
                    cOrderOfProduction.setCustomer_order_status_id(customerOrderStatusDao.getReferenceById(4));
                }else {
                    cOrderOfProduction.setCustomer_order_status_id(customerOrderStatusDao.getReferenceById(3));
                }
            }else{
                cOrderOfProduction.setCustomer_order_status_id(customerOrderStatusDao.getReferenceById(2));
            }
            try {
                customerOrderDao.save(cOrderOfProduction);
            }catch (Exception e){
                System.out.println("Error in Customer Order Update : "+e.getMessage());
            }

            //production material inventory management
            //get the list of material used in this production

            for(ProductHasMaterial phasM : savedProduction.getProduct_id().getProductHasMaterialList()){
                Material materialUsed = materialDao.getReferenceById(phasM.getMaterial_id().getId());
                BigDecimal availableInventory = materialUsed.getCurrent_unit_stock();
                BigDecimal usedInvetory = phasM.getReq_quantity().multiply(currentQuantity);
                BigDecimal newAvailableInventory = availableInventory.subtract(usedInvetory);

                try {
                    materialUsed.setCurrent_unit_stock(newAvailableInventory);
                    if(newAvailableInventory.compareTo(BigDecimal.ZERO)==0){
                        materialUsed.setMaterial_status_id(materialStatusDao.getReferenceById(2));
                    }else if(materialUsed.getReorder_point().compareTo(newAvailableInventory)>=0){
                        materialUsed.setMaterial_status_id(materialStatusDao.getReferenceById(4));
                    }else if(materialUsed.getReorder_point().compareTo(newAvailableInventory)<0){
                        materialUsed.setMaterial_status_id(materialStatusDao.getReferenceById(1));
                    }
                    materialDao.save(materialUsed);

                    MaterialInventoryLog materialInventoryLog = new MaterialInventoryLog();
                    materialInventoryLog.setMaterial_id(materialDao.getReferenceById(materialUsed.getId()));
                    materialInventoryLog.setInventory_up(false);
                    materialInventoryLog.setProduction_id(savedProduction);
                    materialInventoryLog.setLogged_quantity(usedInvetory);
                    materialInventoryLog.setBefore_log_quantity(availableInventory);
                    materialInventoryLog.setAfter_log_quantity(newAvailableInventory);
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


                }catch (Exception e){
                    System.out.println("Material Update Failed : "+e.getMessage());
                }

            }
            return "OK";

        } catch (Exception e) {
            return ("Save could not complete : " + e.getMessage());
        }
    }


    public String getNextProductionNo() {
        String nextNumber = productionDao.nextProductionNumber();
        String currentMaxYearMonth = productionDao.maxProductionNumber();
        String todayYear = ((LocalDateTime.now()).toString().split("T")[0].split("-")[0]).substring(2, 4);
        String todayMonth = (LocalDateTime.now()).toString().split("T")[0].split("-")[1];

        String todayYearMonth = todayYear.concat(todayMonth);

        String nextProductioNumber = null;
        if(nextNumber == null || currentMaxYearMonth ==null){
            nextProductioNumber = ("P" + todayYearMonth + "0001");
        }else {
            if (Integer.parseInt(todayYearMonth) == Integer.parseInt(currentMaxYearMonth)) {
                nextProductioNumber = ("P" + currentMaxYearMonth + nextNumber);
            } else if (Integer.parseInt(todayYearMonth) > Integer.parseInt(currentMaxYearMonth)) {
                nextProductioNumber = ("P" + todayYearMonth + "0001");
            }
        }
        return nextProductioNumber;
    }
}
