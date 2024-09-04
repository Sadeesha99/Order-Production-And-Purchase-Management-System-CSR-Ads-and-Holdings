//call material table refresh function
window.addEventListener('load', () => {

    loggedUserPriviForMaterial = ajaxGetRequestMapping("/privilege/bymodule/Material");


    refreshMaterialTable();// Calling Refresh function to data diplay table

    refreshMaterialForm();


    if ((!loggedUserPriviForMaterial.del_privi == true) || (!loggedUserPriviForMaterial.upd_privi == true)) {
        document.getElementById("addMaterialCategoryModalBtn").style.display='none';
        document.getElementById("addMaterialUnitTypeModalBtn").style.display='none';
    }

    if(!loggedUserPriviForMaterial.ins_privi){
        document.getElementById("tableTabButton").click();
        document.getElementById("formTabButton").style.display = 'none';
    }

});



//create function table refresh
const refreshMaterialTable = () => {

    const matLowStock = ajaxGetRequestMapping("/material/lowstock");
    const matInStock = ajaxGetRequestMapping("/material/instock");
    const matOutStock = ajaxGetRequestMapping("/material/outstock");
    const matDelStock = ajaxGetRequestMapping("/material/delstock");

    materials = matLowStock.concat(matInStock,matOutStock,matDelStock);


    //text--> String, number, date
    //function--> object, array, boolean
    const displayPropertyListMaterial = [
        { dataType: 'text', propertyName: 'matno' },
        { dataType: 'text', propertyName: 'name' },
        { dataType: 'function', propertyName: getMaterialCategory },
        { dataType: 'function', propertyName: getMaterialStatus },
        { dataType: 'function', propertyName: getCurrentStockWithUnit }
    ]
    //call filldataintotable function
    //(tableId,dataList)
    fillDataIntoTable('tbodyMaterial', materials, displayPropertyListMaterial, editMaterial, deleteMaterial, viewMaterial, true,loggedUserPriviForMaterial);
    new DataTable('#tableMaterial');
    document.getElementById("tableMaterial").style.width = "100%";

}



const refreshMaterialForm = () => {
    //creating a new object for material
    material = new Object();
    oldmaterial = null;

    materialCategory = ajaxGetRequestMapping("/material/category")
    materialStatus = ajaxGetRequestMapping("/material/status")

    materialUnitType = ajaxGetRequestMapping("/material/unittype")
    //Material status dynamic select fill
    fillDataIntoSelect(inputMaterialStatus, 'Select Material Status', materialStatus, 'name');
    fillDataIntoSelect(inputMaterialCategory, 'Select Material Category', materialCategory, 'name');
    fillDataIntoSelect(inputMaterialUnitType, 'Select Unit Type', materialUnitType, 'name');
    //disable buttons 
    document.getElementById("formAddBtn").disabled = false;
    document.getElementById("formUpdateBtn").disabled = true;
    document.getElementById("formRestBtn").disabled = false;

    document.getElementById("inputCurrentUnitStock").disabled = false;
    document.getElementById("inputLastStockIntake").disabled = true;
    document.getElementById("inputAllTimeTotal").disabled = true;
    document.getElementById("inputMaterialStatus").disabled = true;
    document.getElementById("inputMaterialROQ").disabled = false;

    document.getElementById("backButtonDivFormFirst").style.display = 'none';
    document.getElementById("StockSection").style.display = 'none';

    document.getElementById("formEditable").style.pointerEvents="auto";

    refreshMaterialCategoryInnerForm();
    refreshMaterialUnitTypeInnerForm();

}





const getMaterialCategory = (ob) => {
    return ob.material_category_id.name;
}

const getCurrentStockWithUnit = (ob) => {
    return (ob.current_unit_stock + " " + ob.material_unit_type_id.symbol);
}

