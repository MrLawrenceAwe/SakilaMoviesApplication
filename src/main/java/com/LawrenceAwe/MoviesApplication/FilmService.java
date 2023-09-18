package com.LawrenceAwe.MoviesApplication;

import java.sql.Date;
import java.sql.ResultSet;
import java.sql.SQLException;

public class FilmService {
    public static Film mapRowToFilm(ResultSet resultSet, int rowNum) throws SQLException {
        Integer releaseYear = null;
        Date date = resultSet.getDate("release_year");
        if (date != null) {
            releaseYear = date.toLocalDate().getYear();
        }

        return new Film(resultSet.getInt("film_id"),
                resultSet.getString("title"),
                resultSet.getString("description"),
                releaseYear,
                resultSet.getString("language_id"),
                resultSet.getString("original_language_id")
        );
    }
}
