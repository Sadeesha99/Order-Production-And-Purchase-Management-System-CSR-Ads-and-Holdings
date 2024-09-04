//define function for fill data into select element

const fillDataIntoSelect = (field, message, dataList, property, selectedValue) => {
    field.innerHTML = '';
    let messageVariableID = "message:" + message.split(" ").join("");
    field.onclick = function () {
        document.getElementById(messageVariableID).disabled = true;
    }
    const optionMsg = document.createElement('option');
    optionMsg.innerText = message;
    optionMsg.id = messageVariableID;
    optionMsg.selected = 'Selected';
    field.appendChild(optionMsg)

    dataList.forEach(elementDL => {
        const option = document.createElement('option');
        option.value = JSON.stringify(elementDL);
        option.innerHTML = elementDL[property];
        if (elementDL[property] == selectedValue) {
            option.selected = "selected";
        }
        field.appendChild(option);
    });
}

//class reset on boostrap classn of the form
const resetBoostrapClass = (fieldID) => {
    fieldID.classList.remove('is-invalid');
    fieldID.classList.remove('is-valid');
}

const showPasswordToggle = (fieldID, inputField) => {
    if (inputField.type == 'password') {
        inputField.type = 'text';
        inputField.focus();
        fieldID.innerHTML = '<i class="fa-regular fa-eye-slash aria-hidden="true"></i>'
    } else if (inputField.type == 'text') {
        inputField.type = 'password';
        inputField.focus();
        fieldID.innerHTML = '<i class="fa-regular fa-eye" aria-hidden="true"></i>'
    }
}

//PropertyName2 is the value that we have to enter if propertyName is not an Unique value.
//if propertyName is unique, set propertyName2 as '', if not there will be an error.
const displaySearchList = (resultList, resultDiv, propertyName, propertyName2, onclickFunction) => {
    resultDiv.innerHTML = '';
    //Checking does result is empty or not
    if (resultList) {
        //Creating a unoredered list
        const ulList = document.createElement('ul');
        //run for each on resultList to create option list under input field.
        resultList.forEach(element => {
            //creating option variable
            const listItems = document.createElement('option');
            //converting the elements of the resultList to string.. Without Coverting a JSON object cannot be entered as a value in a option element.
            listItems.value = JSON.stringify(element[propertyName]);
            listItems.id = element[propertyName];
            //checking if the displayProperty2 is null or not. innerHTML pattern has to choosen according to it.
            if (propertyName2 == '') {
                listItems.innerHTML = element[propertyName];
            } else {
                listItems.innerHTML = element[propertyName] + " (" + element[propertyName2] + ") ";
            }
            //adding onclick funtion that set input field value
            listItems.onclick = function () {
                onclickFunction(element);
            }
            //appending elements
            ulList.appendChild(listItems);
        });
        resultDiv.appendChild(ulList);
    } else {
        //if it is empty then clear out anything left inside of div tag and remove valid class and add invalid class
        resultDiv.innerHTML = '';
    }
}


const searchFunction = (dataList, searchFieldInputVariable, propertyName) => {
    //taking search search input into a value.
    let input = searchFieldInputVariable.value;
    //creating a empty arry to store filtered results
    let result = [];
    //Checking does input field does have any inputs.. That is done by checking the length of the input field value
    if (input.length) {
        //Checking if the input value is included as a specific property in the Datalist Array. if it is includes then those objects will return in to result array.. 
        result = dataList.filter((element) => {
            return element[propertyName].toLowerCase().includes(input.toLowerCase());
        });
        if (result.length > 0) {
            searchFieldInputVariable.classList.remove('is-invalid');
            searchFieldInputVariable.classList.add('is-valid');
            return result;
        } else {
            searchFieldInputVariable.classList.remove('is-valid');
            searchFieldInputVariable.classList.add('is-invalid');
            return result;
        }

    } else {
        result = dataList;
        searchFieldInputVariable.classList.remove('is-invalid');
        searchFieldInputVariable.classList.remove('is-valid');
        return result;
    }
}


const ClearFormFunction = (formID, refreshForm, formIDList) => {
    document.getElementById(formID).reset();
    formIDList.forEach(id => {
        resetBoostrapClass(id);
    });
    refreshForm();
}


//----------------buttons disableing functions--------------------------------------------------------

//edit employee Function 
const editButtonFunction = (formRefillFunction, ob, tableTabBtnID, addFormBtnID, updateFormBtnID, clearFormBtnID, clearFormFunction) => {
    clearFormFunction();
    formRefillFunction(ob);
    document.getElementById(addFormBtnID).disabled = true;
    document.getElementById(updateFormBtnID).disabled = false;
    document.getElementById(clearFormBtnID).disabled = true;
    document.getElementById(tableTabBtnID).disabled = true;
}

