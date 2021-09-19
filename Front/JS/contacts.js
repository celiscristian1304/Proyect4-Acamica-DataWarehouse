function initTableJquery(){
    $(document).ready(function() {
        var dataTable = $('#tableContacts').DataTable( {
            columnDefs: [
              { orderable: false, targets: [0,6] }, //Remove ordering event for specific columns
            ],
            search: {
                return: true
            },
            "pagingType": "simple",
            "language":{
                "lengthMenu": "Filas por página  _MENU_",
                "zeroRecords": "Búsqueda sin resultados - Intenta con otra búsqueda.",
                "info": "_START_-_END_ de _TOTAL_ filas",
                "infoFiltered":   "(filtrados de _MAX_ filas)",
                "search": "",
                "paginate":{
                    "next": "<span class='icon-chevron-right'></span>",
                    "previous": "<span class='icon-chevron-left'></span>"
                }
            },
            "dom": '<"top"f>rt<"bottom"lip><"clear">'
        });
    
        $('#searchFilter').on('click', function (){
            dataTable.search(document.getElementsByTagName("input")[0].value);
            dataTable.draw();
        });
    
        document.getElementById("totalCheckbox").classList.remove("sorting_asc"); //Remove background image of first column
        
    
        /* Remove all background images of all columns */
        const removeImageSort = document.getElementsByClassName("sorting");
        for (const iterator of removeImageSort) {
            iterator.style.backgroundImage = "url('')";
        };
    
        document.getElementsByTagName("input")[0].addEventListener("input", event => {
            if(event.target.value === ""){
                dataTable.search("");
                dataTable.draw();
            }
        });
    });
};

(function () {
    drawContactList();
    sessionStorage.setItem("contactsDelete",JSON.stringify([]));
})();

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

/* Get contact list up to date at the moment ----------------------------------------------------------------- */
async function contactFetch() {
    const jwt = jwtLogued();
    const headerJwt = headerAuthorization(jwt);
    const fetchResults = await fetch(`http://localhost:3000/contacts`, {headers: headerJwt});
    const jsonContactList = await fetchResults.json();
    return jsonContactList;
};
/* -------------------------------------------------------------------------------------------------------- */

