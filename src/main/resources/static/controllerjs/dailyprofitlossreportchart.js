//call material table refresh function
window.addEventListener('load', () => {


    refreshDailyProfitIncExpForm();


});


const refreshDailyProfitIncExpForm = () => {

    reportdailyprofitexpincome = new Object;

    let currentDateForMinSDate = new Date();
    let currentDateForMaxSDate = new Date();

    let minStartDate = currentDateForMinSDate.setDate(currentDateForMinSDate.getDate() - 60);
    let maxStartDate = currentDateForMaxSDate.setDate(currentDateForMaxSDate.getDate() - 1);
    inputStartDate.min = getDateReturned("date", minStartDate);
    inputStartDate.max = getDateReturned("date", maxStartDate);

    let currentDateForMinEDate = new Date();
    let currentDateForMaxEDate = new Date();
    let minEndDate = currentDateForMinEDate.setDate(currentDateForMinEDate.getDate() - 59);
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
    document.getElementById("reportChart").innerHTML = '';

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
        filldateIntoReportChartFunction(dataListReport);
    } else {
        alert("Cannot analyze due to following errors : \n" + error);
    }
}

const cleardailyprofitexpincome = () => {
    refreshDailyProfitIncExpForm();
    document.getElementById("reportChart").innerHTML = '';
}


const filldateIntoReportChartFunction = (oblist) => {

    if (oblist.length > 0) {
        if (oblist.length > 100) {
            let confirmDisplay = confirm("Number of records in between to days you have selected is more than 100."
                + "\n This might affect view of the chart. Are you sure you want to view all of it ?"
            )
            if (confirmDisplay) {
                document.getElementById("dailyProfitReportTable").style.display = "flex";
                const ArrayOB = generate4Arrays(oblist,"date","income","expense","profit")


                const XAxes = ArrayOB.array1;

                const yAxesRow1 = ArrayOB.array2;
                let yAxes1 = [];
                yAxesRow1.forEach(el=>{
                    yAxes1.push(parseFloat(el));
                })
                const yAxesRow2 = ArrayOB.array3;
                let yAxes2 = [];
                yAxesRow2.forEach(el=>{
                    yAxes2.push(parseFloat(el));
                })
                const yAxesRow3 = ArrayOB.array4;
                let yAxes3 = [];
                yAxesRow3.forEach(el=>{
                    yAxes3.push(parseFloat(el));
                })
                fillDataIntoGroupedBarChart("reportChart", XAxes, yAxes1,yAxes2,yAxes3, "Daily Profit Loss Report")

            } else {
                alert("Chart generation canceled");
                cleardailyprofitexpincome();
            }
        } else {
            document.getElementById("dailyProfitReportTable").style.display = "flex";
            const ArrayOB = generate4Arrays(oblist,"date","income","expense","profit")


            const XAxes = ArrayOB.array1;

            const yAxesRow1 = ArrayOB.array2;
            let yAxes1 = [];
            yAxesRow1.forEach(el=>{
                yAxes1.push(parseFloat(el));
            })
            const yAxesRow2 = ArrayOB.array3;
            let yAxes2 = [];
            yAxesRow2.forEach(el=>{
                yAxes2.push(parseFloat(el));
            })
            const yAxesRow3 = ArrayOB.array4;
            let yAxes3 = [];
            yAxesRow3.forEach(el=>{
                yAxes3.push(parseFloat(el));
            })
            fillDataIntoGroupedBarChart("reportChart", XAxes, yAxes1,yAxes2,yAxes3, "Daily Profit Loss Report")
        }

    } else {
        document.getElementById("NoRecordsMessage").style.display = 'block';
    }


}