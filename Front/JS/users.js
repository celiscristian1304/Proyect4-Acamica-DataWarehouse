/* Initialize web page ------------------------------------------------------------------------------------ */
(function () {
    userFetch();
    drawUserList();
    addListenersEdit();
    addListenersDelete();
})();
/* -------------------------------------------------------------------------------------------------------- */

/* Authorization JWT in header --------------------------------------------------------------------------- */
function jwtLogued () {
    const jwtRol = localStorage.getItem("JWT");
    const onlyJwt = jwtRol.substring(0, jwtRol.length - 1);
    return onlyJwt;
};

function headerAuthorization (jwt) {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${jwt}`);
    myHeaders.append("Content-Type", "application/json");
    return myHeaders;
};
/* -------------------------------------------------------------------------------------------------------- */

/* Get user list up to date at the moment ----------------------------------------------------------------- */
async function userFetch() {
    const jwt = jwtLogued();
    const headerJwt = headerAuthorization(jwt);
    const fetchResults = await fetch(`http://localhost:3000/users`, {headers: headerJwt});
    const jsonUserList = await fetchResults.json();
    return jsonUserList;
};
/* -------------------------------------------------------------------------------------------------------- */

/* Drawing users table with data from database ------------------------------------------------------------ */
async function drawUserList(){
    let userList = await userFetch();
    let tableBody = "";
    for (let index = 0; index < userList.length; index++) {
        let rol = "";
        userList[index].rol === "admin"? rol = "Administrador": rol = "Básico";
        tableBody += `
        <tr>
            <th scope = "row">${userList[index].user}</th>
            <td>${userList[index].name}</td>
            <td>${userList[index].lastName}</td>
            <td>${userList[index].email}</td>
            <td>${userList[index].profile}</td>
            <td>${rol}</td>
            <td><span class="icon-edit-pencil" id="editUser${userList[index].idUser}"></span><span class="icon-delete" id="deleteUser${userList[index].idUser}"></span></td>
        </tr>
        `;         
    };
    document.getElementsByTagName("tbody")[0].innerHTML = tableBody;
};
/* -------------------------------------------------------------------------------------------------------- */

/* Form events created ------------------------------------------------------------------------------------ */
function validationDataComplete(event){
    event.target.style.backgroundColor = "rgb(255,255,255)";
    document.getElementById("alertIncompleteInformation").style.display = "none";
};

document.getElementById("closeForm").addEventListener("click", event => document.getElementById("modalForm").style.display = "none");

/* Close modal window if the click is out the form or the alert delete */
window.onclick = event => {
    if(event.target == document.getElementById("modalForm")){
        document.getElementById("modalForm").style.display = "none";
        drawUserList();
        addListenersEdit();
        addListenersDelete();
    }else if(event.target == document.getElementById("modalAlertDeleteUser")){
        document.getElementById("modalAlertDeleteUser").style.display = "none";
    };
};

function capitalize(phrase){
    let words = phrase.split(" ");
    let capitalizedWord = "";
    for (let index = 0; index < words.length; index++) {
        let lower = words[index].toLowerCase();
        let capital = lower.charAt(0).toUpperCase() + lower.slice(1);
        if(index === (words.length-1)){
            capitalizedWord += capital;
        }else{
            capitalizedWord += capital + " ";
        };
    };
    return capitalizedWord;
};

function initColorInput(){
    document.getElementById("user").style.backgroundColor = "rgb(255,255,255)";
    document.getElementById("name").style.backgroundColor = "rgb(255,255,255)";
    document.getElementById("lastName").style.backgroundColor = "rgb(255,255,255)";
    document.getElementById("email").style.backgroundColor = "rgb(255,255,255)";
    document.getElementById("profile").style.backgroundColor = "rgb(255,255,255)";
    document.getElementById("firstPassword").style.backgroundColor = "rgb(255,255,255)";
    document.getElementById("secondPassword").style.backgroundColor = "rgb(255,255,255)";
    document.getElementById("alertIncompleteInformation").style.display = "none";
};

