const connectionData = require('./connection');

const newContact = async (req,res) => {
    const {idCompany,idCity,name,lastName,email,address,position,interest,dataTelephone,preferenceTelephone,dataWhatsapp,preferenceWhatsapp,dataFacebook,preferenceFacebook,dataInstagram,preferenceInstagram,dataLinkedin,preferenceLinkedin} = req.body;
    const contactToAdd = {
        idCompany,
        idCity,
        name,
        lastName,
        email,
        address,
        position,
        interest,
        dataTelephone,
        preferenceTelephone,
        dataWhatsapp,
        preferenceWhatsapp,
        dataFacebook,
        preferenceFacebook,
        dataInstagram,
        preferenceInstagram,
        dataLinkedin,
        preferenceLinkedin
    };
    connectionData.sequelize.query(`
    INSERT INTO contact (idCompany,idCity,name,lastName,email,address,position,interest) 
    VALUES (:_idCompany,:_idCity,:_name,:_lastName,:_email,:_address,:_position,:_interest)`,{replacements:{
        _idCompany: contactToAdd.idCompany,
        _idCity: contactToAdd.idCity,
        _name: contactToAdd.name,
        _lastName: contactToAdd.lastName,
        _email: contactToAdd.email,
        _address: contactToAdd.address,
        _position: contactToAdd.position,
        _interest: contactToAdd.interest
    }, type: connectionData.sequelize.QueryTypes.INSERT})
    .then(async () => {
        const idContact = await connectionData.sequelize.query(`SELECT @@IDENTITY AS idContact`, {type: connectionData.sequelize.QueryTypes.SELECT});
        connectionData.sequelize.query(`
        INSERT INTO contactChannel (idContact,idChannel,data,preference)
        VALUES (:_idContact,1,:_dataTelephone,:_preferenceTelephone),
        (:_idContact,2,:_dataWhatsapp,:_preferenceWhatsapp),
        (:_idContact,3,:_dataFacebook,:_preferenceFacebook),
        (:_idContact,4,:_dataInstagram,:_preferenceInstagram),
        (:_idContact,5,:_dataLinkedin,:_preferenceLinkedin)`,{replacements:{
            _idContact: idContact[0].idContact,
            _dataTelephone: contactToAdd.dataTelephone,
            _preferenceTelephone: contactToAdd.preferenceTelephone,
            _dataWhatsapp: contactToAdd.dataWhatsapp,
            _preferenceWhatsapp: contactToAdd.preferenceWhatsapp,
            _dataFacebook: contactToAdd.dataFacebook,
            _preferenceFacebook: contactToAdd.preferenceFacebook,
            _dataInstagram: contactToAdd.dataInstagram,
            _preferenceInstagram: contactToAdd.preferenceInstagram,
            _dataLinkedin: contactToAdd.dataLinkedin,
            _preferenceLinkedin: contactToAdd.preferenceLinkedin
        }, type: connectionData.sequelize.QueryTypes.INSERT})
        .then(() => {
            res.status(201);
            res.json(`The contact was created successfully.`);
        });
    })
};

const contacts = async (req,res) => {
    const allContacts =  await connectionData.sequelize.query(`
    SELECT con.idContact, con.idCompany, com.company, con.idCity, ci.city, ci.idCountry, ct.country, ct.idRegion, r.region, con.name, con.lastName, con.email, con.address, con.position, con.interest
    FROM contact AS con
    LEFT JOIN company AS com 
    ON con.idCompany = com.idCompany
    LEFT JOIN city AS ci
    ON con.idCity = ci.idCity
    LEFT JOIN country AS ct
    ON ci.idCountry = ct.idCountry
    LEFT JOIN region AS r
    ON ct.idRegion = r.idRegion
    `, {type: connectionData.sequelize.QueryTypes.SELECT});
    res.status(200);
    res.json(allContacts);
};

const contactsChannels = async (req,res) => {
    const idContact = req.params.idContact;
    const allChannels = await connectionData.sequelize.query(`
    SELECT ctch.idChannel, ch.channel, ctch.data, ctch.preference
    FROM contactchannel AS ctch
    LEFT JOIN channel AS ch
    ON ctch.idChannel = ch.idChannel
    WHERE ctch.idContact = :_idContact
    `, {replacements:{_idContact: idContact}, type: connectionData.sequelize.QueryTypes.SELECT});
    res.status(200);
    res.json(allChannels);
};

