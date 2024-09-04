package com.csr.quotationrequest;

import com.csr.privilege.Privilege;
import com.csr.privilege.PrivilegeController;
import com.csr.supplier.Supplier;
import com.csr.supplier.SupplierDao;
import com.csr.user.UserDao;
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
public class QuotationRequestController {

    @Autowired
    private PrivilegeController privilegeController;

    @Autowired
    private QuotationRequestDao quotationRequestDao;

    @Autowired
    private QuotationRequestStatusDao quotationRequestStatusDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private SupplierDao supplierDao;

    @GetMapping(value = "/quotationrequest/findall", produces = "application/json")
    public List<QuotationRequest> getAllQuotationRequest() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "QuotationRequest");
        if (!loggedUserPrivilege.getSel_privi()) {
            return new ArrayList<>();
        }
        return quotationRequestDao.findAll();
    }

    @GetMapping(value = "/quotationrequest/supplierswithoutqrreq", produces = "application/json")
    public List<Supplier> getSuppliersWitoutQR() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "QuotationRequest");
        if (!loggedUserPrivilege.getSel_privi()) {
            return new ArrayList<>();
        }
        return supplierDao.getSupplierListWithoutRequestedQuoatation();
    }

    @GetMapping(value = "/quotationrequest/requested/findall", produces = "application/json")
    public List<QuotationRequest> getAllQuotationRequestRequested() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "QuotationRequest");
        if (!loggedUserPrivilege.getSel_privi()) {
            return new ArrayList<>();
        }
        List<QuotationRequest> allRequestQuot = quotationRequestDao.getAllQRRequested();
        for (QuotationRequest qrequest : allRequestQuot) {
            LocalDate requiredDatePlus7 = qrequest.getRequired_date().plusDays(7);
            if (LocalDate.now().isAfter(requiredDatePlus7)) {
                qrequest.setQuotation_request_status_id(quotationRequestStatusDao.getReferenceById(3));
                quotationRequestDao.save(qrequest);
            }
        }
        return quotationRequestDao.getAllQRRequested();
    }

    @GetMapping(value = "/quotationrequest/received/findall", produces = "application/json")
    public List<QuotationRequest> getAllQuotationRequestReceived() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "QuotationRequest");
        if (!loggedUserPrivilege.getSel_privi()) {
            return new ArrayList<>();
        }
        return quotationRequestDao.getAllQRReceived();
    }

    @GetMapping(value = "/quotationrequest/invalid/findall", produces = "application/json")
    public List<QuotationRequest> getAllQuotationRequestInvalid() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "QuotationRequest");
        if (!loggedUserPrivilege.getSel_privi()) {
            return new ArrayList<>();
        }
        return quotationRequestDao.getAllQRInvalid();
    }

    @GetMapping(value = "/quotationrequest/status", produces = "application/json")
    public List<QuotationRequestStatus> getAllQuotationRequestStatus() {
        return quotationRequestStatusDao.findAll();
    }

    @GetMapping(value = "/quotationrequest")
    public ModelAndView quotationRequestUI() {
        // Authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "QuotationRequest");
        if (!loggedUserPrivilege.getSel_privi()) {
            ModelAndView quotationRequestModelAndViewError = new ModelAndView();
            quotationRequestModelAndViewError.setViewName("error.html");
            return quotationRequestModelAndViewError;
        } else {
            ModelAndView quotationRequestModelAndView = new ModelAndView();
            quotationRequestModelAndView.addObject("title", "Quotation Request Management");
            quotationRequestModelAndView.addObject("navbartitle", "QUOTATION REQUEST MANAGEMENT MODULE");
            quotationRequestModelAndView.addObject("loggeduser", auth.getName());
            quotationRequestModelAndView.setViewName("quotationrequest.html");
            return quotationRequestModelAndView;
        }
    }


    @PostMapping(value = "/quotationrequest")
    public String postQuotationRequest(@RequestBody QuotationRequest quotationRequest) {
        // Authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "QuotationRequest");
        if (!loggedUserPrivilege.getIns_privi()) {
            return "Submit did not completed : You dont have the privilege";
        }
        List<QuotationRequest> activeQRListBySupplier = quotationRequestDao.getRequestQRListBySupplier(quotationRequest.getSupplier_id().getId());

        if (activeQRListBySupplier.size() != 0) {
            return "Submit did not completed : This Supplier already have requested quotation pending..";
        }

        try {
            List<QuotationRequest> receivedQRListBySupplier = quotationRequestDao.getReceivedQRListBySupplier(quotationRequest.getSupplier_id().getId());
            for (QuotationRequest receivedqr : receivedQRListBySupplier) {
                receivedqr.setQuotation_request_status_id(quotationRequestStatusDao.getReferenceById(3));
                receivedqr.setDeleted_user_id(userDao.findByUsername(auth.getName()).getId());
                receivedqr.setDeleted_time(LocalDateTime.now());
                quotationRequestDao.save(receivedqr);
            }
            String nextQuotationRequestNo = quotationRequestDao.getNxtQRNo();
            if (nextQuotationRequestNo==null || nextQuotationRequestNo.equals("")) {
                quotationRequest.setQuot_req_no("QR00001");
            } else {
                quotationRequest.setQuot_req_no(nextQuotationRequestNo);
            }
            quotationRequest.setAdded_time(LocalDateTime.now());
            quotationRequest.setAdded_user_id(userDao.findByUsername(auth.getName()).getId());

            quotationRequestDao.save(quotationRequest);

            return "OK";
        } catch (Exception e) {
            return "Submit not Completed : " + e.getMessage();
        }
    }

    @DeleteMapping(value = "/quotationrequest")
    public String delQuotationRequest(@RequestBody QuotationRequest quotationRequest) {
        // Authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "QuotationRequest");
        if (!loggedUserPrivilege.getDel_privi()) {
            return "Cancel did not completed : You dont have the privilege";
        }
        try {
            quotationRequest.setQuotation_request_status_id(quotationRequestStatusDao.getReferenceById(3));
            quotationRequest.setDeleted_time(LocalDateTime.now());
            quotationRequest.setDeleted_user_id(userDao.findByUsername(auth.getName()).getId());
            quotationRequestDao.save(quotationRequest);
            return "OK";

        } catch (Exception e) {
            return "Cancel not Completed : " + e.getMessage();
        }
    }
}