document.getElementById("createUpdateUser").addEventListener("click", async event => {

    let user = document.getElementById("user");
    user.addEventListener("input", event => {
        validationDataComplete(event);
        document.getElementById("userAlreadyExist").style.display = "none";
    });

    let name = document.getElementById("name");
    name.addEventListener("input", event => validationDataComplete(event));

    let lastName = document.getElementById("lastName");
    lastName.addEventListener("input", event => validationDataComplete(event));

    let email = document.getElementById("email");
    email.addEventListener("input", event => validationDataComplete(event));

    let profile = document.getElementById("profile");
    profile.addEventListener("input", event => validationDataComplete(event));

    let rols = document.getElementsByName("rol");
    let rol = "";
    for (let index = 0; index < rols.length; index++) {
        if(rols[index].checked === true){
            rol = rols[index].value;
        };
    };

    let password = document.getElementById("firstPassword");
    password.addEventListener("input", event => {
        validationDataComplete(event);
        document.getElementById("passwordEqualValidation").style.display = "none";
    });

    let repeatPassword = document.getElementById("secondPassword");
    repeatPassword.addEventListener("input", event => {
        validationDataComplete(event);
        document.getElementById("passwordEqualValidation").style.display = "none";
    });

    /* Change background color for each input if it comes empty */
    (!user.value)? user.style.backgroundColor = "rgba(255,0,0,0.1)": user.style.backgroundColor = "rgb(255,255,255)";
    (!name.value)? name.style.backgroundColor = "rgba(255,0,0,0.1)": name.style.backgroundColor = "rgb(255,255,255)";
    (!lastName.value)? lastName.style.backgroundColor = "rgba(255,0,0,0.1)": lastName.style.backgroundColor = "rgb(255,255,255)";
    (!email.value)? email.style.backgroundColor = "rgba(255,0,0,0.1)": email.style.backgroundColor = "rgb(255,255,255)";
    (!profile.value)? profile.style.backgroundColor = "rgba(255,0,0,0.1)": profile.style.backgroundColor = "rgb(255,255,255)";
    if(event.target.innerText === "Crear"){
        (!password.value)? password.style.backgroundColor = "rgba(255,0,0,0.1)": password.style.backgroundColor = "rgb(255,255,255)";
        (!repeatPassword.value)? repeatPassword.style.backgroundColor = "rgba(255,0,0,0.1)": repeatPassword.style.backgroundColor = "rgb(255,255,255)";
        if(!user.value || !name.value || !lastName.value || !email.value || !profile.value || !password.value || !repeatPassword.value){
            document.getElementById("alertIncompleteInformation").style.display = "initial";
        }else{
            let userListNow = await userFetch();
            let userExist = userListNow.filter(userExist => userExist.user === user.value);
            if(userExist.length != 0){
                document.getElementById("userAlreadyExist").style.display = "initial";
                user.style.backgroundColor = "rgba(255,0,0,0.1)";
            }else{
                if(password.value !== repeatPassword.value){
                    password.style.backgroundColor = "rgba(255,0,0,0.1)";
                    repeatPassword.style.backgroundColor = "rgba(255,0,0,0.1)";
                    document.getElementById("passwordEqualValidation").style.display = "initial";
                }else{
                    let nameValue = capitalize(name.value);
                    let lastNameValue = capitalize(lastName.value);
                    let profileValue = capitalize(profile.value);
                    let raw = JSON.stringify({
                        "user": user.value,
                        "name": nameValue,
                        "lastName": lastNameValue,
                        "email": email.value,
                        "profile": profileValue,
                        "rol": rol,
                        "password": password.value
                    });
                    const jwt = jwtLogued();
                    const headerJwt = headerAuthorization(jwt);
                    let fetchResults = await fetch("http://localhost:3000/user/register", {
                        method: 'POST',
                        body: raw,
                        headers: headerJwt
                    });
                    let jsonValue = await fetchResults.json();
                    document.getElementById("modalForm").style.display = "none";
                    console.log(jsonValue);
                    drawUserList();
                    addListenersEdit();
                    addListenersDelete();
                };
            };
        };
    }else if(event.target.innerText === "Actualizar"){
        if(!user.value || !name.value || !lastName.value || !email.value || !profile.value){
            document.getElementById("alertIncompleteInformation").style.display = "initial";
        }else{
            let userListNow = await userFetch();
            let userExist = userListNow.filter(userExist => userExist.user === user.value);
            let userToUpdate = sessionStorage.getItem("user");
            if(userExist.length != 0 && user.value !== userToUpdate){
                document.getElementById("userAlreadyExist").style.display = "initial";
                user.style.backgroundColor = "rgba(255,0,0,0.1)";
            }else{
                if(password.value !== repeatPassword.value){
                    password.style.backgroundColor = "rgba(255,0,0,0.1)";
                    repeatPassword.style.backgroundColor = "rgba(255,0,0,0.1)";
                    document.getElementById("passwordEqualValidation").style.display = "initial";
                }else{
                    let nameValue = capitalize(name.value);
                    let lastNameValue = capitalize(lastName.value);
                    let profileValue = capitalize(profile.value);
                    let raw = "";
                    if(password.value !== ""){
                        raw = JSON.stringify({
                            "user": user.value,
                            "name": nameValue,
                            "lastName": lastNameValue,
                            "email": email.value,
                            "profile": profileValue,
                            "rol": rol,
                            "password": password.value
                        });
                    }else{
                        raw = JSON.stringify({
                            "user": user.value,
                            "name": nameValue,
                            "lastName": lastNameValue,
                            "email": email.value,
                            "profile": profileValue,
                            "rol": rol,
                        });
                    };
                    const idUser = sessionStorage.getItem("idUser");
                    const jwt = jwtLogued();
                    const headerJwt = headerAuthorization(jwt);
                    let fetchResults = await fetch(`http://localhost:3000/user/${idUser}`, {
                        method: 'PUT',
                        body: raw,
                        headers: headerJwt
                    });
                    let jsonValue = await fetchResults.json();
                    document.getElementById("modalForm").style.display = "none";
                    console.log(jsonValue);
                    drawUserList();
                    addListenersEdit();
                    addListenersDelete();
                };
            };
        };
    };
});
/* -------------------------------------------------------------------------------------------------------- */

