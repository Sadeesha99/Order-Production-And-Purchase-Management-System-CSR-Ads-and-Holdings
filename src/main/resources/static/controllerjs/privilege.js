//call employee table refresh function
window.addEventListener('load', () => {

    loggedUserPriviForPrivilege = ajaxGetRequestMapping("/privilege/bymodule/Privilege")

    refreshPrivilegeTable(); // Calling Refresh function to data diplay table

    refreshPrivilegeFrom();

    if(!loggedUserPriviForPrivilege.ins_privi){
        document.getElementById("addToTableButton").style.display = 'none';
    }

});



//create function table refresh
const refreshPrivilegeTable = () => {
    privileges = ajaxGetRequestMapping("/privilege/findall");
    rolesWithPrivileges = ajaxGetRequestMapping("/role/listwithprivileges");

    //call filldataintotable function
    //(tableId,dataList)
    rolePrivilegeTableFill("tbodyValue", privileges, rolesWithPrivileges,viewPrivilege, deletePrivilege, editPrivilege , loggedUserPriviForPrivilege);

}

const refreshPrivilegeFrom = () => {

    privilege = new Object();
    privilege.sel_privi = false;
    privilege.ins_privi = false;
    privilege.upd_privi = false;
    privilege.del_privi = false;

    inputRole.disabled = false;
    inputModule.disabled = true;

    roles = ajaxGetRequestMapping("/role/listwithoutadmin");
    document.getElementById("formAddBtn").disabled = false;
    document.getElementById("formUpdateBtn").disabled = true;
    document.getElementById("formRestBtn").disabled = false;

    document.getElementById("formEditableArea").style.pointerEvents="auto";

}


const privilegeFormRefill = (ob) => {

    privilege = JSON.parse(JSON.stringify(ob));

    oldprivilege = JSON.parse(JSON.stringify(ob));

    //checking and ticking privilege module 
    if (ob.sel_privi == true) {
        Select_privi.checked = true;
    } else {
        Select_privi.checked = false;
    }
    if (ob.ins_privi == true) {
        Insert_privi.checked = true;
    } else {
        Insert_privi.checked = false;
    }
    if (ob.upd_privi == true) {
        Update_privi.checked = true;
    } else {
        Update_privi.checked = false;
    }
    if (ob.del_privi == true) {
        Delete_privi.checked = true;
    } else {
        Delete_privi.checked = false;
    }
    inputModule.value = ob.module_id.name;
    inputModule.disabled = true;
    inputRole.value = ob.role_id.name;
    inputRole.disabled = true;
    document.getElementById("addToTableButton").click();
}

//Create function for delete user record
const deletePrivilege = (delPriviob) => {
    //get user confirmation
    const userConfirm = confirm('Are you sure to delete following Privileges? \n'
        + '\n Role Name : ' + delPriviob.role_id.name
        + '\n Module Name : ' + delPriviob.module_id.name
    );
    if (userConfirm) {
        let privilegeDeleteSeverResponse = ajaxDelRequestMapping("/privilege",delPriviob);
        if (privilegeDeleteSeverResponse=='OK') {
            alert('Delete Successfully..!');
            refreshPrivilegeTable();
        }else{
            alert('Delete not completed, You have following error\n' + privilegeDeleteSeverResponse);
        }
    } else {
        alert('Delete not completed, Request was canceled.')
    }
}

//function for edit employee button
const editPrivilege = (ob) => {
    refreshPrivilegeFrom();
    privilegeFormRefill(ob);
    document.getElementById("formAddBtn").disabled = true;
    document.getElementById("formUpdateBtn").disabled = false;
    document.getElementById("formRestBtn").disabled = true;
}
//Create function for view employee record
const viewPrivilege = (ob) => {
    refreshPrivilegeFrom();
    privilegeFormRefill(ob);
    document.getElementById("formAddBtn").disabled = true;
    document.getElementById("formUpdateBtn").disabled = true;
    document.getElementById("formRestBtn").disabled = true;

    document.getElementById("formEditableArea").style.pointerEvents="none";
}
//back button in user form
const backButtonPrivilegeForm = () => {
    refreshPrivilegeFrom();
    ClearPrivilegFormButton();
    document.getElementById("formAddBtn").disabled = false;
    document.getElementById("formUpdateBtn").disabled = true;
    document.getElementById("formRestBtn").disabled = false;
}



