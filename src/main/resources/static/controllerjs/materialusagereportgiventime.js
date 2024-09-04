//call material table refresh function
window.addEventListener('load', () => {

    loggedUserPriviForMaterialROP = ajaxGetRequestMapping("/privilege/bymodule/Material");

    refreshMaterialUsageReportForm();

});


const refreshMaterialUsageReportForm = () => {

    reportdailymaterialusage = new Object;

    const matLowStock = ajaxGetRequestMapping("/material/lowstock");
    const matInStock = ajaxGetRequestMapping("/material/instock");
    const matOutStock = ajaxGetRequestMapping("/material/outstock");

    materialListForSupplierPrice = matLowStock.concat(matInStock,matOutStock);

    fillDataIntoSelect(inputMaterialName, "Select Material", materialListForSupplierPrice, 'name');
    document.getElementById("inputMaterialNo").value = ''
    document.getElementById("inputMaterialName").classList.remove("is-valid", "is-invalid");
    document.getElementById("inputMaterialNo").classList.remove("is-valid", "is-invalid");

    let currentDateForMinSDate = new Date();
    let currentDateForMaxSDate = new Date();

    let minStartDate = currentDateForMinSDate.setDate(currentDateForMinSDate.getDate() - 180);
    let maxStartDate = currentDateForMaxSDate.setDate(currentDateForMaxSDate.getDate() - 14);
    inputStartDate.min = getDateReturned("date", minStartDate);
    inputStartDate.max = getDateReturned("date", maxStartDate);

    let currentDateForMinEDate = new Date();
    let currentDateForMaxEDate = new Date();
    let minEndDate = currentDateForMinEDate.setDate(currentDateForMinEDate.getDate() - 166);
    let maxEndDate = currentDateForMaxEDate.setDate(currentDateForMaxEDate.getDate());
    inputEndDate.min = getDateReturned("date", minEndDate);
    inputEndDate.max = getDateReturned("date", maxEndDate);

    document.getElementById("inputStartDate").classList.remove("is-valid", "is-invalid");
    document.getElementById("inputEndDate").classList.remove("is-valid", "is-invalid");
    document.getElementById("inputStartDate").value = '';
    document.getElementById("inputEndDate").value = '';
    document.getElementById("inputEndDate").disabled = true;
    document.getElementById("inputStartDate").disabled = true;
    document.getElementById("MaterialUsageReportTableDiv").style.display = "none";
    document.getElementById("NoRecordsMessage").style.display = 'none';

}




const inputStartDateEl = document.getElementById("inputStartDate");
const inputEndDateEl = document.getElementById("inputEndDate");
const inputMaterialNameEl = document.getElementById("inputMaterialName")

inputMaterialNameEl.addEventListener('change', () => {
    let materialOb = JSON.parse(inputMaterialNameEl.value);
    clearmaterialusagereport();
    fillDataIntoSelect(inputMaterialName, "Select Material", materialListForSupplierPrice, 'name',materialOb.name);
    selectDynamicValidator(inputMaterialName, 'reportdailymaterialusage', 'material_id');
    document.getElementById("inputMaterialNo").value = materialOb.matno;
    document.getElementById("inputMaterialNo").classList.remove("is-invalid");
    document.getElementById("inputMaterialNo").classList.add("is-valid");
    inputStartDateEl.disabled = false;
});


inputStartDateEl.addEventListener('change', () => {
    let selectedStartDate = inputStartDateEl.value;
    let materialOb = JSON.parse(inputMaterialNameEl.value);
    clearmaterialusagereport();
    fillDataIntoSelect(inputMaterialName, "Select Material", materialListForSupplierPrice, 'name',materialOb.name);
    selectDynamicValidator(inputMaterialName, 'reportdailymaterialusage', 'material_id');
    document.getElementById("inputMaterialNo").value = materialOb.matno;
    document.getElementById("inputMaterialNo").classList.remove("is-invalid");
    document.getElementById("inputMaterialNo").classList.add("is-valid");
    inputStartDateEl.value = selectedStartDate;
    reportdailymaterialusage.sdate = inputStartDateEl.value;
    inputStartDateEl.classList.add("is-valid");
    inputStartDateEl.disabled = false;
    inputEndDateEl.disabled = false;
    let newcurrentDateForMinEDate = new Date(selectedStartDate);
    let minEndDate = newcurrentDateForMinEDate.setDate(newcurrentDateForMinEDate.getDate() + 14);
    inputEndDateEl.min = getDateReturned("date", minEndDate);

});

