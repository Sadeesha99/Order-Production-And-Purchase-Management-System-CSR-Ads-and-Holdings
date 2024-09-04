//call material table refresh function
window.addEventListener('load', () => {


    refreshDailyProfitIncExpForm();


});


const refreshDailyProfitIncExpForm = () => {

    reportdailyprofitexpincome = new Object;

    let currentDateForMinSDate = new Date();
    let currentDateForMaxSDate = new Date();

    let minStartDate = currentDateForMinSDate.setDate(currentDateForMinSDate.getDate() - 180);
    let maxStartDate = currentDateForMaxSDate.setDate(currentDateForMaxSDate.getDate() - 1);
    inputStartDate.min = getDateReturned("date", minStartDate);
    inputStartDate.max = getDateReturned("date", maxStartDate);

    let currentDateForMinEDate = new Date();
    let currentDateForMaxEDate = new Date();
    let minEndDate = currentDateForMinEDate.setDate(currentDateForMinEDate.getDate() - 179);
    let maxEndDate = currentDateForMaxEDate.setDate(currentDateForMaxEDate.getDate());
    inputEndDate.min = getDateReturned("date", minEndDate);
    inputEndDate.max = getDateReturned("date", maxEndDate);

    document.getElementById("inputStartDate").classList.remove("is-valid", "is-invalid");
    document.getElementById("inputEndDate").classList.remove("is-valid", "is-invalid");
    document.getElementById("inputStartDate").value = '';
    document.getElementById("inputEndDate").value = '';
    document.getElementById("inputEndDate").disabled = true;
    document.getElementById("dailyProfitReportTable").style.display = "none";
    document.getElementById("NoRecordsMessage").style.display = 'none';

}


const inputStartDateEl = document.getElementById("inputStartDate");
const inputEndDateEl = document.getElementById("inputEndDate");

inputStartDateEl.addEventListener('change', () => {
    let selectedStartDate = inputStartDateEl.value;
    refreshDailyProfitIncExpForm();
    inputStartDateEl.value = selectedStartDate;
    reportdailyprofitexpincome.sdate = inputStartDateEl.value;
    inputStartDateEl.classList.add("is-valid");
    document.getElementById("inputEndDate").disabled = false;
    let newcurrentDateForMinEDate = new Date(selectedStartDate);
    let minEndDate = newcurrentDateForMinEDate.setDate(newcurrentDateForMinEDate.getDate() + 1);
    inputEndDateEl.min = getDateReturned("date", minEndDate);

});

inputEndDateEl.addEventListener('change', () => {
    reportdailyprofitexpincome.edate = inputEndDateEl.value;
    inputEndDateEl.classList.remove("is-valid", "is-invalid");
    inputEndDateEl.classList.add("is-valid");
});


const dailyprofitexpincome = () => {
    let error = '';
    if (reportdailyprofitexpincome.sdate == null) {
        error = error + "Enter valid Start Date..!\n";
        inputStartDateEl.classList.add("is-invalid");
    }
    if (reportdailyprofitexpincome.edate == null) {
        error = error + "Enter valid End Date..!\n";
        inputEndDateEl.classList.add("is-invalid");
    }
    if (error == '') {
        const dataListReport = ajaxGetRequestMapping("/profitlossreportbydate/" + reportdailyprofitexpincome.sdate + "/" + reportdailyprofitexpincome.edate);
        filldateIntoDailyReportTable(dataListReport);
    } else {
        alert("Cannot analyze due to following errors : \n" + error);
    }
}

const cleardailyprofitexpincome = () => {
    refreshDailyProfitIncExpForm();
    tbodyDailyProfitIncExp.innerHTML = '';
}

const filldateIntoDailyReportTable = (oblist) => {


    const getProfitLossStatus = (ob) => {
        if (parseFloat(ob.profit) > 0) {
            return '<p style="border-radius:10px; width:80%; background-color: #287d4c;" class="p-2 text-center fw-bold">Profit</p>'
        } else if (parseFloat(ob.profit) == 0) {
            return '<p style="border-radius:10px; width:80%; background-color: #cbbe59;" class="p-2 text-center fw-bold">Even</p>'
        } else {
            return '<p style="border-radius:10px; width:80%; background-color: #b34430;" class="p-2 text-center fw-bold">Loss</p>'
        }
    }
    const getIncome = (ob) => {
        return 'LKR ' + parseFloat(ob.income).toFixed(2)
    }
    const getExpense = (ob) => {
        return 'LKR ' + parseFloat(ob.expense).toFixed(2)
    }
    const getProfit = (ob) => {
        return 'LKR ' + parseFloat(ob.profit).toFixed(2)
    }

    const displayPropertyListReceivedQuotation = [
        {dataType: 'text', propertyName: 'date'},
        {dataType: 'function', propertyName: getProfitLossStatus},
        {dataType: 'function', propertyName: getIncome},
        {dataType: 'function', propertyName: getExpense},
        {dataType: 'function', propertyName: getProfit}
    ]



    if(oblist.length>0){
        document.getElementById("dailyProfitReportTable").style.display = "block";
        fillDataIntoBillingTable("tbodyDailyProfitIncExp", oblist, displayPropertyListReceivedQuotation);
    }else{
        document.getElementById("NoRecordsMessage").style.display = 'block';
    }
}