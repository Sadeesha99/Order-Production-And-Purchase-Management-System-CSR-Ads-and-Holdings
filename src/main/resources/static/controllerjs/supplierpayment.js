//call material table refresh function
window.addEventListener('load', () => {

    logedeUSerPRIVISupplierPayment = ajaxGetRequestMapping("/privilege/bymodule/SupplierPayment");
    logedeUSerPRIVISupplierPayment.del_privi = false;

    refreshSupplierPaymentTable();
    // Calling Refresh function to data diplay table
    refreshSupplierPaymentForm();


    if (!logedeUSerPRIVISupplierPayment.ins_privi) {
        document.getElementById("tableTabButton").click();
        document.getElementById("formTabButton").style.display = 'none';
    }


});


//create function table refresh
const refreshSupplierPaymentTable = () => {

    supplierPaymentList = ajaxGetRequestMapping("/supplierpayment/findall");

    const displayPropertyListCustomerOrder = [
        {dataType: 'text', propertyName: 'supplier_paymentno'},
        {dataType: 'function', propertyName: getOrderNo},
        {dataType: 'function', propertyName: getMRNStatus},
        {dataType: 'function', propertyName: getOrderAmount},
        {dataType: 'function', propertyName: getPaidAmount},
        {dataType: 'function', propertyName: getRemainingAmount}
    ]

    //call filldataintotable function
    //(tableId,dataList)
    fillDataIntoTable2("tbodySupplierPayment", supplierPaymentList, displayPropertyListCustomerOrder, viewSupplierPayment, cancelSupplierPayment, printSupplierPayment, true, logedeUSerPRIVISupplierPayment);
    new DataTable('#tableSupplierPayment');
    document.getElementById("tableSupplierPayment").style.width = "100%";

}

const getMRNStatus = (ob) => {

    if (ob.material_received_note_id.mrn_status_id.name == "Received") {
        return '<p style="border-radius:10px; width:80%; background-color: #c7c110;" class="p-2 text-center fw-bold">' + ob.material_received_note_id.mrn_status_id.name + '</p>'
    }
    if (ob.material_received_note_id.mrn_status_id.name == "Half-Paid") {
        return '<p style="border-radius:10px; width:80%; background-color: #1059c7;" class="p-2 text-center fw-bold">' + ob.material_received_note_id.mrn_status_id.name + '</p>'
    }
    if (ob.material_received_note_id.mrn_status_id.name == "Full-Paid") {
        return '<p style="border-radius:10px; width:80%; background-color: #148a12;" class="p-2 text-center fw-bold">' + ob.material_received_note_id.mrn_status_id.name + '</p>'
    }
}

const getOrderNo = (ob) => {
    return ob.material_received_note_id.mrn_no;
}

const getOrderAmount = (ob) => {
    return parseFloat(ob.material_received_note_id.total_bill).toFixed(2);
}

const getPaidAmount = (ob) => {
    return parseFloat(ob.amount).toFixed(2);
}

const getRemainingAmount = (ob) => {
    return parseFloat(ob.remaining_balance).toFixed(2);
}


const refreshSupplierPaymentForm = () => {

    supplierpayment = new Object();

    supplierList = ajaxGetRequestMapping("/supplierpayment/supplierlist")

    fillDataIntoSelect(inputSelectSupplier, "Select Supplier ", supplierList, 'businessname');

    document.getElementById('inputSelectSupplier').disabled = false;

    document.getElementById('inputPaymentAmount').disabled = true;
    document.getElementById('inputMRNNo').disabled = true;
    document.getElementById("inputReceiptFile").disabled = true;
    document.getElementById("inputReceiptFileDiv").style.display = 'block';
    document.getElementById("viewReceiptFileDiv").style.display = 'none';

    let mrnList = [];

    fillDataIntoSelect(inputMRNNo, "Select Material Received Note ", mrnList, 'businessname');

    document.getElementById('clearFileBtn').click();
    document.getElementById("formEditable").style.pointerEvents = "auto";
    document.getElementById("tableDivInnerForm").style.display = 'none';

    tbodyMaterialList.innerHTML = '';

}

const viewSupplierPayment = (ob) => {
    refreshSupplierPaymentForm();
    viewButtonFunction(refillViewData, ob, "tableTabButton", "formAddBtn", "formUpdateBtn", "formRestBtn", ClearSupplierPaymentButtonFunction);
    document.getElementById("backButtonDivFormFirst").style.display = 'block';
    document.getElementById("formEditable").style.pointerEvents = "none";
    document.getElementById("viewReceiptFileDiv").style.pointerEvents = "auto";
}

const cancelSupplierPayment = (ob) => {
    alert("Supplier payment cannot be canceled..!");
}