/* Create user event -------------------------------------------------------------------------------------- */
document.getElementById("newUser").addEventListener("click", event => {
    document.getElementById("modalForm").style.display = "flex";
    document.getElementById("createUpdateUser").innerText = "Crear";
    document.getElementById("user").value = "";
    document.getElementById("name").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("email").value = "";
    document.getElementById("profile").value = "";
    document.getElementById("firstPassword").value = "";
    document.getElementById("secondPassword").value = "";
    document.getElementById("basicUser").checked = true;
    initColorInput();
});
/* -------------------------------------------------------------------------------------------------------- */

/* Update user event -------------------------------------------------------------------------------------- */
async function addListenersEdit(){
    let userList = await userFetch();
    for (let index = 0; index < userList.length; index++) {
        document.getElementById(`editUser${userList[index].idUser}`).addEventListener("click",event => {
            document.getElementById("modalForm").style.display = "flex";
            document.getElementById("createUpdateUser").innerText = "Actualizar";
            document.getElementById("user").value = userList[index].user;
            document.getElementById("name").value = userList[index].name;
            document.getElementById("lastName").value = userList[index].lastName;
            document.getElementById("email").value = userList[index].email;
            document.getElementById("profile").value = userList[index].profile;
            if(userList[index].rol === "admin"){
                document.getElementById("adminUser").checked = true;
            }else{
                document.getElementById("basicUser").checked = true;
            };
            document.getElementById("firstPassword").value = "";
            document.getElementById("secondPassword").value = "";
            initColorInput();
            sessionStorage.setItem("idUser",userList[index].idUser);
            sessionStorage.setItem("user",userList[index].user);
        });
    };
};
/* -------------------------------------------------------------------------------------------------------- */

/* Delete button events ------------------------------------------------------------------------------------ */
async function addListenersDelete(){
    let userList = await userFetch();
    for (let index = 0; index < userList.length; index++) {
        document.getElementById(`deleteUser${userList[index].idUser}`).addEventListener("click",event => {
            document.getElementById("userDelete").innerText = `¿Seguro que deseas eliminar el usuario "${userList[index].user}" permanentemente?`;
            document.getElementById("modalAlertDeleteUser").style.display = "flex";
            sessionStorage.setItem("idUser",userList[index].idUser);
            sessionStorage.setItem("user",userList[index].user);
        });
    };
};

document.getElementById("cancelDelete").addEventListener("click", event => document.getElementById("modalAlertDeleteUser").style.display = "none");
document.getElementById("deleteDone").addEventListener("click", async event => {
    const idUser = sessionStorage.getItem("idUser");
    const jwt = jwtLogued();
    const headerJwt = headerAuthorization(jwt);
    let fetchResults = await fetch(`http://localhost:3000/user/${idUser}`, {
        method: 'DELETE',
        headers: headerJwt
    });
    let jsonValue = await fetchResults.json();
    document.getElementById("modalAlertDeleteUser").style.display = "none";
    console.log(jsonValue);
    drawUserList();
    addListenersEdit();
    addListenersDelete();
});
/* -------------------------------------------------------------------------------------------------------- */