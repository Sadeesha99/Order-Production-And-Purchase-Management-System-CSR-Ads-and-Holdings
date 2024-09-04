//call material table refresh function
window.addEventListener('load', () => {

    logedeUSerPRIVIReceivedQuotation = ajaxGetRequestMapping("/privilege/bymodule/ReceivedQuotation")


    refreshReceivedQuotationTable();
    // Calling Refresh function to data diplay table
    refreshReceivedQuotationForm();




    if (!logedeUSerPRIVIReceivedQuotation.ins_privi) {
        document.getElementById("tableTabButton").click();
        document.getElementById("formTabButton").style.display = 'none';
    }

    quotationRequestSelected = null;

});



//create function table refresh
const refreshReceivedQuotationTable = () => {

    const  validReceivedQuotationList = ajaxGetRequestMapping("/receivedquotation/valid");
    const  invalidReceivedQuotationList = ajaxGetRequestMapping("/receivedquotation/invalid");
    receivedQuotationList = validReceivedQuotationList.concat(invalidReceivedQuotationList);

    const displayPropertyListReceivedQuotation = [
        { dataType: 'text', propertyName: 'received_quot_no' },
        { dataType: 'function', propertyName: getSupplierName },
        { dataType: 'function', propertyName: getQuotationNo },
        { dataType: 'text', propertyName: 'received_date' },
        { dataType: 'text', propertyName: 'expire_date' },
        { dataType: 'function', propertyName: getReceivedQuotationStatus }
    ]

    //call filldataintotable function
    fillDataIntoTable2("tbodyReceivedQuotation", receivedQuotationList, displayPropertyListReceivedQuotation, viewQuotationRequest, cancelReceivedQuotation, printQuotationRequest, true, logedeUSerPRIVIReceivedQuotation);
    new DataTable('#tableReceivedQuotation');
    document.getElementById("tableReceivedQuotation").style.width = "100%";

}

const getReceivedQuotationStatus = (ob) => {

    if (ob.received_quotation_status_id.name == "Valid") {
        return '<p style="border-radius:10px; width:80%; background-color: #3d781e;" class="p-2 text-center fw-bold">' + ob.received_quotation_status_id.name + '</p>'
    }
    if (ob.received_quotation_status_id.name == "Invalid") {
        return '<p style="border-radius:10px; width:80%; background-color: #a33729;" class="p-2 text-center fw-bold">' + ob.received_quotation_status_id.name + '</p>'
    }

}

const getSupplierName = (ob) => {
    return ob.quotation_request_id.supplier_id.businessname;
}

const getQuotationNo = (ob) => {
    return ob.quotation_request_id.quot_req_no;
}




const refreshReceivedQuotationForm = () => {

    receivedquotation = new Object();

    receivedquotation.receivedQuotationHasMaterialList = [];


    listOFQRequest = ajaxGetRequestMapping("/quotationrequest/requested/findall");

    receivedQuotationStatus = ajaxGetRequestMapping("/receivedquotation/status");

    fillDataIntoSelect(inputReceivedQuotationStatus, "Select Received Quotation Status", receivedQuotationStatus, 'name');

    let currentDate = new Date().toLocaleDateString('en-CA');
    let currentDateForMax = new Date();

    document.getElementById("inputReceivedDate").setAttribute("max", currentDate);
    let minReceivedDate = currentDateForMax.setDate(currentDateForMax.getDate() - 4);
    inputReceivedDate.min = getDateReturned("date", minReceivedDate);

    let minExpiredDate = currentDateForMax.setDate(currentDateForMax.getDate() + 14);
    let maxExpiredDate = currentDateForMax.setDate(currentDateForMax.getDate() + 60);
    inputExpireDate.min = getDateReturned("date", minExpiredDate);
    inputExpireDate.max = getDateReturned("date", maxExpiredDate);

    refreshRQhasMInnerFormAndTable();

    document.getElementById("inputReceivedQuotationStatus").disabled = true;
    document.getElementById("inputReceivedDate").disabled = true;
    document.getElementById("inputExpireDate").disabled = true;
    document.getElementById("inputMaterialName").disabled = true;


    document.getElementById("tableDivInnerForm").style.display = 'none';
    document.getElementById("backButtonDivFormFirst").style.display = 'none';
    document.getElementById("formEditable").style.pointerEvents = "auto";



}

