package com.csr.reports;

import com.csr.material.MaterialInventoryLogDao;
import com.csr.privilege.Privilege;
import com.csr.privilege.PrivilegeController;
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
public class MaterialUsageReportController {

    @Autowired
    private PrivilegeController privilegeController;

    @Autowired
    private MaterialInventoryLogDao materialInventoryLogDao;

    @GetMapping(value = "/materialusagereportbymonthnameandyear/{sdate}/{edata}", produces = "application/json")
    public List<MaterailUsageReport> getMaterialUsageReportByMonth(@PathVariable("sdate") String sdate, @PathVariable("edata") String edata) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Report");
        if (!loggedUserPrivilege.getSel_privi()) {
            return new ArrayList<>();
        }
        // String[][] -> 2D array
        String[][] queryDataList =  materialInventoryLogDao.getMaterialDownReportBetweenTwoDaysGroupByMonthAndYear(sdate,edata);
        //Create New List of ProfitLossReport
        List<MaterailUsageReport>  materialUsageReportReportList = new ArrayList<>();
        //Get array [[][]] as following
        // [ [ "July",  "0.00",  "2000.00",  "-2000.00" ], [ "August",  "7075.00",  "150.00",  "6925.00" ] ]
        // and iterate over main string array by taking inside string arrays as new arrays
        for(String[] querdata:queryDataList){
            //Create new ProfitLossReport Object
            MaterailUsageReport materialUsageReport = new MaterailUsageReport();
            //Take corresponding values from string array and assign it to new object of profit loss
            materialUsageReport.setMaterial_id(querdata[0]);
            materialUsageReport.setDate(querdata[1]);
            materialUsageReport.setMaterialusage(querdata[2]);
            materialUsageReportReportList.add(materialUsageReport);
        }