const getMaterialStatus = (ob) => {
    //return 'SS';
    if (ob.material_status_id.name == 'In-Stock') {
        return '<p style="border-radius:10px" class="bg-success p-2 text-center fw-bold">' + ob.material_status_id.name + '</p>'
    }
    if (ob.material_status_id.name == 'Out-Of-Stock') {
        return '<p style="border-radius:10px" class="bg-warning p-2 text-center fw-bold">' + ob.material_status_id.name + '</p>'
    }
    if (ob.material_status_id.name == 'Deleted') {
        return '<p style="border-radius:10px;" class="bg-danger p-2 text-center fw-bold">' + ob.material_status_id.name + '</p>'
    }
    if (ob.material_status_id.name == 'Low-Stock') {
        return '<p style="background-color: #f86e12; border-radius:10px;" class="p-2 text-center fw-bold">' + ob.material_status_id.name + '</p>'
    }



}
//material form refill with database object
const materialFormRefill = (ob) => {

    material = JSON.parse(JSON.stringify(ob));
    oldmaterial = JSON.parse(JSON.stringify(ob));

    inputMaterialNo.value = ob.matno;
    inputMaterialName.value = ob.name;
    inputMaterialUnitCost.value = ob.unit_cost;
    inputMaterialROP.value = ob.reorder_point;
    inputProfitPercentage.value = ob.profit_percentage;
    inputMaterialDesicription.value = ob.description;
    inputCurrentUnitStock.disabled = true;
    inputCurrentUnitStock.value = ob.current_unit_stock;
    inputMaterialROP.value = ob.reorder_point;
    inputMaterialROQ.value = ob.reorder_quantity;
    inputLastStockIntake.value = ob.last_stock_intake;
    inputAllTimeTotal.value = ob.all_time_total_stock;

    inputMaterialUnitPrice.value = (((parseFloat(ob.unit_cost))*(parseFloat(ob.profit_percentage))/100)+parseFloat(ob.unit_cost)).toFixed(2);

    document.getElementById("inputMaterialDesicription").value = ob.descripition;

    document.getElementById("StockSection").style.display = 'block';

    fillDataIntoSelect(inputMaterialCategory, 'Select Material Category', materialCategory, 'name', ob.material_category_id.name);

    fillDataIntoSelect(inputMaterialUnitType, 'Select Unit Type', materialUnitType, 'name', ob.material_unit_type_id.name)

    fillDataIntoSelect(inputMaterialStatus, 'Select material Status', materialStatus, 'name', ob.material_status_id.name);
    document.getElementById("inputMaterialStatus").disabled = false;

    document.getElementById("formTabButton").click();

}
//Create function for delete material record
const deleteMaterial = (ob) => {
    //get material confirmation
    if((ob.current_unit_stock == null)||(ob.current_unit_stock===0)){
        const confirmMaterialDelete = confirm('Are you sure to delete following material..? \n'
            + '\n Material No : ' + ob.matno
            + '\n Material Name : ' + ob.name
            + '\n Material Status : ' + ob.material_status_id.name);
        if (confirmMaterialDelete) {
            let materialDeleteSeverResponse = ajaxDelRequestMapping("/material",ob);
            if (materialDeleteSeverResponse=='OK') {
                alert('Delete Successfully..!');
                refreshMaterialTable();
            }else{
                alert('Delete not completed, You have following error\n' + materialDeleteSeverResponse);
            }
        } else {
            alert('Delete was canceled\n');
        }
    }else{
        alert("Material with current stock cannot be deleted..!");
    }

}

//function for edit material button
const editMaterial = (ob) => {
    refreshMaterialForm();
    editButtonFunction(materialFormRefill, ob, "tableTabButton", "formAddBtn", "formUpdateBtn", "formRestBtn", ClearMaterialFormButtonFunction);
    document.getElementById("backButtonDivFormFirst").style.display = 'block';
}
//Create function for view material record
const viewMaterial = (ob) => {
    refreshMaterialForm();
    viewButtonFunction(materialFormRefill, ob, "tableTabButton", "formAddBtn", "formUpdateBtn", "formRestBtn", ClearMaterialFormButtonFunction);
    document.getElementById("backButtonDivFormFirst").style.display = 'block';
    //disableAllForView();
    document.getElementById("formEditable").style.pointerEvents="none";
}
//back button in material form
const backButtonMaterialForm = () => {
    refreshMaterialForm();
    backButtonFunctionForm("tableTabButton", "formAddBtn", "formUpdateBtn", "formRestBtn", ClearMaterialFormButtonFunction)
    document.getElementById("backButtonDivFormFirst").style.display = 'none';
}

//define function check form error
const checkMaterialFormError = () => {
    let errors = '';
    //Checking for material name
    if (material.name == null) {
        errors = errors + "Please Enter a Material Name..!\n";
        inputMaterialName.classList.add('is-invalid');
    }
    //Checking for material unit cost
    if (material.unit_cost == null) {
        errors = errors + "Please Enter a Material Unit Cost..!\n";
        inputMaterialUnitCost.classList.add('is-invalid');
    }
    //Checking for material profit percentage
    if (material.profit_percentage == null) {
        errors = errors + "Please Enter a Material Profit Precentage..!\n";
        inputProfitPercentage.classList.add('is-invalid');
    }
    //Checking for material reorder point
    if (material.reorder_point == null) {
        errors = errors + "Please Enter a Material Re-Order Point..!\n";
        inputMaterialROP.classList.add('is-invalid');
    }
    //Checking for material reorder quantity
    if (material.reorder_quantity == null) {
        errors = errors + "Please Enter a Material Re-Order Quantity..!\n";
        inputMaterialROQ.classList.add('is-invalid');
    }
    //checking for material category
    if ((material.material_category_id == null) || (material.material_category_id == '')) {
        errors = errors + "Please Enter a Material Category..!\n";
        inputMaterialCategory.classList.add('is-invalid');
    }
    //checking material status and stock
    if (material.material_status_id == null) {
        errors = errors + "Please Enter a Material Category..!\n";
        inputMaterialStatus.classList.add('is-invalid');
    } else if (material.material_status_id.name == "In-Stock") {
        if (material.current_unit_stock == null || material.current_unit_stock == 0) {
            inputCurrentUnitStock.classList.add('is-invalid');
            errors = errors + "You cannot Select In-stock without having valid current stock..!\n";
        }
    }
    //checking for material unit type
    if (material.material_unit_type_id == null) {
        errors = errors + "Please Enter a Material Category..!\n";
        inputMaterialUnitType.classList.add('is-invalid');
    }
    return errors;
}

