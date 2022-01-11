import { connect } from 'amqplib';

const RABBITMQ_URL = 'admin:admin@localhost';
export let channel = null;
process.on('exit', (code) => {
  channel.close();
  console.log(`Closing rabbitmq channel`);
});
const rabbitClient = await connect('amqp://admin:admin@localhost');
channel = await rabbitClient.createChannel();
channel.assertQueue("eoloplantCreationProgressNotifications");
channel.assertQueue("eoloplantCreationRequests");
