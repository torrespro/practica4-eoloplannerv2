import axios from 'axios';

export async function requestLandscape(city) {

    const response = await axios.get('http://localhost:8080/api/topographicdetails/'+city);

    const { landscape } = response.data;

    return landscape;
}