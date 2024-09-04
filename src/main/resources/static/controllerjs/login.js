window.addEventListener('load', ()=>{
    let loggedUrlArray = (window.location.href).toString().split('/');

    if(loggedUrlArray.includes("login?error=usernameandpassworderror")){
        document.getElementById("loginError").style.display="block";
    }

});