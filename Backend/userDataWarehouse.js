/* Modules needed */
const cryptoJS = require("crypto-js");
const connectionData = require('./connection');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const passAes = "secret key 123";

const register = async (req,res) => {
    const {user,name,lastName,email,profile,rol,password} = req.body;
    const newUser = {
        user,
        name,
        lastName,
        email,
        profile,
        rol,
        password
    };
    const cypherPass = cryptoJS.AES.encrypt(newUser.password,passAes).toString();

    if(!newUser.user || !newUser.name || !newUser.lastName || !newUser.email || !newUser.profile || !newUser.rol || !newUser.password){
        res.status(400);
        res.json("The information is incomplete, please verify that all the information is sent.");
    }else{
        const userExist = await connectionData.sequelize.query(`SELECT * FROM user WHERE user = :_user`, {replacements:{_user: newUser.user}, type: connectionData.sequelize.QueryTypes.SELECT});
        if(userExist.length != 0){
            res.status(409);
            res.json("User is not available, please try another user.");
        }else{
            connectionData.sequelize.query(`INSERT INTO user (user,name,lastName,email,profile,rol,password) VALUES (:_user,:_name,:_lastName,:_email,:_profile,:_rol,:_password)`,
            {replacements:{
                _user: newUser.user,
                _name: newUser.name,
                _lastName: newUser.lastName,
                _email: newUser.email,
                _profile: newUser.profile,
                _rol: newUser.rol,
                _password: cypherPass
            }, type: connectionData.sequelize.QueryTypes.INSERT})
            .then(() => {
                res.status(201);
                res.json(`User '${newUser.user}' was created successfully.`);
            });
        };
    };
};

const login = async (req,res) => {
    let rol = 0;
    const {user,password} = req.body;
    const userLogin = {user,password};
    if(!userLogin.user || !userLogin.password){
        res.status(400);
        res.json("The information is incomplete, please verify that all the information is sent.");
    }else{
        const userExist = await connectionData.sequelize.query(`SELECT * FROM user WHERE user = :_user`, {replacements:{_user: userLogin.user}, type: connectionData.sequelize.QueryTypes.SELECT});
        if(userExist.length != 0){
            const bytes = cryptoJS.AES.decrypt(userExist[0].password,passAes);
            const originalPass = bytes.toString(cryptoJS.enc.Utf8);
            if(userExist[0].user === userLogin.user && originalPass === userLogin.password){
                const token = jwt.sign({
                    "user": userExist[0].user,
                    "idUser": userExist[0].idUser,
                    "profile": userExist[0].profile,
                    "rol": userExist[0].rol
                }, process.env.KEY_JWT, {algorithm: 'HS512'});
                if(userExist[0].rol === "admin"){
                    rol = 1;
                }else if(userExist[0].rol === "basic"){
                    rol = 0;
                };
                res.status(200);
                /* The token has the user profile at the end of the string, when 1 is for admin and 0 for basic */
                res.json(token+rol);
            }else{
                res.status(400);
                res.json("User or password is incorrect.");
            };
        }else{
            res.status(400);
            res.json("User or password is incorrect.");
        }
    };
};

const allUsers = async (req,res) => {
    const users = await connectionData.sequelize.query(`SELECT * FROM user`, {type: connectionData.sequelize.QueryTypes.SELECT});
    res.status(200);
    res.json(users);
};

const updateUserData = async (req,res) => {
    const idUser = req.params.idUser;
    const {user,name,lastName,email,profile,rol,password} = req.body;
    const newUser = {
        user,
        name,
        lastName,
        email,
        profile,
        rol,
        password
    };

    /* Validate that all information comes */
    if(!newUser.user || !newUser.name || !newUser.lastName || !newUser.email || !newUser.profile || !newUser.rol){
        res.status(400);
        res.json("The information is incomplete, please verify that all the information is sent.");
    }else{
        const userIdExist = await connectionData.sequelize.query(`SELECT * FROM user WHERE idUser = :_idUser`, {replacements:{_idUser: idUser}, type: connectionData.sequelize.QueryTypes.SELECT});
        if(userIdExist.length === 0){
            res.status(404);
            res.json("The ID user does not exist in database, please enter a valid ID.");
        }else if(userIdExist[0].user === newUser.user){
            await connectionData.sequelize.query(`UPDATE user SET name = :_name, lastName = :_lastName, email = :_email, profile = :_profile, rol = :_rol WHERE idUser = :_idUser`, 
            {replacements:{
                _idUser: idUser,
                _name: newUser.name,
                _lastName: newUser.lastName,
                _email: newUser.email,
                _profile: newUser.profile,
                _rol: newUser.rol
            }, type: connectionData.sequelize.QueryTypes.UPDATE});
            if(newUser.password != undefined && newUser.password != ""){
                const cypherPass = cryptoJS.AES.encrypt(newUser.password,passAes).toString();
                await connectionData.sequelize.query(`UPDATE user SET password = :_password WHERE idUser = :_idUser`, {replacements:{_password: cypherPass,_idUser: idUser}, type: connectionData.sequelize.QueryTypes.UPDATE});
            }
            res.status(200);
            res.json("Update done.");
        }else if(userIdExist[0].user !== newUser.user){
            const userExist = await connectionData.sequelize.query(`SELECT * FROM user WHERE user = :_user`, {replacements:{_user: newUser.user}, type: connectionData.sequelize.QueryTypes.SELECT});
            if(userExist.length != 0){
                res.status(409);
                res.json(`The update of the user '${newUser.user}' is not possible because the user already exists in another person. Please change the user.`);
            }else{
                await connectionData.sequelize.query(`UPDATE user SET user = :_user, name = :_name, lastName = :_lastName, email = :_email, profile = :_profile, rol = :_rol WHERE idUser = :_idUser`, 
                {replacements:{
                    _idUser: idUser,
                    _user: newUser.user,
                    _name: newUser.name,
                    _lastName: newUser.lastName,
                    _email: newUser.email,
                    _profile: newUser.profile,
                    _rol: newUser.rol
                }, type: connectionData.sequelize.QueryTypes.UPDATE});
                if(newUser.password != undefined && newUser.password != ""){
                    const cypherPass = cryptoJS.AES.encrypt(newUser.password,passAes).toString();
                    await connectionData.sequelize.query(`UPDATE user SET password = :_password WHERE idUser = :_idUser`, {replacements:{_password: cypherPass,_idUser: idUser}, type: connectionData.sequelize.QueryTypes.UPDATE});
                }
                res.status(200);
                res.json("Update done.");
            };
        };
    };
};

const deleteUser = async (req,res) => {
    const idUser = req.params.idUser;
    const userIdExist = await connectionData.sequelize.query(`SELECT * FROM user WHERE idUser = :_idUser`, {replacements:{_idUser: idUser}, type: connectionData.sequelize.QueryTypes.SELECT});
    if(userIdExist.length === 0){
        res.status(404);
        res.json("The ID user does not exist in database, please enter a valid ID.");
    }else{
        await connectionData.sequelize.query(`DELETE FROM user WHERE idUser = :_idUser`, {replacements:{_idUser: idUser}, type: connectionData.sequelize.QueryTypes.DELETE});
        res.status(200);
        res.json(`The user '${userIdExist[0].user}' was deleted successfully`);
    };
};

module.exports = {register,login,allUsers,updateUserData,deleteUser};