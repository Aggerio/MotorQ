const express = require('express');
const NodeCache = require('node-cache');
const { isValidVin, nhtsaLimiter, vinDetails } = require('../util/util');
const { insertNewVehicle, isVinPresent, getVehicleDetails } = require('../db/vehicleDbOperations');
const { isOrgValid } = require('../db/orgDbOperations');


const router = express.Router();
const vehicleCache = new NodeCache({ stdTTL: 600 }); // Cache for 10 minutes

// GET /vehicles/decode/:vin
router.get('/decode/:vin', nhtsaLimiter, async (req, res) => {
    const { vin } = req.params;

    if (isValidVin(vin)) {
        try {

            console.log("Received request to decode VIN:", vin);
            // Check if the VIN is already in cache
            const cachedData = vehicleCache.get(vin);
            if (cachedData) {
                console.log("Returning cached data for VIN:", vin);
                return res.json(cachedData);
            }

            const vehicleDetails = await vinDetails(vin);
            res.json(vehicleDetails);
            vehicleCache.set(vin, vehicleDetails);

        } catch (err) {
            console.error('Error decoding VIN:', err);
            res.status(500).json({ message: 'Error decoding VIN or reaching NHTSA API' });
        }

    }
    else {
        console.error("Invalid Vin Format");
        res.status(400).json({ message: "Invalid Vin Format" });
    }
});

router.post('/', async (req, res) => {
    const { vin, org } = req.body;

    // Validate the VIN
    if (!isValidVin(vin)) {
        return res.status(400).json({ message: "Invalid VIN format" });
    }

    // Validate the org
    const orgExists = await isOrgValid(org);
    if (!orgExists) {
        return res.status(400).json({ message: "Invalid org ID" });
    }

    const details = await vinDetails(vin);

    const inserted = await insertNewVehicle(vin, org, details);

    if (inserted) {
        return res.status(201).json({ message: "Data inserted successfully" });
    }
    else {
        return res.status(500).json({ message: 'Database insertion failed' });
    }

});

router.post('/:vin', nhtsaLimiter, async (req, res) => {
    const { vin } = req.params;

    if (isValidVin(vin)) {
        if (isVinPresent(vin)) {
            try {
                console.log("Received request to decode VIN:", vin);
                const info = await getVehicleDetails(vin); 
                return res.status(201).json(info);
            } catch (err) {
                console.error('Error decoding VIN:', err);
                return res.status(500).json({ message: 'Error decoding VIN or reaching NHTSA API' });
            }
        }
        else {

            console.error("Vin does not exist in Db");
            return res.status(400).json({ message: "Vin does not exist in db" });
        }

    }
    else {
        console.error("Invalid Vin Format");
        return res.status(400).json({ message: "Invalid Vin Format" });
    }
});

module.exports = router;
