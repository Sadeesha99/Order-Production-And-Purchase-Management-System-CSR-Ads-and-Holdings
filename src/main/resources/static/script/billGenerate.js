//function for the Printing Order Invoice
const printOrderDetails = (customerOrderObject, tableFillDataList) => {
    // Open a new window with limited features


    let addedDate = (customerOrderObject.added_time.split('T')[0])
    let addedTime = (customerOrderObject.added_time.split('T')[1].slice(0, 8))

    let customerName = customerOrderObject.customer_id.name;
    let customerMobile = customerOrderObject.customer_id.mobile;

    let addedUsername = ajaxGetRequestMapping("/getuserbyid/" + customerOrderObject.added_user_id).username;

    let orderDateHTML = `<strong id="orderDate">Ordered Date :</strong><br>
                        ${addedDate}<br>
                        <strong id="requiredDate">Required Date :</strong><br>
                        ${customerOrderObject.required_date}<br>
                        <br>`;


    let windowButtonsContent =
        `<div id="nonPrintableContent" style = "margin: 15px;">
                 <button type="button" class="btn btn-outline-secondary" 
                 onclick="printWindow()">Print</button>
                 <script>
                    function printWindow() {
                        document.getElementById('nonPrintableContent').style.display = 'none';
                        window.print()
                        document.getElementById('nonPrintableContent').style.display = 'block';
                    }
                </script>
            </div>`


    const billHTMLString =
        `<!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Customer Order (${customerOrderObject.orderno})</title>
        
            <!-- Boostrap CSS -->
            <link rel="stylesheet" href="/bootstrap-5.2.3/css/bootstrap.min.css">
        
            <!-- Boostrap Js -->
            <script src="/bootstrap-5.2.3/js/bootstrap.bundle.min.js"></script>
        
            <!-- Font Awesome CSS -->
            <link rel="stylesheet" href="/fontawesome-6.4.2/css/all.css">
        
            <style>
                .invoice-title h2,
                .invoice-title h3 {
                    display: inline-block;
                }
        
                .table>tbody>tr>.no-line {
                    border-top: none;
                }
        
                .table>thead>tr>.no-line {
                    border-bottom: none;
                }
        
                .table>tbody>tr>.thick-line {
                    border-top: 2px solid;
                }
            </style>
        
        </head>
        
        <body>
        ` + windowButtonsContent + `
            <div class="container">
                <div class="row">
                    <div class="col-12">
                        <div class="invoice-title d-flex">
                            <div class="col-8">
                                <h2>CSR Ads and Holdings (Pvt) Ltd</h2>
                            </div>
                            <div class="col-4 text-end">
                                <h3>Invoice No.</h3><br>
                                <h4 class="pull-right">${customerOrderObject.orderno}</h4>
                            </div>
                        </div>
                        <hr>
                        <div class="row">
                            <div class="col-8">
                                <address>
                                    <strong>Customer :</strong><br>
                                    ${customerName}<br>
                                    ${customerMobile}
                                </address>
                            </div>
                            <div class="col-4 text-end">
                                <address>
                                ${orderDateHTML}
                                </address>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-8">
                                <address>
                                    <strong>Payments :</strong><br>
                                    Advanced Payment :<br> 
                                    LKR ${parseFloat(customerOrderObject.first_payment).toFixed(2)}
                                </address>
                            </div>
                            <div class="col-4 text-end">
                                <address>
                                    <strong>Submited By :</strong><br>
                                    ${addedUsername}<br>
                                    @ ${addedTime}
                                </address>
                            </div>
                        </div>
                    </div>
                </div>
        
                <div class="row">
                    <div class="col-12">
                        <div class="panel panel-default">
                            <div class="panel-heading">
                                <h3 class="panel-title"><strong>Order Summary</strong></h3>
                            </div>
                            <div class="panel-body">
                                <div class="table-responsive">
                                    <table class="table table-condensed">
                                        <thead>
                                            <tr>
                                                <td class="text-end"><strong>#</strong></td>
                                                <td class="text-end"><strong>Product</strong></td>
                                                <td class="text-end"><strong>Price</strong></td>
                                                <td class="text-end"><strong>Quantity</strong></td>
                                                <td class="text-end"><strong>Totals</strong></td>
                                            </tr>
                                        </thead>
                                        <tbody id="tbodyPrintBillTable">
                                            <!-- Calling the Table fill data -->
                                            ` + tableFillDataList + `
                                            <tr>
                                                <td class="thick-line"></td>
                                                <td class="thick-line"></td>
                                                <td class="thick-line"></td>
                                                <td class="thick-line text-end"><strong>Total Paid Amount</strong></td>
                                                <td class="thick-line text-end">LKR ${(parseFloat(customerOrderObject.total_bill) - parseFloat(customerOrderObject.remaining_balance)).toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td class="no-line"></td>
                                                <td class="no-line"></td>
                                                <td class="no-line"></td>
                                                <td class="no-line text-end"><strong>Balance</strong></td>
                                                <td class="no-line text-end">LKR ${parseFloat(customerOrderObject.remaining_balance).toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td class="no-line"></td>
                                                <td class="no-line"></td>
                                                <td class="no-line"></td>
                                                <td class="no-line text-end"><strong>Total Amount</strong></td>
                                                <td class="no-line text-end">LKR ${parseFloat(customerOrderObject.total_bill).toFixed(2)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </body>
        
        <script src="script/commonFunction.js"></script>
        <script src="script/billGenerate.js"></script>

        </html>`

    const windowFeatures = "menubar=no,toolbar=no,location=no,status=no,scrollbars=yes,resizable=yes,width=900,height=600";
    const newWindow = window.open("", "_blank", windowFeatures);
    newWindow.document.write(billHTMLString);
    newWindow.document.close();
}