const refillDataIntoRQForm = (ob) => {

    receivedquotation = JSON.parse(JSON.stringify(ob));

    quotationRequestSelected = ob.quotation_request_id;

    document.getElementById("inputRQNo").value = ob.received_quot_no;
    document.getElementById("inputQuotationRequestNo").value = ob.quotation_request_id.quot_req_no;
    document.getElementById("inputSupplierName").value = ob.quotation_request_id.supplier_id.businessname;
    document.getElementById("inputSupplierNo").value = ob.quotation_request_id.supplier_id.supplierno;
    document.getElementById("inputReceivedDate").value = ob.received_date;
    document.getElementById("inputExpireDate").value = ob.expire_date;
    document.getElementById("inputSupplierQuotationNo").value = ob.suppiler_quotation_no;
    document.getElementById("inputReceivedQuotationNote").value = ob.received_quotation_note;
    fillDataIntoSelect(inputReceivedQuotationStatus, "Select Received Quotation Status", receivedQuotationStatus, 'name',ob.received_quotation_status_id.name);
    refreshRQhasMInnerFormAndTable();
    document.getElementById("formTabButton").click();

}






//Create function for view
const printQuotationRequest = (ob) => {

    const getMatNo = (ob) => {
        return ob.material_id.matno;
    }
    const getMatName = (ob) => {
        return ob.material_id.name;
    }
    const getMatUnitPrice = (ob) => {
        return parseFloat(ob.material_unit_price).toFixed(2);
    }
    const displayPropertyListInnerForm = [
        { dataType: 'function', propertyName: getMatNo },
        { dataType: 'function', propertyName: getMatName },
        { dataType: 'function', propertyName: getMatUnitPrice }
    ]
    fillDataIntoBillingTable("tbodyForBill", ob.receivedQuotationHasMaterialList, displayPropertyListInnerForm);

    let tableContent = document.getElementById("tbodyForBill").innerHTML;

    printReceivedQuotation(ob, tableContent);

}

const viewQuotationRequest = (ob) => {
    refreshReceivedQuotationForm();
    viewButtonFunction(refillDataIntoRQForm, ob, "tableTabButton", "formAddBtn", "formUpdateBtn", "formRestBtn", ClearRecQuotationFormButtonFunction);
    document.getElementById("backButtonDivFormFirst").style.display = 'block';
    document.getElementById("formEditable").style.pointerEvents = "none";
}

const cancelReceivedQuotation = (ob) => {

    if (ob.received_quotation_status_id.name == "Valid") {
        //get user confirmation
        const cancelReceivedQuotation = confirm('Are you sure to delete following Received Quotation..? \n'
            + '\n Received Quot No : ' + ob.received_quot_no
            + '\n Received Date : ' + ob.received_date
            + '\n Supplier Name : ' + ob.quotation_request_id.supplier_id.businessname
            + '\n Quot Req No : ' + ob.quotation_request_id.quot_req_no);
        if (cancelReceivedQuotation) {
            const cancelReceivedQuotationServiceResponse = ajaxDelRequestMapping("/receivedquotation",ob);
            if (cancelReceivedQuotationServiceResponse == 'OK') {
                alert('Canceled Successfully..!');
                //refresh table
                refreshReceivedQuotationTable();
            } else {
                alert("Cancelation was not sucessful.. !\n" + cancelReceivedQuotationServiceResponse);
            }
        } else {
            alert('Cancelation not completed..!');
        }
    } else {
        alert("Quotation is already invalid..!")
    }
}


const backButtonReceivedQuotationForm = () => {
    backButtonFunctionForm("tableTabButton", "formAddBtn", "formUpdateBtn", "formRestBtn", ClearRecQuotationFormButtonFunction)
    document.getElementById("backButtonDivFormFirst").style.display = 'none';
    refreshReceivedQuotationForm();
}




const checkReceivedQuotationError = () => {
    let error = '';
    if (receivedquotation.quotation_request_id == null) {
        error = error + "Enter Valid Supplier..!\n";
        inputSupplierName.classList.add("is-invalid");
    }
    if (receivedquotation.received_date == null) {
        error = error + "Enter Valid Received Date..!\n";
        inputReceivedDate.classList.add("is-invalid");
    }
    if (receivedquotation.expire_date == null) {
        error = error + "Enter Valid Expire Date..!\n";
        inputExpireDate.classList.add("is-invalid");
    }
    if (receivedquotation.received_quotation_status_id == null) {
        error = error + "Enter Valid Received Quotation Status..!\n";
        inputReceivedQuotationStatus.classList.add("is-invalid");
    }
    if (receivedquotation.receivedQuotationHasMaterialList.length == 0) {
        error = error + "Received Quotation must have Materials..!\n";
        document.getElementById("quotationRequestErrorDiv").style.display = 'inline'
    }
    return error;
}


