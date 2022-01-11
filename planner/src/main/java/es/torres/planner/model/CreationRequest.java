package es.torres.planner.model;

public class CreationRequest {

    private Long id;
    private String city;

    public CreationRequest() {
    }

    public CreationRequest(Long id, String city) {
        this.id = id;
        this.city = city;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    @Override
    public String toString() {
        return "CreationRequest{" +
            "id=" + id +
            ", city='" + city + '\'' +
            '}';
    }
}
