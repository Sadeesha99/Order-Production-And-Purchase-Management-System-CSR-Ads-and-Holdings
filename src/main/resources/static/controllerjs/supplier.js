//call material table refresh function
window.addEventListener('load', () => {

    logedeUSerPRIVIForSupplier = {
        id: null,
        sel_privi: true,
        ins_privi: true,
        upd_privi: true,
        del_privi: true,
        role_id: null,
        module_id: null
    }


    refreshSupplierTable();
    // Calling Refresh function to data diplay table
    refreshSupplierForm();




    if (!logedeUSerPRIVIForSupplier.ins_privi) {
        document.getElementById("tableTabButton").click();
        document.getElementById("formTabButton").style.display = 'none';
    }


});



//create function table refresh
const refreshSupplierTable = () => {

    supplierList = ajaxGetRequestMapping("/supplier/findall")

    const displayPropertyListSupplierTable = [
        { dataType: 'text', propertyName: 'supplierno' },
        { dataType: 'text', propertyName: 'businessname' },
        { dataType: 'function', propertyName: getSupplierStatus },
        { dataType: 'text', propertyName: 'businesstelephone' },
        { dataType: 'function', propertyName: getContactPersonName },
        { dataType: 'function', propertyName: getContactPersonMobile }

    ]

    fillDataIntoTable("tbodySupplier", supplierList, displayPropertyListSupplierTable, editSupplier, deleteSupplier, viewSupplier, true, logedeUSerPRIVIForSupplier);
    new DataTable('#tableSupplier');
    document.getElementById("tableSupplier").style.width = "100%";

}


const getSupplierStatus = (ob) => {
    if (ob.supplier_status_id.name == 'Active') {
        return '<p style="border-radius:10px" class="bg-success p-2 text-center fw-bold">' + ob.supplier_status_id.name + '</p>'
    }
    if (ob.supplier_status_id.name == 'In-Active') {
        return '<p style="border-radius:10px" class="bg-warning p-2 text-center fw-bold">' + ob.supplier_status_id.name + '</p>'
    }
    if (ob.supplier_status_id.name == 'Deleted') {
        return '<p style="border-radius:10px;" class="bg-danger p-2 text-center fw-bold">' + ob.supplier_status_id.name + '</p>'
    }
}

const getContactPersonName = (ob) => {
    if (ob.contact_person_name != null) {
        return ("<p class='text-center'>" + ob.contact_person_name + "</p>");
    } else {
        return ' - ';
    }
}
const getContactPersonMobile = (ob) => {
    if (ob.contact_person_mobile != null) {
        return ("<p class='text-center'>" + ob.contact_person_mobile + "</p>")
    } else {
        return ' - ';
    }
}


const refreshSupplierForm = () => {

    supplier = new Object();
    const matLowStock = ajaxGetRequestMapping("/material/lowstock");
    const matInStock = ajaxGetRequestMapping("/material/instock");
    const matOutStock = ajaxGetRequestMapping("/material/outstock");

    materialList = matLowStock.concat(matInStock,matOutStock);

    fillDataIntoSelect(inputMaterials, 'Select Material to add', materialList, 'name');

    supplierStatusList = ajaxGetRequestMapping("/supplier/status/findall");
    fillDataIntoSelect(inputSupplierStatus, 'Select Supplier Status', supplierStatusList, 'name');

    supplier.assignedMaterialList = [];

    document.getElementById("formUpdateBtn").disabled = true;
    document.getElementById("formEditable").style.pointerEvents="auto";
    document.getElementById("backButtonDivForm").style.display = 'none';

}


