//call material table refresh function
window.addEventListener('load', () => {

    logedeUSerPRIVIMRN = ajaxGetRequestMapping("/privilege/bymodule/MaterialReceivedNote");

    logedeUSerPRIVIMRN.del_privi = false;

    refreshMRNTable();
    // Calling Refresh function to data diplay table
    refreshMRNForm();


    if (!logedeUSerPRIVIMRN.ins_privi) {
        document.getElementById("tableTabButton").click();
        document.getElementById("formTabButton").style.display = 'none';
    }


});


//create function table refresh
const refreshMRNTable = () => {

    materialReceivedNoteList = ajaxGetRequestMapping("/mrn/findall");

    const displayPropertyListMaterialReceivedNote = [
        {dataType: 'text', propertyName: 'mrn_no'},
        {dataType: 'function', propertyName: getSupplierName},
        {dataType: 'function', propertyName: getReceivedDate},
        {dataType: 'function', propertyName: getTotalAmount},
        {dataType: 'function', propertyName: getPaidAmount},
        {dataType: 'function', propertyName: getPOrderStatus}
    ]

    //call filldataintotable function
    fillDataIntoTable2("tbodyMaterialReceivedNote", materialReceivedNoteList, displayPropertyListMaterialReceivedNote, viewMaterialReceivedNote, cancelMaterialReceivedNote, printMaterialReceivedNote, true, logedeUSerPRIVIMRN);
    new DataTable('#tableMaterialReceivedNote');
    document.getElementById("tableMaterialReceivedNote").style.width = "100%";

}

const getPOrderStatus = (ob) => {

    if (ob.mrn_status_id.name == "Received") {
        return '<p style="border-radius:10px; width:80%; background-color: #c7c110;" class="p-2 text-center fw-bold">' + ob.mrn_status_id.name + '</p>'
    }
    if (ob.mrn_status_id.name == "Half-Paid") {
        return '<p style="border-radius:10px; width:80%; background-color: #1059c7;" class="p-2 text-center fw-bold">' + ob.mrn_status_id.name + '</p>'
    }
    if (ob.mrn_status_id.name == "Full-Paid") {
        return '<p style="border-radius:10px; width:80%; background-color: #148a12;" class="p-2 text-center fw-bold">' + ob.mrn_status_id.name + '</p>'
    }
}

const getSupplierName = (ob) => {
    return ob.purchase_order_id.supplier_id.businessname;
}
const getReceivedDate = (ob) => {
    return ob.added_time.split('T')[0];
}

const getTotalAmount = (ob) => {
    return "LKR " + parseFloat(ob.total_bill).toFixed(2);
}

const getPaidAmount = (ob) => {
    return "LKR " + parseFloat(ob.paid_amount).toFixed(2);
}


const refreshMRNForm = () => {

    materialreceivednote = new Object();

    materialreceivednote.materialReceivedNoteHasMaterialList = [];


    listOFValidSupplier = ajaxGetRequestMapping("/mrn/validsuppliers");

    materialReceivedNoteStatus = ajaxGetRequestMapping("/mrn/status");

    let porderList = []
    fillDataIntoSelect(inputPurchaseOrderNo, "Select Purchase Order", porderList, 'purchase_order_no');

    fillDataIntoSelect(inputSelectSupplier, "Select Supplier", listOFValidSupplier, 'businessname');

    fillDataIntoSelect(inputMRNStatus, "Select MRN Status", materialReceivedNoteStatus, 'name');


    refreshMRNhasMInnerFormAndTable();

    document.getElementById("inputTotalBill").disabled = true;
    document.getElementById("inputPaidAmount").disabled = true;
    document.getElementById("inputPurchaseOrderNo").disabled = true;
    document.getElementById("inputMRNStatus").disabled = true;
    document.getElementById("inputSupplierInvoiceNo").disabled = true;


    document.getElementById("tableDivInnerForm").style.display = 'none';
    document.getElementById("backButtonDivFormFirst").style.display = 'none';
    document.getElementById("formEditable").style.pointerEvents = "auto";


}


