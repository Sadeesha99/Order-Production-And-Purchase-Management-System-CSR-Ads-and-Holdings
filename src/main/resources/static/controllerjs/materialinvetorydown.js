//call material table refresh function
window.addEventListener('load', () => {

    refreshMaterialOutQuantityForm();

});


const refreshMaterialOutQuantityForm = () => {

    materialout = new Object;

    const matLowStock = ajaxGetRequestMapping("/material/lowstock");
    const matInStock = ajaxGetRequestMapping("/material/instock");
    materialListForSupplierPrice = matLowStock.concat(matInStock);
    fillDataIntoSelect(inputMaterialName, "Select Material", materialListForSupplierPrice, 'name');
    document.getElementById("inputMaterialNo").value = ''
    document.getElementById("inputMaterialName").classList.remove("is-valid", "is-invalid");
    document.getElementById("inputMaterialNo").classList.remove("is-valid", "is-invalid");
    document.getElementById("inputMaterialCurrentQuantity").classList.remove("is-valid", "is-invalid");
    document.getElementById("inputMaterialOutQuantity").classList.remove("is-valid", "is-invalid");
    document.getElementById("inputMaterialNo").value = '';
    document.getElementById("inputMaterialCurrentQuantity").value = '';
    document.getElementById("inputMaterialOutQuantity").value = '';

    document.getElementById("inputMaterialOutQuantity").disabled = true;


}




const inputMaterialNameEl = document.getElementById("inputMaterialName")

inputMaterialNameEl.addEventListener('change', () => {
    let materialOb = JSON.parse(inputMaterialNameEl.value);
    refreshMaterialOutQuantityForm();
    fillDataIntoSelect(inputMaterialName, "Select Material", materialListForSupplierPrice, 'name',materialOb.name);
    selectDynamicValidator(inputMaterialName, 'materialout', 'material_id');
    materialout.material_id = materialOb;
    document.getElementById("inputMaterialNo").value = materialOb.matno;
    document.getElementById("inputMaterialNo").classList.remove("is-valid","is-invalid");
    document.getElementById("inputMaterialNo").classList.add("is-valid");
    document.getElementById("inputMaterialCurrentQuantity").value = materialOb.current_unit_stock;
    document.getElementById("inputMaterialCurrentQuantity").classList.remove("is-valid","is-invalid");
    document.getElementById("inputMaterialCurrentQuantity").classList.add("is-valid");
    document.getElementById("inputMaterialOutQuantity").disabled = false;

});


//Material Out quantity key up
const inputMaterialOutQuantity = document.getElementById("inputMaterialOutQuantity");
inputMaterialOutQuantity.addEventListener('keyup', () => {
    let pattern = '^([1-9][0-9]{0,6})$';
        const regPattern = new RegExp(pattern);
    if (inputMaterialOutQuantity.value != "") {
        if(regPattern.test(inputMaterialOutQuantity.value)){
            let outQuantity = parseFloat(inputMaterialOutQuantity.value);
            let currentQuantity = parseFloat(materialout.material_id.current_unit_stock);
            if(currentQuantity>=outQuantity){
                materialout.quantity = parseFloat(inputMaterialOutQuantity.value).toFixed(2);
                inputMaterialOutQuantity.classList.remove('is-invalid', 'is-valid');
                inputMaterialOutQuantity.classList.add('is-valid');
            }else{
                materialout.quantity = null;
                inputMaterialOutQuantity.classList.remove('is-valid', 'is-invalid');
                inputMaterialOutQuantity.classList.add('is-invalid');
            }
            
        } else {
            materialout.quantity = null;
            inputMaterialOutQuantity.classList.remove('is-valid', 'is-invalid');
            inputMaterialOutQuantity.classList.add('is-invalid');
        }
    } else {
        materialout.quantity = null;
        inputMaterialOutQuantity.classList.remove('is-valid');
        inputMaterialOutQuantity.classList.remove('is-invalid');
    }

});

const outInvetoryFunction = () => {
    let error = '';
    if (materialout.material_id == null) {
        error = error + "Select valid material..!\n";
        inputMaterialNameEl.classList.add("is-invalid");
    }
    if (materialout.quantity == null) {
        error = error + "Enter valid quantity..!\n";
        inputMaterialOutQuantity.classList.add("is-invalid");
    }
    if (error == '') {
        let confirmMaterialSubmit = confirm('Are you sure to remove following material..?'
            + '\n Material Name : ' + materialout.material_id.name
            + '\n Material Current Quantity : ' + materialout.material_id.current_unit_stock
            + '\n Material Out Quantity : ' + materialout.quantity);

        if(confirmMaterialSubmit){
            let mateToUpdate = materialout.material_id;
            mateToUpdate.current_unit_stock = parseFloat(materialout.material_id.current_unit_stock)-parseFloat(materialout.quantity);
            const materialPostServiceResponse = ajaxPutRequestMapping("/materialinventorydown",mateToUpdate);
            if (materialPostServiceResponse == "OK") {
                console.log(mateToUpdate);
                console.log(mateToUpdate.current_unit_stock);

                alert("Update Successefully..!")
                refreshMaterialOutQuantityForm();
            }else{
                alert("Out material was not successful.. !\n" + " Reason : " + materialPostServiceResponse);
            }
        }else{
            alert("Request was canceled");
        }
    } else {
        alert("Cannot remove material due to following errors : \n" + error);
    }
}