const deleteSupplier = (ob) => {
    //get user confirmation
    const deleteSupplierConfirm = confirm('Are you sure to delete following Supplier..? \n'
        + '\n Supplier Name : ' + ob.businessname
        + '\n Supplier Status : ' + ob.supplier_status_id.name);
    if (deleteSupplierConfirm) {
        const supplierDelServiceResponse = ajaxDelRequestMapping("/supplier", ob);
        if (supplierDelServiceResponse == 'OK') {
            alert('Delete Successfully..!');
            //refresh table
            refreshSupplierTable();
        } else {
            alert("Updating Supplier was not sucessful.. !\n" + supplierDelServiceResponse);
        }
    } else {
        alert('Delete not completed, Request was canceled..!');
    }
}
//Create function for view product record
const viewSupplier = (ob) => {
    refreshSupplierForm();
    viewButtonFunction(refillSupplierForm, ob, "tableTabButton", "formAddBtn", "formUpdateBtn", "formRestBtn", ClearSupplierButtonFunction);
    document.getElementById("backButtonDivForm").style.display = 'block';
    document.getElementById("formEditable").style.pointerEvents= 'none';

}

const editSupplier = (ob) => {
    refreshSupplierForm();
    editButtonFunction(refillSupplierForm, ob, "tableTabButton", "formAddBtn", "formUpdateBtn", "formRestBtn", ClearSupplierButtonFunction);
    document.getElementById("backButtonDivForm").style.display = 'block';
}

const backButtonSupplierForm = () => {
    refreshSupplierForm();
    refreshSupplierTable();
    backButtonFunctionForm("tableTabButton", "formAddBtn", "formUpdateBtn", "formRestBtn", ClearSupplierButtonFunction);
    document.getElementById("backButtonDivForm").style.display = 'none';
}

const checkFormSupplierUpdates = () => {
    let updates = '';
    //list of customer form fields
    let propertiesOfSupplierOb = ['supplierno', 'businessname', 'businessemail', 'businesstelephone', 'businessaddress', 'contact_person_name', 'email','description','contact_person_mobile','secondarycontactno','description'];
    propertiesOfSupplierOb.forEach(propertyEl => {
        if (supplier[propertyEl] != oldsupplier[propertyEl]) {
            updates = updates + ( "Record of " +propertyEl + " is changed from '" + oldsupplier[propertyEl] + "' into '" + supplier[propertyEl] + "'.\n");
        }
    });
    if (supplier.supplier_status_id.id != oldsupplier.supplier_status_id.id) {
        updates = updates + "Supplier status has been updated to "+ supplier.supplier_status_id.name+".\n";
    }
    if (supplier.assignedMaterialList.length != oldsupplier.assignedMaterialList.length) {
        updates = updates + "Supplier materials has been updated.\n";
    }else{
        for (let i = 0; i < supplier.assignedMaterialList.length; i++) {
            if(supplier.assignedMaterialList[i].id!=supplier.assignedMaterialList[i].id){
                updates = updates + "Supplier materials has been updated.\n";
                break;
            }
          }
    }
    return updates;
}

const checkSupplierFormError = () => {
    let error = '';
    if (supplier.businessname == null) {
        error = error + "Enter Valid Business Name..!\n";
        inputBusinessName.classList.add("is-invalid");
    }
    if (supplier.businessemail == null) {
        error = error + "Enter Valid Business Email..!\n";
        inputBusinessEmail.classList.add("is-invalid");
    }
    if (supplier.businessaddress == null) {
        error = error + "Enter Valid Business Address..!\n";
        inputBusinessAddress.classList.add("is-invalid");
    }
    if (supplier.businesstelephone == null) {
        error = error + "Enter Valid Business Telephone..!\n";
        inputBusinessTelephone.classList.add("is-invalid");
    }
    if (supplier.supplier_status_id == null) {
        error = error + "Select Valid Supplier Status..!\n";
        inputSupplierStatus.classList.add("is-invalid");
    }
    if (supplier.assignedMaterialList.length == 0) {
        error = error + "Select Must have material..!\n";
        inputMaterials.classList.add("is-invalid");
    }
    return error;
}

