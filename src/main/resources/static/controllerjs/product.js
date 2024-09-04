//call material table refresh function
window.addEventListener('load', () => {

    logedeUSerPRIVI = ajaxGetRequestMapping("/privilege/bymodule/Product")


    refreshProductTable();
    // Calling Refresh function to data diplay table
    refreshProductForm();




    if (!logedeUSerPRIVI.ins_privi) {
        document.getElementById("tableTabButton").click();
        document.getElementById("formTabButton").style.display = 'none';
    }


});



//create function table refresh
const refreshProductTable = () => {
    products = ajaxGetRequestMapping("/product/findall");


    //text--> String, number, date
    //function--> object, array, boolean
    const displayPropertyListProduct = [
        { dataType: 'text', propertyName: 'productno' },
        { dataType: 'text', propertyName: 'name' },
        { dataType: 'function', propertyName: getProductStatus },
        { dataType: 'function', propertyName: getTotalPrice },
        { dataType: 'function', propertyName: getServiceCharge }
    ]
    //call filldataintotable function
    //(tableId,dataList)
    fillDataIntoTable('tbodyMaterial', products, displayPropertyListProduct, editProduct, deleteProduct, viewProduct, true, logedeUSerPRIVI);
    new DataTable('#tableProduct');
    document.getElementById("tableProduct").style.width = "100%";

}



const refreshProductForm = () => {
    //creating a new object for product
    product = new Object();
    oldproduct = null;

    productStatus = ajaxGetRequestMapping("/product/status/findall");

    fillDataIntoSelect(inputProductStatus , "Select product status" , productStatus , 'name');

    refreshInnerForm();

    document.getElementById("inputProductStatus").disabled = true;
    //disable buttons
    document.getElementById("formAddBtn").disabled = false;
    document.getElementById("formUpdateBtn").disabled = true;
    document.getElementById("formRestBtn").disabled = false;


    document.getElementById("backButtonDivFormFirst").style.display = 'none';

    document.getElementById("tableDivInnerForm").style.display = 'none';

    document.getElementById("formEditable").style.pointerEvents = "auto";


}



const getProductStatus = (ob) => {
    //return 'SS';
    if (ob.product_status_id.name == 'Active') {
        return '<p style="border-radius:10px" class="bg-success p-2 text-center fw-bold">' + ob.product_status_id.name + '</p>'
    }
    if (ob.product_status_id.name == 'In-Active') {
        return '<p style="border-radius:10px" class="bg-warning p-2 text-center fw-bold">' + ob.product_status_id.name + '</p>'
    }
    if (ob.product_status_id.name == 'Deleted') {
        return '<p style="border-radius:10px;" class="bg-danger p-2 text-center fw-bold">' + ob.product_status_id.name + '</p>'
    }
}

const getTotalPrice = (ob)=>{
    return (parseFloat(ob.total_price).toFixed(2));
}
const getServiceCharge = (ob)=>{
    return (parseFloat(ob.service_charge).toFixed(2));
}





//produc form refill with database object
const productFormRefill = (ob) => {

    product = JSON.parse(JSON.stringify(ob));
    oldproduct = JSON.parse(JSON.stringify(ob));

    inputProductNo.value = ob.productno;
    inputProductName.value = ob.name;
    inputProductServiceCharges.value = parseFloat(ob.service_charge).toFixed(2);
    inputProductTotalPrice.value = parseFloat(ob.total_price).toFixed(2);
    document.getElementById("inputProductDesicription").value = ob.description;

    productStatus = ajaxGetRequestMapping("/product/status/findall");

    document.getElementById("inputProductStatus").disabled = false;

    fillDataIntoSelect(inputProductStatus , "Select product status" , productStatus , 'name',ob.product_status_id.name);

    refreshInnerFormTable();
    refreshInnerForm();

    document.getElementById("tableDivInnerForm").style.display = 'block';

    document.getElementById("formTabButton").click();

}
//Create function for delete material record
const deleteProduct = (ob) => {
    if (ob.product_status_id.name == "Deleted") {
        alert(ob.name + " is already deleted.");
    } else {
        //get product delete confirmation
        const confirmProductDelete = confirm('Are you sure to delete following product..? \n'
            + '\n Product No : ' + ob.productno
            + '\n Product Name : ' + ob.name
            + '\n Product Status : ' + ob.product_status_id.name);
        if (confirmProductDelete) {
            const deleteSeverResponse = ajaxDelRequestMapping("/product",ob);
            if (deleteSeverResponse=='OK') {
                alert('Delete Successfully..!');
                refreshProductTable();
            }else{
                alert('Delete not completed, You have following error\n' + deleteSeverResponse);
            }
        } else {
            alert('Delete not completed, Request was canceled..');
        }
    }
}

