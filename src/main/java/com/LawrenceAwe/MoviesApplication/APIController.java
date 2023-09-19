package com.LawrenceAwe.MoviesApplication;

import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.StringJoiner;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class APIController {

    private final DatabaseClient databaseClient;

    @Autowired
    public APIController(DatabaseClient databaseClient) {
        this.databaseClient = databaseClient;
    }

    @GetMapping("/films/{title}")
    public ResponseEntity<?> getFilmByTitle(@PathVariable String title) {
        String sql = "SELECT film_id, title, description, release_year, language_id, original_language_id, rating " +
                "FROM film WHERE LOWER(title) = LOWER(?)";
        Film film = databaseClient.queryDatabaseForObject(sql, new Object[]{title}, FilmService::mapRowToFilm);

        if (film != null) {
            setFilmLanguage(film);
            return ResponseEntity.ok(film);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body("{\"message\":\"No results found\"}");
        }

    }

    @GetMapping("/films/category/{categoryName}")
    public ResponseEntity<?> getFilmsByCategory(@PathVariable String categoryName) {
        String sqlStatement = "SELECT f.film_id, title, description, release_year, language_id, original_language_id, rating " +
                "FROM film f " +
                "JOIN film_category fc ON f.film_id = fc.film_id " +
                "JOIN category c ON fc.category_id = c.category_id " +
                "WHERE LOWER(c.name) = LOWER(?)";


        List<Film> films = databaseClient.queryDatabaseForList(sqlStatement, new Object[]{categoryName}, FilmService::mapRowToFilm);
        for (Film film : films) setFilmLanguage(film);

        if (!films.isEmpty()) {
            return ResponseEntity.ok(films);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body("{\"message\":\"No results found\"}");
        }
    }

    private void setFilmLanguage(Film film) {
        String languageSQL = "SELECT name FROM language WHERE language_id = ?";
        film.setLanguage(databaseClient.queryDatabaseForObject(languageSQL, new Object[]{film.getLanguageId()}, (resultSet, rowNum) -> resultSet.getString("name")));
    }

    @PostMapping("/films/add")
    public ResponseEntity<String> addFilmToDatabase(@RequestBody Film film) {
        StringJoiner fields = new StringJoiner(", ");
        StringJoiner valueTokens = new StringJoiner(", ");
        Map<String, Object> fieldMap = new HashMap<>();

        fieldMap.put("title", film.getTitle().toUpperCase());
        fieldMap.put("description", film.getDescription());
        fieldMap.put("release_year", film.getReleaseYear());
        fieldMap.put("language_id", film.getLanguageId()); //TODO - Write a method to get the language id from the language name
        fieldMap.put("original_language_id", film.getOriginalLanguageId());
        fieldMap.put("rental_duration", film.getRentalDuration());
        fieldMap.put("rental_rate", film.getRentalRate());
        fieldMap.put("length", film.getLength());
        fieldMap.put("replacement_cost", film.getReplacementCost());
        fieldMap.put("rating", film.getRating());
        if (film.getSpecialFeatures() != null)
            fieldMap.put("special_features", String.join(",", film.getSpecialFeatures()));

        Map<String, Object> params = new HashMap<>();
        for (Map.Entry<String, Object> entry : fieldMap.entrySet()) {
            if (entry.getValue() != null) {
                fields.add(entry.getKey());
                valueTokens.add(":" + entry.getKey());
                params.put(entry.getKey(), entry.getValue());
            }
        }

        String sqlStatement = String.format("INSERT INTO film (%s) VALUES (%s)", fields, valueTokens);

        try {
            databaseClient.updateDatabase(sqlStatement, params);
            System.out.println("Film created successfully");
            return ResponseEntity.status(HttpStatus.CREATED)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body("{\"message\":\"Film created successfully\"}");
        } catch (DataAccessException e) {
            System.out.println("Failed to create film");
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body("{\"message\":\"Failed to create film\"}");
        }
    }

    @PutMapping("/films/update/{id}")
    public ResponseEntity<String> updateFilmInDatabaseByID(@PathVariable Long id, @RequestBody Map<String, Object> changes) {

        if (changes.isEmpty()) {
            return ResponseEntity.badRequest().contentType(MediaType.APPLICATION_JSON)
                    .body("{\"message\":\"No fields provided for update.\"}");
        }

        StringJoiner setStatements = new StringJoiner(", ");

        for (Map.Entry<String, Object> entry : changes.entrySet()) {
            if (entry.getValue() != null) {
                setStatements.add(entry.getKey() + "=:" + entry.getKey());
            }
        }

        String sqlStatement = String.format("UPDATE film SET %s WHERE film_id=:filmId", setStatements.toString());

        try {
            Map<String, Object> params = new HashMap<>(changes);
            params.put("filmId", id);
            databaseClient.updateDatabase(sqlStatement, params);
            return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON)
                    .body("{\"message\":\"Film updated successfully\"}");
        } catch (DataAccessException e) {
            System.out.println("Failed to update film");
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body("{\"message\":\"Failed to update film\"}");
        }
    }

    @DeleteMapping("/films/delete/{id}")
    public ResponseEntity<String> deleteFilmInDatabaseByID(@PathVariable Long id) {
        String deleteRentalsSQLStatement = "DELETE FROM rental WHERE inventory_id IN (SELECT inventory_id FROM inventory WHERE film_id=:filmId)";
        String deleteInventorySQLStatement = "DELETE FROM inventory WHERE film_id=:filmId";
        String deleteFilmCategoryRelationSQLStatement = "DELETE FROM film_category WHERE film_id=:filmId";
        String deleteFilmActorRelationSQLStatement = "DELETE FROM film_actor WHERE film_id=:filmId";
        String deleteFilmSQLStatement = "DELETE FROM film WHERE film_id=:filmId";

        Map<String, Object> params = new HashMap<>();
        params.put("filmId", id);

        try {
            databaseClient.updateDatabase(deleteRentalsSQLStatement, params);
            databaseClient.updateDatabase(deleteInventorySQLStatement, params);
            databaseClient.updateDatabase(deleteFilmCategoryRelationSQLStatement, params);
            databaseClient.updateDatabase(deleteFilmActorRelationSQLStatement, params);
            int rowsDeleted = databaseClient.updateDatabase(deleteFilmSQLStatement, params);
            if (rowsDeleted == 0) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body("{\"message\":\"Film not found\"}");
            }

            return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON)
                    .body("{\"message\":\"Film deleted successfully\"}");
        } catch (DataAccessException e) {
            System.out.println("Failed to delete film");
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body("{\"message\":\"Failed to delete film\"}");
        }
    }
}


