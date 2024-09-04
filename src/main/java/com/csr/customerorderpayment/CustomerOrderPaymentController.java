package com.csr.customerorderpayment;


import com.csr.customerorder.CustomerOrder;
import com.csr.customerorder.CustomerOrderDao;
import com.csr.customerorder.CustomerOrderHasProduct;
import com.csr.customerorder.CustomerOrderStatusDao;
import com.csr.privilege.Privilege;
import com.csr.privilege.PrivilegeController;
import com.csr.production.Production;
import com.csr.production.ProductionDao;
import com.csr.production.ProductionStatusDao;
import com.csr.transaction.TransactionLog;
import com.csr.transaction.TransactionLogDao;
import com.csr.user.UserDao;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
public class CustomerOrderPaymentController {
    @Autowired
    private CustomerOrderPaymentDao customerOrderPaymentDao;

    @Autowired
    private CustomerOrderDao customerOrderDao;

    @Autowired
    private CustomerOrderStatusDao customerOrderStatusDao;

    @Autowired
    private CustomerOrderPaymentStatusDao customerOrderPaymentStatusDao;

    @Autowired
    ProductionDao productionDao;
    @Autowired
    ProductionStatusDao productionStatusDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    TransactionLogDao transactionLogDao;

    @Autowired
    private PrivilegeController privilegeController;


    @GetMapping(value = "/customerorderpayment")
    public ModelAndView customerorderpaymentUI() {
        // Authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "CustomerOrderPayment");
        if (!loggedUserPrivilege.getSel_privi()) {
            ModelAndView cpaymentModelAndViewError = new ModelAndView();
            cpaymentModelAndViewError.setViewName("error.html");
            return cpaymentModelAndViewError;
        } else {
            ModelAndView cpaymentModelAndView = new ModelAndView();
            cpaymentModelAndView.addObject("title", "Customer Payment Management");
            cpaymentModelAndView.addObject("navbartitle", "CUSTOMER ORDER PAYMENT MANAGEMENT MODULE");
            cpaymentModelAndView.addObject("loggeduser", auth.getName());
            cpaymentModelAndView.setViewName("customerorderpayment.html");
            return cpaymentModelAndView;
        }
    }

    @GetMapping(value = "/customerorderpayment/byid/{id}", produces = "application/json")
    public List<CustomerOrderPayment> getCustomerOrder(@PathVariable("id") Integer id) {
        return customerOrderPaymentDao.getPaymentsByCOrderId(id);
    }


    @GetMapping(value = "/customerorderpayment/findall", produces = "application/json")
    public List<CustomerOrderPayment> getALLCustomerOrderPayments() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "CustomerOrderPayment");
        if (!loggedUserPrivilege.getSel_privi()) {
            return new ArrayList<>();
        }
        return customerOrderPaymentDao.findAll(Sort.by(Sort.Direction.DESC, "id"));
    }

    @PostMapping(value = "/customerorderpayment")
    @Transactional
    public String orderPaymentPost(@RequestBody CustomerOrderPayment corderpayment) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "CustomerOrderPayment");
        if (!loggedUserPrivilege.getIns_privi()) {
            return "Payment was  not successful : You dont have the privilege..!";
        }
        //get customer order from payment customer order
        CustomerOrder extCustomerOrder = customerOrderDao.getReferenceById(corderpayment.getCustomer_order_id().getId());
        if (extCustomerOrder == null) {
            return "Customer Order for this payment cannot be found..!";
        }
        if (corderpayment.getAmount() == null || corderpayment.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            return "Payment Amount is not valid..!";
        }
        try {
            //add payment added date and user
            corderpayment.setAdded_user_id(userDao.findByUsername(auth.getName()).getId());
            corderpayment.setAdded_time(LocalDateTime.now());
            //generate and set next payment no and set payment status
            String nextPaymentNo = getNextPaymentNo();
            corderpayment.setPaymentno(nextPaymentNo);
            corderpayment.setCustomer_order_payment_status_id(customerOrderPaymentStatusDao.getReferenceById(1));
            //get paid total
            BigDecimal paidTotal = (extCustomerOrder.getTotal_bill().subtract(extCustomerOrder.getRemaining_balance())).add(corderpayment.getAmount());
            BigDecimal remainingBalance = extCustomerOrder.getTotal_bill().subtract(paidTotal);
            corderpayment.setPaid_total(paidTotal);
            corderpayment.setRemaining_balance(remainingBalance);
            customerOrderPaymentDao.save(corderpayment);

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


            //Checking All production status related to this extCutomerOrder
            List<Production> productionListOfOrder = productionDao.getProductionByCorderNo(extCustomerOrder.getOrderno());
            Boolean productionAllDone = true;
            for (Production pListItem : productionListOfOrder) {
                if (pListItem.getProduction_status_id().getId() != 4) {
                    productionAllDone = false;
                    break;
                }
            }
            //Set remaining balance for customer order
            extCustomerOrder.setRemaining_balance(remainingBalance);

            if (remainingBalance.compareTo(BigDecimal.ZERO) == 0) {
                //order payment completed then check for order production
                if (productionAllDone) {
                    extCustomerOrder.setCustomer_order_status_id(customerOrderStatusDao.getReferenceById(4));
                } else {
                    extCustomerOrder.setCustomer_order_status_id(customerOrderStatusDao.getReferenceById(2));
                }
            } else if (remainingBalance.compareTo(BigDecimal.ZERO) > 0) {
                //order payment completed then check for order production
                if (productionAllDone) {
                    extCustomerOrder.setCustomer_order_status_id(customerOrderStatusDao.getReferenceById(3));
                } else {
                    extCustomerOrder.setCustomer_order_status_id(customerOrderStatusDao.getReferenceById(2));
                }
            }
            try {
                for (CustomerOrderHasProduct cohasp : extCustomerOrder.getCustomerOrderHasProductList()) {
                    cohasp.setCustomer_order_id(extCustomerOrder);
                }
                customerOrderDao.save(extCustomerOrder);
            } catch (Exception e) {
                System.out.println("Error in Order Update : " + e.getMessage());
            }

            return "OK";
        } catch (Exception e) {
            return ("Payment was not successful :" + e.getMessage());
        }
    }


    public String getNextPaymentNo() {
        String nextNumber = customerOrderPaymentDao.nextPaymentNumber();
        String currentMaxYearMonth = customerOrderPaymentDao.maxPaymentNumber();
        String todayYear = ((LocalDateTime.now()).toString().split("T")[0].split("-")[0]).substring(2, 4);
        String todayMonth = (LocalDateTime.now()).toString().split("T")[0].split("-")[1];
        String todayDay = (LocalDateTime.now()).toString().split("T")[0].split("-")[2];

        String todayYearMonthDay = todayYear.concat(todayMonth).concat(todayDay);

        String nextPaymentNo = null;

        if(nextNumber == null || currentMaxYearMonth ==null){
            nextPaymentNo = (todayYearMonthDay + "0001");
        }else {
            if (Integer.parseInt(todayYearMonthDay) == Integer.parseInt(currentMaxYearMonth)) {
                nextPaymentNo = (currentMaxYearMonth + nextNumber);
            } else if (Integer.parseInt(todayYearMonthDay) > Integer.parseInt(currentMaxYearMonth)) {
                nextPaymentNo = (todayYearMonthDay + "0001");
            }
        }
        return nextPaymentNo;
    }
}