//function for edit product button
const editProduct = (ob) => {
    refreshProductForm();
    editButtonFunction(productFormRefill, ob, "tableTabButton", "formAddBtn", "formUpdateBtn", "formRestBtn", ClearProductFormButtonFunction);
    document.getElementById("backButtonDivFormFirst").style.display = 'block';
}
//Create function for view product record
const viewProduct = (ob) => {
    refreshProductForm();
    viewButtonFunction(productFormRefill, ob, "tableTabButton", "formAddBtn", "formUpdateBtn", "formRestBtn", ClearProductFormButtonFunction);
    document.getElementById("backButtonDivFormFirst").style.display = 'block';
    //disableAllForView();
    document.getElementById("formEditable").style.pointerEvents = "none";
}
//back button in product form
const backButtonProductForm = () => {
    backButtonFunctionForm("tableTabButton", "formAddBtn", "formUpdateBtn", "formRestBtn", ClearProductFormButtonFunction)
    document.getElementById("backButtonDivFormFirst").style.display = 'none';
    refreshProductForm();
}

const checkProductFormError = () => {
    let error = '';
    if(product.name==null){
        error = error + "Enter valid product name..!\n";
        inputProductName.classList.add("is-invalid");
    }
    if(product.product_status_id==null){
        error = error + "Enter valid product status..!\n";
        inputProductStatus.classList.add("is-invalid");
    }
    if(product.total_price==null){
        error = error + "Total product is not included..!\n";
        inputProductTotalPrice.classList.add("is-invalid");
    }
    if(product.productHasMaterialList==null){
        error = error + "Product must has valid material list..!\n";
        document.getElementById("productMatErrorDiv").style.display = 'inline'
    }

    return error;
}

const checkFormProductUpdates= () => {
    let updates = '';
    //list of Products form fields
    let listOfFieldProducts = ['descripition', 'name', 'service_charge', 'total_price']

    listOfFieldProducts.forEach(
        (ProductsField) => {
            if (product[ProductsField] != oldproduct[ProductsField]) {
                updates = updates + ("Record of " + ProductsField + " is changed from '" + oldproduct[ProductsField] + "' into '" + product[ProductsField] + "'.\n");
            }
        }
    );

    if (product.product_status_id.id != oldproduct.product_status_id.id ) {
        updates = updates + "Product status has been updated to " + product.product_status_id.name + ".\n";     
    }
    if (JSON.stringify(product.productHasMaterialList) != JSON.stringify(oldproduct.productHasMaterialList) ) {
        updates = updates + "Product material has been updated...\n";     
    }
    return updates;
}








//update product button funtion
const buttonProductUpdate = () => {

    let errors = checkProductFormError();
    if (errors == '') {
        //Check form updates
        let updates = checkFormProductUpdates();
        if (updates != "") {
            //User Confirmation
            if (product.product_status_id.id != oldproduct.product_status_id.id && product.product_status_id.id==3) {
                alert("Please use delete button in table to delete this product. Do not do it in update section..!")
            }else{
                let confirmProductUpdate = confirm("Are you sure you want to update following changes..? \n" + updates)
                if (confirmProductUpdate) {
                    //call put services
                    const putProductServiceReponse = ajaxPutRequestMapping("/product",product);
                    //Check putServices Reponsces
                    if (putProductServiceReponse == "OK") {
                        alert("update successfully...!");
                        //Refresh table
                        refreshProductTable();
                        //Clear Form Function
                        ClearProductFormButtonFunction();
                        //Refresh form function
                        refreshProductForm();
                        //call funtion for back button
                        backButtonProductForm();

                    } else {
                        alert("Failed to update changers..\n" + putProductServiceReponse);
                    }
                }
            }

        } else {
            alert("No changes to update..!")
        }
    } else {
        alert("Form has following errors : \n" + errors);
    }
}