//function for the Printing Quotation
const printQuotationDetails = (customerOrderObject, billType, tableFillDataList) => {
    // Open a new window with limited features

    const loadDateTime = getCurrentDateTimeString();
    let billNo = '';
    if (billType == 'Quotation') {
        billNo = billNo + loadDateTime.slice(2, 14);
    } else if (billType == 'Invoice') {
        billNo = billNo + customerOrderObject.orderno;
    }
    let customerName = customerOrderObject.customer_id.name;
    let customerMobile = customerOrderObject.customer_id.mobile;

    let orderDateHTML = '';

    if (!customerOrderObject.added_time) {
        orderDateHTML = orderDateHTML + `<strong id="orderDate">Ordered Date :</strong><br>
                                        ${customerOrderObject.required_date}<br>`
    } else if (customerOrderObject.added_time != null) {
        orderDateHTML = orderDateHTML + `<strong id="orderDate">Order Date :</strong><br>
                                        ${((customerOrderObject.added_time).split('T')[0])}<br>
                                        <strong id="requiredDate">Required Date :</strong><br>
                                        ${customerOrderObject.required_date}<br>
                                        <br>`
    }

    let windowButtonsContent =
        `<div id="nonPrintableContent" style = "margin: 15px;">
                 <button type="button" class="btn btn-outline-secondary" 
                 onclick="printWindow()">Print</button>
                 <script>
                    function printWindow() {
                        document.getElementById('nonPrintableContent').style.display = 'none';
                        window.print()
                        document.getElementById('nonPrintableContent').style.display = 'block';
                    }
                </script>
            </div>`


    const billHTMLString =
        `<!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Quotation (${billNo})</title>
        
            <!-- Boostrap CSS -->
            <link rel="stylesheet" href="/bootstrap-5.2.3/css/bootstrap.min.css">
        
            <!-- Boostrap Js -->
            <script src="/bootstrap-5.2.3/js/bootstrap.bundle.min.js"></script>
        
            <!-- Font Awesome CSS -->
            <link rel="stylesheet" href="/fontawesome-6.4.2/css/all.css">
        
            <style>
                .invoice-title h2,
                .invoice-title h3 {
                    display: inline-block;
                }
        
                .table>tbody>tr>.no-line {
                    border-top: none;
                }
        
                .table>thead>tr>.no-line {
                    border-bottom: none;
                }
        
                .table>tbody>tr>.thick-line {
                    border-top: 2px solid;
                }
            </style>
        
        </head>
        
        <body>
        ` + windowButtonsContent + `
            <div class="container">
                <div class="row">
                    <div class="col-12">
                        <div class="invoice-title d-flex">
                            <div class="col-8">
                                <h2>CSR Ads and Holdings (Pvt) Ltd</h2>
                            </div>
                            <div class="col-4 text-end">
                                <h3>${billType}</h3><br>
                                <h4 class="pull-right">#${billNo}</h4>
                            </div>
                        </div>
                        <hr>
                        <div class="row">
                            <div class="col-8">
                                <address>
                                    <strong>Customer :</strong><br>
                                    ${customerName}<br>
                                    ${customerMobile}
                                </address>
                            </div>
                            <div class="col-4 text-end">
                                <address>
                                ${orderDateHTML}
                                </address>
                            </div>
                        </div>
                    </div>
                </div>
        
                <div class="row">
                    <div class="col-12">
                        <div class="panel panel-default">
                            <div class="panel-heading">
                                <h3 class="panel-title"><strong>Product List</strong></h3>
                            </div>
                            <div class="panel-body">
                                <div class="table-responsive">
                                    <table class="table table-condensed">
                                        <thead>
                                            <tr>
                                                <td class="text-end"><strong>#</strong></td>
                                                <td class="text-end"><strong>Product</strong></td>
                                                <td class="text-end"><strong>Price</strong></td>
                                                <td class="text-end"><strong>Quantity</strong></td>
                                                <td class="text-end"><strong>Totals</strong></td>
                                            </tr>
                                        </thead>
                                        <tbody id="tbodyPrintBillTable">
                                            <!-- Calling the Table fill data -->
                                            ` + tableFillDataList + `
                                            <tr>
                                                <td class="thick-line"></td>
                                                <td class="thick-line"></td>
                                                <td class="thick-line"></td>
                                                <td class="thick-line text-end"><strong>Total Amout</strong></td>
                                                <td class="thick-line text-end">LKR ${parseFloat(customerOrderObject.total_bill).toFixed(2)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </body>
        
        <script src="script/commonFunction.js"></script>
        <script src="script/billGenerate.js"></script>

        </html>`

    const windowFeatures = "menubar=no,toolbar=no,location=no,status=no,scrollbars=yes,resizable=yes,width=900,height=600";
    const newWindow = window.open("", "_blank", windowFeatures);
    newWindow.document.write(billHTMLString);
    newWindow.document.close();
}