        return materialUsageReportReportList;
    }
    @GetMapping(value = "/materialusagereportbydate/{sdate}/{edata}", produces = "application/json")
    public List<MaterailUsageReport> getMaterialUsageReportByDate(@PathVariable("sdate") String sdate, @PathVariable("edata") String edata) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Report");
        if (!loggedUserPrivilege.getSel_privi()) {
            return new ArrayList<>();
        }
        // String[][] -> 2D array
        String[][] queryDataList =  materialInventoryLogDao.getMaterialDownReportBetweenTwoDaysGroupByDay(sdate,edata);
        //Create New List of ProfitLossReport
        List<MaterailUsageReport>  materialUsageReportReportList = new ArrayList<>();
        //Get array [[][]] as following
        // [ [ "July",  "0.00",  "2000.00",  "-2000.00" ], [ "August",  "7075.00",  "150.00",  "6925.00" ] ]
        // and iterate over main string array by taking inside string arrays as new arrays
        for(String[] querdata:queryDataList){
            //Create new ProfitLossReport Object
            MaterailUsageReport materialUsageReport = new MaterailUsageReport();
            //Take corresponding values from string array and assign it to new object of profit loss
            materialUsageReport.setMaterial_id(querdata[0]);
            materialUsageReport.setDate(querdata[1]);
            materialUsageReport.setMaterialusage(querdata[2]);
            materialUsageReportReportList.add(materialUsageReport);
        }

        return materialUsageReportReportList;
    }

    @GetMapping(value = "/materialreceivedreportbymonthnameandyear/{sdate}/{edata}", produces = "application/json")
    public List<MaterailUsageReport> getMaterialReceivedReportByMonth(@PathVariable("sdate") String sdate, @PathVariable("edata") String edata) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Report");
        if (!loggedUserPrivilege.getSel_privi()) {
            return new ArrayList<>();
        }
        // String[][] -> 2D array
        String[][] queryDataList =  materialInventoryLogDao.getMaterialUPReportBetweenTwoDaysGroupByMonthAndYear(sdate,edata);
        //Create New List of ProfitLossReport
        List<MaterailUsageReport>  materialUsageReportReportList = new ArrayList<>();
        //Get array [[][]] as following
        // [ [ "July",  "0.00",  "2000.00",  "-2000.00" ], [ "August",  "7075.00",  "150.00",  "6925.00" ] ]
        // and iterate over main string array by taking inside string arrays as new arrays
        for(String[] querdata:queryDataList){
            //Create new ProfitLossReport Object
            MaterailUsageReport materialUsageReport = new MaterailUsageReport();
            //Take corresponding values from string array and assign it to new object of profit loss
            materialUsageReport.setMaterial_id(querdata[0]);
            materialUsageReport.setDate(querdata[1]);
            materialUsageReport.setMaterialusage(querdata[2]);
            materialUsageReportReportList.add(materialUsageReport);
        }

        return materialUsageReportReportList;
    }
    @GetMapping(value = "/givenmatusageforgiventime/{matid}/{sdate}/{edata}", produces = "application/json")
    public MaterailUsageReport getMaterialUsageForGivenTime(@PathVariable("matid")Integer matid,@PathVariable("sdate") String sdate, @PathVariable("edata") String edata) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Report");
        if (!loggedUserPrivilege.getSel_privi()) {
            return new MaterailUsageReport();
        }
        String dataObject = materialInventoryLogDao.getGivenMaterialDownForGivenTime(matid,sdate,edata);

        if(dataObject==null){
            return new MaterailUsageReport();
        }else {
            // generate array
            String[] queryDataList =  dataObject.split(",");

            //Get array as following
            // [ [ "1",  "120.00"]
            // and creating material usage report object to set array values
            MaterailUsageReport materialUsageReport = new MaterailUsageReport();
            //Take corresponding values from string array and assign it to new object
            materialUsageReport.setMaterial_id(queryDataList[0]);
            materialUsageReport.setMaterialusage(queryDataList[1]);

            return materialUsageReport;
        }

    }
    @GetMapping(value = "/givenmatreceivedforgivenyearmonth/{matid}/{sdate}/{edata}", produces = "application/json")
    public MaterailUsageReport getMaterialReceivedReportByMonth(@PathVariable("matid")Integer matid,@PathVariable("sdate") String sdate, @PathVariable("edata") String edata) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Report");
        if (!loggedUserPrivilege.getSel_privi()) {
            return new MaterailUsageReport();
        }

        String dataObject = materialInventoryLogDao.getGivenMaterialDownForGivenTime(matid,sdate,edata);

        if(dataObject==null){
            return new MaterailUsageReport();
        }else{
            // String[] -> 2D array
            String[] queryDataList =  dataObject.split(",");

            //Get array [[][]] as following
            // [ [ "July",  "0.00",  "2000.00",  "-2000.00" ], [ "August",  "7075.00",  "150.00",  "6925.00" ] ]
            // and iterate over main string array by taking inside string arrays as new arrays
            MaterailUsageReport materialUsageReport = new MaterailUsageReport();
            //Take corresponding values from string array and assign it to new object of profit loss
            materialUsageReport.setMaterial_id(queryDataList[0]);
            materialUsageReport.setDate(queryDataList[1]);
            materialUsageReport.setMaterialusage(queryDataList[2]);

            return materialUsageReport;
        }
    }


    @GetMapping(value = "/monthlymaterialusage")
    public ModelAndView monthlyMaterialUsageUI() {
        // Authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Report");
        if (!loggedUserPrivilege.getSel_privi()) {
            ModelAndView  reportMonthlyMatUsageModelAndViewError = new ModelAndView();
            reportMonthlyMatUsageModelAndViewError.setViewName("error.html");
            return reportMonthlyMatUsageModelAndViewError;
        } else {
            ModelAndView  reportMonthlyMatUsageModelAndView = new ModelAndView();
            reportMonthlyMatUsageModelAndView.addObject("title", "Monthly Material Usage Report");
            reportMonthlyMatUsageModelAndView.addObject("navbartitle", "MONTHLY MATERIAL USAGE REPORT");
            reportMonthlyMatUsageModelAndView.addObject("loggeduser", auth.getName());
            reportMonthlyMatUsageModelAndView.setViewName("monthlymaterialusagereport.html");
            return reportMonthlyMatUsageModelAndView;
        }
    }
    @GetMapping(value = "/monthlymaterialusagechart")
    public ModelAndView monthlyMaterialUsageChartUI() {
        // Authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Report");
        if (!loggedUserPrivilege.getSel_privi()) {
            ModelAndView  reportMonthlyMatUsageChartModelAndViewError = new ModelAndView();
            reportMonthlyMatUsageChartModelAndViewError.setViewName("error.html");
            return reportMonthlyMatUsageChartModelAndViewError;
        } else {
            ModelAndView  reportMonthlyMatUsageChartModelAndView = new ModelAndView();
            reportMonthlyMatUsageChartModelAndView.addObject("title", "Monthly Material Usage Report");
            reportMonthlyMatUsageChartModelAndView.addObject("navbartitle", "MONTHLY MATERIAL USAGE REPORT");
            reportMonthlyMatUsageChartModelAndView.addObject("loggeduser", auth.getName());
            reportMonthlyMatUsageChartModelAndView.setViewName("monthlymaterialusagereportchart.html");
            return reportMonthlyMatUsageChartModelAndView;
        }
    }

    @GetMapping(value = "/dailymaterialusage")
    public ModelAndView dailyMaterialUsageUI() {
        // Authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Report");
        if (!loggedUserPrivilege.getSel_privi()) {
            ModelAndView  reportDailyMatUsageModelAndViewError = new ModelAndView();
            reportDailyMatUsageModelAndViewError.setViewName("error.html");
            return reportDailyMatUsageModelAndViewError;
        } else {
            ModelAndView  reportDailyMatUsageModelAndView = new ModelAndView();
            reportDailyMatUsageModelAndView.addObject("title", "Daily Material Usage Report");
            reportDailyMatUsageModelAndView.addObject("navbartitle", "DAILY MATERIAL USAGE REPORT");
            reportDailyMatUsageModelAndView.addObject("loggeduser", auth.getName());
            reportDailyMatUsageModelAndView.setViewName("dailymaterialusagereport.html");
            return reportDailyMatUsageModelAndView;
        }
    }
    
    @GetMapping(value = "/dailymaterialusagechart")
    public ModelAndView dailyMaterialChartUsageUI() {
        // Authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Report");
        if (!loggedUserPrivilege.getSel_privi()) {
            ModelAndView  reportDailyMatUsageChartModelAndViewError = new ModelAndView();
            reportDailyMatUsageChartModelAndViewError.setViewName("error.html");
            return reportDailyMatUsageChartModelAndViewError;
        } else {
            ModelAndView  reportDailyMatUsageChartModelAndView = new ModelAndView();
            reportDailyMatUsageChartModelAndView.addObject("title", "Daily Material Usage Report");
            reportDailyMatUsageChartModelAndView.addObject("navbartitle", "DAILY MATERIAL USAGE REPORT");
            reportDailyMatUsageChartModelAndView.addObject("loggeduser", auth.getName());
            reportDailyMatUsageChartModelAndView.setViewName("dailymaterialusagereportchart.html");
            return reportDailyMatUsageChartModelAndView;
        }
    }

    @GetMapping(value = "/ropmaterialusage")
    public ModelAndView ropMaterialUsageUI() {
        // Authentication and authorization
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Privilege loggedUserPrivilege = privilegeController.getPrivilegeByModule(auth, "Report");
        if (!loggedUserPrivilege.getSel_privi()) {
            ModelAndView  ropMatUsageModelAndViewError = new ModelAndView();
            ropMatUsageModelAndViewError.setViewName("error.html");
            return ropMatUsageModelAndViewError;
        } else {
            ModelAndView  ropMatUsageModelAndView = new ModelAndView();
            ropMatUsageModelAndView.addObject("title", "Re-Order Point Analyzer By Usage");
            ropMatUsageModelAndView.addObject("navbartitle", "MATERIAL USAGE ROP ANALYZE REPORT");
            ropMatUsageModelAndView.addObject("loggeduser", auth.getName());
            ropMatUsageModelAndView.setViewName("materialusagereportgiventime.html");
            return ropMatUsageModelAndView;
        }
    }





}
