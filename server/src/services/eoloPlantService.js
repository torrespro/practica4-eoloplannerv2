import { EoloPlant } from '../models/EoloPlant.js';
import { createEoloPlant } from './eoloPlantCreator.js';
import DebugLib from 'debug';
import { channel } from '../rabbitmq.js';
import { pubSubManager } from '../express.js';
import { Kafka, logLevel } from 'kafkajs';


// await producer.disconnect()


const debug = new DebugLib('server:eoloPlantService');

export async function getAllPlants() {
    
    return EoloPlant.findAll();
}

export async function getEoloPlantById(id) {
    
    return await EoloPlant.findOne({ where: { id } });
}

export async function deleteEoloPlantById(id) {
    
    const plant = await getEoloPlantById(id);
    
    if (plant !== null) {
        plant.destroy();
    }

    return plant;
}

export async function postEoloPlant(eoloPlantCreationRequest) {

    debug('createEoloPlant', eoloPlantCreationRequest);

    const plant = await createEoloPlant(eoloPlantCreationRequest.city);

    console.log('Create EoloPlant in city: ' + JSON.stringify(plant));

    return await EoloPlant.create(plant);
}

export async function postEoloPlantAsync(eoloPlantCreationRequest) {

    debug('createEoloPlant', eoloPlantCreationRequest);

    console.log('Create EoloPlant in city: ' + eoloPlantCreationRequest.city);

    const plant = { city: eoloPlantCreationRequest.city, planning: "" };

    var createdPlant = await EoloPlant.create(plant);

    var data = {
        id: createdPlant.id,
        city: eoloPlantCreationRequest.city
    };

    //RabbitMQ
    // channel.sendToQueue("eoloplantCreationRequests", Buffer.from(JSON.stringify(data)));

    //Kafka
    const kafka = new Kafka({
        logLevel: logLevel.DEBUG,
        clientId: 'my-app',
        brokers: ['localhost:9092'],
    })

    const producer = kafka.producer()
    await producer.connect()
    await producer.send({
        topic: 'eoloplantCreationRequests',
        messages: [
            {value : JSON.stringify(data)}
        ],
    }).then(console.log)
    .catch(e => console.error(`[example/producer] ${e.message}`, e))

    channel.consume("eoloplantCreationProgressNotifications", (msg) => {
        const id = JSON.parse(msg.content).id;
        console.log("Consumed from queue: '", msg.content.toString());
        var wsClient = pubSubManager.getWsClient(id.toString())
        if (wsClient != null) {
            wsClient.send(msg.content.toString());
        }
        updateEoloPlant(JSON.parse(msg.content));
    }, { noAck: true });

    console.log('Create EoloPlant in city: ' + JSON.stringify(plant));

    return createdPlant;
}

export async function updateEoloPlant(plant) {

    debug('updateEoloPlant', plant);

    await EoloPlant.update(plant, { where: { id: plant.id } });

}

