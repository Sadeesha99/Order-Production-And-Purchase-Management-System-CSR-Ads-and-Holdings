//call material table refresh function
window.addEventListener('load', () => {

    loggedUserPriviForCustomerOrder = ajaxGetRequestMapping("/privilege/bymodule/CustomerOrder");
    //loggedUserPriviForCustomerOrder.upd_privi = false;


    refreshCustomerOrderTable();
    // Calling Refresh function to data diplay table
    refreshCustomerOrderForm();




    if (!loggedUserPriviForCustomerOrder.ins_privi) {
        document.getElementById("tableTabButton").click();
        document.getElementById("formTabButton").style.display = 'none';
    }


});



//create function table refresh
const refreshCustomerOrderTable = () => {

    const Queued = ajaxGetRequestMapping("/customerorder/queued/list");
    const OnProduction = ajaxGetRequestMapping("/customerorder/onproduction/list");
    const Ready = ajaxGetRequestMapping("/customerorder/ready/list");
    const Completed = ajaxGetRequestMapping("/customerorder/completed/list");
    const Canceled = ajaxGetRequestMapping("/customerorder/canceled/list");


    customerOrdersList = Queued.concat(OnProduction,Ready,Completed,Canceled);

    const displayPropertyListCustomerOrder = [
        { dataType: 'text', propertyName: 'orderno' },
        { dataType: 'text', propertyName: 'required_date' },
        { dataType: 'function', propertyName: getRemainingBalance },
        { dataType: 'function', propertyName: getTotalBill },
        { dataType: 'function', propertyName: getCustomerOrderStatus },
        { dataType: 'function', propertyName: getCustomerName },
        { dataType: 'function', propertyName: getCustomerMobile }

    ]
    //call filldataintotable function
    //(tableId,dataList)
    fillDataIntoTable2('tbodyCustOrder', customerOrdersList, displayPropertyListCustomerOrder, viewCustomerOrder, cancelCustomerOrder, printCustomerOrder, true, loggedUserPriviForCustomerOrder);


    new DataTable('#tableCustOrder');
    // $("#tableCustOrder").DataTable({
    //     columnDefs: [{ className: 'dt-center', targets: '_all' },
    //     ]
    // });
    document.getElementById("tableCustOrder").style.width = "100%";

}

const getCustomerOrderStatus = (ob) => {

    if (ob.customer_order_status_id.id == 1) {  /*Queued*/
        return '<p style="border-radius:10px; background-color: #d2ac14;" class="p-2 text-center fw-bold">' + ob.customer_order_status_id.name + '</p>'
    }
    if (ob.customer_order_status_id.id == 2) {  /*On-Production*/
        return '<p style="border-radius:10px; background-color: #a6d214;" class="p-2 text-center fw-bold">' + ob.customer_order_status_id.name + '</p>'
    }
    if (ob.customer_order_status_id.id == 3) {  /*Ready*/
        return '<p style="border-radius:10px; background-color: #1460d2;" class="p-2 text-center fw-bold">' + ob.customer_order_status_id.name + '</p>'
    }
    if (ob.customer_order_status_id.id == 4) {  /*Completed*/
        return '<p style="border-radius:10px; background-color: #1dd214;" class="p-2 text-center fw-bold">' + ob.customer_order_status_id.name + '</p>'
    }
    if (ob.customer_order_status_id.id == 5) {  /*Canceled*/
        return '<p style="border-radius:10px; background-color: #d21414;" class="p-2 text-center fw-bold">' + ob.customer_order_status_id.name + '</p>'
    }
    if (ob.customer_order_status_id.id == 6) {  /*Waiting For Payment*/
        return '<p style="border-radius:10px; background-color: #6314d2;" class="p-2 text-center fw-bold">' + ob.customer_order_status_id.name + '</p>'
    }

}

const getCustomerName = (ob) => {
    return ob.customer_id.name;
}

const getCustomerMobile = (ob) => {
    return ob.customer_id.mobile;
}

const getRemainingBalance = (ob) => {
    return parseFloat(ob.remaining_balance).toFixed(2);
}

const getTotalBill = (ob) => {
    return parseFloat(ob.total_bill).toFixed(2);
}



const refreshCustomerOrderForm = () => {
    //creating a new object for product
    customerorder = new Object();

    oldcustomerorder = null;

    customerOrderStatus = ajaxGetRequestMapping("/customerorder/status/findall");

    fillDataIntoSelect(inputCustomerOrderStatus, "Select Order status", customerOrderStatus, 'name');

    customerList = ajaxGetRequestMapping("/customer/active");
    designList = ajaxGetRequestMapping("/design/list");

    let currentDate = new Date().toLocaleDateString('en-CA');

    document.getElementById("inputRequiredDate").setAttribute("min", currentDate);

    let currentDateForMax = new Date();
    currentDateForMax.setDate(currentDateForMax.getDate() + 30);
    inputRequiredDate.max = getDateReturned("date", currentDateForMax);

    refreshInnerFormCorderhasProduct();

    document.getElementById("inputCustomerOrderStatus").disabled = false;

    document.getElementById("inputFirstPayement").disabled = true;

    document.getElementById("inputBillType").disabled = false;

    //disable buttons 
    document.getElementById("formAddBtn").disabled = false;
    document.getElementById("formUpdateBtn").disabled = true;
    document.getElementById("formRestBtn").disabled = false;



    document.getElementById("orderProductErrorDiv").style.display = 'none';

    document.getElementById("backButtonDivFormFirst").style.display = 'none';

    document.getElementById("tableDivInnerForm").style.display = 'none';

    document.getElementById("formEditable").style.pointerEvents = "auto";


}


//customer form refill with database object
const customerOrderFormRefill = (ob) => {

    customerorder = JSON.parse(JSON.stringify(ob));
    oldcustomerorder = JSON.parse(JSON.stringify(ob));

    document.getElementById("inputBillType").disabled = true;

    inputCustomerOrderNo.value = ob.orderno;
    document.getElementById("inputCustomerMobile").value = ob.customer_id.mobile;
    inputCustomerName.value = ob.customer_id.name;

    inputRequiredDate.value = ob.required_date;
    inputFirstPayement.value = parseFloat(ob.first_payment).toFixed(2);
    inputCustomerOrderRemainingBalance.value = parseFloat(ob.remaining_balance).toFixed(2);
    inputCustomerOrderTotalPrice.value = parseFloat(ob.total_bill).toFixed(2);

    fillDataIntoSelect(inputCustomerOrderStatus, "Select Order status", customerOrderStatus, 'name', ob.customer_order_status_id.name);

    document.getElementById("inputCustomerOrderDesicription").value = ob.description;

    refreshInnerFormTableCorderhasProduct();
    refreshInnerFormCorderhasProduct();

    document.getElementById("inputFirstPayement").classList.remove("is-valid", "is-invalid");

    document.getElementById("tableDivInnerForm").style.display = 'block';

    document.getElementById("formTabButton").click();

}


