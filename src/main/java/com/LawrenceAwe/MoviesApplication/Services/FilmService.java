package com.LawrenceAwe.MoviesApplication.Services;

import com.LawrenceAwe.MoviesApplication.DataTransferObjects.Film;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;

import java.sql.ResultSet;
import java.sql.SQLException;

public class FilmService {
    private static JdbcTemplate jdbcTemplate;

    public static Film mapRowToFilm(ResultSet rs, int rowNum) throws SQLException {
        return new Film(rs.getInt("film_id"),
                rs.getString("title"),
                rs.getString("description"));
    }
}