//check updates
const checkFormMaterialUpdates = () => {
    let updates = '';
    //list of material form fields
    let listOfFieldMaterial = ['name','descripition','unit_cost','profit_percentage','reorder_point','reorder_quantity']

    listOfFieldMaterial.forEach(
        (materialField) => {
            if (material[materialField] != oldmaterial[materialField]) {
                updates = updates + ("Record of " + materialField + " is changed from '" + oldmaterial[materialField] + "' into '" + material[materialField] + "'.\n");
            }
        }
    );

    //if unit_price or profit_percentage has changed then show the price of the material
    if ((material.profit_percentage !== oldmaterial.profit_percentage)||(material.unit_cost !== oldmaterial.unit_cost)) {
        updates = updates + ("Current market price of the this material is : Rs. "+(((parseFloat(material.unit_cost))*(parseFloat(material.profit_percentage))/100)+parseFloat(material.unit_cost)).toFixed(2)+ "'.\n");
    }

    if (material.material_category_id.id != oldmaterial.material_category_id.id) {
        updates = updates + ("Record of material category is changed from '" + oldmaterial.material_category_id.name + "' into '" + material.material_category_id.name + "'.\n");
    }
    if (material.material_unit_type_id.id != oldmaterial.material_unit_type_id.id) {
        updates = updates + ("Record of material unit type is changed from '" + oldmaterial.material_unit_type_id.name + "' into '" + material.material_unit_type_id.name + "'.\n");
    }

    if (material.material_status_id.id != oldmaterial.material_status_id.id ) {
        updates = updates + "Materials status has been updated to " + material.material_status_id.name + ".\n";     
    }

    return updates;
}
//update material button funtion
const buttonMaterialUpdate = () => {

    if (material.current_unit_stock != oldmaterial.current_unit_stock) {
        material.current_unit_stock = oldmaterial.current_unit_stock;
    }
    if (material.last_stock_intake != oldmaterial.last_stock_intake) {
        material.last_stock_intake = oldmaterial.last_stock_intake;
    }
    if (material.all_time_total_stock != oldmaterial.all_time_total_stock) {
        material.all_time_total_stock = oldmaterial.all_time_total_stock;
    }

    let errors = checkMaterialFormError();
    if (errors == '') {
        //Check form updates
        let updates = checkFormMaterialUpdates();
        if (updates != "") {
            //User Confirmation
            let confirmMaterialUpdate = confirm("Are you sure you want to update following changes..? \n" + updates)
            if (confirmMaterialUpdate) {
                //call put services
                const putMaterialServiceReponse = ajaxPutRequestMapping("/material",material);
                //Check putServices Reponsces
                if (putMaterialServiceReponse == "OK") {
                    alert("update successfully...!");
                    //Refresh table
                    refreshMaterialTable();
                    //Clear Form Function
                    ClearMaterialFormButtonFunction();
                    //Refresh form function
                    refreshMaterialForm();
                    //call funtion for back button
                    backButtonMaterialForm();

                } else {
                    alert("Failed to update changers..\n" + putMaterialServiceReponse);
                }
            }

        } else {
            alert("No changes to update..!")
        }
    } else {
        alert("Form has following errors : \n" + errors);
    }
}


//define function for submit material
const submitMaterial = () => {
    // console.log("Submit");
    //console.log(material);
    const errors = checkMaterialFormError();
    if (material.material_status_id) {
        if ((material.material_status_id.name == "Out-Of-Stock") || (material.material_status_id.name == "Deleted")) {
            material.current_unit_stock = null;
        }
    }

    if (errors == '') {
        let confirmMaterialSubmit = confirm('Are you sure to add following material..?'
            + '\n Material Name : ' + material.name
            + '\n Material Category : ' + material.material_category_id.name
            + '\n Material Status : ' + material.material_status_id.name
            + '\n Material Price : Rs. ' + (((parseFloat(material.unit_cost))*(parseFloat(material.profit_percentage))/100)+parseFloat(material.unit_cost)).toFixed(2)+'.\n');
        // need to get user confirmation
        if (confirmMaterialSubmit) {
            //console.log(material);
            const materialPostServiceResponse = ajaxPostRequestMapping("/material",material);
            if (materialPostServiceResponse == 'OK') {
                alert("Save Successefully..!")
                //refresh table
                refreshMaterialTable();
                //click button to back
                ClearMaterialFormButtonFunction();
                //call form refresh function
                refreshMaterialForm();
                //back button function button
                backButtonMaterialForm();
            } else {
                alert("Saving material was not sucessful.. !\n" + " Reason : " + materialPostServiceResponse);
            }
        } else {
            alert("Material entry canceled..");
        }

    } else {
        alert("Form has following errors : \n" + errors)
    }
}


