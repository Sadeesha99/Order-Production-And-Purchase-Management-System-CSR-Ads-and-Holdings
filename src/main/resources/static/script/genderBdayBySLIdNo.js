
//var NicNo = '199951003776';




/* Convert ID into year and day Text */
const convertIDtoYearDate = (NicNo) => {
    if (NicNo.length == 10) {
        year = parseInt("19" + NicNo[0] + NicNo[1]);
        dayText = parseInt(NicNo[2] + NicNo[3] + NicNo[4]);
        //console.log("NIC 10 digits. Year : "+year+" | day-text : "+dayText);
    } else if (NicNo.length == 12) {
        year = parseInt(NicNo[0] + NicNo[1] + NicNo[2] + NicNo[3]);
        dayText = parseInt(NicNo[4] + NicNo[5] + NicNo[6]);
        //console.log("NIC 12 digits. Year : "+year+" | day-text : "+dayText);
    } else {
        console.log("NIC Is Not Valid..");
    }
    gender = getGenderAndDayofYear(dayText);

    if (isLeapYear(year)) {
       let rLY = setDayMonthLeapYear(year, gender.dayOfYear);
       dateOutPut = new Date(year, (rLY.month-1), rLY.day);
       month=rLY.month;
       day=rLY.day;       
        
    } else {
        if (gender.dayOfYear < 1 || gender.dayOfYear > 365) {
            console.log("Invalid Id Number");
        } else {
            let rNY = setDayMonthNormalYear(gender.dayOfYear) //rNY is result of normal year funtion
            dateOutPut = new Date(year, (rNY.month-1), rNY.day);
            month = rNY.month;
            day = rNY.day;

        }
    }
    return { year: year, month:month, day:day ,dateOutPut:dateOutPut, dayOfYear: gender.dayOfYear, gender: gender.male };
}
/* Convert ID into year and day Text End*/


/* Checking For Gender  (if gender is male functions returns true)*/
const getGenderAndDayofYear = (dayValues) => {
    if (dayValues < 500) {
        return { male: true, dayOfYear: dayValues };
    } else {
        return { male: false, dayOfYear: (dayValues - 500) };
    }
}
/* Checking For Gender Ends*/


/* Checking For Leap year or not  */
const isLeapYear = (yearInt) => {
    // Three conditions to find out the leap year
    if ((0 == yearInt % 4) && (0 != yearInt % 100) || (0 == yearInt % 400)) {
        //console.log(yearInt + ' is a leap year');
        return true;
    } else {
        //console.log(yearInt + ' is not a leap year');
        return false;
    }
}
/* Checking For Leap year or not Ended */


/* Checking Bday Months in Normal Year*/
const setDayMonthNormalYear = (dayText) => {
    //Month
    if (dayText < 32) {
        day = dayText;
        month = "January";
        monthDigit = 0;
    }
    else if (dayText < 60) {
        day = dayText - 31;
        month = "Feb";
        monthDigit = 1;
    }
    else if (dayText < 91) {
        day = dayText - 59;
        month = "March";
        monthDigit = 2;
    }
    else if (dayText < 121) {
        day = dayText - 90;
        month = "April";
        monthDigit = 3;
    }
    else if (dayText < 152) {
        day = dayText - 120;
        month = "May";
        monthDigit = 4;
    }
    else if (dayText < 182) {
        day = dayText - 151;
        month = "June";
        monthDigit = 5;
    }
    else if (dayText < 213) {
        day = dayText - 181;
        month = "July";
        monthDigit = 6;
    }
    else if (dayText < 244) {
        day = dayText - 212;
        month = "August";
        monthDigit = 7;
    }
    else if (dayText < 274) {
        day = dayText - 243;
        month = "September";
        monthDigit = 8;
    }
    else if (dayText < 305) {
        day = dayText - 274;
        month = "October";
        monthDigit = 9;
    }
    else if (dayText < 335) {
        day = dayText - 305;
        month = "November";
        monthDigit = 10;
    }
    else {
        day = dayText - 334;
        month = "December";
        monthDigit = 11;
    }
    return { day:day, month:(monthDigit+1)};
}
/* Checking Bday Months in Normal Year End*/

/* Checking Bday Months in Leap Year*/
const setDayMonthLeapYear = (year, dayText) => {
    let leapYearDate = new Date(year, 0);
    if (dayText < 32) {
        leapYearDate.setMonth(0);
        leapYearDate.setDate(dayText);
    } else if (dayText > 31 && dayText < 61) {
        leapYearDate.setMonth(1);
        leapYearDate.setDate(dayText - 31);
    } else if (dayText > 60) {
        leapYearDate.setDate(dayText);
    }
    let leapYearMonth = (leapYearDate.getMonth()+1);
    let leapYearDay = leapYearDate.getDate();
    
    return{day:leapYearDay, month:leapYearMonth}
}
/* Checking Bday Months in Leap Year End*/




//console.log(covertIDtoYearDate('199951003776'));

