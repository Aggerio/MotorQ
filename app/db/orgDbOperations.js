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
module.exports = {
    isOrgValid
}