let listOfMaterialFormIDs = [inputMaterialNo, inputMaterialCategory, inputMaterialName, inputMaterialUnitType, inputMaterialUnitCost, inputMaterialStatus, inputProfitPercentage,inputMaterialUnitPrice, inputMaterialDesicription,inputMaterialROP, inputCurrentUnitStock, inputLastStockIntake, inputAllTimeTotal];
//Clear Form Function "formMaterial"refreshMaterialForm
const ClearMaterialFormButtonFunction = () => {
    refreshMaterialTable();
    ClearFormFunction("formMaterial", refreshMaterialForm, listOfMaterialFormIDs);
}



//Event listner to run on change of material status
document.getElementById("inputMaterialStatus").addEventListener("change", function () {

    let SelectedValueStatus = JSON.parse(document.getElementById("inputMaterialStatus").value).name;
    if (SelectedValueStatus == "In-Stock") {
        //checking for oldmaterial object is present or not
        if (window['oldmaterial']) {
            document.getElementById("StockSection").style.display = 'block'
            //if one is present the make StockSection visible if it is not.
            //check the value of the oldmaterial current stock is zero or not..
            if (parseInt(oldmaterial.current_unit_stock) == 0) {
                //console.log("In-Stock : oldob + unit = 0");
                //if it is zero then material status cannot be In-Stock.. so changing it to oldmaterial.material_status value
                material.material_status_id = oldmaterial.material_status_id;
                //generating errror for 0.5sec
                document.getElementById("inputMaterialStatus").classList.remove("is-valid");
                document.getElementById("inputMaterialStatus").classList.add("is-invalid");
                //Auto correction of the value in drop down menu
                setTimeout(() => {
                    fillDataIntoSelect(inputMaterialStatus, 'Select Material Status', materialStatus, 'name', oldmaterial.material_status_id.name);
                    document.getElementById("inputMaterialStatus").classList.remove("is-valid");
                    document.getElementById("inputMaterialStatus").classList.remove("is-invalid");
                }, 500);
            } else if (parseInt(oldmaterial.current_unit_stock) <= parseInt(material.reorder_point)) {
                document.getElementById("inputMaterialStatus").classList.remove("is-valid");
                document.getElementById("inputMaterialStatus").classList.add("is-invalid");
                //auto_correcting the error by 0.5sec
                setTimeout(() => {
                    fillDataIntoSelect(inputMaterialStatus, 'Select Material Status', materialStatus, 'name', 'Low-Stock');
                    selectDynamicValidator(inputMaterialStatus, 'material', 'material_status_id');
                }, 500);
            }
            else {
                //console.log("In-Stock : oldob + unit != 0");
                //if old material stock is not zero.. then Input 'In-Stock' is valid
                selectDynamicValidator(inputMaterialStatus, 'material', 'material_status_id');
            }
        } else {
            document.getElementById("inputCurrentUnitStock").value = '';
            document.getElementById("inputLastStockIntake").value = '';
            document.getElementById("inputAllTimeTotal").value = '';
            document.getElementById("inputCurrentUnitStock").classList.remove("is-valid", "is-invalid");
            document.getElementById("inputLastStockIntake").classList.remove("is-valid", "is-invalid");
            document.getElementById("inputAllTimeTotal").classList.remove("is-valid", "is-invalid");
            material.last_stock_intake = null;
            material.all_time_total_stock = null;
            material.current_unit_stock = null;
            //console.log("In-Stock : !oldob + unit must be != 0");
            document.getElementById("StockSection").style.display = 'block'
            //if there is no oldmaterial then also input 'In-Stock' is valid
            selectDynamicValidator(inputMaterialStatus, 'material', 'material_status_id')
        }
        //for inputs other than In-Stock
    }
    else if (SelectedValueStatus == "Low-Stock") {

        if (window['oldmaterial']) {
            document.getElementById("StockSection").style.display = 'block'
            if (parseInt(oldmaterial.current_unit_stock) == 0) {
                material.material_status_id = oldmaterial.material_status_id;
                document.getElementById("inputMaterialStatus").classList.remove("is-valid");
                document.getElementById("inputMaterialStatus").classList.add("is-invalid");
                //auto_correcting the error by 0.5sec
                setTimeout(() => {
                    fillDataIntoSelect(inputMaterialStatus, 'Select Material Status', materialStatus, 'name', oldmaterial.material_status_id.name);
                    document.getElementById("inputMaterialStatus").classList.remove("is-valid");
                    document.getElementById("inputMaterialStatus").classList.remove("is-invalid");
                }, 500);
                document.getElementById("StockSection").style.display = 'none'

            } else if (parseInt(oldmaterial.current_unit_stock) <= parseInt(material.reorder_point)) {

                selectDynamicValidator(inputMaterialStatus, 'material', 'material_status_id');

            } else {
                document.getElementById("inputMaterialStatus").classList.remove("is-valid");
                document.getElementById("inputMaterialStatus").classList.add("is-invalid");
                //auto_correcting the error by 0.5sec
                setTimeout(() => {
                    fillDataIntoSelect(inputMaterialStatus, 'Select Material Status', materialStatus, 'name', 'In-Stock');
                    selectDynamicValidator(inputMaterialStatus, 'material', 'material_status_id');
                }, 500);
            }
        } else {
            document.getElementById("inputCurrentUnitStock").value = '';
            document.getElementById("inputLastStockIntake").value = '';
            document.getElementById("inputAllTimeTotal").value = '';
            document.getElementById("inputCurrentUnitStock").classList.remove("is-valid", "is-invalid");
            document.getElementById("inputLastStockIntake").classList.remove("is-valid", "is-invalid");
            document.getElementById("inputAllTimeTotal").classList.remove("is-valid", "is-invalid");
            material.last_stock_intake = null;
            material.all_time_total_stock = null;
            material.current_unit_stock = null;
            document.getElementById("StockSection").style.display = 'block'
            selectDynamicValidator(inputMaterialStatus, 'material', 'material_status_id');

        }

    }

    else {

        //If Deleted or Out-of-Stock is selected, while an oldmaterial object is there..
        if (window['oldmaterial']) {
            //checkig the error condition
            document.getElementById("StockSection").style.display = 'block'
            //there should be an error if there is a value in oldmaterial for current unit stock
            if (parseInt(oldmaterial.current_unit_stock) == 0 || parseInt(oldmaterial.current_unit_stock) == null) {
                //console.log("Not In-Stock : oldob + unit = 0");
                //if there is an old object by material stock is zero then user can delete or set out of stock to materials record
                selectDynamicValidator(inputMaterialStatus, 'material', 'material_status_id')
            } else {
                //console.log("Not In-Stock : oldob + unit != 0");
                //if the selected input is error reseting the material_status ID to material_status of old object
                material.material_status_id = oldmaterial.material_status_id;
                //generating errror for 0.5sec
                document.getElementById("inputMaterialStatus").classList.remove("is-valid");
                document.getElementById("inputMaterialStatus").classList.add("is-invalid");
                //auto correcting the error by 0.5sec
                setTimeout(() => {
                    fillDataIntoSelect(inputMaterialStatus, 'Select Material Status', materialStatus, 'name', oldmaterial.material_status_id.name);
                    document.getElementById("inputMaterialStatus").classList.remove("is-valid");
                    document.getElementById("inputMaterialStatus").classList.remove("is-invalid");
                }, 500);

            }
        } else {
            //console.log("Not In-Stock : !oldob + unit must be = 0");
            //if there in no old object then get input for new object
            document.getElementById("StockSection").style.display = 'none'
            selectDynamicValidator(inputMaterialStatus, 'material', 'material_status_id');
            document.getElementById("inputCurrentUnitStock").value = '';
            document.getElementById("inputLastStockIntake").value = '';
            document.getElementById("inputAllTimeTotal").value = '';
            document.getElementById("inputCurrentUnitStock").classList.remove("is-valid", "is-invalid");
            document.getElementById("inputLastStockIntake").classList.remove("is-valid", "is-invalid");
            document.getElementById("inputAllTimeTotal").classList.remove("is-valid", "is-invalid");
            material.last_stock_intake = null;
            material.all_time_total_stock = null;
            material.current_unit_stock = null;
        }

    }
});

