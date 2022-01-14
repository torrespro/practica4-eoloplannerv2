import { Kafka, logLevel } from 'kafkajs';

export const kafka = new Kafka({
  logLevel: logLevel.ERROR,
  clientId: 'my-app',
  brokers: ['localhost:9092'],
});
