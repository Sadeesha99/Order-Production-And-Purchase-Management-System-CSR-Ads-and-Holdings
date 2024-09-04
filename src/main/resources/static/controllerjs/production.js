//call material table refresh function
window.addEventListener('load', () => {



    logedeUSerPRIVI = ajaxGetRequestMapping("/privilege/bymodule/Production")

    refreshProductionTable();
    // Calling Refresh function to data diplay table
    refreshProductionFormFunction();




    if (!logedeUSerPRIVI.ins_privi) {
        document.getElementById("tableTabButton").click();
        document.getElementById("formTabButton").style.display = 'none';
    }


});

let listOfFormIDs = [inputProductionno, inputCustomerOrderNo, inputRequiredDate, inputProductName, inputTotalQuantity, inputCompletedQuantity, inputProductionLineNote, inputProductionStatus, inputDesignStatus];


//create function table refresh
const refreshProductionTable = () => {

    const productionWaiting = ajaxGetRequestMapping("/production/waiting/findall");
    const productionConfirmed = ajaxGetRequestMapping("/production/confirmed/findall");
    const productionOnProduction = ajaxGetRequestMapping("/production/onproduction/findall");
    const productionReady = ajaxGetRequestMapping("/production/ready/findall");
    const productionCanceled = ajaxGetRequestMapping("/production/cancel/findall");

    productionList = productionWaiting.concat(productionConfirmed,productionOnProduction,productionReady,productionCanceled);

    const displayPropertyListProduction = [
        { dataType: 'text', propertyName: 'productionno' },
        { dataType: 'text', propertyName: 'corderno' },
        { dataType: 'function', propertyName: getNameofProduct },
        { dataType: 'function', propertyName: getOrderRequiredDate },
        { dataType: 'text', propertyName: 'total_quantity' },
        { dataType: 'text', propertyName: 'completed_quantity' },
        { dataType: 'fileview', propertyName: getViewDesignFile },
        { dataType: 'function', propertyName: getProductionStatus }

    ]
    //call filldataintotable function
    //(tableId,dataList)
    fillDataIntoProductionTable("tbodyProduction", productionList, displayPropertyListProduction, editProduct, printProduct, viewProduct, confirmProduction, logedeUSerPRIVI);
    new DataTable('#tableProduction');
    document.getElementById("tableProduction").style.width = "100%";

}

const getProductionStatus = (ob) => {

    if (ob.production_status_id.id == 1) {  /*Waiting*/
        return '<p style="border-radius:10px; background-color: #d2ac14;" class="p-2 text-center fw-bold">' + ob.production_status_id.name + '</p>'
    }
    if (ob.production_status_id.id == 2) {  /*Confirmation*/
        return '<p style="border-radius:10px; background-color: #a6d214;" class="p-2 text-center fw-bold">' + ob.production_status_id.name + '</p>'
    }
    if (ob.production_status_id.id == 3) {  /*On-Production*/
        return '<p style="border-radius:10px; background-color: #1460d2;" class="p-2 text-center fw-bold">' + ob.production_status_id.name + '</p>'
    }
    if (ob.production_status_id.id == 4) {  /*Ready*/
        return '<p style="border-radius:10px; background-color: #1dd214;" class="p-2 text-center fw-bold">' + ob.production_status_id.name + '</p>'
    }
    if (ob.production_status_id.id == 5) {  /*Canceled*/
        return '<p style="border-radius:10px; background-color: #d21414;" class="p-2 text-center fw-bold">' + ob.production_status_id.name + '</p>'
    }

}

const getOrderRequiredDate = (ob) =>{
    let cOrderOFOB = ajaxGetRequestMapping('/customerorder/bycorderno/'+ob.corderno);
    return cOrderOFOB.required_date;
}

const getNameofProduct = (ob) => {
    return ob.product_id.name;
}



const getViewDesignFile = (ob) => {
    if (ob.design_id == null || !ob.design_id.design_file || ob.design_id.design_file == null) {
        nofileMessageReturn();
    } else {
        let designFile = atob(ob.design_id.design_file);
        openFileWithHtmlContent(designFile);
    }
}



