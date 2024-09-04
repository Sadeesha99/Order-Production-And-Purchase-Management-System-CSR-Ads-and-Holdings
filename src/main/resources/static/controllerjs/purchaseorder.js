//call material table refresh function
window.addEventListener('load', () => {

    logedeUSerPRIVIPurchaseOrder = ajaxGetRequestMapping("/privilege/bymodule/PurchaseOrder");


    refreshPurchaseOrderTable();
    // Calling Refresh function to data diplay table
    refreshPurchaseOrderForm();




    if (!logedeUSerPRIVIPurchaseOrder.ins_privi) {
        document.getElementById("tableTabButton").click();
        document.getElementById("formTabButton").style.display = 'none';
    }


});



//create function table refresh
const refreshPurchaseOrderTable = () => {


    const SendPurchaseOrderList = ajaxGetRequestMapping("/purchaseorder/send")
    const ReceivedPurchaseOrderList = ajaxGetRequestMapping("/purchaseorder/received")
    const CompletedPurchaseOrderList = ajaxGetRequestMapping("/purchaseorder/completed")
    const CanceledPurchaseOrderList = ajaxGetRequestMapping("/purchaseorder/canceled")
    purchaseOrderList = SendPurchaseOrderList.concat(ReceivedPurchaseOrderList,CompletedPurchaseOrderList,CanceledPurchaseOrderList);

    const displayPropertyListPurchaseOrder = [
        { dataType: 'text', propertyName: 'purchase_order_no' },
        { dataType: 'function', propertyName: getSupplierName },
        { dataType: 'text', propertyName: 'required_date' },
        { dataType: 'text', propertyName: 'sent_date' },
        { dataType: 'function', propertyName: getTotalAmount },
        { dataType: 'function', propertyName: getPOrderStatus }
    ]

    //call filldataintotable function
    fillDataIntoTable2("tbodyPurchaseOrder", purchaseOrderList, displayPropertyListPurchaseOrder, viewPurchaseOrder, cancelPurchaseOrder, printPurchaseOrder, true, logedeUSerPRIVIPurchaseOrder);
    new DataTable('#tablePurchaseOrder');
    document.getElementById("tablePurchaseOrder").style.width = "100%";

}

const getPOrderStatus = (ob) => {

    if (ob.purchase_order_status_id.name == "Send") {
        return '<p style="border-radius:10px; width:80%; background-color: #c7c110;" class="p-2 text-center fw-bold">' + ob.purchase_order_status_id.name + '</p>'
    }
    if (ob.purchase_order_status_id.name == "Received") {
        return '<p style="border-radius:10px; width:80%; background-color: #1059c7;" class="p-2 text-center fw-bold">' + ob.purchase_order_status_id.name + '</p>'
    }
    if (ob.purchase_order_status_id.name == "Completed") {
        return '<p style="border-radius:10px; width:80%; background-color: #148a12;" class="p-2 text-center fw-bold">' + ob.purchase_order_status_id.name + '</p>'
    }
    if (ob.purchase_order_status_id.name == "Canceled") {
        return '<p style="border-radius:10px; width:80%; background-color: #8a2012;" class="p-2 text-center fw-bold">' + ob.purchase_order_status_id.name + '</p>'
    }

}

const getSupplierName = (ob) => {
    return ob.supplier_id.businessname;
}

const getTotalAmount = (ob) => {
    return "LKR "+ parseFloat(ob.total_amount).toFixed(2);
}