/* Close modal window if the click is out the form or the alert delete ------------------------------------ */
window.onclick = event => {
    if(event.target == document.getElementById("modalFormContact") || event.target == document.getElementById("closeForm") || event.target.innerText === "Cancelar"){
        document.getElementById("modalFormContact").style.display = "none";
    };
    if(event.target == document.getElementById("modalAlertDeleteUser") || event.target.innerText === "Cancelar"){
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

/* -------------------------------------------------------------------------------------------------------- */

/* Drawing contacts table with data from database --------------------------------------------------------- */
function drawProgressInterest(){
    const contactList = JSON.parse(sessionStorage.getItem("contacts"));
    for (let index = 0; index < contactList.length; index++) {
        let progressBar = document.getElementById(`progressionInterest${contactList[index].idContact}`);
        if(contactList[index].interest === 25){
            progressBar.style.backgroundColor = "#1CC1F5";
        }else if(contactList[index].interest === 50){
            progressBar.style.backgroundColor = "#FFC700";
        }else if(contactList[index].interest === 75){
            progressBar.style.backgroundColor = "#FF6F00";
        }else if(contactList[index].interest === 100){
            progressBar.style.backgroundColor = "#DE0028";
        };
        progressBar.style.width = `${contactList[index].interest}%`;
    };
};

async function drawContactList(){
    const contactList = await contactFetch();
    sessionStorage.setItem("contacts",JSON.stringify(contactList));
    let tableBody = "";
    for (let index = 0; index < contactList.length; index++) {
        tableBody += `
        <tr id="row-${contactList[index].idContact}">
            <td class="icon-check_box_outline_blank" id="checkBox-${contactList[index].idContact}"></td>
            <td class="contact"><div>${contactList[index].name} ${contactList[index].lastName}</div><div>${contactList[index].email}</div></td>
            <td class="regionCountry"><div>${contactList[index].country}</div><div>${contactList[index].region}</div></td>
            <td>${contactList[index].company}</td>
            <td>${contactList[index].position}</td>
            <td class="interest"><span>${contactList[index].interest}%</span><div class="percentage"><div class="progression" id="progressionInterest${contactList[index].idContact}"></div></div></td>
            <td class="morActions"><span class="icon-more-horizontal"></span><span class="icon-delete" id="deleteContact-${contactList[index].idContact}"></span><span class="icon-edit-pencil" id="editContact-${contactList[index].idContact}"></span></td>
        </tr>
        `;
    };
    document.getElementsByTagName("tbody")[0].innerHTML = tableBody;
    
    /* Put colors on progress bar */
    drawProgressInterest();

    /* Give events for each checkbox */
    changeCheckBoxDelete();

    /* Give events for each trash button */
    deleteOneContact();

    /* Give events for each edit button */
    editOneContact();

    /* Give Jquery library to the table for get functions requested */
    initTableJquery();
}
/* -------------------------------------------------------------------------------------------------------- */

/* Functions and behavior for delete one or more contacts ------------------------------------------------- */

/* Selection of contacts */

function checkQuantityContactsSelected(contactsDelete){
    if(contactsDelete.length !== 0){
        let plural = "";
        document.getElementById("totalCheckbox").classList.replace("icon-check_box_outline_blank","icon-indeterminate_check_box");
        document.getElementById("containerSelectedInfo").style.visibility = "visible";
        document.getElementById("totalCheckbox").style.cursor = "pointer";
        (contactsDelete.length === 1)? plural = "seleccionado": plural = "seleccionados";
        document.getElementById("tagInfoCountSelected").innerText = `${contactsDelete.length} ${plural}`;
    }else{
        document.getElementById("totalCheckbox").classList.replace("icon-indeterminate_check_box","icon-check_box_outline_blank");
        document.getElementById("containerSelectedInfo").style.visibility = "hidden";
        document.getElementById("totalCheckbox").style.cursor = "";
    };
    document.getElementById("totalCheckbox").addEventListener("click", event => {
        if(event.target.className.includes("icon-indeterminate_check_box")){
            location.reload();
        };
    });
};

function changeCheckBoxDelete(){
    const contactList = JSON.parse(sessionStorage.getItem("contacts"));
    for (let index = 0; index < contactList.length; index++) {
        document.getElementById(`checkBox-${contactList[index].idContact}`).addEventListener("click", event => {
            let contactsDelete = JSON.parse(sessionStorage.getItem("contactsDelete"));
            if(event.target.className.includes("icon-check_box_outline_blank")){
                event.target.classList.replace("icon-check_box_outline_blank","icon-check_box");
                document.getElementById(`row-${contactList[index].idContact}`).style.backgroundColor = "rgba(37, 150, 190,0.10)";
                contactsDelete.push(contactList[index].idContact);
                sessionStorage.setItem("contactsDelete",JSON.stringify(contactsDelete));
                /* Check the quantity of contacts to delete */
                checkQuantityContactsSelected(contactsDelete);
            }else if(event.target.className.includes("icon-check_box")){
                event.target.classList.replace("icon-check_box","icon-check_box_outline_blank");
                document.getElementById(`row-${contactList[index].idContact}`).style.backgroundColor = "";
                let contactListFiltered = contactsDelete.filter(function(value){
                    return value != contactList[index].idContact;
                });
                sessionStorage.setItem("contactsDelete",JSON.stringify(contactListFiltered));
                /* Check the quantity of contacts to delete */
                checkQuantityContactsSelected(contactListFiltered);
            };

        });
    };
};

/* Determine the preferred symbol to update the contact */
function actualSymbolUpdate(channelDiv,preference){
    const preferenceSymbol = document.querySelector(`#${channelDiv} .preferenceSymbol`);
    if(preference === "Canal favorito"){
        preferenceSymbol.classList.replace("icon-ban","icon-heart");
        preferenceSymbol.style.visibility = "visible";
    }else if(preference === "No molestar"){
        preferenceSymbol.classList.replace("icon-heart","icon-ban");
        preferenceSymbol.style.visibility = "visible";
    }else if(preference = "Sin preferencia"){
        preferenceSymbol.style.visibility = "hidden";
    };
};

/* Put events for all buttons to edit channels */
function editChannel(inputChannel,selectChannel){
    const input = document.getElementById(inputChannel);
    const select = document.getElementById(selectChannel);

    input.disabled = false;
    input.style.cursor = "auto";
    input.style.backgroundColor = "#FFFFFF";
    input.style.color = "#000000";

    select.disabled = false;
    select.style.cursor = "pointer";
    select.style.backgroundColor = "#FFFFFF";
    select.style.color = "#000000";
};

/* Edit information contact (only one) */
function editOneContact(){
    const contactList = JSON.parse(sessionStorage.getItem("contacts"));
    for (let index = 0; index < contactList.length; index++) {
        document.getElementById(`editContact-${contactList[index].idContact}`).addEventListener("click", async event => {
            commonEventsCreateEditContact("Eliminar contacto","visible",contactList[index].idCompany);//Common actions and events to create or edit a contact

            sessionStorage.setItem("onlyOneContactDelete",contactList[index].idContact);
            sessionStorage.setItem("editContact",contactList[index].idContact);   

            /* Put values for the places */
            if(contactList[index].idCity === null){
                getRegionsData(0);
                getCountriesData(0,0);
                getCitiesData(0,0);
            }else{
                getRegionsData(contactList[index].idRegion);
                getCountriesData(contactList[index].idRegion,contactList[index].idCountry);
                getCitiesData(contactList[index].idCountry,contactList[index].idCity);
            };

            /* Get all contact channels */
            const jwt = jwtLogued();
            const headerJwt = headerAuthorization(jwt);
            const fetchResults = await fetch(`http://localhost:3000/channels/${contactList[index].idContact}`, {headers: headerJwt});
            const contactChannel = await fetchResults.json();

            /* Get all form objects */
            let nameInput = document.getElementById("contact");
            let lastNameInput = document.getElementById("lastName");
            let profileInput = document.getElementById("profile");
            let emailInput = document.getElementById("email");
            let cityInput = document.getElementById("cityOptions");
            let countryInput = document.getElementById("countryOptions");
            let regionInput = document.getElementById("regionOptions");
            let addressInput = document.getElementById("addressContact");
            let interestInput = document.getElementById("selectInterest");
            let telephoneInput = document.getElementById("telephoneContact");
            let telephonePreference = document.getElementById("telephonePreference");
            let whatsappInput = document.getElementById("whatsappContact");
            let whatsappPreference = document.getElementById("whatsappPreference");
            let facebookInput = document.getElementById("facebookContact");
            let facebookPreference = document.getElementById("FacebookPreference");
            let instagramInput = document.getElementById("instagramContact");
            let instagramPreference = document.getElementById("instagramPreference");
            let linkeinInput  = document.getElementById("linkedinContact");
            let linkedinPreference = document.getElementById("linkedinPreference");

            /* Put all input values that belong to the contact */
            nameInput.value = contactList[index].name;
            lastNameInput.value = contactList[index].lastName;
            profileInput.value = contactList[index].position;
            emailInput.value = contactList[index].email;
            addressInput.value = contactList[index].address;
            interestInput.value = `${contactList[index].interest}%`;

            /* Put all channels information */
            let telephoneInfo = contactChannel.filter(element => {return element.channel === "Teléfono"});
            telephoneInput.value = telephoneInfo[0].data;
            telephonePreference.value = telephoneInfo[0].preference;
            actualSymbolUpdate("selectTelephonePreference",telephoneInfo[0].preference);
            let whatsappInfo = contactChannel.filter(element => {return element.channel === "Whatsapp"});
            whatsappInput.value = whatsappInfo[0].data;
            whatsappPreference.value = whatsappInfo[0].preference;
            actualSymbolUpdate("selectWhatsappPreference",whatsappInfo[0].preference);
            let facebookInfo = contactChannel.filter(element => {return element.channel === "Facebook"});
            facebookInput.value = facebookInfo[0].data;
            facebookPreference.value = facebookInfo[0].preference;
            actualSymbolUpdate("selectFacebookPreference",facebookInfo[0].preference);
            let instagramInfo = contactChannel.filter(element => {return element.channel === "Instagram"});
            instagramInput.value = instagramInfo[0].data;
            instagramPreference.value = instagramInfo[0].preference;
            actualSymbolUpdate("selectInstagramPreference",instagramInfo[0].preference);
            let linkedinInfo = contactChannel.filter(element => {return element.channel === "Linkedin"});
            linkeinInput.value = linkedinInfo[0].data;
            linkedinPreference.value = linkedinInfo[0].preference;
            actualSymbolUpdate("selectLinkedinPreference",linkedinInfo[0].preference);

            /* Put event for each edit button channel */
            document.getElementById("editTelephone").addEventListener("click", () => editChannel("telephoneContact","telephonePreference"));
            document.getElementById("editWhastapp").addEventListener("click",() => {editChannel("whatsappContact","whatsappPreference")});
            document.getElementById("editFacebook").addEventListener("click",() => {editChannel("facebookContact","FacebookPreference")});
            document.getElementById("editInstagram").addEventListener("click",() => {editChannel("instagramContact","instagramPreference")});
            document.getElementById("editLinkedin").addEventListener("click",() => {editChannel("linkedinContact","linkedinPreference")});

            /* Put the correct style to the objects */
            if(contactList[index].idCity === null){
                addressInput.disabled = true;
                addressInput.style.cursor = "not-allowed";
                addressInput.style.backgroundColor = "rgba(0,0,0,0.1)";
                addressInput.style.color = "#888888";

                cityInput.disabled = true;
                cityInput.style.cursor = "not-allowed";
                cityInput.style.backgroundColor = "rgba(0,0,0,0.1)";
                cityInput.style.color = "#888888";
                countryInput.disabled = true;
                countryInput.style.cursor = "not-allowed";
                countryInput.style.backgroundColor = "rgba(0,0,0,0.1)";
                countryInput.style.color = "#888888";
            }else{
                addressInput.disabled = false;
                addressInput.style.cursor = "auto";
                addressInput.style.backgroundColor = "#FFFFFF";
                addressInput.style.color = "#000000";
                cityInput.disabled = false;
                cityInput.style.cursor = "pointer";
                cityInput.style.backgroundColor = "#FFFFFF";
                cityInput.style.color = "#000000";
                countryInput.disabled = false;
                countryInput.style.cursor = "pointer";
                countryInput.style.backgroundColor = "#FFFFFF";
                countryInput.style.color = "#000000";
            }
            telephoneInput.disabled = true;
            telephoneInput.style.cursor = "not-allowed";
            telephoneInput.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
            telephoneInput.style.color = "#888888";
            telephonePreference.disabled = true;
            telephonePreference.style.cursor = "not-allowed";
            telephonePreference.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
            whatsappInput.disabled = true;
            whatsappInput.style.cursor = "not-allowed";
            whatsappInput.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
            whatsappInput.style.color = "#888888";
            whatsappPreference.disabled = true;
            whatsappPreference.style.cursor = "not-allowed";
            whatsappPreference.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
            facebookInput.disabled = true;
            facebookInput.style.cursor = "not-allowed";
            facebookInput.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
            facebookInput.style.color = "#888888";
            facebookPreference.disabled = true;
            facebookPreference.style.cursor = "not-allowed";
            facebookPreference.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
            instagramInput.disabled = true;
            instagramInput.style.cursor = "not-allowed";
            instagramInput.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
            instagramInput.style.color = "#888888";
            instagramPreference.disabled = true;
            instagramPreference.style.cursor = "not-allowed";
            instagramPreference.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
            linkeinInput.disabled = true;
            linkeinInput.style.cursor = "not-allowed";
            linkeinInput.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
            linkeinInput.style.color = "#888888";
            linkedinPreference.disabled = true;
            linkedinPreference.style.cursor = "not-allowed";
            linkedinPreference.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
            regionInput.disabled = false;
            regionInput.style.cursor = "pointer";
            regionInput.style.backgroundColor = "#FFFFFF";
            regionInput.style.color = "#000000";

            /* Put the belonging color according to the interest percentage */
            let twentyFivePercentage = document.getElementById("twentyFive");
            let fiftyPercentage = document.getElementById("fifty");
            let seventyFivePercentage = document.getElementById("seventyFive");
            let oneHundredPercentage = document.getElementById("oneHundred");
            let circlePercentage = document.getElementById("circleSelection");
            if(`${contactList[index].interest}%` === "0%"){
                twentyFivePercentage.style.backgroundColor = "#FFFFFF";
                fiftyPercentage.style.backgroundColor = "#FFFFFF";
                seventyFivePercentage.style.backgroundColor = "#FFFFFF";
                oneHundredPercentage.style.backgroundColor = "#FFFFFF";
                circlePercentage.style.left = "-5px";
            }else if(`${contactList[index].interest}%` === "25%"){
                twentyFivePercentage.style.backgroundColor = "#1CC1F5";
                fiftyPercentage.style.backgroundColor = "#FFFFFF";
                seventyFivePercentage.style.backgroundColor = "#FFFFFF";
                oneHundredPercentage.style.backgroundColor = "#FFFFFF";
                circlePercentage.style.left = "48px";
            }else if(`${contactList[index].interest}%` === "50%"){
                twentyFivePercentage.style.backgroundColor = "#FFC700";
                fiftyPercentage.style.backgroundColor = "#FFC700";
                seventyFivePercentage.style.backgroundColor = "#FFFFFF";
                oneHundredPercentage.style.backgroundColor = "#FFFFFF";
                circlePercentage.style.left = "107px";
            }else if(`${contactList[index].interest}%` === "75%"){
                twentyFivePercentage.style.backgroundColor = "#FF6F00";
                fiftyPercentage.style.backgroundColor = "#FF6F00";
                seventyFivePercentage.style.backgroundColor = "#FF6F00";
                oneHundredPercentage.style.backgroundColor = "#FFFFFF";
                circlePercentage.style.left = "166px";
            }else if(`${contactList[index].interest}%` === "100%"){
                twentyFivePercentage.style.backgroundColor = "#DE0028";
                fiftyPercentage.style.backgroundColor = "#DE0028";
                seventyFivePercentage.style.backgroundColor = "#DE0028";
                oneHundredPercentage.style.backgroundColor = "#DE0028";
                circlePercentage.style.left = "220px";
            };
        });
    };
};

/* Delete one by one of the contacts */

function deleteOneContact(){
    const contactList = JSON.parse(sessionStorage.getItem("contacts"));
    for (let index = 0; index < contactList.length; index++) {
        document.getElementById(`deleteContact-${contactList[index].idContact}`).addEventListener("click", event => {
            document.getElementById("modalAlertDeleteUser").style.display = "flex";
            document.getElementById("userDelete").innerText = `¿Seguro que deseas eliminar el contacto "${contactList[index].name} ${contactList[index].lastName}"?`;
            sessionStorage.setItem("onlyOneContactDelete",contactList[index].idContact);
        });
    };
};

document.getElementById("deleteContactForm").addEventListener("click", event => {
    const contacts = JSON.parse(sessionStorage.getItem("contacts"));
    const idToDelete = sessionStorage.getItem("onlyOneContactDelete");
    const contactToDelete = contacts.filter(function (element) {
        return element.idContact == idToDelete;
    });
    
    if(event.target.innerText === "Eliminar contacto"){
        document.getElementById("modalFormContact").style.display = "none";
        document.getElementById("modalAlertDeleteUser").style.display = "flex";
        document.getElementById("userDelete").innerText = `¿Seguro que deseas eliminar el contacto "${contactToDelete[0].name} ${contactToDelete[0].lastName}"?`;
    };
});

/* Delete all contacts selected */

document.getElementById("deleteAllContactsSelected").addEventListener("click", event => {
    document.getElementById("modalAlertDeleteUser").style.display = "flex";
    document.getElementById("userDelete").innerText = `¿Seguro que deseas eliminar los contactos seleccionados?`;
});

/* Delete contacts according to the button (trash or delete all contacts) */

document.getElementById("deleteDone").addEventListener("click", async event => {
    const jwt = jwtLogued();
    const headerJwt = headerAuthorization(jwt);
    if(document.getElementById("userDelete").innerText.includes("los contactos")){
        const contactListDelete = JSON.parse(sessionStorage.getItem("contactsDelete"));
        for (let index = 0; index < contactListDelete.length; index++) {
            let fetchResults = await fetch(`http://localhost:3000/contact/${contactListDelete[index]}`, {
                method: 'DELETE',
                headers: headerJwt
            });
            let jsonValue = await fetchResults.json();
            console.log(jsonValue);
        };
        document.getElementById("modalAlertDeleteUser").style.display = "none";
    }else{
        const idContact = sessionStorage.getItem("onlyOneContactDelete");
        let fetchResults = await fetch(`http://localhost:3000/contact/${idContact}`, {
            method: 'DELETE',
            headers: headerJwt
        });
        let jsonValue = await fetchResults.json();
        console.log(jsonValue);
    };
    location.reload();
});

/* -------------------------------------------------------------------------------------------------------- */

/* Events done for the form ------------------------------------------------------------------------------- */

/* Put colors according to the interest percentage selected of the contact */
document.getElementById("twentyFive").addEventListener("click", event => {
    let selectInterest = document.getElementById("selectInterest");
    let circleInterest = document.getElementById("circleSelection");
    if(selectInterest.value === "0%" || selectInterest.value === "50%" || selectInterest.value === "75%" || selectInterest.value === "100%"){
        selectInterest.value = "25%";
        event.target.style.backgroundColor = "#1CC1F5";
        document.getElementById("fifty").style.backgroundColor = "#FFFFFF";
        document.getElementById("seventyFive").style.backgroundColor = "#FFFFFF";
        document.getElementById("oneHundred").style.backgroundColor = "#FFFFFF";
        circleInterest.style.left = "48px";
    }else if (selectInterest.value === "25%"){
        selectInterest.value = "0%";
        event.target.style.backgroundColor = "#FFFFFF";
        document.getElementById("fifty").style.backgroundColor = "#FFFFFF";
        document.getElementById("seventyFive").style.backgroundColor = "#FFFFFF";
        document.getElementById("oneHundred").style.backgroundColor = "#FFFFFF";
        circleInterest.style.left = "-5px";
    };
});

document.getElementById("fifty").addEventListener("click", event => {
    event.target.style.backgroundColor = "#FFC700";
    document.getElementById("twentyFive").style.backgroundColor = "#FFC700";
    document.getElementById("seventyFive").style.backgroundColor = "#FFFFFF";
    document.getElementById("oneHundred").style.backgroundColor = "#FFFFFF";
    document.getElementById("circleSelection").style.left = "107px";
    document.getElementById("selectInterest").value = "50%";
});

document.getElementById("seventyFive").addEventListener("click", event => {
    event.target.style.backgroundColor = "#FF6F00";
    document.getElementById("fifty").style.backgroundColor = "#FF6F00";
    document.getElementById("twentyFive").style.backgroundColor = "#FF6F00";
    document.getElementById("oneHundred").style.backgroundColor = "#FFFFFF";
    document.getElementById("circleSelection").style.left = "166px";
    document.getElementById("selectInterest").value = "75%";
});

document.getElementById("oneHundred").addEventListener("click", event => {
    event.target.style.backgroundColor = "#DE0028";
    document.getElementById("seventyFive").style.backgroundColor = "#DE0028";
    document.getElementById("fifty").style.backgroundColor = "#DE0028";
    document.getElementById("twentyFive").style.backgroundColor = "#DE0028";
    document.getElementById("circleSelection").style.left = "220px";
    document.getElementById("selectInterest").value = "100%";
});

document.getElementById("selectInterest").addEventListener("change", event => {
    let twentyFivePercentage = document.getElementById("twentyFive");
    let fiftyPercentage = document.getElementById("fifty");
    let seventyFivePercentage = document.getElementById("seventyFive");
    let oneHundredPercentage = document.getElementById("oneHundred");
    let circlePercentage = document.getElementById("circleSelection");
    if(event.target.value === "0%"){
        twentyFivePercentage.style.backgroundColor = "#FFFFFF";
        fiftyPercentage.style.backgroundColor = "#FFFFFF";
        seventyFivePercentage.style.backgroundColor = "#FFFFFF";
        oneHundredPercentage.style.backgroundColor = "#FFFFFF";
        circlePercentage.style.left = "-5px";
    }else if(event.target.value === "25%"){
        twentyFivePercentage.style.backgroundColor = "#1CC1F5";
        fiftyPercentage.style.backgroundColor = "#FFFFFF";
        seventyFivePercentage.style.backgroundColor = "#FFFFFF";
        oneHundredPercentage.style.backgroundColor = "#FFFFFF";
        circlePercentage.style.left = "48px";
    }else if(event.target.value === "50%"){
        twentyFivePercentage.style.backgroundColor = "#FFC700";
        fiftyPercentage.style.backgroundColor = "#FFC700";
        seventyFivePercentage.style.backgroundColor = "#FFFFFF";
        oneHundredPercentage.style.backgroundColor = "#FFFFFF";
        circlePercentage.style.left = "107px";
    }else if(event.target.value === "75%"){
        twentyFivePercentage.style.backgroundColor = "#FF6F00";
        fiftyPercentage.style.backgroundColor = "#FF6F00";
        seventyFivePercentage.style.backgroundColor = "#FF6F00";
        oneHundredPercentage.style.backgroundColor = "#FFFFFF";
        circlePercentage.style.left = "166px";
    }else if(event.target.value === "100%"){
        twentyFivePercentage.style.backgroundColor = "#DE0028";
        fiftyPercentage.style.backgroundColor = "#DE0028";
        seventyFivePercentage.style.backgroundColor = "#DE0028";
        oneHundredPercentage.style.backgroundColor = "#DE0028";
        circlePercentage.style.left = "220px";
    };
});

/* Change preference symbol according to its value */
function changePreferenceSymbol(event,idSelect){
    let preferenceSelected = document.querySelector(`#${idSelect} .preferenceSymbol`);
    preferenceSelected.style.visibility = "visible";
    if(event.target.value === "No molestar"){
        preferenceSelected.classList.replace("icon-heart","icon-ban");
    }else if(event.target.value === "Canal favorito"){
        preferenceSelected.classList.replace("icon-ban","icon-heart");
    }else if(event.target.value === "Sin preferencia"){
        preferenceSelected.style.visibility = "hidden";
    };
};

document.getElementById("telephonePreference").addEventListener("change", event => changePreferenceSymbol(event,"selectTelephonePreference"));
document.getElementById("whatsappPreference").addEventListener("change", event => changePreferenceSymbol(event,"selectWhatsappPreference"));
document.getElementById("FacebookPreference").addEventListener("change", event => changePreferenceSymbol(event,"selectFacebookPreference"));
document.getElementById("instagramPreference").addEventListener("change", event => changePreferenceSymbol(event,"selectInstagramPreference"));
document.getElementById("linkedinPreference").addEventListener("change", event => changePreferenceSymbol(event,"selectLinkedinPreference"));

/* Init styles of main objects according to the addition or upgrade a contact */
function initMainObjectStyles() {
    document.getElementById("alertName").style.visibility = "hidden";
    document.getElementById("alertLastName").style.visibility = "hidden";
    document.getElementById("alertProfile").style.visibility = "hidden";
    document.getElementById("alertEmail").style.visibility = "hidden";
    document.getElementById("alertCompany").style.visibility = "hidden";
    document.getElementById("alertTelephoneData").style.visibility = "hidden";
    document.getElementById("alertWhatsappData").style.visibility = "hidden";
    document.getElementById("alertFacebookData").style.visibility = "hidden";
    document.getElementById("alertInstagramData").style.visibility = "hidden";
    document.getElementById("alertLinkedinData").style.visibility = "hidden";
};

/* Get all the values of the companies according to the database */
async function companyFetch() {
    const jwt = jwtLogued();
    const headerJwt = headerAuthorization(jwt);
    const fetchResults = await fetch(`http://localhost:3000/companies`, {headers: headerJwt});
    const jsonCompanyList = await fetchResults.json();
    return jsonCompanyList;
};

/* Change the size of the company select tag according to the click */
function selectCompanySize(){
    document.getElementById("companyOptions").addEventListener("click",event => {
        event.target.style.borderColor = "#CCCCCC";
        document.getElementById("alertCompany").style.visibility = "hidden";
        if(event.target.children.length === 1){
            event.target.size = "0";
        }else if(event.target.children.length === 2){
            event.target.size = "3";
        }else if(event.target.children.length >= 3){
            event.target.size = "4";
        };
    });    
    const companyOptions = document.getElementsByClassName("companyToSelect");
    for (let index = 0; index < companyOptions.length; index++) {
        companyOptions[index].addEventListener("click", event => {
            document.getElementById("companyOptions").size = "0";
        })
    };
};

/* Get all the values of regions according to the database */
async function getRegionsData(idRegion){
    const jwt = jwtLogued();
    const headerJwt = headerAuthorization(jwt);
    const fetchResults = await fetch(`http://localhost:3000/places/region`, {headers: headerJwt});
    const jsonRegions = await fetchResults.json();
    let regionList = '<option class="companyToSelect" value="0">Seleccionar región</option>';
    for (let index = 0; index < jsonRegions.length; index++) {
        regionList += `<option class="companyToSelect" value="${jsonRegions[index].idRegion}">${jsonRegions[index].region}</option>`;
    };
    document.getElementById("regionOptions").innerHTML = regionList;
    document.getElementById("regionOptions").value = idRegion;
    selectPlaceSize("regionOptions");
};

/* Get all the values of countries according to the region value */
async function getCountriesData(idRegion,idCountry){
    const jwt = jwtLogued();
    const headerJwt = headerAuthorization(jwt);
    const fetchResults = await fetch(`http://localhost:3000/places/country?idPlace=${idRegion}`, {headers: headerJwt});
    const jsonCountries = await fetchResults.json();
    let countryList = '<option class="companyToSelect" value="0">Seleccionar país</option>';
    for (let index = 0; index < jsonCountries.length; index++) {
        countryList += `<option class="companyToSelect" value="${jsonCountries[index].idCountry}">${jsonCountries[index].country}</option>`;
    };
    document.getElementById("countryOptions").innerHTML = countryList;
    document.getElementById("countryOptions").value = idCountry;
    selectPlaceSize("countryOptions");
};

/* Get all the values of cities according to the country value */
async function getCitiesData(idCountry,idCity){
    const jwt = jwtLogued();
    const headerJwt = headerAuthorization(jwt);
    const fetchResults = await fetch(`http://localhost:3000/places/city?idPlace=${idCountry}`, {headers: headerJwt});
    const jsonCities = await fetchResults.json();
    let cityList = '<option class="companyToSelect" value="0">Seleccionar Ciudad</option>';
    for (let index = 0; index < jsonCities.length; index++) {
        cityList += `<option class="companyToSelect" value="${jsonCities[index].idCity}">${jsonCities[index].city}</option>`;
    };
    document.getElementById("cityOptions").innerHTML = cityList;
    document.getElementById("cityOptions").value = idCity;
    selectPlaceSize("cityOptions");
};

/* Change the size of the place select tag according to the click */
function selectPlaceSize(place){
    const placeObject = document.getElementById(place);
    placeObject.addEventListener("click",event => {
        if(event.target.children.length === 1){
            event.target.size = "0";
        }else if(event.target.children.length === 2){
            event.target.size = "3";
            event.target.style.height = "fit-content";
        }else if(event.target.children.length >= 3){
            event.target.size = "4";
            event.target.style.height = "fit-content";
        };
        const selectRegion = document.getElementById("regionOptions");
        const selectCountry = document.getElementById("countryOptions");
        const selectCity = document.getElementById("cityOptions");
        if(place === "regionOptions"){
            selectCountry.size = "0";
            selectCountry.style.height = "35.5px";
            selectCity.size = "0";
            selectCity.style.height = "35.5px";
        }else if(place === "countryOptions"){
            selectRegion.size = "0";
            selectRegion.style.height = "35.5px";
            selectCity.size = "0";
            selectCity.style.height = "35.5px";
        }else if(place === "cityOptions"){
            selectRegion.size = "0";
            selectRegion.style.height = "35.5px";
            selectCountry.size = "0";
            selectCountry.style.height = "35.5px";
        }
    });    
    const placeOptions = placeObject.children;
    for (let index = 0; index < placeOptions.length; index++) {
        placeOptions[index].addEventListener("click", event => {
            placeObject.size = "0";
            placeObject.style.height = "35.5px";
            placeObject.style.color = "#000000";
            if(place === "regionOptions"){
                const selectCountry = document.getElementById("countryOptions");
                const selectCity = document.getElementById("cityOptions");
                const addressInput = document.getElementById("addressContact");
                selectCity.disabled = true;
                selectCity.style.cursor = "not-allowed";
                selectCity.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
                selectCity.value = 0;
                addressInput.disabled = true;
                addressInput.style.cursor = "not-allowed";
                addressInput.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
                addressInput.value = "";
                if(placeObject.value !== "0"){
                    selectCountry.disabled = false;
                    selectCountry.style.cursor = "pointer";
                    selectCountry.style.backgroundColor = "#FFFFFF";
                    getCountriesData(placeObject.value,0);
                }else{
                    selectCountry.disabled = true;
                    selectCountry.style.cursor = "not-allowed";
                    selectCountry.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
                    selectCountry.value = 0;
                };
            }else if(place === "countryOptions"){
                const selectCity = document.getElementById("cityOptions");
                const addressInput = document.getElementById("addressContact");
                addressInput.disabled = true;
                addressInput.style.cursor = "not-allowed";
                addressInput.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
                addressInput.value = "";
                if(placeObject.value !== "0"){
                    selectCity.disabled = false;
                    selectCity.style.cursor = "pointer";
                    selectCity.style.backgroundColor = "#FFFFFF";
                    getCitiesData(placeObject.value,0);
                }else{
                    selectCity.disabled = true;
                    selectCity.style.cursor = "not-allowed";
                    selectCity.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
                    selectCity.value = 0;
                };
            }else if(place === "cityOptions"){
                const addressInput = document.getElementById("addressContact");
                if(placeObject.value !== "0"){
                    addressInput.disabled = false;
                    addressInput.style.cursor = "pointer";
                    addressInput.style.backgroundColor = "#FFFFFF";
                    addressInput.style.color = "#000000";
                    addressInput.value = "";
                }else{
                    addressInput.disabled = true;
                    addressInput.style.cursor = "not-allowed";
                    addressInput.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
                    addressInput.value = "";
                };
            };
        });
    };
};

document.getElementById("addressContact").addEventListener("input", event => {
    const selectRegion = document.getElementById("regionOptions");
    const selectCountry = document.getElementById("countryOptions");
    const selectCity = document.getElementById("cityOptions");
    selectRegion.size = "0";
    selectRegion.style.height = "35.5px";
    selectCountry.size = "0";
    selectCountry.style.height = "35.5px";
    selectCity.size = "0";
    selectCity.style.height = "35.5px";
});

/* Validate all data inputs that do not come empty */
function specificValidationEmptyValue(object,alert){
    if((!object.value && object.tagName === "INPUT") || (object.value === "0" && object.tagName === "SELECT")){
        object.style.borderColor = "#F03738";
        const alertMessage = document.getElementById(alert);
        alertMessage.style.visibility = "visible";
        alertMessage.innerText = "Este campo es obligatorio";
        return true;
    };
    return false;
};

function validatDataInputsEmpty(){
    const nameInput = document.getElementById("contact");
    const lastNameInput = document.getElementById("lastName");
    const profileInput = document.getElementById("profile");
    const emailInput = document.getElementById("email");
    const companyInput = document.getElementById("companyOptions");

    specificValidationEmptyValue(nameInput,"alertName");
    specificValidationEmptyValue(lastNameInput,"alertLastName");
    specificValidationEmptyValue(profileInput,"alertProfile");
    specificValidationEmptyValue(emailInput,"alertEmail");
    specificValidationEmptyValue(companyInput,"alertCompany");

    if(specificValidationEmptyValue(nameInput,"alertName") || specificValidationEmptyValue(lastNameInput,"alertLastName") || specificValidationEmptyValue(profileInput,"alertProfile") || specificValidationEmptyValue(emailInput,"alertEmail") || specificValidationEmptyValue(companyInput,"alertCompany")){
        return true;
    }else{
        return false;
    };
};

/* Restart the input style when it has an input event  */
document.querySelectorAll("#modalFormContact input").forEach(item => {
    item.addEventListener("input", event => {
        event.target.style.borderColor = "#CCCCCC";
        if(event.target.id === "contact"){
            document.getElementById("alertName").style.visibility = "hidden";
        }else if(event.target.id === "lastName"){
            document.getElementById("alertLastName").style.visibility = "hidden";
        }else if(event.target.id === "profile"){
            document.getElementById("alertProfile").style.visibility = "hidden";
        }else if(event.target.id === "email"){
            document.getElementById("alertEmail").style.visibility = "hidden";
        }else if(event.target.id === "telephoneContact"){
            document.getElementById("alertTelephoneData").style.visibility = "hidden";
        }else if(event.target.id === "whatsappContact"){
            document.getElementById("alertWhatsappData").style.visibility = "hidden";
        }else if(event.target.id === "facebookContact"){
            document.getElementById("alertFacebookData").style.visibility = "hidden";
        }else if(event.target.id === "instagramContact"){
            document.getElementById("alertInstagramData").style.visibility = "hidden";
        }else if(event.target.id === "linkedinContact"){
            document.getElementById("alertLinkedinData").style.visibility = "hidden";
        };
    });
});

document.getElementById("companyOptions").addEventListener("input", event => {
    event.target.style.borderColor = "#CCCCCC";
    document.getElementById("alertCompany").style.visibility = "hidden";
});

/* Validate the input value from numerical requirements */
function validateNumericalValues(inputTag){
    if(!inputTag.value){
        return false;
    }else{
        const numberWithoutWhiteSpaces = inputTag.value.replace(/\s/g,"");
        if(inputTag.id === "telephoneContact" && isNaN(numberWithoutWhiteSpaces)){
            const alertTelephone = document.getElementById("alertTelephoneData");
            alertTelephone.style.visibility = "visible";
            alertTelephone.innerText = "Error en datos ingresados";
            inputTag.style.borderColor = "#F03738";
        }else if(inputTag.id === "whatsappContact" && isNaN(numberWithoutWhiteSpaces)){
            const alertWhatsapp = document.getElementById("alertWhatsappData");
            alertWhatsapp.style.visibility = "visible";
            alertWhatsapp.innerText = "Error en datos ingresados";
            inputTag.style.borderColor = "#F03738";
        };
        return isNaN(numberWithoutWhiteSpaces);
    };
};

/* Validate the email input to prevent repeated email */
function validateEmailUniqueAndWrite(tagEmail,action,idContactEdit){
    const actualContacts = JSON.parse(sessionStorage.getItem("contacts"));
    const alertEmail = document.getElementById("alertEmail");
    if(!tagEmail.value){
        tagEmail.style.borderColor = "#F03738";
        alertEmail.style.visibility = "visible";
        alertEmail.innerText = "Este campo es obligatorio";
        return true;
    };
    if(action === "create"){
        const emailExist = actualContacts.filter(function(value){
            return value.email === tagEmail.value;
        });
        if(emailExist.length !== 0){
            tagEmail.style.borderColor = "#F03738";
            alertEmail.style.visibility = "visible";
            alertEmail.innerText = "Correo ya existente";
            return true;
        };
    }else if(action === "update"){
        const actualContactInfo = actualContacts.filter(function(value){
            return value.idContact === idContactEdit;
        });
        const emailsWithoutContactToUpdate = actualContacts.filter(function(value){
            return value.email !== actualContactInfo[0].email;
        });
        const emailExist = emailsWithoutContactToUpdate.filter(function(value){
            return value.email === tagEmail.value;
        });
        if(emailExist.length !== 0){
            tagEmail.style.borderColor = "#F03738";
            alertEmail.style.visibility = "visible";
            alertEmail.innerText = "Correo ya existente";
            return true;
        };
    };
    /* Regex pattern to validate email writing */
    let emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    /* console.log("validateEmail",emailPattern.test(tagEmail.value)); */
    if(emailPattern.test(tagEmail.value)){
        return false;
    }else{
        tagEmail.style.borderColor = "#F03738";
        alertEmail.style.visibility = "visible";
        alertEmail.innerText = "Error en datos ingresados";
        return true;
    }
};

/* Create or update a contact */
document.getElementById("createEditContact").addEventListener("click", async event => {
    const leftButtonSaveContact = document.getElementById("deleteContactForm");
    const nameInput = document.getElementById("contact");
    const lastNameInput = document.getElementById("lastName");
    const profileInput = document.getElementById("profile");
    const emailInput = document.getElementById("email");
    const companyInput = document.getElementById("companyOptions");
    const cityInput = document.getElementById("cityOptions");
    const addressInput = document.getElementById("addressContact");
    const interestInput = document.getElementById("selectInterest");
    const telephoneInput = document.getElementById("telephoneContact");
    const telephonePreference = document.getElementById("telephonePreference");
    const whatsappInput = document.getElementById("whatsappContact");
    const whatsappPreference = document.getElementById("whatsappPreference");
    const facebookInput = document.getElementById("facebookContact");
    const facebookPreference = document.getElementById("FacebookPreference");
    const instagramInput = document.getElementById("instagramContact");
    const instagramPreference = document.getElementById("instagramPreference");
    const linkeinInput  = document.getElementById("linkedinContact");
    const linkedinPreference = document.getElementById("linkedinPreference");

    const emptyMainValues = validatDataInputsEmpty();
    const notNumberTelephoneValidation = validateNumericalValues(telephoneInput);
    const notNumberwhatsappValidation = validateNumericalValues(whatsappInput);
    let emailAlreadyExistsOrMisspelled = false;

    /* Add Buenos Aires city, Argentina country and Sudamérica  */
    let idCityValue = "";
    (cityInput.value === "0")? idCityValue = null: idCityValue = cityInput.value;

    if(leftButtonSaveContact.innerText === "Cancelar"){
        emailAlreadyExistsOrMisspelled = validateEmailUniqueAndWrite(emailInput,"create",0);
        if(!emptyMainValues && !notNumberTelephoneValidation && !notNumberwhatsappValidation && !emailAlreadyExistsOrMisspelled){
            let raw = JSON.stringify({
                "idCompany": companyInput.value,
                "idCity": idCityValue,
                "name": capitalize(nameInput.value),
                "lastName": capitalize(lastNameInput.value),
                "email": emailInput.value,
                "address": addressInput.value,
                "position": capitalize(profileInput.value),
                "interest": interestInput.value,
                "dataTelephone": telephoneInput.value,
                "preferenceTelephone": telephonePreference.value,
                "dataWhatsapp": whatsappInput.value,
                "preferenceWhatsapp": whatsappPreference.value,
                "dataFacebook": facebookInput.value,
                "preferenceFacebook": facebookPreference.value,
                "dataInstagram": instagramInput.value,
                "preferenceInstagram": instagramPreference.value,
                "dataLinkedin": linkeinInput.value,
                "preferenceLinkedin": linkedinPreference.value
            });
            const jwt = jwtLogued();
            const headerJwt = headerAuthorization(jwt);
            let fetchResults = await fetch("http://localhost:3000/contact/register", {
                method: 'POST',
                body: raw,
                headers: headerJwt
            });
            let jsonValue = await fetchResults.json();
            document.getElementById("modalFormContact").style.display = "none";
            console.log(jsonValue);
            location.reload();
        };
    }else if(leftButtonSaveContact.innerText === "Eliminar contacto"){
        emailAlreadyExistsOrMisspelled = validateEmailUniqueAndWrite(emailInput,"update",parseInt(sessionStorage.getItem("editContact")));
        if(!emptyMainValues && !notNumberTelephoneValidation && !notNumberwhatsappValidation && !emailAlreadyExistsOrMisspelled){
            const idContact = sessionStorage.getItem("editContact");
            let raw = JSON.stringify({
                "idCompany": companyInput.value,
                "idCity": idCityValue,
                "name": capitalize(nameInput.value),
                "lastName": capitalize(lastNameInput.value),
                "email": emailInput.value,
                "address": addressInput.value,
                "position": capitalize(profileInput.value),
                "interest": interestInput.value,
                "dataTelephone": telephoneInput.value,
                "preferenceTelephone": telephonePreference.value,
                "dataWhatsapp": whatsappInput.value,
                "preferenceWhatsapp": whatsappPreference.value,
                "dataFacebook": facebookInput.value,
                "preferenceFacebook": facebookPreference.value,
                "dataInstagram": instagramInput.value,
                "preferenceInstagram": instagramPreference.value,
                "dataLinkedin": linkeinInput.value,
                "preferenceLinkedin": linkedinPreference.value
            });
            const jwt = jwtLogued();
            const headerJwt = headerAuthorization(jwt);
            let fetchResults = await fetch(`http://localhost:3000/contact/${idContact}`, {
                method: 'PUT',
                body: raw,
                headers: headerJwt
            });
            let jsonValue = await fetchResults.json();
            document.getElementById("modalFormContact").style.display = "none";
            console.log(jsonValue);
            location.reload();
        };
    };
});

/* Common actions and events to create or edit a contact */
async function commonEventsCreateEditContact(innerTextLeftButton,hideShowEditButtons,idCompany){
    /* Style to create a contact */
    document.getElementById("modalFormContact").style.display = "flex";
    document.getElementById("deleteContactForm").innerText = innerTextLeftButton;

    /* Put all the values of the companies according to the database */
    let companyList = await companyFetch();
    let companyOptions = `<option class="companyToSelect" value="0">Ingresa nombre de compañía</option>`;
    for (let index = 0; index < companyList.length; index++) {
        companyOptions += `<option class="companyToSelect" value="${companyList[index].idCompany}">${companyList[index].company}</option>`;
    };
    document.getElementById("companyOptions").innerHTML = companyOptions;
    document.getElementById("companyOptions").value = idCompany;
    selectCompanySize();

    /* Hide the all alerts for each inputs and selects */
    initMainObjectStyles();

    /* Hide or show all edit buttons */
    let listButtonsEditChannel = document.getElementById("buttonEditSection").children;
    for (let index = 0; index < listButtonsEditChannel.length; index++) {
        listButtonsEditChannel[index].style.visibility = hideShowEditButtons;
    };

    /* Put all input borders in grey */
    document.querySelectorAll("#modalFormContact input").forEach(item => {
        item.style.borderColor = "#CCCCCC";
    });
    document.getElementById("companyOptions").style.borderColor = "#CCCCCC";

    /* Put all selects with size zero (0) */
    document.getElementById("companyOptions").size = 0;
    document.getElementById("regionOptions").size = 0;
    document.getElementById("countryOptions").size = 0;
    document.getElementById("cityOptions").size = 0;
    document.getElementById("regionOptions").style.height = "35.5px";
    document.getElementById("countryOptions").style.height = "35.5px";
    document.getElementById("cityOptions").style.height = "35.5px";
};

/* Create a new contact */
document.getElementById("newContact").addEventListener("click", async event => {
    commonEventsCreateEditContact("Cancelar","hidden",0);//Common actions and events to create or edit a contact

    /* Put values for the regions */
    getRegionsData(0);

    /* Quit all values for all input in the form */
    document.querySelectorAll("#modalFormContact input").forEach(item => {
        item.value = "";
    });

    /* Initialize each object according to the contact creation */
    document.getElementById("twentyFive").style.backgroundColor = "#FFFFFF";
    document.getElementById("fifty").style.backgroundColor = "#FFFFFF";
    document.getElementById("seventyFive").style.backgroundColor = "#FFFFFF";
    document.getElementById("oneHundred").style.backgroundColor = "#FFFFFF";
    document.getElementById("circleSelection").style.left = "-5px";
    document.getElementById("selectInterest").value = "0%";
    let inputTelephone = document.getElementById("telephoneContact");
    inputTelephone.disabled = false;
    inputTelephone.style.cursor = "auto";
    inputTelephone.style.background = "#FFFFFF";
    inputTelephone.style.color = "#000000";
    let inputWhatsapp = document.getElementById("whatsappContact");
    inputWhatsapp.disabled = false;
    inputWhatsapp.style.cursor = "auto";
    inputWhatsapp.style.background = "#FFFFFF";
    inputWhatsapp.style.color = "#000000";
    let inputFacebook = document.getElementById("facebookContact");
    inputFacebook.disabled = false;
    inputFacebook.style.cursor = "auto";
    inputFacebook.style.background = "#FFFFFF";
    inputFacebook.style.color = "#000000";
    let inputInstagram = document.getElementById("instagramContact");
    inputInstagram.disabled = false;
    inputInstagram.style.cursor = "auto";
    inputInstagram.style.background = "#FFFFFF";
    inputInstagram.style.color = "#000000";
    let inputLinkedin = document.getElementById("linkedinContact");
    inputLinkedin.disabled = false;
    inputLinkedin.style.cursor = "auto";
    inputLinkedin.style.background = "#FFFFFF";
    inputLinkedin.style.color = "#000000";
    document.getElementById("telephonePreference").value = "Sin preferencia";
    document.getElementById("whatsappPreference").value = "Sin preferencia";
    document.getElementById("FacebookPreference").value = "Sin preferencia";
    document.getElementById("instagramPreference").value = "Sin preferencia";
    document.getElementById("linkedinPreference").value = "Sin preferencia";
    let listPreferenceSymbols = document.getElementsByClassName("preferenceSymbol");
    for (let index = 0; index < listPreferenceSymbols.length; index++) {
        listPreferenceSymbols[index].style.visibility = "hidden";  
    };
    document.getElementById("companyOptions").size = "0";
    let selectRegion = document.getElementById("regionOptions");
    selectRegion.style.color = "rgba(0, 0, 0, 0.6)";
    selectRegion.value = 0;
    let selectCountry = document.getElementById("countryOptions");
    selectCountry.disabled = true;
    selectCountry.style.cursor = "not-allowed";
    selectCountry.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
    selectCountry.value = 0;
    let selectCity = document.getElementById("cityOptions");
    selectCity.disabled = true;
    selectCity.style.cursor = "not-allowed";
    selectCity.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
    selectCity.value = 0;
    let addressInput = document.getElementById("addressContact");
    addressInput.disabled = true;
    addressInput.style.cursor = "not-allowed";
    addressInput.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
    addressInput.style.color = "#888888";
});

/* -------------------------------------------------------------------------------------------------------- */