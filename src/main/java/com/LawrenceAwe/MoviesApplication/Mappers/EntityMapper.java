package com.LawrenceAwe.MoviesApplication.Mappers;

import java.sql.ResultSet;
import java.sql.SQLException;

public interface EntityMapper<T> {
    T mapRow(ResultSet rs, int rowNum) throws SQLException;
}
