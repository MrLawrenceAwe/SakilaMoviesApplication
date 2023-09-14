package com.LawrenceAwe.MoviesApplication.DataTransferObjects;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.Set;

@JsonInclude(JsonInclude.Include.NON_NULL) // Ensures fields that are null won't be included
public class Film {

    private String filmId;

    private String title;

    private String description;

    private String releaseYear;

    private String languageId;

    private String originalLanguageId;

    private Short rentalDuration;

    private BigDecimal rentalRate;

    private Short length;

    private BigDecimal replacementCost;

    private String rating; // Using String to represent the enum values

    private Set<String> specialFeatures;

    private Timestamp lastUpdate;

    // Default constructor for deserialization
    public Film() {}

    public Film(int filmId, String title, String description) {
        this.filmId = String.valueOf(filmId);
        this.title = title;
        this.description = description;
    }

    public Film(int filmId, String title, String description,
                String releaseYear, String languageId, String originalLanguageId,
                Short rentalDuration, BigDecimal rentalRate, Short length,
                BigDecimal replacementCost, String rating, Set<String> specialFeatures,
                Timestamp lastUpdate) {

        this.filmId = String.valueOf(filmId);
        this.title = title;
        this.description = description;
        this.releaseYear = releaseYear;
        this.languageId = languageId;
        this.originalLanguageId = originalLanguageId;
        this.rentalDuration = rentalDuration;
        this.rentalRate = rentalRate;
        this.length = length;
        this.replacementCost = replacementCost;
        this.rating = rating;
        this.specialFeatures = specialFeatures;
        this.lastUpdate = lastUpdate;
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

    public String getReleaseYear() {
        return releaseYear;
    }

    public void setReleaseYear(String releaseYear) {
        this.releaseYear = releaseYear;
    }

    public String getLanguageId() {
        return languageId;
    }

    public void setLanguageId(String languageId) {
        this.languageId = languageId;
    }

    public String getOriginalLanguageId() {
        return originalLanguageId;
    }

    public void setOriginalLanguageId(String originalLanguageId) {
        this.originalLanguageId = originalLanguageId;
    }

    public Short getRentalDuration() {
        return rentalDuration;
    }

    public void setRentalDuration(Short rentalDuration) {
        this.rentalDuration = rentalDuration;
    }

    public BigDecimal getRentalRate() {
        return rentalRate;
    }

    public void setRentalRate(BigDecimal rentalRate) {
        this.rentalRate = rentalRate;
    }

    public Short getLength() {
        return length;
    }

    public void setLength(Short length) {
        this.length = length;
    }

    public BigDecimal getReplacementCost() {
        return replacementCost;
    }

    public void setReplacementCost(BigDecimal replacementCost) {
        this.replacementCost = replacementCost;
    }

    public String getRating() {
        return rating;
    }

    public void setRating(String rating) {
        this.rating = rating == null ? null : rating.trim();
    }

    public Set<String> getSpecialFeatures() {
        return specialFeatures;
    }

    public void setSpecialFeatures(Set<String> specialFeatures) {
        this.specialFeatures = specialFeatures;
    }

    public Timestamp getLastUpdate() {
        return lastUpdate;
    }

    public void setLastUpdate(Timestamp lastUpdate) {
        this.lastUpdate = lastUpdate;
    }
}