//Create function for delete material record
const cancelCustomerOrder = (ob) => {



    const addedDate = getGiveDateString(ob.added_time);

    const currentDate = getCurrentDateString();

    const differenceInDays = (parseInt(currentDate) - parseInt(addedDate));

    const addedTimeHour = getGiveTimeString(ob.added_time).hourString;

    const currentTimeHour = getCurrentTimeString().hourString;

    const differenceInTimeHour = (parseInt(currentTimeHour) - parseInt(addedTimeHour));

    const addedTimeMinute = getGiveTimeString(ob.added_time).minuteString;

    const currentTimeMinute = getCurrentTimeString().minuteString;

    const differenceInTimeMinute = (parseInt(currentTimeMinute) - parseInt(addedTimeMinute));


    if (differenceInDays == 0) {
        if (differenceInTimeHour == 0) {
            if (differenceInTimeMinute < 15) {
                const confirmCustomerOrderDelete = confirm('Are you sure to delete following Order..? \n'
                    + '\n Order No : ' + ob.orderno
                    + '\n Customer Name : ' + ob.customer_id.name
                    + '\n Order Status : ' + ob.customer_order_status_id.name);
                if (confirmCustomerOrderDelete) {
                    const deleteSeverResponse = ajaxDelRequestMapping("/customerorder",ob);
                    if (deleteSeverResponse=='OK') {
                        alert('Delete Successfully..!');
                        //refresh table
                        refreshCustomerOrderTable();
                    }else{
                        alert('Delete not completed, You have following error\n' + deleteSeverResponse);
                    }
                } else {
                    alert('Delete request was canceled')
                }
            } else {
                alert("Customer Order cannot be deleted after 15 mins of submit..");
            }
        } else {
            alert("This Customer Order cannot be deleted.");
        }
    } else {
        alert("This Customer Order cannot be deleted.");
    }

}

//function for edit product button
const viewCustomerOrder = (ob) => {
    refreshCustomerOrderForm();
    viewButtonFunction(customerOrderFormRefill, ob, "tableTabButton", "formAddBtn", "formUpdateBtn", "formRestBtn", ClearOrderFormButtonFunction);
    document.getElementById("backButtonDivFormFirst").style.display = 'block';
    document.getElementById("formEditable").style.pointerEvents = "none";
    const nodeList = document.querySelectorAll(".tableViewFileButton");
    for (let i = 0; i < nodeList.length; i++) {
        nodeList[i].style.pointerEvents = "auto";
    }
}
//Create function for view product record
const printCustomerOrder = (ob) => {
    const getUnit_price = (ob) => {
        return 'LKR ' + parseFloat(ob.unit_price).toFixed(2);
    }
    const getLine_price = (ob) => {
        return 'LKR ' + parseFloat(ob.line_price).toFixed(2);
    }
    const getQuantity = (ob) => {
        return parseFloat(ob.quantity);
    }
    const getProductName = (ob) => {
        return (ob.product_id.name);
    }
    const displayPropertyList = [
        { dataType: 'function', propertyName: getProductName },
        { dataType: 'function', propertyName: getUnit_price },
        { dataType: 'function', propertyName: getQuantity },
        { dataType: 'function', propertyName: getLine_price }
    ]

    if (ob.customerOrderHasProductList != null && ob.customerOrderHasProductList.length > 0) {
        fillDataIntoBillingTable("tbodyForBill", ob.customerOrderHasProductList, displayPropertyList);
        const productListTableContent = document.getElementById("tbodyForBill").innerHTML;
        printOrderDetails(ob, productListTableContent);
    }
}
//back button in product form
const backButtonOrderForm = () => {
    backButtonFunctionForm("tableTabButton", "formAddBtn", "formUpdateBtn", "formRestBtn", ClearOrderFormButtonFunction)
    document.getElementById("backButtonDivFormFirst").style.display = 'none';
    refreshCustomerOrderForm();
}

const inputRequiredDateEL = document.getElementById("inputRequiredDate");
inputRequiredDateEL.addEventListener('dblclick',()=>{
    inputRequiredDateEL.value= new Date().toLocaleDateString('en-CA');
    customerorder.required_date = inputRequiredDateEL.value;
    inputRequiredDateEL.classList.remove("is-invalid");
    inputRequiredDateEL.classList.add("is-valid");
});



const checkCustomerOrderFormError = () => {
    let error = '';
    if (customerorder.customer_id == null) {
        error = error + "Enter Valid Customer..!\n";
        inputCustomerMobile.classList.add("is-invalid");
    }
    if (customerorder.customer_order_status_id == null) {
        error = error + "Enter valid Order status..!\n";
        inputCustomerOrderStatus.classList.add("is-invalid");
    }
    if (customerorder.total_bill == null) {
        error = error + "Total Bill is included..!\n";
        inputCustomerOrderTotalPrice.classList.add("is-invalid");
    }
    if (customerorder.remaining_balance == null) {
        error = error + "Remaining Amount is not included..!\n";
        inputCustomerOrderRemainingBalance.classList.add("is-invalid");
    }
    if (customerorder.first_payment == null) {
        error = error + "Order cannot be placed without an advanced payment..!\n";
        inputFirstPayement.classList.add("is-invalid");
    }
    if (customerorder.required_date == null) {
        error = error + "Order Requried date is not included..!\n";
        inputRequiredDate.classList.add("is-invalid");
    }
    if (customerorder.description == null) {
        error = error + "Please add breif description on this order..!\n";
        inputCustomerOrderDesicription.classList.add("is-invalid");
    }
    if (customerorder.customerOrderHasProductList == null) {
        error = error + "Customer Order must have Products..!\n";
        document.getElementById("orderProductErrorDiv").style.display = 'inline'
    }

    return error;
}



//define function for submit product
const submitCustomerOrder = () => {
    // console.log("Submit");
    //console.log(Product);
    const errors = checkCustomerOrderFormError();

    if (errors == '') {
        let confirmCustomerOrderSubmit = confirm('Are you sure to add following product..?'
            + '\n Customer Name : ' + customerorder.customer_id.name
            + '\n Customer Required Date : ' + customerorder.required_date
            + '\n Order Total : ' + customerorder.total_bill);
        // need to get user confirmation
        if (confirmCustomerOrderSubmit) {
            //console.log(product);
            const cOrderPostServiceResponse = ajaxPostRequestMapping("/customerorder",customerorder);
            if (cOrderPostServiceResponse == "OK") {
                alert("Save Successefully..!")
                //refresh table
                refreshCustomerOrderTable();
                //click button to back
                ClearOrderFormButtonFunction();
                //call form refresh function
                refreshCustomerOrderForm();
                //back button function button
                backButtonOrderForm();
            } else {
                alert(cOrderPostServiceResponse);
            }
        } else {
            alert("Order entry canceled..");
        }

    } else {
        alert("Form has following errors : \n" + errors)
    }
}

let listOfFormIDs = [inputCustomerMobile, inputCustomerName, inputRequiredDate, inputFirstPayement, inputCustomerOrderRemainingBalance, inputCustomerOrderTotalPrice, inputCustomerOrderDesicription,inputCustomerOrderStatus];
const ClearOrderFormButtonFunction = () => {
    tableInnerFormBody.innerHTML = '';
    ClearFormFunction("formCustOrder", refreshCustomerOrderForm, listOfFormIDs);
}



