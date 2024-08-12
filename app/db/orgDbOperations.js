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

async function createOrganisation(name, account, website, fuelReimbursementPolicy, speedLimitPolicy) {
    try {
        await pool.query('insert into Org values(?,?,?,?,?,?,?)', [name, account, website, fuelReimbursementPolicy, speedLimitPolicy, null, null]);
        return true;
    }
    catch (err) {
        console.error("Create Organisation failed: ", err);
        return false;
    }

}

async function updateOrganisationblindly(org_name, property_name, property_value) {
    try {
        const query = `UPDATE Org SET ${property_name} = ? WHERE name = ?`;
        await pool.query(query, [property_value, org_name]);
        return true;
    } catch (err) {
        console.error("Error updating the organisation:", err);
        return false;
    }
}

async function checkParentExists(org_name) {
    try {
        const [rows] = await pool.query('SELECT parent_org FROM Org WHERE name = ?', [org_name]);
        // console.log(rows);
        if (rows[0].parent_org == null) {
            // console.log("Triggered");
            return false;
        }
        return false;
    } catch (err) {
        console.error('Database error in checkParentExists: ', err);
        return false;
    }
}


async function updateFuelReimbursementPolicy(org_name, val) {
    // Check if the current value is different from the new value
    try {
        const [rows] = await pool.query('SELECT fuel_reimbursement_policy AS val FROM Org WHERE name = ?', [org_name]);
        if (!rows || rows.length === 0) {
            console.error("Organization not found");
            return false;
        }

        const currentVal = rows[0].val;
        if (currentVal == val) {
            // The value is already the same, no need to update
            return true;
        }
    } catch (err) {
        console.error("Could not compare the value", err);
        return false;
    }

    // Initialize a BFS array to hold organizations to update
    const orgsToUpdate = [org_name];

    while (orgsToUpdate.length > 0) {
        const currentOrg = orgsToUpdate.shift();

        try {
            // Update the current organization
            await pool.query('UPDATE Org SET fuel_reimbursement_policy = ? WHERE name = ?', [val, currentOrg]);

            // Get child organizations
            const [rows] = await pool.query('SELECT child_orgs FROM Org WHERE name = ?', [currentOrg]);
            if (rows && rows.length > 0 && rows[0].child_orgs) {
                const childOrgs = rows[0].child_orgs.split(',');
                orgsToUpdate.push(...childOrgs);
            }
        } catch (err) {
            console.error(`Could not update organization ${currentOrg}`, err);
            return false;
        }
    }

    console.log("All relevant organizations updated successfully");
    return true;
}
async function updateSpeedLimitPolicy(org_name, val) {
    // Check if the current value is different from the new value
    try {
        const [rows] = await pool.query('SELECT speed_limit_policy AS val FROM Org WHERE name = ?', [org_name]);
        if (!rows || rows.length === 0) {
            console.error("Organization not found");
            return false;
        }

        const currentVal = rows[0].val;
        if (currentVal == val) {
            // The value is already the same, no need to update
            return true;
        }

    } catch (err) {
        console.error("Could not compare the value", err);
        return false;
    }

    // Initialize a BFS array to hold organizations to update
    const orgsToUpdate = [];

    //do it for the parent once

    try {
        // Update the current organization
        await pool.query('UPDATE Org SET speed_limit_policy = ? WHERE name = ?', [val, org_name]);

        // Get child organizations
        const [rows] = await pool.query('SELECT child_orgs FROM Org WHERE name = ?', [org_name]);
        if (rows && rows.length > 0 && rows[0].child_orgs) {
            const childOrgs = rows[0].child_orgs.split(',');
            orgsToUpdate.push(...childOrgs);
        }
    } catch (err) {
        console.error(`Could not update organization ${currentOrg}`, err);
        return false;
    }
    
    //do it for all the child nodes now

    while (orgsToUpdate.length > 0) {
        const currentOrg = orgsToUpdate.shift();

        let isSet = false;

        try {
            const [rows] = await pool.query('select speed_limit_policy as val from Org where name=?', [currentOrg]);
            //console.log(rows, currentOrg);
            if (rows[0].val != null) {
                isSet = true;
            }
        }
        catch (err) {
            console.error(`Could not check null ${currentOrg}`, err);
            return false;
        }
        if (!isSet) {
            try {
                // Update the current organization
                await pool.query('UPDATE Org SET speed_limit_policy = ? WHERE name = ?', [val, currentOrg]);

                // Get child organizations
                const [rows] = await pool.query('SELECT child_orgs FROM Org WHERE name = ?', [currentOrg]);
                if (rows && rows.length > 0 && rows[0].child_orgs) {
                    const childOrgs = rows[0].child_orgs.split(',');
                    orgsToUpdate.push(...childOrgs);
                }
            } catch (err) {
                console.error(`Could not update organization ${currentOrg}`, err);
                return false;
            }
        }


    }

    // console.log("All relevant organizations updated successfully");
    return true;
}

async function getOrganizationsPaged(limit, offset)
{
        // Query to fetch organizations with pagination
        try{
        const [orgs] = await pool.query(
            `SELECT name, account, website, fuel_reimbursement_policy, speed_limit_policy, parent_org, child_orgs 
             FROM Org
             LIMIT ? OFFSET ?`,
            [limit, offset]
        );
 
       return orgs;
        }
        catch(err)
        {
            console.error("Unable to get all organization data");
            return [];
        }
}
module.exports = {
    isOrgValid,
    createOrganisation,
    updateOrganisationblindly,
    updateFuelReimbursementPolicy,
    checkParentExists,
    updateSpeedLimitPolicy,
    getOrganizationsPaged
}