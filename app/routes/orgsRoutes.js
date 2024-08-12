const express = require('express');
const { isOrgValid, createOrganisation } = require('../db/orgDbOperations');

const router = express.Router();

router.post('/', async (req, res) => {

    const orgBody = req.body;

    const name = orgBody.name;
    const account = orgBody.account;
    const website = orgBody.website;
    const fuelReimbursementPolicy = orgBody.fuelReimbursementPolicy;
    const speedLimitPolicy = orgBody.speedLimitPolicy;

    if (name == null || name == undefined) {
        return res.status(400).json({ message: "name is a required parameter" });
    }

    if (!isOrgValid) {
        return res.status(400).json({ message: "organisation with name already exists" });
    }
    try {
        const created = await createOrganisation(name, account, website, fuelReimbursementPolicy, speedLimitPolicy);
        if (created) {

            return res.status(200).json({ message: "organisation created successfully" });
        }
        else {

            return res.status(500).json({ message: "organisation creation failed" });
        }
    }
    catch (err) {
        return res.status(500).json({ message: "organisation creation failed" });
    }

});

module.exports = router;