const refillDataIntoMRNForm = (ob) => {

    materialreceivednote = JSON.parse(JSON.stringify(ob));

    document.getElementById("inputMRNNo").value = ob.mrn_no;
    const allSupplierList = ajaxGetRequestMapping("/supplier/findall");

    fillDataIntoSelect(inputSelectSupplier, "Select Supplier", allSupplierList, 'businessname', ob.purchase_order_id.supplier_id.businessname);
    document.getElementById("inputSupplierNo").value = ob.purchase_order_id.supplier_id.supplierno;
    document.getElementById("inputTotalBill").value = ob.total_bill;
    document.getElementById("inputPaidAmount").value = ob.paid_amount;
    document.getElementById("inputMRNdescription").value = ob.description;
    fillDataIntoSelect(inputMRNStatus, "Select Purchase Order Status", materialReceivedNoteStatus, 'name', ob.mrn_status_id.name);
    refreshMRNhasMInnerFormAndTable();
    document.getElementById("formTabButton").click();

}


//Create function for view
const printMaterialReceivedNote = (ob) => {

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

    fillDataIntoBillingTable("tbodyForBill", ob.materialReceivedNoteHasMaterialList, displayPropertyListInnerForm);

    let tableContent = document.getElementById("tbodyForBill").innerHTML;

    printMRN(ob, tableContent);

}

const viewMaterialReceivedNote = (ob) => {
    refreshMRNForm();
    viewButtonFunction(refillDataIntoMRNForm, ob, "tableTabButton", "formAddBtn", "formUpdateBtn", "formRestBtn", ClearMaterialReceivedNoteButtonFunction);
    document.getElementById("backButtonDivFormFirst").style.display = 'block';
    document.getElementById("formEditable").style.pointerEvents = "none";
}

const cancelMaterialReceivedNote = (ob) => {
    alert("Material Received Notes cannot be canceled..!");
}


const backButtonMaterialReceivedNoteForm = () => {
    backButtonFunctionForm("tableTabButton", "formAddBtn", "formUpdateBtn", "formRestBtn", ClearMaterialReceivedNoteButtonFunction)
    document.getElementById("backButtonDivFormFirst").style.display = 'none';
    refreshMRNForm();
}


const checkMaterialReceivedNoteError = () => {
    let error = '';
    if (materialreceivednote.purchase_order_id == null) {
        error = error + "Enter Purchase Order..!\n";
        inputPurchaseOrderNo.classList.add("is-invalid");
    }
    if (materialreceivednote.mrn_status_id == null) {
        error = error + "Material Received Note Status is not valid..!\n";
        inputMRNStatus.classList.add("is-invalid");
    }
    if (materialreceivednote.supplier_invoice_no == null) {
        error = error + "Enter Valid Supplier Invoice No. ..!\n";
        inputSupplierInvoiceNo.classList.add("is-invalid");
    }
    if (materialreceivednote.materialReceivedNoteHasMaterialList.length == 0) {
        error = error + "Material Received Note must have Materials..!\n";
        document.getElementById("mrnHasMaterialErrorDiv").style.display = 'inline'
    }
    return error;
}


const submitMaterialReceivedNote = () => {

    const errors = checkMaterialReceivedNoteError();

    if (errors == '') {
        let confirmMaterialReceivedNoteSubmit = confirm('Are you sure to add following Material Received Note..?'
            + '\n Supplier Name : ' + materialreceivednote.purchase_order_id.supplier_id.businessname
            + '\n Purchase Order No. : ' + materialreceivednote.purchase_order_id.purchase_order_no
            + '\n Total Bill : LKR ' + materialreceivednote.total_bill
            + '\n !!! This Cannot be changed after applied..!!!');
        // need to get user confirmation
        if (confirmMaterialReceivedNoteSubmit) {
            const materialReceivedNotePostServiceResponse = ajaxPostRequestMapping("/mrn", materialreceivednote );
            if (materialReceivedNotePostServiceResponse == 'OK') {
                alert("Save Successfully..!")
                //refresh table
                refreshMRNTable();
                //click button to back
                ClearMaterialReceivedNoteButtonFunction();
                //call form refresh function
                refreshMRNForm();
                //back button function button
                backButtonMaterialReceivedNoteForm();
            } else {
                alert("Submitting Purchase Order was not successful.. !\n" + " Reason : " + materialReceivedNotePostServiceResponse);
            }
        } else {
            alert("Material Received Note entry canceled..");
        }

    } else {
        alert("Form has following errors : \n" + errors)
    }
}

