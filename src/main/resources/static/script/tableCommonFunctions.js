//create function for filling data into table
const fillDataIntoTable = (tableBodyID, dataList, displayColumnList, editFunction, deleteFunction, viewFunction,
                           buttonVisibilty, loggedUserPrivilege) => {
    //Create variable called employeeTable and assign table element
    const tableBody = document.getElementById(tableBodyID);
    tableBody.innerHTML = "";

    //find all data set (object)
    dataList.forEach(
        (element, index) => {
            const tr = document.createElement('tr'); //Creating a tr element (This is to create a table row and then it will be filled with data from array by for each loop)

            const tdIndex = document.createElement('td'); //Creaing first colomn element
            tdIndex.innerText = (index + 1); //This element is from the array. foreach loop set every element value to this element with iterations.
            tr.appendChild(tdIndex); //appending(diplaying) of the first colomn element

            displayColumnList.forEach(column => { //Colomn will be each element from the object array predefine. Now this forEach loop will go through all aother elements and that consist with specific datatypes
                const td = document.createElement('td');
                if (column.dataType === 'text') {  //This is checking whether the data type is text or function.
                    td.innerText = element[column.propertyName]; //
                }
                if (column.dataType === 'function') {
                    td.innerHTML = column.propertyName(element);
                }
                if (column.dataType == 'fileview') {
                    const tdbuttonView = document.createElement('button');
                    tdbuttonView.setAttribute("type", "button");
                    tdbuttonView.setAttribute("class", "btn btn-outline-warning btn-sm");
                    tdbuttonView.innerText = 'View File';
                    tdbuttonView.style.borderRadius = '5px';
                    tdbuttonView.onclick = () => column.propertyName(element);
                    td.appendChild(tdbuttonView);
                }

                tr.appendChild(td);
            });

            const tdButton = document.createElement('td');
            // Create a single dropdown button
            const dropdownButton = document.createElement('button');
            dropdownButton.className = 'btn btn-primary dropdown-toggle';
            dropdownButton.setAttribute('type', 'button');
            dropdownButton.setAttribute('data-bs-toggle', 'dropdown');
            dropdownButton.setAttribute('aria-expanded', 'false');
            dropdownButton.textContent = 'Actions';

            // Create the dropdown menu
            const dropdownMenu = document.createElement('ul');
            dropdownMenu.className = 'dropdown-menu';

            // Create and append view button
            const buttonPrint = document.createElement('button');
            buttonPrint.className = 'dropdown-item viewBtn';
            buttonPrint.innerHTML = '<i class="fa-regular fa-eye text-dark"></i> View';
            buttonPrint.onclick = function () {
                viewFunction(element);
            };
            //check privilege before appending button
            if (loggedUserPrivilege.sel_privi) {
                dropdownMenu.appendChild(buttonPrint);
            }

            // Create and append edit button
            const buttonEdit = document.createElement('button');
            buttonEdit.className = 'dropdown-item editBtn';
            buttonEdit.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> Edit';
            buttonEdit.onclick = function () {
                editFunction(element);
            };
            //check privilege before appending button
            if (loggedUserPrivilege.upd_privi) {
                dropdownMenu.appendChild(buttonEdit);
            }

            // Create and append delete button
            const buttonDelete = document.createElement('button');
            buttonDelete.className = 'dropdown-item deleteBtn';
            buttonDelete.innerHTML = '<i class="fa-regular fa-trash-can text-dark"></i> Delete';
            buttonDelete.onclick = function () {
                deleteFunction(element);
            };
            if (loggedUserPrivilege.del_privi) {
                dropdownMenu.appendChild(buttonDelete);
            }

            // Append the dropdown button and menu to the td
            tdButton.appendChild(dropdownButton);
            tdButton.appendChild(dropdownMenu);


            if (buttonVisibilty) {
                tr.appendChild(tdButton); // append button into table row
            }

            tableBody.appendChild(tr);

        })
};

