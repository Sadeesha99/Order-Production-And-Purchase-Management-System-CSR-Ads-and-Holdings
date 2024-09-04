package com.csr.supplierpayment;

import com.csr.mrn.MaterialReceivedNote;
import com.csr.mrn.MaterialReceivedNoteDao;
import com.csr.mrn.MaterialReceivedNoteHasMaterial;
import com.csr.mrn.MaterialReceivedNoteStatusDao;
import com.csr.privilege.Privilege;
import com.csr.privilege.PrivilegeController;
import com.csr.purchaseorder.PurchaseOrder;
import com.csr.supplier.Supplier;
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
public class SupplierPaymentController {

    @Autowired
    private SupplierPaymentDao supplierPaymentDao;

    @Autowired
    private PrivilegeController privilegeController;

    @Autowired
    private MaterialReceivedNoteDao materialReceivedNoteDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private TransactionLogDao transactionLogDao;

    @Autowired
    private MaterialReceivedNoteStatusDao materialReceivedNoteStatusDao;




    @GetMapping(value = "/supplierpayment/findall", produces = "application/json")
    public List<SupplierPayment> getAllPurchaseOrder() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "SupplierPayment");
        if (!loggedUserPrivilege.getSel_privi()) {
            return new ArrayList<>();
        }
        return supplierPaymentDao.findAll();
    }

    @GetMapping(value = "/supplierpayment/supplierlist", produces = "application/json")
    public List<Supplier> getSupplierHaveToPay(){
        return supplierPaymentDao.getListValidToSupplierPayment();
    }

    @GetMapping(value = "/supplierpayment/mrnlistbysupid/{id}", produces = "application/json")
    public List<MaterialReceivedNote> getMRNsHaveToPay(@PathVariable("id") Integer id){
        return supplierPaymentDao.getListValidMRNToSupplierPayment(id);
    }

    @GetMapping(value = "/supplierpayment")
    public ModelAndView supplierPaymentUI() {
        // Authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "SupplierPayment");
        if (!loggedUserPrivilege.getSel_privi()) {
            ModelAndView supplierPaymentModelAndViewError = new ModelAndView();
            supplierPaymentModelAndViewError.setViewName("error.html");
            return supplierPaymentModelAndViewError;
        } else {
            ModelAndView supplierPaymentModelAndView = new ModelAndView();
            supplierPaymentModelAndView.addObject("title", "Supplier Payment Management");
            supplierPaymentModelAndView.addObject("navbartitle", "SUPPLIER PAYMENT MANAGEMENT MODULE");
            supplierPaymentModelAndView.addObject("loggeduser", auth.getName());
            supplierPaymentModelAndView.setViewName("supplierpayment.html");
            return supplierPaymentModelAndView;
        }
    }



    @PostMapping(value = "/supplierpayment")
    @Transactional
    public String postSupplierPayment(@RequestBody SupplierPayment supplierPayment){
        // Authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "SupplierPayment");
        if (!loggedUserPrivilege.getIns_privi()) {
            return "Submit did not completed : You dont have the privilege";
        }
        MaterialReceivedNote extMRN = materialReceivedNoteDao.getReferenceById(supplierPayment.getMaterial_received_note_id().getId());
        if(extMRN==null){
            return "MRN for this payment cannot be found..!";
        }
        if (supplierPayment.getAmount() == null || supplierPayment.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            return "Payment Amount is not valid..!";
        }
        try {
            //Set supplier payment number added time added user
            supplierPayment.setSupplier_paymentno(getNextSupplierPaymentNo());
            supplierPayment.setAdded_time(LocalDateTime.now());
            supplierPayment.setAdded_user_id(userDao.findByUsername(auth.getName()).getId());

            //Calculate Paid Total and Remaining Balance
            BigDecimal paidTotal = extMRN.getPaid_amount().add(supplierPayment.getAmount());
            BigDecimal remainingBalance = extMRN.getTotal_bill().subtract(paidTotal);

            //Set Paid Total and Remaining Balance for supplier payment and save payment
            supplierPayment.setRemaining_balance(remainingBalance);
            supplierPayment.setPaid_amount(paidTotal);
            supplierPaymentDao.save(supplierPayment);

            //Create new transaction log and set values for it and save
            TransactionLog supplierPaymentLog = new TransactionLog();
            supplierPaymentLog.setTransaction_amount(supplierPayment.getAmount());
            supplierPaymentLog.setIncome_type(false);
            supplierPaymentLog.setSupplier_payment_id(supplierPayment);
            supplierPaymentLog.setAdded_user_id(userDao.findByUsername(auth.getName()).getId());
            supplierPaymentLog.setLogged_year(((LocalDateTime.now()).toString().split("T")[0].split("-")[0]));
            supplierPaymentLog.setLogged_month(((LocalDateTime.now()).toString().split("T")[0].split("-")[1]));
            supplierPaymentLog.setLogged_date(((LocalDateTime.now()).toString().split("T")[0].split("-")[2]));
            supplierPaymentLog.setLogged_time(LocalDateTime.now());
            transactionLogDao.save(supplierPaymentLog);

            //set extMRN paid total and set mrn status corresponding to remaining balance and save mrn
            extMRN.setPaid_amount(paidTotal);
            if(remainingBalance.compareTo(BigDecimal.ZERO)==0){
                extMRN.setMrn_status_id(materialReceivedNoteStatusDao.getReferenceById(3));
            } else if (remainingBalance.compareTo(BigDecimal.ZERO)>0) {
                extMRN.setMrn_status_id(materialReceivedNoteStatusDao.getReferenceById(2));
            }
            for(MaterialReceivedNoteHasMaterial mrnHasM: extMRN.getMaterialReceivedNoteHasMaterialList()){
                mrnHasM.setMaterial_received_note_id(extMRN);
            }
            materialReceivedNoteDao.save(extMRN);


            return "OK";
        }catch (Exception e){
            return "Supplier Payment did not submitted." + (e.getMessage());
        }
    }


    public String getNextSupplierPaymentNo() {
        String nextNumber = supplierPaymentDao.nextSupplierPaymentNumber();
        String currentMaxYearMonth = supplierPaymentDao.maxSupplierPaymentNumber();
        String todayYear = ((LocalDateTime.now()).toString().split("T")[0].split("-")[0]).substring(2, 4);
        String todayMonth = (LocalDateTime.now()).toString().split("T")[0].split("-")[1];

        String todayYearMonth = todayYear.concat(todayMonth);

        String nextSupplierNumber = null;

        if(nextNumber == null || currentMaxYearMonth ==null){
            nextSupplierNumber = ("SP" + todayYearMonth + "001");
        }else {
            if (Integer.parseInt(todayYearMonth) == Integer.parseInt(currentMaxYearMonth)) {
                nextSupplierNumber = ("SP" + currentMaxYearMonth + nextNumber);
            } else if (Integer.parseInt(todayYearMonth) > Integer.parseInt(currentMaxYearMonth)) {
                nextSupplierNumber = ("SP" + todayYearMonth + "001");
            }
        }
        return nextSupplierNumber;
    }

}