//--------------------------------------------------------- Inner Form Section ------------------------------------------------------------------------------------------------------

const refreshInnerFormTableCorderhasProduct = () => {

    // Refresh inner table
    const displayPropertyList = [
        { dataType: 'function', propertyName: getProductName },
        { dataType: 'function', propertyName: getUnitPrice },
        { dataType: 'text', propertyName: 'quantity' },
        { dataType: 'function', propertyName: getLinePrice },
        { dataType: 'fileview', propertyName: getDesignFile }
    ]
    fillDataIntoInnerTable("tableInnerFormBody", customerorder.customerOrderHasProductList, displayPropertyList, deleteFunctionInnerForm);

    if (!customerorder.customerOrderHasProductList) {
        //has productHasMatList
        document.getElementById("tableDivInnerForm").style.display = 'none';
    } else if (customerorder.customerOrderHasProductList.length == 0) {
        document.getElementById("tableDivInnerForm").style.display = 'none';
    }
    else {
        document.getElementById("tableDivInnerForm").style.display = 'block';
    }

    if(oldcustomerorder==!null){
        generateSuggestedAdvance();
    }


}

const getUnitPrice = (ob) => {
    return parseFloat(ob.unit_price).toFixed(2);
}

const getLinePrice = (ob) => {
    return parseFloat(ob.line_price).toFixed(2);
}

const getProductName = (ob) => {
    return ob.product_id.name;
}

const getDesignFile = (ob) => {
    //console.log('View Button');
    //let writeStringToWindow = '<div style="height: 500px; width: 500px;"><img src="'+atob(ob.design_id.design_file)+'" width="500px" height="auto"></div>';

    if (ob.design_id==null || !ob.design_id.design_file) {
        nofileMessageReturn();
    } else {
        let designFile = atob(ob.design_id.design_file);
        openFileWithHtmlContent(designFile)
    }
    //console.log( atob(ob.design_id.design_file));
    //let mimeType = "application/pdf"


}



const deleteFunctionInnerForm = (ob, rowIndex) => {

    // At position rowIndex of productHasMaterialList , remove 1 element
    customerorder.customerOrderHasProductList.splice(rowIndex, 1);
    generateSuggestedAdvance();
    revalidateFirstPayment();
    refreshInnerFormTableCorderhasProduct();

}




const refreshInnerFormCorderhasProduct = () => {
    customerorderhasproduct = new Object();


    customerorderhasproduct.design_id = new Object();

    productList = ajaxGetRequestMapping("/product/findall");

    //Material status dynamic select fill
    //document.getElementById("inputMaterialName").disabled = true;
    document.getElementById("inputProductUnitQuantity").disabled = true;

    document.getElementById('openFileBtn').style.display = 'none';
    document.getElementById('clearFileBtn').style.display = 'none';

    document.getElementById("productDesignErrorDiv").style.display = 'none';

    document.getElementById("designStatus").checked = true;
    document.getElementById('designAddField').style.display = 'flex';
    document.getElementById('designDivSection').style.display = 'none';
}






let inputProductNameEl = document.getElementById("inputProductName");
let resultDivMaterial = document.getElementById("divResultByProductName");
let resultDivProduct = document.getElementById("divResultByProductName");
let inputCustomerMobileEl = document.getElementById("inputCustomerMobile");
let resultDivCustomer = document.getElementById("divResultByCustomerName");



const checkCOHPInnerFormErrors = () => {
    errors = '';

    if (customerorderhasproduct.product_id == null) {
        errors = errors + "Please select a Product..! \n"
        inputProductName.classList.remove("is-valid");
        inputProductNo.classList.remove("is-valid");
        inputProductUnitPrice.classList.remove("is-valid");
        inputProductName.classList.add("is-invalid");
        inputProductNo.classList.add("is-invalid");
        inputProductUnitPrice.classList.add("is-invalid");
    }
    if (customerorderhasproduct.quantity == null) {
        errors = errors + "Please enter a quantity..! \n";
        inputProductUnitQuantity.classList.remove("is-valid");
        inputProductUnitQuantity.classList.add("is-invalid");
    }
    if (customerorderhasproduct.unit_price == null) {
        errors = errors + "Something is wrong with product \n";
        inputProductName.classList.remove("is-valid");
        inputProductNo.classList.remove("is-valid");
        inputProductUnitPrice.classList.remove("is-valid");
        inputProductName.classList.add("is-invalid");
        inputProductNo.classList.add("is-invalid");
        inputProductUnitPrice.classList.add("is-invalid");
    }
    if (customerorderhasproduct.line_price == null) {
        errors = errors + "Please check the Product Quantity and required quantity, Unit price is not included..! \n";
        inputProductLinePrice.classList.remove("is-valid");
        inputProductLinePrice.classList.add("is-invalid");
    }


    return errors;
}


//-------------------------------------------------------------- Clear Button Order has product form -------------------------------------------------------

document.getElementById("buttonClearProduct").addEventListener('click', () => {
    clearInnerFormProductHasMaterial();
    refreshInnerFormCorderhasProduct();
});

//-------------------------------------------------------------- Clear Button Order has product form Ends --------------------------------------------------


