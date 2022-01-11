import { Server, ServerCredentials } from '@grpc/grpc-js';
import { WeatherService } from './proto.js';
import { GetWeather } from './weatherService.js';

const server = new Server();

server.addService(WeatherService.service, { GetWeather });

server.bindAsync('0.0.0.0:9090', ServerCredentials.createInsecure(), () => {
    server.start();
    console.log('gRPC server running at http://127.0.0.1:9090');
});