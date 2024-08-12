const pool = require('../db/db');

async function insertNewVehicle(vin, org, details) {
    try {
        await pool.query('insert into Vehicle values(?,?,?,?,?)', [vin, org, details.manufacturer, details.model, details.year]);
        return true;
    }
    catch (err) {
        console.error('Database insertion error: ', err);
    }
    return false;
}

async function isVinPresent(vin) {
    try {
        const [rows] = await pool.query('SELECT * FROM Vehicle WHERE vin= ?', [vin]);
        if (rows.length === 0) {
            return false;
        }
        return true;
    } catch (err) {
        console.error('Database error in isOrgValid: ', err);
        return false;
    }
}

async function getVehicleDetails(vin){
    try{
        const [row] = await pool.query('SELECT * from Vehicle where vin= ?', [vin]);
        return row
    }
    catch(err)
    {
        return null;
    }
}

module.exports = {
    insertNewVehicle,
    isVinPresent,
    getVehicleDetails
}