//function for the Printing Order Production
const printProductionReport = (orderObject, productionOB, table1, table2) => {
    // Open a new window with limited features


    let addedDate = (orderObject.added_time.split('T')[0])
    //let addedTime = (orderObject.added_time.split('T')[1].slice(0, 8))

    let customerName = orderObject.customer_id.name;
    let customerMobile = orderObject.customer_id.mobile;

    // let addedUsername = ajaxGetRequestMapping("/getuserbyid/"+orderObject.added_user_id).username;


    let windowButtonsContent =
        `<div id="nonPrintableContent" style = "margin: 15px;">
                 <button type="button" class="btn btn-outline-secondary" 
                 onclick="printWindow()">Print</button>
                 <script>
                    function printWindow() {
                        document.getElementById('nonPrintableContent').style.display = 'none';
                        window.print()
                        document.getElementById('nonPrintableContent').style.display = 'block';
                    }
                </script>
            </div>`


    const billHTMLString =
        `<!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Production Report  ${productionOB.productionno}</title>
        
            <!-- Boostrap CSS -->
            <link rel="stylesheet" href="/bootstrap-5.2.3/css/bootstrap.min.css">
        
            <!-- Boostrap Js -->
            <script src="/bootstrap-5.2.3/js/bootstrap.bundle.min.js"></script>
        
            <!-- Font Awesome CSS -->
            <link rel="stylesheet" href="/fontawesome-6.4.2/css/all.css">
        
            <style>
                .invoice-title h2,
                .invoice-title h3 {
                    display: inline-block;
                }
        
                .table>tbody>tr>.no-line {
                    border-top: none;
                }
        
                .table>thead>tr>.no-line {
                    border-bottom: none;
                }
        
                .table>tbody>tr>.thick-line {
                    border-top: 2px solid;
                }
            </style>
        
        </head>
        
        <body>
        ` + windowButtonsContent + `
            <div class="container">
                <div class="row">
                    <div class="col-12">
                        <div class="invoice-title d-flex">
                            <div class="col-8 justify-content-center">
                                <h2>Production Report Activity</h2>
                                <h4>Production No : ${productionOB.productionno}</h4>
                            </div>
                        </div>
                        <hr>
                        <div class="row">
                            <div class="col-8">
                                <address>
                                    <strong>Order No :</strong><br>
                                    ${productionOB.corderno}
                                </address>
                                <address>
                                    <strong>Customer :</strong><br>
                                    ${customerName}<br>
                                    ${customerMobile}
                                </address>
                            </div>
                            <div class="col-4 text-end">
                                <address>
                                <strong>Order Date :</strong><br>
                                ${addedDate}
                                </address>
                                <address>
                                <strong>Required Date :</strong><br>
                                ${orderObject.required_date}
                                </address>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-8">
                                <address>
                                    <strong>Production Status :</strong><br>
                                    ${productionOB.production_status_id.name}
                                </address>
                            </div>
                            <div class="col-4 text-end">
                                <address>
                                    <strong>Product :</strong><br>
                                    ${productionOB.product_id.name}<br>
                                    (${productionOB.product_id.productno})
                                </address>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-12">
                        <div class="panel panel-default">
                            <div class="panel-heading">
                                <h3 class="panel-title"><strong>Production Activities</strong></h3>
                            </div>
                            <div class="panel-body">
                                <div class="table-responsive">
                                    <table class="table table-condensed">
                                        <thead>
                                            <tr>
                                                <td class="text-center align-middle" rowspan="2"><strong>#</strong></td>
                                                <td class="text-center align-middle" rowspan="2"><strong>Date</strong></td>
                                                <td class="text-center align-middle" rowspan="2"><strong>Time</strong></td>
                                                <td class="text-center align-middle" colspan="3"><strong> Quantity</strong></td>
                                            </tr>
                                            <tr>
                                                <td class="text-center"><strong>Total </strong></td>
                                                <td class="text-center"><strong>Produced</strong></td>
                                                <td class="text-center"><strong>Completed</strong></td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <!-- foreach ($order->lineItems as $line) or some such thing here -->
                                            ${table1}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <br>
                <div class="row">
                    <div class="col-12">
                        <div class="panel panel-default">
                            <div class="panel-heading">
                                <h3 class="panel-title"><strong>Material Usage</strong></h3>
                            </div>
                            <div class="panel-body">
                                <div class="table-responsive">
                                    <table class="table table-condensed">
                                <thead>
                                    <tr>
                                        <td class="text-center align-middle"><strong>#</strong></td>
                                        <td class="text-center align-middle"><strong>Mat No.</strong></td>
                                        <td class="text-center align-middle"><strong>Material Name</strong></td>
                                        <td class="text-center align-middle"><strong>Processed Date</strong></td>
                                        <td class="text-center align-middle"><strong>Time</strong></td>
                                        <td class="text-center align-middle"><strong>Usage</strong></td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <!-- foreach ($order->lineItems as $line) or some such thing here -->
                                    ${table2}
                                </tbody>
                            </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <hr>
                <h4>CSR Ads and Holdings (For internal use only)</h4>
            </div>
        </body>
        
        <script src="script/commonFunction.js"></script>
        <script src="script/billGenerate.js"></script>

        </html>`

    const windowFeatures = "menubar=no,toolbar=no,location=no,status=no,scrollbars=yes,resizable=yes,width=900,height=600";
    const newWindow = window.open("", "_blank", windowFeatures);
    newWindow.document.write(billHTMLString);
    newWindow.document.close();
}


//function for the Printing Order Payment Invoice
const printPaymentReceipt = (passedObject, tableFillDataList) => {
    // Open a new window with limited features

    let customerOrderObject = passedObject.customer_order_id;

    let addedDate = (customerOrderObject.added_time.split('T')[0])
    let PaymentDate = (passedObject.added_time.split('T')[0])
    let PaymentTime = (passedObject.added_time.split('T')[1].slice(0, 8))

    let customerName = customerOrderObject.customer_id.name;
    let customerMobile = customerOrderObject.customer_id.mobile;

    let addedUsername = ajaxGetRequestMapping("/getuserbyid/" + passedObject.added_user_id).username;

    let orderDateHTML = `<strong id="orderDate">Ordered Date :</strong><br>
                        ${addedDate}<br>
                        <strong id="requiredDate">Required Date :</strong><br>
                        ${customerOrderObject.required_date}<br>
                        <br>`;


    let orderCancel = '';
    if(customerOrderObject.customer_order_status_id.name == "Canceled"){
        orderCancel = orderCancel +"( Order Canceled )";
    }


    let windowButtonsContent =
        `<div id="nonPrintableContent" style = "margin: 15px;">
                 <button type="button" class="btn btn-outline-secondary" 
                 onclick="printWindow()">Print</button>
                 <script>
                    function printWindow() {
                        document.getElementById('nonPrintableContent').style.display = 'none';
                        window.print()
                        document.getElementById('nonPrintableContent').style.display = 'block';
                    }
                </script>
            </div>`


    const billHTMLString =
        `<!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Customer Payment Receipt (${passedObject.paymentno})</title>
        
            <!-- Boostrap CSS -->
            <link rel="stylesheet" href="/bootstrap-5.2.3/css/bootstrap.min.css">
        
            <!-- Boostrap Js -->
            <script src="/bootstrap-5.2.3/js/bootstrap.bundle.min.js"></script>
        
            <!-- Font Awesome CSS -->
            <link rel="stylesheet" href="/fontawesome-6.4.2/css/all.css">
        
            <style>
                .invoice-title h2,
                .invoice-title h3 {
                    display: inline-block;
                }
        
                .table>tbody>tr>.no-line {
                    border-top: none;
                }
        
                .table>thead>tr>.no-line {
                    border-bottom: none;
                }
        
                .table>tbody>tr>.thick-line {
                    border-top: 2px solid;
                }
            </style>
        
        </head>
        
        <body>
        ` + windowButtonsContent + `
            <div class="container">
                <div class="row">
                    <div class="col-12">
                        <div class="invoice-title d-flex">
                            <div class="col-8">
                                <h2>CSR Ads and Holdings (Pvt) Ltd</h2>
                                <h4>Payment Receipt ${orderCancel}</h4>
                            </div>
                            <div class="col-4 text-end">
                                <h3>Invoice No.</h3><br>
                                <h4 class="pull-right">${customerOrderObject.orderno}</h4>
                            </div>
                        </div>
                        <hr>
                        <div class="row">
                            <div class="col-8">
                                <address>
                                    <strong>Customer :</strong><br>
                                    ${customerName}<br>
                                    ${customerMobile}
                                </address>
                            </div>
                            <div class="col-4 text-end">
                                <address>
                                ${orderDateHTML}
                                </address>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-8">
                                <address>
                                    <strong>Payments :</strong><br>
                                    Payment No : 
                                    ${passedObject.paymentno}<br> 
                                    LKR ${parseFloat(passedObject.amount).toFixed(2)}
                                </address>
                            </div>
                            <div class="col-4 text-end">
                                <address>
                                    <strong>Payment Submited By :</strong><br>
                                    ${addedUsername}<br>
                                    ${PaymentDate}<br>
                                    @ ${PaymentTime}
                                </address>
                            </div>
                        </div>
                    </div>
                </div>
        
                <div class="row">
                    <div class="col-12">
                        <div class="panel panel-default">
                            <div class="panel-heading">
                                <h3 class="panel-title"><strong>Order Summary</strong></h3>
                            </div>
                            <div class="panel-body">
                                <div class="table-responsive">
                                    <table class="table table-condensed">
                                        <thead>
                                            <tr>
                                                <td class="text-end"><strong>#</strong></td>
                                                <td class="text-end"><strong>Product</strong></td>
                                                <td class="text-end"><strong>Price</strong></td>
                                                <td class="text-end"><strong>Quantity</strong></td>
                                                <td class="text-end"><strong>Totals</strong></td>
                                            </tr>
                                        </thead>
                                        <tbody id="tbodyPrintBillTable">
                                            <!-- Calling the Table fill data -->
                                            ` + tableFillDataList + `
                                            <tr>
                                                <td class="thick-line"></td>
                                                <td class="thick-line"></td>
                                                <td class="thick-line"></td>
                                                <td class="thick-line text-end"><strong>Paid Amount</strong></td>
                                                <td class="thick-line text-end">LKR ${parseFloat(passedObject.paid_total).toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td class="no-line"></td>
                                                <td class="no-line"></td>
                                                <td class="no-line"></td>
                                                <td class="no-line text-end"><strong>Balance</strong></td>
                                                <td class="no-line text-end">LKR ${parseFloat(passedObject.remaining_balance).toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td class="no-line"></td>
                                                <td class="no-line"></td>
                                                <td class="no-line"></td>
                                                <td class="no-line text-end"><strong>Total Amount</strong></td>
                                                <td class="no-line text-end">LKR ${parseFloat(customerOrderObject.total_bill).toFixed(2)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </body>
        
        <script src="script/commonFunction.js"></script>
        <script src="script/billGenerate.js"></script>

        </html>`

    const windowFeatures = "menubar=no,toolbar=no,location=no,status=no,scrollbars=yes,resizable=yes,width=900,height=600";
    const newWindow = window.open("", "_blank", windowFeatures);
    newWindow.document.write(billHTMLString);
    newWindow.document.close();
}