let listOfFormIDs = [inputMRNNo, inputPurchaseOrderNo, inputSelectSupplier, inputSupplierNo, inputSupplierInvoiceNo, inputTotalBill, inputPaidAmount, inputMRNStatus, inputMRNdescription];
const ClearMaterialReceivedNoteButtonFunction = () => {
    tbodyInnerFormPOrderMaterial.innerHTML = '';
    ClearFormFunction("formMaterialReceivedNote", refreshMRNForm, listOfFormIDs);
    document.getElementById("tableDivInnerForm").style.display = 'none';
    refreshMRNhasMInnerFormAndTable();
}


const inputSelectSupplierEl = document.getElementById("inputSelectSupplier");
inputSelectSupplierEl.addEventListener('change', () => {
    let selectedSupplier = JSON.parse(inputSelectSupplierEl.value);
    ClearMaterialReceivedNoteButtonFunction();
    fillDataIntoSelect(inputSelectSupplier, "Select Supplier", listOFValidSupplier, 'businessname', selectedSupplier.businessname);
    document.getElementById('inputSelectSupplier').classList.remove("is-invalid");
    document.getElementById('inputSelectSupplier').classList.add("is-valid");
    document.getElementById("inputSupplierNo").value = selectedSupplier.supplierno;
    document.getElementById('inputSupplierNo').classList.remove("is-invalid");
    document.getElementById('inputSupplierNo').classList.add("is-valid");

    let PurchaseOrderList = ajaxGetRequestMapping("/mrn/polistbysupid/" + selectedSupplier.id);
    fillDataIntoSelect(inputPurchaseOrderNo, "Select Purchase Order", PurchaseOrderList, 'purchase_order_no');
    document.getElementById("inputPurchaseOrderNo").disabled = false;
});

const inputPurchaseOrderNoEl = document.getElementById("inputPurchaseOrderNo");
inputPurchaseOrderNoEl.addEventListener('change', () => {
    let selectedPOrder = JSON.parse(inputPurchaseOrderNoEl.value);
    let selectedSupplier = JSON.parse(inputSelectSupplierEl.value);
    let PurchaseOrderList = ajaxGetRequestMapping("/mrn/polistbysupid/" + selectedSupplier.id);
    ClearMaterialReceivedNoteButtonFunction();
    fillDataIntoSelect(inputPurchaseOrderNo, "Select Supplier", PurchaseOrderList, 'purchase_order_no', selectedPOrder.purchase_order_no);
    selectDynamicValidator(inputPurchaseOrderNo, 'materialreceivednote', 'purchase_order_id');
    fillDataIntoSelect(inputSelectSupplier, "Select Supplier", listOFValidSupplier, 'businessname', selectedSupplier.businessname);
    document.getElementById('inputSelectSupplier').classList.remove("is-invalid");
    document.getElementById('inputSelectSupplier').classList.add("is-valid");
    document.getElementById("inputSupplierNo").value = selectedSupplier.supplierno;
    document.getElementById('inputSupplierNo').classList.remove("is-invalid");
    document.getElementById('inputSupplierNo').classList.add("is-valid");
    inputPurchaseOrderNoEl.disabled = false;
    document.getElementById("inputSupplierInvoiceNo").disabled = false;
    refreshMRNhasMInnerFormAndTable();
});


//----------------------------------------------- Inner Form Refresh Function -------------------------------------------------------------

