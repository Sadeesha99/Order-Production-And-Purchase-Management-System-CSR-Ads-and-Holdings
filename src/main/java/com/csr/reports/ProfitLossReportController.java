package com.csr.reports;

import com.csr.privilege.Privilege;
import com.csr.privilege.PrivilegeController;
import com.csr.transaction.TransactionLogDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.util.ArrayList;
import java.util.List;

@RestController
public class ProfitLossReportController {
    @Autowired
    private TransactionLogDao transactionLogDao;
    @Autowired
    private PrivilegeController privilegeController;

    @GetMapping(value = "/profitlossreportbymonthname/{sdate}/{edata}", produces = "application/json")
    public List<ProfitLossReport> getProfitLossReportByMonth(@PathVariable("sdate") String sdate, @PathVariable("edata") String edata) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Report");
        if (!loggedUserPrivilege.getSel_privi()) {
            return new ArrayList<>();
        }
        // String[][] -> 2D array
        String[][] queryDataList =  transactionLogDao.getProfitLossReportBetweenTwoDaysGroupByMonth(sdate,edata);
        //Create New List of ProfitLossReport
        List<ProfitLossReport>  profitLossReportReportList = new ArrayList<>();
        //Get array [[][]] as following
        // [ [ "July",  "0.00",  "2000.00",  "-2000.00" ], [ "August",  "7075.00",  "150.00",  "6925.00" ] ]
        // and iterate over main string array by taking inside string arrays as new arrays
        for(String[] querdata:queryDataList){
            //Create new ProfitLossReport Object
            ProfitLossReport profitLossReport = new ProfitLossReport();
            //Take corresponding values from string array and assign it to new object of profit loss
            profitLossReport.setDate(querdata[0]);
            profitLossReport.setIncome(querdata[1]);
            profitLossReport.setExpense(querdata[2]);
            profitLossReport.setProfit(querdata[3]);
            profitLossReportReportList.add(profitLossReport);
        }

        return profitLossReportReportList;
    }

    @GetMapping(value = "/profitlossreportbydate/{sdate}/{edata}", produces = "application/json")
    public List<ProfitLossReport> getProfitLossReportByDate(@PathVariable("sdate") String sdate, @PathVariable("edata") String edata) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Report");
        if (!loggedUserPrivilege.getSel_privi()) {
            return new ArrayList<>();
        }
        // String[][] -> 2D array
        String[][] queryDataList =  transactionLogDao.getProfitLossReportBetweenTwoDaysGroupByDate(sdate,edata);
        //Create New List of ProfitLossReport
        List<ProfitLossReport>  profitLossReportReportList = new ArrayList<>();
        //Get array [[][]] as following
        // [ [ "July",  "0.00",  "2000.00",  "-2000.00" ], [ "August",  "7075.00",  "150.00",  "6925.00" ] ]
        // and iterate over main string array by taking inside string arrays as new arrays
        for(String[] querdata:queryDataList){
            //Create new ProfitLossReport Object
            ProfitLossReport profitLossReport = new ProfitLossReport();
            //Take corresponding values from string array and assign it to new object of profit loss
            profitLossReport.setDate(querdata[0]);
            profitLossReport.setIncome(querdata[1]);
            profitLossReport.setExpense(querdata[2]);
            profitLossReport.setProfit(querdata[3]);
            profitLossReportReportList.add(profitLossReport);
        }

        return profitLossReportReportList;
    }