const updateSupplier = () => {
    const errors = checkSupplierFormError();
    if (errors == '') {

        const updates = checkFormSupplierUpdates();

        if (updates != ""){
            let confirmCutomerUpdate = confirm("Are you sure you want to update following changes..? \n" + updates)
            // need to get user confirmation
            if (confirmCutomerUpdate) {
                const supplierPutServiceResponse = ajaxPutRequestMapping("/supplier",supplier);
                if (supplierPutServiceResponse == 'OK') {
                    alert("Save Successefully..!")
                    //refresh table
                    refreshSupplierTable();
                    //click button to back
                    ClearSupplierButtonFunction();
                    //call form refresh function
                    refreshSupplierForm();
                    //back button function button
                    backButtonSupplierForm();
                } else {
                    alert("Updating Supplier was not sucessful.. !\n"+ supplierPutServiceResponse);
                }
            } else {
                alert("Supplier entry canceled..");
            }

        }else {
            alert("No changes to update..!")
        }

    } else {
        alert("Form has following errors : \n" + errors)
    }
}


const submitSupplier = () => {

    const errors = checkSupplierFormError();

    if (errors == '') {
        let confirmSupplierSubmit = confirm('Are you sure to add following product..?'
            + '\n Business Name : ' + supplier.businessname
            + '\n Business Telephone : ' + supplier.businesstelephone
            + '\n Business Address : ' + supplier.businessaddress
            + '\n Business email : ' + supplier.businessemail
            + '\n Supplier Status : ' + supplier.supplier_status_id.name);
        // need to get user confirmation
        if (confirmSupplierSubmit) {
            //console.log(product);
            const supplierPostServiceResponse = ajaxPostRequestMapping("/supplier", supplier);
            if (supplierPostServiceResponse == 'OK') {
                alert("Save Successefully..!")
                //refresh table
                refreshSupplierTable();
                //click button to back
                ClearSupplierButtonFunction();
                //call form refresh function
                refreshSupplierForm();
                //back button function button
                backButtonSupplierForm();
            } else {
                alert("Submiting New Supplier was not sucessful.. !\n"+ supplierPostServiceResponse);
            }
        } else {
            alert("Supplier entry canceled..");
        }

    } else {
        alert("Form has following errors : \n" + errors)
    }
}


const refillSupplierForm = (ob) => {

    supplier = JSON.parse(JSON.stringify(ob));
    oldsupplier = JSON.parse(JSON.stringify(ob));

    document.getElementById("inputSupplierNo").value = ob.supplierno;
    document.getElementById("inputBusinessName").value = ob.businessname;
    document.getElementById("inputBusinessEmail").value = ob.businessemail;
    document.getElementById("inputBusinessTelephone").value = ob.businesstelephone;
    document.getElementById("inputBusinessAddress").value = ob.businessaddress;
    document.getElementById("inputContactPersonName").value = ob.contact_person_name;
    document.getElementById("inputContactPersonMobile").value = ob.contact_person_mobile;
    document.getElementById("inputSecondaryContact").value = ob.secondarycontactno;
    document.getElementById("inputSupplierDesicription").value = ob.description;
    fillDataIntoSelect(inputSupplierStatus, 'Select Supplier Status', supplierStatusList, 'name', ob.supplier_status_id.name);
    ob.assignedMaterialList.forEach(element => {
        const newButton = document.createElement("button");
        newButton.innerText = element.name + " ";
        newButton.innerHTML = newButton.innerHTML + '<i class="fa-solid fa-xmark"></i>';
        newButton.value = element.matno;
        newButton.style.margin = '2px';
        newButton.style.borderRadius = '5px';
        newButton.title = 'Click To Remove Material'; //adding title to display on mouse hover
        newButton.id = element.name;
        newButton.addEventListener("click", function () {
            this.remove();
            supplier.assignedMaterialList = supplier.assignedMaterialList.filter(objEl =>
                objEl.matno !== (this.value)
            );
            fillDataIntoSelect(inputMaterials, 'Select Material to add', materialList, 'name');
            document.getElementById("inputMaterials").classList.remove('is-invalid', 'is-valid');
            //console.log(supplier.assignedMaterialList);

        });
        document.getElementById("buttonContainer").appendChild(newButton);
    });

    document.getElementById("formTabButton").click();


}