const fillDataIntoTable2 = (tableBodyID, dataList, displayColumnList, editFunction, deleteFunction, viewFunction,
                            buttonVisibilty, loggedUserPrivilege) => {
    //Create variable called employeeTable and assign table element
    const tableBody = document.getElementById(tableBodyID);
    tableBody.innerHTML = "";

    //find all data set (object)
    dataList.forEach(
        (element, index) => {
            const tr = document.createElement('tr'); //Creating a tr element (This is to create a table row and then it will be filled with data from array by for each loop)

            const tdIndex = document.createElement('td'); //Creaing first colomn element
            tdIndex.innerText = (index + 1); //This element is from the array. foreach loop set every element value to this element with iterations.
            tr.appendChild(tdIndex); //appending(diplaying) of the first colomn element

            displayColumnList.forEach(column => { //Colomn will be each element from the object array predefine. Now this forEach loop will go through all aother elements and that consist with specific datatypes
                const td = document.createElement('td');
                if (column.dataType === 'text') {  //This is checking whether the data type is text or function.
                    td.innerText = element[column.propertyName]; //
                }
                if (column.dataType === 'function') {
                    td.innerHTML = column.propertyName(element);
                }
                tr.appendChild(td);
            });

            const tdButton = document.createElement('td');
            // Create a single dropdown button
            const dropdownButton = document.createElement('button');
            dropdownButton.className = 'btn btn-primary dropdown-toggle';
            dropdownButton.setAttribute('type', 'button');
            dropdownButton.setAttribute('data-bs-toggle', 'dropdown');
            dropdownButton.setAttribute('aria-expanded', 'false');
            dropdownButton.textContent = 'Actions';

            // Create the dropdown menu
            const dropdownMenu = document.createElement('ul');
            dropdownMenu.className = 'dropdown-menu';

            // Create and append view button
            const buttonPrint = document.createElement('button');
            buttonPrint.className = 'dropdown-item viewBtn';
            buttonPrint.innerHTML = '<i class="fa-solid fa-print"></i> Print';
            buttonPrint.onclick = function () {
                viewFunction(element);
            };
            //check privilege before appending button
            if (loggedUserPrivilege.sel_privi) {
                dropdownMenu.appendChild(buttonPrint);
            }

            // Create and append edit button
            const buttonEdit = document.createElement('button');
            buttonEdit.className = 'dropdown-item editBtn';
            buttonEdit.innerHTML = '<i class="fa-regular fa-eye text-dark"></i> View';
            buttonEdit.onclick = function () {
                editFunction(element);
            };
            //check privilege before appending button
            if (loggedUserPrivilege.upd_privi) {
                dropdownMenu.appendChild(buttonEdit);
            }

            // Create and append delete button
            const buttonDelete = document.createElement('button');
            buttonDelete.className = 'dropdown-item deleteBtn';
            buttonDelete.innerHTML = '<i class="fa-regular fa-trash-can text-dark"></i> Cancel';
            buttonDelete.onclick = function () {
                deleteFunction(element);
            };
            if (loggedUserPrivilege.del_privi) {
                dropdownMenu.appendChild(buttonDelete);
            }

            // Append the dropdown button and menu to the td
            tdButton.appendChild(dropdownButton);
            tdButton.appendChild(dropdownMenu);


            if (buttonVisibilty) {
                tr.appendChild(tdButton); // append button into table row
            }

            tableBody.appendChild(tr);

        })
};


//Fill Data Inner Table
const fillDataIntoInnerTable = (tableBodyID, dataList, displayColumnList, deleteFunction) => {

    const tableBody = document.getElementById(tableBodyID);
    tableBody.innerHTML = "";

    dataList.forEach((element, index) => {
        const tr = document.createElement('tr');

        const tdIndex = document.createElement('td');
        tdIndex.innerText = index + 1;
        tr.appendChild(tdIndex);

        displayColumnList.forEach(column => {
            const td = document.createElement('td');
            if (column.dataType == 'text') {
                td.innerText = element[column.propertyName];
            }
            if (column.dataType == 'function') {
                td.innerHTML = column.propertyName(element);
            }
            if (column.dataType == 'fileview') {
                const tdbuttonView = document.createElement('button');
                tdbuttonView.setAttribute("type", "button");
                tdbuttonView.setAttribute("class", "btn btn-outline-warning btn-sm tableViewFileButton");
                tdbuttonView.innerText = 'View File';
                tdbuttonView.style.borderRadius = '5px';
                tdbuttonView.onclick = () => column.propertyName(element);
                td.appendChild(tdbuttonView);
            }

            tr.appendChild(td);
        });

        const tdButtonEl = document.createElement('td');
        const buttonDelete = document.createElement('button');
        buttonDelete.className = 'btn btn-danger fw-bold ms-2 me-2';
        buttonDelete.innerText = 'Delete';
        buttonDelete.onclick = () => {
            // console.log('Deleted');
            deleteFunction(element, index);
        }
        tdButtonEl.appendChild(buttonDelete);

        tr.appendChild(tdButtonEl); // append tdbutton into table row

        tableBody.appendChild(tr); // table row append into table body
    });
}