//Create function for view employee record
const viewButtonFunction = (formRefillFunction, ob, tableTabBtnID, addFormBtnID, updateFormBtnID, clearFormBtnID, clearFormFunction) => {
    clearFormFunction();
    formRefillFunction(ob);
    document.getElementById(tableTabBtnID).disabled = true;
    document.getElementById(addFormBtnID).disabled = true;
    document.getElementById(updateFormBtnID).disabled = true;
    document.getElementById(clearFormBtnID).disabled = true;
}

const backButtonFunctionForm = (tableTabBtnID, addFormBtnID, updateFormBtnID, clearFormBtnID, clearFormFunction) => {
    document.getElementById(tableTabBtnID).disabled = false;
    document.getElementById(tableTabBtnID).click();
    document.getElementById(addFormBtnID).disabled = false;
    document.getElementById(updateFormBtnID).disabled = false;
    document.getElementById(clearFormBtnID).disabled = false;
    clearFormFunction();
}


//----------------buttons disableing functions end----------------------------------------------------




//--------------- ajax call function -----------------------------------------

//------------ get function---------------------------------------------------------
const ajaxGetRequestMapping = (URL) => {
    let dataList;
    $.ajax(URL, {
        type: "GET", //type = request methods --> "GET","POST","PUT","DELETE"
        contentType: "json",//Data transfer format
        //if async is true code line will continue to excute without waiting for reponse
        //if async is false code lines after it will wait until the reponse comes
        async: false,
        //success means if data received properly
        success: function (successReponseData) {
            //console.log(" Success ", successReponseData);
            dataList = successReponseData;
        },
        //Error means if data did not received properly
        error: function (failReponseData) {
            //console.log(" Failed ", failReponseData);
            dataList = [];
        }
    })
    return dataList;
}
//------------ get function end---------------------------------------------------------

//------------ Delete function-------------------------------------------------------------
const ajaxDelRequestMapping = (url, object) => {
    let deleteRequestResponse;
    $.ajax(url, {
        type: "DELETE",
        contentType: "application/json",
        async: false,
        data: JSON.stringify(object),
        success: function (successOb) {
            //console.log("Success :" + successOb);
            deleteRequestResponse = successOb;
        },
        error: function (errorOb) {
            //console.log("Fail :" + errorOb);
            deleteRequestResponse = errorOb;
        }
    });
    return deleteRequestResponse;
}
//------------ Delete function end----------------------------------------------------------


//------------ Update function----------------------------------------------------------
const ajaxPutRequestMapping = (url, object) => {
    let putRequestReponse;
    $.ajax(url, {
        async: false,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(object),
        success: function (successOb) {
            //console.log("success");
            putRequestReponse = successOb;
        },
        error: function (errorOb) {
            //console.log("error");
            putRequestReponse = errorOb;
        }
    });
    return putRequestReponse;
}
//------------ Update function End----------------------------------------------------------


//------------ Insert/POST function --------------------------------------------------------

const ajaxPostRequestMapping = (url, object) => {
    let postServieResponce;
    $.ajax(url, {
        async: false,
        type: "POST", // method
        data: JSON.stringify(object), // object
        contentType: "application/json",
        success: function (susResdata, susStatus, ajresob) {
            postServieResponce = susResdata;
        },
        error: function (errRsOb, errStatus, errorMsg) {
            postServieResponce = errorMsg;
        }
    });

    return postServieResponce;
}

//------------ Insert/POST function --------------------------------------------------------


//------------------------------------------ Open File  in new limited features window ------------------------------------------------------------