//event listner to run on keyup of current unit stoke
document.getElementById("inputCurrentUnitStock").addEventListener('keyup', function () {
    if (inputCurrentUnitStock.value == null || inputCurrentUnitStock.value == '') {
        console.log("current unit stock is null");
        document.getElementById("inputCurrentUnitStock").value = '';
        document.getElementById("inputCurrentUnitStock").classList.remove("is-valid", "is-invalid");
        document.getElementById("inputLastStockIntake").value = '';
        document.getElementById("inputLastStockIntake").classList.remove("is-valid", "is-invalid");
        document.getElementById("inputAllTimeTotal").value = '';
        document.getElementById("inputAllTimeTotal").classList.remove("is-valid", "is-invalid");
        material.current_unit_stock = null;
        material.last_stock_intake = null;
        material.all_time_total_stock = null;
    } else {

        textValidator(inputCurrentUnitStock, '^([1-9][0-9]{0,6})$', 'material', 'current_unit_stock');

        if (document.getElementById("inputCurrentUnitStock").classList.contains('is-valid')) {
            if (parseInt(material.current_unit_stock) <= parseInt(material.reorder_point)) {
                console.log("current unit stock valid <= Material reorder point.");
                if (material.material_status_id.name != "Low-Stock") {
                    document.getElementById("inputMaterialStatus").classList.remove("is-valid");
                    document.getElementById("inputMaterialStatus").classList.add("is-invalid");
                    setTimeout(() => {
                        fillDataIntoSelect(inputMaterialStatus, 'Select Material Status', materialStatus, 'name', 'Low-Stock');
                        selectDynamicValidator(inputMaterialStatus, 'material', 'material_status_id')
                    }, 500);
                }
                document.getElementById("inputLastStockIntake").value = material.current_unit_stock;
                document.getElementById("inputLastStockIntake").classList.remove("is-invalid");
                document.getElementById("inputLastStockIntake").classList.add("is-valid");
                document.getElementById("inputAllTimeTotal").value = material.current_unit_stock;
                document.getElementById("inputAllTimeTotal").classList.remove("is-invalid");
                document.getElementById("inputAllTimeTotal").classList.add("is-valid");
                material.last_stock_intake = material.current_unit_stock;
                material.all_time_total_stock = material.current_unit_stock;

            }
            else if (parseInt(material.current_unit_stock) > parseInt(material.reorder_point)) {
                console.log("current unit stock > Material reorder point.");
                if (material.material_status_id.name != "In-Stock") {
                    document.getElementById("inputMaterialStatus").classList.remove("is-valid");
                    document.getElementById("inputMaterialStatus").classList.add("is-invalid");
                    setTimeout(() => {
                        fillDataIntoSelect(inputMaterialStatus, 'Select Material Status', materialStatus, 'name', 'In-Stock');
                        selectDynamicValidator(inputMaterialStatus, 'material', 'material_status_id')
                    }, 500);
                }
                document.getElementById("inputLastStockIntake").value = material.current_unit_stock;
                document.getElementById("inputLastStockIntake").classList.remove("is-invalid");
                document.getElementById("inputLastStockIntake").classList.add("is-valid");
                document.getElementById("inputAllTimeTotal").value = material.current_unit_stock;
                document.getElementById("inputAllTimeTotal").classList.remove("is-invalid");
                document.getElementById("inputAllTimeTotal").classList.add("is-valid");
                material.last_stock_intake = material.current_unit_stock;
                material.all_time_total_stock = material.current_unit_stock;
            }
        }
        else if (document.getElementById("inputCurrentUnitStock").classList.contains('is-invalid')) {

            document.getElementById("inputLastStockIntake").value = '';
            document.getElementById("inputLastStockIntake").classList.remove("is-valid", "is-invalid");
            document.getElementById("inputAllTimeTotal").value = '';
            document.getElementById("inputAllTimeTotal").classList.remove("is-valid", "is-invalid");
            material.last_stock_intake = null;
            material.all_time_total_stock = null;
            textValidator(inputCurrentUnitStock, '^([1-9][0-9]{0,6})$', 'material', 'current_unit_stock')
        }
    }
});


