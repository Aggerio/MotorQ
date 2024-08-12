const pool = require('../db/db');


async function isOrgValid(orgId) {
    try {
        const [rows] = await pool.query('SELECT * FROM Org WHERE name = ?', [orgId]);
        if (rows.length === 0) {
            return false;
        }
        return true;
    } catch (err) {
        console.error('Database error in isOrgValid: ', err);
        return false;
    }
}

async function createOrganisation(name, account, website, fuelReimbursementPolicy, speedLimitPolicy)
{
    try{
        await pool.query('insert into Org values(?,?,?,?,?,?,?)', [name, account, website, fuelReimbursementPolicy, speedLimitPolicy, null, null]);
        return true;
    }
    catch(err)
    {
        console.error("Create Organisation failed: ", err);
        return false;
    }

}
module.exports = {
    isOrgValid
}