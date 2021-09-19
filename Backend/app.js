/* Modules needed for technical functions ------------------------------------------------------------------------------------------------------------------- */
const connectionData = require('./connection');
const serverData = require('./server');
const tablesInitial = require('./tablesInitial');
const middlewares = require('./middlewares');
const expressJwt = require('express-jwt');
const cors = require('cors');
require('dotenv').config();

serverData.server.use(serverData.express.json()); /* Use json files */
serverData.server.use(cors()); /* Put cors to allow the connection between frontend and backend with local ports */

/* Put a middleware to request the JWT, for all endpoints except login and register */
serverData.server.use(expressJwt({
    secret: process.env.KEY_JWT,
    algorithms: ['HS512']
})
    .unless({path: ['/user/login']}));

/* Modules needed for endpoints functions ------------------------------------------------------------------------------------------------------------------- */
const userDataWarehouse = require('./userDataWarehouse');
const regionDataWarehouse = require('./regionDataWarehouse');
const companyDataWarehouse = require('./companyDataWarehouse');
const contactDataWarehouse = require('./contactDataWarehouse');

/* Create empty tables ------------------------------------------------------------------------------------------------------------------- */

setTimeout(() => {
    connectionData.sequelize.query(tablesInitial.user.createTable);
    console.log(`Table user created`);
},1000);

setTimeout(() => {
    connectionData.sequelize.query(tablesInitial.region.createTable);
    console.log(`Table region created`);
},1200);

setTimeout(() => {
    connectionData.sequelize.query(tablesInitial.country.createTable);
    console.log(`Table country created`);
},1400);

setTimeout(() => {
    connectionData.sequelize.query(tablesInitial.city.createTable);
    console.log(`Table city created`);
},1600);

setTimeout(() => {
    connectionData.sequelize.query(tablesInitial.company.createTable);
    console.log(`Table company created`);
},1800);

setTimeout(() => {
    connectionData.sequelize.query(tablesInitial.contact.createTable);
    console.log(`Table contact created`);
},2000);

setTimeout(() => {
    connectionData.sequelize.query(tablesInitial.channel.createTable);
    console.log(`Table channel created`);
},2200);

setTimeout(() => {
    connectionData.sequelize.query(tablesInitial.contactChannel.createTable);
    console.log(`Table contact channel created`);
},2400);

/* Insert values only in case that the database is empty --------------------------------------------------------------------------------- */

/* user table */
setTimeout(() => {
    connectionData.sequelize.query(`SELECT * FROM user`, {type: connectionData.sequelize.QueryTypes.SELECT})
    .then((queryResult) => {
        if(queryResult.length === 0){
            console.log("Database user without data");
            connectionData.sequelize.query(tablesInitial.user.setValues);
            console.log("Records have been created for the first time (as minimal data) for user database");
        }else{
            console.log("The database user already has minimal data");
        };
    });
},2600);

/* region table */
setTimeout(() => {
    connectionData.sequelize.query(`SELECT * FROM region`, {type: connectionData.sequelize.QueryTypes.SELECT})
    .then((queryResult) => {
        if(queryResult.length === 0){
            console.log("Database region without data");
            connectionData.sequelize.query(tablesInitial.region.setValues);
            console.log("Records have been created for the first time (as minimal data) for region database");
        }else{
            console.log("The database region already has minimal data");
        };
    });
},2800);

/* country table */
setTimeout(() => {
    connectionData.sequelize.query(`SELECT * FROM country`, {type: connectionData.sequelize.QueryTypes.SELECT})
    .then((queryResult) => {
        if(queryResult.length === 0){
            console.log("Database country without data");
            connectionData.sequelize.query(tablesInitial.country.setValues);
            console.log("Records have been created for the first time (as minimal data) for country database");
        }else{
            console.log("The database country already has minimal data");
        };
    });
},3000);

/* city table */
setTimeout(() => {
    connectionData.sequelize.query(`SELECT * FROM city`, {type: connectionData.sequelize.QueryTypes.SELECT})
    .then((queryResult) => {
        if(queryResult.length === 0){
            console.log("Database city without data");
            connectionData.sequelize.query(tablesInitial.city.setValues);
            console.log("Records have been created for the first time (as minimal data) for city database");
        }else{
            console.log("The database city already has minimal data");
        };
    });
},3200);