//Taking the asc ordered list and checking for role changes
const rolePrivilegeTableFill = (tBodyID, priviDataList, roleDataList, editFun, delFun, viewFun, loggedUserPrivi) => {

    const tbody = document.getElementById(tBodyID);
    tbody.innerHTML = '';

    roleDataList.forEach((elementRole, index) => {
        const tr = document.createElement('tr');
        const tdIndex = document.createElement('td');
        tdIndex.innerText = index + 1;
        tr.appendChild(tdIndex);
        const tdRole = document.createElement('td');
        tdRole.innerText = elementRole.name;
        tr.appendChild(tdRole);
        const tdButtons = document.createElement('td');
        const tdDiv = document.createElement('div');
        priviDataList.forEach(elementPrivi => {
            if (elementRole.id === elementPrivi.role_id.id) {
                addButtonsFunction(tdDiv, elementPrivi, viewFun, editFun, delFun, loggedUserPrivi);
            } else {
                console.log("Not in current role");
            }
        });
        tdButtons.appendChild(tdDiv)
        tr.appendChild(tdButtons);
        //then appending that whole table row to table body
        tbody.appendChild(tr);
    });
}
//Creating a button name after the module
const addButtonsFunction = (tdEl, object, EditFun, ViewFun, DeleteFun, userPRivi) => {
    const mainDiv = document.createElement('div');
    mainDiv.classList.add('d-flex');
    const btnModule = document.createElement('button');
    btnModule.classList.add("moduleButton");
    btnModule.innerText = object.module_id.name + " Module";
    btnModule.onclick = () => {
        document.getElementById("id" + object.module_id.name + object.role_id.name).style.display = "block";
        setTimeout(() => {
            document.getElementById("id" + object.module_id.name + object.role_id.name).style.display = "none";
        }, 1500)
    }
    const divButton = document.createElement('div');
    divButton.className = "moduleActionButtons";
    divButton.id = "id" + object.module_id.name + object.role_id.name;
    divButton.style.display = "none";
    const btnDropDown = document.createElement('ul');
    const btnDropDownView = document.createElement('button');
    btnDropDownView.innerHTML = '<i class="fa-regular fa-eye" style="color: #eaf5ff;"></i>';
    btnDropDownView.className = 'viewBtn';
    btnDropDownView.onclick = () => {
        console.log(object);
        ViewFun(object);
    }
    if (userPRivi.sel_privi) {
        btnDropDown.appendChild(btnDropDownView);
    }

    const btnDropDownEdit = document.createElement('button');
    btnDropDownEdit.innerHTML = '<i class="fa-solid fa-file-pen" style="color: #eaf5ff;"></i>';
    btnDropDownEdit.className = 'editBtn';
    btnDropDownEdit.onclick = () => {
        console.log(object);
        EditFun(object);
    }
    if (userPRivi.upd_privi) {
        btnDropDown.appendChild(btnDropDownEdit);
    }

    const btnDropDownDelete = document.createElement('button');
    btnDropDownDelete.innerHTML = '<i class="fa-regular fa-trash-can" style="color: #eaf5ff;"></i>';
    btnDropDownDelete.className = 'deleteBtn';
    btnDropDownDelete.onclick = () => {
        console.log(object);
        DeleteFun(object);
    }
    if (userPRivi.del_privi) {
        btnDropDown.appendChild(btnDropDownDelete);
    }


    mainDiv.appendChild(btnModule);
    divButton.appendChild(btnDropDown);
    mainDiv.appendChild(divButton);
    tdEl.appendChild(mainDiv);

}