inputMaterialUnitCost.addEventListener('keyup',()=>{
    if(material.unit_cost){
        if(material.profit_percentage){
            inputMaterialUnitPrice.value = (((parseFloat(material.unit_cost))*(parseFloat(material.profit_percentage))/100)+parseFloat(material.unit_cost)).toFixed(2);
            inputMaterialUnitPrice.classList.add('is-valid');
            inputMaterialUnitPrice.classList.remove('is-invalid');
        }else {
            inputMaterialUnitPrice.value = '';
            inputMaterialUnitPrice.classList.remove('is-valid');
            inputMaterialUnitPrice.classList.remove('is-invalid');
        }
    }else {
        inputMaterialUnitPrice.value='';
        inputMaterialUnitPrice.classList.remove('is-valid');
        inputMaterialUnitPrice.classList.remove('is-invalid');
    }
})

inputProfitPercentage.addEventListener('keyup',()=>{
    if(material.profit_percentage){
        if(material.unit_cost){
            inputMaterialUnitPrice.value = (((parseFloat(material.unit_cost))*(parseFloat(material.profit_percentage))/100)+parseFloat(material.unit_cost)).toFixed(2);
            inputMaterialUnitPrice.classList.add('is-valid');
            inputMaterialUnitPrice.classList.remove('is-invalid');
        }else {
            inputMaterialUnitPrice.value = '';
            inputMaterialUnitPrice.classList.remove('is-valid');
            inputMaterialUnitPrice.classList.remove('is-invalid');
        }
    }else {
        inputMaterialUnitPrice.value='';
        inputMaterialUnitPrice.classList.remove('is-valid');
        inputMaterialUnitPrice.classList.remove('is-invalid');
    }
})

