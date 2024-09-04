//call customer table refresh function
window.addEventListener('load', () => {

    loggedUserPriviForCustomer = ajaxGetRequestMapping("/privilege/bymodule/Customer");

    refreshCustomerTable(); // Calling Refresh function to data diplay table

    refreshCustomerForm();

    if(!loggedUserPriviForCustomer.ins_privi){
        document.getElementById("tableTabButton").click();
        document.getElementById("formTabButton").style.display = 'none';
    }

});


//create function table refresh
const refreshCustomerTable = () => {

    const customerActive = ajaxGetRequestMapping("/customer/active");
    const customerInActive = ajaxGetRequestMapping("/customer/inactive");
    const customerDeleted = ajaxGetRequestMapping("/customer/deleted");

    customers = customerActive.concat(customerInActive,customerDeleted);

    //text--> String, number, date
    //function--> object, array, boolean
    const displayPropertyListCutomer = [
        { dataType: 'text', propertyName: 'custno' },
        { dataType: 'text', propertyName: 'name' },
        { dataType: 'function', propertyName: getCustomerStatus },
        { dataType: 'text', propertyName: 'mobile' },
        { dataType: 'text', propertyName: 'customertype' }
    ]
    //call filldataintotable function
    //(tableId,dataList)
    fillDataIntoTable("tableBodyCustomer", customers, displayPropertyListCutomer, editCustomer, deleteCustomer, viewCustomer, true,loggedUserPriviForCustomer);
    new DataTable('#tableCustomer');
    document.getElementById("tableCustomer").style.width = "100%";

}

const refreshCustomerForm = () => {
    //creating a new object for customer
    customer = new Object();
    //customer status dynamic select fill
    let customerStatus = ajaxGetRequestMapping("/customer/status/findall");
    fillDataIntoSelect(inputCustomerStatus, 'Select Customer Status', customerStatus, 'name');
    //hide business data section in the form
    document.getElementById("BusinessSection").style.display = 'none'
    //disable buttons 
    document.getElementById("formAddBtn").disabled = false;
    document.getElementById("formUpdateBtn").disabled = true;
    document.getElementById("formRestBtn").disabled = false;

    document.getElementById("formEditableArea").style.pointerEvents="auto";

}

const getCustomerStatus = (ob) => {
    //return 'SS';
    if (ob.customer_status_id.name == 'Active') {
        return '<p style="border-radius:10px" class="bg-success p-2 text-center fw-bold">' + ob.customer_status_id.name + '</p>'
    }
    if (ob.customer_status_id.name == 'In-Active') {
        return '<p style="border-radius:10px" class="bg-warning p-2 text-center fw-bold">' + ob.customer_status_id.name + '</p>'
    }
    if (ob.customer_status_id.name == 'Deleted') {
        return '<p style="border-radius:10px;" class="bg-danger p-2 text-center fw-bold">' + ob.customer_status_id.name + '</p>'
    }


}
//customer form refill with database object
const customerFormRefill = (ob) => {

    customer = JSON.parse(JSON.stringify(ob));
    oldcustomer = JSON.parse(JSON.stringify(ob));

    inputCustomerNo.value = ob.custno;
    inputCustomerName.value = ob.name;
    inputCustomerMobile.value = ob.mobile;
    inputCustomerEmail.value = ob.email;
    inputSecondaryContact.value = ob.secondarycontactno;
    inputCustomerType.value = ob.customertype;
    if (ob.customertype == "Business") {
        document.getElementById("BusinessSection").style.display = 'block'
    } else {
        document.getElementById("BusinessSection").style.display = 'none'
    }
    inputBusinessName.value = ob.businessname;
    inputBusinessEmail.value = ob.businessemail;
    inputBusinessAddress.value = ob.businessaddress;
    inputBusinessTel.value = ob.businesstelephone;
    inputCustomerDesicription.value = ob.description;
    let customerStatus = [{ id: 1, name: "Active" }, { id: 3, name: "Deleted" }, { id: 2, name: "In-Active" }];
    fillDataIntoSelect(inputCustomerStatus, 'Select Customer Status', customerStatus, 'name', ob.customer_status_id.name);
    document.getElementById("formTabButton").click();


}
//Create function for delete customer record
const deleteCustomer = (ob) => {
    if (ob.customer_status_id.name == "Deleted") {
        alert(ob.name + " is already deleted.");
    } else {
        //get customer confirmation
        const confirmCutomerDelete = confirm('Are you sure to delete following customer..? \n'
            + '\n Customer No : ' + ob.custno
            + '\n Customer Name : ' + ob.name
            + '\n Customer Status : ' + ob.customer_status_id.name);
        if (confirmCutomerDelete) {
            const deleteSeverResponse = ajaxDelRequestMapping("/customer",ob);
            if (deleteSeverResponse=='OK') {
                alert('Delete Successfully..!');
                refreshCustomerTable();
            }else{
                alert('Delete not completed, You have following error\n' + deleteSeverResponse);
            }
        } else {
            alert("Delete request was canceled");
        }
    }
}

