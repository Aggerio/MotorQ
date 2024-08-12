const express = require('express');
const { rateLimiter } = require('./app/util/util');
const auth = require('./app/middleware/auth');
const cors = require('cors');

const app = express();
app.use(express.json()); 
app.use(cors()); 

const PORT = process.env.PORT || 3000;

// Apply Auth middleware globally to all routes
app.use(auth);

// Apply rate limiting globally to all routes
app.use(rateLimiter);

// Route imports
const vehicleRoutes = require('./app/routes/vehicleRoutes');
const orgsRoutes = require('./app/routes/orgsRoutes');

// Define routes
app.use('/vehicles', vehicleRoutes);
app.use('/orgs', orgsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