const submitReceivedQuotation = () => {
    
    const errors = checkReceivedQuotationError();

    if (errors == '') {
        let confirmReceivedQuotationSubmit = confirm('Are you sure to add following product..?'
            + '\n Supplier Name : ' + receivedquotation.quotation_request_id.supplier_id.businessname
            + '\n Received Date : ' + receivedquotation.received_date
            + '\n Expire Date : ' + receivedquotation.expire_date
            + '\n Quot Req No : ' + receivedquotation.quotation_request_id.quot_req_no);
        // need to get user confirmation
        if (confirmReceivedQuotationSubmit) {
            //console.log(product);
            const receivedQuotationPostServiceResponse = ajaxPostRequestMapping("/receivedquotation",receivedquotation);
            if (receivedQuotationPostServiceResponse == 'OK') {
                alert("Save Successefully..!")
                //refresh table
                refreshReceivedQuotationTable();
                //click button to back
                ClearRecQuotationFormButtonFunction();
                //call form refresh function
                refreshReceivedQuotationForm();
                //back button function button
                backButtonReceivedQuotationForm();
            } else {
                alert("Submiting Quotation was not sucessful.. !\n" + " Reason : " + receivedQuotationPostServiceResponse);
            }
        } else {
            alert("Quotation entry canceled..");
        }

    } else {
        alert("Form has following errors : \n" + errors)
    }
}

let listOfFormIDs = [inputRQNo, inputQuotationRequestNo, inputSupplierName, inputSupplierNo, inputReceivedDate, inputExpireDate, inputReceivedQuotationStatus, inputSupplierQuotationNo, inputReceivedQuotationNote];
const ClearRecQuotationFormButtonFunction = () => {
    tbodyInnerFormMaterial.innerHTML = '';
    ClearFormFunction("formReceivedQuotation", refreshReceivedQuotationForm, listOfFormIDs);
    document.getElementById("tableDivInnerForm").style.display = 'none';
    refreshRQhasMInnerFormAndTable();
}







let inputQuotationRequestEl = document.getElementById("inputQuotationRequestNo");
let resultDivQuotationRequest = document.getElementById("divResultByQuotationRequestNo");




//--------------------------------- Customer Search Functions ----------------------------------------------------------------------------------



const onclickQuotReqFunction = (ob) => {
    ClearRecQuotationFormButtonFunction();
    inputQuotationRequestNo.value = ob.quot_req_no;
    inputSupplierName.value = ob.supplier_id.businessname;
    inputSupplierNo.value = ob.supplier_id.supplierno;
    document.getElementById('inputQuotationRequestNo').classList.remove("is-invalid");
    document.getElementById('inputQuotationRequestNo').classList.add('is-valid');
    document.getElementById('inputSupplierName').classList.remove("is-invalid");
    document.getElementById('inputSupplierName').classList.add('is-valid');
    document.getElementById('inputSupplierNo').classList.remove("is-invalid");
    document.getElementById('inputSupplierNo').classList.add('is-valid');
    quotationRequestSelected = ob;
    receivedquotation.quotation_request_id = ob;
    document.getElementById('inputReceivedDate').disabled = false;
    refreshRQhasMInnerFormAndTable();
    document.getElementById("inputMaterialName").disabled = false;
}


inputQuotationRequestEl.addEventListener('click', () => {
    if (listOFQRequest == null || listOFQRequest.length == 0) {
        noresultList = [{ name: "No Result to Show" }]
        const noresultFunction = () => {
            resultDivQuotationRequest.innerHTML = '';
        }
        displaySearchList(noresultList, resultDivQuotationRequest, 'name', '', noresultFunction);

    } else {
        if (inputQuotationRequestEl.value == '' || inputQuotationRequestEl == null) {
            inputQuotationRequestEl.classList.remove("is-invalid");
            inputQuotationRequestEl.classList.remove("is-valid");
        }
        displaySearchList(listOFQRequest, resultDivQuotationRequest, 'quot_req_no', '', onclickQuotReqFunction);

    }
});