//function for the Printing Quotation Request Letter
const printQuotationRequestLetter = (passedObject, tableFillDataList) => {
    // Open a new window with limited features

    let addedDate = (passedObject.added_time.split('T')[0]);
    let addedTime = (passedObject.added_time.split('T')[1].slice(0, 8));

    let businessName = passedObject.supplier_id.businessname;

    const baddressArray = (passedObject.supplier_id.businessaddress.split(','));
    let BusinessAddress = ''
    for (let index = 0; index < (baddressArray.length-1); index++) {
        BusinessAddress = BusinessAddress + baddressArray[index] + ",<br>";
    }
    BusinessAddress = BusinessAddress + baddressArray[baddressArray.length-1]+"<br>";

    let addedUsername = ajaxGetRequestMapping("/getuserbyid/" + passedObject.added_user_id).username;

    let validity = ''

    if(passedObject.quotation_request_status_id.name == "Invalid"){
        validity = validity + "( Invalid Quotation )"
    }


    let windowButtonsContent =
        `<div id="nonPrintableContent" style = "margin: 15px;">
                 <button type="button" class="btn btn-outline-secondary" 
                 onclick="printWindow()">Print</button>
                 <script>
                    function printWindow() {
                        document.getElementById('nonPrintableContent').style.display = 'none';
                        window.print()
                        document.getElementById('nonPrintableContent').style.display = 'block';
                    }
                </script>
            </div>`



    const billHTMLString =
        `<!DOCTYPE html>
            <html lang="en">

            <head id="headTag">
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Quotation Request (${passedObject.quot_req_no})</title>

                <!-- Boostrap CSS -->
                <link rel="stylesheet" href="/bootstrap-5.2.3/css/bootstrap.min.css">

                <!-- Boostrap Js -->
                <script src="/bootstrap-5.2.3/js/bootstrap.bundle.min.js"></script>

                <!-- Font Awesome CSS -->
                <link rel="stylesheet" href="/fontawesome-6.4.2/css/all.css">

                <style>
                    .invoice-title h2,
                    .invoice-title h3 {
                        display: inline-block;
                    }

                    .table>tbody>tr>.no-line {
                        border-top: none;
                    }

                    .table>thead>tr>.no-line {
                        border-bottom: none;
                    }

                    .table>tbody>tr>.thick-line {
                        border-top: 2px solid;
                    }
                </style>

            </head>

        
            <body>
            `+ windowButtonsContent + `
                <div class="container">
                    <div class="row">
                        <div class="col-12">
                            <div class="invoice-title d-flex">
                                <div class="col-2"></div>
                                <div class="col-8 text-center">
                                    <h2>CSR Ads and Holdings (Pvt) Ltd</h1> <br>
                                    <p style="font-weight: bold">${validity}</p>
                                </div>
                                <div class="col-2"></div>
                            </div>
                            <hr>
                            <div class="row">
                                <div class="col-8">
                                </div>
                                <div class="col-4 text-end">
                                    <address>
                                        <strong>CSR Ads and Holdings</strong><br>
                                        301/3/A,<br>
                                        Galahitiyawa,<br>
                                        Ganemulla.<br>
                                        ${addedDate}
                                    </address>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-8">
                                    <address>
                                        <strong>${businessName}</strong><br>
                                        ${BusinessAddress}
                                    </address>
                                </div>
                                <div class="col-4 text-end">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-12">
                            <h5 class="text-center"><strong> Quatation Request for Materials </strong> </h5>
                            <hr>

                            <article style="text-align: justify;">
                                On behalf of CSR Ads and Holdings Pvt Ltd, I write this to request a quotation for materials use for
                                our production
                                that you supply in wholesale. The details of the items are as follows:
                            </article>
                            <div class="row">
                                <div class="row mt-4 mb-3" style="align-items: center;">
                                    <div class="card">
                                        <div class="card-header">
                                            <h5 class="text-xs-center"><strong>Material summary</strong></h5>
                                        </div>
                                        <div class="card-block">
                                            <div class="table-responsive">
                                                <table class="table table-condensed">
                                                    <thead>
                                                        <tr>
                                                            <th> # </th> <!-- # , No , Index  -->
                                                            <th> Material No </th>
                                                            <th> Material Name </th>
                                                            <th> Quantity </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                    ${tableFillDataList}
                                                    </tbody>
                                                </table>
                                                <p><span style="font-weight: bold;">**Note : </span>These material quantities are based on re-order 
                                                quantities calculated by average usage of that specific material. That amount can be changed in the purchase order.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p style="text-align: justify;">
                                We would appreciate it if you could provide us with the best possible pricing for the above items.
                                Additionally, please include any applicable taxes, delivery charges, and payment terms.

                                The required delivery date for these supplies is with in week of purchase order. Kindly confirm if you can
                                meet
                                this delivery deadline.

                                We look forward to receiving your quotation at your earliest convenience. Should you need any
                                further
                                details, please feel free to contact me.

                                Thank you for your prompt attention to this request. We are happy to have successful business
                                relationship with your company.

                                Thank you for your attention to this matter.


                            </p>
                            <div class="box">
                                ${addedUsername}<br>
                                CSR Ads And Holdings Pvt Ltd.<br>
                                ${addedDate} @${addedTime}
                            </div>

                        </div>
                    </div>
                </div>
            </body>

            <script src="script/commonFunction.js"></script>
            <script src="script/billGenerate.js"></script>

        </html>`

    const windowFeatures = "menubar=no,toolbar=no,location=no,status=no,scrollbars=yes,resizable=yes,width=900,height=600";
    const newWindow = window.open("", "_blank", windowFeatures);
    newWindow.document.write(billHTMLString);
    newWindow.document.close();
}


