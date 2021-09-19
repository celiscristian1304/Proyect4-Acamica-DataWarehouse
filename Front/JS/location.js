/* document.getElementById("addpais-1").addEventListener("click", () => {
    alert("agregar país");
});

window.onclick = event =>{
    let id = event.target.id;
    let idSplit = id.split("-");
    if(idSplit[0] === "addpais"){
        alert("agregar país");
    };
}; */

/* Initialize web page ------------------------------------------------------------------------------------ */
(function () {
    drawTreeJs();
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

/* Get all data from a Region-Country-City ------------------------------------------------------------------ */
async function selectPlace(place,idPlace) {
    const jwt = jwtLogued();
    const headerJwt = headerAuthorization(jwt);
    const fetchResults = await fetch(`http://localhost:3000/places/${place}?idPlace=${idPlace}`, {headers: headerJwt});
    const jsonSelectList = await fetchResults.json();
    return jsonSelectList;
};
/* -------------------------------------------------------------------------------------------------------- */

/* Drawing js tree with data from region-country-city table of database ----------------------------------- */
async function drawTreeJs(){
    let treeData = "<ul>";
    let regionsData = await selectPlace("region",0);
    for (let index = 0; index < regionsData.length; index++) {
        treeData += `
            <li data-jstree='{"icon":"icon-earth"}' class="regions"> ${regionsData[index].region} <button class="icon-edit-pencil editRegion" id="edit-region-${regionsData[index].idRegion}-${regionsData[index].region}"></button><button class="icon-delete deleteRegion" id="delete-region-${regionsData[index].idRegion}-${regionsData[index].region}"></button><button class="addCountry" id="add-country-${regionsData[index].idRegion}">Agregar país</button>
                <ul>`;
        let countriesData = await selectPlace("country",regionsData[index].idRegion);
        for (let index = 0; index < countriesData.length; index++) {
            treeData += `
                    <li data-jstree='{"icon":"icon-location_on"}' class="countries">${countriesData[index].country} <button class="icon-edit-pencil editCountry" id="edit-country-${countriesData[index].idCountry}-${countriesData[index].country}"></button><button class="icon-delete deleteCountry" id="delete-country-${countriesData[index].idCountry}-${countriesData[index].country}"></button><button class="addCity" id="add-city-${countriesData[index].idCountry}">Agregar ciudad</button>
                        <ul>`;
            let citiesData = await selectPlace("city",countriesData[index].idCountry);
            for (let index = 0; index < citiesData.length; index++) {
                treeData += `
                            <li data-jstree='{"icon":"icon-office"}' class="cities"> ${citiesData[index].city} <button class="icon-edit-pencil editCity" id="edit-city-${citiesData[index].idCity}-${citiesData[index].city}"></button><button class="icon-delete deleteCity" id="delete-city-${citiesData[index].idCity}-${citiesData[index].city}"></button></li>  
                `;
            };
            treeData += `
                        </ul>
                    </li>
            `;
        };
        treeData += `
                </ul>
            </li>
        `;
    };
    treeData += "</ul>";
    document.getElementById("jsTreeJquery").innerHTML = treeData;
    $('#jsTreeJquery').jstree(); /* Create an instance when the DOM is ready, i.e, make the JSTREE with the correct tags */
};
/* -------------------------------------------------------------------------------------------------------- */

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

/* Add event listeners for new date places or delete places ----------------------------------------------- */
window.onclick = event => {
    if(event.target == document.getElementById("modalInputData")){
        document.getElementById("modalInputData").style.display = "none";
        location.reload();
    }else if(event.target == document.getElementById("modalAlertDeleteUser") || event.target == document.getElementById("cancelDelete")){
        document.getElementById("modalAlertDeleteUser").style.display = "none";
        location.reload();
    };
    let buttonType = event.target.id.split("-");
    if(buttonType[0] === "add"){
        sessionStorage.setItem("queryPlace",event.target.id);
        document.getElementById("modalInputData").style.display = "flex";
        document.getElementById("placeText").style.backgroundColor = "rgb(255,255,255)";
        document.getElementById("wrongData").style.visibility = "hidden";
        if(buttonType[1] === "country"){
            document.getElementById("dataPlace").innerText = "Ingrese el nuevo país:";
            document.getElementById("place").innerText = "País";
        }else if (buttonType[1] === "city"){
            document.getElementById("dataPlace").innerText = "Ingrese la nueva ciudad:";
            document.getElementById("place").innerText = "Ciudad";
        };
    }else if(buttonType[0] === "edit"){
        sessionStorage.setItem("queryPlace",event.target.id);
        document.getElementById("modalInputData").style.display = "flex";
        document.getElementById("placeText").style.backgroundColor = "rgb(255,255,255)";
        document.getElementById("placeText").value = buttonType[3];
        document.getElementById("wrongData").style.visibility = "hidden";
        document.getElementById("enterPlace").innerText = "Actualizar";
        if(buttonType[1] === "region"){
            document.getElementById("dataPlace").innerText = `Actualice el nombre de la región '${buttonType[3]}':`;
            document.getElementById("place").innerText = "Región";
        }else if(buttonType[1] === "country"){
            document.getElementById("dataPlace").innerText = `Actualice el nombre del país '${buttonType[3]}':`;
            document.getElementById("place").innerText = "País";
        }else if(buttonType[1] === "city"){
            document.getElementById("dataPlace").innerText = `Actualice el nombre de la ciudad '${buttonType[3]}':`;
            document.getElementById("place").innerText = "Ciudad";
        };
    }else if(buttonType[0] === "delete"){
        sessionStorage.setItem("queryPlace",event.target.id);
        document.getElementById("modalAlertDeleteUser").style.display = "flex";
        let placeExist = "";
        (buttonType[1] === "region")? placeExist = "la región":(buttonType[1] === "country")? placeExist = "el país": placeExist = "la ciudad";
        document.getElementById("userDelete").innerText = `¿Seguro que deseas eliminar ${placeExist} "${buttonType[3]}" permanentemente?`;
    };
};


/* Add or update places */
document.getElementById("closeInputDataPlace").addEventListener("click", () => {
    document.getElementById("modalInputData").style.display = "none";
    location.reload();
});

async function newUpdatePlace() {
    let inputPlace = document.getElementById("placeText");
    if(inputPlace.value === ""){
        inputPlace.style.backgroundColor = "rgba(255,0,0,0.1)";
        document.getElementById("wrongData").innerText = "El campo con * es obligatorio."
        document.getElementById("wrongData").style.visibility = "visible";
    }else{
        let newPlace = capitalize(inputPlace.value);
        let queryData = sessionStorage.getItem("queryPlace").split("-");
        const jwt = jwtLogued();
        const headerJwt = headerAuthorization(jwt);
        if(document.getElementById("enterPlace").innerText === "Agregar"){
            if(queryData[1] === "region"){
                fetchResults = await fetch(`http://localhost:3000/place/${queryData[1]}?newPlace=${newPlace}`, {
                    method: 'POST',
                    headers: headerJwt
                });
            }else{
                fetchResults = await fetch(`http://localhost:3000/place/${queryData[1]}?newPlace=${newPlace}&idPlace=${queryData[2]}`, {
                    method: 'POST',
                    headers: headerJwt
                });
            };
            let statusResult = await fetchResults.status;
            if(statusResult === 201){
                document.getElementById("modalInputData").style.display = "none";
                location.reload();
            }else if(statusResult === 409){
                let placeExist = "";
                (queryData[1] === "region")? placeExist = "otra región":(queryData[1] === "country")? placeExist = "otro país": placeExist = "otra ciudad";
                inputPlace.style.backgroundColor = "rgba(255,0,0,0.1)";
                document.getElementById("wrongData").innerText = `Lugar ya existente, por favor intente con ${placeExist}`;
                document.getElementById("wrongData").style.visibility = "visible";
            };
        }else if(document.getElementById("enterPlace").innerText === "Actualizar"){
            let fetchResults = await fetch(`http://localhost:3000/place/${queryData[1]}/${queryData[2]}?placeChange=${newPlace}`, {
                method: 'PUT',
                headers: headerJwt
            });
            let statusResult = await fetchResults.status;
            if(statusResult === 200){
                document.getElementById("modalInputData").style.display = "none";
                location.reload();
            }else if(statusResult === 409){
                let placeExist = "";
                (queryData[1] === "region")? placeExist = "otra región":(queryData[1] === "country")? placeExist = "otro país": placeExist = "otra ciudad";
                inputPlace.style.backgroundColor = "rgba(255,0,0,0.1)";
                document.getElementById("wrongData").innerText = `Lugar ya existente, por favor intente con ${placeExist}`;
                document.getElementById("wrongData").style.visibility = "visible";
            };
        };
    };
};

document.getElementById("enterPlace").addEventListener("click",newUpdatePlace);

document.getElementById("placeText").addEventListener("keypress", event => {
    if(event.key === 'Enter'){
        newUpdatePlace();
    };
});

document.getElementById("placeText").addEventListener("input",(event) => {
    event.target.style.backgroundColor = "rgb(255,255,255)";
    document.getElementById("wrongData").style.visibility = "hidden";
});

document.getElementById("add-region").addEventListener("click", event => {
    sessionStorage.setItem("queryPlace",event.target.id);
    document.getElementById("modalInputData").style.display = "flex";
    document.getElementById("dataPlace").innerText = "Ingrese la nueva región:";
    document.getElementById("place").innerText = "Región";
});

/* Delete places */
document.getElementById("deleteDone").addEventListener("click", async event => {
    let queryDelete = sessionStorage.getItem("queryPlace").split("-");
    const jwt = jwtLogued();
    const headerJwt = headerAuthorization(jwt);
    let fetchResults = await fetch(`http://localhost:3000/place/${queryDelete[1]}/${queryDelete[2]}`, {
        method: 'DELETE',
        headers: headerJwt
    });
    let statusResult = await fetchResults.status;
    if(statusResult === 200){
        document.getElementById("modalAlertDeleteUser").style.display = "none";
        location.reload();
    }else if(statusResult === 409){
        if(queryDelete[1] === "region"){
            document.getElementById("userDelete").innerText = `La region '${queryDelete[3]}' no se puede eliminar debido a la dependencia de países. Elimine los países de la región para poderse eliminar.`;
        }else if(queryDelete[1] === "country"){
            document.getElementById("userDelete").innerText = `El país '${queryDelete[3]}' no se puede eliminar debido a la dependencia de ciudades. Elimine las ciudades del país para poderse eliminar.`;
        }else if(queryDelete[1] === "city"){
            document.getElementById("userDelete").innerText = `La ciudad '${queryDelete[3]}' no se puede eliminar debido a la dependencia de compañias o contactos. Elimine las compañías o los contactos asociados a la ciudad para poderse eliminar.`;
        };
        document.getElementById("cancelDelete").style.margin = "0";
        document.getElementById("cancelDelete").innerText = "Cerrar";
        document.getElementById("deleteDone").style.display = "none";
    };
});
/* -------------------------------------------------------------------------------------------------------- */