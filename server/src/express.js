import express from 'express';
import { __dirname } from './dirname.js';
import { graphql } from './graphql.js';
import expressws from 'express-ws';
import { PubSubManager } from './PubSubManager.js'

export const server = express();
export let webSocket = null;
expressws(server);

export let pubSubManager = new PubSubManager();

server.use(express.json());

server.use('/graphql', graphql);

server.use(express.static(__dirname + '/../public'));

server.ws('/notifications', (ws, req) => {

  console.log(`Connection request from: ${req.connection.remoteAddress}`);
  webSocket = ws;
  ws.on('message', (data) => {
    console.log('data: ' + data);
    const json = JSON.parse(data);
    const request = json.request;
    const id = json.id;
    const message = json.message;

    switch (request) {
      case 'PUBLISH':
        pubSubManager.publish(ws, id, message);
        break;
      case 'SUBSCRIBE':
        console.log(`Subscribe from: ` + id);
        pubSubManager.subscribe(ws, id);
        break;
    }
  });

  ws.on('message', (msg) => {
    console.log('Message received:' + msg);
  });

});
