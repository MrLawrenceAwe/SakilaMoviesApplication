package com.LawrenceAwe.MoviesApplication.Services;

import com.LawrenceAwe.MoviesApplication.Mappers.EntityMapper;
import org.springframework.jdbc.core.JdbcTemplate;

public class Service<T> {

    private JdbcTemplate jdbcTemplate;

    public T getById(int id, String tableName, String primaryKeyColumn, EntityMapper<T> entityMapper) {
        String sql = "SELECT * FROM " + tableName + " WHERE " + primaryKeyColumn + " = ?";
        return jdbcTemplate.queryForObject(sql, new Object[]{id},
                (resultSet, rowNum) -> entityMapper.mapRow(resultSet, rowNum));
    }

}