const refreshPurchaseOrderForm = () => {

    purchaseorder = new Object();

    purchaseorder.purchaseOrderHasMaterialList = [];


    listOFValidSupplier = ajaxGetRequestMapping("/purchaseorder/validsuppliers");

    purchaseOrderStatus = ajaxGetRequestMapping("/purchaseorder/status/list");

    fillDataIntoSelect(inputSelectSupplier, "Select Supplier", listOFValidSupplier, 'businessname');

    fillDataIntoSelect(inputPurchaseOrderStatus, "Select Purchase Order Status", purchaseOrderStatus, 'name');

    let currentDateForMax = new Date();

    let minRequiredDate = currentDateForMax.setDate(currentDateForMax.getDate() + 3);
    let maxRequiredDate = currentDateForMax.setDate(currentDateForMax.getDate() + 21);
    inputRequiredDate.min = getDateReturned("date", minRequiredDate);
    inputRequiredDate.max = getDateReturned("date", maxRequiredDate);


    refreshPOhasMInnerFormAndTable();


    document.getElementById("inputSendDate").disabled = true;
    document.getElementById("inputTotalAmount").disabled = true;
    document.getElementById("inputPurchaseOrderStatus").disabled = true;
    document.getElementById("inputRequiredDate").disabled = true;
    document.getElementById("inputSendDate").disabled = true;


    document.getElementById("tableDivInnerForm").style.display = 'none';
    document.getElementById("backButtonDivFormFirst").style.display = 'none';
    document.getElementById("formEditable").style.pointerEvents = "auto";



}

const refillDataIntoPurchaseOrderForm = (ob) => {

    purchaseorder = JSON.parse(JSON.stringify(ob));

    document.getElementById("inputPurchaseOrderNo").value = ob.purchase_order_no;
    const allSupplierList = ajaxGetRequestMapping("/supplier/findall");
    fillDataIntoSelect(inputSelectSupplier, "Select Supplier", allSupplierList, 'businessname', ob.supplier_id.businessname);
    document.getElementById("inputSupplierNo").value = ob.supplier_id.supplierno;
    document.getElementById("inputRequiredDate").value = ob.required_date;
    document.getElementById("inputSendDate").value = ob.sent_date;
    document.getElementById("inputTotalAmount").value = ob.total_amount;
    document.getElementById("inputPurchaseOrderDescription").value = ob.porder_description;
    fillDataIntoSelect(inputPurchaseOrderStatus, "Select Purchase Order Status", purchaseOrderStatus, 'name', ob.purchase_order_status_id.name);
    refreshPOhasMInnerFormAndTable();
    document.getElementById("formTabButton").click();

}


//Create function for view
const printPurchaseOrder = (ob) => {

    const getMatNo = (ob) => {
        return ob.material_id.matno;
    }
    const getMatName = (ob) => {
        return ob.material_id.name;
    }

    const getMatUnitPrice = (ob) => {
        return parseFloat(ob.quotation_unit_price).toFixed(2);
    }
    const getMatLinePrice = (ob) => {
        return parseFloat(ob.quotation_line_price).toFixed(2);
    }
    const displayPropertyListInnerForm = [
        { dataType: 'function', propertyName: getMatNo },
        { dataType: 'function', propertyName: getMatName },
        { dataType: 'text', propertyName: 'quantity' },
        { dataType: 'function', propertyName: getMatUnitPrice },
        { dataType: 'function', propertyName: getMatLinePrice }
    ]
    fillDataIntoBillingTable("tbodyForBill", ob.purchaseOrderHasMaterialList, displayPropertyListInnerForm);

    let tableContent = document.getElementById("tbodyForBill").innerHTML;

    printPurchaseOrderLetter(ob, tableContent);

}

const viewPurchaseOrder = (ob) => {
    refreshPurchaseOrderForm();
    viewButtonFunction(refillDataIntoPurchaseOrderForm, ob, "tableTabButton", "formAddBtn", "formUpdateBtn", "formRestBtn", ClearPurchaseOrderButtonFunction);
    document.getElementById("backButtonDivFormFirst").style.display = 'block';
    document.getElementById("formEditable").style.pointerEvents = "none";
}

const cancelPurchaseOrder = (ob) => {

    if (ob.purchase_order_status_id.name == "Send") {
        //get user confirmation
        const cancelPurchaseOrder = confirm('Are you sure to delete following Purchase Order..? \n'
            + '\n Purchase Order No : ' + ob.purchase_order_no
            + '\n Supplier Name : ' + ob.supplier_id.businessname
            + '\n Sent Date : ' + ob.sent_date
            + '\n Required Date : ' + ob.required_date
            + '\n Total Amount : LKR ' + ob.total_amount);
        if (cancelPurchaseOrder) {
            const cancelPurchaseOrderServiceResponse = ajaxDelRequestMapping("/purchaseorder",ob);
            if (cancelPurchaseOrderServiceResponse == 'OK') {
                alert('Canceled Successfully..!');
                //refresh table
                refreshPurchaseOrderTable();
            } else {
                alert("Cancelation was not sucessful.. !\n" + cancelPurchaseOrderServiceResponse);
            }
        } else {
            alert('Cancelation not completed..!');
        }
    } else if(ob.purchase_order_status_id.name == "Canceled") {
        alert("Purchase Order is already canceled..!");
    }else{
        alert("Purchase Order cannot be canceled after MRN received..!");
    }
}


