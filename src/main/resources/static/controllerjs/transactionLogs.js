//call material table refresh function
window.addEventListener('load', () => {


    refreshTransactionLogTable();


});



//create function table refresh
const refreshTransactionLogTable = () => {
    const transactionLogs =  ajaxGetRequestMapping("/transactionlog/findall");

    //text--> String, number, date
    //function--> object, array, boolean
    const displayPropertyList = [
        { dataType: 'function', propertyName: getProcessNo },
        { dataType: 'function', propertyName: getAmount },
        { dataType: 'function', propertyName: getTransactionType },
        { dataType: 'function', propertyName: getLoggedDate },
        { dataType: 'function', propertyName: getLoggedTime },
        { dataType: 'function', propertyName: getUsername },
        { dataType: 'function', propertyName: getUserCallingName }
    ]
    //call filldataintotable function
    //(tableId,dataList)
    fillDataIntoTable3('tbodyTransactionLogs', transactionLogs, displayPropertyList);
    new DataTable('#tableTransaction');
    document.getElementById("tableTransaction").style.width = "100%";

}


const getProcessNo = (ob) => {
    if(ob.customer_order_payment_id!=null && ob.supplier_payment_id == null){
        return ("Customer Payment : "+ob.customer_order_payment_id.paymentno);
    }
    if(ob.supplier_payment_id!=null && ob.customer_order_payment_id==null){
        return ("Supplier Payment : "+ob.supplier_payment_id.supplier_paymentno);
    }
}

const getTransactionType = (ob) => {
    if(ob.income_type){
        return '<p style="border-radius:10px; width:80%; background-color: #287d4c;" class="p-2 text-center fw-bold">Income</p>'
    }else{
        return '<p style="border-radius:10px; width:80%; background-color: #b34430;" class="p-2 text-center fw-bold">Expense</p>'
    }
}

const getAmount = (ob) => {
    return ("LKR "+parseFloat(ob.transaction_amount).toFixed(2));
}

const getLoggedTime = (ob) => {
    return ob.logged_time.split('T')[1];
}

const getLoggedDate = (ob) => {
    return ob.logged_time.split('T')[0];
}
const getUsername = (ob) => {
    return (ajaxGetRequestMapping("/getuserbyid/"+ob.added_user_id).username);
}
const getUserCallingName = (ob) => {
    return (ajaxGetRequestMapping("/getempbyuserid/"+ob.added_user_id).callingname);
}

