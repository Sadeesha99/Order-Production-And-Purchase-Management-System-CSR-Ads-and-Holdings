//call material table refresh function
window.addEventListener('load', () => {


    logedeUSerPRIVIMaterialSupplierPrice = ajaxGetRequestMapping("/privilege/bymodule/MaterialSupplierPrice");

    refreshMaterialSupplierPriceTable();
    refreshMaterialBestPriceForm();

    if (!logedeUSerPRIVIMaterialSupplierPrice.ins_privi) {
        document.getElementById("tableTabButton").click();
        document.getElementById("formTabButton").style.display = 'none';
    }

});


//create function table refresh
const refreshMaterialSupplierPriceTable = () => {
    materialBestPrice = ajaxGetRequestMapping("/materialsupplierprice/findall");


    //text--> String, number, date
    //function--> object, array, boolean
    const displayPropertyListMaterialBestPrice = [
        {dataType: 'function', propertyName: getMaterialNo},
        {dataType: 'function', propertyName: getMaterialName},
        {dataType: 'function', propertyName: getMaterialStatus},
        {dataType: 'function', propertyName: getSupplierName},
        {dataType: 'function', propertyName: getReceivedQuotNo},
        {dataType: 'function', propertyName: getSupplierPrice},
        {dataType: 'function', propertyName: getLastUpdatedDate},
        {dataType: 'function', propertyName: getUpdatedUser},
    ]

    //call filldataintotable function
    fillDataIntoTable3('tbodyMaterialSupplierPrice', materialBestPrice, displayPropertyListMaterialBestPrice);
    new DataTable('#tableMaterialSupplierPrice');
    document.getElementById("tableMaterialSupplierPrice").style.width = "100%";

}


const getMaterialNo = (ob) => {
    return ob.material_id.matno;
}
const getMaterialName = (ob) => {
    return ob.material_id.name;
}
const getMaterialStatus = (ob) => {
    if (ob.material_id.material_status_id.name == 'In-Stock') {
        return '<p style="border-radius:10px" class="bg-success p-2 text-center fw-bold">' + ob.material_id.material_status_id.name + '</p>'
    }
    if (ob.material_id.material_status_id.name == 'Out-Of-Stock') {
        return '<p style="border-radius:10px" class="bg-warning p-2 text-center fw-bold">' + ob.material_id.material_status_id.name + '</p>'
    }
    if (ob.material_id.material_status_id.name == 'Deleted') {
        return '<p style="border-radius:10px;" class="bg-danger p-2 text-center fw-bold">' + ob.material_id.material_status_id.name + '</p>'
    }
    if (ob.material_id.material_status_id.name == 'Low-Stock') {
        return '<p style="background-color: #f86e12; border-radius:10px;" class="p-2 text-center fw-bold">' + ob.material_id.material_status_id.name + '</p>'
    }
}
const getSupplierName = (ob) => {
    return ob.supplier_id.businessname;
}
const getReceivedQuotNo = (ob) => {
    return ob.received_quotation_id.received_quot_no;
}
const getSupplierPrice = (ob) => {
    return "LKR " + parseFloat(ob.best_supplier_price).toFixed(2);
}
const getLastUpdatedDate = (ob) => {
    return (ob.updated_time).split('T')[0] + " @ " + (ob.updated_time).split('T')[1];
}
const getUpdatedUser = (ob) => {
    return (ajaxGetRequestMapping("/getuserbyid/" + ob.updated_user_id).username);
}

const refreshMaterialBestPriceForm = () => {
    reportbestsupplierprice = new Object;

    materialListForSupplierPrice = ajaxGetRequestMapping("/materialsupplierprice/materialList");

    fillDataIntoSelect(inputMaterialName, "Select Material", materialListForSupplierPrice, 'name');

    document.getElementById("inputMaterialNo").value = ''
    document.getElementById("inputMaterialName").classList.remove("is-valid", "is-invalid");
    document.getElementById("inputMaterialNo").classList.remove("is-valid", "is-invalid");

    document.getElementById("NoQuotationMessage").style.display = 'none';
    document.getElementById("receivedquotationTable").style.display = 'none';


}

const SetPriceOfMaterialFunction = (ob) => {
    let error = '';
    if (ob.quotation_request_id.supplier_id == null) {
        errors = errors + "Supplier not found for this quotation..!\n";
    }
    if (reportbestsupplierprice.material_id == null) {
        errors = errors + "Material not selected..!\n";
    }

    if (error == '') {
        let newMaterialSupplierPrice = new Object();
        newMaterialSupplierPrice.received_quotation_id = ob;
        newMaterialSupplierPrice.supplier_id = ob.quotation_request_id.supplier_id;
        newMaterialSupplierPrice.material_id = reportbestsupplierprice.material_id;
        let materiaUnitPrice = 0.00
        ob.receivedQuotationHasMaterialList.forEach(element => {
            if (element.material_id.id === reportbestsupplierprice.material_id.id) {
                materiaUnitPrice = parseFloat(element.material_unit_price);
            }
        });
        newMaterialSupplierPrice.best_supplier_price = materiaUnitPrice.toFixed(2);

        const confirmPriceUpdate = confirm('Are you sure to update following material supplier price..?'
            + '\n Material No : ' + newMaterialSupplierPrice.material_id.matno
            + '\n Material Name : ' + newMaterialSupplierPrice.material_id.name
            + '\n Business Name : ' + newMaterialSupplierPrice.supplier_id.businessname
            + '\n Received Quotation No : ' + newMaterialSupplierPrice.received_quotation_id.received_quot_no
            + '\n Material Purchasing Price : ' + newMaterialSupplierPrice.best_supplier_price);

        if (confirmPriceUpdate) {
            const materialSupplierPricePutServiceResponse = ajaxPutRequestMapping("/materialsupplierprice", newMaterialSupplierPrice);
            if (materialSupplierPricePutServiceResponse == "OK") {
                alert("Updated Successefully..!");
                clearPriceAnalyzeFunction();
                refreshMaterialBestPriceForm();
                refreshMaterialSupplierPriceTable();
                document.getElementById("tableTabButton").click();
            } else {
                alert("Update was not successful.. !\n" + materialSupplierPricePutServiceResponse);
            }
        } else {
            alert("Update canceled..");
        }
    } else {
        alert("Cannot set the price due to following errors : \n" + errors);
    }
}