//Priniting Bill Table Refill
const fillDataIntoBillingTable = (tableBodyID, dataList, displayColumnList) => {

    const tableBody = document.getElementById(tableBodyID);
    tableBody.innerHTML = '';

    dataList.forEach((element, index) => {
        const tr = document.createElement('tr');

        const tdIndex = document.createElement('td');
        tdIndex.classList.add("text-end");
        tdIndex.innerText = index + 1;
        tr.appendChild(tdIndex);

        displayColumnList.forEach(column => {
            const td = document.createElement('td');
            td.classList.add("text-end");
            if (column.dataType == 'text') {
                td.innerText = element[column.propertyName];
            }
            if (column.dataType == 'function') {
                td.innerHTML = column.propertyName(element);
            }

            tr.appendChild(td);
        });

        tableBody.appendChild(tr); // table row append into table body
    });
}

//Priniting Bill Table Refill
const fillDataIntoReportTable = (tableBodyID, dataList, displayColumnList) => {

    const tableBody = document.getElementById(tableBodyID);
    tableBody.innerHTML = '';

    dataList.forEach((element, index) => {
        const tr = document.createElement('tr');

        const tdIndex = document.createElement('td');
        tdIndex.innerText = index + 1;
        tr.appendChild(tdIndex);

        displayColumnList.forEach(column => {
            const td = document.createElement('td');
            td.classList.add("text-center");
            if (column.dataType == 'text') {
                td.innerText = element[column.propertyName];
            }
            if (column.dataType == 'function') {
                td.innerHTML = column.propertyName(element);
            }

            tr.appendChild(td);
        });

        tableBody.appendChild(tr); // table row append into table body
    });
}


//Priniting Bill Table Refill
const fillDataIntoTable3 = (tableBodyID, dataList, displayColumnList) => {

    const tableBody = document.getElementById(tableBodyID);
    tableBody.innerHTML = '';

    dataList.forEach((element, index) => {
        const tr = document.createElement('tr');

        const tdIndex = document.createElement('td');
        tdIndex.innerText = index + 1;
        tr.appendChild(tdIndex);

        displayColumnList.forEach(column => {
            const td = document.createElement('td');
            if (column.dataType == 'text') {
                td.innerText = element[column.propertyName];
            }
            if (column.dataType == 'function') {
                td.innerHTML = column.propertyName(element);
            }

            tr.appendChild(td);
        });

        tableBody.appendChild(tr); // table row append into table body
    });
}


