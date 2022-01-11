package es.torres.planner.model;

public class PlanningDTO {

    private String id;
    private String planning;

    public PlanningDTO() {
    }

    public PlanningDTO(String id, String landscape) {
        this.id = id;
        this.planning = landscape;
    }


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPlanning() {
        return planning;
    }

    public void setPlanning(String planning) {
        this.planning = planning;
    }
}