//function for edit customer button
const editCustomer = (ob) => {
    refreshCustomerForm();
    editButtonFunction(customerFormRefill, ob, "tableTabButton", "formAddBtn", "formUpdateBtn", "formRestBtn", ClearCustomerFormButtonFunction);
}
//Create function for view customer record
const viewCustomer = (ob) => {
    refreshCustomerForm();
    viewButtonFunction(customerFormRefill, ob, "tableTabButton", "formAddBtn", "formUpdateBtn", "formRestBtn", ClearCustomerFormButtonFunction);
    document.getElementById("formEditableArea").style.pointerEvents="none";
}
//back button in customer form
const backButtonCustomerForm = () => {
    refreshCustomerForm();
    backButtonFunctionForm("tableTabButton", "formAddBtn", "formUpdateBtn", "formRestBtn", ClearCustomerFormButtonFunction)
}

//define function check form error
const checkCustomerFormError = () => {
    let errors = '';
    if (customer.name == null) {
        errors = errors + "Please Enter a customer name..!\n";
        inputCustomerName.classList.add('is-invalid');
    }
    if (customer.name == null) {
        errors = errors + "Please Enter a customer mobile..!\n";
        inputCustomerName.classList.add('is-invalid');
    }
    if (customer.customer_status_id == null) {
        errors = errors + "Please Enter a customer mobile..!\n";
        inputCustomerName.classList.add('is-invalid');
    }
    return errors;
}

//check updates
const checkFormCustomerUpdates = () => {
    let updates = '';
    //list of customer form fields
    let listOfFieldCustomer = ['custno', 'name', 'mobile', 'email', 'secondarycontactno', 'customertype', 'email', 'description', 'customertype', 'businessname', 'businessemail', 'businesstelephone', 'businessaddress']
    listOfFieldCustomer.forEach(
        (custfield) => {
            if (customer[custfield] != oldcustomer[custfield]) {
                updates = updates + ("Record of " + custfield + " is changed from '" + oldcustomer[custfield] + "' into '" + customer[custfield] + "'.\n");
            }
        }
    );
    if (customer.customer_status_id.id != oldcustomer.customer_status_id.id) {
        updates = updates + "Customers status has been updated to " + customer.customer_status_id.name + ".\n";
    }
    return updates;
}
//update customer button funtion
const buttonCustomerUpdate = () => {
    let errors = checkCustomerFormError();
    if (errors == '') {
        //Check form updates
        let updates = checkFormCustomerUpdates();
        if (updates != "") {
            //User Confirmation
            let confirmCutomerUpdate = confirm("Are you sure you want to update following changes..? \n" + updates)
            if (confirmCutomerUpdate) {
                //call put services
                const putServiceReponse = ajaxPutRequestMapping("/customer",customer)
                //Check putServices Reponsces
                if (putServiceReponse == "OK") {
                    alert("update successfully...!");
                    //Refresh table
                    refreshCustomerTable();
                    //Clear Form Function
                    ClearCustomerFormButtonFunction();
                    //Refresh form function
                    refreshCustomerForm();
                    //call funtion for back button
                    backButtonCustomerForm();

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


//define function for submit customer
const submitCustomer = () => {
    // console.log("Submit");
    //console.log(customer);
    const errors = checkCustomerFormError();
    if (errors == '') {
        let confirmSubmitCustomer = confirm('Are you sure to add following customer..?'
            + '\n Customer Name : ' + customer.name
            + '\n Customer Mobile : ' + customer.mobile
            + '\n Customer Status : ' + customer.customer_status_id.name);
        // need to get user confirmation
        if (confirmSubmitCustomer) {
            //console.log(customer);
            const customerPostServiceResponse = ajaxPostRequestMapping("/customer",customer);
            if (customerPostServiceResponse == 'OK') {
                alert("Save Successefully..!")
                //refresh table
                refreshCustomerTable();
                //click button to back
                ClearCustomerFormButtonFunction();
                //call form refresh function
                refreshCustomerForm();
                //back button function button
                backButtonCustomerForm();
            } else {
                alert("Saving customer was not sucessful.. !\n" + " Reason : " + customerPostServiceResponse);
            }
        } else {
            alert("Customer entry canceled..");
        }

    } else {
        alert("Form has following errors : \n" + errors)
    }
}


let listOfCustomerFormIDs = [inputCustomerNo, inputCustomerName, inputCustomerMobile, inputCustomerEmail, inputSecondaryContact, inputCustomerType, inputCustomerStatus, inputBusinessName, inputBusinessEmail, inputBusinessAddress, inputBusinessTel, inputCustomerDesicription];
//Clear Form Function "formcustomer"refreshcustomerForm
const ClearCustomerFormButtonFunction = () => {
    ClearFormFunction("formCustomer", refreshCustomerForm, listOfCustomerFormIDs);
}



//Event listner to run on chage of roles select list
inputCustomerType.addEventListener("change", function () {
    if (inputCustomerType.value == "Business") {
        document.getElementById("BusinessSection").style.display = 'block'
    } else {
        document.getElementById("BusinessSection").style.display = 'none'
    }
});

