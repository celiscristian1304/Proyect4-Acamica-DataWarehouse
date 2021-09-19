/* Put variable for JWT in localstorage */
(function () {
    localStorage.setItem("JWT", "");
})();


/* Put dynamism for the input data */

async function loginUser() {
    const user = document.getElementById("user").value;
    const password = document.getElementById("password").value;

    /* Fecth endpoint post /user/login */
    let fetchResults = await fetch("http://localhost:3000/user/login", {
        method: 'POST',
        body: JSON.stringify({
            "user": user,
            "password": password
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    let jsonValue = await fetchResults.json();
    
    if(fetchResults.status === 400){
        console.log(jsonValue);
        document.getElementsByTagName("p")[0].style.visibility = "visible";
        document.getElementById("user").style.backgroundColor = "rgba(255,0,0,0.25)";
        document.getElementById("password").style.backgroundColor = "rgba(255,0,0,0.25)";
    }else{
        localStorage.setItem("JWT",jsonValue);
    };
    const JWT = localStorage.getItem("JWT");
    if(JWT != ""){
        window.location = "../Front/links/contacts.html";
    };
};

/* Listeners to use when the button and/or enter key are pressed */
document.getElementsByTagName("button")[0].addEventListener("click", loginUser);
document.getElementById("user").addEventListener("keypress", event => {
    if(event.key === 'Enter'){
        loginUser();
    };
});
document.getElementById("password").addEventListener("keypress", event => {
    if(event.key === 'Enter'){
        loginUser();
    };
});

function initValuesInputData(){
    document.getElementsByTagName("p")[0].style.visibility = "hidden";
    document.getElementById("user").style.backgroundColor = "white";
    document.getElementById("password").style.backgroundColor = "white";
};

document.getElementById("user").addEventListener("input",initValuesInputData);
document.getElementById("password").addEventListener("input",initValuesInputData);