/* company table */
setTimeout(() => {
    connectionData.sequelize.query(`SELECT * FROM company`, {type: connectionData.sequelize.QueryTypes.SELECT})
    .then((queryResult) => {
        if(queryResult.length === 0){
            console.log("Database company without data");
            connectionData.sequelize.query(tablesInitial.company.setValues);
            console.log("Records have been created for the first time (as minimal data) for company database");
        }else{
            console.log("The database company already has minimal data");
        };
    });
},3400);

/* contact table */
setTimeout(() => {
    connectionData.sequelize.query(`SELECT * FROM contact`, {type: connectionData.sequelize.QueryTypes.SELECT})
    .then((queryResult) => {
        if(queryResult.length === 0){
            console.log("Database contact without data");
            connectionData.sequelize.query(tablesInitial.contact.setValues);
            console.log("Records have been created for the first time (as minimal data) for contact database");
        }else{
            console.log("The database contact already has minimal data");
        };
    });
},3600);

/* channel table */
setTimeout(() => {
    connectionData.sequelize.query(`SELECT * FROM channel`, {type: connectionData.sequelize.QueryTypes.SELECT})
    .then((queryResult) => {
        if(queryResult.length === 0){
            console.log("Database channel without data");
            connectionData.sequelize.query(tablesInitial.channel.setValues);
            console.log("Records have been created for the first time (as minimal data) for channel database");
        }else{
            console.log("The database channel already has minimal data");
        };
    });
},3800);

/* contact channel table */
setTimeout(() => {
    connectionData.sequelize.query(`SELECT * FROM contactChannel`, {type: connectionData.sequelize.QueryTypes.SELECT})
    .then((queryResult) => {
        if(queryResult.length === 0){
            console.log("Database contact Channel without data");
            connectionData.sequelize.query(tablesInitial.contactChannel.setValues);
            console.log("Records have been created for the first time (as minimal data) for contact Channel database");
        }else{
            console.log("The database contact Channel already has minimal data");
        };
    });
},4000);

/* Endpoints to use for the APP ------------------------------------------------------------------------------------------------------------------- */

/* Endpoints for the app user */
serverData.server.post("/user/login", userDataWarehouse.login); /* Login a user */
serverData.server.post("/user/register", middlewares.middlewareRolAdmin, userDataWarehouse.register); /* Create a new app user (Create of CRUD) */
serverData.server.get("/users", middlewares.middlewareRolAdmin, userDataWarehouse.allUsers); /* Get all users information (Read of CRUD) */
serverData.server.put("/user/:idUser", middlewares.middlewareRolAdmin, userDataWarehouse.updateUserData); /* Update the information of a specific user (Update of CRUD) */
serverData.server.delete("/user/:idUser", middlewares.middlewareRolAdmin, userDataWarehouse.deleteUser); /* Hard delete a specific user (Delete of CRUD) */

/* Endpoints for the regions-countires-cities */
serverData.server.post("/place/:place", regionDataWarehouse.newPlace); /* Create a new place (Create of CRUD) */
serverData.server.get("/places/:place", regionDataWarehouse.places); /* Get all places information of a specific place (Read of CRUD) */
serverData.server.put("/place/:place/:idPlace", regionDataWarehouse.updatePlace) /* Update the information of a specific place (Update of CRUD) */
serverData.server.delete("/place/:place/:idPlace", regionDataWarehouse.deletePlace); /* Hard delete a specific place if it's possible (Delete of CRUD) */

/* Endpoints for the companies */
serverData.server.post("/company/register",companyDataWarehouse.newCompany); /* Create a new company (Create of CRUD) */
serverData.server.get("/companies",companyDataWarehouse.companies); /* Get all companies information (Read of CRUD) */
serverData.server.put("/company/:idCompany",companyDataWarehouse.updateCompany); /* Update the information of a specific company (Update of CRUD) */
serverData.server.delete("/company/:idCompany",companyDataWarehouse.deleteCompany); /* Hard delete a specific company (Delete of CRUD) */

/* Endpoints for contacts */
serverData.server.post("/contact/register",contactDataWarehouse.newContact); /* Create a new contact (Create of CRUD) */
serverData.server.get("/contacts",contactDataWarehouse.contacts); /* Get all contacts information (Read of CRUD) */
serverData.server.get("/channels/:idContact",contactDataWarehouse.contactsChannels); /* Get all channels from a specific contact (Read of CRUD) */
serverData.server.put("/contact/:idContact",contactDataWarehouse.updateContact);/* Update the information of a specific contact (Update of CRUD) */
serverData.server.delete("/contact/:idContact",contactDataWarehouse.deleteContact)/* Hard delete a specific contact with all his channels (Delete of CRUD) */