import { setTimeout } from 'timers/promises';
import { requestWeather } from '../clients/weather/weatherClient.js';
import { requestLandscape } from '../clients/topo/topoClient.js';

export async function createEoloPlant(city) {

    console.log('Create EoloPlant in city: ' + city);

    const eoloplant = { city, planning: city };

    await Promise.all([
        getWeather(eoloplant),
        getLandscape(eoloplant)
    ]);

    await simulateProcessWaiting();

    processPlanning(eoloplant);

    return eoloplant;
}

async function getWeather(eoloplant) {

    const weather = await requestWeather(eoloplant.city);

    console.log('Weather: ' + weather);

    addPlanning(eoloplant, weather);
}

async function getLandscape(eoloplant) {

    const landscape = await requestLandscape(eoloplant.city);

    console.log('Landscape: ' + landscape);

    addPlanning(eoloplant, landscape);
}

function addPlanning(eoloplant, planning) {
    eoloplant.planning += '-' + planning;
}

function processPlanning(eoloplant) {
    eoloplant.planning = eoloplant.planning.match("^[A-Ma-m].*") ?
        eoloplant.planning.toLowerCase() :
        eoloplant.planning.toUpperCase();

    console.log('Processed planning: ' + eoloplant.planning);
}

async function simulateProcessWaiting() {
    await setTimeout(Math.random() * 2000 + 1000);
}
