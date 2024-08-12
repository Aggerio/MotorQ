const rateLimit = require('express-rate-limit');
const axios = require('axios');

const rateLimiter= rateLimit({
    windowMs: 60 * 1000, // 1 minute window
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many requests, please try again later.',
});

function isValidVin(vin) {
    const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
    return vinRegex.test(vin);
}



async function vinDetails(vin) {
    // Call NHTSA API to decode the VIN
    const response = await axios.get(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`);

    // Extract manufacturer, model, year from the response
    const { Results } = response.data;
    const manufacturer = Results.find(item => item.Variable === 'Manufacturer Name')?.Value || 'N/A';
    const model = Results.find(item => item.Variable === 'Model')?.Value || 'N/A';
    const year = Results.find(item => item.Variable === 'Model Year')?.Value || 'N/A';

    const vehicleDetails = {
        manufacturer,
        model,
        year,
    };
    return vehicleDetails;

}
function findNonStringFields(data_body) {
    const nonStringFields = [];

    for (const [key, value] of Object.entries(data_body)) {
        if (typeof value !== 'string') {
            nonStringFields.push({ field: key, value: value, type: typeof value });
        }
    }

    return nonStringFields;
}


module.exports = {
    rateLimiter,
    isValidVin,
    vinDetails,
    findNonStringFields
}