const refreshProductionFormFunction = () => {
    production = new Object();

    productionStatusList = ajaxGetRequestMapping("/production/status/list");
    fillDataIntoSelect(inputProductionStatus, "Select Production status", productionStatusList, 'name');


    document.getElementById("openDesignFileBtn").style.display = 'flex';
    document.getElementById("inputCurrentQuantity").classList.remove('is-valid','is-invalid');
    document.getElementById("inputProductionLineNote").classList.remove('is-valid','is-invalid');
    document.getElementById("formEditable").style.pointerEvents = "auto";


}




//customer form refill with database object
const productionFormRefill = (ob) => {

    production = JSON.parse(JSON.stringify(ob));
    oldproduction = JSON.parse(JSON.stringify(ob));

    refillInnerTable(ob);

    inputProductionno.value = ob.productionno;
    document.getElementById("inputProductionno").style.borderColor = "#06cc7d";

    inputCustomerOrderNo.value = ob.corderno;
    document.getElementById("inputCustomerOrderNo").style.borderColor = "#06cc7d";

    inputRequiredDate.value = '';//ajaxGetRequestMapping("/getdatebyinvno/"+ob.corderno);
    document.getElementById("inputRequiredDate").style.borderColor = "#06cc7d";

    inputProductName.value = ob.product_id.name;
    document.getElementById("inputProductName").style.borderColor = "#06cc7d";

    inputTotalQuantity.value = ob.total_quantity;
    document.getElementById("inputTotalQuantity").style.borderColor = "#06cc7d";

    inputCompletedQuantity.value = ob.completed_quantity;
    document.getElementById("inputCompletedQuantity").style.borderColor = "#06cc7d";

    if (ob.production_line_note != null) {
        inputProductionLineNote.value = ob.production_line_note;
        document.getElementById("inputProductionLineNote").style.borderColor = "#06cc7d";
    }


    fillDataIntoSelect(inputProductionStatus, "Select Production status", productionStatusList, 'name', ob.production_status_id.name);
    document.getElementById("inputProductionStatus").style.borderColor = "#06cc7d";

    if (!ob.design_id || ob.design_id == null) {
        document.getElementById("openDesignFileBtn").style.display = 'none';
        inputDesignStatus.value = "No-Design"
    } else {
        if (!ob.design_id.design_file || ob.design_id.design_file == null) {
            document.getElementById("openDesignFileBtn").style.display = 'flex';
            document.getElementById("openDesignFileBtn").onclick = function () {
                nofileMessageReturn();
            };
            inputDesignStatus.value = ob.design_id.design_status_id.name;
        } else {
            document.getElementById("openDesignFileBtn").style.display = 'flex';
            document.getElementById("openDesignFileBtn").onclick = function () {
                let designFile = atob(ob.design_id.design_file);
                openFileWithHtmlContent(designFile);
            };
            inputDesignStatus.value = ob.design_id.design_status_id.name;
        }
    }
    document.getElementById("inputDesignStatus").style.borderColor = "#06cc7d";

    production.current_quantity = null;

    document.getElementById("backButtonDivForm").style.display = 'block';
    



}


//Create function for delete material record
const printProduct = (obj) => {

    const corderOject = ajaxGetRequestMapping("/customerorder/bycorderno/"+obj.corderno);

    const productionLogList= ajaxGetRequestMapping("/productionlogs/byproductionid/"+obj.id);

    const materialLogList = ajaxGetRequestMapping("/inventorylogs/byproductionid/"+obj.id);


    const getInventoryLoggedDate = (ob) => {
        return (ob.logged_time).toString().split('T')[0];
    }
    const getInventoryLoggedTime = (ob) => {
        return (ob.logged_time).toString().split('T')[1];
    }
    const getProcessedQuantity = (ob) => {
        return (ob.logged_quantity);
    }
    const getMaterialName = (ob) => {
        return (ob.material_id.name);
    }
    const getMaterialNo = (ob) => {
        return (ob.material_id.matno);
    }


    const getProductionQuantity = (ob) => {
        return (ob.production_quantity);
    }
    const getLoggedDate = (ob) => {
        return (ob.logged_time).toString().split('T')[0];
    }
    const getLoggedTime = (ob) => {
        return (ob.logged_time).toString().split('T')[1];
    }
    const getTotalQuantity = (ob) => {
        return (ob.production_id.total_quantity);
    }
    const getTotalCompleted = (ob) => {
        return (ob.after_log_quantity);
    }


    const displayPropertyList1 = [
        { dataType: 'function', propertyName: getLoggedDate },
        { dataType: 'function', propertyName: getLoggedTime },
        { dataType: 'function', propertyName: getTotalQuantity },
        { dataType: 'function', propertyName: getProductionQuantity },
        { dataType: 'function', propertyName: getTotalCompleted }
    ]

    const displayPropertyList2 = [
        { dataType: 'function', propertyName: getMaterialName },
        { dataType: 'function', propertyName: getMaterialNo },
        { dataType: 'function', propertyName: getInventoryLoggedDate },
        { dataType: 'function', propertyName: getInventoryLoggedTime },
        { dataType: 'function', propertyName: getProcessedQuantity }
    ]

    if (productionLogList != null && productionLogList.length > 0) {
        fillDataIntoReportTable("tbodyForProductionReport1", productionLogList, displayPropertyList1);
        fillDataIntoReportTable("tbodyForProductionReport2", materialLogList, displayPropertyList2);
        const productionlogListTableContent = document.getElementById("tbodyForProductionReport1").innerHTML;
        const materialLogListTableContent = document.getElementById("tbodyForProductionReport2").innerHTML;
        printProductionReport(corderOject, obj, productionlogListTableContent,materialLogListTableContent);
    } else {
        alert("No production activities found..!");
    }

    

}

