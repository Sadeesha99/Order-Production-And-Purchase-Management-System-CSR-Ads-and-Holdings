//call employee table refresh function
window.addEventListener('load', () => {

    loggedUserPriviForEmployee = ajaxGetRequestMapping("/privilege/bymodule/Employee");


    refreshEmployeeTable(); // Calling Refresh function to data diplay table

    refreshEmployeeForm();

    if(!loggedUserPriviForEmployee.ins_privi){
        document.getElementById("tableTabButton").click();
        document.getElementById("formTabButton").style.display = 'none';
    }
});




//create function table refresh
const refreshEmployeeTable = () => {

    const empWorking = ajaxGetRequestMapping("/employee/working");
    const empResigned = ajaxGetRequestMapping("/employee/resign");
    const empDeleted = ajaxGetRequestMapping("/employee/deleted");

    employees = empWorking.concat(empResigned,empDeleted);

    //text--> String, number, date
    //function--> object, array, boolean
    const displayPropertyList = [
        { dataType: 'text', propertyName: 'empno' },
        { dataType: 'text', propertyName: 'fullname' },
        { dataType: 'text', propertyName: 'nic' },
        { dataType: 'function', propertyName: getHasUserAccount }, //This functions are here to check and find required data field that should be inserted into the table. 
        { dataType: 'text', propertyName: 'mobile' },
        { dataType: 'function', propertyName: getDesignation },
        { dataType: 'function', propertyName: getEmployeeStatus },
    ]
    //call filldataintotable function
    //(tableId,dataList)
    fillDataIntoTable("tbodyEmlpoyee", employees, displayPropertyList, editEmployeeButton, deleteEmployee, viewEmployee, true,loggedUserPriviForEmployee);
    //new DataTable('#tableEmployee');;
    new DataTable('#tableEmployee');
    document.getElementById("tableEmployee").style.width = "100%";
}

const getEmployeeStatus = (ob) => {
    //return 'SS';
    if (ob.employee_status_id.name == 'Working') {
        return '<p style="border-radius:10px" class="WorkingStyle bg-success p-2 text-white text-center fw-bold">' + ob.employee_status_id.name + '</p>'
    }
    if (ob.employee_status_id.name == 'Resigned') {
        return '<p style="border-radius:10px" class="ResignStyle bg-warning p-2 text-white text-center fw-bold">' + ob.employee_status_id.name + '</p>'
    }
    if (ob.employee_status_id.name == 'Deleted') {
        return '<p style="border-radius:10px;" class="DeleteStyle bg-danger p-2 text-white text-center fw-bold">' + ob.employee_status_id.name + '</p>'
    }
}
const getDesignation = (ob) => {
    return ob.designation_id.name;
}
const getHasUserAccount = (ob) => {
    if (ob.hasuseraccount) {
        //return 'Has User Account
        return '<i class="fa-solid fa-user-check fa-2x text-success"></i>';
    } else {
        //return 'Has No User Account'
        return '<i class="fa-solid fa-user-xmark  fa-2x text-danger"></i>';
    }
}

const refreshEmployeeForm = () => {
    employee = new Object();

    designations = ajaxGetRequestMapping("/designation/list");

    fillDataIntoSelect(inputDesignation, 'Select Designation..!', designations, 'name');

    employeeStatus = ajaxGetRequestMapping("/employeestatus/list");

    fillDataIntoSelect(inputEmployeeStatus, 'Select Employee Status', employeeStatus, 'name');

    document.getElementById("formUpdateBtn").disabled = true;

    document.getElementById("formEditableArea").style.pointerEvents="auto";
}