const updateContact = async (req,res) => {
    const idContact = req.params.idContact;
    const {idCompany,idCity,name,lastName,email,address,position,interest,dataTelephone,preferenceTelephone,dataWhatsapp,preferenceWhatsapp,dataFacebook,preferenceFacebook,dataInstagram,preferenceInstagram,dataLinkedin,preferenceLinkedin} = req.body;
    const contactToUpdate = {
        idCompany,
        idCity,
        name,
        lastName,
        email,
        address,
        position,
        interest,
        dataTelephone,
        preferenceTelephone,
        dataWhatsapp,
        preferenceWhatsapp,
        dataFacebook,
        preferenceFacebook,
        dataInstagram,
        preferenceInstagram,
        dataLinkedin,
        preferenceLinkedin
    };
    connectionData.sequelize.query(`
    UPDATE contact 
    SET idCompany = :_idCompany, idCity = :_idCity, name = :_name, lastName = :_lastName, email = :_email, address = :_address, position = :_position, interest = :_interest
    WHERE idContact = :_idContact
    `, {replacements: {
        _idContact: idContact,
        _idCompany: contactToUpdate.idCompany,
        _idCity: contactToUpdate.idCity,
        _name: contactToUpdate.name,
        _lastName: contactToUpdate.lastName,
        _email: contactToUpdate.email,
        _address: contactToUpdate.address,
        _position: contactToUpdate.position,
        _interest: contactToUpdate.interest
    }, type: connectionData.sequelize.QueryTypes.UPDATE})
    .then(async () => {
        await connectionData.sequelize.query(`
        UPDATE contactchannel
        SET data = :_dataTelephone, preference = :_preferenceTelephone
        WHERE idChannel = 1 AND idContact = :_idContact
        `, {replacements: {
            _idContact: idContact,
            _dataTelephone: contactToUpdate.dataTelephone,
            _preferenceTelephone: contactToUpdate.preferenceTelephone
        }, type: connectionData.sequelize.QueryTypes.UPDATE});

        await connectionData.sequelize.query(`
        UPDATE contactchannel
        SET data = :_dataWhatsapp, preference = :_preferenceWhatsapp
        WHERE idChannel = 2 AND idContact = :_idContact
        `, {replacements: {
            _idContact: idContact,
            _dataWhatsapp: contactToUpdate.dataWhatsapp,
            _preferenceWhatsapp: contactToUpdate.preferenceWhatsapp
        }, type: connectionData.sequelize.QueryTypes.UPDATE});

        await connectionData.sequelize.query(`
        UPDATE contactchannel
        SET data = :_dataFacebook, preference = :_preferenceFacebook
        WHERE idChannel = 3 AND idContact = :_idContact
        `, {replacements: {
            _idContact: idContact,
            _dataFacebook: contactToUpdate.dataFacebook,
            _preferenceFacebook: contactToUpdate.preferenceFacebook
        }, type: connectionData.sequelize.QueryTypes.UPDATE});

        await connectionData.sequelize.query(`
        UPDATE contactchannel
        SET data = :_dataInstagram, preference = :_preferenceInstagram
        WHERE idChannel = 4 AND idContact = :_idContact
        `, {replacements: {
            _idContact: idContact,
            _dataInstagram: contactToUpdate.dataInstagram,
            _preferenceInstagram: contactToUpdate.preferenceInstagram
        }, type: connectionData.sequelize.QueryTypes.UPDATE});

        await connectionData.sequelize.query(`
        UPDATE contactchannel
        SET data = :_dataLinkedin, preference = :_preferenceLinkedin
        WHERE idChannel = 5 AND idContact = :_idContact
        `, {replacements: {
            _idContact: idContact,
            _dataLinkedin: contactToUpdate.dataLinkedin,
            _preferenceLinkedin: contactToUpdate.preferenceLinkedin
        }, type: connectionData.sequelize.QueryTypes.UPDATE});

        res.status(200);
        res.json("Update done.");
    })
};

const deleteContact = async (req,res) => {
    const idContact = req.params.idContact;
    /* Delete user channels */
    await connectionData.sequelize.query(`DELETE FROM contactchannel WHERE idContact = :_idContact`, {replacements:{_idContact: idContact}, type: connectionData.sequelize.QueryTypes.DELETE});
    /* Delete user data */
    await connectionData.sequelize.query(`DELETE FROM contact WHERE idContact = :_idContact`, {replacements:{_idContact: idContact}, type: connectionData.sequelize.QueryTypes.DELETE});
    res.status(200);
    res.json(`The user with id '${idContact}' was deleted successfully`);
};

module.exports = {newContact,contacts,contactsChannels,updateContact,deleteContact};