const backButtonPurchaseOrderForm = () => {
    backButtonFunctionForm("tableTabButton", "formAddBtn", "formUpdateBtn", "formRestBtn", ClearPurchaseOrderButtonFunction)
    document.getElementById("backButtonDivFormFirst").style.display = 'none';
    refreshPurchaseOrderForm();
}




const checkPurchaseOrderError = () => {
    let error = '';
    if (purchaseorder.supplier_id == null) {
        error = error + "Enter Valid Supplier..!\n";
        inputSelectSupplier.classList.add("is-invalid");
    }
    if (purchaseorder.required_date == null) {
        error = error + "Enter Valid Required Date..!\n";
        inputRequiredDate.classList.add("is-invalid");
    }
    if (purchaseorder.sent_date == null) {
        error = error + "Enter Valid Send Date..!\n";
        inputSendDate.classList.add("is-invalid");
    }
    if (purchaseorder.purchase_order_status_id == null) {
        error = error + "Enter Valid Purchase Order Status..!\n";
        inputPurchaseOrderStatus.classList.add("is-invalid");
    }
    if (purchaseorder.purchaseOrderHasMaterialList.length == 0) {
        error = error + "Purchase Order must have Materials..!\n";
        document.getElementById("porderHasMaterialErrorDiv").style.display = 'inline'
    }
    return error;
}


const submitPurchaseOrder = () => {

    const errors = checkPurchaseOrderError();


    if (errors == '') {

        let supplierHasSendPOrder = false;
        let SendPOList = ajaxGetRequestMapping("/purchaseorder/send");

        SendPOList.forEach(element => {
            if(element.supplier_id.id === purchaseorder.supplier_id.id){
                supplierHasSendPOrder =true;
            }
        });
        if(supplierHasSendPOrder){
            let confirmPOrderFromSameSupplier = confirm('Following selected supplier for this Purchase Order'
                + '\n Supplier Name : ' + purchaseorder.supplier_id.businessname
                + '\n Do already have sent purchase orders that have not received materials.. '
                + '\n Are you sure to add new purchase order for same supplier..?');
            if(confirmPOrderFromSameSupplier){
                let confirmPurchaseOrderSubmit = confirm('Are you sure to add following Purchase Order..?'
                    + '\n Supplier Name : ' + purchaseorder.supplier_id.businessname
                    + '\n Required Date : ' + purchaseorder.required_date
                    + '\n Total Amount : LKR ' + purchaseorder.total_amount);
                // need to get user confirmation
                if (confirmPurchaseOrderSubmit) {
                    const purchaseOrderPostServiceResponse = ajaxPostRequestMapping("/purchaseorder",purchaseorder);
                    if (purchaseOrderPostServiceResponse == "OK") {
                        alert("Saved Successfully..!")
                        //refresh table
                        refreshPurchaseOrderTable();
                        //click button to back
                        ClearPurchaseOrderButtonFunction();
                        //call form refresh function
                        refreshPurchaseOrderForm();
                        //back button function button
                        backButtonPurchaseOrderForm();
                    } else {
                        alert("Submitting Purchase Order was not successful.. !\n" + " Reason : " + purchaseOrderPostServiceResponse);
                    }
                } else {
                    alert("Purchase Order entry canceled..");
                }
            }else{
                alert("You did canceled purchase order submission.!")
            }
        }else{
            let confirmPurchaseOrderSubmit = confirm('Are you sure to add following Purchase Order..?'
                + '\n Supplier Name : ' + purchaseorder.supplier_id.businessname
                + '\n Required Date : ' + purchaseorder.required_date
                + '\n Total Amount : LKR ' + purchaseorder.total_amount);
            // need to get user confirmation
            if (confirmPurchaseOrderSubmit) {
                const purchaseOrderPostServiceResponse = ajaxPostRequestMapping("/purchaseorder",purchaseorder);
                if (purchaseOrderPostServiceResponse == "OK") {
                    alert("Saved Successfully..!")
                    //refresh table
                    refreshPurchaseOrderTable();
                    //click button to back
                    ClearPurchaseOrderButtonFunction();
                    //call form refresh function
                    refreshPurchaseOrderForm();
                    //back button function button
                    backButtonPurchaseOrderForm();
                } else {
                    alert("Submitting Purchase Order was not successful.. !\n" + " Reason : " + purchaseOrderPostServiceResponse);
                }
            } else {
                alert("Purchase Order entry canceled..");
            }
        }

    } else {
        alert("Form has following errors : \n" + errors)
    }
}