//define function for submit product
const submitProduct = () => {
    // console.log("Submit");
    //console.log(Product);
    const errors = checkProductFormError();
    
    if (errors == '') {
        let confirmProductSubmit = confirm('Are you sure to add following product..?'
            + '\n Product Name : ' + product.name
            + '\n Product Price : ' + product.total_price
            + '\n Product Status : ' + product.product_status_id.name);
        // need to get user confirmation
        if (confirmProductSubmit) {
            //console.log(product);
            const productPostServiceResponse = ajaxPostRequestMapping("/product",product);
            if (productPostServiceResponse == 'OK') {
                alert("Save Successefully..!")
                //refresh table
                refreshProductTable();
                //click button to back
                ClearProductFormButtonFunction();
                //call form refresh function
                refreshProductForm();
                //back button function button
                backButtonProductForm();
            } else {
                alert("Saving product was not sucessful.. !\n" + " Reason : " + productPostServiceResponse);
            }
        } else {
            alert("Product entry canceled..");
        }

    } else {
        alert("Form has following errors : \n" + errors)
    }
}

let listOfFormIDs = [inputProductName, inputProductStatus, inputProductServiceCharges, inputProductTotalPrice, inputProductDesicription];
const ClearProductFormButtonFunction=()=>{
    tableInnerFormBody.innerHTML = '';
    ClearFormFunction("formProduct", refreshProductForm, listOfFormIDs);
    clearInnerFormProductHasMaterial();
}



//--------------------------------------------------------- Inner Form Section ------------------------------------------------------------------------------------------------------

const refreshInnerFormTable = () => {

    // Refresh inner table
    const displayPropertyList = [
        { dataType: 'function', propertyName: getMaterialName },
        { dataType: 'function', propertyName: getUnitPrice },
        { dataType: 'text', propertyName: 'req_quantity' },
        { dataType: 'function', propertyName: getLinePrice }
    ]
    fillDataIntoInnerTable("tableInnerFormBody", product.productHasMaterialList, displayPropertyList, deleteFunctionInnerForm);

    if (!product.productHasMaterialList) {
        //has productHasMatList
        document.getElementById("tableDivInnerForm").style.display = 'none';

    } else {
        document.getElementById("tableDivInnerForm").style.display = 'block';
        document.getElementById("productMatErrorDiv").style.display = 'none';
        if(oldproduct==null || !oldproduct ){
            if(product.productHasMaterialList.length>0){
                let productStatusList = ajaxGetRequestMapping("/product/status/findall");
                fillDataIntoSelect(inputProductStatus , "Select product status" , productStatusList , 'name',"Active");
                selectDynamicValidator(inputProductStatus,'product','product_status_id');
            }else{
                let productStatusList = ajaxGetRequestMapping("/product/status/findall");
                fillDataIntoSelect(inputProductStatus , "Select product status" , productStatusList , 'name');
                product.product_status_id = null;
                document.getElementById("inputProductStatus").classList.remove('is-valid','is-invalid');
            }
        }else {
            let productStatusList = ajaxGetRequestMapping("/product/status/findall");
            fillDataIntoSelect(inputProductStatus , "Select product status" , productStatusList , 'name',oldproduct.product_status_id.name);
        }
    }

}

const getUnitPrice = (ob)=>{
    return (parseFloat(ob.material_unit_price).toFixed(2));
}
const getLinePrice = (ob)=>{
    return (parseFloat(ob.material_line_price).toFixed(2));
}
const getMaterialName = (ob) => {
    return ob.material_id.name;
}

const deleteFunctionInnerForm = (ob, rowIndex) => {

    // At position rowIndex of productHasMaterialList , remove 1 element
    product.productHasMaterialList.splice(rowIndex, 1);
    refreshInnerFormTable();

    generateTotalPrice();

}




const refreshInnerForm = () => {
    producthasmaterial = new Object();

    let materialCategory = ajaxGetRequestMapping("/material/category");

    //Material status dynamic select fill
    fillDataIntoSelect(inputMaterialCategory, 'Select Material Category', materialCategory, 'name');

    document.getElementById("inputMaterialName").disabled = true;
    document.getElementById("inputMaterialUnitQuantity").disabled = true;
    document.getElementById("productMatErrorDiv").style.display = 'none';



}






let inputMaterialNameEl = document.getElementById("inputMaterialName");
let resultDivMaterial = document.getElementById("divResultByMaterialName");