//    // [/reportmaterialusage?startdate=1&enddate=1] -> for testing purpose
//    @GetMapping(value = "/reportmaterialusage", params = { "startdate", "enddate" }, produces = "application/json")
//    public List<ReportMaterialUsage> getMaterialUsageByGivenDateRange(
//            @RequestParam("startdate") String startdate, @RequestParam("enddate") String enddate) {
//        // String[][] -> 2D array
//        String[][] queryDataList = daoReport.getMaterialUsageForDateRange(startdate, enddate);
//    }



    @GetMapping(value = "/dailyprofitexpenseincome")
    public ModelAndView dailyProfitLossUI() {
        // Authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Report");
        if (!loggedUserPrivilege.getSel_privi()) {
            ModelAndView  reportDailyProfitModelAndViewError = new ModelAndView();
            reportDailyProfitModelAndViewError.setViewName("error.html");
            return reportDailyProfitModelAndViewError;
        } else {
            ModelAndView  reportDailyProfitModelAndView = new ModelAndView();
            reportDailyProfitModelAndView.addObject("title", "Daily Profit Income Expense Report");
            reportDailyProfitModelAndView.addObject("navbartitle", "DAILY PROFIT INCOME EXPENSE REPORT");
            reportDailyProfitModelAndView.addObject("loggeduser", auth.getName());
            reportDailyProfitModelAndView.setViewName("dailyprofitlossreport.html");
            return reportDailyProfitModelAndView;
        }
    }
    @GetMapping(value = "/dailyprofitexpenseincomechart")
    public ModelAndView dailyProfitLossChartUI() {
        // Authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Report");
        if (!loggedUserPrivilege.getSel_privi()) {
            ModelAndView  reportDailyProfitModelAndViewError = new ModelAndView();
            reportDailyProfitModelAndViewError.setViewName("error.html");
            return reportDailyProfitModelAndViewError;
        } else {
            ModelAndView  reportDailyProfitModelAndView = new ModelAndView();
            reportDailyProfitModelAndView.addObject("title", "Daily Profit Income Expense Report");
            reportDailyProfitModelAndView.addObject("navbartitle", "DAILY PROFIT INCOME EXPENSE REPORT");
            reportDailyProfitModelAndView.addObject("loggeduser", auth.getName());
            reportDailyProfitModelAndView.setViewName("dailyprofitlossreportchart.html");
            return reportDailyProfitModelAndView;
        }
    }

    @GetMapping(value = "/monthlyprofitexpenseincome")
    public ModelAndView monthlyProfitLossUI() {
        // Authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Report");
        if (!loggedUserPrivilege.getSel_privi()) {
            ModelAndView  reportDailyProfitModelAndViewError = new ModelAndView();
            reportDailyProfitModelAndViewError.setViewName("error.html");
            return reportDailyProfitModelAndViewError;
        } else {
            ModelAndView  reportDailyProfitModelAndView = new ModelAndView();
            reportDailyProfitModelAndView.addObject("title", "Monthly Profit Income Expense Report");
            reportDailyProfitModelAndView.addObject("navbartitle", "MONTHLY PROFIT INCOME EXPENSE REPORT");
            reportDailyProfitModelAndView.addObject("loggeduser", auth.getName());
            reportDailyProfitModelAndView.setViewName("monthlyprofitlossreport.html");
            return reportDailyProfitModelAndView;
        }
    }
    @GetMapping(value = "/monthlyprofitexpenseincomechart")
    public ModelAndView monthlyProfitLossChartUI() {
        // Authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Report");
        if (!loggedUserPrivilege.getSel_privi()) {
            ModelAndView  reportDailyProfitModelAndViewError = new ModelAndView();
            reportDailyProfitModelAndViewError.setViewName("error.html");
            return reportDailyProfitModelAndViewError;
        } else {
            ModelAndView  reportDailyProfitModelAndView = new ModelAndView();
            reportDailyProfitModelAndView.addObject("title", "Monthly Profit Income Expense Report");
            reportDailyProfitModelAndView.addObject("navbartitle", "MONTHLY PROFIT INCOME EXPENSE REPORT");
            reportDailyProfitModelAndView.addObject("loggeduser", auth.getName());
            reportDailyProfitModelAndView.setViewName("monthlyprofitlossreportchart.html");
            return reportDailyProfitModelAndView;
        }
    }


}