let listOfFormIDs = [inputPurchaseOrderNo, inputSelectSupplier, inputSupplierNo, inputRequiredDate, inputSendDate, inputTotalAmount, inputPurchaseOrderStatus, inputPurchaseOrderDescription];
const ClearPurchaseOrderButtonFunction = () => {
    tbodyInnerFormPOrderMaterial.innerHTML = '';
    ClearFormFunction("formPurchaseOrder", refreshPurchaseOrderForm, listOfFormIDs);
    document.getElementById("tableDivInnerForm").style.display = 'none';
    refreshPOhasMInnerFormAndTable();
}



const inputSelectSupplierEl = document.getElementById("inputSelectSupplier");
inputSelectSupplierEl.addEventListener('change', () => {
    let selectedSupplier = JSON.parse(inputSelectSupplierEl.value);
    ClearPurchaseOrderButtonFunction();
    fillDataIntoSelect(inputSelectSupplier, "Select Supplier", listOFValidSupplier, 'businessname', selectedSupplier.businessname);
    selectDynamicValidator(inputSelectSupplierEl, 'purchaseorder', 'supplier_id');
    document.getElementById("inputSupplierNo").value = selectedSupplier.supplierno;
    document.getElementById('inputSupplierNo').classList.remove("is-invalid");
    document.getElementById('inputSupplierNo').classList.add("is-valid");
    document.getElementById('inputRequiredDate').disabled = false;
    materialList = ajaxGetRequestMapping("/purchaseorder/matlist/"+purchaseorder.supplier_id.id);
    fillDataIntoSelect(inputMaterialName, "Select Material", materialList, 'name');
    document.getElementById("inputMaterialName").disabled = false;
});




document.getElementById('inputRequiredDate').addEventListener('change', () => {
    purchaseorder.required_date = document.getElementById('inputRequiredDate').value;
    document.getElementById('inputRequiredDate').classList.remove("is-invalid");
    document.getElementById('inputRequiredDate').classList.add("is-valid");
    let currentDateForMax = new Date();
    document.getElementById('inputSendDate').value = getDateReturned("date", currentDateForMax);
    purchaseorder.sent_date = document.getElementById('inputSendDate').value;
    document.getElementById('inputSendDate').classList.remove("is-invalid");
    document.getElementById('inputSendDate').classList.add("is-valid");
    fillDataIntoSelect(inputPurchaseOrderStatus, "Select Purchase Order Status", purchaseOrderStatus, 'name', "Send");
    selectDynamicValidator(inputPurchaseOrderStatus, 'purchaseorder', 'purchase_order_status_id');

});




//----------------------------------------------- Inner Form Refresh Function -------------------------------------------------------------

