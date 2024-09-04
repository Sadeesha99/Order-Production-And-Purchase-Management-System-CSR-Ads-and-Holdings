//call material table refresh function
window.addEventListener('load', () => {


    refreshProductionLogTable();


});



//create function table refresh
const refreshProductionLogTable = () => {
    productionLogs = ajaxGetRequestMapping("/reportproductionlogs/findall");

    
    const displayPropertyList = [
        { dataType: 'function', propertyName: getProductionNumber },
        { dataType: 'function', propertyName: getProductName },
        { dataType: 'function', propertyName: getOrderNo },
        { dataType: 'function', propertyName: getProductionStatus },
        { dataType: 'function', propertyName: getLoggedDate },
        { dataType: 'function', propertyName: getLoggedTime },
        { dataType: 'function', propertyName: getTotalProductionQuantity },
        { dataType: 'function', propertyName: getDoneQuantity },
        { dataType: 'text', propertyName: 'before_log_quantity' },
        { dataType: 'text', propertyName: 'production_quantity' },
        { dataType: 'text', propertyName: 'after_log_quantity' },

    ]
    //call filldataintotable function
    //(tableId,dataList)
    fillDataIntoTable3('tbodyMaterialLog', productionLogs, displayPropertyList);
    new DataTable('#tableMaterialLog');
    document.getElementById("tableMaterialLog").style.width = "100%";

}

const getProductionStatus = (ob) => {

    if (ob.production_id.production_status_id.id == 1) {  /*Waiting*/
        return '<p style="border-radius:10px; background-color: #d2ac14;" class="p-2 text-center fw-bold">' + ob.production_id.production_status_id.name + '</p>'
    }
    if (ob.production_id.production_status_id.id == 2) {  /*Confirmation*/
        return '<p style="border-radius:10px; background-color: #a6d214;" class="p-2 text-center fw-bold">' + ob.production_id.production_status_id.name + '</p>'
    }
    if (ob.production_id.production_status_id.id == 3) {  /*On-Production*/
        return '<p style="border-radius:10px; background-color: #1460d2;" class="p-2 text-center fw-bold">Production</p>'
    }
    if (ob.production_id.production_status_id.id == 4) {  /*Ready*/
        return '<p style="border-radius:10px; background-color: #1dd214;" class="p-2 text-center fw-bold">' + ob.production_id.production_status_id.name + '</p>'
    }
    if (ob.production_id.production_status_id.id == 5) {  /*Canceled*/
        return '<p style="border-radius:10px; background-color: #d21414;" class="p-2 text-center fw-bold">' + ob.production_id.production_status_id.name + '</p>'
    }

}

const getProductionNumber = (ob) => {
    return ob.production_id.productionno;
}
const getProductName = (ob) => {
    return ob.production_id.product_id.name;
}
const getOrderNo = (ob) => {
    return ob.production_id.corderno;
}
const getLoggedTime = (ob) => {
    return ob.logged_time.split('T')[1];
}
const getLoggedDate = (ob) => {
    return ob.logged_time.split('T')[0];
}
const getTotalProductionQuantity = (ob) => {
    return ob.production_id.total_quantity;
}
const getDoneQuantity = (ob) => {
    return (parseFloat(ob.production_id.total_quantity)-parseFloat(ob.after_log_quantity));
}