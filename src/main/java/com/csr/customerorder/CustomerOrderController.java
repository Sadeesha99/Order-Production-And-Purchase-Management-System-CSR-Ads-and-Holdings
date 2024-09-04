package com.csr.customerorder;

import com.csr.customerorderpayment.*;
import com.csr.design.*;
import com.csr.privilege.Privilege;
import com.csr.privilege.PrivilegeController;
import com.csr.product.ProductHasMaterial;
import com.csr.production.*;
import com.csr.transaction.TransactionLog;
import com.csr.transaction.TransactionLogDao;
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
public class CustomerOrderController {

    @Autowired
    private PrivilegeController privilegeController;
    @Autowired
    private CustomerOrderDao customerOrderDao;
    @Autowired
    private DesignDao designDao;
    @Autowired
    private DesignStatusDao designStatusDao;
    @Autowired
    private CustomerOrderStatusDao customerOrderStatusDao;
    @Autowired
    private DesignController designController;
    @Autowired
    private UserDao userDao;
    @Autowired
    private CustomerOrderPaymentController customerOrderPaymentController;
    @Autowired
    private CustomerOrderPaymentStatusDao customerOrderPaymentStatusDao;
    @Autowired
    private CustomerOrderPaymentDao customerOrderPaymentDao;

    @Autowired
    private ProductionController productionController;
    @Autowired
    private ProductionStatusDao productionStatusDao;
    @Autowired
    private ProductionDao productionDao;

    @Autowired
    private TransactionLogDao transactionLogDao;