//function for the Printing Received Quotation
const printReceivedQuotation = (passedObject, tableFillDataList) => {
    // Open a new window with limited features

    let addedDate = (passedObject.added_time.split('T')[0]);
    let addedTime = (passedObject.added_time.split('T')[1].slice(0, 8));

    let businessName = passedObject.quotation_request_id.supplier_id.businessname;

    const baddressArray = (passedObject.quotation_request_id.supplier_id.businessaddress.split(','));
    let BusinessAddress = ''
    for (let index = 0; index < (baddressArray.length-1); index++) {
        BusinessAddress = BusinessAddress + baddressArray[index] + ",<br>";
    }
    BusinessAddress = BusinessAddress + baddressArray[baddressArray.length-1]+"<br>";

    let addedUsername = ajaxGetRequestMapping("/getuserbyid/" + passedObject.added_user_id).username;

    let quotationReqaddedUsername = ajaxGetRequestMapping("/getuserbyid/" + passedObject.quotation_request_id.added_user_id).username;

    let suppilerQuotationNo = ''

    if(passedObject.suppiler_quotation_no != null ){
        suppilerQuotationNo = suppilerQuotationNo +"( "+passedObject.suppiler_quotation_no+" )";
    }
    let validity = '';
    if(passedObject.received_quotation_status_id.name == "Invalid"){
        validity = validity + "---------------- Expired Quotation ----------------"
    }else{
        validity = validity + "( Expire Date : " + passedObject.expire_date +" )";
    }
    let windowButtonsContent =
        `<div id="nonPrintableContent" style = "margin: 15px;">
                 <button type="button" class="btn btn-outline-secondary" 
                 onclick="printWindow()">Print</button>
                 <script>
                    function printWindow() {
                        document.getElementById('nonPrintableContent').style.display = 'none';
                        window.print()
                        document.getElementById('nonPrintableContent').style.display = 'block';
                    }
                </script>
            </div>`



    const billHTMLString =
        `<!DOCTYPE html>
            <html lang="en">

            <head id="headTag">
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Received Quotation (${passedObject.received_quot_no})</title>

                <!-- Boostrap CSS -->
                <link rel="stylesheet" href="/bootstrap-5.2.3/css/bootstrap.min.css">

                <!-- Boostrap Js -->
                <script src="/bootstrap-5.2.3/js/bootstrap.bundle.min.js"></script>

                <!-- Font Awesome CSS -->
                <link rel="stylesheet" href="/fontawesome-6.4.2/css/all.css">

                <style>
                    .invoice-title h2,
                    .invoice-title h3 {
                        display: inline-block;
                    }

                    .table>tbody>tr>.no-line {
                        border-top: none;
                    }

                    .table>thead>tr>.no-line {
                        border-bottom: none;
                    }

                    .table>tbody>tr>.thick-line {
                        border-top: 2px solid;
                    }
                </style>

            </head>

        
            <body>
            `+ windowButtonsContent + `
                <div class="container">
                    <div class="row">
                        <div class="col-12">
                            <div class="invoice-title d-flex">
                                <div class="col-2"></div>
                                <div class="col-8 text-center">
                                    <h2>Received Quotation </h1> <br>
                                    <p style="font-weight: bold">
                                    ${businessName}<br>
                                    ${suppilerQuotationNo}</p>
                                </div>
                                <div class="col-2"></div>
                            </div>
                            <hr>
                            <p style="font-weight: bold" class="text-center">${validity}</p>
                            <div class="row">
                                <div class="col-8">
                                    <address>
                                        <strong>Address :</strong><br>
                                        ${BusinessAddress}
                                    </address>
                                </div>
                                <div class="col-4 text-end">
                                    <strong>System Submitted By :</strong><br>
                                    ${addedUsername}<br>
                                    ${addedDate} @${addedTime}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-12">
                            <h5 class="text-center"><strong> Received Quatation for Materials </strong> </h5>
                            <hr>

                            <article style="text-align: justify;">
                                We have received this quotation from ${businessName}, as a response for our quoation request ${passedObject.quotation_request_id.quot_req_no} on
                                ${addedDate} by ${quotationReqaddedUsername}.
                            </article>
                            <div class="row">
                                <div class="row mt-4 mb-3" style="align-items: center;">
                                    <div class="card">
                                        <div class="card-header">
                                            <h5 class="text-xs-center"><strong>Material Summary</strong></h5>
                                        </div>
                                        <div class="card-block">
                                            <div class="table-responsive">
                                                <table class="table table-condensed">
                                                    <thead>
                                                        <tr>
                                                            <th class="text-end"> # </th> <!-- # , No , Index  -->
                                                            <th class="text-end"> Material No </th>
                                                            <th class="text-end"> Material Name </th>
                                                            <th class="text-end"> Unit Price (LKR)</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                    ${tableFillDataList}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div> 
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </body>

            <script src="script/commonFunction.js"></script>
            <script src="script/billGenerate.js"></script>

        </html>`

    const windowFeatures = "menubar=no,toolbar=no,location=no,status=no,scrollbars=yes,resizable=yes,width=900,height=600";
    const newWindow = window.open("", "_blank", windowFeatures);
    newWindow.document.write(billHTMLString);
    newWindow.document.close();
}


