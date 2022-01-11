package es.torres.planner.service;

import es.codeurjc.mastercloudapps.planner.grpc.Weather;
import es.torres.planner.model.CityDTO;
import es.torres.planner.model.CreationRequest;
import es.torres.planner.model.PlanningDTO;
import es.torres.planner.model.Progress;
import java.util.Random;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.regex.Pattern;
import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EoloPlantService {

    public static final String BINDING_NAME = "producer-out-0";
    private final TopoService topoService;
    private final WeatherService weatherService;
    private final StreamBridge streamBridge;
    Random random = new Random();

    String REGEX = "^[A-Ma-m].*";

    public EoloPlantService(TopoService topoService, WeatherService weatherService,
        StreamBridge streamBridge) {
        this.topoService = topoService;
        this.weatherService = weatherService;
        this.streamBridge = streamBridge;
    }

    @Async
    public CompletableFuture<Void> createEoloPlant(CreationRequest creationRequest) {
        Progress progress = new Progress(creationRequest.getId(), creationRequest.getCity(), 0, null, false);
        PlanningDTO planningDTO = new PlanningDTO(UUID.randomUUID().toString(), creationRequest.getCity());
        // Kick of multiple, asynchronous lookups
        CompletableFuture<CityDTO> page1 = null;
        CompletableFuture<Weather> page2 = null;
        try {
            page1 = topoService.findLandscape(creationRequest.getCity(), planningDTO, progress);
            page2 = weatherService.findWeather(creationRequest.getCity(), planningDTO, progress);

            progress.increase();
            streamBridge.send(BINDING_NAME, progress);

            // Wait until they are all done
            CompletableFuture.allOf(page1, page2).join();

            simulateProcessWaiting();
            processPlanning(planningDTO);
            progress.increase();
            progress.setPlanning(planningDTO.getPlanning());
            progress.setCompleted(true);
            streamBridge.send(BINDING_NAME, progress);

            System.out.println("Landscape: " + page1.get().getLandscape());
            System.out.println("Weather: " + page2.get().getWeather());
            System.out.println("Processed Planning: " + planningDTO.getPlanning());
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }

        return CompletableFuture.completedFuture(null);
    }

    private void simulateProcessWaiting() throws InterruptedException {
        TimeUnit.SECONDS.sleep(random.nextLong(4));
    }

    void processPlanning(PlanningDTO eoloplant) {
        String planning = Pattern.matches(REGEX, eoloplant.getPlanning()) ?
            eoloplant.getPlanning().toLowerCase() :
            eoloplant.getPlanning().toUpperCase();
        eoloplant.setPlanning(planning);
    }

}
