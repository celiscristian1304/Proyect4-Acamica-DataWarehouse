const connectionData = require('./connection');

const newPlace = async (req,res) => {
    const place = req.params.place;
    const newPlace = req.query.newPlace;
    const idPlace = req.query.idPlace;
    if(!newPlace || !place){
        res.status(400);
        res.json("The information is incomplete, please verify that all the information is sent.");
    }else{
        const placeExist = await connectionData.sequelize.query(`SELECT * FROM ${place} WHERE ${place} = :_place`, {replacements:{_place: newPlace}, type: connectionData.sequelize.QueryTypes.SELECT});
        if(placeExist.length != 0){
            res.status(409);
            res.json(`The ${place} '${newPlace}' already exist. Please enter a new ${place}.`);
        }else{
            let queryInsertPlace = "";
            let capitalPlace = "";
            (place === "country")? capitalPlace = "Region": ((place === "city")? capitalPlace = "Country": capitalPlace = "");
            (place === "country" || place === "city")? queryInsertPlace = `INSERT INTO ${place} (${place},id${capitalPlace}) VALUES (:_place,:_idPlace)`: queryInsertPlace = `INSERT INTO ${place} (${place}) VALUES (:_place)`;
            connectionData.sequelize.query(queryInsertPlace, {replacements:{_place: newPlace,_idPlace: idPlace}, type: connectionData.sequelize.QueryTypes.INSERT});
            res.status(201);
            res.json(`${place} '${newPlace}' was created successfully.`);
        };
    };
};

const places = async (req,res) => {
    const place = req.params.place;
    const idPlace = req.query.idPlace;
    if((place === "country" || place === "city") && !idPlace){
        res.status(400);
        res.json("The information is incomplete, please verify that all the information is sent.");
    }else{
        let places = [];
        if(place === "region"){
            places = await connectionData.sequelize.query(`SELECT * FROM region`, {type: connectionData.sequelize.QueryTypes.SELECT});
        }else{
            let querySelectPlace = "";
            (place === "country")? querySelectPlace = "idRegion": ((place === "city")? querySelectPlace = "idCountry": querySelectPlace = ""); 
            places = await connectionData.sequelize.query(`SELECT * FROM ${place} WHERE ${querySelectPlace} = :_idPlace`, {replacements:{_idPlace: idPlace}, type: connectionData.sequelize.QueryTypes.SELECT});
        };
        res.status(200);
        res.json(places);
    };
};

const updatePlace = async (req,res) => {
    const idPlace = req.params.idPlace;
    const place = req.params.place;
    const placeChange = req.query.placeChange;
    if(!idPlace || !placeChange || !place){
        res.status(400);
        res.json("The information is incomplete, please verify that all the information is sent.");
    }else{
        const placeExist = await connectionData.sequelize.query(`SELECT * FROM ${place} WHERE ${place} = :_place`, {replacements:{_place: placeChange}, type: connectionData.sequelize.QueryTypes.SELECT});
        if(placeExist.length != 0){
            res.status(409);
            res.json(`The ${place} '${placeChange}' already exist. Please enter a new ${place}.`);
        }else{
            let capitalPlace = place.charAt(0).toUpperCase() + place.slice(1);
            connectionData.sequelize.query(`UPDATE ${place} SET ${place} = :_place WHERE id${capitalPlace} = :_idPlace`, {replacements: {_place: placeChange, _idPlace: idPlace}, type: connectionData.sequelize.QueryTypes.UPDATE});
            res.status(200);
            res.json("Update done.");
        };
    };
};

const deletePlace = async (req,res) => {
    const place = req.params.place;
    const idPlace = req.params.idPlace;
    if(!idPlace || !place){
        res.status(400);
        res.json("The information is incomplete, please verify that all the information is sent.");
    }else{
        let capitalPlace = place.charAt(0).toUpperCase() + place.slice(1);
        try {
            await connectionData.sequelize.query(`DELETE FROM ${place} WHERE id${capitalPlace} = :_idPlace`, {replacements:{_idPlace: idPlace}, type: connectionData.sequelize.QueryTypes.DELETE});
            res.status(200);
            res.json(`The place ${place} was deleted successfully.`);
        } catch (error) {
            res.status(409);
            res.json(`Error code '${error.parent.errno}': ${error.parent.sqlMessage}`);
        };
    };
};

module.exports = {newPlace,places,updatePlace,deletePlace};