const onclickRoleFunction = (ob) => {
    privilege.role_id = ob;
    inputRole.value = ob.name;
    document.getElementById('inputRole').classList.remove("is-invalid");
    document.getElementById('inputRole').classList.add("is-valid");
    moduleField.disabled = false;

}

const onclickModuleFunction = (ob) => {
    privilege.module_id = ob;
    inputModule.value = ob.name;
    document.getElementById('inputModule').classList.remove("is-invalid");
    document.getElementById('inputModule').classList.add("is-valid");
}

const onclickPriviSet = (fieldIDofInput, propertyNameInOB) => {
    if (fieldIDofInput.checked === true) {
        privilege[propertyNameInOB] = true;
        document.getElementById("tableInValidFeedback").style.display = 'none';
    } else {
        privilege[propertyNameInOB] = false;
    }
}

const resultModuleName = document.getElementById("divResultByModuleName");
const resultRoleName = document.getElementById("divResultByRoleName");
const roleField = document.getElementById("inputRole");
const moduleField = document.getElementById("inputModule");

roleField.addEventListener('keyup', function () {
    if (roleField.value == null || roleField.value === "") {
        document.getElementById('inputRole').classList.remove("is-invalid");
        document.getElementById('inputRole').classList.remove("is-valid");
        document.getElementById('inputModule').value='';
        privilege.role_id = null;
        privilege.module_id = null;
        moduleField.disabled = true;
    } else {
        let searchResult = (searchFunction(roles, roleField, 'name'));
        displaySearchList(searchResult, resultRoleName, 'name', '', onclickRoleFunction);
        if (roleField.classList.contains('is-invalid')) {
            privilege.role_id = null;
            moduleField.disabled = true;
        }
    }
})
moduleField.addEventListener('keyup', function () {
    if (moduleField.value == null || moduleField.value === "") {
        document.getElementById('inputModule').classList.remove("is-invalid");
        document.getElementById('inputModule').classList.remove("is-valid");
        privilege.module_id = null;
    } else {
        if ((inputRole.value != null || inputRole !== '') && privilege.role_id != null) {
            let modulesListByRole = ajaxGetRequestMapping("/modules/withoutprivileges/" + privilege.role_id.id)
            let searchResult = (searchFunction(modulesListByRole, moduleField, 'name'));
            displaySearchList(searchResult, resultModuleName, 'name', '', onclickModuleFunction);
            if (moduleField.classList.contains('is-invalid')) {
                privilege.module_id = null;
            }
        }else{
            document.getElementById('inputRole').classList.add("is-invalid"); 
        }

    }
})



//check when clicked on body somewhere which is not role name search or module name search
document.body.addEventListener('click', (event) => {
    // Check if the click target is not the input field or its descendant
    if (inputRole.contains(event.target)) {
        resultModuleName.innerHTML = '';
        displaySearchList(roles, resultRoleName, 'name', '', onclickRoleFunction);
    }
    else if (inputModule.contains(event.target)) {
        resultRoleName.innerHTML = '';
        if ((inputRole.value != null || inputRole !== '') && privilege.role_id != null) {
            let modulesListByRole = ajaxGetRequestMapping("/modules/withoutprivileges/" + privilege.role_id.id)
            displaySearchList(modulesListByRole, resultModuleName, 'name', '', onclickModuleFunction)
        }
    }
    else {
        resultModuleName.innerHTML = '';
        resultRoleName.innerHTML = '';
    }
});


