window.addEventListener('load', () => {

    logedeUserPRIVIForQR = ajaxGetRequestMapping("/privilege/bymodule/QuotationRequest");


    refreshQuotationRequestTable();
    // Calling Refresh function to data diplay table
    refreshQuotationRequestForm();


    if (!logedeUserPRIVIForQR.ins_privi) {
        document.getElementById("tableTabButton").click();
        document.getElementById("formTabButton").style.display = 'none';
    }

    supplierSelected = null;

});


//create function table refresh
const refreshQuotationRequestTable = () => {

    const quotationRequestRequested = ajaxGetRequestMapping("/quotationrequest/requested/findall");
    const quotationRequestReceived = ajaxGetRequestMapping("/quotationrequest/received/findall");
    const quotationRequestInvalid = ajaxGetRequestMapping("/quotationrequest/invalid/findall");

    quotationRequestList = quotationRequestRequested.concat(quotationRequestReceived, quotationRequestInvalid);

    const displayPropertyListQuotationRequest = [
        {dataType: 'text', propertyName: 'quot_req_no'},
        {dataType: 'function', propertyName: getQuotationStatus},
        {dataType: 'function', propertyName: getSupplierName},
        {dataType: 'function', propertyName: getSupplierStatus},
        {dataType: 'text', propertyName: 'required_date'}
    ]
    //call filldataintotable function
    //(tableId,dataList)
    fillDataIntoTable2("tbodyQuotationRequest", quotationRequestList, displayPropertyListQuotationRequest, viewQuotationRequest, cancelQuotationRequest, printQuotationRequest, true, logedeUserPRIVIForQR);
    new DataTable('#tableQuotationRequest');
    document.getElementById("tableQuotationRequest").style.width = "100%";

}

const getQuotationStatus = (ob) => {

    if (ob.quotation_request_status_id.name == "Requested") {
        return '<p style="border-radius:10px; width:80%; background-color: #a1940d;" class="p-2 text-center fw-bold">' + ob.quotation_request_status_id.name + '</p>'
    }
    if (ob.quotation_request_status_id.name == "Received") {
        return '<p style="border-radius:10px; width:80%; background-color: #3d781e;" class="p-2 text-center fw-bold">' + ob.quotation_request_status_id.name + '</p>'
    }
    if (ob.quotation_request_status_id.name == "Invalid") {
        return '<p style="border-radius:10px; width:80%; background-color: #a33729;" class="p-2 text-center fw-bold">' + ob.quotation_request_status_id.name + '</p>'
    }

}

const getSupplierStatus = (ob) => {
    if (ob.supplier_id.supplier_status_id.name == 'Active') {
        return '<p style="border-radius:10px; width:80%" class="bg-success p-2 text-center fw-bold">' + ob.supplier_id.supplier_status_id.name + '</p>'
    }
    if (ob.supplier_id.supplier_status_id.name == 'In-Active') {
        return '<p style="border-radius:10px; width:80%" class="bg-warning p-2 text-center fw-bold">' + ob.supplier_id.supplier_status_id.name + '</p>'
    }
    if (ob.supplier_id.supplier_status_id.name == 'Deleted') {
        return '<p style="border-radius:10px; width:80%;" class="bg-danger p-2 text-center fw-bold">' + ob.supplier_id.supplier_status_id.name + '</p>'
    }
}

const getSupplierName = (ob) => {
    return ob.supplier_id.businessname;
}


const refreshQuotationRequestForm = () => {
    quotationrequest = new Object();
    supplierList = ajaxGetRequestMapping("/quotationrequest/supplierswithoutqrreq");

    quotationRequestStatus = ajaxGetRequestMapping("/quotationrequest/status");

    fillDataIntoSelect(inputQuotationRequestStatus, "Select Quotation Request Status", quotationRequestStatus, 'name');

    let currentDate = new Date().toLocaleDateString('en-CA');
    document.getElementById("inputRequiredDate").setAttribute("min", currentDate);
    let currentDateForMax = new Date();
    currentDateForMax.setDate(currentDateForMax.getDate() + 30);
    inputRequiredDate.max = getDateReturned("date", currentDateForMax);

    document.getElementById("inputQuotationRequestStatus").disabled = true;
    document.getElementById('inputRequiredDate').disabled = true;
    document.getElementById("tableDivInnerForm").style.display = 'none';

    document.getElementById("backButtonDivFormFirst").style.display = 'none';

    document.getElementById("formEditable").style.pointerEvents = "auto";

}


//Create function for view product record
const printQuotationRequest = (ob) => {
    fillMaterialInnerTable(ob.supplier_id.assignedMaterialList);
    let tableContent = document.getElementById("tbodyInnerFormMaterial").innerHTML;
    printQuotationRequestLetter(ob, tableContent);
    ClearQuotationReqFormButtonFunction();

}

const viewQuotationRequest = (ob) => {
    refreshQuotationRequestForm();
    viewButtonFunction(refillDataIntoForm, ob, "tableTabButton", "formAddBtn", "formUpdateBtn", "formRestBtn", ClearQuotationReqFormButtonFunction);
    document.getElementById("backButtonDivFormFirst").style.display = 'block';
    document.getElementById("formEditable").style.pointerEvents = "none";
}

