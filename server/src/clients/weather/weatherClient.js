import { credentials } from '@grpc/grpc-js';
import { WeatherService } from './proto.js';
import { promisify } from 'util';

export async function requestWeather(city) {

    var weatherService = new WeatherService('localhost:9090', credentials.createInsecure());

    weatherService.GetWeather = promisify(weatherService.GetWeather.bind(weatherService));

    const { weather } = await weatherService.GetWeather({ city });

    return weather;

}