document.getElementById("inputMaterialROP").addEventListener('keyup', () => {
    if (window['oldmaterial']) {
        if ((document.getElementById("inputMaterialROP").value == null) || (document.getElementById("inputMaterialROP").value == '')) {
            //document.getElementById("inputMaterialROP").value = oldmaterial.reorder_point;
            inputCurrentUnitStock.value = oldmaterial.current_unit_stock;
            material.current_unit_stock = oldmaterial.current_unit_stock;
            inputLastStockIntake.value = oldmaterial.last_stock_intake;
            material.last_stock_intake = oldmaterial.last_stock_intake;
            inputAllTimeTotal.value = oldmaterial.all_time_total_stock;
            material.all_time_total_stock = oldmaterial.all_time_total_stock;
            document.getElementById("inputMaterialStatus").classList.remove("is-valid", "is-invalid");
            fillDataIntoSelect(inputMaterialStatus, 'Select material Status', materialStatus, 'name', oldmaterial.material_status_id.name);
        } else {
            if (document.getElementById("inputMaterialROP").classList.contains("is-valid")) {
                if (parseInt(oldmaterial.current_unit_stock) <= parseInt(material.reorder_point)) {
                    fillDataIntoSelect(inputMaterialStatus, 'Select Material Status', materialStatus, 'name', 'Low-Stock');
                    selectDynamicValidator(inputMaterialStatus, 'material', 'material_status_id');
                }
                if (parseInt(oldmaterial.current_unit_stock) > parseInt(material.reorder_point)) {
                    fillDataIntoSelect(inputMaterialStatus, 'Select Material Status', materialStatus, 'name', 'In-Stock');
                    selectDynamicValidator(inputMaterialStatus, 'material', 'material_status_id');
                }
            }
        }

    } else {

        if ((document.getElementById("inputMaterialROP").value == null) || (document.getElementById("inputMaterialROP").value == '')) {
            document.getElementById("inputMaterialStatus").disabled = true;
            document.getElementById("StockSection").style.display = 'none'
            document.getElementById("inputMaterialStatus").classList.remove("is-valid", "is-invalid");
            fillDataIntoSelect(inputMaterialStatus, 'Select Material Status', materialStatus, 'name');
            document.getElementById("inputCurrentUnitStock").value = '';
            document.getElementById("inputCurrentUnitStock").classList.remove("is-valid", "is-invalid");
            document.getElementById("inputLastStockIntake").value = '';
            document.getElementById("inputLastStockIntake").classList.remove("is-valid", "is-invalid");
            document.getElementById("inputAllTimeTotal").value = '';
            document.getElementById("inputAllTimeTotal").classList.remove("is-valid", "is-invalid");
            material.material_status_id = null;
            material.current_unit_stock = null;
            material.last_stock_intake = null;
            material.all_time_total_stock = null;

        } else if (parseInt(document.getElementById("inputMaterialROP").value) > 0) {
            document.getElementById("inputMaterialStatus").classList.remove("is-valid", "is-invalid");
            fillDataIntoSelect(inputMaterialStatus, 'Select Material Status', materialStatus, 'name');
            document.getElementById("inputCurrentUnitStock").value = '';
            document.getElementById("inputCurrentUnitStock").classList.remove("is-valid", "is-invalid");
            document.getElementById("inputLastStockIntake").value = '';
            document.getElementById("inputLastStockIntake").classList.remove("is-valid", "is-invalid");
            document.getElementById("inputAllTimeTotal").value = '';
            document.getElementById("inputAllTimeTotal").classList.remove("is-valid", "is-invalid");
            material.current_unit_stock = null;
            material.last_stock_intake = null;
            material.all_time_total_stock = null;
            document.getElementById("inputMaterialStatus").disabled = false;

        }



    }

});

document.getElementById("inputMaterialROP").addEventListener("keydown", (event) => {
    let KeyID = event.key;

    if (KeyID == 'Delete' || KeyID == 'Backspace') {
        if (window['oldmaterial']) {
            //document.getElementById("inputMaterialROP").value = oldmaterial.reorder_point;
            inputCurrentUnitStock.value = oldmaterial.current_unit_stock;
            material.current_unit_stock = oldmaterial.current_unit_stock;
            inputLastStockIntake.value = oldmaterial.last_stock_intake;
            material.last_stock_intake = oldmaterial.last_stock_intake;
            inputAllTimeTotal.value = oldmaterial.all_time_total_stock;
            material.all_time_total_stock = oldmaterial.all_time_total_stock;
            document.getElementById("inputMaterialStatus").classList.remove("is-valid", "is-invalid");
            fillDataIntoSelect(inputMaterialStatus, 'Select material Status', materialStatus, 'name', oldmaterial.material_status_id.name);
        } else {
            document.getElementById("inputMaterialROP").value = '';
            textValidator(inputMaterialROP, '^(([1-9])|([1-9][0-9]{1,2}))$', 'material', 'reorder_point');
        }

    }
});