//Create function for refill employee form
const employeeFormRefill = (ob) => {
    employee = JSON.parse(JSON.stringify(ob));
    oldemployee = JSON.parse(JSON.stringify(ob));

    inputEmployeeId.value = ob.empno;
    inputFullName.value = ob.fullname;
    inputCallingName.value = ob.callingname;
    inputNIC.value = ob.nic;
    if(ob.gender== "Male"){
        radioGenderMale.checked = true;
    }else if(ob.gender=="Female"){
        radioGenderFemale.checked = true;
    }
    inputDOB.value = ob.dob;
    inputMobileNo.value = ob.mobile;
    if (ob.landno != null) {
        inputLandNo.value = ob.landno;
    }
    inputEmail.value = ob.email;
    inputAddress.value = ob.address;
    if (ob.note != null) {
        inputNote.value = ob.note;
    }
    inputStartDate.value = ob.servicestartdate;
    inputCivilStatus.value = ob.civilstatus;
    inputBasicSalary.value = ob.basicsalary;
    inputEmployeeCategory.value = ob.employeecategory;

    designations = ajaxGetRequestMapping("/designation/list");
    fillDataIntoSelect(inputDesignation, 'Select Designation..!', designations, 'name', ob.designation_id.name);

    employeeStatus = ajaxGetRequestMapping("/employeestatus/list");
    fillDataIntoSelect(inputEmployeeStatus, 'Select Employee Status', employeeStatus, 'name', ob.employee_status_id.name);
}


//Create function for delete employee record
const deleteEmployee = (ob) => {
    //check is that object already deleted
    if(ob.employee_status_id.name=='Deleted'){
        alert(ob.fullname+" is already deleted");
    }else{
        //get user confirmation for the deletion
        const userConfirm = confirm('Are you sure to delete following employee..? \n'
        + '\n Full Name is : ' + ob.fullname
        + '\n Employee Status is : ' + ob.employee_status_id.name
        + '\n NIC : ' + ob.nic);
    if (userConfirm) {
        const deleteSeverResponse = ajaxDelRequestMapping("/employee",ob)
        if (deleteSeverResponse == 'OK') {
            alert('Delete Successfully..!');
            refreshEmployeeTable();
        } else {
            alert('Delete not completed, You have following error\n' + deleteSeverResponse);
        }
    } else {
        alert("Delete request was canceled");
        refreshEmployeeTable();
    }
    }
}

//edit employee Function 
const editEmployeeButton = (ob) => {
    document.getElementById("formTabButton").click();
    editButtonFunction(employeeFormRefill, ob, "tableTabButton", "formAddBtn", "formUpdateBtn", "formRestBtn",ClearEmployeeFormButtonFunction);
}

//Create function for view employee record
const viewEmployee = (ob) => {
    document.getElementById("formTabButton").click();
    viewButtonFunction(employeeFormRefill, ob, "tableTabButton", "formAddBtn", "formUpdateBtn", "formRestBtn",ClearEmployeeFormButtonFunction);
    document.getElementById("formEditableArea").style.pointerEvents="none";
}

//back button function for employee form back button
const backButtonEmployeeForm = () => {
    backButtonFunctionForm("tableTabButton", "formAddBtn", "formUpdateBtn", "formRestBtn",ClearEmployeeFormButtonFunction);
}





function textFullNameValidator(fieldID) {
    let pattern = '^([A-Za-z\\s\\.]{2,20})+$';
    const regPattern = new RegExp(pattern);
    if (fieldID.value != '') {
        if (regPattern.test(fieldID.value)) {
            fieldID.classList.add('is-valid');
            fieldID.classList.remove('is-invalid');
            //Generate calling name list
            dlNameParts.innerHTML = '';
            fullNamePartList = fieldID.value.split(' ');
            fullNamePartList.forEach(element => {
                const fullNamePartOption = document.createElement('option');
                fullNamePartOption.value = element;
                dlNameParts.appendChild(fullNamePartOption);
            });
            employee.fullname = fieldID.value; //data binding 
        } else {
            fieldID.classList.remove('is-valid');
            fieldID.classList.add('is-invalid');;
            employee.fullname = null; //data binding reset
        }
    } else {
        fieldID.classList.remove('is-valid');
        fieldID.classList.remove('is-invalid');
        employee.fullname = null; //data binding reset
    }

}

const textCallingNameValidator = (fieldID) => {
    const fieldValue = fieldID.value;
    const extIndex = fullNamePartList.map(element => element).indexOf(fieldValue);

    if (extIndex != -1) {
        fieldID.classList.add('is-valid');
        fieldID.classList.remove('is-invalid');
        employee.callingname = fieldValue; //data binding 

    } else {
        fieldID.classList.remove('is-valid');
        fieldID.classList.add('is-invalid');
        employee.callingname = null;
    }

}

