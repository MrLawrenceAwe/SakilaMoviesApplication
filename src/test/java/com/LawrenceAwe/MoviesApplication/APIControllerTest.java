package com.LawrenceAwe.MoviesApplication;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.*;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class APIControllerTest {

    @Mock
    private DatabaseClient databaseClient;

    @InjectMocks
    private APIController apiController;

    private MockMvc mockMvc;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(apiController).build();
    }

    @Test
    public void testGetFilmByTitle_FilmExists() throws Exception {
        Film mockFilm = new Film();
        when(databaseClient.queryDatabaseForObject(anyString(), any(), any())).thenReturn(mockFilm);

        mockFilm.setTitle("Academy Dinosaur");

        mockMvc.perform(get("/api/films/Academy Dinosaur"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.title").value(mockFilm.getTitle()));

        verify(databaseClient, times(1)).queryDatabaseForObject(anyString(), any(), any());
    }

    @Test
    public void testGetFilmByTitle_FilmDoesNotExist() throws Exception {
        when(databaseClient.queryDatabaseForObject(anyString(), any(), any())).thenReturn(null);

        mockMvc.perform(get("/api/films/sample-title"))
                .andExpect(status().isNotFound())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message").value("No results found"));

        verify(databaseClient, times(1)).queryDatabaseForObject(anyString(), any(), any());
    }

    // Continuing from where we left off in the APIControllerTest:

    @Test
    public void testGetFilmsByCategory_FilmsExist() throws Exception {
        List<Film> mockFilms = Arrays.asList(new Film(), new Film());  // Mock list of films
        // Optionally set properties for the mock films

        when(databaseClient.queryDatabaseForList(anyString(), any(Object[].class), any(RowMapper.class))).thenReturn(mockFilms);


        mockMvc.perform(get("/api/films/category/action"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        verify(databaseClient, times(1)).queryDatabaseForList(anyString(), any(), any());
    }

    @Test
    public void testGetFilmsByCategory_FilmsDoNotExist() throws Exception {
        when(databaseClient.queryDatabaseForList(anyString(), any(), any())).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/films/category/sample-category"))
                .andExpect(status().isNotFound())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message").value("No results found"));

        verify(databaseClient, times(1)).queryDatabaseForList(anyString(), any(), any());
    }

    @Test
    public void testGetCategories_CategoriesExist() throws Exception {
        List<String> mockCategories = Arrays.asList("Category1", "Category2");

        when(databaseClient.queryDatabaseForList(anyString(), any(Object[].class), any(RowMapper.class))).thenReturn(mockCategories);


        mockMvc.perform(get("/api/films/categories"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        verify(databaseClient, times(1)).queryDatabaseForList(anyString(), any(), any());
    }

    @Test
    public void testGetCategories_CategoriesDoNotExist() throws Exception {
        when(databaseClient.queryDatabaseForList(anyString(), any(), any())).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/films/categories"))
                .andExpect(status().isNotFound())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message").value("No results found"));

        verify(databaseClient, times(1)).queryDatabaseForList(anyString(), any(), any());
    }

    @Test
    public void testGetLanguages_LanguagesExist() throws Exception {
        List<String> mockLanguages = Arrays.asList("English", "Spanish");

        when(databaseClient.queryDatabaseForList(anyString(), any(Object[].class), any(RowMapper.class))).thenReturn(mockLanguages);


        mockMvc.perform(get("/api/films/languages"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        verify(databaseClient, times(1)).queryDatabaseForList(anyString(), any(), any());
    }

    @Test
    public void testGetLanguages_LanguagesDoNotExist() throws Exception {
        when(databaseClient.queryDatabaseForList(anyString(), any(), any())).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/films/languages"))
                .andExpect(status().isNotFound())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message").value("No results found"));

        verify(databaseClient, times(1)).queryDatabaseForList(anyString(), any(), any());
    }

    @Test
    public void testAddFilmToDatabase_Success() throws Exception {
        String sql = "INSERT INTO films(title, description, language) VALUES(:title, :description, :language)";
        Map<String, Object> params = new HashMap<>();
        params.put("title", "sample title");
        params.put("description", "sample description");
        params.put("language", "English"); // Example value since it's mandatory

        when(databaseClient.updateDatabase(sql, params)).thenReturn(1);

       Film mockFilm = new Film();
         mockFilm.setTitle("sample title");
         mockFilm.setDescription("sample description");
         mockFilm.setLanguage("English");

        ObjectMapper objectMapper = new ObjectMapper();
        String filmJson = objectMapper.writeValueAsString(mockFilm);

        mockMvc.perform(post("/api/films/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(filmJson))
                .andExpect(status().isCreated());

        verify(databaseClient, times(1)).updateDatabase(anyString(), anyMap());

    }


    @Test
    public void testUpdateFilmInDatabaseByID_Success() throws Exception {
        String sql = "UPDATE films SET title=:title, description=:description WHERE id=:id";
        Map<String, Object> params = new HashMap<>();
        params.put("id", 123L);
        params.put("title", "updated title");
        params.put("description", "updated description");

        when(databaseClient.updateDatabase(sql, params)).thenReturn(1);

        String filmJson = "{\"title\":\"updated title\", \"description\":\"updated description\"}";

        mockMvc.perform(put("/api/films/update/123")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(filmJson))
                .andExpect(status().isOk());

        verify(databaseClient, times(1)).updateDatabase(anyString(), anyMap());
    }

    @Test
    public void testDeleteFilmInDatabaseByID_Success() throws Exception {
        // Mock the database calls
        when(databaseClient.updateDatabase(anyString(), anyMap())).thenReturn(1);  // This will mock all calls to return 1

        // Perform the DELETE request
        mockMvc.perform(delete("/api/films/delete/123"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message").value("Film deleted successfully"));
    }

    @Test
    public void testDeleteFilmInDatabaseByID_FilmNotFound() throws Exception {
        String sql = "DELETE FROM films WHERE id=:id";
        Map<String, Object> params = new HashMap<>();
        params.put("id", 123L);

        when(databaseClient.updateDatabase(sql, params)).thenReturn(0);

        mockMvc.perform(delete("/api/films/delete/123"))
                .andExpect(status().isNotFound())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message").value("Film not found"));
    }

    @Test
    public void testAddFilmToDatabase_WithCategory() throws Exception {

        // Mock film and category ID retrieval
        when(databaseClient.queryDatabaseForObject(eq("SELECT film_id FROM film WHERE title = ?"), eq("SAMPLE TITLE"), any(RowMapper.class)))
                .thenReturn("1"); // Simulated film ID
        when(databaseClient.queryDatabaseForObject(eq("SELECT category_id FROM category WHERE name = ?"), eq("Action"), any(RowMapper.class)))
                .thenReturn("2"); // Simulated category ID

        // Mock updateDatabase method for both the film insertion and the category relation
        when(databaseClient.updateDatabase(contains("INSERT INTO film"), anyMap())).thenReturn(1);
        when(databaseClient.updateDatabase(contains("INSERT INTO film_category"), anyMap())).thenReturn(1);

        Film film = new Film();
        film.setTitle("Sample Title");
        film.setDescription("Sample description");
        film.setReleaseYear(2023);
        film.setLanguage("English");
        film.setLength("120");
        film.setRating("PG");
        film.setCategory("Action");

        ObjectMapper objectMapper = new ObjectMapper();
        String filmJson = objectMapper.writeValueAsString(film);

        mockMvc.perform(post("/api/films/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(filmJson))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message").value("Film created successfully"));

        // Verify that film ID and category ID retrieval methods were called
        verify(databaseClient, times(1)).queryDatabaseForObject(eq("SELECT film_id FROM film WHERE title = ?"), eq("SAMPLE TITLE"), any(RowMapper.class));
        verify(databaseClient, times(1)).queryDatabaseForObject(eq("SELECT category_id FROM category WHERE name = ?"), eq("Action"), any(RowMapper.class));

        // Verify that updateDatabase was called for both the film insertion and the category relation
        verify(databaseClient, times(2)).updateDatabase(anyString(), anyMap());
    }

    @Test
    public void testGetFilmLanguage_Success() {
        // Mocking the database client to return "English" for languageId 1
        int mockLanguageId = 1;
        String mockLanguageName = "English";

        when(databaseClient.queryDatabaseForObject(anyString(), eq(new Object[]{mockLanguageId}), any())).thenReturn(mockLanguageName);

        // Call the method and check the result
        String result = apiController.getFilmLanguage(mockLanguageId);
        assertEquals(mockLanguageName, result);
    }


}