//function for the Printing Purchase Order Letter
const printPurchaseOrderLetter = (passedObject, tableFillDataList) => {
    // Open a new window with limited features

    let addedDate = (passedObject.added_time.split('T')[0]);
    let addedTime = (passedObject.added_time.split('T')[1].slice(0, 8));

    let businessName = passedObject.supplier_id.businessname;

    const baddressArray = (passedObject.supplier_id.businessaddress.split(','));
    let BusinessAddress = ''
    for (let index = 0; index < (baddressArray.length-1); index++) {
        BusinessAddress = BusinessAddress + baddressArray[index] + ",<br>";
    }
    BusinessAddress = BusinessAddress + baddressArray[baddressArray.length-1]+"<br>";

    //let addedUsername = ajaxGetRequestMapping("/getuserbyid/" + passedObject.added_user_id).username;

    let employeeOB = ajaxGetRequestMapping("/getempbyuserid/" + passedObject.added_user_id);

    let validity = ''

    if(passedObject.purchase_order_status_id.name != "Send"){
        validity = validity + "( Invalid Purchase Order )"
    }
    if(passedObject.deleted_user_id != null){
        let deletedUser = ajaxGetRequestMapping("/getuserbyid/" + passedObject.added_user_id).username;
        let deletedDate = (passedObject.deleted_time.split('T')[0]);
        let deletedTime = (passedObject.deleted_time.split('T')[1].slice(0, 8));
        validity = "( Invalid Purchase Order : Deleted By "+deletedUser+") <br> On "+deletedDate+" @"+deletedTime;
    }

    let noteofPOrder = ''
    if(passedObject.porder_description!=null){
        noteofPOrder = '<span style="font-weight: bold;">**Note : </span>'+ passedObject.porder_description;
    }


    let windowButtonsContent =
        `<div id="nonPrintableContent" style = "margin: 15px;">
                 <button type="button" class="btn btn-outline-secondary" 
                 onclick="printWindow()">Print</button>
                 <script>
                    function printWindow() {
                        document.getElementById('nonPrintableContent').style.display = 'none';
                        window.print()
                        document.getElementById('nonPrintableContent').style.display = 'block';
                    }
                </script>
            </div>`



    const billHTMLString =
        `<!DOCTYPE html>
            <html lang="en">

            <head id="headTag">
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Purchase Order (${passedObject.purchase_order_no})</title>

                <!-- Boostrap CSS -->
                <link rel="stylesheet" href="/bootstrap-5.2.3/css/bootstrap.min.css">

                <!-- Boostrap Js -->
                <script src="/bootstrap-5.2.3/js/bootstrap.bundle.min.js"></script>

                <!-- Font Awesome CSS -->
                <link rel="stylesheet" href="/fontawesome-6.4.2/css/all.css">

                <style>
                    .invoice-title h2,
                    .invoice-title h3 {
                        display: inline-block;
                    }

                    .table>tbody>tr>.no-line {
                        border-top: none;
                    }

                    .table>thead>tr>.no-line {
                        border-bottom: none;
                    }

                    .table>tbody>tr>.thick-line {
                        border-top: 2px solid;
                    }
                </style>

            </head>

        
            <body>
            `+ windowButtonsContent + `
                <div class="container">
                    <div class="row">
                        <div class="col-12">
                            <div class="invoice-title d-flex">
                                <div class="col-2"></div>
                                <div class="col-8 text-center">
                                    <h2>CSR Ads and Holdings (Pvt) Ltd</h1> <br>
                                    <p style="font-weight: bold">${validity}</p>
                                </div>
                                <div class="col-2"></div>
                            </div>
                            <hr>
                            <div class="row">
                                <div class="col-8">
                                </div>
                                <div class="col-4 text-end">
                                    <address>
                                        <strong>CSR Ads and Holdings</strong><br>
                                        301/3/A,<br>
                                        Galahitiyawa,<br>
                                        Ganemulla.<br>
                                        ${addedDate}
                                    </address>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-8">
                                    <address>
                                        <strong>${businessName}</strong><br>
                                        ${BusinessAddress}
                                    </address>
                                </div>
                                <div class="col-4 text-end">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-12">
                            <h5 class="text-center"><strong> Purchase Order From CSR Ads And Holdings</strong> </h5>
                            <hr>

                            <article style="text-align: justify;">
                                On behalf of CSR Ads and Holdings Pvt Ltd, I write the purchase order for requesting materials that use in
                                our production
                                which you supply in wholesale. The details of the materials are as follows:
                            </article>
                            <div class="row">
                                <div class="row mt-4 mb-3" style="align-items: center;">
                                    <div class="card">
                                        <div class="card-header">
                                            <h5 class="text-xs-center"><strong>Material Summary</strong></h5>
                                        </div>
                                        <div class="card-block">
                                            <div class="table-responsive">
                                                <table class="table table-condensed">
                                                    <thead>
                                                        <tr>
                                                            <td class="text-end"><strong>#</strong></td>
                                                            <td class="text-end"><strong>Mat No.</strong></td>
                                                            <td class="text-end"><strong>Material Name</strong></td>
                                                            <td class="text-end"><strong>Unit Price (LKR)</strong></td>
                                                            <td class="text-end"><strong>Quantity</strong></td>
                                                            <td class="text-end"><strong>Line Total (LKR)</strong></td>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                    ${tableFillDataList}
                                                        <tr>
                                                            <td class="thick-line"></td>
                                                            <td class="thick-line"></td>
                                                            <td class="thick-line"></td>
                                                            <td class="thick-line"></td>
                                                            <td class="thick-line text-end"><strong>Total Amount</strong></td>
                                                            <td class="thick-line text-end">LKR ${parseFloat(passedObject.total_amount).toFixed(2)}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <p>${noteofPOrder}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p><span style="font-weight: bolder;"><span class="text-danger">**</span>Required Date : </span>${passedObject.required_date} ( If materials did not receive within two weeks after this date.
                            This purchase order will be canceled automatically. )</p>
                            <p style="text-align: justify;">
                                We would appreciate it if you could supply us with the before above required date.
                                If there is any issue regarding order processing within given time limit please inform our company.
                                It is crucial for us to know when the ordered material will be received.
                                We look forward to receiving your confirmation at your earliest convenience. 
                                If you need any further details, please feel free to contact us.<br>

                                Thank you for your prompt attention to this request. We are happy to have successful business
                                relationship with your company.
                                Thank you for your attention to this matter.
                            </p>
                            <div class="box">
                                ${employeeOB.fullname} (${employeeOB.designation_id.name})<br>
                                CSR Ads And Holdings Pvt Ltd.<br>
                                ${addedDate} @${addedTime}
                            </div>

                        </div>
                    </div>
                </div>
            </body>

            <script src="script/commonFunction.js"></script>
            <script src="script/billGenerate.js"></script>

        </html>`

    const windowFeatures = "menubar=no,toolbar=no,location=no,status=no,scrollbars=yes,resizable=yes,width=900,height=600";
    const newWindow = window.open("", "_blank", windowFeatures);
    newWindow.document.write(billHTMLString);
    newWindow.document.close();
}