inputQuotationRequestEl.addEventListener('keyup', () => {


    if (listOFQRequest == null || listOFQRequest.length == 0) {

    } else {

        if (inputQuotationRequestEl.value == null || inputQuotationRequestEl.value == "") {
            displaySearchList(listOFQRequest, resultDivQuotationRequest, 'quot_req_no', '', onclickQuotReqFunction);
            let listofFieldsReceivedQuotation_ID = [inputQuotationRequestNo, inputSupplierName, inputSupplierNo]
            listofFieldsReceivedQuotation_ID.forEach(element => {
                element.value = '';
                element.classList.remove('is-invalid');
                element.classList.remove('is-valid');
            });
            inputQuotationRequestEl.classList.remove("is-invalid");
            inputQuotationRequestEl.classList.remove("is-valid");
            ClearRecQuotationFormButtonFunction();

        } else {

            let searchResult = (searchFunction(listOFQRequest, inputQuotationRequestEl, 'quot_req_no'));
            displaySearchList(searchResult, resultDivQuotationRequest, 'quot_req_no', '', onclickQuotReqFunction);
            if (inputQuotationRequestEl.classList.contains('is-invalid')) {
                resultDivQuotationRequest.innerHTML = '';

            }
        }
    }
});
//--------------------------------- Customer Search Functions Ends -----------------------------------------------------------------------------




//---------------------------------- OnClick Body Function ---------------------------------------------------------------------


document.body.addEventListener('click', (event) => {
    // Check if the click target is not the input field or its descendant
    if (!(inputQuotationRequestEl.contains(event.target))) {
        resultDivQuotationRequest.innerHTML = '';
        if (quotationRequestSelected || quotationRequestSelected != null) {
            if (inputQuotationRequestEl.classList.contains('is-invalid')) {
                onclickQuotReqFunction(quotationRequestSelected);
            } else if (document.getElementById("inputQuotationRequestNo").classList.contains('is-valid')) {
                document.getElementById("inputQuotationRequestNo").value = quotationRequestSelected.quot_req_no;
                document.getElementById('inputQuotationRequestNo').classList.remove("is-invalid");
                document.getElementById('inputQuotationRequestNo').classList.add('is-valid');
            }
        } else {
            if (inputQuotationRequestEl.value == '') {
                inputQuotationRequestEl.classList.remove("is-valid");
                inputQuotationRequestEl.classList.remove("is-invalid");
            } else {
                inputQuotationRequestEl.classList.remove("is-valid");
                inputQuotationRequestEl.classList.add("is-invalid");
            }
        }
    }

});

//---------------------------------- OnClick Body Function Ends ----------------------------------------------------------------



document.getElementById('inputReceivedDate').addEventListener('change', () => {
    receivedquotation.received_date = document.getElementById('inputReceivedDate').value;
    document.getElementById('inputReceivedDate').classList.remove("is-invalid");
    document.getElementById('inputReceivedDate').classList.add("is-valid");
    document.getElementById('inputExpireDate').disabled = false;

});

document.getElementById('inputExpireDate').addEventListener('change', () => {
    receivedquotation.expire_date = document.getElementById('inputExpireDate').value;
    document.getElementById('inputExpireDate').classList.remove("is-invalid");
    document.getElementById('inputExpireDate').classList.add("is-valid");
    fillDataIntoSelect(inputReceivedQuotationStatus, "Select Received Quotation Status", receivedQuotationStatus, 'name', 'Valid');
    selectDynamicValidator(inputReceivedQuotationStatus, 'receivedquotation', 'received_quotation_status_id');

});




//----------------------------------------------- Inner Form Refresh Function -------------------------------------------------------------

