//call material table refresh function
window.addEventListener('load', () => {


    refreshMaterialInventorTable();


});



//create function table refresh
const refreshMaterialInventorTable = () => {
    InvetoryLog = ajaxGetRequestMapping("/reportinventorylogs/findall");
    
    //text--> String, number, date
    //function--> object, array, boolean
    const displayPropertyListMaterial = [
        { dataType: 'function', propertyName: getMaterialNo },
        { dataType: 'function', propertyName: getMaterialName },
        { dataType: 'function', propertyName: getLoggedDate },
        { dataType: 'function', propertyName: getLoggedTime },
        { dataType: 'function', propertyName: getActionType },
        { dataType: 'text', propertyName: 'before_log_quantity' },
        { dataType: 'text', propertyName: 'logged_quantity' },
        { dataType: 'text', propertyName: 'after_log_quantity' },
        { dataType: 'function', propertyName: getProductionNo },
        { dataType: 'function', propertyName: getMRNno }
    ]
    //call filldataintotable function
    //(tableId,dataList)
    fillDataIntoTable3('tbodyMaterialLog', InvetoryLog, displayPropertyListMaterial);
    new DataTable('#tableMaterialLog');
    document.getElementById("tableMaterialLog").style.width = "100%";

}



const getMaterialNo = (ob) => {
    return ob.material_id.matno;
}
const getMaterialName = (ob) => {
    return ob.material_id.name;
}
const getLoggedTime = (ob) => {
    return ob.logged_time.split('T')[1];
}

const getActionType = (ob) => {
    if(ob.inventory_up){
        return '<p style="border-radius:10px; width:80%; background-color: #287d4c;" class="p-2 text-center fw-bold">Up</p>'
    }else{
        return '<p style="border-radius:10px; width:80%; background-color: #b34430;" class="p-2 text-center fw-bold">Down</p>'
    }
}
const getLoggedDate = (ob) => {
    return ob.logged_time.split('T')[0];
}

const getProductionNo = (ob) => {
    if(ob.production_id==null){
        return " - ";
    }else{
        return ob.production_id.productionno;
    }
}

const getMRNno = (ob) => {
    if(ob.material_received_note_id==null){
        return " - ";
    }else{
        return ob.material_received_note_id.mrn_no;
    }
}
