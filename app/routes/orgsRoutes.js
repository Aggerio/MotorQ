const express = require('express');
const {
    isOrgValid,
    createOrganisation,
    updateOrganisationblindly,
    updateFuelReimbursementPolicy,
    checkParentExists,
    updateSpeedLimitPolicy,
    getOrganizationsPaged
} = require('../db/orgDbOperations');
const {findNonStringFields} = require('../util/util');
const { or } = require('sequelize');

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

router.patch('/', async (req, res) => {
    const data_body = req.body;
    const nonStringFields = findNonStringFields(data_body);

    if (nonStringFields.length !== 0) {
        return res.status(400).json({
            message: "Invalid data types detected",
            errors: `The following fields should be strings: ${nonStringFields.join(', ')}`
        });
    }

    const org_name = data_body.name;
    if (!org_name) {
        return res.status(400).json({ message: "Organization name is required" });
    }

    if (!isOrgValid(org_name)) {
        return res.status(404).json({ message: "Organization not found" });
    }

    try {
        if (data_body.account) {
            await updateOrganisationblindly(org_name, "account", data_body.account);
        }
        if (data_body.website) {
            await updateOrganisationblindly(org_name, "website", data_body.website);
        }

        if (data_body.fuelReimbursementPolicy) {
            if (await checkParentExists(org_name)) {
                return res.status(403).json({
                    message: "Cannot modify fuel reimbursement policy: organization has a parent organization"
                });
            }
            await updateFuelReimbursementPolicy(org_name, data_body.fuelReimbursementPolicy);
        }

        if (data_body.speedLimitPolicy) {
            await updateSpeedLimitPolicy(org_name, data_body.speedLimitPolicy);
        }

        return res.status(200).json({ message: "Organization updated successfully" });
    } catch (error) {
        console.error("Error updating organization:", error);
        return res.status(500).json({ message: "Internal server error occurred while updating the organization" });
    }
});

router.get('/', async (req, res) => {
    try {
        // Pagination parameters
        const page = parseInt(req.query.page) || 1; // Default page is 1
        const limit = parseInt(req.query.limit) || 10; // Default limit is 10
        const offset = (page - 1) * limit;

        const processedOrgs = await getOrganizationsPaged(limit, offset);
        // Response
        res.status(200).json({
            page: page,
            limit: limit,
            data: processedOrgs
        });
    } catch (err) {
        console.error('Error retrieving organizations:', err);
        res.status(400).json({ error: 'Unable to retrieve organizations' });
    }
});


module.exports = router;