//define function check form error
const checkFormError = () => {
    let errors = '';

    if (employee.fullname == null) {
        errors = errors + "Please Enter Full Name..\n";
        inputFullName.classList.add('is-invalid');
    }
    if (employee.callingname == null) {
        errors = errors + "Please Enter Valid Calling Name..\n";
        inputCallingName.classList.add('is-invalid');
    }
    if (employee.nic == null) {
        errors = errors + "Please Enter Valid NIC..! \n";
        inputNIC.classList.add('is-invalid');
    }
    if (employee.gender == null) {
        errors = errors + "Gender is not selected.Please Enter Valid NIC..! \n";
    }
    if (employee.dob == null) {
        errors = errors + "Date of Birth is not selected. Please check the NIC \n";
        inputDOB.classList.add('is-invalid');
    }
    if (employee.mobile == null) {
        errors = errors + "Please Enter Mobile..! \n";
        inputMobileNo.classList.add('is-invalid');
    }
    if (employee.email == null) {
        errors = errors + "Please Enter Mobile..! \n";
        inputEmail.classList.add('is-invalid');
    }
    if (employee.address == null) {
        errors = errors + "Please Enter Email..! \n";
        inputAddress.classList.add('is-invalid');
    }
    if (employee.civilstatus == null) {
        errors = errors + "Please Select Civil Status..! \n";
        inputCivilStatus.classList.add('is-invalid');
    }
    if (employee.employee_status_id == null) {
        errors = errors + "Select Employee Status..! \n";
        inputEmployeeStatus.classList.add('is-invalid');
    }
    if (employee.designation_id == null) {
        errors = errors + "Select Designation Status..! \n";
        inputDesignation.classList.add('is-invalid');
    }
     if (employee.servicestartdate == null) {
        errors = errors + "Please Enter Service Starting Date..! \n";
        inputStartDate.classList.add('is-invalid');
    } 
    if (employee.basicsalary == null) {
        errors = errors + "Please Enter Basic Salary..! \n";
        inputBasicSalary.classList.add('is-invalid');
    }
    if (employee.employeecategory == null) {
        errors = errors + "Please Enter Employee Category..! \n";
        inputEmployeeCategory.classList.add('is-invalid');
    }
    return errors;
}

//define function for submit employee
const submitEmployee = () => {
    // console.log("Submit");
    // console.log(employee);
    const errors = checkFormError();
    if (errors == '') {
        let confirmSubmitEmployee = confirm('Are you sure to add following employee..? \n'
            + '\n Full Name is : ' + employee.fullname
            + '\n Calling Name is : ' + employee.callingname
            + '\n Employee NIC : ' + employee.nic
            + '\n Employee Date of Birth : ' + employee.dob
            + '\n Employee Mobile Number : ' + employee.mobile
            + '\n Employee Designation : ' + employee.designation_id.name
            + '\n Employee Status : ' + employee.employee_status_id.name
            + '\n Employee Civil Status : ' + employee.civilstatus
            + '\n Employee Address : ' + employee.address);
        // need to get user confirmation
        if (confirmSubmitEmployee){
            //call post service
            //console.log(employee);
            const employeePostServiceResponse = ajaxPostRequestMapping("/employee", employee);
            if(employeePostServiceResponse == 'OK'){
                alert("Save Successefully..!")
                //refresh table
                refreshEmployeeTable();
                //call reset function
                ClearEmployeeFormButtonFunction();
                //call form refresh function
                refreshEmployeeForm();
            }else {
                alert("Saving employee was not sucessful.. !\n"+" Reason : "+ employeePostServiceResponse);
            }
        }else{
            alert("Employee entry canceled..");
        }

    } else {
        alert("Form has following Errors : \n" + errors);
    }
}

