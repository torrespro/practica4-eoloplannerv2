package es.torres.planner.service;

import es.codeurjc.mastercloudapps.planner.grpc.GetWeatherRequest;
import es.codeurjc.mastercloudapps.planner.grpc.Weather;
import es.codeurjc.mastercloudapps.planner.grpc.WeatherServiceGrpc;
import es.torres.planner.model.PlanningDTO;
import es.torres.planner.model.Progress;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import java.util.concurrent.CompletableFuture;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class WeatherService {

    private static final Logger logger = LoggerFactory.getLogger(WeatherService.class);
    public static final String BINDING_NAME = "producer-out-0";

    private final StreamBridge streamBridge;

    public WeatherService(StreamBridge streamBridge) {
        this.streamBridge = streamBridge;
    }

//    private final ManagedChannel channel;

//    public WeatherService() {
//        this.channel = ManagedChannelBuilder.forAddress("localhost", 9090)
//            .usePlaintext()
//            .build();
//    }

    @Async
    public CompletableFuture<Weather> findWeather(String city, PlanningDTO planningDTO,
        Progress progress) throws InterruptedException {
        logger.info("Looking up " + city);

        ManagedChannel channel = ManagedChannelBuilder.forAddress("localhost", 9090)
            .usePlaintext()
            .build();

        WeatherServiceGrpc.WeatherServiceBlockingStub client =
            WeatherServiceGrpc.newBlockingStub(channel);

        GetWeatherRequest request = GetWeatherRequest.newBuilder()
            .setCity(city)
            .build();

        Weather response = client.getWeather(request);
        System.out.println("Response received from server:\n" + response);
        channel.shutdown();

        planningDTO.setPlanning(planningDTO.getPlanning()+ "-" + response.getWeather());
        progress.increase();
        streamBridge.send(BINDING_NAME, progress);

        return CompletableFuture.completedFuture(response);
    }

}