    @GetMapping(value = "/customerorder/findall", produces = "application/json")
    public List<CustomerOrder> getALLCustomerOrders() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "CustomerOrder");
        if (!loggedUserPrivilege.getSel_privi()) {
            return new ArrayList<>();
        }
        return customerOrderDao.findAll();
    }

    @GetMapping(value = "/customerorder/queued/list", produces = "application/json")
    public List<CustomerOrder> getAllQueued() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "CustomerOrder");
        if (!loggedUserPrivilege.getSel_privi()) {
            return new ArrayList<>();
        }
        return customerOrderDao.getAllQueuedCustomerOrder();
    }

    @GetMapping(value = "/customerorder/onproduction/list", produces = "application/json")
    public List<CustomerOrder> getAllOnProduction() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "CustomerOrder");
        if (!loggedUserPrivilege.getSel_privi()) {
            return new ArrayList<>();
        }
        return customerOrderDao.getAllOnProductionCustomerOrder();
    }
    @GetMapping(value = "/customerorder/ready/list", produces = "application/json")
    public List<CustomerOrder> getAllReady() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "CustomerOrder");
        if (!loggedUserPrivilege.getSel_privi()) {
            return new ArrayList<>();
        }
        return customerOrderDao.getAllReadyCustomerOrder();
    }
    @GetMapping(value = "/customerorder/completed/list", produces = "application/json")
    public List<CustomerOrder> getAllCompleted() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "CustomerOrder");
        if (!loggedUserPrivilege.getSel_privi()) {
            return new ArrayList<>();
        }
        return customerOrderDao.getAllCompletedCustomerOrder();
    }

    @GetMapping(value = "/customerorder/canceled/list", produces = "application/json")
    public List<CustomerOrder> getAllCanceled() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "CustomerOrder");
        if (!loggedUserPrivilege.getSel_privi()) {
            return new ArrayList<>();
        }
        return customerOrderDao.getAllCanceledCustomerOrder();
    }




    @GetMapping(value = "/customerorder/status/findall", produces = "application/json")
    public List<CustomerOrderStatus> getALLCustomerOrderStatus() {
        return customerOrderStatusDao.findAll();
    }
    @GetMapping(value = "/customerorder/bycorderno/{corderno}", produces = "application/json")
    public CustomerOrder  getCustomerOrderByCOrderNo(@PathVariable("corderno") String corderno) {
        return customerOrderDao.findByOrderno(corderno);
    }

    @GetMapping(value = "/customerorder/bycid/{id}", produces = "application/json")
    public List<CustomerOrder>  getCustomerOrdersByCustomerID(@PathVariable("id") Integer id) {
        return customerOrderDao.getOrdersCustomerID(id);
    }


    @GetMapping(value = "/customerorder")
    public ModelAndView customerOrderUI() {

        //Authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "CustomerOrder");
        if (!loggedUserPrivilege.getSel_privi()) {
            ModelAndView customerOrderModelAndViewError = new ModelAndView();
            customerOrderModelAndViewError.setViewName("error.html");
            return customerOrderModelAndViewError;
        } else {
            ModelAndView customerOrderModelAndView = new ModelAndView();
            customerOrderModelAndView.addObject("title", "Customer Order Management");
            customerOrderModelAndView.addObject("navbartitle", "CUSTOMER ORDER MANAGEMENT MODULE");
            customerOrderModelAndView.addObject("loggeduser", auth.getName());
            customerOrderModelAndView.setViewName("customerorder.html");
            return customerOrderModelAndView;
        }
    }


    @PostMapping(value = "/customerorder")
    @Transactional
    public String customerOrderInsert(@RequestBody CustomerOrder customerOrder) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "CustomerOrder");
        if (!loggedUserPrivilege.getIns_privi()) {
            return "Customer Order was  not submitted : You dont have the privilege";
        }
        if (customerOrder.getFirst_payment() == null) {
            return "Customer Order was not submitted : Every order must have an advanced payment";
        }
        try {
            String nextOrderNo = getNextInvoiceNo();
            customerOrder.setOrderno(nextOrderNo);
            customerOrder.setAdded_time(LocalDateTime.now());
            customerOrder.setAdded_user_id(userDao.findByUsername(auth.getName()).getId());

            for (CustomerOrderHasProduct cohasp : customerOrder.getCustomerOrderHasProductList()) {
                String nextDesignNo = designController.getNextDesignNo();
                if (cohasp.isDesignEmpty()) {
                    cohasp.setDesign_id(null);
                    //System.out.println("No Design");
                } else if (cohasp.isDesignIdEmpty() == true && cohasp.isDesignFileEmpty() != true) {
                    //System.out.println("New Design");
                    //If there is no existing design for this cohasp but there is a file included.
                    //Creating a new design
                    try {
                        Design newDesignEntry = new Design();
                        newDesignEntry.setDesignno(nextDesignNo);
                        newDesignEntry.setName(nextOrderNo);
                        newDesignEntry.setCharges(BigDecimal.ZERO);
                        newDesignEntry.setAdded_time(LocalDateTime.now());
                        newDesignEntry.setAdded_user_id(userDao.findByUsername(auth.getName()).getId());
                        newDesignEntry.setDesign_file(cohasp.getDesign_id().getDesign_file());
                        newDesignEntry.setNote("Design was provided by customer for orderno:" + nextOrderNo);
                        newDesignEntry.setDesign_status_id(designStatusDao.getReferenceById(2));
                        //System.out.println(newDesignEntry);
                        designDao.save(newDesignEntry);
                    } catch (Exception e) {
                        System.out.println("Design was not saved :" + e.getMessage());
                    }
                    //Setting newly saved design record to design_id in customer order has product
                    cohasp.setDesign_id(designDao.findByDesignno(nextDesignNo));
                }
                String nexProductionNo = productionController.getNextProductionNo();
                try {
                    //Creating new production record for this CustomerOrder has Product
                    Production newProductionEntry = new Production();
                    newProductionEntry.setProductionno(nexProductionNo);
                    newProductionEntry.setCorderno(nextOrderNo);
                    newProductionEntry.setProduct_id(cohasp.getProduct_id());
                    newProductionEntry.setTotal_quantity(cohasp.getQuantity());
                    newProductionEntry.setCurrent_quantity(BigDecimal.ZERO);
                    newProductionEntry.setCompleted_quantity(BigDecimal.ZERO);
                    newProductionEntry.setAdded_time(LocalDateTime.now());
                    newProductionEntry.setAdded_user_id(userDao.findByUsername(auth.getName()).getId());
                    ArrayList<ProductionHasMaterial> productionhasMaterial = new ArrayList<>();
                    for (ProductHasMaterial phasm : cohasp.getProduct_id().getProductHasMaterialList()) {
                        Boolean extMat = false;
                        int i;
                        //check and return true if this product has material is already exist in production has material array
                        for (i = 0; i < productionhasMaterial.size(); i++) {
                            if (productionhasMaterial.get(i).getMaterial_id().getId().equals(phasm.getMaterial_id().getId())) {
                                extMat = true;
                                break;
                            }
                        }
                        //if it exists up that material quantity else create new product has material and enter it to array
                        if (extMat) {
                            BigDecimal reqty = productionhasMaterial.get(i).getReq_quantity().add(phasm.getReq_quantity().multiply(cohasp.getQuantity()));
                            productionhasMaterial.get(i).setReq_quantity(reqty);
                        } else {
                            ProductionHasMaterial productionHasMaterial = new ProductionHasMaterial();
                            productionHasMaterial.setMaterial_id(phasm.getMaterial_id());
                            productionHasMaterial.setAvailable_quantity(phasm.getMaterial_id().getCurrent_unit_stock());
                            productionHasMaterial.setReq_quantity(phasm.getReq_quantity().multiply(cohasp.getQuantity()));
                            productionhasMaterial.add(productionHasMaterial);
                        }
                    }

                    newProductionEntry.setProductionHasMaterialList(productionhasMaterial);
                    //System.out.println(productionhasMaterial);
                    for (ProductionHasMaterial phasM : newProductionEntry.getProductionHasMaterialList()) {
                        phasM.setProduction_id(newProductionEntry);
                    }


                    newProductionEntry.setProduction_status_id(productionStatusDao.getReferenceById(1));
                    if (cohasp.isDesignEmpty() == false) {
                        newProductionEntry.setDesign_id(cohasp.getDesign_id());
                    } else {
                        newProductionEntry.setDesign_id(null);
                    }
                    //System.out.println(newProductionEntry);
                    productionDao.save(newProductionEntry);


                    cohasp.setCustomer_order_id(customerOrder);

                    //Setting newly saved production record to production_id in customer order has product
                    cohasp.setProduction_id(productionDao.findByProductionno(nexProductionNo));

                } catch (Exception e) {
                    System.out.println("Production was not saved :" + e.getMessage());
                }

            }
            try {
                customerOrderDao.save(customerOrder);
            } catch (Exception e) {
                System.out.println("Customer-Order was not saved :" + e.getMessage());
            }

            String nextPaymentNo = customerOrderPaymentController.getNextPaymentNo();

            try {
                CustomerOrderPayment customerOrderPayment = new CustomerOrderPayment();
                customerOrderPayment.setCustomer_order_id(customerOrderDao.findByOrderno(nextOrderNo));
                customerOrderPayment.setPaymentno(nextPaymentNo);
                customerOrderPayment.setAmount(customerOrder.getFirst_payment());
                customerOrderPayment.setPaid_total(customerOrder.getFirst_payment());
                customerOrderPayment.setRemaining_balance(customerOrder.getRemaining_balance());
                customerOrderPayment.setCustomer_order_payment_status_id(customerOrderPaymentStatusDao.getReferenceById(1));
                customerOrderPayment.setAdded_time(LocalDateTime.now());
                customerOrderPayment.setAdded_user_id(userDao.findByUsername(auth.getName()).getId());
                customerOrderPaymentDao.save(customerOrderPayment);
                CustomerOrderPayment savedPayment = customerOrderPaymentDao.findByPaymentno(nextPaymentNo);
                TransactionLog paymentTransactionLog = new TransactionLog();
                paymentTransactionLog.setCustomer_order_payment_id(savedPayment);
                paymentTransactionLog.setTransaction_amount(savedPayment.getAmount());
                paymentTransactionLog.setIncome_type(true);
                paymentTransactionLog.setLogged_year(((LocalDateTime.now()).toString().split("T")[0].split("-")[0]));
                paymentTransactionLog.setLogged_month(((LocalDateTime.now()).toString().split("T")[0].split("-")[1]));
                paymentTransactionLog.setLogged_date(((LocalDateTime.now()).toString().split("T")[0].split("-")[2]));
                paymentTransactionLog.setLogged_time(LocalDateTime.now());
                paymentTransactionLog.setAdded_user_id(userDao.findByUsername(auth.getName()).getId());
                transactionLogDao.save(paymentTransactionLog);

            } catch (Exception e) {
                System.out.println("Customer-Order-Payment was not saved :" + e.getMessage());
            }
            return "OK";

        } catch (Exception e) {
            return ("Full Error :" + e.getMessage());
        }

    }

    @DeleteMapping(value = "/customerorder")
    public String deleteCustomerOrder(@RequestBody CustomerOrder customerOrder){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "CustomerOrder");
        if (!loggedUserPrivilege.getDel_privi()) {
            return "Customer Order was  not Deleted : You dont have the privilege";
        }
        CustomerOrder extCustomerOrder = customerOrderDao.getReferenceById(customerOrder.getId());
        if(extCustomerOrder==null){
            return "This Customer-Order is not available..!";
        }
        try {
            List<CustomerOrderPayment> customerOrderPaymentsByOrderId = customerOrderPaymentDao.getPaymentsByCOrderId(customerOrder.getId());
            if(customerOrderPaymentsByOrderId.size()>0){
                for(CustomerOrderPayment cop : customerOrderPaymentsByOrderId){
                    if(cop.getCustomer_order_payment_status_id().equals(customerOrderPaymentStatusDao.getReferenceById(1))){
                        cop.setCustomer_order_payment_status_id(customerOrderPaymentStatusDao.getReferenceById(2));
                        cop.setUpdated_time(LocalDateTime.now());
                        cop.setUpdated_user_id(userDao.findByUsername(auth.getName()).getId());
                        customerOrderPaymentDao.save(cop);
                        TransactionLog paymentTransactionLog = new TransactionLog();
                        String currentDate = (LocalDateTime.now()).toString().split("T")[0];
                        paymentTransactionLog.setCustomer_order_payment_id(cop);
                        paymentTransactionLog.setTransaction_amount(cop.getAmount());
                        paymentTransactionLog.setIncome_type(false);
                        paymentTransactionLog.setLogged_year(currentDate.split("-")[0]);
                        paymentTransactionLog.setLogged_month(currentDate.split("-")[1]);
                        paymentTransactionLog.setLogged_date(currentDate.split("-")[2]);
                        paymentTransactionLog.setLogged_time(LocalDateTime.now());
                        paymentTransactionLog.setAdded_user_id(userDao.findByUsername(auth.getName()).getId());
                        transactionLogDao.save(paymentTransactionLog);
                    }
                }
            }
            List<Production> productionListByCorderNo = productionDao.getProductionByCorderNo(customerOrder.getOrderno());
            if(productionListByCorderNo.size()>0){
                for(Production ProfCo: productionListByCorderNo){
                    if(ProfCo.getProduction_status_id().equals(productionStatusDao.getReferenceById(1))){
                        ProfCo.setProduction_status_id(productionStatusDao.getReferenceById(5));
                        productionDao.save(ProfCo);
                    }else {
                        return "This order cannot be deleted it have passed to production..";
                    }
                }
            }
            List<Design> designListByDesignName = designDao.designListByDesignName(customerOrder.getOrderno());
            if(designListByDesignName.size()>0){
                for(Design dbyINVno : designListByDesignName){
                    dbyINVno.setDesign_status_id(designStatusDao.getReferenceById(3));
                    designDao.save(dbyINVno);
                }
            }
            if(customerOrder.getCustomer_order_status_id().equals(customerOrderStatusDao.getReferenceById(1))){
                customerOrder.setCustomer_order_status_id(customerOrderStatusDao.getReferenceById(5));
            }
            for(CustomerOrderHasProduct cohp: customerOrder.getCustomerOrderHasProductList()){
                cohp.setCustomer_order_id(customerOrder);
            }
            customerOrderDao.save(customerOrder);
            return "OK";
        }catch (Exception e){
            return ("Errors : "+e.getMessage());
        }
    }

    public String getNextInvoiceNo() {
        String nextNumber = customerOrderDao.nextInvoiceNumber();
        String currentMaxYearMonth = customerOrderDao.maxInvoiceNumber();
        String todayYear = ((LocalDateTime.now()).toString().split("T")[0].split("-")[0]).substring(2, 4);
        String todayMonth = (LocalDateTime.now()).toString().split("T")[0].split("-")[1];

        String todayYearMonth = todayYear.concat(todayMonth);

        String nextInvoiceNumber = null;

        if(nextNumber == null || currentMaxYearMonth ==null){
            nextInvoiceNumber = ("inv" + todayYearMonth + "0001");
        }else {
            if (Integer.parseInt(todayYearMonth) == Integer.parseInt(currentMaxYearMonth)) {
                nextInvoiceNumber = ("inv" + currentMaxYearMonth + nextNumber);
            } else if (Integer.parseInt(todayYearMonth) > Integer.parseInt(currentMaxYearMonth)) {
                nextInvoiceNumber = ("inv" + todayYearMonth + "0001");
            }
        }


        return nextInvoiceNumber;
    }

}