//function for the Printing Material Received Note
const printMRN = (passedObject, tableFillDataList) => {
    // Open a new window with limited features

    let addedDate = (passedObject.added_time.split('T')[0]);
    let addedTime = (passedObject.added_time.split('T')[1].slice(0, 8));

    let businessName = passedObject.purchase_order_id.supplier_id.businessname;

    const baddressArray = (passedObject.purchase_order_id.supplier_id.businessaddress.split(','));
    let BusinessAddress = ''
    for (let index = 0; index < (baddressArray.length-1); index++) {
        BusinessAddress = BusinessAddress + baddressArray[index] + ",<br>";
    }
    BusinessAddress = BusinessAddress + baddressArray[baddressArray.length-1]+"<br>";

    let addedUsername = ajaxGetRequestMapping("/getuserbyid/" + passedObject.added_user_id).username;

    let purchaseOrderUsername = ajaxGetRequestMapping("/getuserbyid/" + passedObject.purchase_order_id.added_user_id).username;

    let suppilerQuotationNo = ''
    if(passedObject.supplier_invoice_no != null ){
        suppilerQuotationNo = suppilerQuotationNo +"( "+ passedObject.supplier_invoice_no +" )";
    }

    let noteofMRN = ''
    if(passedObject.description!=null){
        noteofMRN = '<span style="font-weight: bold;">**Note : </span>'+ passedObject.description;
    }

    let windowButtonsContent =
        `<div id="nonPrintableContent" style = "margin: 15px;">
                 <button type="button" class="btn btn-outline-secondary" 
                 onclick="printWindow()">Print</button>
                 <script>
                    function printWindow() {
                        document.getElementById('nonPrintableContent').style.display = 'none';
                        window.print()
                        document.getElementById('nonPrintableContent').style.display = 'block';
                    }
                </script>
            </div>`



    const billHTMLString =
        `<!DOCTYPE html>
            <html lang="en">

            <head id="headTag">
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Material Received Note (${passedObject.mrn_no})</title>

                <!-- Boostrap CSS -->
                <link rel="stylesheet" href="/bootstrap-5.2.3/css/bootstrap.min.css">

                <!-- Boostrap Js -->
                <script src="/bootstrap-5.2.3/js/bootstrap.bundle.min.js"></script>

                <!-- Font Awesome CSS -->
                <link rel="stylesheet" href="/fontawesome-6.4.2/css/all.css">

                <style>
                    .invoice-title h2,
                    .invoice-title h3 {
                        display: inline-block;
                    }

                    .table>tbody>tr>.no-line {
                        border-top: none;
                    }

                    .table>thead>tr>.no-line {
                        border-bottom: none;
                    }
                    .table>tbody>tr>.btm-line {
                        border-bottom: 2px solid;
                    }

                    .table>tbody>tr>.thick-line {
                        border-top: 2px solid;
                    }
                </style>

            </head>

        
            <body>
            `+ windowButtonsContent + `
                <div class="container">
                    <div class="row">
                        <div class="col-12">
                            <div class="invoice-title d-flex">
                                <div class="col-2"></div>
                                <div class="col-8 text-center">
                                    <h2>CSR Ads and Holdings Pvt Ltd </h1> <br>
                                    <p style="font-weight: bold">
                                    ${businessName}<br>
                                    ${suppilerQuotationNo}</p>
                                </div>
                                <div class="col-2"></div>
                            </div>
                            <hr>
                            <div class="row">
                                <div class="col-8">
                                    <address>
                                        <strong>Business Address :</strong><br>
                                        ${BusinessAddress}
                                    </address>
                                </div>
                                <div class="col-4 text-end">
                                    <strong>MRN Submitted To System By :</strong><br>
                                    ${addedUsername}<br>
                                    ${addedDate} @${addedTime}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-12">
                            <h5 class="text-center"><strong> Material Received Note </strong> </h5>
                            <hr>

                            <article style="text-align: justify;">
                                We have received material from ${businessName}, as a response for our purchase order ${passedObject.purchase_order_id.purchase_order_no} on
                                ${addedDate} by ${purchaseOrderUsername}.
                            </article>
                            <div class="row">
                                <div class="row mt-4 mb-3" style="align-items: center;">
                                    <div class="card">
                                        <div class="card-header">
                                            <h5 class="text-xs-center"><strong>Received Material Summary</strong></h5>
                                        </div>
                                        <div class="card-block">
                                            <div class="table-responsive">
                                                <table class="table table-condensed">
                                                    <thead>
                                                        <tr>
                                                            <th class="text-end"> # </th>
                                                            <th class="text-end"> Material No </th>
                                                            <th class="text-end"> Material Name </th>
                                                            <th class="text-end"> Unit Price (LKR)</th>
                                                            <th class="text-end"> Quantity </th>
                                                            <th class="text-end"> Line Price (LKR)</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                    ${tableFillDataList}
                                                    <tr>
                                                        <td class="thick-line"></td>
                                                        <td class="thick-line"></td>
                                                        <td class="thick-line"></td>
                                                        <td class="thick-line"></td>
                                                        <td class="thick-line text-end"><strong>Total Billed</strong></td>
                                                        <td class="thick-line text-end">LKR ${parseFloat(passedObject.total_bill).toFixed(2)}</td>
                                                    </tr>
                                                    <hr>
                                                    <tr>
                                                        <td class="thick-line"></td>
                                                        <td class="thick-line"></td>
                                                        <td class="thick-line"></td>
                                                        <td class="thick-line"></td>
                                                        <td class="thick-line text-end"><strong>Paid Amount</strong></td>
                                                        <td class="thick-line text-end">LKR ${parseFloat(passedObject.paid_amount).toFixed(2)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td class="no-line btm-line"></td>
                                                        <td class="no-line btm-line"></td>
                                                        <td class="no-line btm-line"></td>
                                                        <td class="no-line btm-line"></td>
                                                        <td class="no-line text-end btm-line"><strong>Balance</strong></td>
                                                        <td class="no-line text-end btm-line">LKR ${(parseFloat(passedObject.total_bill) - parseFloat(passedObject.paid_amount)).toFixed(2)}</td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                                <p>${noteofMRN}</p>
                                            </div>
                                        </div>
                                    </div> 
                                </div>
                            </div>

                        </div>
                    </div>
                    <hr>
                    <h4 class="text-center">CSR Ads and Holdings (For internal use only)</h4>
                </div>
                
            </body>

            <script src="script/commonFunction.js"></script>
            <script src="script/billGenerate.js"></script>

        </html>`

    const windowFeatures = "menubar=no,toolbar=no,location=no,status=no,scrollbars=yes,resizable=yes,width=900,height=600";
    const newWindow = window.open("", "_blank", windowFeatures);
    newWindow.document.write(billHTMLString);
    newWindow.document.close();
}