const refillViewData = (ob) => {

    const allSupplierList = ajaxGetRequestMapping("/supplier/findall");
    const selectedSup = ob.material_received_note_id.purchase_order_id.supplier_id;
    fillDataIntoSelect(inputSelectSupplier, "Select Supplier ", allSupplierList, 'businessname', selectedSup.businessname);
    document.getElementById("inputSupplierNo").value = selectedSup.supplierno;

    const allMRNList = ajaxGetRequestMapping("/mrn/findall");
    const selMrn = ob.material_received_note_id;
    fillDataIntoSelect(inputMRNNo, "Select Supplier ", allMRNList, 'mrn_no', selMrn.mrn_no);
    document.getElementById("inputSelectSupplier").disabled = true;
    refreshMRNhasMaterialInnerForm(selMrn);
    document.getElementById("inputMRNTotalBill").value = parseFloat(selMrn.total_bill).toFixed(2);
    document.getElementById("inputMRNPaidAmount").value = parseFloat(selMrn.paid_amount).toFixed(2);
    document.getElementById("inputCustomerOrderRemainingBalance").value = (parseFloat(selMrn.total_bill) - parseFloat(selMrn.paid_amount)).toFixed(2)
    document.getElementById("inputPaymentAmount").value = ob.amount;
    document.getElementById("inputPaymentAmount").disabled = true;
    document.getElementById("inputReceiptFile").disabled = true;
    document.getElementById("inputReceiptFileDiv").style.display = 'none';
    document.getElementById("viewReceiptFileDiv").style.display = 'block';
    document.getElementById("viewReceiptFileDiv").onclick = () => {
        if (ob.payment_receipt.length !== 0) {
            openFileWithHtmlContent(atob(ob.payment_receipt));
            console.log(atob(ob.payment_receipt));
        } else {
            nofileMessageReturn();
        }
    }
    document.getElementById("formTabButton").click();

}


//Create function for view product record
const printSupplierPayment = (ob) => {
    const getMatNo = (ob) => {
        return ob.material_id.matno;
    }
    const getMatName = (ob) => {
        return ob.material_id.name;
    }
    const getMatUnitPrice = (ob) => {
        return 'LKR ' + parseFloat(ob.purchased_unit_price).toFixed(2);
    }
    const getMatLinePrice = (ob) => {
        return 'LKR ' + parseFloat(ob.purchased_line_price).toFixed(2);
    }
    const displayPropertyListInnerForm = [
        {dataType: 'function', propertyName: getMatNo},
        {dataType: 'function', propertyName: getMatName},
        {dataType: 'function', propertyName: getMatUnitPrice},
        {dataType: 'text', propertyName: 'quantity'},
        {dataType: 'function', propertyName: getMatLinePrice}
    ]
    if (ob.material_received_note_id.materialReceivedNoteHasMaterialList != null && ob.material_received_note_id.materialReceivedNoteHasMaterialList.length > 0) {
        fillDataIntoBillingTable("tbodyForBill", ob.material_received_note_id.materialReceivedNoteHasMaterialList, displayPropertyListInnerForm);
        let tableContent = document.getElementById("tbodyForBill").innerHTML;

        printSupplierPaymentReceipt(ob, tableContent);
    }
}


//back button in product form
const backButtonSupplierPaymentForm = () => {
    backButtonFunctionForm("tableTabButton", "formAddBtn", "formUpdateBtn", "formRestBtn", ClearSupplierPaymentButtonFunction)
    document.getElementById("backButtonDivFormFirst").style.display = 'none';
    refreshSupplierPaymentForm();
}


const checkSupplierPaymentFormError = () => {
    let error = '';
    if (supplierpayment.material_received_note_id == null) {
        error = error + "Valid Material Received Note is not selected..!\n";
        inputMRNNo.classList.add("is-invalid");
    }
    if (supplierpayment.amount == null) {
        error = error + "Please Enter Valid Amount For Payment..!\n";
        inputPaymentAmount.classList.add("is-invalid");
    }
    if (supplierpayment.payment_receipt == null) {
        error = error + "Please Enter Payment Receipt (Photo as a proof of payment)..!\n";
        inputReceiptFile.classList.add("is-invalid");
    }

    return error;
}


