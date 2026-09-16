require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

const app = express();
const port = process.env.PORT || 4000;

connectDB();

app.use(cors());
app.use(express.json());

//HEALTH CHECK

app.get('/', (req, res) => {
    res.json({
        message: 'Job Tracker API is running!',
    })
})

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const jobRoutes = require('./routes/jobs');
app.use('/api/jobs', jobRoutes);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})