document.getElementById("inputMaterialCategory").addEventListener("change", function () {
    let selectedValueCategory = JSON.parse(document.getElementById("inputMaterialCategory").value);
    if (selectedValueCategory != null) {
        //console.log(selectedValueCategory)
        materialList = ajaxGetRequestMapping("/material/validbycategory/"+selectedValueCategory.id)

        unitLabelSpan.innerHTML = "Unit";


        let listofFieldsInnerFormPhM = [inputMaterialName, inputMaterialUnitQuantity, inputMaterialUnitPrice, inputMaterialLinePrice]
        listofFieldsInnerFormPhM.forEach(element => {
            element.value = '';
            element.classList.remove('is-invalid');
            element.classList.remove('is-valid');
        });
        let listofPropertiesFormPhM = ['material_id', 'req_quantity', 'material_unit_price', 'material_line_price']
        listofPropertiesFormPhM.forEach(element => {
            producthasmaterial[element] = null;
        });
        resultDivMaterial.innerHTML = '';

        inputMaterialCategory.classList.add('is-valid');
        inputMaterialCategory.classList.remove('is-invalid');
        document.getElementById("inputMaterialName").disabled = false;


    } else {
        inputMaterialCategory.classList.remove('is-valid');
        inputMaterialCategory.classList.add('is-invalid');
        materialList = [];
    }
});

const checkInnerFormErrors = () => {
    errors = '';

    if (producthasmaterial.material_id == null) {
        errors = errors + "Please select a material..! \n"
        inputMaterialCategory.classList.add("is-invalid");
        inputMaterialName.classList.add("is-invalid");
    }
    if (producthasmaterial.req_quantity == null) {
        errors = errors + "Please enter a required quantity..! \n";
        inputMaterialUnitQuantity.classList.add("is-invalid");
    }
    if (producthasmaterial.material_unit_price == null) {
        errors = errors + "Please check the material, Unit price is not included..! \n";
        inputMaterialUnitPrice.classList.add("is-invalid");
        inputMaterialName.classList.add("is-invalid");
    }
    if (producthasmaterial.material_unit_price == null) {
        errors = errors + "Please check the material and required quantity, Unit price is not included..! \n";
        inputMaterialLinePrice.classList.add("is-invalid");
        inputMaterialUnitQuantity.classList.add("is-invalid");
    }

    return errors;
}


const onclickMaterialFunction = (ob) => {

    if (product.productHasMaterialList) {
        let resultAvailability = product.productHasMaterialList.filter((element) => {
            return (element.material_id.name).toLowerCase().includes((ob.name).toLowerCase());
        });
        if ((resultAvailability.length == 0) || (resultAvailability == [])) {
            let listofFieldsInnerFormPhM = [inputMaterialUnitQuantity, inputMaterialUnitPrice, inputMaterialLinePrice]
            listofFieldsInnerFormPhM.forEach(element => {
                element.value = '';
                element.classList.remove('is-invalid');
                element.classList.remove('is-valid');
            });
            let listofPropertiesFormPhM = ['req_quantity', 'material_unit_price', 'material_line_price']
            listofPropertiesFormPhM.forEach(element => {
                producthasmaterial[element] = null;
            });

            producthasmaterial.material_id = ob;
            producthasmaterial.material_unit_price = parseFloat(ob.unit_cost + (ob.unit_cost * ob.profit_percentage) / 100).toFixed(2);
            document.getElementById("inputMaterialUnitQuantity").disabled = false;
            unitLabelSpan.innerHTML = ob.material_unit_type_id.symbol;
            inputMaterialNameEl.value = ob.name;
            inputMaterialNameEl.classList.remove("is-invalid");
            inputMaterialNameEl.classList.add("is-valid");
            inputMaterialUnitPrice.value = parseFloat(ob.unit_cost + (ob.unit_cost * ob.profit_percentage) / 100).toFixed(2);
            inputMaterialUnitPrice.classList.add("is-valid");
            inputMaterialUnitPrice.classList.remove("is-invalid");
        } else {
            inputMaterialNameEl.classList.add("is-invalid");
            inputMaterialNameEl.classList.remove("is-valid");
        }
    } else {
        let listofFieldsInnerFormPhM = [inputMaterialUnitQuantity, inputMaterialUnitPrice, inputMaterialLinePrice]
        listofFieldsInnerFormPhM.forEach(element => {
            element.value = '';
            element.classList.remove('is-invalid');
            element.classList.remove('is-valid');
        });
        let listofPropertiesFormPhM = ['req_quantity', 'material_unit_price', 'material_line_price']
        listofPropertiesFormPhM.forEach(element => {
            producthasmaterial[element] = null;
        });

        producthasmaterial.material_id = ob;
        producthasmaterial.material_unit_price = parseFloat(ob.unit_cost + (ob.unit_cost * ob.profit_percentage) / 100).toFixed(2);
        document.getElementById("inputMaterialUnitQuantity").disabled = false;
        unitLabelSpan.innerHTML = ob.material_unit_type_id.symbol;
        inputMaterialNameEl.value = ob.name;
        inputMaterialNameEl.classList.remove("is-invalid");
        inputMaterialNameEl.classList.add("is-valid");
        inputMaterialUnitPrice.value = parseFloat(ob.unit_cost + (ob.unit_cost * ob.profit_percentage) / 100).toFixed(2);
        inputMaterialUnitPrice.classList.add("is-valid");
        inputMaterialUnitPrice.classList.remove("is-invalid");
    }

}