const openFileWithHtmlContent = (base64Content) => {
    // Create a data URL from the base64 content
    //const dataUrl = `data:${mimeType};base64,${base64Content}`;

    const checkFileType = detectFileType(base64Content);
    // Open a new window with limited features
    const windowFeatures = "menubar=no,toolbar=no,location=no,status=no,scrollbars=yes,resizable=yes,width=900,height=600";
    const newWindow = window.open("", "_blank", windowFeatures);

    const loadDateTime = getCurrentDateTimeString();

    let windowButtonsContent =
        `<!-- Boostrap CSS -->
                <link rel="stylesheet" href="/bootstrap-5.2.3/css/bootstrap.min.css">
                <!-- Boostrap Js -->
                <script src="/bootstrap-5.2.3/js/bootstrap.bundle.min.js"></script>
                <div id="nonPrintableContent" style = "margin: 15px;">
                 <button type="button" class="btn btn-outline-secondary" 
                 onclick="printWindow()">Print</button>
                 <a href="${base64Content}" download="${loadDateTime}">
                 <button type="button" class="btn btn-outline-info">Download</button>
                 </a>
                 <script>
                    function printWindow() {
                        document.getElementById('nonPrintableContent').style.display = 'none';
                        window.print()
                        document.getElementById('nonPrintableContent').style.display = 'block';
                    }
                </script>
            </div>`

    // Write the additional HTML content to the new window
    newWindow.document.open();

    if (checkFileType == 'image') {
        //console.log('Image - True');
        const additionalHtmlContent = `
        <html>
        <head>
            <title>File Preview</title>
        </head>
        <body>`+ windowButtonsContent + `
            <div id="printableContent"><img src="${base64Content}" width="800px" height="auto" style="border: 2px solid; margin-left: 15px;"></div>
        </body>
        </html>
    `;
        newWindow.document.write(additionalHtmlContent);
    }
    else if (checkFileType == 'pdf') {
        //console.log('PDF - true ');
        const additionalHtmlContent = `
        <html>
        <head>
            <title>File Preview</title>
        </head>
        <body>
            <iframe src="${base64Content}" width="800px" height="100%" style="border:none;"></iframe>
        </body>
        </html>
    `;
        newWindow.document.write(additionalHtmlContent);
    }
    else if (checkFileType == 'other') {
        //console.log('Other - true ');
        const additionalHtmlContent = `
        <html>
        <head>
            <title>File Preview</title>
        </head>
        <body>
            `+ windowButtonsContent + `
            <h2>Not a PDF or Image : File might not view properly.</h2>
            <iframe src="${base64Content}" width="800px" height="100%" style="border:none;"></iframe>
        </body>
        </html>
    `;
        newWindow.document.write(additionalHtmlContent);
    } else {
        //console.log('Unknown');
        const additionalHtmlContent = `
        <html>
        <head>
            <title>File Preview</title>
        </head>
        <body>
            `+ windowButtonsContent + `
            <h2>File Type Unknown : File might not view properly.</h2>
            <iframe src="${base64Content}" width="800px" height="100%" style="border:none;"></iframe>
        </body>
        </html>
    `;
        newWindow.document.write(additionalHtmlContent);
    }

    newWindow.document.close();
}

const nofileMessageReturn = () => {
    alert("There is no file to view");
}



const detectFileType = (base64Data) => {
    const base64String = base64Data.toString();
    // Check if the base64 string has a data URL scheme prefix
    if (base64String.startsWith('data:')) {
        const mimeType = base64String.split(',')[0].split(':')[1].split(';')[0];

        if (mimeType.startsWith('image/')) {
            return 'image';
        } else if (mimeType === 'application/pdf') {
            return 'pdf';
        } else {
            return 'other';
        }
    } else {
        return 'unknown';
    }
}

const getCurrentDateTimeString = () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const dateTimeString = `${year}${month}${day}${hours}${minutes}${seconds}`;

    return dateTimeString;
}

const getCurrentDateString = () => {
    
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(now.getDate()).padStart(2, '0');

    const dateString = `${year}${month}${day}`;

    return dateString;
}

const getCurrentTimeString = () => {
    
    const now = new Date();

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const timeString = `${hours}${minutes}${seconds}`;
    
    return {timeString : timeString, hourString : hours, minuteString:minutes, secondString:seconds};
}

const getGiveDateString = (date) => {
    
    const year = date.split('T')[0].split('-')[0];
    const month= date.split('T')[0].split('-')[1];
    const day = date.split('T')[0].split('-')[2];

    const giveDateString = `${year}${month}${day}`;

    return giveDateString;
}

const getGiveTimeString = (date) => {
    //console.log((date.split('T')[1]).slice(0,8))
    
    const hours = (date.split('T')[1]).slice(0,8).split(':')[0];
    const minutes = (date.split('T')[1]).slice(0,8).split(':')[1];
    const seconds = (date.split('T')[1]).slice(0,8).split(':')[2];

    const giveTimeString = `${hours}${minutes}${seconds}`;

    return {timeString : giveTimeString, hourString : hours, minuteString : minutes, secondString : seconds};
}

//------------------------------------------ Open File  in new limited features window Ends -------------------------------------------------------


const getDateReturned = (format,givendate) => {
    let nowDate = new Date(givendate);
 // retrive 0 to 11   
    let month = nowDate.getMonth() + 1;//return 0jan-11Dec
//retrive 1-31
    let date = nowDate.getDate();//return 1-31
//year 
    let year = nowDate.getFullYear();

    if(month < 10){
        month = "0"+ month;
    }
    if(date < 10){
        date = "0" + date;
    }


    return year + "-" + month + "-" + date ;
}



//------------------------------------------ Get Data from String Property Name -------------------------------------------------------
// {name: "Kamal" , unittype_id:{id:1, name:"Kg"}} / "unittype_id.name"
const getDataInsideObject = (objectData , propertyPath)=> {

    value = (ob, path) => {
 
     // [ "unittype_id" , "name"]
     let propertyPathList = path.split('.');
     if (propertyPathList.length > 1) {
       
       if ( typeof ob[propertyPathList[0]] === 'object') {
        return value(ob[propertyPathList[0]], propertyPathList.splice(1).join('.'));
       }
     }else{
       return ob[propertyPathList[0]];
     }
   }
 
   return value(objectData, propertyPath);
 
 }

//------------------------------------------ Get Data from String Property Name -------------------------------------------------------