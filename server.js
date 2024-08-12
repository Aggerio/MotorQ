const express = require('express');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

// Rate limiter to allow max 5 requests per minute
const nhtsaLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many requests to NHTSA, please try again later.',
});

const vehicleRoutes = require('./app/routes/vehicleRoutes');
const orgsRoutes = require('./app/routes/orgsRoutes');

app.use('/vehicles', vehicleRoutes);
app.use('/orgs', orgsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