const refreshRQhasMInnerFormAndTable = () => {

    receivedquotationhasmaterial = new Object();

    document.getElementById("inputMaterialName").classList.remove("is-valid", "is-invalid");
    document.getElementById("inputMaterialName").value = '';
    document.getElementById("inputMaterialUnitCost").classList.remove("is-valid", "is-invalid");
    document.getElementById("inputMaterialUnitCost").value = '';

    if (receivedquotation.quotation_request_id != null) {
        fillDataIntoSelect(inputMaterialName, "Select Material", receivedquotation.quotation_request_id.supplier_id.assignedMaterialList, 'name');
    } else {
        const optionMsg = document.createElement('option');
        optionMsg.innerText = "No Material To Select";
        optionMsg.selected = 'Selected';
        inputMaterialName.appendChild(optionMsg);
        document.getElementById("inputMaterialName").disabled = true;
        document.getElementById("inputMaterialUnitCost").disabled = true;
    }

    const getMatNo = (ob) => {
        return ob.material_id.matno;
    }

    const getMatName = (ob) => {
        return ob.material_id.name;
    }

    const getMatUnitPrice = (ob) => {
        return parseFloat(ob.material_unit_price).toFixed(2);
    }
    const displayPropertyListInnerForm = [
        { dataType: 'function', propertyName: getMatNo },
        { dataType: 'function', propertyName: getMatName },
        { dataType: 'function', propertyName: getMatUnitPrice }
    ]

    if (receivedquotation.receivedQuotationHasMaterialList.length == 0) {
        //has productHasMatList
        document.getElementById("tableDivInnerForm").style.display = 'none';
    } else {
        fillDataIntoInnerTable("tbodyInnerFormMaterial", receivedquotation.receivedQuotationHasMaterialList, displayPropertyListInnerForm, deleteFunctionInnerForm);
        document.getElementById("tableDivInnerForm").style.display = 'block';
    }

}

const deleteFunctionInnerForm = (ob, rowIndex) => {

    receivedquotation.receivedQuotationHasMaterialList.splice(rowIndex, 1);
    refreshRQhasMInnerFormAndTable();

}

//----------------------------------------------- Inner Form Refresh Function Ends --------------------------------------------------------

const inputMaterialNameEl = document.getElementById("inputMaterialName");

inputMaterialNameEl.addEventListener('change', () => {
    const selectedItemMaterial = JSON.parse(inputMaterialNameEl.value);
    const isFoundInList = receivedquotation.receivedQuotationHasMaterialList.some(element => {
        if (element.material_id.id === selectedItemMaterial.id) {
            return true;
        } else {
            return false;
        }
    });
    if(inputMaterialNameEl.classList.contains('is-valid')){
        if(!isFoundInList){
            inputMaterialNameEl.classList.remove("is-invalid");
            inputMaterialNameEl.classList.add("is-valid");
            receivedquotationhasmaterial.material_id = selectedItemMaterial;
        }else{
            inputMaterialNameEl.classList.remove("is-valid");
            inputMaterialNameEl.classList.add("is-invalid");
            receivedquotationhasmaterial = new Object();
        }
    }


    if (receivedquotationhasmaterial.material_id) {
        document.getElementById("inputMaterialUnitCost").disabled = false;
        document.getElementById("inputMaterialUnitCost").value = '';
        document.getElementById("inputMaterialUnitCost").classList.remove("is-valid", "is-invalid");
    } else {
        document.getElementById("inputMaterialUnitCost").value = '';
        document.getElementById("inputMaterialUnitCost").classList.remove("is-valid", "is-invalid");
        document.getElementById("inputMaterialUnitCost").disabled = true;
    }
});

const checkInnerFormErrorsRQhasM = () => {
    let errors = '';
    if (receivedquotationhasmaterial.material_id == null) {
        errors = errors + "Please select a material..! \n"
        inputMaterialName.classList.add("is-invalid");
    }
    if (receivedquotationhasmaterial.material_unit_price == null) {
        errors = errors + "Please Enter a material unit price..! \n"
        inputMaterialUnitCost.classList.add("is-invalid");
    }
    return errors
}

document.getElementById("buttonAddQuotationRequest").addEventListener('click', () => {

    let errorInnerForm = checkInnerFormErrorsRQhasM();
    if (errorInnerForm == '') {
        const selectedItemMaterial = JSON.parse(document.getElementById("inputMaterialName").value);
        const isFoundInList = receivedquotation.receivedQuotationHasMaterialList.some(element => {
            if (element.material_id.id === selectedItemMaterial.id) {
                return true;
            } else {
                return false;
            }
        });
        if (!isFoundInList) {
            document.getElementById("quotationRequestErrorDiv").style.display = 'none'
            receivedquotationhasmaterial.material_unit_price = parseFloat(receivedquotationhasmaterial.material_unit_price).toFixed(2);
            receivedquotation.receivedQuotationHasMaterialList.push(receivedquotationhasmaterial);
            refreshRQhasMInnerFormAndTable();
            document.getElementById("tableDivInnerForm").style.display = 'block';
        } else {
            alert("This material already exist..");
        }

    } else {

        alert("Material could not add to Quotation, has following errors \n" + errorInnerForm)
    }

});
