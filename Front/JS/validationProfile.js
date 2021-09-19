(function() {
    const JWTRol = localStorage.getItem("JWT");
    if(JWTRol === ""){
        document.getElementById("errorLoginPage").style.height = "fit-content";
        document.getElementById("loginApproved").style.height = "0px";
    }else{
        document.getElementById("errorLoginPage").style.margin = "0";
    };
    const rol = JWTRol.slice(-1);
    const titlePage = document.title;

    if(rol === "1"){
        if(titlePage === "Compañias"){
            document.getElementById("pages").style.backgroundPosition = "left 31% bottom";
        };
    }else if(rol === "0"){
        if(titlePage != "Usuarios"){
            document.getElementById("usersPage").style.display = "none";
            if(titlePage === "Compañias"){
                document.getElementById("pages").style.backgroundPosition = "left 44.5% bottom";
            }
        }else if(titlePage === "Usuarios"){
            document.getElementById("errorLoginPage").style.height = "fit-content";
            document.getElementById("errorLoginPage").style.margin = "350px 0 0 0";
            document.getElementById("loginApproved").style.height = "0px";
            document.getElementById("errorLogin").innerText = "Código de error: 403";
            document.getElementById("messageErrorLogin").innerHTML = `Usted no cuenta con los permisos necesarios para acceder a esta página, ingrese al siguiente link: <a href="../index.html" id="loginPage">datawarehouse.com</a> y autentifíquese.`;
        };
    };
})();