//function for edit product button
const editProduct = (ob) => {
    let materialAvalability = true;
    ob.productionHasMaterialList.forEach(element => {
        if(element.req_quantity>element.available_quantity){
            materialAvalability = false;
        }
    });

    if(materialAvalability){
        ClearProductionFormButtonFunction();
        refreshProductionFormFunction();
        editButtonFunction(productionFormRefill, ob, "tableTabButton", "formAddBtn", "formUpdateBtn", "formRestBtn", ClearProductionFormButtonFunction);
        document.getElementById("formTabButton").click();
    }else{
        alert("Production cannot be updated. Available material quantity is less than required quantity..!");
        viewProduct(ob);
    }


}
//Create function for view product record
const viewProduct = (ob) => {
    ClearProductionFormButtonFunction();
    refreshProductionFormFunction();
    viewButtonFunction(productionFormRefill, ob, "tableTabButton", "formAddBtn", "formUpdateBtn", "formRestBtn", ClearProductionFormButtonFunction);
    document.getElementById("formEditable").style.pointerEvents = "none";
    document.getElementById("openDesignFileBtn").style.pointerEvents = "auto";
    document.getElementById("formTabButton").click();

}

const confirmProduction = (ob) => {
    if(ob.production_status_id.id != 1){
        alert("This is no in waiting status.. So it can't be confirmed again..")
    }
    const confirmProduction = confirm('Are you sure to confirm following production..? \n'
        + '\n Production No : ' + ob.productionno
        + '\n Order No. : ' + ob.corderno);
    if(confirmProduction){
        const confirmOrderSeverResponse = ajaxPutRequestMapping("/confirmproduction",ob);
        if (confirmOrderSeverResponse=="OK") {
            alert('Update Successfully..!');
            refreshProductionTable();
        }else{
            alert('Update not completed, You have following error\n' + confirmOrderSeverResponse);
        }
    }else{
        alert('Update not completed, Request was canceled..');
    }
}

//back button in product form
const backButtonProductionForm = () => {
    backButtonFunctionForm("tableTabButton", "formAddBtn", "formUpdateBtn", "formRestBtn", ClearProductionFormButtonFunction)
    document.getElementById("backButtonDivForm").style.display = 'none';
    refreshProductionFormFunction();
    ClearProductionFormButtonFunction();
}




const checkProductionFormError = () => {
    let error = '';
    if (production.current_quantity == null) {
        error = error + "Enter Valid Customer..!\n";
        inputCustomerMobile.classList.add("is-invalid");
    }
    return error;
}
const checkProductionFormUpdates = () => {

    let updates = '';

    if (parseFloat(production.current_quantity) != parseFloat(oldproduction.current_quantity)) {
        updates = updates + "Production Quantity added is : "+production.current_quantity+".\n";
    }
    if (production.production_line_note != oldproduction.production_line_note) {
        updates = updates + "Production line note is changed to : "+production.production_line_note+".\n";
    }
    if (production.production_status_id.id != oldproduction.production_status_id.id) {
        updates = updates + "Production Status is changed to : "+production.production_status_id.name+".\n";
    }
    return updates;
}



