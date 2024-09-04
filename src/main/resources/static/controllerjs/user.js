//call employee table refresh function
window.addEventListener('load', () => {

    loggedUserPriviForUser = ajaxGetRequestMapping("/privilege/bymodule/User");

    refreshUserTable(); // Calling Refresh function to data diplay table

    refreshUserForm();

    if(!loggedUserPriviForUser.ins_privi){
        document.getElementById("tableTabButton").click();
        document.getElementById("formTabButton").style.display = 'none';
    }

});



//create function table refresh
const refreshUserTable = () => {

    users = ajaxGetRequestMapping("/user/findall");

    //text--> String, number, date
    //function--> object, array, boolean
    const displayPropertyList = [
        { dataType: 'text', propertyName: 'userno' },
        { dataType: 'function', propertyName: getCallingName },
        { dataType: 'text', propertyName: 'username' },
        { dataType: 'function', propertyName: getAssignedRoles }, //This functions are here to check and find required data field that should be inserted into the table.
        { dataType: 'function', propertyName: getUserStatus },
    ]
    //call filldataintotable function
    //(tableId,dataList)
    fillDataIntoTable("tbodyUser", users, displayPropertyList, editUser, deleteUser, viewUser, true,loggedUserPriviForUser);
    new DataTable('#tableUser');
    document.getElementById("tableUser").style.width = "100%";

}

const refreshUserForm = () => {
    user = new Object();


    userRoles = ajaxGetRequestMapping("/role/listwithoutadmin");
    fillDataIntoSelect(inputUserRoles, 'Select User Role', userRoles, 'name');

    userAccountStatus = ajaxGetRequestMapping("/userstatus/list");
    fillDataIntoSelect(inputUserStatus, 'Select User Status', userAccountStatus, 'name');

    user.assignedroles = null;
    assignedUserRoles = [];
    document.getElementById("formUpdateBtn").disabled = true;

    document.getElementById("formEditableArea").style.pointerEvents="auto";
}

const getUserStatus = (ob) => {
    //return 'SS';
    if (ob.user_status_id.name == 'Active') {
        return '<p style="border-radius:10px" class="bg-success p-2 text-center fw-bold">' + ob.user_status_id.name + '</p>'
    }
    if (ob.user_status_id.name == 'In-Active') {
        return '<p style="border-radius:10px" class="bg-warning p-2 text-center fw-bold">' + ob.user_status_id.name + '</p>'
    }
    if (ob.user_status_id.name == 'Deleted') {
        return '<p style="border-radius:10px;" class="bg-danger p-2 text-center fw-bold">' + ob.user_status_id.name + '</p>'
    }


}

const getCallingName = (ob) => {
    return ob.employee_id.callingname;
}


const getAssignedRoles = (ob) => {
    let listOfUserRolesInTable = '<div>';
    ob.assignedroles.forEach(elementRoles => {
        listOfUserRolesInTable = listOfUserRolesInTable + '<button style="margin: 2px; cursor: auto; border-radius: 5px; background-color:#E5EBED;" readonly>' + elementRoles.name + '</button>';
    });
    listOfUserRolesInTable = listOfUserRolesInTable + '</div>';
    return listOfUserRolesInTable;
}

