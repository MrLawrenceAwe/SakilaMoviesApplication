package com.LawrenceAwe.MoviesApplication;

import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.extension.ExtendWith;

import java.sql.Date;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FilmServiceTest {

    @Mock
    private ResultSet mockResultSet;

    @Test
    void testMapRowToFilm() throws SQLException {
        // Mock the result set values
        when(mockResultSet.getInt("film_id")).thenReturn(1);
        when(mockResultSet.getString("title")).thenReturn("Test Movie");
        when(mockResultSet.getString("description")).thenReturn("A test movie");
        when(mockResultSet.getDate("release_year")).thenReturn(Date.valueOf(LocalDate.of(2020, 1, 1)));
        when(mockResultSet.getString("language_id")).thenReturn("EN");
        when(mockResultSet.getString("length")).thenReturn("120");
        when(mockResultSet.getString("rating")).thenReturn("PG");

        // Call the method to test
        Film film = FilmService.mapRowToFilm(mockResultSet, 1);

        // Assertions to validate the results
        assertEquals("1", film.getFilmId());
        assertEquals("Test Movie", film.getTitle());
        assertEquals("A test movie", film.getDescription());
        assertEquals(Integer.valueOf(2020), film.getReleaseYear());
        assertEquals("EN", film.getLanguageId());
        assertEquals("120", film.getLength());
        assertEquals("PG", film.getRating());
    }
}

