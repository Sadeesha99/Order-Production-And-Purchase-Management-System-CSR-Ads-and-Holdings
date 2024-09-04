//call material table refresh function
window.addEventListener('load', () => {

    refreshMaterialUsageReportForm();

});


const refreshMaterialUsageReportForm = () => {

    reportmonthlymaterialusage = new Object;

    let currentDateForMinSDate = new Date();
    let currentDateForMaxSDate = new Date();

    let minStartDate = currentDateForMinSDate.setDate(currentDateForMinSDate.getDate() - 730);
    let maxStartDate = currentDateForMaxSDate.setDate(currentDateForMaxSDate.getDate() - 30);
    inputStartDate.min = getDateReturned("date", minStartDate);
    inputStartDate.max = getDateReturned("date", maxStartDate);

    let currentDateForMinEDate = new Date();
    let currentDateForMaxEDate = new Date();
    let minEndDate = currentDateForMinEDate.setDate(currentDateForMinEDate.getDate() - 700);
    let maxEndDate = currentDateForMaxEDate.setDate(currentDateForMaxEDate.getDate());
    inputEndDate.min = getDateReturned("date", minEndDate);
    inputEndDate.max = getDateReturned("date", maxEndDate);

    document.getElementById("inputStartDate").classList.remove("is-valid", "is-invalid");
    document.getElementById("inputEndDate").classList.remove("is-valid", "is-invalid");
    document.getElementById("inputStartDate").value = '';
    document.getElementById("inputEndDate").value = '';
    document.getElementById("inputEndDate").disabled = true;
    document.getElementById("MaterialUsageReportTableDiv").style.display = "none";
    document.getElementById("NoRecordsMessage").style.display = 'none';

}


const inputStartDateEl = document.getElementById("inputStartDate");
const inputEndDateEl = document.getElementById("inputEndDate");

inputStartDateEl.addEventListener('change', () => {
    let selectedStartDate = inputStartDateEl.value;
    refreshMaterialUsageReportForm();
    inputStartDateEl.value = selectedStartDate;
    reportmonthlymaterialusage.sdate = inputStartDateEl.value;
    inputStartDateEl.classList.add("is-valid");
    document.getElementById("inputEndDate").disabled = false;
    let newcurrentDateForMinEDate = new Date(selectedStartDate);
    let minEndDate = newcurrentDateForMinEDate.setDate(newcurrentDateForMinEDate.getDate() + 30);
    inputEndDateEl.min = getDateReturned("date", minEndDate);

});

inputEndDateEl.addEventListener('change', () => {
    reportmonthlymaterialusage.edate = inputEndDateEl.value;
    inputEndDateEl.classList.remove("is-valid", "is-invalid");
    inputEndDateEl.classList.add("is-valid");
});


const generatematerialusagereport = () => {
    let error = '';
    if (reportmonthlymaterialusage.sdate == null) {
        error = error + "Enter valid Start Date..!\n";
        inputStartDateEl.classList.add("is-invalid");
    }
    if (reportmonthlymaterialusage.edate == null) {
        error = error + "Enter valid End Date..!\n";
        inputEndDateEl.classList.add("is-invalid");
    }
    if (error == '') {
        let dataListReport = ajaxGetRequestMapping("/materialusagereportbymonthnameandyear/" + reportmonthlymaterialusage.sdate + "/" + reportmonthlymaterialusage.edate);
        dataListReport = dataListReport.filter(ob=>{
            return ob.materialusage > 0;
        })
        filldateIntoDailyReportTable(dataListReport);
    } else {
        alert("Cannot analyze due to following errors : \n" + error);
    }
}

const clearmaterialusagereport = () => {
    refreshMaterialUsageReportForm();
    tbodyMaterialUsageReport.innerHTML = ''

}

const filldateIntoDailyReportTable = (oblist) => {

    const getMatNumber = (ob) => {
        return (ajaxGetRequestMapping("/materialbyid/"+parseInt(ob.material_id)).matno)
    }
    const getMaterialName = (ob) => {
        return (ajaxGetRequestMapping("/materialbyid/"+parseInt(ob.material_id)).name)
    }
    const getMaterialUsage = (ob) => {
        return parseFloat(ob.materialusage).toFixed(2)+" "+(ajaxGetRequestMapping("/materialbyid/"+parseInt(ob.material_id)).material_unit_type_id.symbol);
    }

    const displayPropertyListReportTable = [
        {dataType: 'function', propertyName: getMatNumber},
        {dataType: 'function', propertyName: getMaterialName},
        {dataType: 'text', propertyName: 'date'},
        {dataType: 'function', propertyName: getMaterialUsage},
    ]

    if(oblist.length>0){
        document.getElementById("MaterialUsageReportTableDiv").style.display = "block";
        fillDataIntoBillingTable("tbodyMaterialUsageReport", oblist, displayPropertyListReportTable);
    }else{
        document.getElementById("NoRecordsMessage").style.display = 'block';
    }

    
}