//-------------------------------------------------------------- Add Button Order has product form ----------------------------------------------------
document.getElementById("buttonAddProduct").addEventListener('click', () => {



    let errorInnerForm = checkCOHPInnerFormErrors();
    let designFileStatus = false;
    let designFileStatusMsg = ''
    let designIncluded = '';
    if (document.getElementById("designStatus").checked == true) {
        if (customerorderhasproduct.design_id == null || customerorderhasproduct.design_id.design_file == null) {
            designFileStatusMsg = designFileStatusMsg + "No Design is added, Are your sure you want to continue without design file ? \n";
            document.getElementById("productDesignErrorDiv").style.display = 'block';
        }
    }
    if (document.getElementById("designStatus").checked == false) {
        if (customerorderhasproduct.design_id == null || customerorderhasproduct.design_id.design_file == null) {
            designFileStatusMsg = designFileStatusMsg + "No Design is Selected, Are your sure you want to continue without design file ? \n";
            document.getElementById("productDesignErrorDiv").style.display = 'block';
        }
    }
    if (designFileStatusMsg != '') {
        let confirmDesignStatus = confirm(designFileStatusMsg);
        if (confirmDesignStatus) {
            designFileStatus = true;
            customerorderhasproduct.design_id = null;
            designIncluded = "Not included";
        } else {
            designFileStatus = false;
            alert("If you don't want to continue without a design, Please insert assign a design file.")
            errorInnerForm = errorInnerForm + 'Design Required but design file is missing..'
            customerorderhasproduct.design_id = null;
            designIncluded = "Not included";
        }

    } else {
        designFileStatus = true;
        designIncluded = "Included";
    }


    if (errorInnerForm == '' && designFileStatus == true) {
        let confirmOrderProductSubmit = confirm('Are you sure to add following Product to this Order..?'
            + '\n Product Name : ' + customerorderhasproduct.product_id.name
            + '\n Quantity : ' + customerorderhasproduct.quantity
            + '\n Unit Price : ' + customerorderhasproduct.unit_price
            + '\n Line Price : ' + customerorderhasproduct.line_price
            + '\n Design Status : ' + designIncluded
        );
        if (confirmOrderProductSubmit) {
            if (!customerorder.customerOrderHasProductList) {
                customerorder.customerOrderHasProductList = [];
                customerorder.customerOrderHasProductList.push(customerorderhasproduct);
            } else {
                customerorder.customerOrderHasProductList.push(customerorderhasproduct);
            }
            clearInnerFormProductHasMaterial();
            refreshInnerFormCorderhasProduct();
            refreshInnerFormTableCorderhasProduct();
            document.getElementById("tableDivInnerForm").style.display = 'block';
            document.getElementById("orderProductErrorDiv").style.display = 'none';
            generateTotalBill();
            generateSuggestedAdvance();
            revalidateFirstPayment();

            if (inputBillType.value == 'Quotation') {
                document.getElementById("inputFirstPayement").value = '';
                document.getElementById("inputFirstPayement").disabled = true;
                document.getElementById("inputFirstPayement").classList.remove('is-valid', 'is-invalid');
                customerorder.remaining_balance = null;
                document.getElementById("inputCustomerOrderRemainingBalance").value = '';
                document.getElementById("inputCustomerOrderRemainingBalance").classList.remove('is-valid', 'is-invalid');
                customerorder.customer_order_status_id = null;
                fillDataIntoSelect(inputCustomerOrderStatus, "Select Order status", customerOrderStatus, 'name');
            }else{
                if(customerorder.customer_order_status_id!=null){
                    fillDataIntoSelect(inputCustomerOrderStatus, "Select Order status", customerOrderStatus, 'name',customerorder.customer_order_status_id.name);
                    selectDynamicValidator(inputCustomerOrderStatus, 'customerorder', 'customer_order_status_id');
                }else{
                    fillDataIntoSelect(inputCustomerOrderStatus, "Select Order status", customerOrderStatus, 'name')
                }
            }
        }
    } else {
        alert("Product could not add to Customer Order, has following errors \n" + errorInnerForm)
    }

});


//-------------------------------------------------------------- Add Button Order has product form End -------------------------------------------------


//-------------------------------------------------------------- First Order Payment OnkeyUp End -------------------------------------------------

document.getElementById("inputFirstPayement").addEventListener("keyup", () => {
    revalidateFirstPayment();


});

const revalidateFirstPayment = () => {
    if (inputFirstPayement.value != '') {
        if (parseFloat(customerorder.first_payment) > parseFloat(customerorder.total_bill)) {
            customerorder.first_payment = null;
            inputFirstPayement.classList.remove('is-valid');
            inputFirstPayement.classList.add('is-invalid');
            revalidateFirstPayment();

        } else {
            if (document.getElementById("inputFirstPayement").classList.contains('is-valid')) {
                let inputFirstPayementField = document.getElementById("inputFirstPayement").value;
                customerorder.first_payment = parseFloat(inputFirstPayementField).toFixed(2);
                generateTotalBill();
                generateRemainingBalance();
            } else {
                customerorder.first_payment = null;
                generateTotalBill();
                generateRemainingBalance();
            }
        }
    } else {
        customerorder.first_payment = null;
        generateTotalBill();
        generateRemainingBalance();
    }
}
//-------------------------------------------------------------- First Order Payment OnkeyUp -----------------------------------------------------


//------------------------- Total Bill Generation -------------------------------------------------------------------------------------
const generateTotalBill = () => {
    let order_total = 0.00;

    customerorder.customerOrderHasProductList.forEach(element => {
        order_total = parseFloat(order_total) + parseFloat(element.line_price);
    });

    if (order_total > 0) {
        inputCustomerOrderTotalPrice.value = parseFloat(order_total).toFixed(2);
        customerorder.total_bill = parseFloat(order_total).toFixed(2);
        inputCustomerOrderTotalPrice.classList.remove("is-invalid");
        inputCustomerOrderTotalPrice.classList.add("is-valid");
        document.getElementById("inputFirstPayement").disabled = false;
    } else {
        inputCustomerOrderTotalPrice.value = '';
        customerorder.total_bill = null;
        customerorder.first_payment = null;
        inputCustomerOrderTotalPrice.classList.remove("is-valid");
        inputCustomerOrderTotalPrice.classList.add("is-invalid");
        document.getElementById("inputFirstPayement").disabled = true;
        inputFirstPayement.value = '';
        inputFirstPayement.classList.remove("is-invalid");
        inputFirstPayement.classList.remove("is-valid");
    }
}
//------------------------- Total Bill Generation Ends ----------------------------------------------------------------------------------


//------------------------- Generate first payment suggestion -------------------------------------------------------------------------------------
const generateSuggestedAdvance = () => {
    let order_total = 0.00;

    customerorder.customerOrderHasProductList.forEach(element => {
        order_total = parseFloat(order_total) + parseFloat(element.line_price);
    });

    if (order_total > 0) {
        document.getElementById("inputFirstPayement").disabled = false;
        customerorder.first_payment = ((parseFloat(order_total) / 100) * 25).toFixed(2);
        document.getElementById("inputFirstPayement").value = ((parseFloat(order_total) / 100) * 25).toFixed(2);
        inputFirstPayement.classList.remove("is-invalid");
        inputFirstPayement.classList.add("is-valid");
    } else {
        customerorder.first_payment = null;
        document.getElementById("inputFirstPayement").disabled = true;
        inputFirstPayement.value = '';
        inputFirstPayement.classList.remove("is-invalid");
        inputFirstPayement.classList.remove("is-valid");
    }
}
//------------------------- Generate first payment suggestion Ends ----------------------------------------------------------------------------------


//------------------------- Remaining Balance Generation -------------------------------------------------------------------------------------
const generateRemainingBalance = () => {
    let order_total = 0.00;

    customerorder.customerOrderHasProductList.forEach(element => {
        order_total = parseFloat(order_total) + parseFloat(element.line_price);
    });

    if (customerorder.first_payment) {
        customerorder.remaining_balance = (parseFloat(order_total) - parseFloat(customerorder.first_payment)).toFixed(2);
        inputCustomerOrderRemainingBalance.value = customerorder.remaining_balance;
        inputCustomerOrderRemainingBalance.classList.remove("is-invalid");
        inputCustomerOrderRemainingBalance.classList.add("is-valid");
    } else {
        customerorder.remaining_balance = null;
        inputCustomerOrderRemainingBalance.value = '';
        inputCustomerOrderRemainingBalance.classList.remove("is-valid");
        inputCustomerOrderRemainingBalance.classList.remove("is-invalid");
    }
}
//------------------------- Remaining Balance Generation Ends ----------------------------------------------------------------------------------

// ------------------------------------ clear form customer order has product ----------------------------------------------------------

const clearInnerFormProductHasMaterial = () => {
    let listofFieldsInnerFormPhM = [inputProductName, inputProductNo, inputProductUnitQuantity, inputProductUnitPrice, inputProductLinePrice, inputDesignFile, inputCustomerOrderStatus]
    listofFieldsInnerFormPhM.forEach(element => {
        element.value = '';
        element.classList.remove('is-invalid');
        element.classList.remove('is-valid');
    });
}

