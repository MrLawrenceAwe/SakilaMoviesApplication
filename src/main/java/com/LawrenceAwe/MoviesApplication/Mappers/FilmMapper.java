package com.LawrenceAwe.MoviesApplication.Mappers;


import com.LawrenceAwe.MoviesApplication.DataTransferObjects.Film;

import java.sql.ResultSet;
import java.sql.SQLException;

public class FilmMapper implements EntityMapper<Film>{
    @Override
    public Film mapRow(ResultSet resultSet, int rowNum) throws SQLException {
        return new Film(resultSet.getInt("film_id"),
                resultSet.getString("title"),
                resultSet.getString("description"));
    }
}
