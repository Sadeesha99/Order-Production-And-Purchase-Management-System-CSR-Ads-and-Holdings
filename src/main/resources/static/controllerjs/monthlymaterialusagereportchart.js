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
    document.getElementById("reportChart").innerHTML = '';

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
        filldateIntoReportChartFunction(dataListReport);
    } else {
        alert("Cannot analyze due to following errors : \n" + error);
    }
}

const clearmaterialusagereport = () => {
    refreshMaterialUsageReportForm();
    document.getElementById("reportChart").innerHTML = '';

}

const filldateIntoReportChartFunction = (oblist) => {

    if (oblist.length > 0) {
        if (oblist.length > 100) {
            let confirmDisplay = confirm("Number of records in between to days you have selected is more than 100."
                + "\n This might affect view of the chart. Are you sure you want to view all of it ?"
            )
            if (confirmDisplay) {
                document.getElementById("MaterialUsageReportTableDiv").style.display = "flex";
                const XandYaxis = generateXandYValue(oblist, "date", "materialusage");
                const xAxesRaw = XandYaxis.xAxesArray;
                let labels = [];
                for (let index = 0; index < xAxesRaw.length; index++) {
                    let matOB = ajaxGetRequestMapping("/materialbyid/"+parseInt(oblist[index].material_id));
                    const element = matOB.name ;
                    labels.push(element);
                }

                const yAxesRow = XandYaxis.yAxesArray;
                let yAxes = [];
                yAxesRow.forEach(el=>{
                    yAxes.push(parseFloat(el))
                })

                console.log(labels);
                console.log(yAxes);
                console.log(xAxesRaw);
                fillDataIntoSingleBarChart("reportChart", xAxesRaw, yAxes, labels, "Monthly Material Usage Report");
            } else {
                alert("Chart generation canceled");
                clearmaterialusagereport();
            }
        } else {
            document.getElementById("MaterialUsageReportTableDiv").style.display = "flex";
            const XandYaxis = generateXandYValue(oblist, "date", "materialusage");
            const xAxesRaw = XandYaxis.xAxesArray;
            let labels = [];
            for (let index = 0; index < xAxesRaw.length; index++) {
                let matOB = ajaxGetRequestMapping("/materialbyid/"+parseInt(oblist[index].material_id));
                const element = matOB.name ;
                labels.push(element);
            }

            const yAxesRow = XandYaxis.yAxesArray;
            let yAxes = [];
            yAxesRow.forEach(el=>{
                yAxes.push(parseFloat(el))
            })

            console.log(labels);
            console.log(yAxes);
            console.log(xAxesRaw);
            fillDataIntoSingleBarChart("reportChart", xAxesRaw, yAxes, labels, "Monthly Material Usage Report");
        }

    } else {
        document.getElementById("NoRecordsMessage").style.display = 'block';
    }


}