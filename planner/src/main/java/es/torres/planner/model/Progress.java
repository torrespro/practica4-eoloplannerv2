package es.torres.planner.model;

public class Progress {
	
	private Long id;
	private String city;
	private Integer progress = 0;
	private String planning;
	private Boolean completed;
	
	public Progress() {
	}

	public Progress(Long id, String city, Integer progress, String planning, Boolean completed) {
		this.id = id;
		this.city = city;
		this.progress = progress;
		this.planning = planning;
		this.completed = completed;
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

	public Integer getProgress() {
		return progress;
	}

	public void setProgress(Integer progress) {
		this.progress = progress;
	}

	public String getPlanning() {
		return planning;
	}

	public void setPlanning(String planning) {
		this.planning = planning;
	}

	public Boolean getCompleted() {
		return completed;
	}

	public void setCompleted(Boolean completed) {
		this.completed = completed;
	}

	public void increase () {
		this.progress += 25;
	}

	@Override
	public String toString() {
		return "Progress{" +
			"id=" + id +
			", city='" + city + '\'' +
			", progress=" + progress +
			", planning='" + planning + '\'' +
			", completed=" + completed +
			'}';
	}
}
