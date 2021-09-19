const connectionData = require('./connection');

const newCompany = async (req,res) => {
    const {idCity,company,address,email,phone} = req.body;
    const companyToAdd = {
        idCity,
        company,
        address,
        email,
        phone
    };
    if(!idCity || !company || !address || !email || !phone){
        res.status(400);
        res.json("The information is incomplete, please verify that all the information is sent.");
    }else{
        const companyExist = await connectionData.sequelize.query(`SELECT * FROM company WHERE company = :_company`, {replacements:{_company: companyToAdd.company}, type: connectionData.sequelize.QueryTypes.SELECT});
        if(companyExist.length != 0){
            res.status(409);
            res.json(`The company name '${companyToAdd.company}' is not available, please try another company name`);
        }else{
            connectionData.sequelize.query(`INSERT INTO company (idCity,company,address,email,phone) VALUES (:_idCity,:_company,:_address,:_email,:_phone)`,
            {replacements:{
                _idCity: companyToAdd.idCity,
                _company: companyToAdd.company,
                _address: companyToAdd.address,
                _email: companyToAdd.email,
                _phone: companyToAdd.phone
            }, type: connectionData.sequelize.QueryTypes.INSERT})
            .then(() => {
                res.status(201);
                res.json(`The company '${companyToAdd.company}' was created successfully.`);
            });
        };
    };
};

const companies = async (req,res) => {
    const allCompanies = await connectionData.sequelize.query(`
    SELECT cp.idCompany, cp.company, cp.address, cp.email, cp.phone, cp.idCity, ci.city, ci.idCountry, ct.country, ct.idRegion, r.region
    FROM company AS cp
    LEFT JOIN city AS ci
    ON cp.idCity = ci.idCity
    LEFT JOIN country AS ct
    ON ci.idCountry = ct.idCountry
    LEFT JOIN region AS r
    ON ct.idRegion = r.idRegion
    `, {type: connectionData.sequelize.QueryTypes.SELECT});
    res.status(200);
    res.json(allCompanies);
};

const updateCompany = async (req,res) => {
    const idCompany = req.params.idCompany;
    const {idCity,company,address,email,phone} = req.body;
    const companyToAdd = {
        idCity,
        company,
        address,
        email,
        phone
    };
    if(!idCity || !company || !address || !email || !phone){
        res.status(400);
        res.json("The information is incomplete, please verify that all the information is sent.");
    }else{
        const companiesDb = await connectionData.sequelize.query(`SELECT * FROM company WHERE idCompany <> :_idCompany`, {replacements:{_idCompany: idCompany} ,type: connectionData.sequelize.QueryTypes.SELECT});
        const existCompany = companiesDb.filter(element => element.company === companyToAdd.company);
        if(existCompany.length != 0){
            res.status(409);
            res.json(`The update of the company name '${companyToAdd.company}' is not possible because the name already exists in another company. Please change the company name.`);
        }else{
            connectionData.sequelize.query(`UPDATE company SET idCity = :_idCity,company = :_company,address = :_address,email = :_email,phone = :_phone WHERE idCompany = :_idCompany`,
            {replacements:{
                _idCompany: idCompany,
                _idCity: companyToAdd.idCity,
                _company: companyToAdd.company,
                _address: companyToAdd.address,
                _email: companyToAdd.email,
                _phone: companyToAdd.phone
            }, type: connectionData.sequelize.QueryTypes.UPDATE})
            .then(() =>{
                res.status(200);
                res.json("Update done.");
            });
        };
    };
};

const deleteCompany = async (req,res) => {
    const idCompany = req.params.idCompany;
    try {
        await connectionData.sequelize.query(`DELETE FROM company WHERE idCompany = :_idCompany`, {replacements:{_idCompany: idCompany}, type: connectionData.sequelize.QueryTypes.DELETE});
        res.status(200);
        res.json(`The company was deleted successfully.`);
    } catch (error) {
        res.status(409);
        res.json(`Error code '${error.parent.errno}': ${error.parent.sqlMessage}`);
    };
};

module.exports = {newCompany,companies,updateCompany,deleteCompany};