const cancelQuotationRequest = (ob) => {

    if (ob.quotation_request_status_id.name == "Requested") {
        //get user confirmation
        const cancelQuotationRequest = confirm('Are you sure to delete following Quotation Request..? \n'
            + '\n Supplier Name : ' + ob.supplier_id.businessname
            + '\n Required Date : ' + ob.required_date);
        if (cancelQuotationRequest) {
            const cancelQuotationRequestServiceResponse = ajaxDelRequestMapping("/quotationrequest",ob);
            if (cancelQuotationRequestServiceResponse == 'OK') {
                alert('Canceled Successfully..!');
                //refresh table
                refreshQuotationRequestTable();
            } else {
                alert("Cancelation was not sucessful.. !\n" + cancelQuotationRequestServiceResponse);
            }
        } else {
            alert('Cancelation not completed..!');
        }
    } else {
        alert("Quotation Request can only be deleted at requested state..!")
    }
}


const backButtonQuotationRequestForm = () => {
    backButtonFunctionForm("tableTabButton", "formAddBtn", "formUpdateBtn", "formRestBtn", ClearQuotationReqFormButtonFunction)
    document.getElementById("backButtonDivFormFirst").style.display = 'none';
    refreshQuotationRequestForm();
}


const checkQuotationRequestFormError = () => {
    let error = '';
    if (quotationrequest.supplier_id == null) {
        error = error + "Enter Valid Supplier..!\n";
        inputSupplierName.classList.add("is-invalid");
        inputSupplierNo.classList.add("is-invalid");
    }
    if (quotationrequest.required_date == null) {
        error = error + "Enter valid required date..!\n";
        inputRequiredDate.classList.add("is-invalid");
    }
    if (quotationrequest.quotation_request_status_id == null) {
        error = error + "Total Bill is included..!\n";
        inputQuotationRequestStatus.classList.add("is-invalid");
    }
    return error;
}


const submitQuotationRequest = () => {

    const errors = checkQuotationRequestFormError();

    if (errors === '') {
        let confirmQuotationRequestSubmit = confirm('Are you sure to add following product..?'
            + '\n Supplier Name : ' + quotationrequest.supplier_id.businessname
            + '\n Required Date : ' + quotationrequest.required_date);
        // need to get user confirmation
        if (confirmQuotationRequestSubmit) {
            const qrPostServiceResponse = ajaxPostRequestMapping("/quotationrequest",quotationrequest);
            if (qrPostServiceResponse == "OK") {
                alert("Save Successefully..!")
                //refresh table
                refreshQuotationRequestTable();
                //click button to back
                ClearQuotationReqFormButtonFunction();
                //call form refresh function
                refreshQuotationRequestForm();
                //back button function button
                backButtonQuotationRequestForm();
            } else {
                alert("Submitting Quotation Request was not successful.. !\n" + " Reason : " + qrPostServiceResponse);
            }
        } else {
            alert("Quotation Request entry canceled..");
        }

    } else {
        alert("Form has following errors : \n" + errors)
    }
}

let listOfFormIDs = [inputSupplierName, inputSupplierNo, inputRequiredDate, inputQuotationRequestStatus,inputQRNo];
const ClearQuotationReqFormButtonFunction = () => {
    tbodyInnerFormMaterial.innerHTML = '';
    ClearFormFunction("formQuotationRequest", refreshQuotationRequestForm, listOfFormIDs);
    document.getElementById("tableDivInnerForm").style.display = 'none';
}


//--------------------------------- Fill Material Inner Form Functions ----------------------------------------------------------------------------------

const fillMaterialInnerTable = (matObList) => {
    const getMaterial = (ob) => {
        return ob.name;
    }
    const getMaterialNo = (ob) => {
        return ob.matno;
    }
    const getReOrderQuantity = (ob) => {
        return ob.reorder_quantity;
    }
    const displayPropertyListMatInner = [
        {dataType: 'function', propertyName: getMaterialNo},
        {dataType: 'function', propertyName: getMaterial},
        {dataType: 'function', propertyName: getReOrderQuantity}
    ]

    fillDataIntoTable3('tbodyInnerFormMaterial', matObList, displayPropertyListMatInner);

    document.getElementById("tableDivInnerForm").style.display = 'block';

}

//--------------------------------- Fill Material Inner Form Functions Ends -----------------------------------------------------------------------------


let inputSupplierNameEl = document.getElementById("inputSupplierName");
let resultDivSupplierName = document.getElementById("divResultBySupplierName");


//--------------------------------- Customer Search Functions ----------------------------------------------------------------------------------


