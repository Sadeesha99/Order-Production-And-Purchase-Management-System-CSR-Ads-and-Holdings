//call material table refresh function
window.addEventListener('load', () => {

    loggedUserPriviForCustomerOrderPrivilege = ajaxGetRequestMapping("/privilege/bymodule/CustomerOrderPayment");

    refreshCustomerOrderPaymentTable();
    // Calling Refresh function to data diplay table
    refreshCustomerOrderPaymentForm();




    if (!loggedUserPriviForCustomerOrderPrivilege.ins_privi) {
        document.getElementById("tableTabButton").click();
        document.getElementById("formTabButton").style.display = 'none';
    }

    customerSelected = null;

});



//create function table refresh
const refreshCustomerOrderPaymentTable = () => {

    customerOrdersPaymentList = ajaxGetRequestMapping("/customerorderpayment/findall")

    const displayPropertyListCustomerOrder = [
        { dataType: 'text', propertyName: 'paymentno' },
        { dataType: 'function', propertyName: getOrderNo },
        { dataType: 'function', propertyName: getAmount },
        { dataType: 'function', propertyName: getPaymentStatus },
        { dataType: 'function', propertyName: getOrderAmount },
        { dataType: 'function', propertyName: getTotalPaid },
        { dataType: 'function', propertyName: getRemainingAmount }

    ]
    //call filldataintotable function
    //(tableId,dataList)
    fillDataIntoPaymentTable("tbodyCustOrderPayment", customerOrdersPaymentList, displayPropertyListCustomerOrder, viewProduct);
    new DataTable('#tableCOrderPayment');
    document.getElementById("tableCOrderPayment").style.width = "100%";

}

const getPaymentStatus = (ob) => {

    if (ob.customer_order_payment_status_id.name == "Canceled") {
        return '<p style="border-radius:10px; background-color: #853232;" class="p-2 text-center fw-bold">Canceled</p>'
    }
    if (ob.customer_order_payment_status_id.name == "Success") {
        return '<p style="border-radius:10px; background-color: #3a7e29;" class="p-2 text-center fw-bold">Success</p>'
    }

}

const getOrderNo = (ob) => {
    return ob.customer_order_id.orderno;
}

const getOrderAmount = (ob) => {
    return parseFloat(ob.customer_order_id.total_bill).toFixed(2);
}

const getAmount = (ob) => {
    return parseFloat(ob.amount).toFixed(2);
}
const getTotalPaid = (ob) => {
    return parseFloat(ob.paid_total).toFixed(2);
}

const getRemainingAmount = (ob) => {
    return parseFloat(ob.remaining_balance).toFixed(2);
}



const refreshCustomerOrderPaymentForm = () => {
    customerorderpayment = new Object();

    //corderList = ajaxGetRequestMapping("/customerorder/findall");

    customerList = ajaxGetRequestMapping("/customershavetopay");

    customerOrderStatusList = ajaxGetRequestMapping("/customerorder/status/findall");

    fillDataIntoSelect(inputCustomerOrderStatus, "Select Order status", customerOrderStatusList, 'name');

    document.getElementById("inputCustomerOrder").disabled = true;
    document.getElementById('inputPaymentAmount').disabled = true;
    document.getElementById('inputCustomerMobile').disabled = false;

    document.getElementById("tableDivInnerForm").style.display = 'none';
    tbodyProductionList.innerHTML = '';

}





//Create function for view product record
const viewProduct = (ob) => {
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

    if (ob.customer_order_id.customerOrderHasProductList != null && ob.customer_order_id.customerOrderHasProductList.length > 0) {
        fillDataIntoBillingTable("tbodyForBill", ob.customer_order_id.customerOrderHasProductList, displayPropertyList);
        const productListTableContent = document.getElementById("tbodyForBill").innerHTML;
        printPaymentReceipt(ob, productListTableContent);
    }
}
//back button in product form
const backButtonOrderForm = () => {
    backButtonFunctionForm("tableTabButton", "formAddBtn", "formUpdateBtn", "formRestBtn", ClearOrderFormButtonFunction)
    document.getElementById("backButtonDivFormFirst").style.display = 'none';
    refreshCustomerOrderForm();
}




const checkCustomerOrderPaymentFormError = () => {
    let error = '';
    if (customerorderpayment.customer_order_id == null) {
        error = error + "Valid Customer Order is not selected..!\n";
        inputCustomerOrder.classList.add("is-invalid");
    }
    if (customerorderpayment.amount == null || parseFloat(customerorderpayment.amount)<=0) {
        error = error + "Please Enter Valid Amount For Payment..!\n";
        inputPaymentAmount.classList.add("is-invalid");
    }



    return error;
}