const refreshPOhasMInnerFormAndTable = () => {

    purchaseorderhasmaterial = new Object();

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



    if (purchaseorder.supplier_id != null) {
        materialList = ajaxGetRequestMapping("/purchaseorder/matlist/"+purchaseorder.supplier_id.id);
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
        return parseFloat(ob.quotation_unit_price).toFixed(2);
    }

    const getMatLinePrice = (ob) => {
        return parseFloat(ob.quotation_line_price).toFixed(2);
    }
    const displayPropertyListInnerForm = [
        { dataType: 'function', propertyName: getMatNo },
        { dataType: 'function', propertyName: getMatName },
        { dataType: 'function', propertyName: getMatUnitPrice },
        { dataType: 'text', propertyName: 'quantity' },
        { dataType: 'function', propertyName: getMatLinePrice }
    ]

    if (purchaseorder.purchaseOrderHasMaterialList.length == 0) {
        document.getElementById("tableDivInnerForm").style.display = 'none';
    } else {
        fillDataIntoInnerTable("tbodyInnerFormPOrderMaterial", purchaseorder.purchaseOrderHasMaterialList, displayPropertyListInnerForm, deleteFunctionInnerForm);
        document.getElementById("tableDivInnerForm").style.display = 'block';
    }

}

const deleteFunctionInnerForm = (ob, rowIndex) => {

    purchaseorder.purchaseOrderHasMaterialList.splice(rowIndex, 1);
    refreshPOhasMInnerFormAndTable();
    generateTotalAmount();

}

//----------------------------------------------- Inner Form Refresh Function Ends --------------------------------------------------------

const inputMaterialNameEl = document.getElementById("inputMaterialName");

inputMaterialNameEl.addEventListener('change', () => {
    const selectedItemMaterial = JSON.parse(inputMaterialNameEl.value);
    refreshPOhasMInnerFormAndTable();
    fillDataIntoSelect(inputMaterialName, "Select Material", materialList, 'name', selectedItemMaterial.name);
    selectDynamicValidator(inputMaterialName, 'purchaseorderhasmaterial', 'material_id');
    const isFoundInList = purchaseorder.purchaseOrderHasMaterialList.some(element => {
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
            purchaseorderhasmaterial.material_id = selectedItemMaterial;
        } else {
            inputMaterialNameEl.classList.remove("is-valid");
            inputMaterialNameEl.classList.add("is-invalid");
            purchaseorderhasmaterial = new Object();
            document.getElementById("unitLabelSpan").innerHTML = "Unit"
        }
    }

    if (purchaseorderhasmaterial.material_id) {
        document.getElementById("inputMaterialNo").classList.remove("is-valid", "is-invalid");
        document.getElementById("inputMaterialUnitQuantity").classList.remove("is-valid", "is-invalid");
        document.getElementById("inputMaterialUnitPrice").classList.remove("is-valid", "is-invalid");
        document.getElementById("inputMaterialLinePrice").classList.remove("is-valid", "is-invalid");
        document.getElementById("inputMaterialUnitQuantity").disabled = false;
        document.getElementById("inputMaterialUnitQuantity").value = '';
        document.getElementById("unitLabelSpan").innerHTML = purchaseorderhasmaterial.material_id.material_unit_type_id.symbol;
        document.getElementById("inputMaterialNo").value = purchaseorderhasmaterial.material_id.matno;
        document.getElementById("inputMaterialNo").classList.add("is-valid");
        purchaseorderhasmaterial.quotation_unit_price = ajaxGetRequestMapping("/bestpurchaseprice/bymatid/"+purchaseorderhasmaterial.material_id.id).best_supplier_price;
        document.getElementById("inputMaterialUnitPrice").value = ajaxGetRequestMapping("/bestpurchaseprice/bymatid/"+purchaseorderhasmaterial.material_id.id).best_supplier_price;
        document.getElementById("inputMaterialUnitPrice").classList.add("is-valid");
        document.getElementById("inputMaterialUnitQuantity").value = purchaseorderhasmaterial.material_id.reorder_quantity;
        purchaseorderhasmaterial.quantity = purchaseorderhasmaterial.material_id.reorder_quantity;
        document.getElementById("inputMaterialUnitQuantity").classList.add("is-valid");
        purchaseorderhasmaterial.quotation_line_price = parseFloat(purchaseorderhasmaterial.quantity)* parseFloat(purchaseorderhasmaterial.quotation_unit_price);
        document.getElementById("inputMaterialLinePrice").value = purchaseorderhasmaterial.quotation_line_price;
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
            purchaseorderhasmaterial.quantity = inputMaterialUnitQuantityEl.value;
        } else {
            inputMaterialUnitQuantityEl.classList.remove('is-valid');
            inputMaterialUnitQuantityEl.classList.add('is-invalid')
            purchaseorderhasmaterial.quantity = null;
        }
    } else {
        inputMaterialUnitQuantityEl.classList.remove("is-valid", "is-invalid");
        purchaseorderhasmaterial.quantity = null;
    }
    generateLineTotalAmount();
});