//define function for submit product
const submitSupplierPayment = () => {

    const errors = checkSupplierPaymentFormError();

    if (errors == '') {
        let confirmSupplierPaymentSubmit = confirm('Are you sure to add following Payment..?'
            + '\n Supplier Name : ' + supplierpayment.material_received_note_id.purchase_order_id.supplier_id.businessname
            + '\n MRN No : ' + supplierpayment.material_received_note_id.mrn_no
            + '\n Order Total : LKR ' + parseFloat(supplierpayment.material_received_note_id.total_bill).toFixed(2)
            + '\n Payment : ' + supplierpayment.amount +
            '\n !!! This Cannot be changed after applied..!!!');
        // need to get user confirmation
        if (confirmSupplierPaymentSubmit) {
            //console.log(product);
            const supplierPaymentPostServiceResponse = ajaxPostRequestMapping("/supplierpayment", supplierpayment);
            if (supplierPaymentPostServiceResponse == "OK") {
                alert("Save Successefully..!")
                //refresh table
                refreshSupplierPaymentTable();
                //click button to back
                ClearSupplierPaymentButtonFunction();
                //call form refresh function
                refreshSupplierPaymentForm();
                //back button function button
                document.getElementById("tableTabButton").click();
            } else {
                alert("Payment submission was not successful.. !\n" + supplierPaymentPostServiceResponse);
            }
        } else {
            alert("Payment entry canceled..");
        }

    } else {
        alert("Form has following errors : \n" + errors)
    }
}

let listOfFormIDs = [inputSelectSupplier, inputSupplierNo, inputMRNNo, inputMRNTotalBill, inputMRNPaidAmount, inputCustomerOrderRemainingBalance, inputPaymentAmount];
const ClearSupplierPaymentButtonFunction = () => {
    tbodyMaterialList.innerHTML = '';
    ClearFormFunction("formSupplierPayment", refreshSupplierPaymentForm, listOfFormIDs);
    document.getElementById("tableDivInnerForm").style.display = 'none';
    document.getElementById('clearFileBtn').click();
}


const inputSelectSupplierEl = document.getElementById("inputSelectSupplier");
inputSelectSupplierEl.addEventListener('change', () => {
    let selectedSupplier = JSON.parse(inputSelectSupplierEl.value);
    ClearSupplierPaymentButtonFunction();
    fillDataIntoSelect(inputSelectSupplier, "Select Supplier ", supplierList, 'businessname', selectedSupplier.businessname);

    document.getElementById('inputSelectSupplier').classList.remove("is-invalid");
    document.getElementById('inputSelectSupplier').classList.add("is-valid");
    document.getElementById("inputSupplierNo").value = selectedSupplier.supplierno;
    document.getElementById('inputSupplierNo').classList.remove("is-invalid");
    document.getElementById('inputSupplierNo').classList.add("is-valid");

    mrnListBySupId = ajaxGetRequestMapping("/supplierpayment/mrnlistbysupid/" + selectedSupplier.id);

    fillDataIntoSelect(inputMRNNo, "Select Material Received Note", mrnListBySupId, 'mrn_no');
    document.getElementById('inputMRNNo').disabled = false;

});

const inputMRNNoEl = document.getElementById("inputMRNNo");
inputMRNNoEl.addEventListener('change', () => {
    let selectedSupplier = JSON.parse(inputSelectSupplierEl.value);
    let selectedMRN = JSON.parse(inputMRNNoEl.value);
    ClearSupplierPaymentButtonFunction();
    fillDataIntoSelect(inputSelectSupplier, "Select Supplier ", supplierList, 'businessname', selectedSupplier.businessname);
    document.getElementById('inputSelectSupplier').classList.remove("is-invalid");
    document.getElementById('inputSelectSupplier').classList.add("is-valid");
    document.getElementById("inputSupplierNo").value = selectedSupplier.supplierno;
    document.getElementById('inputSupplierNo').classList.remove("is-invalid");
    document.getElementById('inputSupplierNo').classList.add("is-valid");
    inputMRNNoEl.disabled = false;
    fillDataIntoSelect(inputMRNNo, "Select Material Received Note  ", mrnListBySupId, 'mrn_no', selectedMRN.mrn_no);
    selectDynamicValidator(inputMRNNo, 'supplierpayment', 'material_received_note_id');
    refreshMRNhasMaterialInnerForm(selectedMRN);
    fillDataIntoFormDisabledFields(selectedMRN);

});


const refreshMRNhasMaterialInnerForm = (mrnObj) => {
    const getMatNo = (ob) => {
        return ob.material_id.matno;
    }

    const getMatName = (ob) => {
        return ob.material_id.name;
    }
    const getMatUnitPrice = (ob) => {
        return parseFloat(ob.purchased_unit_price).toFixed(2);
    }

    const getMatLinePrice = (ob) => {
        return parseFloat(ob.purchased_line_price).toFixed(2);
    }
    const displayPropertyListInnerForm = [
        {dataType: 'function', propertyName: getMatNo},
        {dataType: 'function', propertyName: getMatName},
        {dataType: 'function', propertyName: getMatUnitPrice},
        {dataType: 'text', propertyName: 'quantity'},
        {dataType: 'function', propertyName: getMatLinePrice}
    ]

    if (mrnObj.materialReceivedNoteHasMaterialList.length == 0) {
        document.getElementById("tableDivInnerForm").style.display = 'none';
    } else {
        fillDataIntoTable3("tbodyMaterialList", mrnObj.materialReceivedNoteHasMaterialList, displayPropertyListInnerForm);
        document.getElementById("tableDivInnerForm").style.display = 'block';
    }
}