//create function for filling data into table
const fillDataIntoProductionTable = (tableBodyID, dataList, displayColumnList, editFunction, printFunction, viewFunction, confirmFunction, loggedUserPrivilege) => {
    const tableBody = document.getElementById(tableBodyID);
    tableBody.innerHTML = "";

    //find all data set (object)
    dataList.forEach(
        (element, index) => {
            const tr = document.createElement('tr'); //Creating a tr element (This is to create a table row and then it will be filled with data from array by for each loop)

            const tdIndex = document.createElement('td'); //Creaing first colomn element
            tdIndex.innerText = (index + 1); //This element is from the array. foreach loop set every element value to this element with iterations.
            tr.appendChild(tdIndex); //appending(diplaying) of the first colomn element

            displayColumnList.forEach(column => { //Colomn will be each element from the object array predefine. Now this forEach loop will go through all aother elements and that consist with specific datatypes
                const td = document.createElement('td');
                if (column.dataType === 'text') {  //This is checking whether the data type is text or function.
                    td.innerText = element[column.propertyName]; //
                }
                if (column.dataType === 'function') {
                    td.innerHTML = column.propertyName(element);
                }
                if (column.dataType == 'fileview') {
                    const tdbuttonView = document.createElement('button');
                    tdbuttonView.setAttribute("type", "button");
                    tdbuttonView.setAttribute("class", "btn btn-outline-warning btn-sm");
                    tdbuttonView.innerText = 'View File';
                    tdbuttonView.style.borderRadius = '5px';
                    tdbuttonView.onclick = () => column.propertyName(element);
                    td.appendChild(tdbuttonView);
                }

                tr.appendChild(td);
            });

            const tdButton = document.createElement('td');

            if (element.production_status_id.id == 5) {
                tr.style.backgroundColor = '#b5433f';
                tdButton.style.pointerEvents = 'none';
            }
            // Create a single dropdown button
            const dropdownButton = document.createElement('button');
            dropdownButton.className = 'btn btn-primary dropdown-toggle';
            dropdownButton.setAttribute('type', 'button');
            dropdownButton.setAttribute('data-bs-toggle', 'dropdown');
            dropdownButton.setAttribute('aria-expanded', 'false');
            dropdownButton.textContent = 'Actions';

            // Create the dropdown menu
            const dropdownMenu = document.createElement('ul');
            dropdownMenu.className = 'dropdown-menu';

            // Create and append view button
            const viewButton = document.createElement('button');
            viewButton.className = 'dropdown-item viewBtn';
            viewButton.innerHTML = '<i class="fa-regular fa-eye text-dark"></i> View';
            viewButton.onclick = function () {
                viewFunction(element);
            };
            //check privilege before appending button
            if (loggedUserPrivilege.sel_privi) {
                dropdownMenu.appendChild(viewButton);
            }

            // Create and append view button
            const buttonPrint = document.createElement('button');
            buttonPrint.className = 'dropdown-item viewBtn';
            buttonPrint.innerHTML = '<i class="fa-solid fa-print"></i> Report';
            buttonPrint.onclick = function () {
                printFunction(element);
            };
            //check privilege before appending button
            if (loggedUserPrivilege.sel_privi) {
                dropdownMenu.appendChild(buttonPrint);
            }

            if (element.production_status_id) {
                if (element.production_status_id.name == "Waiting") {
                    const confirmButton = document.createElement('button');
                    confirmButton.className = 'dropdown-item editBtn';
                    confirmButton.innerHTML = '<i class="fa-solid fa-check"></i> Confirm';
                    confirmButton.onclick = function () {
                        confirmFunction(element)
                    }
                    if (loggedUserPrivilege.upd_privi) {
                        dropdownMenu.appendChild(confirmButton);
                    }
                } else {
                    // Create and append edit button
                    const buttonEdit = document.createElement('button');
                    buttonEdit.className = 'dropdown-item editBtn';
                    buttonEdit.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> Update';
                    buttonEdit.onclick = function () {
                        editFunction(element);
                    };
                    //check privilege before appending button
                    if (loggedUserPrivilege.upd_privi) {
                        dropdownMenu.appendChild(buttonEdit);
                    }
                }
            }


            // Append the dropdown button and menu to the td
            tdButton.appendChild(dropdownButton);
            tdButton.appendChild(dropdownMenu);
            tr.appendChild(tdButton);

            tableBody.appendChild(tr);

        })
};


const fillDataIntoPaymentTable = (tableBodyID, dataList, displayColumnList, printFunction) => {
    //Create variable called employeeTable and assign table element
    const tableBody = document.getElementById(tableBodyID);
    tableBody.innerHTML = "";

    //find all data set (object)
    dataList.forEach(
        (element, index) => {
            const tr = document.createElement('tr'); //Creating a tr element (This is to create a table row and then it will be filled with data from array by for each loop)

            const tdIndex = document.createElement('td'); //Creaing first colomn element
            tdIndex.innerText = (index + 1); //This element is from the array. foreach loop set every element value to this element with iterations.
            tr.appendChild(tdIndex); //appending(diplaying) of the first colomn element

            if(element.customer_order_payment_status_id.id == 2){
                tr.style.backgroundColor = 'rgb(110,94,94)';
            }
            displayColumnList.forEach(column => { //Colomn will be each element from the object array predefine. Now this forEach loop will go through all aother elements and that consist with specific datatypes
                const td = document.createElement('td');
                if (column.dataType === 'text') {  //This is checking whether the data type is text or function.
                    td.innerText = element[column.propertyName]; //
                }
                if (column.dataType === 'function') {
                    td.innerHTML = column.propertyName(element);
                }
                if (column.dataType == 'fileview') {
                    const tdbuttonView = document.createElement('button');
                    tdbuttonView.setAttribute("type", "button");
                    tdbuttonView.setAttribute("class", "btn btn-outline-warning btn-sm");
                    tdbuttonView.innerText = 'View File';
                    tdbuttonView.style.borderRadius = '5px';
                    tdbuttonView.onclick = () => column.propertyName(element);
                    td.appendChild(tdbuttonView);
                }

                tr.appendChild(td);
            });

            const tdButton = document.createElement('td');

            // Create and append view button
            const buttonPrint = document.createElement('button');
            buttonPrint.className = 'btn btn-outline-primary';
            buttonPrint.innerHTML = '<i class="fa-solid fa-print"></i> Print';
            buttonPrint.onclick = function () {
                printFunction(element);
            };
            //check privilege before appending button
            tdButton.appendChild(buttonPrint);

            tr.appendChild(tdButton); // append button into table row

            tableBody.appendChild(tr);

        })
};

