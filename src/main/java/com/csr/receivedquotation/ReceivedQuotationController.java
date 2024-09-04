package com.csr.receivedquotation;

import com.csr.privilege.Privilege;
import com.csr.privilege.PrivilegeController;
import com.csr.quotationrequest.QuotationRequest;
import com.csr.quotationrequest.QuotationRequestDao;
import com.csr.quotationrequest.QuotationRequestStatusDao;
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
public class ReceivedQuotationController {
    @Autowired
    private PrivilegeController privilegeController;
    @Autowired
    private ReceivedQuotationDao receivedQuotationDao;

    @Autowired
    private ReceivedQuotationStatusDao receivedQuotationStatusDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private QuotationRequestDao quotationRequestDao;

    @Autowired
    private QuotationRequestStatusDao quotationRequestStatusDao;



    @GetMapping(value = "/receivedquotation/findall", produces = "application/json")
    public List<ReceivedQuotation> getAllReceivedQuotation() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "ReceivedQuotation");
        if (!loggedUserPrivilege.getSel_privi()) {
            return new ArrayList<>();
        }
        List<ReceivedQuotation> validRQList = receivedQuotationDao.findAll();
        for(ReceivedQuotation elementRQ : validRQList){
            if(LocalDate.now().isAfter(elementRQ.getExpire_date())){
                for(ReceivedQuotationHasMaterial rqhasm : elementRQ.getReceivedQuotationHasMaterialList()){
                    rqhasm.setReceived_quotation_id(elementRQ);
                }
                receivedQuotationDao.save(elementRQ);
            }
        }
        return receivedQuotationDao.findAll();
    }
    @GetMapping(value = "/receivedquotation/valid", produces = "application/json")
    public List<ReceivedQuotation> getAllValidReceivedQuotation() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "ReceivedQuotation");
        if (!loggedUserPrivilege.getSel_privi()) {
            return new ArrayList<>();
        }
        List<ReceivedQuotation> validRQList = receivedQuotationDao.getValidRQList();
        for(ReceivedQuotation elementRQ : validRQList){
            if(LocalDate.now().isAfter(elementRQ.getExpire_date())){
                for(ReceivedQuotationHasMaterial rqhasm : elementRQ.getReceivedQuotationHasMaterialList()){
                    rqhasm.setReceived_quotation_id(elementRQ);
                }
                receivedQuotationDao.save(elementRQ);
            }
        }
        return receivedQuotationDao.getValidRQList();
    }
    @GetMapping(value = "/receivedquotation/invalid", produces = "application/json")
    public List<ReceivedQuotation> getAllInValidReceivedQuotation() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "ReceivedQuotation");
        if (!loggedUserPrivilege.getSel_privi()) {
            return new ArrayList<>();
        }
        return receivedQuotationDao.getInValidRQList();
    }

    @GetMapping(value = "/receivedquotation/status", produces = "application/json")
    public List<ReceivedQuotationStatus> getAllReceivedQuotationStatus(){
        return receivedQuotationStatusDao.findAll();
    }

    @GetMapping(value = "/receivedquotation")
    public ModelAndView receivedQuotationUI() {
        // Authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "ReceivedQuotation");
        if (!loggedUserPrivilege.getSel_privi()) {
            ModelAndView receivedQuotationModelAndViewError = new ModelAndView();
            receivedQuotationModelAndViewError.setViewName("error.html");
            return receivedQuotationModelAndViewError;
        } else {
            ModelAndView receivedQuotationModelAndView = new ModelAndView();
            receivedQuotationModelAndView.addObject("title", "Received Quotation Management");
            receivedQuotationModelAndView.addObject("navbartitle", "RECEIVED QUOTATION MANAGEMENT MODULE");
            receivedQuotationModelAndView.addObject("loggeduser", auth.getName());
            receivedQuotationModelAndView.setViewName("receivedquotation.html");
            return receivedQuotationModelAndView;
        }
    }

    @PostMapping(value = "/receivedquotation")
    @Transactional
    public String postReceivedQuotation(@RequestBody ReceivedQuotation receivedQuotation) {
        // Authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "ReceivedQuotation");
        if (!loggedUserPrivilege.getIns_privi()) {
            return "Submit did not completed : You dont have the privilege";
        }
        List<ReceivedQuotation> rqListByQRid = receivedQuotationDao.getRQListByQR(receivedQuotation.getQuotation_request_id().getId());
        if (rqListByQRid.size() != 0) {
            return "Submit did not completed : This Quotation Request already have an active quotation..";
        }

        try {
            String nextReceivedQuotationNo = receivedQuotationDao.getNxtRQNo();
            if (nextReceivedQuotationNo==null || nextReceivedQuotationNo.equals("")) {
                receivedQuotation.setReceived_quot_no("RQ00001");
            } else {
                receivedQuotation.setReceived_quot_no(nextReceivedQuotationNo);
            }

            receivedQuotation.setAdded_time(LocalDateTime.now());
            receivedQuotation.setAdded_user_id(userDao.findByUsername(auth.getName()).getId());
            for(ReceivedQuotationHasMaterial rqhasm : receivedQuotation.getReceivedQuotationHasMaterialList()){
                rqhasm.setReceived_quotation_id(receivedQuotation);
            }
            receivedQuotationDao.save(receivedQuotation);

            QuotationRequest quotationRequestOfRQ = quotationRequestDao.getReferenceById(receivedQuotation.getQuotation_request_id().getId());
            quotationRequestOfRQ.setUpdated_time(LocalDateTime.now());
            quotationRequestOfRQ.setUpdated_user_id(userDao.findByUsername(auth.getName()).getId());
            quotationRequestOfRQ.setQuotation_request_status_id(quotationRequestStatusDao.getReferenceById(2));
            quotationRequestDao.save(quotationRequestOfRQ);

            return "OK";
        } catch (Exception e) {
            return "Submit not Completed : " + e.getMessage();
        }
    }

    @DeleteMapping(value = "/receivedquotation")
    @Transactional
    public String delReceivedQuotation(@RequestBody ReceivedQuotation receivedQuotationDel) {
        // Authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "ReceivedQuotation");
        if (!loggedUserPrivilege.getDel_privi()) {
            return "Cancel did not completed : You dont have the privilege";
        }

        try {
            receivedQuotationDel.setDeleted_time(LocalDateTime.now());
            receivedQuotationDel.setDeleted_user_id(userDao.findByUsername(auth.getName()).getId());
            for(ReceivedQuotationHasMaterial recquohasM : receivedQuotationDel.getReceivedQuotationHasMaterialList()){
                recquohasM.setReceived_quotation_id(receivedQuotationDel);
            }
            receivedQuotationDel.setReceived_quotation_status_id(receivedQuotationStatusDao.getReferenceById(2));
            receivedQuotationDao.save(receivedQuotationDel);

            QuotationRequest quotationRequestByDelRQ = quotationRequestDao.getReferenceById(receivedQuotationDel.getQuotation_request_id().getId());
            quotationRequestByDelRQ.setUpdated_time(LocalDateTime.now());
            quotationRequestByDelRQ.setUpdated_user_id(userDao.findByUsername(auth.getName()).getId());
            List<QuotationRequest> requestedQRListBySupplier = quotationRequestDao.getRequestQRListBySupplier(quotationRequestByDelRQ.getSupplier_id().getId());
            if(requestedQRListBySupplier.size()==0){
                quotationRequestByDelRQ.setQuotation_request_status_id(quotationRequestStatusDao.getReferenceById(2));
            }else{
                quotationRequestByDelRQ.setQuotation_request_status_id(quotationRequestStatusDao.getReferenceById(3));
            }
            quotationRequestDao.save(quotationRequestByDelRQ);

            return "OK";

        } catch (Exception e) {
            return "Cancel not Completed : " + e.getMessage();
        }
    }
}