//----------------------------------------------------------------- OnKey Up Quantity  Ends ----------------------------------------------------------------------------------------------



//---------------------------------------------------------------- Generate Line Total Amount ----------------------------------------------------------------------------------------------------------
const generateLineTotalAmount = () => {
    if (purchaseorderhasmaterial.material_id) {
        if (purchaseorderhasmaterial.quantity > 0) {
            purchaseorderhasmaterial.quotation_line_price = (parseFloat(purchaseorderhasmaterial.quantity) * parseFloat(purchaseorderhasmaterial.quotation_unit_price)).toFixed(2);
            document.getElementById("inputMaterialLinePrice").value = purchaseorderhasmaterial.quotation_line_price;
            document.getElementById("inputMaterialLinePrice").classList.remove("is-invalid");
            document.getElementById("inputMaterialLinePrice").classList.add("is-valid");
        } else {
            purchaseorderhasmaterial.quotation_line_price = null;
            document.getElementById("inputMaterialLinePrice").value = '';
            document.getElementById("inputMaterialLinePrice").classList.remove("is-valid", "is-invalid");
        }
    } else {
        purchaseorderhasmaterial.quotation_line_price = null;
        document.getElementById("inputMaterialLinePrice").value = '';
        document.getElementById("inputMaterialLinePrice").classList.remove("is-valid", "is-invalid");
    }
}
//---------------------------------------------------------------- Generate Line Total Amount Ends -----------------------------------------------------------------------------------------------------



//---------------------------------------------------------------- Generate Total Amount ----------------------------------------------------------------------------------------------------------
const generateTotalAmount = () => {
    if (purchaseorder.purchaseOrderHasMaterialList.length > 0) {
        let totalAmount = 0.00;
        purchaseorder.purchaseOrderHasMaterialList.forEach(element => {
            totalAmount = parseFloat(totalAmount) + parseFloat(element.quotation_line_price);
        });
        purchaseorder.total_amount = parseFloat(totalAmount).toFixed(2);
        document.getElementById("inputTotalAmount").value = purchaseorder.total_amount;
    } else {
        purchaseorder.total_amount = null;
        document.getElementById("inputTotalAmount").value = '';
    }
}
//---------------------------------------------------------------- Generate Total Amount Ends -----------------------------------------------------------------------------------------------------






const checkInnerFormErrorsPOhasM = () => {
    let errors = '';
    if (purchaseorderhasmaterial.material_id == null) {
        errors = errors + "Please select a material..! \n"
        inputMaterialName.classList.add("is-invalid");
    }
    if (purchaseorderhasmaterial.quantity == null) {
        errors = errors + "Please Enter a material quantity..! \n"
        inputMaterialUnitQuantity.classList.add("is-invalid");
    }
    return errors
}

document.getElementById("buttonAddPOrder").addEventListener('click', () => {

    let errorInnerForm = checkInnerFormErrorsPOhasM();
    if (errorInnerForm == '') {
        const selectedItemMaterial = JSON.parse(inputMaterialNameEl.value);
        const isFoundInList = purchaseorder.purchaseOrderHasMaterialList.some(element => {
            if (element.material_id.id === selectedItemMaterial.id) {
                return true;
            } else {
                return false;
            }
        });
        if (!isFoundInList) {
            document.getElementById("porderHasMaterialErrorDiv").style.display = 'none'
            purchaseorder.purchaseOrderHasMaterialList.push(purchaseorderhasmaterial);
            refreshPOhasMInnerFormAndTable();
            document.getElementById("tableDivInnerForm").style.display = 'block';
            generateTotalAmount();
        } else {
            alert("This material already exist..");
        }

    } else {

        alert("Material could not add to Quotation, has following errors \n" + errorInnerForm)
    }

});
