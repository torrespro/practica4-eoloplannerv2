package es.torres.planner;

import es.torres.planner.model.CreationRequest;
import es.torres.planner.service.EoloPlantService;
import java.util.function.Consumer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MessageManipulator {

    private final EoloPlantService eoloPlantService;

    public MessageManipulator(EoloPlantService eoloPlantService) {
        this.eoloPlantService = eoloPlantService;
    }

//    @Bean
//    Function<String, String> uppercase() {
//        return msg -> {
//            String upper = msg.toUpperCase();
//            System.out.println("Transforming message " + msg + " to " + upper);
//            return upper;
//        };
//    }

    @Bean
    public Consumer<CreationRequest> consumer() {
        return creationRequest -> {
            System.out.println("creationRequest: " + creationRequest);
            eoloPlantService.createEoloPlant(creationRequest);
        };
    }

}
