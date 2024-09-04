package com.csr.reports;

import com.csr.material.MaterialInventoryLog;
import com.csr.material.MaterialInventoryLogDao;
import com.csr.privilege.Privilege;
import com.csr.privilege.PrivilegeController;
import com.csr.production.ProductionLog;
import com.csr.production.ProductionLogDao;
import com.csr.transaction.TransactionLog;
import com.csr.transaction.TransactionLogDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.util.ArrayList;
import java.util.List;

@RestController
public class ReportController {

    @Autowired
    private PrivilegeController privilegeController;

    @Autowired
    private MaterialInventoryLogDao materialInventoryLogDao;

    @Autowired
    private ProductionLogDao productionLogDao;

    @Autowired
    private TransactionLogDao transactionLogDao;


    @GetMapping(value = "/tablepage")
    public ModelAndView reportTablePage() {
        // Authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Report");
        if (!loggedUserPrivilege.getSel_privi()) {
            ModelAndView tablePageModelAndViewError = new ModelAndView();
            tablePageModelAndViewError.setViewName("error.html");
            return tablePageModelAndViewError;
        } else {
            ModelAndView tablePageModelAndView = new ModelAndView();
            tablePageModelAndView.addObject("title", "Table Reports");
            tablePageModelAndView.addObject("navbartitle", "ALL TABLE REPORTS");
            tablePageModelAndView.addObject("loggeduser", auth.getName());
            tablePageModelAndView.setViewName("tablepage.html");
            return tablePageModelAndView;
        }
    }
    @GetMapping(value = "/chartpage")
    public ModelAndView reportChartPage() {
        // Authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Report");
        if (!loggedUserPrivilege.getSel_privi()) {
            ModelAndView chartPageModelAndViewError = new ModelAndView();
            chartPageModelAndViewError.setViewName("error.html");
            return chartPageModelAndViewError;
        } else {
            ModelAndView chartPageModelAndView = new ModelAndView();
            chartPageModelAndView.addObject("title", "Chart Reports");
            chartPageModelAndView.addObject("navbartitle", "ALL CHART REPORTS");
            chartPageModelAndView.addObject("loggeduser", auth.getName());
            chartPageModelAndView.setViewName("chartpage.html");
            return chartPageModelAndView;
        }
    }

    @GetMapping(value = "/reportinventorylogs/findall", produces = "application/json")
    public List<MaterialInventoryLog> getAllInventoryLogs() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Report");
        if (!loggedUserPrivilege.getSel_privi()) {
            return new ArrayList<>();
        }
        return materialInventoryLogDao.findAll(Sort.by(Sort.Direction.DESC,"id"));
    }

    @GetMapping(value = "/reportinventorylogs")
    public ModelAndView reportInventorylogsUI() {
        // Authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Report");
        if (!loggedUserPrivilege.getSel_privi()) {
            ModelAndView  reportInventoryModelAndViewError = new ModelAndView();
            reportInventoryModelAndViewError.setViewName("error.html");
            return reportInventoryModelAndViewError;
        } else {
            ModelAndView  reportInventoryModelAndView = new ModelAndView();
            reportInventoryModelAndView.addObject("title", "Inventory Logs Report");
            reportInventoryModelAndView.addObject("navbartitle", "INVENTORY LOGS REPORT");
            reportInventoryModelAndView.addObject("loggeduser", auth.getName());
            reportInventoryModelAndView.setViewName("inventorylog.html");
            return reportInventoryModelAndView;
        }
    }


    @GetMapping(value = "/reportproductionlogs/findall", produces = "application/json")
    public List<ProductionLog> getAllProductionLogs() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Report");
        if (!loggedUserPrivilege.getSel_privi()) {
            return new ArrayList<>();
        }
        return productionLogDao.findAll(Sort.by(Sort.Direction.DESC,"id"));
    }





    @GetMapping(value = "/reportproductionlogs")
    public ModelAndView reportProductionlogsUI() {
        // Authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Report");
        if (!loggedUserPrivilege.getSel_privi()) {
            ModelAndView  reportProductionModelAndViewError = new ModelAndView();
            reportProductionModelAndViewError.setViewName("error.html");
            return reportProductionModelAndViewError;
        } else {
            ModelAndView  reportProductionModelAndView = new ModelAndView();
            reportProductionModelAndView.addObject("title", "Production Logs Report");
            reportProductionModelAndView.addObject("navbartitle", "PRODUCTION PROCESS LOGS REPORT");
            reportProductionModelAndView.addObject("loggeduser", auth.getName());
            reportProductionModelAndView.setViewName("productionlog.html");
            return reportProductionModelAndView;
        }
    }

    @GetMapping(value = "/transactionlog/findall", produces = "application/json")
    public List<TransactionLog> getAllTransactionLogs() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Report");
        if (!loggedUserPrivilege.getSel_privi()) {
            return new ArrayList<>();
        }
        return transactionLogDao.findAll(Sort.by(Sort.Direction.DESC,"id"));
    }

    @GetMapping(value = "/transactionlog")
    public ModelAndView reportTransactionLogsUI() {
        // Authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Report");
        if (!loggedUserPrivilege.getSel_privi()) {
            ModelAndView  reportTransactionalModelAndViewError = new ModelAndView();
            reportTransactionalModelAndViewError.setViewName("error.html");
            return reportTransactionalModelAndViewError;
        } else {
            ModelAndView  reportTransactionalModelAndView = new ModelAndView();
            reportTransactionalModelAndView.addObject("title", "Transaction Logs Report");
            reportTransactionalModelAndView.addObject("navbartitle", "TRANSACTION PROCESS LOGS REPORT");
            reportTransactionalModelAndView.addObject("loggeduser", auth.getName());
            reportTransactionalModelAndView.setViewName("transactionallog.html");
            return reportTransactionalModelAndView;
        }
    }
}