const refreshMRNhasMInnerFormAndTable = () => {

    materialreceivednotehasmaterial = new Object();

    document.getElementById("inputMaterialName").classList.remove("is-valid", "is-invalid");
    document.getElementById("inputMaterialNo").classList.remove("is-valid", "is-invalid");
    document.getElementById("inputMaterialUnitQuantity").classList.remove("is-valid", "is-invalid");
    document.getElementById("inputMaterialUnitPrice").classList.remove("is-valid", "is-invalid");
    document.getElementById("inputMaterialLinePrice").classList.remove("is-valid", "is-invalid");
    document.getElementById("inputMaterialNo").value = '';
    document.getElementById("inputMaterialUnitQuantity").value = '';
    document.getElementById("inputMaterialUnitPrice").value = '';
    document.getElementById("inputMaterialLinePrice").value = '';
    document.getElementById("unitLabelSpan").innerHTML = "Unit"
    document.getElementById("inputMaterialUnitQuantity").disabled = true;
    document.getElementById("mrnHasMaterialErrorDiv").style.display = 'none'

    if (materialreceivednote.purchase_order_id != null) {
        materialList = ajaxGetRequestMapping("/mrn/matlistbypo/" + materialreceivednote.purchase_order_id.id);
        fillDataIntoSelect(inputMaterialName, "Select Material", materialList, 'name');
        document.getElementById("inputMaterialName").disabled = false;
    } else {
        const optionMsg = document.createElement('option');
        optionMsg.innerText = "No Material To Select";
        optionMsg.selected = 'Selected';
        inputMaterialName.appendChild(optionMsg);
        document.getElementById("inputMaterialName").disabled = true;
        document.getElementById("inputMaterialUnitQuantity").disabled = true;
    }


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

    if (materialreceivednote.materialReceivedNoteHasMaterialList.length == 0) {
        document.getElementById("tableDivInnerForm").style.display = 'none';
    } else {
        fillDataIntoInnerTable("tbodyInnerFormPOrderMaterial", materialreceivednote.materialReceivedNoteHasMaterialList, displayPropertyListInnerForm, deleteFunctionInnerForm);
        document.getElementById("tableDivInnerForm").style.display = 'block';
    }


}

const deleteFunctionInnerForm = (ob, rowIndex) => {

    materialreceivednote.materialReceivedNoteHasMaterialList.splice(rowIndex, 1);
    refreshMRNhasMInnerFormAndTable();
    generateTotalAmount();

}

//----------------------------------------------- Inner Form Refresh Function Ends --------------------------------------------------------

const inputMaterialNameEl = document.getElementById("inputMaterialName");

inputMaterialNameEl.addEventListener('change', () => {
    const selectedItemMaterial = JSON.parse(inputMaterialNameEl.value);
    refreshMRNhasMInnerFormAndTable();
    fillDataIntoSelect(inputMaterialName, "Select Material", materialList, 'name', selectedItemMaterial.name);
    selectDynamicValidator(inputMaterialName, 'materialreceivednote', 'material_id');
    const isFoundInList = materialreceivednote.materialReceivedNoteHasMaterialList.some(element => {
        if (element.material_id.id === selectedItemMaterial.id) {
            return true;
        } else {
            return false;
        }
    });
    if (inputMaterialNameEl.classList.contains('is-valid')) {
        if (!isFoundInList) {
            inputMaterialNameEl.classList.remove("is-invalid");
            inputMaterialNameEl.classList.add("is-valid");
            materialreceivednotehasmaterial.material_id = selectedItemMaterial;
        } else {
            inputMaterialNameEl.classList.remove("is-valid");
            inputMaterialNameEl.classList.add("is-invalid");
            materialreceivednotehasmaterial = new Object();
            document.getElementById("unitLabelSpan").innerHTML = "Unit"
        }
    }

    if (materialreceivednotehasmaterial.material_id) {
        document.getElementById("inputMaterialNo").classList.remove("is-valid", "is-invalid");
        document.getElementById("inputMaterialUnitQuantity").classList.remove("is-valid", "is-invalid");
        document.getElementById("inputMaterialUnitPrice").classList.remove("is-valid", "is-invalid");
        document.getElementById("inputMaterialLinePrice").classList.remove("is-valid", "is-invalid");
        document.getElementById("inputMaterialUnitQuantity").disabled = false;
        document.getElementById("inputMaterialUnitQuantity").value = '';
        document.getElementById("unitLabelSpan").innerHTML = materialreceivednotehasmaterial.material_id.material_unit_type_id.symbol;
        document.getElementById("inputMaterialNo").value = materialreceivednotehasmaterial.material_id.matno;
        document.getElementById("inputMaterialNo").classList.add("is-valid");
        let materialPurchaseUnitPrice = 0;
        let materialPurchaseQuantity = 0;
        materialreceivednote.purchase_order_id.purchaseOrderHasMaterialList.forEach(el => {
            if (el.material_id.id === materialreceivednotehasmaterial.material_id.id) {
                materialPurchaseUnitPrice = parseFloat(el.quotation_unit_price);
                materialPurchaseQuantity = parseFloat(el.quantity);
            }
        });
        document.getElementById("inputMaterialUnitPrice").value = materialPurchaseUnitPrice;
        document.getElementById("inputMaterialUnitPrice").classList.add("is-valid");
        materialreceivednotehasmaterial.purchased_unit_price = materialPurchaseUnitPrice;
        document.getElementById("inputMaterialUnitQuantity").value = materialPurchaseQuantity;
        document.getElementById("inputMaterialUnitQuantity").classList.add("is-valid");
        materialreceivednotehasmaterial.quantity = materialPurchaseQuantity;
        materialreceivednotehasmaterial.purchased_line_price = parseFloat(materialreceivednotehasmaterial.quantity)* parseFloat(materialreceivednotehasmaterial.purchased_unit_price);
        document.getElementById("inputMaterialLinePrice").value = materialreceivednotehasmaterial.purchased_line_price;
        document.getElementById("inputMaterialLinePrice").classList.add("is-valid");



    } else {
        document.getElementById("inputMaterialNo").classList.remove("is-valid", "is-invalid");
        document.getElementById("inputMaterialUnitQuantity").classList.remove("is-valid", "is-invalid");
        document.getElementById("inputMaterialUnitPrice").classList.remove("is-valid", "is-invalid");
        document.getElementById("inputMaterialLinePrice").classList.remove("is-valid", "is-invalid");
        document.getElementById("inputMaterialNo").value = '';
        document.getElementById("inputMaterialUnitPrice").value = '';
        document.getElementById("inputMaterialLinePrice").value = '';
        document.getElementById("inputMaterialUnitQuantity").value = '';
        document.getElementById("inputMaterialUnitQuantity").disabled = true;
        document.getElementById("unitLabelSpan").innerHTML = "Unit"
    }
});