//define function for submit product
const updateProduction = () => {
    // console.log("Submit");
    //console.log(Product);
    const errors = checkProductionFormError();

    if (errors == '') {
        let updatesOfProduction = checkProductionFormUpdates();
        if(updatesOfProduction!=''){
            let confirmProductionUpdate = confirm('Are you sure to add following updates..? \n'+updatesOfProduction);
            // need to get user confirmation
            if (confirmProductionUpdate) {
                //console.log(product);
                const productionPostServiceResponse = ajaxPutRequestMapping("/production",production);
                if (productionPostServiceResponse == "OK") {
                    alert("Save Successefully..!")
                    //refresh table
                    refreshProductionTable();
                    //call form refresh function
                    refreshProductionFormFunction();
                    //back button function button
                    backButtonProductionForm();
                } else {
                    alert("Update was unsuccessful.. !\n" + " Reason : " + productionPostServiceResponse);
                }
            } else {
                alert("Production Update canceled..");
            }
        }else {
            alert("Nothing to Update..");
        }
    } else {
        alert("Form has following errors : \n" + errors)
    }
}


const ClearProductionFormButtonFunction = () => {
    tbodyMatListInner.innerHTML = '';
    ClearFormFunction("formProduction", refreshProductionFormFunction, listOfFormIDs);
    listOfFormIDs.forEach(element => {
        element.borderColor = "#ced4da";
    });
}


const refillInnerTable = (obj) => {
    const getMaterialNo = (el) => {
        return (el.material_id.matno);
    }

    const getMaterialName = (el) => {
        return (el.material_id.name);
    }

    let displayPropertyListPrdhasM = [
        { dataType: 'function', propertyName: getMaterialNo },
        { dataType: 'function', propertyName: getMaterialName },
        { dataType: 'text', propertyName: 'req_quantity' },
        { dataType: 'text', propertyName: 'available_quantity' }
    ];

    fillDataIntoTable3("tbodyMatListInner", obj.productionHasMaterialList, displayPropertyListPrdhasM);

}

const quantityEl = document.getElementById("inputCurrentQuantity");
quantityEl.addEventListener('keyup', () => {
    if (quantityEl.value != "" || quantityEl.classList.contains('is-valid')) {
        if(parseFloat(quantityEl.value)<=(parseFloat(production.total_quantity)-parseFloat(production.completed_quantity))){
            production.current_quantity = parseFloat(quantityEl.value).toFixed(2);
            quantityEl.classList.remove('is-invalid');
            quantityEl.classList.add('is-valid');
            if (parseFloat(quantityEl.value)<(parseFloat(production.total_quantity)-parseFloat(production.completed_quantity))){
                fillDataIntoSelect(inputProductionStatus, "Select Production status", productionStatusList, 'name',"On-Production");
                selectDynamicValidator(inputProductionStatus, 'production', "production_status_id");
            }else{
                fillDataIntoSelect(inputProductionStatus, "Select Production status", productionStatusList, 'name',"Ready");
                selectDynamicValidator(inputProductionStatus, 'production', "production_status_id");
            }

        }else{
            production.current_quantity = null;
            quantityEl.classList.remove('is-valid');
            quantityEl.classList.add('is-invalid');
            fillDataIntoSelect(inputProductionStatus, "Select Production status", productionStatusList, 'name',oldproduction.production_status_id.name);
            selectDynamicValidator(inputProductionStatus, 'production', "production_status_id");
            document.getElementById("inputProductionStatus").classList.remove('is-valid');
            document.getElementById("inputProductionStatus").classList.remove('is-valid');
            document.getElementById("inputProductionStatus").style.borderColor = "#06cc7d";

        }
    }else{
        production.current_quantity = null;
        quantityEl.classList.remove('is-valid');
        quantityEl.classList.add('is-invalid');
        fillDataIntoSelect(inputProductionStatus, "Select Production status", productionStatusList, 'name',oldproduction.production_status_id.name);
        selectDynamicValidator(inputProductionStatus, 'production', 'production_status_id');
        document.getElementById("inputProductionStatus").classList.remove("is-valid");
        document.getElementById("inputProductionStatus").classList.remove("is-invalid");
        document.getElementById("inputProductionStatus").style.borderColor = "#06cc7d";
    }
});