// ------------------------------------ clear form customer order has product Ends ------------------------------------------------------




//--------------------------------- Required Date Onchange ----------------------------------------------------------------------------------


document.getElementById("inputRequiredDate").addEventListener('change', () => {
    let currentDateMonth = parseInt(new Date().toLocaleDateString('en-CA').split('-')[1]);
    //console.log(currentDateMonth);
    let requriedDateArray = (inputRequiredDate.value).split('-');
    let requiredMonth = parseInt(requriedDateArray[1]);
    //console.log(requiredMonth);
    function validateReqDate(binaryValue) {
        if (binaryValue) {
            inputRequiredDate.classList.remove('is-invalid');
            inputRequiredDate.classList.add('is-valid');
            customerorder.required_date = inputRequiredDate.value;
        } else {
            inputRequiredDate.classList.remove('is-valid');
            inputRequiredDate.classList.add('is-invalid');
            customerorder.required_date = null;
        }
    }
    if (currentDateMonth == 12) {
        if (requiredMonth == 12 || requiredMonth == 1) {
            //valid
            validateReqDate(true);
        } else {
            //not valid
            validateReqDate(false);
        }
    } else {
        if (requiredMonth <= (currentDateMonth + 1)) {
            //valid
            validateReqDate(true);
        } else {
            //invalid
            validateReqDate(false);
        }
    }
});

//--------------------------------- Required Date Onchange  Ends ----------------------------------------------------------------------------











//--------------------------------- Customer Search Functions ----------------------------------------------------------------------------------


const onclickCustomerFunction = (ob) => {
    customerorder.customer_id = ob;
    inputCustomerMobile.value = ob.mobile;
    document.getElementById('inputCustomerMobile').classList.remove("is-invalid");
    document.getElementById('inputCustomerMobile').classList.add("is-valid");
    inputCustomerName.value = customerorder.customer_id.name;
    document.getElementById('inputCustomerName').classList.remove("is-invalid");
    document.getElementById('inputCustomerName').classList.add("is-valid");


}

inputCustomerMobileEl.addEventListener('click', () => {
    if (customerList == null || customerList.length == 0) {
        noresultList = [{ name: "No Result to Show" }]
        const noresultFunction = () => {
            resultDivCustomer.innerHTML = '';
        }
        displaySearchList(noresultList, resultDivCustomer, 'name', '', noresultFunction);

    } else {
        if (inputCustomerMobileEl.value == '' || inputCustomerMobileEl == null || customerorder.customer_id == null) {
            inputCustomerMobileEl.classList.remove("is-invalid");
            inputCustomerMobileEl.classList.remove("is-valid");
        }
        displaySearchList(customerList, resultDivCustomer, 'mobile', 'name', onclickCustomerFunction);

    }
});

inputCustomerMobileEl.addEventListener('keyup', () => {

    if (customerList == null || customerList.length == 0) {

    } else {

        if (inputCustomerMobileEl.value == null || inputCustomerMobileEl.value == "") {
            displaySearchList(customerList, resultDivCustomer, 'mobile', 'name', onclickCustomerFunction);
            customerorder.customer_id = null;
            let listofFieldsCustomerOrder_ID = [inputCustomerMobile, inputCustomerName]
            listofFieldsCustomerOrder_ID.forEach(element => {
                element.value = '';
                element.classList.remove('is-invalid');
                element.classList.remove('is-valid');
            });
            inputCustomerMobileEl.classList.remove("is-invalid");
            inputCustomerMobileEl.classList.remove("is-valid");

        } else {
            let searchResult = (searchFunction(customerList, inputCustomerMobileEl, 'mobile'));
            displaySearchList(searchResult, resultDivCustomer, 'mobile', 'name', onclickCustomerFunction);
            if (inputCustomerMobileEl.classList.contains('is-invalid')) {
                customerorder.customer_id = null;
                resultDivCustomer.innerHTML = '';
            }
        }
    }
});
//--------------------------------- Customer Search Functions Ends -----------------------------------------------------------------------------



//--------------------------------- Product Search Functions ----------------------------------------------------------------------------------

const onclickProductFunction = (ob) => {
    customerorderhasproduct.product_id = ob;
    inputProductNameEl.value = ob.name;
    document.getElementById('inputProductName').classList.remove("is-invalid");
    document.getElementById('inputProductName').classList.add("is-valid");
    customerorderhasproduct.unit_price = parseFloat(ob.total_price).toFixed(2);
    inputProductUnitPrice.value = parseFloat(ob.total_price).toFixed(2);
    document.getElementById('inputProductUnitPrice').classList.remove("is-invalid");
    document.getElementById('inputProductUnitPrice').classList.add("is-valid");
    inputProductNo.value = ob.productno;
    document.getElementById('inputProductNo').classList.remove("is-invalid");
    document.getElementById('inputProductNo').classList.add("is-valid");
    document.getElementById('inputProductUnitQuantity').disabled = false;
    document.getElementById('inputProductUnitQuantity').classList.remove("is-invalid");
    document.getElementById('inputProductUnitQuantity').classList.remove("is-valid");
    document.getElementById('inputProductUnitQuantity').value = '';
    document.getElementById('inputProductLinePrice').classList.remove("is-invalid");
    document.getElementById('inputProductLinePrice').classList.remove("is-valid");
    document.getElementById('inputProductLinePrice').value = '';
    customerorderhasproduct.quantity = null;
    customerorderhasproduct.line_price = null;



}

document.getElementById("inputProductName").addEventListener('click', () => {
    if (productList == null || productList.length == 0) {
        noresultList = [{ name: "No Result to Show" }]
        const noresultFunction = () => {
            resultDivProduct.innerHTML = '';
        }
        displaySearchList(noresultList, resultDivProduct, 'name', '', noresultFunction);

        resultDivProduct.value = 'No Search Results';
    } else {
        if (inputProductNameEl.value == '' || inputProductNameEl == null || customerorderhasproduct.product_id == null) {
            inputProductNameEl.classList.remove("is-invalid");
            inputProductNameEl.classList.remove("is-valid");
        }
        displaySearchList(productList, resultDivProduct, 'name', 'productno', onclickProductFunction);

    }
});


document.getElementById("inputProductName").addEventListener('keyup', () => {


    if (productList == null || productList.length == 0) {

    } else {

        if (inputProductNameEl.value == null || inputProductNameEl.value == "") {
            document.getElementById('inputProductName').classList.remove("is-invalid");
            document.getElementById('inputProductName').classList.remove("is-valid");
            displaySearchList(productList, resultDivProduct, 'name', 'productno', onclickProductFunction);
            customerorderhasproduct.product_id = null;
            let listofFieldsInnerFormCOhasP = [inputProductUnitPrice, inputProductNo, inputProductUnitQuantity, inputProductUnitQuantity]
            listofFieldsInnerFormCOhasP.forEach(element => {
                element.value = '';
                element.classList.remove('is-invalid');
                element.classList.remove('is-valid');
            });
            let listofPropertiesFormCOhasP = ['unit_price']
            listofPropertiesFormCOhasP.forEach(element => {
                customerorderhasproduct[element] = null;
            });

        } else {
            let searchResult = (searchFunction(productList, inputProductNameEl, 'name'));
            displaySearchList(searchResult, resultDivProduct, 'name', 'productno', onclickProductFunction);
            if (inputProductNameEl.classList.contains('is-invalid')) {
                customerorderhasproduct.product_id = null;
                resultDivMaterial.innerHTML = '';
            }
        }
    }
});
//--------------------------------- Product Search Functions Ends -----------------------------------------------------------------------------