//define function for submit product
const submitCustomerOrderPayment = () => {

    const errors = checkCustomerOrderPaymentFormError();

    if (errors == '') {
        let confirmCustomerOrderPaymentSubmit = confirm('Are you sure to add following Payment..?'
            + '\n Customer Name : ' + customerorderpayment.customer_order_id.customer_id.name
            + '\n Order No : ' + customerorderpayment.customer_order_id.orderno
            + '\n Order Total : LKR ' + parseFloat(customerorderpayment.customer_order_id.total_bill).toFixed(2)
            + '\n Payment : ' + customerorderpayment.amount+
            '\n !!! This Cannot be changed after applied..!!!');
        // need to get user confirmation
        if (confirmCustomerOrderPaymentSubmit) {
            //console.log(product);
            const cOrderPaymentPostServiceResponse = ajaxPostRequestMapping("/customerorderpayment",customerorderpayment);
            if (cOrderPaymentPostServiceResponse == "OK") {
                alert("Save Successefully..!")
                //refresh table
                refreshCustomerOrderPaymentTable();
                //click button to back
                ClearCOPaymentFormButtonFunction();
                //call form refresh function
                refreshCustomerOrderPaymentForm();
                //back button function button
                document.getElementById("tableTabButton").click();
            } else {
                alert("Payment submission was not successful.. !\n" + cOrderPaymentPostServiceResponse);
            }
        } else {
            alert("Payment entry canceled..");
        }

    } else {
        alert("Form has following errors : \n" + errors)
    }
}

let listOfFormIDs = [inputCustomerMobile, inputCustomerName, inputCustomerOrder, inputCustomerOrderTotalBill, inputRequiredDate, inputCustomerOrderRemainingBalance, inputPaidTotal, inputPaymentAmount, inputCustomerOrderStatus, inputSubmittedUser, inputRequiredDate, inputSubmittedDate, inputSubmittedTime];
const ClearCOPaymentFormButtonFunction = () => {
    tbodyProductionList.innerHTML = '';
    ClearFormFunction("formCustOrderPayment", refreshCustomerOrderPaymentForm, listOfFormIDs);
    document.getElementById("tableDivInnerForm").style.display = 'none';
}





let inputCustomerMobileEl = document.getElementById("inputCustomerMobile");
let resultDivCustomerMobile = document.getElementById("divResultByCustomerMobile");




//--------------------------------- Customer Search Functions ----------------------------------------------------------------------------------



const onclickCustomerFunction = (ob) => {
    ClearCOPaymentFormButtonFunction();
    customerSelected = ob;
    inputCustomerMobile.value = ob.mobile;
    document.getElementById('inputCustomerMobile').classList.remove("is-invalid");
    document.getElementById('inputCustomerMobile').classList.add('is-valid');
    inputCustomerName.value = ob.name;
    document.getElementById('inputCustomerName').classList.remove("is-invalid");
    document.getElementById('inputCustomerName').classList.add('is-valid');
    document.getElementById('inputCustomerOrder').disabled = false;
    customerOrderList = ajaxGetRequestMapping("/customerorder/bycid/"+ob.id);


}

inputCustomerMobileEl.addEventListener('click', () => {
    if (customerList == null || customerList.length == 0) {
        noresultList = [{ name: "No Result to Show" }]
        const noresultFunction = () => {
            resultDivCustomer.innerHTML = '';
        }
        displaySearchList(noresultList, resultDivCustomerMobile, 'name', '', noresultFunction);

    } else {
        if (inputCustomerMobileEl.value == '' || inputCustomerMobileEl == null || customerSelected == null) {
            inputCustomerMobileEl.classList.remove("is-invalid");
            inputCustomerMobileEl.classList.remove("is-valid");
        }
        displaySearchList(customerList, resultDivCustomerMobile, 'mobile', 'name', onclickCustomerFunction);

    }
});