let listOfFormIDs = [inputRole, inputModule];
//Clear Form Function "formUser"refreshUserForm
const ClearPrivilegFormButton = () => {
    document.getElementById("tableInValidFeedback").style.display = 'none';
    ClearFormFunction("formPrivilege", refreshPrivilegeFrom, listOfFormIDs);
}

//define function check form error
const checkFormPrivilegeError = () => {
    let errors = '';

    if (privilege.role_id == null) {
        errors = errors + "Please Enter a Role..!\n";
        inputRole.classList.add('is-invalid');
    }
    if (privilege.module_id == null) {
        inputModule.classList.add('is-invalid');
    }
    if (privilege.sel_privi == false && privilege.ins_privi == false && privilege.upd_privi == false && privilege.ins_privi == false) {
        errors = errors + "Please a valid Privilege..!";
        document.getElementById("tableInValidFeedback").style.display = 'block';
    }
    return errors;
}

const checkFormPrivilegeUpdates = () => {
    let updates = '';
    if (privilege.sel_privi != oldprivilege.sel_privi) {
        updates = updates + "View Privileges has been updated. \n"
    }
    if (privilege.ins_privi != oldprivilege.ins_privi) {
        updates = updates + "Insert Privileges has been updated. \n"
    }
    if (privilege.upd_privi != oldprivilege.upd_privi) {
        updates = updates + "Update Privileges has been updated. \n"
    }
    if (privilege.del_privi != oldprivilege.del_privi) {
        updates = updates + "Delete Privileges has been updated. \n"
    }
    return updates;
}


const updatePrivileges = () => {
    //console.log("Update");
    //Check form errors
    let errors = checkFormPrivilegeError();

    if (errors == '') {
        //Check form updates
        let updates = checkFormPrivilegeUpdates();
        if (updates != "") {
            //User Confirmation
            let userConfirmUpdates = confirm("Are you sure you want to update following changes..? \n" + updates)
            if (userConfirmUpdates) {
                //call put services
                const putServiceReponse = ajaxPutRequestMapping("/privilege",privilege);
                //Check putServices Reponsces
                if (putServiceReponse == "OK") {
                    alert("update successfully...!");
                    //refresh table
                    refreshPrivilegeTable();
                    //click button to back
                    ClearPrivilegFormButton();
                    //call form refresh function
                    refreshPrivilegeFrom();
                    //click table button
                    document.getElementById("closeModalBtn").click();

                } else {
                    alert("Failed to update changes..\n" + putServiceReponse);
                }
            }

        } else {
            alert("No changes to update..!")
        }
    } else {
        alert("Form has following errors : \n" + errors);
    }



}

//define function for submit employee
const submitPrivileges = () => {
    // console.log("Submit");
    const errors = checkFormPrivilegeError();
    if (errors == '') {
        let confirmSubmitPrivi = confirm('Are you sure to add following Privileges..? \n'
            + '\n Role Name : ' + privilege.role_id.name
            + '\n Module Name : ' + privilege.module_id.name
            + '\n View Privilegs : ' + privilege.sel_privi
            + '\n Insert Privileges : ' + privilege.ins_privi
            + '\n Update Privileges : ' + privilege.upd_privi
            + '\n Delete Privileges : ' + privilege.del_privi);
        // need to get user confirmation
        if (confirmSubmitPrivi) {
            const privilegePostServiceResponse = ajaxPostRequestMapping("/privilege",privilege);
            if (privilegePostServiceResponse == 'OK') {
                alert("Save Successefully..!")
                //refresh table
                refreshPrivilegeTable();
                //click button to back
                ClearPrivilegFormButton();
                //call form refresh function
                refreshPrivilegeFrom();
                //click table button
                document.getElementById("closeModalBtn").click();
            } else {
                alert("Saving user was not sucessful.. !\n" + " Reason : " + privilegePostServiceResponse);
            }
        } else {
            alert("Privilege entry canceled..");
        }

    } else {
        alert("Form has following Errors : \n" + errors);
        //console.log(assignedUserRoles.length);
    }
}