const fillDataIntoReceivedQuoationList = (materialOb) => {

    receivedQuotationList = ajaxGetRequestMapping("/materialsupplierpricedrqlist/" + materialOb.id);


    let listWithoutLowestPrice = listWitoutBestPrice(receivedQuotationList, materialOb.id);
    let bestPriceRQ = lowestPricedRQOut(receivedQuotationList, materialOb.id);
    let newList = [];
    newList.push(bestPriceRQ);
    newList = newList.concat(listWithoutLowestPrice);

    const getMaterialPrice = (ob) => {
        let materiaUnitPrice = 0.00
        ob.receivedQuotationHasMaterialList.forEach(element => {
            if (element.material_id.id === materialOb.id) {
                materiaUnitPrice = parseFloat(element.material_unit_price);
            }
        });
        return "LKR " + materiaUnitPrice.toFixed(2);
    }
    const getSupplierName = (ob) => {
        return ob.quotation_request_id.supplier_id.businessname;
    }
    const displayPropertyListReceivedQuotation = [
        {dataType: 'text', propertyName: 'received_quot_no'},
        {dataType: 'function', propertyName: getSupplierName},
        {dataType: 'text', propertyName: 'expire_date'},
        {dataType: 'function', propertyName: getMaterialPrice}
    ]

    if (receivedQuotationList.length > 0) {
        fillDataIntoMaterialSupplierPriceTable("tbodyAnlyzedRQ", newList, displayPropertyListReceivedQuotation, SetPriceOfMaterialFunction, logedeUSerPRIVIMaterialSupplierPrice);
        new DataTable('#tableAnlyzedRQ');
        document.getElementById("tableAnlyzedRQ").style.width = "100%";
        document.getElementById("receivedquotationTable").style.display = 'block';
    } else {
        document.getElementById("NoQuotationMessage").style.display = 'block';
    }
}

//-------------------------- Onchange Material name -------------------------------------------------------------------------------------------------------

const inputMaterialNameEl = document.getElementById("inputMaterialName")
inputMaterialNameEl.addEventListener('change', () => {
    let materialOb = JSON.parse(inputMaterialNameEl.value);
    clearPriceAnalyzeFunction();
    fillDataIntoSelect(inputMaterialName, "Select Material", materialListForSupplierPrice, 'name', materialOb.name);
    selectDynamicValidator(inputMaterialNameEl, 'reportbestsupplierprice', 'material_id');
    document.getElementById("inputMaterialNo").value = materialOb.matno;
    document.getElementById("inputMaterialNo").classList.remove("is-invalid");
    document.getElementById("inputMaterialNo").classList.add("is-valid");

});

//-------------------------- Onchange Material name ends --------------------------------------------------------------------------------------------------


const priceAnalyzeFunction = () => {
    let errors = '';
    if (reportbestsupplierprice.material_id == null) {
        errors = errors + "Enter valid material..!\n";
        inputMaterialName.classList.add("is-invalid");
        inputMaterialNo.classList.add("is-invalid");
    }
    if (errors == '') {
        fillDataIntoReceivedQuoationList(reportbestsupplierprice.material_id);
    } else {
        alert("Cannot analyze due to following errors : \n" + errors);
    }
}

const clearPriceAnalyzeFunction = () => {
    refreshMaterialBestPriceForm();
    tbodyAnlyzedRQ.innerHTML = ''

}



const listWitoutBestPrice = (quotations, materialId) => {
    let bestPriceRQId = getBestReceivedQuotationId(quotations, materialId);
    return quotations.filter(objEl =>
        objEl.id !== bestPriceRQId
    );


}
const lowestPricedRQOut = (quotations, materialId) => {

    let bestPriceRQId = getBestReceivedQuotationId(quotations, materialId);
    let returnOB = new Object();
    quotations.forEach(el => {
        if (el.id === bestPriceRQId) {
            returnOB = el;
        }
    });
    return returnOB;
}


const getBestReceivedQuotationId = (quotations, materialId) => {

    let lowestReceivedQuotationId = 0;
    let lowestPrice = 0;
    for (let i = 0; i < quotations.length; i++) {
        quotations[i].receivedQuotationHasMaterialList.forEach(element => {
            if (element.material_id.id === materialId) {
                if (i === 0) {
                    lowestPrice = parseFloat(element.material_unit_price);
                    lowestReceivedQuotationId = quotations[i].id;
                } else {
                    if (parseFloat(lowestPrice) > parseFloat(element.material_unit_price)) {
                        lowestPrice = parseFloat(element.material_unit_price);
                        lowestReceivedQuotationId = quotations[i].id;
                    }
                }
            }
        });
    }


    return lowestReceivedQuotationId;
}