//----------------------------------- Inner Form Sections For Material Category and Material Unit Type ---------------------------------------

const refreshMaterialCategoryInnerForm = () => {
    material_category = new Object();

}

const refreshMaterialUnitTypeInnerForm = () => {
    material_unit_type = new Object();
}

const checkErrorsMateriaCategoryForm = () => {
    let errorserrorsMatCatForm = ''
    if (material_category.name == null) {
        errorserrorsMatCatForm = "Material Category Name is not valid...!"
        inputMaterialCategoryName.classList.add('is-invalid');
    }
    return errorserrorsMatCatForm;
}
const checkErrorsMaterialUnitTypForm = () => {
    let errorsMatUnitForm = ''
    if (material_unit_type.name == null) {
        errorsMatUnitForm = "Material Unit Name is not valid...! \n";
        inputMaterialUnitTypeName.classList.add('is-invalid');
    }
    if (material_unit_type.symbol == null) {
        errorsMatUnitForm = "Material Unit Symbol s not valid...! \n";
        inputMaterialUnitTypeSymbol.classList.add('is-invalid');
    }
    return errorsMatUnitForm;
}

const submitNewMaterialCategory = () => {
    //check form errors
    let materialCategoryFormErrors = checkErrorsMateriaCategoryForm();
    if (materialCategoryFormErrors == '') {
        //alert before save
        let confirmMaterialCategorySubmit = confirm('Are you sure to add following material category..?'
            + '\n Material Category : ' + material_category.name
            + '\n !!! This Cannot be changed after applied..!!!');

        if (confirmMaterialCategorySubmit) {
            //ajax call, send data to backend and get status
            let serverResponseMatCategory = ajaxPostRequestMapping('/material/category',material_category);
            if (serverResponseMatCategory == 'OK') {
                alert("Save Successefully..!")
                //clear form function
                closeBtnMaterialUnitType();
                //hide modal
                document.getElementById("closeMatCatModal").click();
                $('#materialCategoryBackdropLabel').modal('hide');
                refreshMaterialForm();


            } else {
                alert("Saving material category was not sucessful.. !\n" + " Reason : " + serverResponseMatCategory);
            }

        }else{
            alert("Material entry canceled..");
        }
    }else{
        alert("Form has following errors : \n" + materialCategoryFormErrors)
    }


}


const submitNewMaterialUnitType = () => {
    //check form errors
    let materialUnitTypeFormErrors = checkErrorsMaterialUnitTypForm();
    //alert before save
    if (materialUnitTypeFormErrors == '') {
        //alert before save
        let confirmMaterialUnitTypeSubmit = confirm('Are you sure to add following material category..?'
            + '\n Material Category : ' + material_unit_type.name
            + '\n !!! This Cannot be changed after applied..!!!');

        if (confirmMaterialUnitTypeSubmit) {
            //ajax call, send data to backend and get status
            let serverResponseMatUnitTyp = ajaxPostRequestMapping("/material/unittype",material_unit_type);
            if (serverResponseMatUnitTyp == 'OK') {
                alert("Save Successefully..!")
                //clear form function
                closeBtnMaterialUnitType();
                //hide modal
                document.getElementById("closeMatUnitModal").click();
                $('#materialUnitTypeBackdropLabel').modal('hide');
                refreshMaterialForm();

            } else {
                alert("Saving material category was not sucessful.. !\n" + " Reason : " + serverResponseMatUnitTyp);
            }
        }else{
            alert("Material entry canceled..");
        }
    }else{
        alert("Form has following errors : \n" + materialUnitTypeFormErrors)
    }


    //give user feedback from the status received
}



const closeBtnMaterialCategory = () => {
    //clear styles of form
    document.getElementById("inputMaterialCategoryName").classList.remove('is-valid', 'is-invalid');
    document.getElementById("inputMaterialCategoryName").value = '';
    //call form refresh functions
    refreshMaterialCategoryInnerForm();
}


const closeBtnMaterialUnitType = () => {
    //clear styles of form
    document.getElementById("inputMaterialUnitTypeName").classList.remove('is-valid', 'is-invalid');
    document.getElementById("inputMaterialUnitTypeSymbol").classList.remove('is-valid', 'is-invalid');
    document.getElementById("inputMaterialUnitTypeName").value = '';
    document.getElementById("inputMaterialUnitTypeSymbol").value = '';
    //call form refresh functions
    refreshMaterialUnitTypeInnerForm();
}