//---------------------------------- OnClick Body Function ---------------------------------------------------------------------

document.body.addEventListener('click', (event) => {
    // Check if the click target is not the input field or its descendant
    if (!(inputProductName.contains(event.target))) {
        resultDivProduct.innerHTML = '';
        if (customerorderhasproduct.product_id) {
            if (document.getElementById("inputProductName").classList.contains('is-valid')) {
                document.getElementById("inputProductName").value = '';
                inputProductNameEl.value = customerorderhasproduct.product_id.name;
                document.getElementById('inputProductName').classList.remove("is-invalid");
                document.getElementById('inputProductName').classList.add("is-valid");

            } else {
                document.getElementById("inputProductName").value = '';
            }
        } else {
            if (inputProductNameEl.value == '') {
                inputProductNameEl.classList.remove("is-valid");
                inputProductNameEl.classList.remove("is-invalid");
            } else {
                inputProductNameEl.classList.remove("is-valid");
                inputProductNameEl.classList.add("is-invalid");
            }
        }
    }

});

document.body.addEventListener('click', (event) => {
    // Check if the click target is not the input field or its descendant
    if (!(inputCustomerMobileEl.contains(event.target))) {
        resultDivCustomer.innerHTML = '';
        if (customerorder.customer_id) {
            if (document.getElementById("inputCustomerMobile").classList.contains('is-valid')) {
                document.getElementById("inputCustomerMobile").value = '';
                inputCustomerMobileEl.value = customerorder.customer_id.mobile;
                document.getElementById('inputCustomerMobile').classList.remove("is-invalid");
                document.getElementById('inputCustomerMobile').classList.add("is-valid");

            }
        } else {
            if (inputCustomerMobileEl.value == '') {
                inputCustomerMobileEl.classList.remove("is-valid");
                inputCustomerMobileEl.classList.remove("is-invalid");
            } else {
                inputCustomerMobileEl.classList.remove("is-valid");
                inputCustomerMobileEl.classList.add("is-invalid");
            }
        }
    }

});
//---------------------------------- OnClick Body Function Ends ----------------------------------------------------------------


//---------------------------------- OnClick Customer Order Status Function ---------------------------------------------------------------------

const inputCustomerOrderStatusEl = document.getElementById('inputCustomerOrderStatus');
inputCustomerOrderStatusEl.addEventListener('click', () => {
    if (window['oldcustomerorder']) {

    } else {
        fillDataIntoSelect(inputCustomerOrderStatus, "Select Order status", customerOrderStatus, 'name', 'Queued');
        selectDynamicValidator(inputCustomerOrderStatus, 'customerorder', 'customer_order_status_id');
        inputCustomerOrderStatusEl.disabled = true;
    }
});

//---------------------------------- OnClick Customer Order Status Function Ends ----------------------------------------------------------------



//---------------------------------- OnKeyUp Product Quantity Function ---------------------------------------------------------------------
const inputProductQuantityEl = document.getElementById("inputProductUnitQuantity");
document.getElementById("inputProductUnitQuantity").addEventListener('keyup', () => {
    if (inputProductQuantityEl.classList.contains('is-valid')) {
        if (customerorderhasproduct.unit_price != null) {
            customerorderhasproduct.quantity = parseFloat(inputProductQuantityEl.value);
            document.getElementById("inputProductLinePrice").value = parseFloat(customerorderhasproduct.unit_price * customerorderhasproduct.quantity).toFixed(2);
            customerorderhasproduct.line_price = parseFloat(customerorderhasproduct.unit_price * customerorderhasproduct.quantity).toFixed(2);
            document.getElementById("inputProductLinePrice").classList.remove("is-invalid");
            document.getElementById("inputProductLinePrice").classList.add("is-valid");

        } else {

            document.getElementById('inputProductUnitPrice').classList.add("is-invalid");
            document.getElementById('inputProductUnitPrice').classList.remove("is-valid");

            document.getElementById("inputProductLinePrice").value = '';
            customerorderhasproduct.line_price = null;
            document.getElementById("inputProductLinePrice").classList.remove("is-invalid");
            document.getElementById("inputProductLinePrice").classList.remove("is-valid");

        }
    } else {
        document.getElementById("inputProductLinePrice").classList.remove("is-invalid");
        document.getElementById("inputProductLinePrice").classList.remove("is-valid");
        document.getElementById("inputProductLinePrice").value = '';
        customerorderhasproduct.line_price = null;
        customerorderhasproduct.quantity = null;
    }
});
//---------------------------------- OnKeyUp Product Quantity Function Ends ----------------------------------------------------------------


//-------------------------- Design Status Check ---------------------------------------------------
const designStatusCheckBox = document.getElementById("designStatus");
designStatusCheckBox.addEventListener('change', () => {
    document.getElementById('productDesignErrorDiv').style.display = 'none';
    customerorderhasproduct.design_id = new Object();
    if (designStatusCheckBox.checked == true) {
        document.getElementById('designAddField').style.display = 'flex';
        document.getElementById('designDivSection').style.display = 'none';
        inputDesign.classList.remove("is-valid");
        inputDesign.classList.remove("is-invalid");
    } else {
        document.getElementById('designAddField').style.display = 'none';
        document.getElementById('designDivSection').style.display = 'flex';
        document.getElementById('inputDesignFile').value = '';
        document.getElementById('clearFileBtn').click();
    }
});
//-------------------------- Design Status Check Ends ----------------------------------------------


