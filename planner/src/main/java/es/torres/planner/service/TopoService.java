package es.torres.planner.service;

import es.torres.planner.model.CityDTO;
import es.torres.planner.model.PlanningDTO;
import es.torres.planner.model.Progress;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.concurrent.CompletableFuture;

@Service
public class TopoService {

  private static final Logger logger = LoggerFactory.getLogger(TopoService.class);
  public static final String BINDING_NAME = "producer-out-0";

  private final RestTemplate restTemplate;

  @Autowired
  private StreamBridge streamBridge;

  public TopoService(RestTemplateBuilder restTemplateBuilder) {
    this.restTemplate = restTemplateBuilder.build();
  }

  @Async
  public CompletableFuture<CityDTO> findLandscape(String city, PlanningDTO planningDTO, Progress progress) throws InterruptedException {
    logger.info("Looking up " + city);
    String url = String.format("http://localhost:8080/api/topographicdetails/%s", city);
    CityDTO results = restTemplate.getForObject(url, CityDTO.class);

    planningDTO.setPlanning(planningDTO.getPlanning()+ "-" + results.getLandscape());

    progress.increase();
    streamBridge.send(BINDING_NAME, progress);

    return CompletableFuture.completedFuture(results);
  }

}