//----------------------------------------------------------------- OnKey Up Quantity ----------------------------------------------------------------------------------------------------

const inputMaterialUnitQuantityEl = document.getElementById("inputMaterialUnitQuantity");
inputMaterialUnitQuantityEl.addEventListener("keyup", () => {
    let pattern = '^(([1-9][0-9]{0,6})|([0-9]{0,5}[\\.][0-9]{0,2}))$';
    const regPattern = new RegExp(pattern);
    if (inputMaterialUnitQuantityEl.value != '') {
        if (regPattern.test(inputMaterialUnitQuantityEl.value)) {
            inputMaterialUnitQuantityEl.classList.remove('is-invalid')
            inputMaterialUnitQuantityEl.classList.add('is-valid');
            materialreceivednotehasmaterial.quantity = inputMaterialUnitQuantityEl.value;
        } else {
            inputMaterialUnitQuantityEl.classList.remove('is-valid');
            inputMaterialUnitQuantityEl.classList.add('is-invalid')
            materialreceivednotehasmaterial.quantity = null;
        }
    } else {
        inputMaterialUnitQuantityEl.classList.remove("is-valid", "is-invalid");
        materialreceivednotehasmaterial.quantity = null;
    }
    generateLineTotalAmount();
});

//----------------------------------------------------------------- OnKey Up Quantity  Ends ----------------------------------------------------------------------------------------------


//---------------------------------------------------------------- Generate Line Total Amount ----------------------------------------------------------------------------------------------------------
const generateLineTotalAmount = () => {
    if (materialreceivednotehasmaterial.material_id) {
        if (materialreceivednotehasmaterial.quantity > 0) {
            materialreceivednotehasmaterial.purchased_line_price = (parseFloat(materialreceivednotehasmaterial.quantity) * parseFloat(materialreceivednotehasmaterial.purchased_unit_price)).toFixed(2);
            document.getElementById("inputMaterialLinePrice").value = materialreceivednotehasmaterial.purchased_line_price;
            document.getElementById("inputMaterialLinePrice").classList.remove("is-invalid");
            document.getElementById("inputMaterialLinePrice").classList.add("is-valid");
        } else {
            materialreceivednotehasmaterial.purchased_line_price = null;
            document.getElementById("inputMaterialLinePrice").value = '';
            document.getElementById("inputMaterialLinePrice").classList.remove("is-valid", "is-invalid");
        }
    } else {
        materialreceivednotehasmaterial.purchased_line_price = null;
        document.getElementById("inputMaterialLinePrice").value = '';
        document.getElementById("inputMaterialLinePrice").classList.remove("is-valid", "is-invalid");
    }
}
//---------------------------------------------------------------- Generate Line Total Amount Ends -----------------------------------------------------------------------------------------------------