const onclickSupplierFunction = (ob) => {
    ClearQuotationReqFormButtonFunction();
    inputSupplierName.value = ob.businessname;
    document.getElementById('inputSupplierName').classList.remove("is-invalid");
    document.getElementById('inputSupplierName').classList.add('is-valid');
    inputSupplierNo.value = ob.supplierno;
    document.getElementById('inputSupplierNo').classList.remove("is-invalid");
    document.getElementById('inputSupplierNo').classList.add('is-valid');
    document.getElementById('inputRequiredDate').disabled = false;
    fillMaterialInnerTable(ob.assignedMaterialList);
    supplierSelected = ob;
    quotationrequest.supplier_id = ob;
}


inputSupplierNameEl.addEventListener('click', () => {
    if (supplierList == null || supplierList.length == 0) {
        noresultList = [{name: "No Result to Show"}]
        const noresultFunction = () => {
            resultDivSupplierName.innerHTML = '';
        }
        displaySearchList(noresultList, resultDivSupplierName, 'name', '', noresultFunction);

    } else {
        if (inputSupplierNameEl.value == '' || inputSupplierNameEl == null) {
            inputSupplierNameEl.classList.remove("is-invalid");
            inputSupplierNameEl.classList.remove("is-valid");
        }
        displaySearchList(supplierList, resultDivSupplierName, 'businessname', 'supplierno', onclickSupplierFunction);

    }
});

inputSupplierNameEl.addEventListener('keyup', () => {


    if (supplierList == null || supplierList.length == 0) {

    } else {

        if (inputSupplierNameEl.value == null || inputSupplierNameEl.value == "") {
            displaySearchList(supplierList, resultDivSupplierName, 'businessname', 'supplierno', onclickSupplierFunction);
            let listofFieldsCustomerOrder_ID = [inputSupplierName, inputSupplierNo]
            listofFieldsCustomerOrder_ID.forEach(element => {
                element.value = '';
                element.classList.remove('is-invalid');
                element.classList.remove('is-valid');
            });
            inputSupplierNameEl.classList.remove("is-invalid");
            inputSupplierNameEl.classList.remove("is-valid");
            ClearQuotationReqFormButtonFunction();

        } else {

            let searchResult = (searchFunction(supplierList, inputSupplierNameEl, 'businessname'));
            displaySearchList(searchResult, resultDivSupplierName, 'businessname', 'supplierno', onclickSupplierFunction);
            if (inputSupplierNameEl.classList.contains('is-invalid')) {
                resultDivSupplierName.innerHTML = '';

            }
        }
    }
});
//--------------------------------- Customer Search Functions Ends -----------------------------------------------------------------------------


//---------------------------------- OnClick Body Function ---------------------------------------------------------------------


document.body.addEventListener('click', (event) => {
    // Check if the click target is not the input field or its descendant
    if (!(inputSupplierNameEl.contains(event.target))) {
        resultDivSupplierName.innerHTML = '';
        if (supplierSelected || supplierSelected != null) {
            if (inputSupplierNameEl.classList.contains('is-invalid')) {
                onclickSupplierFunction(supplierSelected);
            } else if (document.getElementById("inputSupplierName").classList.contains('is-valid')) {
                document.getElementById("inputSupplierName").value = supplierSelected.businessname;
                document.getElementById('inputSupplierName').classList.remove("is-invalid");
                document.getElementById('inputSupplierName').classList.add('is-valid');
            }
        } else {
            if (inputSupplierNameEl.value == '') {
                inputSupplierNameEl.classList.remove("is-valid");
                inputSupplierNameEl.classList.remove("is-invalid");
            } else {
                inputSupplierNameEl.classList.remove("is-valid");
                inputSupplierNameEl.classList.add("is-invalid");
            }
        }
    }

});

//---------------------------------- OnClick Body Function Ends ----------------------------------------------------------------


document.getElementById('inputRequiredDate').addEventListener('change', () => {
    quotationrequest.required_date = document.getElementById('inputRequiredDate').value;
    document.getElementById('inputRequiredDate').classList.remove("is-invalid");
    document.getElementById('inputRequiredDate').classList.add("is-valid");
    fillDataIntoSelect(inputQuotationRequestStatus, "Select Quotation Request Status", quotationRequestStatus, 'name', 'Requested');
    selectDynamicValidator(inputQuotationRequestStatus, 'quotationrequest', 'quotation_request_status_id');

});


const refillDataIntoForm = (ob) => {
    supplierSelected = ob.supplier_id;
    document.getElementById("inputSupplierName").value = ob.supplier_id.businessname;
    document.getElementById("inputQRNo").value = ob.quot_req_no;
    document.getElementById("inputSupplierName").classList.add('is-valid');
    document.getElementById("inputSupplierNo").value = ob.supplier_id.supplierno;
    document.getElementById("inputSupplierNo").classList.add('is-valid');
    document.getElementById("inputRequiredDate").value = ob.required_date;
    document.getElementById("inputRequiredDate").classList.add('is-valid');
    fillDataIntoSelect(inputQuotationRequestStatus, "Select Quotation Request Status", quotationRequestStatus, 'name', 'Requested');
    document.getElementById("inputQuotationRequestStatus").classList.add('is-valid');
    fillMaterialInnerTable(ob.supplier_id.assignedMaterialList);

    document.getElementById("formTabButton").click();

}
