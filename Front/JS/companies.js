/* Initialize web page ------------------------------------------------------------------------------------ */
(function () {
    companyFetch();
    drawCompanyList();
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

/* Get company list up to date at the moment ----------------------------------------------------------------- */
async function companyFetch() {
    const jwt = jwtLogued();
    const headerJwt = headerAuthorization(jwt);
    const fetchResults = await fetch(`http://localhost:3000/companies`, {headers: headerJwt});
    const jsonCompanyList = await fetchResults.json();
    return jsonCompanyList;
};
/* -------------------------------------------------------------------------------------------------------- */

/* Drawing companies table with data from database ------------------------------------------------------------ */
async function drawCompanyList(){
    let companyList = await companyFetch();
    let tableBody = "";
    for (let index = 0; index < companyList.length; index++) {
        tableBody += `
        <tr>
            <th scope = "row">${companyList[index].company}</th>
            <td>${companyList[index].country}</td>
            <td>${companyList[index].address}</td>
            <td><span class="icon-edit-pencil" id="editCompany${companyList[index].idCompany}"></span><span class="icon-delete" id="deleteCompany${companyList[index].idCompany}"></span></td>
        </tr>
        `;         
    };
    document.getElementsByTagName("tbody")[0].innerHTML = tableBody;
};

/* Close modal window if the click is out the form or the alert delete */
window.onclick = event => {
    if(event.target == document.getElementById("modalForm") || event.target == document.getElementById("closeForm")){
        document.getElementById("modalForm").style.display = "none";
        drawCompanyList();
        addListenersEdit();
        addListenersDelete();
    }else if(event.target == document.getElementById("modalAlertDeleteCompany") || event.target == document.getElementById("cancelDelete")){
        document.getElementById("modalAlertDeleteCompany").style.display = "none";
    };
};

/* Create a new company ----------------------------------------------------------------------------------- */

/* Functions to use when it is necessary to create or update company data */
async function getRegionsData(){
    const jwt = jwtLogued();
    const headerJwt = headerAuthorization(jwt);
    const fetchResults = await fetch(`http://localhost:3000/places/region`, {headers: headerJwt});
    const jsonRegions = await fetchResults.json();
    document.getElementById("regionsData").innerHTML = "";
    for (let index = 0; index < jsonRegions.length; index++) {
        document.getElementById("regionsData").innerHTML += `<span id="region-${jsonRegions[index].idRegion}">${jsonRegions[index].region}</span>`;
    };
    addLintenerRegions();
};

async function getCountriesData(idRegion){
    const jwt = jwtLogued();
    const headerJwt = headerAuthorization(jwt);
    const fetchResults = await fetch(`http://localhost:3000/places/country?idPlace=${idRegion}`, {headers: headerJwt});
    const jsonCountries = await fetchResults.json();
    document.getElementById("countriesData").innerHTML = "";
    for (let index = 0; index < jsonCountries.length; index++) {
        document.getElementById("countriesData").innerHTML += `<span id="country-${jsonCountries[index].idCountry}">${jsonCountries[index].country}</span>`;
    };
    addLintenerCountries();
};

async function getCitiesData(idCountry){
    const jwt = jwtLogued();
    const headerJwt = headerAuthorization(jwt);
    const fetchResults = await fetch(`http://localhost:3000/places/city?idPlace=${idCountry}`, {headers: headerJwt});
    const jsonCities = await fetchResults.json();
    document.getElementById("citiesData").innerHTML = "";
    for (let index = 0; index < jsonCities.length; index++) {
        document.getElementById("citiesData").innerHTML += `<span id="city-${jsonCities[index].idCity}">${jsonCities[index].city}</span>`;
    };
    addLintenerCities();
};

function initFormLayout(){
    document.getElementById("modalForm").style.display = "flex";
    document.getElementById("regionsData").style.height = "0px";
    document.getElementById("caretRegion").classList.replace("icon-caret-up","icon-caret-down");
    document.getElementById("caretCountry").classList.replace("icon-caret-up","icon-caret-down");
    document.getElementById("caretCity").classList.replace("icon-caret-up","icon-caret-down");
    document.getElementById("selectCountry").style.top = "387px";
    document.getElementById("selectCity").style.top = "450px";
    document.getElementById("selectCountry").style.visibility = "visible";
    document.getElementById("selectCity").style.visibility = "visible";
    document.getElementById("company").style.backgroundColor = "rgb(255,255,255)";
    document.getElementById("email").style.backgroundColor = "rgb(255,255,255)";
    document.getElementById("phone").style.backgroundColor = "rgb(255,255,255)";
    document.getElementById("selectRegion").style.backgroundColor = "rgb(255,255,255)";
    document.getElementById("alertIncompleteInformation").style.display = "none";
    document.getElementById("companyAlreadyExist").style.display = "none";
};

/* Region select */
async function addLintenerRegions(){
    const jwt = jwtLogued();
    const headerJwt = headerAuthorization(jwt);
    const fetchResults = await fetch(`http://localhost:3000/places/region`, {headers: headerJwt});
    const jsonRegions = await fetchResults.json();
    for (let index = 0; index < jsonRegions.length; index++) {
        document.getElementById(`region-${jsonRegions[index].idRegion}`).addEventListener("click", async event => {
            getCountriesData(jsonRegions[index].idRegion);
            document.getElementById("regionZero").innerText = jsonRegions[index].region;
            document.getElementById("regionZero").classList.replace("initDropDownValue","valueSelectedDropDown");
            document.getElementById("countryZero").classList.replace("valueSelectedDropDown","initDropDownValue");
            document.getElementById("cityZero").classList.replace("valueSelectedDropDown","initDropDownValue");
            document.getElementById("caretRegion").classList.replace("icon-caret-up","icon-caret-down");
            document.getElementById("regionsData").style.height = "0px";
            document.getElementById("countriesData").style.height = "0px";
            document.getElementById("selectCountry").style.visibility = "visible";
            document.getElementById("selectCountry").style.backgroundColor = "#FFFFFF";
            document.getElementById("selectCity").style.backgroundColor = "#E8E8e8";
            document.getElementById("countryZero").innerText = "Seleccionar país";
            document.getElementById("cityZero").innerText = "Seleccionar ciudad";
            document.getElementById("address").disabled = true;
            document.getElementById("address").value = "";
            document.getElementById("address").style.backgroundColor = "#E8E8E8";
        });
    };
};

document.getElementById("newCompany").addEventListener("click", async event => {
    document.getElementById("countriesData").innerHTML = "";
    document.getElementById("citiesData").innerHTML = "";
    document.getElementById("regionZero").innerText = "Seleccionar región";
    document.getElementById("countryZero").innerText = "Seleccionar país";
    document.getElementById("cityZero").innerText = "Seleccionar ciudad";
    document.getElementById("selectCountry").style.backgroundColor = "#E8E8e8";
    document.getElementById("selectCity").style.backgroundColor = "#E8E8e8";
    document.getElementById("address").disabled = true;
    document.getElementById("address").value = "";
    document.getElementById("company").value = "";
    document.getElementById("email").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("address").style.backgroundColor = "#E8E8E8";
    document.getElementById("createUpdateCompany").innerText = "Agregar";
    document.getElementById("regionZero").classList.replace("valueSelectedDropDown","initDropDownValue");
    document.getElementById("countryZero").classList.replace("valueSelectedDropDown","initDropDownValue");
    document.getElementById("cityZero").classList.replace("valueSelectedDropDown","initDropDownValue");
    initFormLayout();
    getRegionsData();
});

function showRegions(){
    let divRegionsHeight = document.getElementById("regionsData").style.height;
    document.getElementById("citiesData").style.height = "0px";
    document.getElementById("selectRegion").style.backgroundColor = "rgb(255,255,255)";
    document.getElementById("alertIncompleteInformation").style.display = "none";
    if(divRegionsHeight === "0px"){
        document.getElementById("regionsData").style.height = "fit-content";
        document.getElementById("countriesData").style.height = "0px";
        document.getElementById("caretRegion").classList.replace("icon-caret-down","icon-caret-up");
        document.getElementById("caretCountry").classList.replace("icon-caret-up","icon-caret-down");
        document.getElementById("caretCity").classList.replace("icon-caret-up","icon-caret-down");
        document.getElementById("selectCountry").style.visibility = "visible";
        document.getElementById("selectCity").style.visibility = "visible";
        document.getElementById("selectCity").style.top = "450px";
        let totalRegions = document.getElementById("regionsData").childElementCount;
        if(totalRegions === 2){
            document.getElementById("selectCountry").style.top = "397px";
        }else if(totalRegions > 2){
            document.getElementById("selectCountry").style.visibility = "hidden";
        }
    }else if(divRegionsHeight === "fit-content"){
        document.getElementById("regionsData").style.height = "0px";
        document.getElementById("caretRegion").classList.replace("icon-caret-up","icon-caret-down");
        document.getElementById("selectCountry").style.top = "387px";
        document.getElementById("selectCountry").style.visibility = "visible";
    };
};

document.getElementById("caretRegion").addEventListener("click", showRegions);
document.getElementById("regionZero").addEventListener("click", showRegions);

/* Country select */
async function addLintenerCountries(){
    const jwt = jwtLogued();
    const headerJwt = headerAuthorization(jwt);
    let fetchResults = await fetch(`http://localhost:3000/places/region`, {headers: headerJwt});
    const jsonRegions = await fetchResults.json();
    const regionSelected = jsonRegions.filter(element => element.region === document.getElementById("regionZero").innerText);
    const idRegion = regionSelected[0].idRegion;
    fetchResults = await fetch(`http://localhost:3000/places/country?idPlace=${idRegion}`, {headers: headerJwt});
    const jsonCountries = await fetchResults.json();
    for (let index = 0; index < jsonCountries.length; index++) {
        document.getElementById(`country-${jsonCountries[index].idCountry}`).addEventListener("click", async event => {
            getCitiesData(jsonCountries[index].idCountry);
            document.getElementById("countryZero").innerText = jsonCountries[index].country;
            document.getElementById("countryZero").classList.replace("initDropDownValue","valueSelectedDropDown");
            document.getElementById("caretCountry").classList.replace("icon-caret-up","icon-caret-down");
            document.getElementById("countriesData").style.height = "0px";
            document.getElementById("citiesData").style.height = "0px";
            document.getElementById("selectCity").style.visibility = "visible";
            document.getElementById("selectCity").style.backgroundColor = "#FFFFFF";
            document.getElementById("cityZero").classList.replace("valueSelectedDropDown","initDropDownValue");
            document.getElementById("cityZero").innerText = "Seleccionar ciudad";
            document.getElementById("address").disabled = true;
            document.getElementById("address").value = "";
            document.getElementById("address").style.backgroundColor = "#E8E8E8";
        });
    };
};

function showCountries(){
    let divCountriesHeight = document.getElementById("countriesData").style.height;
    document.getElementById("selectCountry").style.backgroundColor = "rgb(255,255,255)";
    document.getElementById("alertIncompleteInformation").style.display = "none";
    document.getElementById("citiesData").style.height = "0px";
    if(divCountriesHeight === "0px"){
        document.getElementById("countriesData").style.height = "fit-content";
        document.getElementById("caretCountry").classList.replace("icon-caret-down","icon-caret-up");
        let totalCountries = document.getElementById("countriesData").childElementCount;
        if(totalCountries === 2){
            document.getElementById("selectCity").style.top = "460px";
        }else if(totalCountries > 2){
            document.getElementById("selectCity").style.visibility = "hidden";
        }
    }else if(divCountriesHeight === "fit-content"){
        document.getElementById("countriesData").style.height = "0px";
        document.getElementById("caretCountry").classList.replace("icon-caret-up","icon-caret-down");
        document.getElementById("selectCity").style.top = "450px";
        document.getElementById("selectCity").style.visibility = "visible";
    };
};

document.getElementById("caretCountry").addEventListener("click", showCountries);
document.getElementById("countryZero").addEventListener("click", showCountries);

/* City select */
async function addLintenerCities(){
    /* Get all child nodes */
    const cities = document.getElementById("citiesData").childNodes;
    //console.log(cities[0].id); => Access to id according to the previous row
    for (let index = 0; index < cities.length; index++) {
        document.getElementById(cities[index].id).addEventListener("click", async event => {
            document.getElementById("cityZero").innerText = cities[index].innerText;
            document.getElementById("cityZero").classList.replace("initDropDownValue","valueSelectedDropDown");
            document.getElementById("caretCity").classList.replace("icon-caret-up","icon-caret-down");
            document.getElementById("citiesData").style.height = "0px";
            document.getElementById("address").disabled = false;
            document.getElementById("address").value = "";
            document.getElementById("address").style.backgroundColor = "rgb(255,255,255)";
            sessionStorage.setItem("idCity",cities[index].id);
        });
    };
};

function showCities(){
    let divCitiesHeight = document.getElementById("citiesData").style.height;
    document.getElementById("selectCity").style.backgroundColor = "rgb(255,255,255)";
    document.getElementById("alertIncompleteInformation").style.display = "none";
    if(document.getElementById("countryZero").innerText === "Seleccionar país"){
        document.getElementById("citiesData").innerHTML = "";
    }
    if(divCitiesHeight === "0px"){
        document.getElementById("citiesData").style.height = "fit-content";
        document.getElementById("caretCity").classList.replace("icon-caret-down","icon-caret-up");
    }else if(divCitiesHeight === "fit-content"){
        document.getElementById("citiesData").style.height = "0px";
        document.getElementById("caretCity").classList.replace("icon-caret-up","icon-caret-down");
    };
};

document.getElementById("caretCity").addEventListener("click", showCities);
document.getElementById("cityZero").addEventListener("click", showCities);

function initStyleDataForm(event){
    event.target.style.backgroundColor = "rgb(255,255,255)";
    document.getElementById("alertIncompleteInformation").style.display = "none";
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

document.getElementById("createUpdateCompany").addEventListener("click", async event => {
    const company = document.getElementById("company");
    const address = document.getElementById("address");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const region = document.getElementById("regionZero");
    const country = document.getElementById("countryZero");
    const city = document.getElementById("cityZero");
    (!company.value)? company.style.backgroundColor = "rgba(255,0,0,0.1)": company.style.backgroundColor = "rgb(255,255,255)";
    (!address.value)? address.style.backgroundColor = "rgba(255,0,0,0.1)": address.style.backgroundColor = "rgb(255,255,255)";
    (!email.value)? email.style.backgroundColor = "rgba(255,0,0,0.1)": email.style.backgroundColor = "rgb(255,255,255)";
    (!phone.value)? phone.style.backgroundColor = "rgba(255,0,0,0.1)": phone.style.backgroundColor = "rgb(255,255,255)";
    (region.innerText === "Seleccionar región")? document.getElementById("selectRegion").style.backgroundColor = "rgba(255,0,0,0.1)": document.getElementById("selectRegion").style.backgroundColor = "rgb(255,255,255)";
    (country.innerText === "Seleccionar país")? document.getElementById("selectCountry").style.backgroundColor = "rgba(255,0,0,0.1)": document.getElementById("selectCountry").style.backgroundColor = "rgb(255,255,255)";
    (city.innerText === "Seleccionar ciudad")? document.getElementById("selectCity").style.backgroundColor = "rgba(255,0,0,0.1)": document.getElementById("selectCity").style.backgroundColor = "rgb(255,255,255)";
    if(!company.value || !address.value || !email.value || !phone.value || region.innerText === "Seleccionar región" || country.innerText === "Seleccionar país" || city.innerText === "Seleccionar ciudad"){
        document.getElementById("alertIncompleteInformation").style.display = "initial";
    }else{
        const companyValue = capitalize(company.value);
        if(event.target.innerText === "Agregar"){
            const companies = await companyFetch();
            const companyExist = companies.filter(element => companyValue === element.company);
            if(companyExist.length !== 0){
                company.style.backgroundColor = "rgba(255,0,0,0.1)";
                document.getElementById("companyAlreadyExist").style.display = "initial";
            }else{
                const raw = JSON.stringify({
                    "idCity": sessionStorage.getItem("idCity").split("-")[1],
                    "company": companyValue,
                    "address": address.value,
                    "email": email.value,
                    "phone": phone.value
                });
                const jwt = jwtLogued();
                const headerJwt = headerAuthorization(jwt);
                let fetchResults = await fetch("http://localhost:3000/company/register", {
                    method: 'POST',
                    body: raw,
                    headers: headerJwt
                });
                let jsonValue = await fetchResults.json();
                console.log(jsonValue);
                document.getElementById("modalForm").style.display = "none";
                drawCompanyList();
                addListenersEdit();
                addListenersDelete();
            };
        }else if(event.target.innerText === "Actualizar"){
            const raw = JSON.stringify({
                "idCity": sessionStorage.getItem("idCity").split("-")[1],
                "company": companyValue,
                "address": address.value,
                "email": email.value,
                "phone": phone.value
            });
            const jwt = jwtLogued();
            const headerJwt = headerAuthorization(jwt);
            const idCompany = sessionStorage.getItem("idCompany");
            let fetchResults = await fetch(`http://localhost:3000/company/${idCompany}`, {
                method: 'PUT',
                body: raw,
                headers: headerJwt
            });
            const jsonValue = await fetchResults.json();
            const jsonStatus = await fetchResults.status;
            if(jsonStatus === 409){
                document.getElementById("companyAlreadyExist").style.display = "initial";
                document.getElementById("company").style.backgroundColor = "rgba(255,0,0,0.1)";
            }else if(jsonStatus === 200){
                document.getElementById("modalForm").style.display = "none";
                drawCompanyList();
                addListenersEdit();
                addListenersDelete();
            };
            console.log(jsonValue);
        };
    };
});

company.addEventListener("input", event => {
    initStyleDataForm(event);
    document.getElementById("companyAlreadyExist").style.display = "none";
});
address.addEventListener("input", event => initStyleDataForm(event));
email.addEventListener("input", event => initStyleDataForm(event));
phone.addEventListener("input", event => initStyleDataForm(event));
/* -------------------------------------------------------------------------------------------------------- */

/* Update company data events ----------------------------------------------------------------------------- */
async function addListenersEdit(){
    const companiesList = await companyFetch();
    for (let index = 0; index < companiesList.length; index++) {
        document.getElementById(`editCompany${companiesList[index].idCompany}`).addEventListener("click", event => {
            document.getElementById("createUpdateCompany").innerText = "Actualizar";
            document.getElementById("company").value = companiesList[index].company;
            document.getElementById("email").value = companiesList[index].email;
            document.getElementById("phone").value = companiesList[index].phone;
            const addressInput = document.getElementById("address");
            addressInput.value = companiesList[index].address;
            addressInput.disabled = false;
            addressInput.style.backgroundColor = "rgb(255,255,255)";
            initFormLayout();
            sessionStorage.setItem("idCompany",companiesList[index].idCompany);

            /* Region section */
            getRegionsData();
            const regionZero = document.getElementById("regionZero")
            regionZero.innerText = companiesList[index].region;
            regionZero.classList.replace("initDropDownValue","valueSelectedDropDown");

            /* Country section */
            getCountriesData(companiesList[index].idRegion);
            document.getElementById("countriesData").style.height = "0px";
            document.getElementById("selectCountry").style.backgroundColor = "rgb(255,255,255)";
            const countryZero = document.getElementById("countryZero");
            countryZero.innerText = companiesList[index].country;
            countryZero.classList.replace("initDropDownValue","valueSelectedDropDown");

            /* City section */
            getCitiesData(companiesList[index].idCountry);
            document.getElementById("citiesData").style.height = "0px";
            document.getElementById("selectCity").style.backgroundColor = "rgb(255,255,255)";
            const cityZero = document.getElementById("cityZero");
            cityZero.innerText = companiesList[index].city;
            cityZero.classList.replace("initDropDownValue","valueSelectedDropDown");
            sessionStorage.setItem("idCity",`city-${companiesList[index].idCity}`);
        });
    };
};
/* -------------------------------------------------------------------------------------------------------- */

/* Delete button events ------------------------------------------------------------------------------------ */
async function addListenersDelete(){
    let companyList = await companyFetch();
    for (let index = 0; index < companyList.length; index++) {
        document.getElementById(`deleteCompany${companyList[index].idCompany}`).addEventListener("click",event => {
            document.getElementById("companyDelete").innerText = `¿Seguro que deseas eliminar la compañía "${companyList[index].company}" permanentemente?`;
            document.getElementById("modalAlertDeleteCompany").style.display = "flex";
            sessionStorage.setItem("idCompany",companyList[index].idCompany);
            sessionStorage.setItem("company",companyList[index].company);
            document.getElementById("deleteDone").style.display = "initial";
            document.getElementById("cancelDelete").style.marginRight = "12.25px";
            document.getElementById("cancelDelete").innerText = "Cancelar";
        });
    };
};

document.getElementById("deleteDone").addEventListener("click", async event => {
    const idCompany = sessionStorage.getItem("idCompany");
    const companyName = sessionStorage.getItem("company");
    const jwt = jwtLogued();
    const headerJwt = headerAuthorization(jwt);
    let fetchResults = await fetch(`http://localhost:3000/company/${idCompany}`, {
        method: 'DELETE',
        headers: headerJwt
    });
    let fecthStatus = await fetchResults.status;
    if(fecthStatus === 200){
        document.getElementById("modalAlertDeleteCompany").style.display = "none";
        console.log(await fetchResults.json());
        drawCompanyList();
        addListenersEdit();
        addListenersDelete();
    }else if(fecthStatus === 409){
        document.getElementById("companyDelete").innerText = `La compañía '${companyName}' no se puede eliminar debido a la dependencia de contactos. Por favor, elimine los contactos asociados e intente de nuevo.`;
        document.getElementById("deleteDone").style.display = "none";
        document.getElementById("cancelDelete").style.marginRight = "0";
        document.getElementById("cancelDelete").innerText = "Continuar";
    };
});
/* -------------------------------------------------------------------------------------------------------- */