//-------------------------- Bill Type Check ---------------------------------------------------
const billTypeSeletList = document.getElementById("inputBillType");
billTypeSeletList.addEventListener('change', () => {
    if (billTypeSeletList.value == 'Invoice') {
        document.getElementById('normalLayOutFooterBtns').style.display = 'flex';
        document.getElementById('quotationLayOutFooterBtns').style.display = 'none';
        document.getElementById("inputRequiredDate").disabled = false;
        document.getElementById("inputCustomerOrderStatus").disabled = false;
        document.getElementById("inputRequiredDate").value = null;
        if (customerorder.customerOrderHasProductList) {
            generateSuggestedAdvance();
            revalidateFirstPayment();
        }
        customerorder.customer_order_status_id = null;
        fillDataIntoSelect(inputCustomerOrderStatus, "Select Order status", customerOrderStatus, 'name')
        document.getElementById("inputRequiredDate").classList.remove('is-valid');
        document.getElementById("inputRequiredDate").classList.remove('is-invalid');
        customerorder.required_date = null;
    } else if (billTypeSeletList.value == 'Quotation') {
        document.getElementById('normalLayOutFooterBtns').style.display = 'none';
        document.getElementById('quotationLayOutFooterBtns').style.display = 'flex';
        let currentDate = new Date().toLocaleDateString('en-CA');
        //console.log(currentDate);
        document.getElementById("inputRequiredDate").value = currentDate;
        document.getElementById("inputRequiredDate").disabled = true;
        customerorder.required_date = inputRequiredDate.value;
        document.getElementById("inputFirstPayement").value = '';
        document.getElementById("inputFirstPayement").disabled = true;
        document.getElementById("inputFirstPayement").classList.remove('is-valid', 'is-invalid');
        customerorder.remaining_balance = null;
        document.getElementById("inputCustomerOrderRemainingBalance").value = '';
        document.getElementById("inputCustomerOrderRemainingBalance").classList.remove('is-valid', 'is-invalid');
        document.getElementById("inputCustomerOrderStatus").disabled = true;
        document.getElementById("inputCustomerOrderStatus").classList.remove('is-valid');
        document.getElementById("inputCustomerOrderStatus").classList.remove('is-invalid');
        customerorder.customer_order_status_id = null;
        fillDataIntoSelect(inputCustomerOrderStatus, "Select Order status", customerOrderStatus, 'name');
    }
})
//-------------------------- Bill Type Check Ends ----------------------------------------------


//-------------------------- Add New Customer Button  --------------------------------------------------

const addNewCustomerBtn = document.getElementById('addCustomerBtn');
addNewCustomerBtn.addEventListener('click', () => {
    closeBtnAddNewCustomer();
});
const refreshCustomerInnerForm = () => {
    customer = new Object();

}
const closeBtnAddNewCustomer = () => {
    document.getElementById('inputCustomerName').classList.remove('is-valid', 'is-invalid');
    document.getElementById('inputCustomerMobile').classList.remove('is-valid', 'is-invalid');
    document.getElementById('inputCustomerName').value = '';
    document.getElementById('inputCustomerMobile').value = '';
    refreshCustomerInnerForm();
}
const checkErrorsCustomerErrors = () => {
    let errors = '';
    if(customer.name==null){
        errors = errors+"Please add name..!\n";
        document.getElementById('inputCustomerName').classList.add('is-invalid');
    }
    if(customer.mobile==null){
        errors = errors+"Please add customer mobile..!\n"
        document.getElementById('inputCustomerMobile').classList.add('is-invalid');
    }
    return errors;

}
const submitNewCustomer = () => {
    //check form errors
    let CustomerFormErrors = checkErrorsCustomerErrors();
    if (CustomerFormErrors == '') {
        //alert before save
        let confirmCustomerSubmit = confirm('Are you sure to add customer..?'
            + '\n Customer Name : ' + customer.name
            + '\n Customer Mobile : ' + customer.mobile
            + '\n !!! This Cannot be changed after applied..!!!');

        if (confirmCustomerSubmit) {
            //ajax call, send data to backend and get status
            let serverResponseCustomerSubmit = ajaxPostRequestMapping("/customer",customer);
            if (serverResponseCustomerSubmit == "OK") {
                alert("Save Successefully..!")
                //clear form function
                closeBtnAddNewCustomer();
                //hide modal
                document.getElementById("closeCustomerModal").click();
                $('#addCustomerBackdrop').modal('hide');
                refreshCustomerInnerForm();
                customerList = ajaxGetRequestMapping("/customer/active");
            } else {
                alert("Saving new customer was not sucessful.. !\n" + " Reason : " + serverResponseCustomerSubmit);
            }
        } else {
            alert("Customer entry canceled..");
        }
    } else {
        alert("Form has following errors : \n" + CustomerFormErrors)
    }
}
//-------------------------- Add New Customer Button Ends ----------------------------------------------



//-------------------------------------------------- Add New Design Button  --------------------------------------------------
const openDesignFileBtn = document.getElementById('openFileBtn');
const clearDesignFileBtn = document.getElementById('clearFileBtn');
const inputDesignFileEl = document.getElementById('inputDesignFile');
inputDesignFileEl.addEventListener('change', () => {
    if (inputDesignFileEl.files.length !== 0) {
        customerorderhasproduct.design_id = new Object();
        let designFile = inputDesignFileEl.files[0];
        let fileReader = new FileReader();
        fileReader.onload = function (e) {
            customerorderhasproduct.design_id.design_file = btoa(e.target.result);
        }
        fileReader.readAsDataURL(designFile);
        openDesignFileBtn.style.display = 'inline-flex';
        clearDesignFileBtn.style.display = 'inline-flex';
        document.getElementById('productDesignErrorDiv').style.display = 'none';
        return;

    } else {

        openDesignFileBtn.style.display = 'none';
        clearDesignFileBtn.style.display = 'none';
        document.getElementById('productDesignErrorDiv').style.display = 'block';
    }
});

openDesignFileBtn.addEventListener('click', () => {
    if (inputDesignFileEl.files.length !== 0) {
        let designFile = inputDesignFileEl.files[0];
        let fileReader = new FileReader();
        fileReader.onload = function (e) {
            openFileWithHtmlContent(e.target.result)
        }
        fileReader.readAsDataURL(designFile);
    }
});

clearDesignFileBtn.addEventListener('click', () => {
    customerorderhasproduct.design_id.design_file = null;
    inputDesignFileEl.value = '';
    openDesignFileBtn.style.display = 'none';
    clearDesignFileBtn.style.display = 'none';
});





const refreshDesignInnerForm = () => {
    design = new Object();
}
const addNewDesignBtn = document.getElementById('addDesignBtn');
addNewDesignBtn.addEventListener('click', () => {
    refreshDesignInnerForm();

});
const closeBtnAddNewDesign = () => {
    document.getElementById('inputDesignName').classList.remove('is-valid', 'is-invalid');
    document.getElementById('inputDesignCharges').classList.remove('is-valid', 'is-invalid');
    document.getElementById('inputDesignNote').classList.remove('is-valid', 'is-invalid');
    document.getElementById('inputDesignName').value = '';
    document.getElementById('inputDesignCharges').value = '';
    document.getElementById('inputDesignNote').value = '';
    refreshDesignInnerForm();
}

document.getElementById("inputDesignCharges").addEventListener('change',()=>{
    if(document.getElementById("inputDesignCharges").classList.contains('is-valid')){
        design.charges = parseFloat(inputDesignCharges.value).toFixed(2);
        inputDesignCharges.value = design.charges;
    }
})
const checkErrorsDesignErrors = () => {
    let errors= '';
    if(design.name==null){
        errors = errors+ "Design name is not found..!\n"
        inputDesignName.classList.add('is-invalid');
    }
    if(design.charges==null){
        errors = errors+ "Design charge amount is not found..!\n"
        inputDesignCharges.classList.add('is-invalid');
    }
    if(design.note==null){
        errors = errors+ "Design does not have any note";
        inputDesignNote.classList.add('is-invalid');
    }
    return errors;
}