const userFormRefill = (ob) => {


    user = JSON.parse(JSON.stringify(ob));
    olduser = JSON.parse(JSON.stringify(ob));

    document.getElementById("formTabButton").click();
    inputUserId.value = ob.userno;
    inputUserCallingName.value = ob.employee_id.callingname;
    inputEmployeeID.value = ob.employee_id.empno;
    inputUserName.value = ob.username;
    inputUserEmail.value = ob.email;

    userAccountStatus = ajaxGetRequestMapping("/userstatus/list");
    fillDataIntoSelect(inputUserStatus, 'Select User Status', userAccountStatus, 'name', ob.user_status_id.name);

    inputUserDesicription.value = ob.username + ' description here';
    assignedUserRoles = ob.assignedroles;
    ob.assignedroles.forEach(element => {
        const newButton = document.createElement("button");
        newButton.id = element.name;
        newButton.innerText = element.name + " ";
        newButton.innerHTML = newButton.innerHTML + '<i class="fa-solid fa-xmark"></i>';
        newButton.value = element.name;
        newButton.style.margin = '2px';
        newButton.style.borderRadius = '5px';
        newButton.title = 'Click on Role to Remove'; //adding title to display on mouse hover
        newButton.addEventListener("click", function () {
            this.remove();
            ob.assignedroles = ob.assignedroles.filter(objEl =>
                objEl.name !== (this.value)
            );
            assignedUserRoles = ob.assignedroles;
            user.assignedroles = assignedUserRoles;
            if (inputUserRoles.value != 'Select User Role' && (JSON.parse(inputUserRoles.value)).name == this.value) {
                inputUserRoles.classList.remove('is-invalid');
                inputUserRoles.classList.add('is-valid');
            }
        });
        document.getElementById("buttonContainer").appendChild(newButton);
    });

}
//Create function for delete user record
const deleteUser = (delOb) => {
    if (delOb.user_status_id.name == 'Deleted') {
        alert(delOb.username + " is already deleted.");
    } else {
        //get user confirmation
        const userConfirm = confirm('Are you sure to delete following User..? \n'
            + '\n Username : ' + delOb.username
            + '\n Calling Name : ' + delOb.employee_id.callingname
            + '\n User Status : ' + delOb.user_status_id.name);
        if (userConfirm) {
            let userDeleteSeverResponse = ajaxDelRequestMapping("/user",delOb);
            if (userDeleteSeverResponse=='OK') {
                alert('Delete Successfully..!');
                refreshUserTable();
            }else{
                alert('Delete not completed, You have following error\n' + userDeleteSeverResponse);
            }
        } else {
            alert("Delete request was canceled");
            refreshUserTable();
        }
    }
}
//function for edit employee button
const editUser = (ob) => {
    refreshUserForm();
    editButtonFunction(userFormRefill, ob, "tableTabButton", "formAddBtn", "formUpdateBtn", "formRestBtn",ClearUserFormButtonFunction);
}
//Create function for view employee record
const viewUser = (ob) => {
    refreshUserForm();
    viewButtonFunction(userFormRefill, ob, "tableTabButton", "formAddBtn", "formUpdateBtn", "formRestBtn",ClearUserFormButtonFunction);
    document.getElementById("formEditableArea").style.pointerEvents="none";
}
//back button in user form
const userFormBackButon = () => {
    refreshUserForm();
    inputUserCallingName.readOnly = false;
    inputEmployeeID.readOnly = false;
    backButtonFunctionForm("tableTabButton", "formAddBtn", "formUpdateBtn", "formRestBtn",ClearUserFormButtonFunction);
}



//Check Form Updates
const checkUserUpdate = () => {
    let updates = '';
    if (user.employee_id.id != olduser.employee_id.id) {
        updates = updates + ("User employee is changed from " + olduser.user_status_id.fullname + " to " + user.user_status_id.fullname + ".\n");
    }
    if (user.password != olduser.password) {
        updates = updates + ("User password has changed.\n");
    }
    let listOfField = ['username', 'email'];
    listOfField.forEach(
        (field) => {
            if (user[field] != olduser[field]) {
                updates = updates + ("Record of " + field + " is changed from '" + olduser[field] + "' into '" + user[field] + "'.\n");
            }
        }
    );
    if (JSON.stringify(user.assignedroles) != JSON.stringify(olduser.assignedroles)) {
        updates = updates + ("User roles has changes.\n");
    }
    if (user.user_status_id.name != olduser.user_status_id.name) {
        updates = updates + ("User Status is changed from " + olduser.user_status_id.name + " to " + user.user_status_id.name + ".\n");
    }

    return updates;
}



//define function check form error
const checkFormError = () => {
    let errors = '';

    if (user.employee_id == null) {
        errors = errors + "Please Enter a Employee..!\n";
        inputUserCallingName.classList.add('is-invalid');
        inputEmployeeID.classList.add('is-invalid');
    }
    if (user.username == null) {
        inputUserName.classList.add('is-invalid');
    }
    if (user.password == null) {
        errors = errors + "Please Enter Password..! \n";
        inputEnterPassword.classList.add('is-invalid');
        inputReEnterPassword.classList.add('is-invalid');

    }
    if (user.email == null) {
        inputUserEmail.classList.add('is-invalid');
    }
    if (user.assignedroles == null || user.assignedroles.length < 1) {
        errors = errors + "Please assign user roles..! \n";
        inputUserRoles.classList.add('is-invalid');
    }
    if (user.user_status_id == null) {
        errors = errors + "Select User Status..! \n";
        inputUserStatus.classList.add('is-invalid');
    }
    return errors;
}