inputCustomerMobileEl.addEventListener('keyup', () => {

    if (customerList == null || customerList.length == 0) {

    } else {

        if (inputCustomerMobileEl.value == null || inputCustomerMobileEl.value == "") {
            displaySearchList(customerList, resultDivCustomerMobile, 'mobile', 'name', onclickCustomerFunction);
            let listofFieldsCustomerOrder_ID = [inputCustomerMobile, inputCustomerName]
            listofFieldsCustomerOrder_ID.forEach(element => {
                element.value = '';
                element.classList.remove('is-invalid');
                element.classList.remove('is-valid');
            });
            inputCustomerMobileEl.classList.remove("is-invalid");
            inputCustomerMobileEl.classList.remove("is-valid");
            customerSelected = null;
            ClearCOPaymentFormButtonFunction();

        } else {
            
            let searchResult = (searchFunction(customerList, inputCustomerMobileEl, 'mobile'));
            displaySearchList(searchResult, resultDivCustomerMobile, 'mobile', 'name', onclickCustomerFunction);
            if (inputCustomerMobileEl.classList.contains('is-invalid')) {
                resultDivCustomerMobile.innerHTML = '';
            }
        }
    }
});
//--------------------------------- Customer Search Functions Ends -----------------------------------------------------------------------------




let inputCustomerOrderEl = document.getElementById("inputCustomerOrder");
let resultDivCustomerOrder = document.getElementById("divResultByCustomerOrder");
//--------------------------------- Customer Order Search Functions  -----------------------------------------------------------------------------
const onclickOrderFunction = (ob) => {
    customerorderpayment.customer_order_id = ob;
    inputCustomerOrderEl.value = ob.orderno;
    document.getElementById('inputCustomerOrder').classList.remove("is-invalid");
    document.getElementById('inputCustomerOrder').classList.add('is-valid');
    refillDataIntoForm(ob);
    document.getElementById('inputCustomerMobile').disabled = true;
    document.getElementById('inputCustomerOrder').disabled = true;
    document.getElementById('inputPaymentAmount').disabled = false;
}

inputCustomerOrderEl.addEventListener('click', () => {
    if (customerOrderList == null || customerOrderList.length == 0) {
        noresultList = [{ name: "No Result to Show" }]
        const noresultFunction = () => {
            resultDivCustomerOrder.innerHTML = '';
        }
        displaySearchList(noresultList, resultDivCustomerOrder, 'name', '', noresultFunction);

    } else {
        if (inputCustomerOrderEl.value == '' || inputCustomerOrderEl == null || customerSelected == null) {
            inputCustomerOrderEl.classList.remove("is-invalid");
            inputCustomerOrderEl.classList.remove("is-valid");
        }
        displaySearchList(customerOrderList, resultDivCustomerOrder, 'orderno', 'total_bill', onclickOrderFunction);

    }
});

inputCustomerOrderEl.addEventListener('keyup', () => {

    if (customerOrderList == null || customerOrderList.length == 0) {

    } else {

        if (inputCustomerMobileEl.value == null || inputCustomerOrderEl.value == "") {
            displaySearchList(customerOrderList, resultDivCustomerOrder, 'orderno', 'total_bill', onclickOrderFunction);

            inputCustomerOrderEl.classList.remove("is-invalid");
            inputCustomerOrderEl.classList.remove("is-valid");
            customerSelected = null;

        } else {
            
            let searchResult = (searchFunction(customerOrderList, inputCustomerOrderEl, 'orderno'));
            displaySearchList(searchResult, resultDivCustomerOrder, 'orderno', 'total_bill', onclickOrderFunction);
            if (inputCustomerOrderEl.classList.contains('is-invalid')) {
                resultDivCustomerOrder.innerHTML = '';
            }
        }
    }
});
//--------------------------------- Customer Order Search Functions Ends -------------------------------------------------------------------------




//---------------------------------- OnClick Body Function ---------------------------------------------------------------------


