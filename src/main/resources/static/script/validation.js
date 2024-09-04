//Form Validations Starts 
const textValidator = (fieldID, pattern,object,property)=>{
    const regPattern = new RegExp(pattern);
    if(fieldID.value !== ''){
        if (regPattern.test(fieldID.value)){
            fieldID.classList.add('is-valid');
            fieldID.classList.remove('is-invalid');
            window[object][property] = fieldID.value;

            //generate calling Name options
        }else{
            fieldID.classList.remove('is-valid');
            fieldID.classList.add('is-invalid');
            window[object][property] = null;
        }
    }else{
        fieldID.classList.remove('is-valid');
        fieldID.classList.remove('is-invalid');
        window[object][property] = null;
    }
}

//define function of validate select dynamic element
const selectDynamicValidator = (fieldID,object,property) =>{
    //fieldID.firstElementChild.disabled = true;
    if(fieldID.value !==''){
        //valid
        fieldID.classList.add('is-valid');
        fieldID.classList.remove('is-invalid');
        window[object][property]=JSON.parse(fieldID.value);
    }else{
        fieldID.classList.remove('is-valid');
        fieldID.classList.add('is-invalid');
        window[object][property]=null;
    }
}
//define function of validate select static element Employee status
const selectStaticValidator = (fieldID,object,property) =>{
    fieldID.firstElementChild.disabled = true;
    if(fieldID.value !==''){
        //valid
        fieldID.classList.add('is-valid');
        fieldID.classList.remove('is-invalid');
        window[object][property]=fieldID.value;
    }else{
        fieldID.classList.remove('is-valid');
        fieldID.classList.add('is-invalid');
        window[object][property]=null;
    }
}