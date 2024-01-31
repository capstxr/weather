const express = require('express');
require('dotenv').config();
const axios = require('axios');
const app = express();
const PORT = process.env.PORT;
const cors = require('cors');

app.use(express.json());
app.use(cors());

app.post('/api/fetch', (req, res) => {
    const { query } = req.body;

    const apiUrl = `http://api.weatherapi.com/v1/forecast.json?key=${process.env.API_KEY}&q=${query}&days=7`;

    axios.get(apiUrl)
        .then((response) => {
            res.json(response.data);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch weather data' });
        });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});