document.getElementById("inputMaterialName").addEventListener('click', () => {
    if (materialList == null || materialList.length == 0) {
        noresultList = [{name:"No Result to Show"}]
        const noresultFunction = ()=> {
            resultDivMaterial.innerHTML = '';
        }
        displaySearchList(noresultList, resultDivMaterial, 'name','',noresultFunction);

        resultDivProduct.value = 'No Search Results';
        document.getElementById("inputMaterialName").disabled = true;
    } else {
        if (inputMaterialNameEl.value == '' || inputMaterialNameEl == null || producthasmaterial.module_id == null) {
            inputMaterialNameEl.classList.remove("is-invalid");
            inputMaterialNameEl.classList.remove("is-valid");
        }
        displaySearchList(materialList, resultDivMaterial, 'name', 'matno', onclickMaterialFunction);

    }
});


document.getElementById("inputMaterialName").addEventListener('keyup', () => {


    if (materialList == null || materialList.length == 0) {
        document.getElementById("inputMaterialName").disabled = true;
    } else {

        if (inputMaterialNameEl.value == null || inputMaterialNameEl.value == "") {
            document.getElementById('inputMaterialName').classList.remove("is-invalid");
            document.getElementById('inputMaterialName').classList.remove("is-valid");
            displaySearchList(materialList, resultDivMaterial, 'name', 'matno', onclickMaterialFunction);
            producthasmaterial.material_id = null;
            producthasmaterial.material_unit_price = null;
            let listofFieldsInnerFormPhM = [inputMaterialUnitQuantity, inputMaterialUnitPrice, inputMaterialLinePrice]
            listofFieldsInnerFormPhM.forEach(element => {
                element.value = '';
                element.classList.remove('is-invalid');
                element.classList.remove('is-valid');
            });
            let listofPropertiesFormPhM = ['req_quantity', 'material_unit_price', 'material_line_price']
            listofPropertiesFormPhM.forEach(element => {
                producthasmaterial[element] = null;
            });
            document.getElementById("inputMaterialUnitQuantity").disabled = true;
            unitLabelSpan.innerHTML = "Unit";

        } else {
            let searchResult = (searchFunction(materialList, inputMaterialNameEl, 'name'));
            displaySearchList(searchResult, resultDivMaterial, 'name', 'matno', onclickMaterialFunction);
            if (inputMaterialNameEl.classList.contains('is-invalid')) {
                producthasmaterial.material_id = null;
                resultDivMaterial.innerHTML = '';
            }
        }


    }
});

