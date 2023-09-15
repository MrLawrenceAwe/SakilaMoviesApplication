package com.LawrenceAwe.MoviesApplication;

import com.LawrenceAwe.MoviesApplication.DataTransferObjects.Film;
import com.LawrenceAwe.MoviesApplication.Services.FilmService;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
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
    public ResponseEntity<Film> getFilmByTitle(@PathVariable String title) {
        String sql = "SELECT film_id, title, description FROM film WHERE LOWER(title) = LOWER(?)";
        Film film = databaseClient.queryForObject(sql, new Object[]{title}, FilmService::mapRowToFilm);

        if (film != null) {
            return ResponseEntity.ok(film);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/films/add")
    public ResponseEntity<String> createFilm(@RequestBody Film film) {
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

        String SQL = String.format("INSERT INTO film (%s) VALUES (%s)", fields, valueTokens);

        try {
            databaseClient.updateDatabase(SQL, params);
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
}