const checkFormUpdate = () => {
    let updates = '';
    /*  if (employee.fullname != oldemployee.fullname) {
         updates = updates + ("full name is changed from " + oldemployee.fullname + " into " + employee.fullname);
 
     } */

    let listOfField = ['fullname','callingname','nic','gender','dob','mobile','land','email','address','note','civilstatus','servicestartdate','hasuseraccount','basicsalary','employeecategory']
    listOfField.forEach(
        (field) => {
            if (employee[field] != oldemployee[field]) {
                updates = updates + ("Record of "+field + " is changed from '" + oldemployee[field] + "' into '" + employee[field] + "'.\n");
            }
        }
    );
    if(employee.designation_id.name != oldemployee.designation_id.name){
        updates = updates + ("Employee Designation is changed from "+oldemployee.designation_id.name+ " to "+employee.designation_id.name+".\n");
    }
    if(employee.employee_status_id.name != oldemployee.employee_status_id.name){
        updates = updates+ ("Employee Status is changed from "+oldemployee.employee_status_id.name+" to "+employee.employee_status_id.name+".\n");
    }
    return updates;
}

const buttonEmployeeUpdate = () => {
    //console.log("Update");
    //Check form errors
    let errors = checkFormError();

    if (errors == '') {
        //Check form updates
        let updates = checkFormUpdate();
        if (updates != "") {
            //User Confirmation
            let userConfirmUpdates = confirm("Are you sure you want to update following changes..? \n" + updates)
            if (userConfirmUpdates) {
                //call put services
                const putServiceReponse = ajaxPutRequestMapping("/employee",employee)
                //Check putServices Reponsces
                if (putServiceReponse == "OK") {
                    alert("update successfully...!");
                    refreshEmployeeTable();
                    ClearEmployeeFormButtonFunction();
                    refreshEmployeeForm();
                    document.getElementById("backButton").click();

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


let listOfFormIDs = [inputFullName, inputCallingName, inputNIC, inputDOB, inputMobileNo, inputLandNo, inputEmail, inputAddress, inputNote, inputDesignation, inputCivilStatus, inputEmployeeStatus, inputBasicSalary, inputStartDate, inputEmployeeCategory];

//Clear Form Function 
const ClearEmployeeFormButtonFunction = () => {
    ClearFormFunction("formEmployee", refreshEmployeeForm, listOfFormIDs);
}


let NicNo = document.getElementById('inputNIC');
NicNo.addEventListener("keyup",function(){
    let StrResultMonth;
    let StrResultDay;
    if (NicNo.classList.contains('is-valid')) {
        result = convertIDtoYearDate(NicNo.value);
        StrResultMonth = (result.month).toString();
        StrResultDay = (result.day).toString();
        if (StrResultMonth.length === 1) {
            StrResultMonth = ('0' + StrResultMonth);
        }
        if (StrResultDay.length === 1) {
            StrResultDay = ('0' + StrResultDay);
        }
        inputDOB.value = (result.year + '-' + StrResultMonth + '-' + StrResultDay);
        //binding data into employee 
        textValidator(inputDOB, '^([1][9][789][0-9][-][0-9]{2}[-][0-9]{2})|([2][0][0][012345][-][0-9]{2}[-][0-9]{2})$', 'employee', 'dob');


        //set value into radio element
        if (result.gender) {
            radioGenderMale.checked = true;
            employee.gender = "Male"
        } else {
            radioGenderFemale.checked = true;
            employee.gender = "Female"
        }
    } else {
        inputDOB.value = '';
        resetBoostrapClass(inputDOB)
        radioGenderMale.checked = false;
        radioGenderFemale.checked = false;
        employee.gender = ''
    }
});

/* Min value checking in Basic Salary */
const basicSalaryValidator = (fieldID, object, property) => {

    if (fieldID.value != '') {
        if (fieldID.value >= 12500) {
            fieldID.classList.add('is-valid');
            fieldID.classList.remove('is-invalid');
            window[object][property] = fieldID.value;

            //generate calling Name options
        } else {
            fieldID.classList.remove('is-valid');
            fieldID.classList.add('is-invalid');
            window[object][property] = null;
        }
    } else {
        fieldID.classList.remove('is-valid');
        fieldID.classList.remove('is-invalid');
        window[object][property] = null;
    }
}