let listOfFormIDs = [inputSupplierNo, inputBusinessName, inputBusinessEmail, inputBusinessTelephone, inputBusinessAddress, inputContactPersonName, inputContactPersonMobile, inputSecondaryContact, inputSupplierStatus, inputMaterials, inputSupplierDesicription];
const ClearSupplierButtonFunction = () => {
    document.getElementById("buttonContainer").innerHTML = '';
    ClearFormFunction("formSupplier", refreshSupplierForm, listOfFormIDs);
}



document.getElementById("addMaterialBtn").addEventListener('click', () => {
    addSelectedValue();
});


//Add new material
const addSelectedValue = () => {
    // Get the selected value from the dropdown
    const selectedItemString = document.getElementById("inputMaterials").value;
    if (selectedItemString == 'Select Material to add') {
        inputMaterials.classList.add('is-invalid');
    } else {
        // Parse the JSON string to an object
        const selectedItem = JSON.parse(selectedItemString);
        inputMaterials.classList.remove('is-valid');

        //checking if the value in selected Item already in 
        const isFound = supplier.assignedMaterialList.some(element => {
            if (element.id === selectedItem.id) {
                return true;
            } else {
                return false;
            }
        });

        if (!isFound) {
            //Adding the object to the assignedUserRoles Array list
            supplier.assignedMaterialList.push(selectedItem);
            fillDataIntoSelect(inputMaterials, 'Select Material to add', materialList, 'name');
            // Create a new button into variable
            const newButton = document.createElement("button");
            newButton.innerText = selectedItem.name + " ";
            newButton.innerHTML = newButton.innerHTML + '<i class="fa-solid fa-xmark"></i>';
            newButton.value = selectedItem.matno;
            newButton.style.margin = '2px';
            newButton.style.borderRadius = '5px';
            newButton.title = 'Click To Remove Material'; //adding title to display on mouse hover
            newButton.id = selectedItem.name;
            newButton.addEventListener("click", function () {
                this.remove();
                supplier.assignedMaterialList = supplier.assignedMaterialList.filter(objEl =>
                    objEl.matno !== (this.value)
                );
                fillDataIntoSelect(inputMaterials, 'Select Material to add', materialList, 'name');
                document.getElementById("inputMaterials").classList.remove('is-invalid', 'is-valid');
                //console.log(supplier.assignedMaterialList);

            });
            // Append the new button to the container
            document.getElementById("buttonContainer").appendChild(newButton);
            //console.log(supplier.assignedMaterialList);

        } else {
            inputMaterials.classList.add('is-invalid');
        }
    }
}

document.getElementById("inputMaterials").addEventListener("change", () => {
    onChangeMaterialSelect();
});

const onChangeMaterialSelect = () => {
    // //disabling firstElement 'Select a roll option'
    // inputMaterials.firstElementChild.disabled = true;
    //taking value of the selected role that set as a ob converted into string
    const selectedItemString = document.getElementById("inputMaterials").value;
    //changing it back to an object
    const selectedItem = JSON.parse(selectedItemString);
    //searching that is selected object avalable in assignedRoles array as existing value.
    const isFounded = supplier.assignedMaterialList.some(element => {
        if (element.id === selectedItem.id) {
            //returns true if it founded
            return true;
        }//returns false if it not founded
        return false;
    });
    //checking the isFounded or not
    if (isFounded) {
        //changing the classList to appear as invalid
        inputMaterials.classList.remove('is-valid');
        inputMaterials.classList.add('is-invalid');
    } else {
        //Chaning the classList to appear as valid
        inputMaterials.classList.add('is-valid');
        inputMaterials.classList.remove('is-invalid');
    }
}