document.body.addEventListener('click', (event) => {
    // Check if the click target is not the input field or its descendant
    if (!(inputCustomerMobileEl.contains(event.target))) {
        resultDivCustomerMobile.innerHTML = '';
        if (customerSelected || customerSelected!=null) {
            if (document.getElementById("inputCustomerMobile").classList.contains('is-valid')) {
                document.getElementById("inputCustomerMobile").value = customerSelected.mobile;
                document.getElementById('inputCustomerMobile').classList.remove("is-invalid");
                document.getElementById('inputCustomerMobile').classList.add('is-valid');

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

document.body.addEventListener('click', (event) => {
    // Check if the click target is not the input field or its descendant
    if (!(inputCustomerOrderEl.contains(event.target))) {
        resultDivCustomerOrder.innerHTML = '';
        if (customerorderpayment.customer_order_id) {
            if (document.getElementById("inputCustomerOrder").classList.contains('is-valid')) {
                document.getElementById("inputCustomerOrder").value = customerorderpayment.customer_order_id.orderno;
                document.getElementById('inputCustomerOrder').classList.remove("is-invalid");
                document.getElementById('inputCustomerOrder').classList.add('is-valid');

            }
        } else {
            if (inputCustomerOrderEl.value == '') {
                inputCustomerOrderEl.classList.remove("is-valid");
                inputCustomerOrderEl.classList.remove("is-invalid");
            } else {
                inputCustomerOrderEl.classList.remove("is-valid");
                inputCustomerOrderEl.classList.add("is-invalid");
            }
        }
    }

});
//---------------------------------- OnClick Body Function Ends ----------------------------------------------------------------


const refillDataIntoForm = (ob)=>{
    document.getElementById("inputCustomerOrderTotalBill").value = parseFloat(ob.total_bill).toFixed(2);
    document.getElementById("inputCustomerOrderTotalBill").classList.add('is-valid');
    document.getElementById("inputCustomerOrderRemainingBalance").value = parseFloat(customerorderpayment.customer_order_id.remaining_balance).toFixed(2);
    document.getElementById("inputCustomerOrderRemainingBalance").classList.add('is-valid');
    document.getElementById("inputPaidTotal").value = (parseFloat(ob.total_bill)-parseFloat(ob.remaining_balance)).toFixed(2);
    document.getElementById("inputPaidTotal").classList.add('is-valid');
    document.getElementById("inputSubmittedUser").value = ajaxGetRequestMapping("/getuserbyid/"+ob.added_user_id).username;
    document.getElementById("inputSubmittedUser").classList.add('is-valid');
    document.getElementById("inputSubmittedDate").value = (ob.added_time).toString().split('T')[0];
    document.getElementById("inputSubmittedDate").classList.add('is-valid');
    document.getElementById("inputSubmittedTime").value = (ob.added_time).toString().split('T')[1];
    document.getElementById("inputSubmittedTime").classList.add('is-valid');
    document.getElementById("inputRequiredDate").value = ob.required_date;
    document.getElementById("inputRequiredDate").classList.add('is-valid');

    fillDataIntoSelect(inputCustomerOrderStatus, "Select Order status", customerOrderStatusList, 'name', ob.customer_order_status_id.name);
    document.getElementById("inputCustomerOrderStatus").classList.add('is-valid');

    const getProductionNo = (ele) =>{
        return ele.productionno
    }
    
    const getProduct = (ele) =>{
        return ele.product_id.name;
    }

    const getStatusOfProduction = (ele) =>{
        return ele.production_status_id.name;
    }

    const getCompleted = (ele) =>{
        return ele.completed_quantity;
    }
    const getTotal = (ele) =>{
        return ele.total_quantity;
    }


    const displayPropertyList = [
        { dataType: 'function', propertyName: getProductionNo },
        { dataType: 'function', propertyName: getProduct },
        { dataType: 'function', propertyName: getStatusOfProduction },
        { dataType: 'function', propertyName: getCompleted },
        { dataType: 'function', propertyName: getTotal }
    ]
    const productionList = ajaxGetRequestMapping("/production/bycorderno/"+ob.orderno);

    //(tableId,dataList)
    fillDataIntoTable3('tbodyProductionList', productionList, displayPropertyList);

    document.getElementById("tableDivInnerForm").style.display = 'block';

}


const paymentAmountEl = document.getElementById("inputPaymentAmount");
paymentAmountEl.addEventListener('keyup',()=>{
    let pattern = '^(([1-9][0-9]{0,5})|([1-9][0-9]{0,5}[.][0-9]{2}))?$'
    const regPattern = new RegExp(pattern);
    if (paymentAmountEl.value != "") {
        if(regPattern.test(paymentAmountEl.value)){
            if(parseFloat(paymentAmountEl.value) <= parseFloat(customerorderpayment.customer_order_id.remaining_balance)){
                customerorderpayment.amount = parseFloat(paymentAmountEl.value).toFixed(2);
                paymentAmountEl.classList.remove('is-invalid', 'is-valid');
                paymentAmountEl.classList.add('is-valid');
            }else{
                customerorderpayment.amount = null;
                paymentAmountEl.classList.remove('is-valid', 'is-invalid');
                paymentAmountEl.classList.add('is-invalid');
            }

        } else {
            customerorderpayment.amount = null;
            paymentAmountEl.classList.remove('is-valid', 'is-invalid');
            paymentAmountEl.classList.add('is-invalid');
        }
    } else {
        customerorderpayment.amount = null;
        paymentAmountEl.classList.remove('is-valid');
        paymentAmountEl.classList.remove('is-invalid');
    }


});