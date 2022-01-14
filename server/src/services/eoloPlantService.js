import {EoloPlant} from '../models/EoloPlant.js';
import {createEoloPlant} from './eoloPlantCreator.js';
import DebugLib from 'debug';
import {channel} from '../rabbitmq.js';
import {pubSubManager} from '../express.js';
import { kafka } from '../kafka.js';
const requestQueue = 'eoloplantCreationRequests'
const progressQueue = 'eoloplantCreationProgressNotifications'
console.log(process.env);
const MQ = process.env.SPRING_PROFILES_ACTIVE || 'rabbit';

const debug = new DebugLib('server:eoloPlantService');

export async function getAllPlants() {

  return EoloPlant.findAll();
}

export async function getEoloPlantById(id) {

  return await EoloPlant.findOne({where: {id}});
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

  const plant = {city: eoloPlantCreationRequest.city, planning: ""};

  var createdPlant = await EoloPlant.create(plant);

  var data = {
    id: createdPlant.id,
    city: eoloPlantCreationRequest.city
  };

  function emitRabbit() {
    channel.sendToQueue(requestQueue,
        Buffer.from(JSON.stringify(data)));
  }

  async function emitKafka() {

    const producer = kafka.producer()
    await producer.connect()
    await producer.send({
      topic: requestQueue,
      messages: [
        {value: JSON.stringify(data)}
      ],
    }).then(console.log)
    .catch(e => console.error(`[example/producer] ${e.message}`, e))
  }

  function readRabbit() {
    channel.consume(progressQueue, (msg) => {
      const id = JSON.parse(msg.content).id;
      console.log("Consumed from Rabbitmq queue: '", msg.content.toString());
      var wsClient = pubSubManager.getWsClient(id.toString())
      if (wsClient != null) {
        wsClient.send(msg.content.toString());
      }
      updateEoloPlant(JSON.parse(msg.content));
    }, {noAck: true});
  }

  function readKafka() {
    const consumer = kafka.consumer({ groupId: 'test-group' });

    const run = async () => {
      await consumer.connect()
      await consumer.subscribe({ topic: progressQueue, fromBeginning: true })
      await consumer.run({
        // eachBatch: async ({ batch }) => {
        //   console.log(batch)
        // },
        eachMessage: async ({ topic, partition, message }) => {
          // const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
          // console.log(`- ${prefix} ${message.key}#${message.value}`)
          const id = JSON.parse(message.value).id;
          console.log("Consumed from Kafka topic: '", message.value.toString());
          var wsClient = pubSubManager.getWsClient(id.toString())
          if (wsClient != null) {
            wsClient.send(message.value.toString());
          }
          updateEoloPlant(JSON.parse(message.value));
        },
      })
    }

    run().catch(e => console.error(`[example/consumer] ${e.message}`, e))
  }

  console.log("MQ: " + MQ);

  if (MQ == 'rabbit') {
    //RabbitMQ
    emitRabbit(requestQueue);
    readRabbit(progressQueue);
  } else {
    //Kafka
    await emitKafka(requestQueue);
    readKafka(progressQueue);
  }

  console.log('Create EoloPlant in city: ' + JSON.stringify(plant));

  return createdPlant;
}

export async function updateEoloPlant(plant) {

  debug('updateEoloPlant', plant);

  await EoloPlant.update(plant, {where: {id: plant.id}});

}