inputEndDateEl.addEventListener('change', () => {
    reportdailymaterialusage.edate = inputEndDateEl.value;
    inputEndDateEl.classList.remove("is-valid", "is-invalid");
    inputEndDateEl.classList.add("is-valid");
});


const generatematerialusagereport = () => {
    let error = '';
    if (reportdailymaterialusage.sdate == null) {
        error = error + "Enter valid Start Date..!\n";
        inputStartDateEl.classList.add("is-invalid");
    }
    if (reportdailymaterialusage.edate == null) {
        error = error + "Enter valid End Date..!\n";
        inputEndDateEl.classList.add("is-invalid");
    }
    if (reportdailymaterialusage.material_id == null) {
        error = error + "Enter valid Material..!\n";
        inputMaterialNo.classList.add("is-invalid");
        inputMaterialNameEl.classList.add("is-invalid");
    }
    if (error == '') {
        let dataObj = ajaxGetRequestMapping("/givenmatusageforgiventime/" +reportdailymaterialusage.material_id.id+ "/"+reportdailymaterialusage.sdate + "/" + reportdailymaterialusage.edate);
        //console.log(dataObj);
        let dataListReport = [];
        dataListReport.push(dataObj);
        //console.log(dataListReport);

        dataListReport = dataListReport.filter(ob=>{
            return ob.materialusage > 0;
        });
        filldateIntoDailyReportTable(dataListReport);
    } else {
        alert("Cannot analyze due to following errors : \n" + error);
    }
}

const clearmaterialusagereport = () => {
    refreshMaterialUsageReportForm();
    tbodyMaterialUsageReport.innerHTML = ''

}
const setROPFunction = (ob) => {
    const materialObject = (ajaxGetRequestMapping("/materialbyid/"+parseInt(ob.material_id)));
    const oldROP = materialObject.reorder_point;
    materialObject.reorder_point = parseFloat(ob.materialusage);
    console.log(materialObject)
    const confirmROPUpdate = confirm('Are you sure to update following material supplier price..?'
        + '\n Material No : ' + materialObject.matno
        + '\n Material Name : ' + materialObject.name
        + '\n Current Re-Order Point: ' + oldROP
        + '\n New Re-Order Point : ' + materialObject.reorder_point);

    if (confirmROPUpdate){
        const materialPutServiceResponse = ajaxPutRequestMapping("/materialroproqupdate", materialObject);
        if(materialPutServiceResponse == "OK"){
            alert("Re-order point successfully updated");
        }else{
            alert("Update was not successful.. !\n" + materialPutServiceResponse);
        }
    }else{
        alert("Update canceled..");
    }
}

const filldateIntoDailyReportTable = (oblist) => {

    const getMatNumber = (ob) => {
        return (ajaxGetRequestMapping("/materialbyid/"+parseInt(ob.material_id)).matno)
    }
    const getMaterialName = (ob) => {
        return (ajaxGetRequestMapping("/materialbyid/"+parseInt(ob.material_id)).name)
    }
    const getCurrentROP = (ob) => {
        const materialObject = (ajaxGetRequestMapping("/materialbyid/"+parseInt(ob.material_id)))
        return (materialObject.reorder_point+" "+ materialObject.material_unit_type_id.symbol);
    }
    const getMaterialUsage = (ob) => {
        return parseFloat(ob.materialusage).toFixed(2)+(ajaxGetRequestMapping("/materialbyid/"+parseInt(ob.material_id)).material_unit_type_id.symbol);
    }

    const displayPropertyListReportTable = [
        {dataType: 'function', propertyName: getMatNumber},
        {dataType: 'function', propertyName: getMaterialName},
        {dataType: 'function', propertyName: getCurrentROP},
        {dataType: 'function', propertyName: getMaterialUsage},
    ]

    if(oblist.length>0){
        document.getElementById("MaterialUsageReportTableDiv").style.display = "block";
        fillDataIntoROP("tbodyMaterialUsageReport", oblist, displayPropertyListReportTable,setROPFunction,loggedUserPriviForMaterialROP);
    }else{
        document.getElementById("NoRecordsMessage").style.display = 'block';
    }


    
}