//function for the Printing Supplier Payment Note
const printSupplierPaymentReceipt = (passedObject, tableFillDataList) => {
    // Open a new window with limited features

    let mrnObj = passedObject.material_received_note_id;

    let addedDate = (mrnObj.added_time.split('T')[0])
    let PaymentDate = (passedObject.added_time.split('T')[0])
    let PaymentTime = (passedObject.added_time.split('T')[1].slice(0, 8))

    let businessName = mrnObj.purchase_order_id.supplier_id.businessname;
    const baddressArray = (mrnObj.purchase_order_id.supplier_id.businessaddress.split(','));
    let BusinessAddress = ''
    for (let index = 0; index < (baddressArray.length-1); index++) {
        BusinessAddress = BusinessAddress + baddressArray[index] + ",<br>";
    }
    BusinessAddress = BusinessAddress + baddressArray[baddressArray.length-1]+"<br>";

    let addedUsername = ajaxGetRequestMapping("/getuserbyid/" + passedObject.added_user_id).username;

    let orderDateHTML = `<strong id="orderDate">Ordered Date :</strong><br>
                        ${mrnObj.purchase_order_id.added_time.split('T')[0]}<br>
                        <strong id="requiredDate">Received Date :</strong><br>
                        ${addedDate}<br>
                        <br>`;





    let windowButtonsContent =
        `<div id="nonPrintableContent" style = "margin: 15px;">
                 <button type="button" class="btn btn-outline-secondary" 
                 onclick="printWindow()">Print</button>
                 <script>
                    function printWindow() {
                        document.getElementById('nonPrintableContent').style.display = 'none';
                        window.print()
                        document.getElementById('nonPrintableContent').style.display = 'block';
                    }
                </script>
            </div>`


    const billHTMLString =
        `<!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Supplier Payment Receipt (${passedObject.supplier_paymentno})</title>
        
            <!-- Boostrap CSS -->
            <link rel="stylesheet" href="/bootstrap-5.2.3/css/bootstrap.min.css">
        
            <!-- Boostrap Js -->
            <script src="/bootstrap-5.2.3/js/bootstrap.bundle.min.js"></script>
        
            <!-- Font Awesome CSS -->
            <link rel="stylesheet" href="/fontawesome-6.4.2/css/all.css">
        
            <style>
                .invoice-title h2,
                .invoice-title h3 {
                    display: inline-block;
                }
        
                .table>tbody>tr>.no-line {
                    border-top: none;
                }
        
                .table>thead>tr>.no-line {
                    border-bottom: none;
                }
        
                .table>tbody>tr>.thick-line {
                    border-top: 2px solid;
                }
            </style>
        
        </head>
        
        <body>
        ` + windowButtonsContent + `
            <div class="container">
                <div class="row">
                    <div class="col-12">
                        <div class="invoice-title d-flex">
                            <div class="col-8">
                                <h2>CSR Ads and Holdings (Pvt) Ltd</h2>
                                <h4>Supplier Payment Note</h4>
                            </div>
                            <div class="col-4 text-end">
                                <h3>Payment No.</h3><br>
                                <h4 class="pull-right">${passedObject.supplier_paymentno}</h4>
                            </div>
                        </div>
                        <hr>
                        <div class="row">
                            <div class="col-8">
                                <address>
                                    <strong>Supplier :</strong><br>
                                    ${businessName}<br>
                                    ${BusinessAddress}
                                </address>
                            </div>
                            <div class="col-4 text-end">
                                <address>
                                ${orderDateHTML}
                                </address>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-8">
                                <address>
                                    <strong>This Payment :</strong><br>
                                    LKR ${parseFloat(passedObject.amount).toFixed(2)}
                                </address>
                            </div>
                            <div class="col-4 text-end">
                                <address>
                                    <strong>Payment Submited By :</strong><br>
                                    ${addedUsername}<br>
                                    ${PaymentDate}<br>
                                    @ ${PaymentTime}
                                </address>
                            </div>
                        </div>
                    </div>
                </div>
        
                <div class="row">
                    <div class="col-12">
                        <div class="panel panel-default">
                            <div class="panel-heading">
                                <h3 class="panel-title"><strong>Order Summary</strong></h3>
                            </div>
                            <div class="panel-body">
                                <div class="table-responsive">
                                    <table class="table table-condensed">
                                        <thead>
                                            <tr>
                                                <td class="text-end"><strong>#</strong></td>
                                                <td class="text-end"><strong>Mat No.</strong></td>
                                                <td class="text-end"><strong>Material Name</strong></td>
                                                <td class="text-end"><strong>Unit Price (Rs.)</strong></td>
                                                <td class="text-end"><strong>Quantity</strong></td>
                                                <td class="text-end"><strong>Line Price (Rs.)</strong></td>
                                            </tr>
                                        </thead>
                                        <tbody id="tbodyPrintBillTable">
                                            <!-- Calling the Table fill data -->
                                            ` + tableFillDataList + `
                                            <tr>
                                                <td class="thick-line"></td>
                                                <td class="thick-line"></td>
                                                <td class="thick-line"></td>
                                                <td class="thick-line"></td>
                                                <td class="thick-line text-end"><strong>Paid Amount</strong></td>
                                                <td class="thick-line text-end">LKR ${parseFloat(mrnObj.paid_amount).toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td class="no-line"></td>
                                                <td class="no-line"></td>
                                                <td class="no-line"></td>
                                                <td class="no-line"></td>
                                                <td class="no-line text-end"><strong>Balance</strong></td>
                                                <td class="no-line text-end">LKR ${(parseFloat(mrnObj.total_bill)-parseFloat(mrnObj.paid_amount)).toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td class="no-line"></td>
                                                <td class="no-line"></td>
                                                <td class="no-line"></td>
                                                <td class="no-line"></td>
                                                <td class="no-line text-end"><strong>Total Amount</strong></td>
                                                <td class="no-line text-end">LKR ${parseFloat(mrnObj.total_bill).toFixed(2)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </body>
        
        <script src="script/commonFunction.js"></script>
        <script src="script/billGenerate.js"></script>

        </html>`

    const windowFeatures = "menubar=no,toolbar=no,location=no,status=no,scrollbars=yes,resizable=yes,width=900,height=600";
    const newWindow = window.open("", "_blank", windowFeatures);
    newWindow.document.write(billHTMLString);
    newWindow.document.close();
}