const fillDataIntoFormDisabledFields = (mrnObj) => {
    document.getElementById("inputMRNTotalBill").value = ''
    document.getElementById("inputMRNTotalBill").classList.remove('is-valid', 'is-invalid');
    document.getElementById("inputMRNPaidAmount").value = ''
    document.getElementById("inputMRNPaidAmount").classList.remove('is-valid', 'is-invalid');
    document.getElementById("inputCustomerOrderRemainingBalance").value = ''
    document.getElementById("inputCustomerOrderRemainingBalance").classList.remove('is-valid', 'is-invalid');

    document.getElementById("inputMRNTotalBill").value = parseFloat(mrnObj.total_bill).toFixed(2);
    document.getElementById("inputMRNPaidAmount").value = parseFloat(mrnObj.paid_amount).toFixed(2);
    document.getElementById("inputCustomerOrderRemainingBalance").value = (parseFloat(mrnObj.total_bill) - parseFloat(mrnObj.paid_amount)).toFixed(2)
    document.getElementById("inputMRNTotalBill").classList.add('is-valid');
    document.getElementById("inputMRNPaidAmount").classList.add('is-valid');
    document.getElementById("inputCustomerOrderRemainingBalance").classList.add('is-valid');

    document.getElementById("inputPaymentAmount").disabled = false;
    document.getElementById("inputReceiptFile").disabled = false;


}


const paymentAmountEl = document.getElementById("inputPaymentAmount");
paymentAmountEl.addEventListener('keyup', () => {
    let pattern = '^(([1-9][0-9]{0,5})|([1-9][0-9]{0,5}[.][0-9]{2}))?$'
    const regPattern = new RegExp(pattern);
    if (paymentAmountEl.value != "") {
        if (regPattern.test(paymentAmountEl.value)) {
            let TotalBill = parseFloat(supplierpayment.material_received_note_id.total_bill);
            let TotalPaid = parseFloat(supplierpayment.material_received_note_id.paid_amount);
            if (parseFloat(paymentAmountEl.value) <= (TotalBill - TotalPaid) && parseFloat(paymentAmountEl.value) >= ((TotalBill - TotalPaid) / 10)) {
                supplierpayment.amount = parseFloat(paymentAmountEl.value).toFixed(2);
                paymentAmountEl.classList.remove('is-invalid', 'is-valid');
                paymentAmountEl.classList.add('is-valid');
            } else {
                supplierpayment.amount = null;
                paymentAmountEl.classList.remove('is-valid', 'is-invalid');
                paymentAmountEl.classList.add('is-invalid');
            }

        } else {
            supplierpayment.amount = null;
            paymentAmountEl.classList.remove('is-valid', 'is-invalid');
            paymentAmountEl.classList.add('is-invalid');
        }
    } else {
        supplierpayment.amount = null;
        paymentAmountEl.classList.remove('is-valid');
        paymentAmountEl.classList.remove('is-invalid');
    }

});

const openDesignFileBtn = document.getElementById('openFileBtn');
const clearDesignFileBtn = document.getElementById('clearFileBtn');
const inputReceiptFileEl = document.getElementById('inputReceiptFile');
inputReceiptFileEl.addEventListener('change', () => {
    if (inputReceiptFileEl.files.length !== 0) {

        let designFile = inputReceiptFileEl.files[0];
        let fileReader = new FileReader();
        fileReader.onload = function (e) {
            supplierpayment.payment_receipt = btoa(e.target.result);
        }
        fileReader.readAsDataURL(designFile);
        openDesignFileBtn.style.display = 'inline-flex';
        clearDesignFileBtn.style.display = 'inline-flex';
        return;

    } else {

        openDesignFileBtn.style.display = 'none';
        clearDesignFileBtn.style.display = 'none';
    }
});

openDesignFileBtn.addEventListener('click', () => {
    if (supplierpayment.payment_receipt.length !== 0) {
        openFileWithHtmlContent(atob(supplierpayment.payment_receipt));
        console.log(atob(supplierpayment.payment_receipt));
    } else {
        nofileMessageReturn();
    }
});

clearDesignFileBtn.addEventListener('click', () => {
    supplierpayment.payment_receipt = null;
    inputReceiptFileEl.value = '';
    openDesignFileBtn.style.display = 'none';
    clearDesignFileBtn.style.display = 'none';
});