const fillDataIntoMaterialSupplierPriceTable = (tableBodyID, dataList, displayColumnList, setPriceFunction, loggedUserPrivi) => {
    //Create variable called employeeTable and assign table element
    const tableBody = document.getElementById(tableBodyID);
    tableBody.innerHTML = "";

    //find all data set (object)
    dataList.forEach((element, index) => {
        const tr = document.createElement('tr');
        if(index===0){
            tr.style.backgroundColor= "rgb(113,162,154)"
        }

        const tdIndex = document.createElement('td');
        tdIndex.innerText = (index + 1);
        tr.appendChild(tdIndex);

        displayColumnList.forEach(column => {
            const td = document.createElement('td');
            if (column.dataType === 'text') {
                td.innerText = element[column.propertyName]; //
            }
            if (column.dataType === 'function') {
                td.innerHTML = column.propertyName(element);
            }

            tr.appendChild(td);
        });

        const tdButton = document.createElement('td');

        // Create and append view button
        const buttonPrint = document.createElement('button');
        buttonPrint.className = 'btn btn-outline-primary';
        buttonPrint.innerHTML = '<i class="fa-solid fa-check"></i> Set Price';
        buttonPrint.onclick = function () {
            setPriceFunction(element);
        };
        if (!loggedUserPrivi.upd_privi) {
            buttonPrint.disabled = true;
        }
        //check privilege before appending button
        tdButton.appendChild(buttonPrint);

        tr.appendChild(tdButton); // append button into table row

        tableBody.appendChild(tr);

    })
};

const fillDataIntoROP = (tableBodyID, dataList, displayColumnList, setROPFunction, loggedUserPrivi) => {
    //Create variable called employeeTable and assign table element
    const tableBody = document.getElementById(tableBodyID);
    tableBody.innerHTML = "";

    //find all data set (object)
    dataList.forEach((element, index) => {
        const tr = document.createElement('tr');
        if(index===0){
            tr.style.backgroundColor= "rgba(113,162,154,0.67)"
        }

        const tdIndex = document.createElement('td');
        tdIndex.classList.add("text-end");
        tdIndex.innerText = (index + 1);
        tr.appendChild(tdIndex);

        displayColumnList.forEach(column => {
            const td = document.createElement('td');
            if (column.dataType === 'text') {
                td.innerText = element[column.propertyName]; //
            }
            if (column.dataType === 'function') {
                td.innerHTML = column.propertyName(element);
            }
            td.classList.add("text-end");
            tr.appendChild(td);
        });

        const tdButton = document.createElement('td');

        // Create and append ROP button
        const buttonPrint = document.createElement('button');
        buttonPrint.className = 'btn btn-outline-primary';
        buttonPrint.innerHTML = '<i class="fa-solid fa-check"></i> Set Usage to ROP';
        buttonPrint.onclick = function () {
            setROPFunction(element);
        };
        if (!loggedUserPrivi.upd_privi) {
            buttonPrint.disabled = true;
        }
        //check privilege before appending button
        tdButton.classList.add("text-center");
        tdButton.appendChild(buttonPrint);

        tr.appendChild(tdButton); // append button into table row

        tableBody.appendChild(tr);

    })
};