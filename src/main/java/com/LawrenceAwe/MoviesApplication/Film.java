package com.LawrenceAwe.MoviesApplication;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL) // Ensures fields that are null won't be included
public class Film {

    private String filmId;

    private String title;

    private String description;

    private Integer releaseYear;

    private String language;
    private String languageId;

    private String length;

    private String rating;

    private String category;

    // Default constructor for deserialization
    public Film() {}

    public Film(int filmId, String title, String description, Integer releaseYear, String languageId, String length, String rating) {
        this.filmId = String.valueOf(filmId);
        this.title = title;
        this.description = description;
        this.releaseYear = releaseYear;
        this.languageId = languageId;
        this.length = length;
        this.rating = rating;
    }

    public String getFilmId() {
        return filmId;
    }

    public void setFilmId(Integer filmId) {
        this.filmId = String.valueOf(filmId);
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title == null ? null : title.trim();
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description == null ? null : description.trim();
    }

    public Integer getReleaseYear() {
        return releaseYear;
    }

    public void setReleaseYear(Integer releaseYear) {
        this.releaseYear = releaseYear;
    }

    public String getLanguageId() {
        return languageId;
    }

    public void setLanguageId(String languageId) {
        this.languageId = languageId;
    }

    public String getLength() {
        return length;
    }

    public void setLength(String length) {
        this.length = length == null ? null : length.trim();
    }

    public String getRating() {
        return rating;
    }

    public void setRating(String rating) {
        this.rating = rating == null ? null : rating.trim();
    }

    public String getLanguage() {
    	return language;
    }

    public void setLanguage(String language) {
    	this.language = language;
    }

    public String getCategory() {
    	return category;
    }

    public void setCategory(String category) {
    	this.category = category;
    }
}