//---------------------------------------------------------------- Generate Total Amount ----------------------------------------------------------------------------------------------------------
const generateTotalAmount = () => {
    if (materialreceivednote.materialReceivedNoteHasMaterialList.length > 0) {
        let totalAmount = 0.00;
        materialreceivednote.materialReceivedNoteHasMaterialList.forEach(element => {
            totalAmount = parseFloat(totalAmount) + parseFloat(element.purchased_line_price);
        });
        materialreceivednote.total_bill = parseFloat(totalAmount).toFixed(2);
        document.getElementById("inputTotalBill").value = materialreceivednote.total_bill;
        document.getElementById("inputTotalBill").classList.remove("is-invalid");
        document.getElementById("inputTotalBill").classList.add("is-valid");
        materialreceivednote.paid_amount = 0.00
        document.getElementById("inputPaidAmount").value = materialreceivednote.paid_amount;
        document.getElementById("inputPaidAmount").classList.remove("is-invalid");
        document.getElementById("inputPaidAmount").classList.add("is-valid");
        fillDataIntoSelect(inputMRNStatus, "Select MRN Status", materialReceivedNoteStatus, 'name', 'Received');
        selectDynamicValidator(inputMRNStatus, 'materialreceivednote', 'mrn_status_id');

    } else {
        materialreceivednote.total_bill = null;
        document.getElementById("inputTotalBill").value = '';
        document.getElementById("inputTotalBill").classList.remove("is-invalid");
        document.getElementById("inputTotalBill").classList.remove("is-valid");
        materialreceivednote.paid_amount = null;
        document.getElementById("inputPaidAmount").value = '';
        document.getElementById("inputPaidAmount").classList.remove("is-invalid");
        document.getElementById("inputPaidAmount").classList.remove("is-valid");
        fillDataIntoSelect(inputMRNStatus, "Select MRN Status", materialReceivedNoteStatus, 'name');
        document.getElementById("inputMRNStatus").classList.remove("is-invalid");
        document.getElementById("inputMRNStatus").classList.remove("is-valid");
        materialreceivednote.mrn_status_id = null;
    }
}
//---------------------------------------------------------------- Generate Total Amount Ends -----------------------------------------------------------------------------------------------------


const checkInnerFormErrorsPOhasM = () => {
    let errors = '';
    if (materialreceivednotehasmaterial.material_id == null) {
        errors = errors + "Please select a material..! \n"
        inputMaterialName.classList.add("is-invalid");
    }
    if (materialreceivednotehasmaterial.quantity == null) {
        errors = errors + "Please Enter a material quantity..! \n"
        inputMaterialUnitQuantity.classList.add("is-invalid");
    }
    return errors
}

document.getElementById("buttonAddPOrder").addEventListener('click', () => {

    let errorInnerForm = checkInnerFormErrorsPOhasM();
    if (errorInnerForm == '') {
        const selectedItemMaterial = JSON.parse(inputMaterialNameEl.value);
        const isFoundInList = materialreceivednote.materialReceivedNoteHasMaterialList.some(element => {
            if (element.material_id.id === selectedItemMaterial.id) {
                return true;
            } else {
                return false;
            }
        });
        if (!isFoundInList) {
            document.getElementById("mrnHasMaterialErrorDiv").style.display = 'none'
            materialreceivednote.materialReceivedNoteHasMaterialList.push(materialreceivednotehasmaterial);
            refreshMRNhasMInnerFormAndTable();
            document.getElementById("tableDivInnerForm").style.display = 'block';
            generateTotalAmount();
        } else {
            alert("This material already exist..");
        }

    } else {

        alert("Material could not add to Quotation, has following errors \n" + errorInnerForm)
    }

});
