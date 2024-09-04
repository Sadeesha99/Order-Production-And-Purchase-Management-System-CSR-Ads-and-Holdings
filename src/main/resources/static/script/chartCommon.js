const fillDataIntoSingleBarChart = (canvasID, xAxesData, yAxesData,labelSet, chartTitle) => {
    new Chart(canvasID, {
        type: "bar",
        data: {
            labels: xAxesData, // Set xAxesData to X-axis
            datasets: [{
                label: 'quantity',
                data: yAxesData,
                backgroundColor: 'rgba(11,97,129,0.97)', // Corrected 'backgroundColor'
                borderWidth: 1,
            }]
        },
        options: {
            scales: {
                x: { // Corrected 'x' instead of 'xAxes'
                    display: true,
                },
                y: { // Corrected 'y' instead of 'yAxes'
                    display: true,
                    beginAtZero: true,
                    ticks: {
                        beginAtZero: true,
                    }
                }
            },
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: chartTitle
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const index = context.dataIndex;
                            return `${labelSet[index]}: ${context.parsed.y}`;
                        }
                    }
                }
            }
        }
    });
}
const fillDataIntoGroupedBarChart = (canvasID, xAxesData, yAxesData1, yAxesData2, yAxesData3, chartTitle) => {
    new Chart(canvasID, {
        type: "bar",
        data: {
            labels: xAxesData, // X-axis labels
            datasets: [
                {
                    label: "Income", // Label for the first group of bars
                    data: yAxesData1, // Data for the first group
                    backgroundColor: 'rgb(32,135,180)', // Color for the first group
                    borderWidth: 1,
                },
                {
                    label: "Expense", // Label for the second group of bars
                    data: yAxesData2, // Data for the second group
                    backgroundColor: 'rgb(180,32,135)', // Color for the second group
                    borderWidth: 1,
                },
                {
                    label: "Profit", // Label for the third group of bars
                    data: yAxesData3, // Data for the third group
                    backgroundColor: 'rgb(135,180,32)', // Color for the third group
                    borderWidth: 1,
                }
            ]
        },
        options: {
            scales: {
                x: {
                    display: true,
                },
                y: {
                    display: true,
                    beginAtZero: true,
                    ticks: {
                        beginAtZero: true,
                    }
                }
            },
            plugins: {
                legend: { display: true }, // Show legend for grouped bars
                title: {
                    display: true,
                    text: chartTitle
                }
            }
        }
    });
}


const fillDataIntoSingleBarChartWithNegatives = (canvasID, xAxesData, yAxesData, lab, chartTitle) => {
    new Chart(canvasID, {
        type: "bar",
        data: {
            labels: xAxesData, // X-axis labels
            datasets: [{
                label: lab, // Tooltip label
                data: yAxesData, // Data including positive and negative values
                backgroundColor: 'rgb(32,135,180)', // Bar color
                borderWidth: 1,
            }]
        },
        options: {
            scales: {
                x: { // X-axis configuration
                    display: true,
                },
                y: { // Y-axis configuration
                    display: true,
                    beginAtZero: true, // Ensure Y-axis starts at zero
                    ticks: {
                        beginAtZero: true,
                        callback: function(value) {
                            return value; // Show negative and positive values
                        }
                    }
                }
            },
            plugins: {
                legend: { display: false }, // Hide legend for single dataset
                title: {
                    display: true,
                    text: chartTitle // Chart title
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed.y;
                            return `${lab}: ${value}`;
                        }
                    }
                }
            }
        }
    });
}

const generateXandYValue = (reportDataList, propertyX, propertyY) => {
    let xAxesArray = []
    let yAxesArray = []

    reportDataList.forEach(element => {
        xAxesArray.push(element[propertyX]);
        yAxesArray.push(element[propertyY]);
    });

    return { xAxesArray: xAxesArray, yAxesArray: yAxesArray }
}
const generate4Arrays = (reportDataList, property1, property2,property3,property4) => {
    let array1 = [];
    let array2 = [];
    let array3 = [];
    let array4 = [];

    reportDataList.forEach(element => {
        array1.push(element[property1]);
        array2.push(element[property2]);
        array3.push(element[property3]);
        array4.push(element[property4]);
    });

    return { array1:array1, array2:array2 , array3:array3, array4:array4 }
}