document.getElementById("inputMaterialUnitQuantity").addEventListener('keyup', () => {
    if (inputMaterialUnitQuantity.classList.contains('is-valid')) {
        if (producthasmaterial.material_unit_price != null) {

            document.getElementById("inputMaterialLinePrice").value = parseFloat(producthasmaterial.material_unit_price * producthasmaterial.req_quantity).toFixed(2);
            producthasmaterial.material_line_price = parseFloat(producthasmaterial.material_unit_price * producthasmaterial.req_quantity).toFixed(2);
            document.getElementById("inputMaterialLinePrice").classList.remove("is-invalid");
            document.getElementById("inputMaterialLinePrice").classList.add("is-valid");

        } else {

            document.getElementById('inputMaterialUnitPrice').classList.add("is-invalid");
            document.getElementById('inputMaterialUnitPrice').classList.remove("is-valid");

            document.getElementById("inputMaterialLinePrice").value = '';
            producthasmaterial.material_line_price = null;
            document.getElementById("inputMaterialLinePrice").classList.remove("is-invalid");
            document.getElementById("inputMaterialLinePrice").classList.remove("is-valid");

        }
    } else {
        document.getElementById("inputMaterialLinePrice").classList.remove("is-invalid");
        document.getElementById("inputMaterialLinePrice").classList.remove("is-valid");
        document.getElementById("inputMaterialLinePrice").value = '';
        producthasmaterial.material_line_price = null;
        producthasmaterial.req_quantity = null;
    }
});


//clear button for material inner form

document.getElementById("buttonClearMaterial").addEventListener('click', () => {
    clearInnerFormProductHasMaterial();
    refreshInnerForm();
});


//Add Material into product button

document.getElementById("buttonAddMaterial").addEventListener('click', () => {

    document.getElementById("productMatErrorDiv").style.display = 'none'

    let errorInnerForm = checkInnerFormErrors();
    if (errorInnerForm == '') {

        if (!product.productHasMaterialList) {
            product.productHasMaterialList = [];
            product.productHasMaterialList.push(producthasmaterial);

        } else {
            product.productHasMaterialList.push(producthasmaterial);
        }
        clearInnerFormProductHasMaterial();
        refreshInnerForm();
        refreshInnerFormTable();
        document.getElementById("tableDivInnerForm").style.display = 'block';

        generateTotalPrice();


    } else {

        alert("Material could not add to product, has following errors \n" + errorInnerForm)
    }

});

document.getElementById("inputProductServiceCharges").addEventListener("keyup", () => {


    if (product.productHasMaterialList) {
        generateTotalPrice();
    } else {
        if (document.getElementById("inputProductServiceCharges").classList.contains('is-valid')) {
            let inputValueServiceCharge = document.getElementById("inputProductServiceCharges").value;
            inputProductTotalPrice.value = parseFloat(inputValueServiceCharge).toFixed(2);
            product.total_price = parseFloat(inputValueServiceCharge).toFixed(2);
            inputProductTotalPrice.classList.add('is-valid');
            inputProductTotalPrice.classList.remove('is-invalid');
        }else{
            inputProductTotalPrice.value = '';
            inputProductTotalPrice.classList.remove('is-valid');
            inputProductTotalPrice.classList.remove('is-invalid');
        }

    }

});

const generateTotalPrice = () => {
    let product_total = 0.00;
    if (product.service_charge) {
        product_total = parseFloat(product_total) + parseFloat(product.service_charge).toFixed(2);
    }
    product.productHasMaterialList.forEach(element => {
        product_total = parseFloat(product_total) + parseFloat(element.material_line_price);
    });

    if (product_total > 0) {
        inputProductTotalPrice.value = parseFloat(product_total).toFixed(2);
        product.total_price = parseFloat(product_total).toFixed(2);
        inputProductTotalPrice.classList.add("is-valid");
        inputProductTotalPrice.classList.remove("is-invalid");
    } else {
        inputProductTotalPrice.value = '';
        product.total_price = null;
        inputProductTotalPrice.classList.remove("is-valid");
        inputProductTotalPrice.classList.add("is-invalid");
    }
}



const clearInnerFormProductHasMaterial = () => {
    let listofFieldsInnerFormPhM = [inputMaterialCategory, inputMaterialName, inputMaterialUnitQuantity, inputMaterialUnitPrice, inputMaterialLinePrice]
    listofFieldsInnerFormPhM.forEach(element => {
        element.value = '';
        element.classList.remove('is-invalid');
        element.classList.remove('is-valid');
    });
    unitLabelSpan.innerHTML = "Unit";
}

document.body.addEventListener('click', (event) => {
    // Check if the click target is not the input field or its descendant
    if (!(inputMaterialName.contains(event.target))) {
        resultDivMaterial.innerHTML = '';
        if (producthasmaterial.material_id) {
            if (document.getElementById("inputMaterialName").classList.contains('is-valid')) {
                document.getElementById("inputMaterialName").value = producthasmaterial.material_id.name;

            }
        }
    }
});