const buttonUserUpdate = () => {
    //console.log("Update");
    //Check form errors
    let errors = checkFormError();

    if (errors == '') {
        //Check form updates
        let updates = checkUserUpdate();
        if (updates != "") {
            //User Confirmation
            let userConfirmUpdates = confirm("Are you sure you want to update following changes..? \n" + updates)
            if (userConfirmUpdates) {
                if(user.password == olduser.password){
                    user.password=null;
                }
                //call put services
                const putServiceReponse = ajaxPutRequestMapping("/user", user)
                //Check putServices Reponsces
                if (putServiceReponse == "OK") {
                    alert("Updated successfully...!");
                    refreshUserTable();
                    //click button to back
                    document.getElementById("backButtonUserForm").click();
                    ClearUserFormButtonFunction();
                    refreshUserForm();

                } else {
                    alert("Failed to update changers..\n" + putServiceReponse);
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
const submitUser = () => {
    // console.log("Submit");
    const errors = checkFormError();
    if (errors == '') {
        let confirmSubmitUser = confirm('Are you sure to add following employee as user..? \n'
            + '\n User Calling Name : ' + user.employee_id.callingname
            + '\n User Employee ID : ' + user.employee_id.empno
            + '\n Account User Name : ' + user.username
            + '\n User Email : ' + user.email
            + '\n User Status : ' + user.user_status_id.name);
        // need to get user confirmation
        if (confirmSubmitUser) {
            //console.log(user);
            const userPostServiceResponse = ajaxPostRequestMapping("/user", user);
            if (userPostServiceResponse == 'OK') {
                alert("Save Successefully..!")
                //refresh table
                refreshUserTable();
                //click button to back
                ClearUserFormButtonFunction();
                //call form refresh function
                refreshUserForm();
                //click table button
                document.getElementById("tableTabButton").click();
            } else {
                alert("Saving user was not sucessful.. !\n" + " Reason : " + userPostServiceResponse);
            }
        } else {
            alert("User entry canceled..");
        }

    } else {
        alert("Form has following Errors : \n" + errors);
        //console.log(assignedUserRoles.length);
    }
}


let listOfFormIDs = [inputUserCallingName, inputEmployeeID, inputUserName, inputUserEmail, inputEnterPassword, inputReEnterPassword, inputUserRoles, inputUserStatus, inputUserDesicription];
//Clear Form Function "formUser"refreshUserForm
const ClearUserFormButtonFunction = () => {
    refreshUserTable();
    document.getElementById("divResultByEmployeeId").innerHTML = "";
    document.getElementById("divResultByCallingName").innerHTML= "";
    buttonContainer.innerHTML = "";
    ClearFormFunction("formUser", refreshUserForm, listOfFormIDs);
}

//Add UserRole Values to text area
const addSelectedValue = () => {
    // Get the selected value from the dropdown
    const selectedItemString = document.getElementById("inputUserRoles").value;
    if (selectedItemString == 'Select User Role') {
        inputUserRoles.classList.add('is-invalid');
    } else {
        // Parse the JSON string to an object
        const selectedItem = JSON.parse(selectedItemString);
        inputUserRoles.classList.remove('is-valid');

        //checking if the value in selected Item already in 
        const isFound = assignedUserRoles.some(element => {
            if (element.name === selectedItem.name) {
                return true;
            } else {
                return false;
            }
        });

        if (!isFound) {
            //Adding the object to the assignedUserRoles Array list
            assignedUserRoles.push(selectedItem);
            user.assignedroles = assignedUserRoles;
            // Create a new button into variable
            const newButton = document.createElement("button");
            newButton.innerText = selectedItem.name + " ";
            newButton.innerHTML = newButton.innerHTML + '<i class="fa-solid fa-xmark"></i>';
            newButton.value = selectedItem.name;
            newButton.style.margin = '2px';
            newButton.style.borderRadius = '5px';
            newButton.title = 'Click on Role to Remove'; //adding title to display on mouse hover
            newButton.id = selectedItem.name;
            newButton.addEventListener("click", function () {
                this.remove();
                assignedUserRoles = assignedUserRoles.filter(objEl =>
                    objEl.name !== (this.value)
                );
                inputUserRoles.classList.remove('is-invalid');
                //console.log(assignedUserRoles);
                user.assignedroles = assignedUserRoles;

            });
            // Append the new button to the container
            document.getElementById("buttonContainer").appendChild(newButton);

        } else {
            inputUserRoles.classList.add('is-invalid');
        }
    }
}


//Event listner to run on chage of roles select list
inputUserRoles.addEventListener("change", function () {
    onChangeRoleSelect();
});

const onChangeRoleSelect = () => {
    //disabling firstElement 'Select a roll option'
    inputUserRoles.firstElementChild.disabled = true;
    //taking value of the selected role that set as a ob converted into string
    const selectedItemString = document.getElementById("inputUserRoles").value;
    //changing it back to an object
    const selectedListItem = JSON.parse(selectedItemString);
    //console.log(selectedItem)
    //searching that is selected object avalable in assignedRoles array as existing value.
    const isFounded = assignedUserRoles.some(element => {
        if (element.name === selectedListItem.name) {
            //returns true if it founded
            return true;
        }//returns false if it not founded
        return false;
    });
    //checking the isFounded or not
    if (isFounded) {
        //changing the classList to appear as invalid
        inputUserRoles.classList.remove('is-valid');
        inputUserRoles.classList.add('is-invalid');
    } else {
        //Chaning the classList to appear as valid
        inputUserRoles.classList.add('is-valid');
        inputUserRoles.classList.remove('is-invalid');
    }
}


let employeesWithoutUserAccount = ajaxGetRequestMapping("/employee/nouseraccount")

const resultByCallingName = document.querySelector("#divResultByCallingName");
const searchByCallingName = document.getElementById("inputUserCallingName");
const searchByEmployeeID = document.getElementById("inputEmployeeID");
const resultByEmployeeId = document.querySelector("#divResultByEmployeeId");
const inputUserEmailField = document.getElementById("inputUserEmail");
const inputUserNameField = document.getElementById("inputUserName");

searchByCallingName.onkeyup = function () {
    if (searchByCallingName.value == null || searchByCallingName.value == "") {
        searchByEmployeeID.readOnly = false;
        user.employee_id = null;
        user.username = null;
        user.email = null;
        const listOfFieldsToRest = [inputUserCallingName, inputEmployeeID, inputUserName, inputUserEmail]
        listOfFieldsToRest.forEach(elementField => {
            elementField.value = null;
            elementField.classList.remove('is-valid');
            elementField.classList.remove('is-invalid');
        });
        resultByCallingName.innerHTML = '';

    } else {
        let searchResult = (searchFunction(employeesWithoutUserAccount, searchByCallingName, 'callingname'));
        const autofillByCallingName = (ob) => {
            searchByCallingName.value = ob.callingname;
            resultByCallingName.innerHTML = '';
            resultByEmployeeId.innerHTML = '';
            searchByCallingName.classList.add('is-valid');
            searchByCallingName.classList.remove('is-invalid');
            searchByEmployeeID.value = ob.empno;
            user.employee_id = ob;
            searchByEmployeeID.classList.add('is-valid');
            searchByEmployeeID.classList.remove('is-invalid');
            user.email = ob.email;
            inputUserEmailField.value = user.email;
            inputUserEmailField.classList.add('is-valid');
            inputUserEmailField.classList.remove('is-invalid');
            user.username = (ob.callingname + (ob.empno).substring(3));
            inputUserNameField.value = user.username;
            inputUserNameField.classList.add('is-valid');
            inputUserNameField.classList.remove('is-invalid');
            searchByEmployeeID.readOnly = true;
        }
        resultByEmployeeId.innerHTML = '';
        inputEmployeeID.value = '';
        inputEmployeeID.classList.remove('is-valid');
        inputEmployeeID.classList.remove('is-invalid');
        displaySearchList(searchResult, resultByCallingName, 'callingname', 'empno', autofillByCallingName);

    }

};

searchByEmployeeID.onkeyup = function () {
    if (searchByEmployeeID.value == null || searchByEmployeeID.value == "") {
        searchByCallingName.readOnly = false;
        user.employee_id = null;
        user.username = null;
        user.email = null;
        const listOfFieldsToRest = [inputUserCallingName, inputEmployeeID, inputUserName, inputUserEmail]
        listOfFieldsToRest.forEach(elementField => {
            elementField.value = null;
            elementField.classList.remove('is-valid');
            elementField.classList.remove('is-invalid');
        });
        resultByEmployeeId.innerHTML = '';
    } else {
        let searchResult = (searchFunction(employeesWithoutUserAccount, searchByEmployeeID, 'empno'));
        const autofillByEmpNo = (ob) => {
            searchByEmployeeID.value = ob.empno;
            resultByCallingName.innerHTML = '';
            resultByEmployeeId.innerHTML = '';
            searchByEmployeeID.classList.add('is-valid');
            searchByEmployeeID.classList.remove('is-invalid');
            searchByCallingName.value = ob.callingname;
            user.employee_id = ob;
            searchByCallingName.classList.add('is-valid');
            searchByCallingName.classList.remove('is-invalid');
            user.email = ob.email;
            inputUserEmailField.value = user.email;
            inputUserEmailField.classList.add('is-valid');
            inputUserEmailField.classList.remove('is-invalid');
            user.username = (ob.callingname + (ob.empno).substring(3));
            inputUserNameField.value = user.username;
            inputUserNameField.classList.add('is-valid');
            inputUserNameField.classList.remove('is-invalid');
            searchByCallingName.readOnly = true;
        }
        resultByCallingName.innerHTML = '';
        inputUserCallingName.value = '';
        inputUserCallingName.classList.remove('is-valid');
        inputUserCallingName.classList.remove('is-invalid');
        displaySearchList(searchResult, resultByEmployeeId, 'empno', 'callingname', autofillByEmpNo);

    }
};

const textPassword = (fieldID) => {
    const passwordReg = new RegExp('^[A-Za-z0-9@#!$%^&*]{8,}$');
    if (fieldID.value != '') {
        if (passwordReg.test(fieldID.value)) {
            fieldID.classList.add('is-valid');
            fieldID.classList.remove('is-invalid');

            //generate calling Name options
        } else {
            fieldID.classList.remove('is-valid');
            fieldID.classList.add('is-invalid');
        }
    } else {
        fieldID.classList.remove('is-valid');
        fieldID.classList.remove('is-invalid');
    }

}

//onkey up checking password is valid and then checking retype password is same as first password input
inputReEnterPassword.addEventListener('keyup', function () {
    if ((inputEnterPassword.value != '') && (inputEnterPassword.classList.contains('is-valid'))) {
        if (inputEnterPassword.value === inputReEnterPassword.value) {
            inputReEnterPassword.classList.add('is-valid');
            inputReEnterPassword.classList.remove('is-invalid');
            user.password = inputReEnterPassword.value;
        }
        else if (inputReEnterPassword.value == '') {
            inputReEnterPassword.classList.remove('is-valid');
            inputReEnterPassword.classList.remove('is-invalid');
            user.password = null;
        } else {
            inputReEnterPassword.classList.remove('is-valid');
            inputReEnterPassword.classList.add('is-invalid')
            user.password = null;
        }
    } else {
        inputReEnterPassword.classList.remove('is-valid');
        inputReEnterPassword.classList.add('is-invalid')
        user.password = null;
    }
});



//See password buttons appear when clicked input text field
document.body.addEventListener('click', function (event) {
    // Check if the click target is not the input field or its descendant
    if (inputEnterPassword.contains(event.target)) {
        showReEnterPassword.style.display = 'none';
        showEnterPassword.style.display = 'Block';
        inputReEnterPassword.type = 'password';
        //console.log('Clicked inside the input field - EnterPassword');
    }
    else if (inputReEnterPassword.contains(event.target)) {
        showReEnterPassword.style.display = 'Block';
        showEnterPassword.style.display = 'none';
        inputEnterPassword.type = 'password';
        //console.log('Clicked inside the input field - Re EnterPassword');
    }
    else {
        setTimeout(function () {
            let showEP = document.getElementById('inputEnterPassword');
            let showREP = document.getElementById('inputReEnterPassword');
            if (document.activeElement == showEP) {
                showEnterPassword.style.display = 'Block';
            } else if (document.activeElement == showREP) {
                showReEnterPassword.style.display = 'Block';
            } else {
                showReEnterPassword.style.display = 'none';
                showEnterPassword.style.display = 'none';
                inputEnterPassword.type = 'password';
                inputReEnterPassword.type = 'password';
            }
        }, 10);
        //console.log('Clicked Outside the input field');
    }
});