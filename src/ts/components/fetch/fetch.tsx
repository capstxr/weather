import axios from 'axios';

function Fetch(query: string) {
    const apiUrl = `http://api.weatherapi.com/v1/forecast.json?key=<your_key>&q=${query}&days=7`;

    const headers = {
        'Content-Type': 'application/json',
    };

    return axios
        .post(apiUrl, null, { headers })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.error(error);
            throw error;
        });
}

export default Fetch;
