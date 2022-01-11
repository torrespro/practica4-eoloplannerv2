package es.codeurjc.mastercloudapps.topo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

//Search with aprox words
@Document(collation = "{'locale':'es', 'strength':1}")
public class City {

    @Id
    private String id;
    private String landscape;

    protected City() {
        // Used by SpringData
    }

    public City(String landscape) {
        this(null, landscape);
    }

    public City(String id, String landscape) {
        this.id = id;

        this.landscape = landscape;
    }

    public String getId() {
        return id;
    }

    public String getLandscape() {
        return landscape;
    }

    public void setLandscape(String landscape) {
        this.landscape = landscape;
    }

    @Override
    public String toString() {
        return "City{" +
                "id='" + id + '\'' +
                ", landscape='" + landscape + '\'' +
                '}';
    }
}