const submitNewDesign = () => {
    //check form errors
    let DesignFormErrors = checkErrorsDesignErrors();
    if (DesignFormErrors == '') {
        //alert before save
        let confirmDesignSubmit = confirm('Are you sure to add Design..?'
            + '\n Design Name : ' + design.name
            + '\n Design Charge : ' + design.charges
            + '\n !!! This Cannot be changed after applied..!!!');

        if (confirmDesignSubmit) {
            //ajax call, send data to backend and get status
            let serverResponseDesignSubmit = ajaxPostRequestMapping("/design",design);
            if (serverResponseDesignSubmit == "OK") {
                alert("Save Successefully..!")
                //clear form function
                closeBtnAddNewDesign();
                //hide modal
                document.getElementById("closeDesignModal").click();
                $('#addDesignBackdrop').modal('hide');
                refreshDesignInnerForm();
                designList = ajaxGetRequestMapping("/design/list");


            } else {
                alert(serverResponseDesignSubmit);
            }

        } else {
            alert("Design entry canceled..");
        }
    } else {
        alert("Form has following errors : \n" + DesignFormErrors)
    }


}
//------------------------------------------------- Add New Design Button Ends ----------------------------------------------

const checkErrorsForQuotation = () => {
    error = '';
    if (customerorder.customer_id == null) {
        error = error + "Enter Valid Customer..!\n";
        inputCustomerMobile.classList.add("is-invalid");
    }
    if (customerorder.total_bill == null) {
        error = error + "Total Bill is not included..!\n";
        inputCustomerOrderTotalPrice.classList.add("is-invalid");
    }
    if (customerorder.required_date == null) {
        error = error + "Quotation Requried date is not included..!\n";
        inputRequiredDate.classList.add("is-invalid");
    }
    if (customerorder.customerOrderHasProductList == null) {
        error = error + "Quotation must have Products..!\n";
        document.getElementById("orderProductErrorDiv").style.display = 'inline'
    }

    return error;

}
//------------------------------------------------- Print Quotation Print Bill ----------------------------------------------
document.getElementById('quotationPrintButton').addEventListener('click', () => {
    if (customerorder.customerOrderHasProductList != null && customerorder.customerOrderHasProductList.length > 0) {

        const getUnit_price = (ob) => {
            return 'LKR ' + parseFloat(ob.unit_price).toFixed(2);
        }
        const getLine_price = (ob) => {
            return 'LKR ' + parseFloat(ob.line_price).toFixed(2);
        }
        const getQuantity = (ob) => {
            return parseFloat(ob.quantity);
        }
        const getProductName = (ob) => {
            return (ob.product_id.name);
        }
        const displayPropertyList = [
            { dataType: 'function', propertyName: getProductName },
            { dataType: 'function', propertyName: getUnit_price },
            { dataType: 'function', propertyName: getQuantity },
            { dataType: 'function', propertyName: getLine_price }
        ]
        //sd
        let quotationErrors = checkErrorsForQuotation();;

        if (quotationErrors == '') {

            fillDataIntoBillingTable("tbodyForBill", customerorder.customerOrderHasProductList, displayPropertyList);
            const productListTableContent = document.getElementById("tbodyForBill").innerHTML;
            const inputBillType = document.getElementById("inputBillType").value;
            printQuotationDetails(customerorder, inputBillType, productListTableContent);

        } else {
            alert("Form has following errors \n" + quotationErrors);
        }

    } else {
        alert("No products has added to this quotation..!");
    }


});

//------------------------------------------------- Print Quotation Print Bill Ends -----------------------------------------


//------------------------------------------------- Search Design and Add ---------------------------------------------------
const inputDesignEl = document.getElementById('inputDesign');
const resultDivDesign = document.getElementById('divResultByDesignName');

const onclickDesignFunction = (ob) => {

    if (ob.design_file == null) {
        let confirmDesignStatus = confirm("This design currently do not have a design file.. Are you sure you want to add this ?");
        if (confirmDesignStatus) {
            customerorderhasproduct.design_id = ob;
            inputDesignEl.classList.remove("is-invalid");
            inputDesignEl.classList.add("is-valid");
            inputDesignEl.value = customerorderhasproduct.design_id.name;
            document.getElementById('productDesignErrorDiv').style.display = 'none';
        } else {
            alert("Adding selected design was not completed");
        }
    } else {
        customerorderhasproduct.design_id = ob;
        inputDesignEl.classList.remove("is-invalid");
        inputDesignEl.classList.add("is-valid");
        inputDesignEl.value = customerorderhasproduct.design_id.name;
        document.getElementById('productDesignErrorDiv').style.display = 'none';
    }


}

inputDesignEl.addEventListener('click', () => {
    if (designList == null || designList.length == 0) {
        noresultList = [{ name: "No Result to Show" }]
        const noresultFunction = () => {
            resultDivDesign.innerHTML = '';
        }
        displaySearchList(noresultList, resultDivDesign, 'name', '', noresultFunction);

    } else {
        if (inputDesignEl.value == '' || inputDesignEl == null || customerorderhasproduct.design_id == null) {
            inputDesignEl.classList.remove("is-invalid");
            inputDesignEl.classList.remove("is-valid");
        }
        displaySearchList(designList, resultDivDesign, 'name', 'designno', onclickDesignFunction);

    }
});

inputDesignEl.addEventListener('keyup', () => {

    if (designList == null || designList.length == 0) {


    } else {

        if (inputDesignEl.value == null || inputDesignEl.value == "") {
            displaySearchList(designList, resultDivDesign, 'name', 'designno', onclickDesignFunction);
            customerorderhasproduct.design_id = null;
            let listofFieldsCustomerOrder_ID = [inputDesignEl]
            listofFieldsCustomerOrder_ID.forEach(element => {
                element.value = '';
                element.classList.remove('is-invalid');
                element.classList.remove('is-valid');
            });
            inputDesignEl.classList.remove("is-invalid");
            inputDesignEl.classList.remove("is-valid");

        } else {
            let searchResult = (searchFunction(designList, inputDesignEl, 'name'));
            displaySearchList(searchResult, resultDivDesign, 'name', 'designno', onclickDesignFunction);
            if (inputDesignEl.classList.contains('is-invalid')) {
                customerorderhasproduct.design_id = null;
                resultDivDesign.innerHTML = '';
            }
        }
    }
});

document.body.addEventListener('click', (event) => {
    // Check if the click target is not the input field or its descendant
    if (!(inputDesignEl.contains(event.target))) {
        resultDivDesign.innerHTML = '';
        if (customerorderhasproduct.design_id) {
            if (inputDesignEl.classList.contains('is-valid')) {
                inputDesignEl.value = '';
                inputDesignEl.value = customerorderhasproduct.design_id.name;
                inputDesignEl.classList.remove("is-invalid");
                inputDesignEl.classList.add("is-valid");

            } else {
                inputDesignEl.value = '';
            }
        } else {
            if (inputDesignEl.value == '') {
                inputDesignEl.classList.remove("is-valid");
                inputDesignEl.classList.remove("is-invalid");
            } else {
                inputDesignEl.classList.remove("is-valid");
                inputDesignEl.classList.add("is-invalid");
            }
        }
    }

});

//------------------------------------------------- Search Design and Add Ends ----------------------------------------------