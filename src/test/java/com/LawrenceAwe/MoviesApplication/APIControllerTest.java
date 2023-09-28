package com.LawrenceAwe.MoviesApplication;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.dao.DataAccessException;
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

    @Test
    public void testAddFilmToDatabase_DataAccessException() throws Exception {
        // Sample film data to use in the test
        Film sampleFilm = new Film();
        sampleFilm.setTitle("Test Movie");
        sampleFilm.setDescription("A test movie for unit testing");
        sampleFilm.setReleaseYear(2023);
        sampleFilm.setLanguage("English");
        sampleFilm.setLength("120");
        sampleFilm.setRating("PG-13");
        sampleFilm.setCategory("Action");

        String getLanguageIDSQLStatement = "SELECT language_id FROM language WHERE name = ?";
        String languageId = "1"; // Sample language ID for the test

        // When querying for the language ID, return the sample language ID
        when(databaseClient.queryDatabaseForObject(eq(getLanguageIDSQLStatement), eq(sampleFilm.getLanguage()), any())).thenReturn(languageId);

        // Make the databaseClient.updateDatabase() method throw a DataAccessException
        doThrow(new DataAccessException("Test exception") {}).when(databaseClient).updateDatabase(anyString(), anyMap());

        // Convert the Film object to JSON using Jackson's ObjectMapper
        ObjectMapper objectMapper = new ObjectMapper();
        String filmJson = objectMapper.writeValueAsString(sampleFilm);

        // Make a POST request to add the film
        mockMvc.perform(post("/api/films/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(filmJson))
                .andExpect(status().isInternalServerError())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message").value("Failed to create film"));

        // Verify that the databaseClient.updateDatabase() method was called
        verify(databaseClient, times(1)).updateDatabase(anyString(), anyMap());
    }

    @Test
    public void testUpdateFilmCategory_Success() throws Exception {
        // Mocks
        String getCategoryIDSQLStatement = "SELECT category_id FROM category WHERE name = ?";
        when(databaseClient.queryDatabaseForObject(eq(getCategoryIDSQLStatement), any(), ArgumentMatchers.any())).thenReturn("1");

        String deleteFilmCategoryRelationSQLStatement = "DELETE FROM film_category WHERE film_id=:filmId";
        String addFilmCategoryRelationSQLStatement = "INSERT INTO film_category (film_id, category_id) VALUES (:filmId, :categoryId)";
        when(databaseClient.updateDatabase(eq(deleteFilmCategoryRelationSQLStatement), any())).thenReturn(1);
        when(databaseClient.updateDatabase(eq(addFilmCategoryRelationSQLStatement), any())).thenReturn(1);

        // Test data
        Long filmId = 123L;
        Map<String, Object> changes = new HashMap<>();
        changes.put("category", "Action");
        String changesJson = new ObjectMapper().writeValueAsString(changes);

        // Perform test
        mockMvc.perform(put("/api/films/update/" + filmId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(changesJson))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message").value("Film updated successfully"));

    }

    @Test
    public void testUpdateFilmInDatabaseByID_DataAccessException() throws Exception {
        // Given: a film update request
        Long filmId = 1L;
        Map<String, Object> changes = new HashMap<>();
        changes.put("title", "Updated Title");

        // When: updating the film causes a DataAccessException
        String updateFilmSQLStatement = "UPDATE film SET title=:title WHERE film_id=:filmId";
        Map<String, Object> params = new HashMap<>(changes);
        params.put("filmId", filmId);

        doThrow(new DataAccessException("Test Exception") {}).when(databaseClient).updateDatabase(updateFilmSQLStatement, params);

        // Then: the API should return an INTERNAL_SERVER_ERROR with an appropriate message
        String filmJson = "{\"title\":\"Updated Title\"}";

        mockMvc.perform(put("/api/films/update/" + filmId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(filmJson))
                .andExpect(status().isInternalServerError())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message").value("Failed to update film"));

        verify(databaseClient, times(1)).updateDatabase(updateFilmSQLStatement, params);
    }

    @Test
    public void testDeleteFilmInDatabaseByID_ThrowsDataAccessException() throws Exception {
        // Given
        String deleteRentalsSQLStatement = "DELETE FROM rental WHERE inventory_id IN (SELECT inventory_id FROM inventory WHERE film_id=:filmId)";
        Map<String, Object> params = new HashMap<>();
        params.put("filmId", 123L);  // Example filmId for testing purposes

        // Mock the DatabaseClient to throw a DataAccessException when updateDatabase is called
        doThrow(new DataAccessException("Test Exception") {}).when(databaseClient).updateDatabase(eq(deleteRentalsSQLStatement), eq(params));

        // Perform the DELETE request
        mockMvc.perform(delete("/api/films/delete/123"))
                .andExpect(status().isInternalServerError())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message").value("Failed to delete film"));

        verify(databaseClient, times(1)).updateDatabase(eq(deleteRentalsSQLStatement), eq(params));
    }

    @Test
    public void testUpdateFilmLanguage_Success() throws Exception {
        Long filmId = 1L;
        String languageName = "English";
        String languageId = "5";

        String requestBody = "{\"language\":\"" + languageName + "\"}";

        String getLanguageIDSQLStatement = "SELECT language_id FROM language WHERE name = ?";
        when(databaseClient.queryDatabaseForObject(eq(getLanguageIDSQLStatement), eq(languageName), any()))
                .thenReturn(languageId);

        String updateFilmSQLStatement = "UPDATE film SET language_id=:language_id WHERE film_id=:filmId";
        Map<String, Object> params = new HashMap<>();
        params.put("filmId", filmId);
        params.put("language_id", languageId);
        when(databaseClient.updateDatabase(updateFilmSQLStatement, params)).thenReturn(1);

        mockMvc.perform(put("/api/films/update/" + filmId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message").value("Film updated successfully"));

        verify(databaseClient, times(1)).queryDatabaseForObject(eq(getLanguageIDSQLStatement), eq(languageName), any());
        verify(databaseClient, times(1)).updateDatabase(updateFilmSQLStatement, params);
    }

    @Test
    public void testUpdateFilmWithEmptyChanges() throws Exception {
        // Given
        Long filmId = 123L;
        String emptyChanges = "{}";
        // When & Then
        mockMvc.perform(put("/api/films/update/" + filmId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(emptyChanges))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message").value("No fields provided for update."));

        // Verify
        verify(databaseClient, times(0)).updateDatabase(anyString(), anyMap()); // Ensure no DB operation took place
    }

    @Test
    public void testGetFilmsByCategory_HappyPath() throws Exception {
        // Sample film for testing
        Film sampleFilm = new Film();
        sampleFilm.setFilmId(1);
        sampleFilm.setTitle("Sample Film");
        sampleFilm.setLanguageId("1");

        // Assuming these are your actual methods to fetch language and category. Mock their responses.
        when(apiController.getFilmLanguage(1)).thenReturn("English");
        when(apiController.getFilmCategory(1)).thenReturn("Action");

        // Mock database client's queryDatabaseForList to return a list containing the sample film
        when(databaseClient.queryDatabaseForList(anyString(), any(), any())).thenReturn(Collections.singletonList(sampleFilm));

        mockMvc.perform(get("/api/films/category/action"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Sample Film"))
                .andExpect(jsonPath("$[0].language").value("English"))
                .andExpect(jsonPath("$[0].category").value("Action"));

    }

    @Test
    public void testGetFilmsByCategory_NoLanguageId() throws Exception {
        Film sampleFilm = new Film();
        sampleFilm.setFilmId(1);
        sampleFilm.setTitle("Sample Film");

        when(databaseClient.queryDatabaseForList(anyString(), any(), any())).thenReturn(Collections.singletonList(sampleFilm));
        when(apiController.getFilmCategory(1)).thenReturn("Action");

        mockMvc.perform(get("/api/films/category/action"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Sample Film"))
                .andExpect(jsonPath("$[0].language").doesNotExist())
                .andExpect(jsonPath("$[0].category").value("Action"));
    }

    @Test
    public void testGetFilmsByCategory_NoFilmsFound() throws Exception {
        when(databaseClient.queryDatabaseForList(anyString(), any(), any())).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/films/category/nonexistent-category"))
                .andExpect(status().isNotFound())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message").value("No results found"));
    }

    @Test
    public void testGetFilmByTitle_FilmFoundWithLanguageId() throws Exception {
        String title = "TestFilm";
        String testLanguage = "English";

        Film mockFilm = new Film();
        mockFilm.setTitle(title);
        mockFilm.setLanguageId("1");

        when(databaseClient.queryDatabaseForObject(
                anyString(),
                eq(new Object[]{title}),
                any(RowMapper.class)
        )).thenReturn(mockFilm);

        when(apiController.getFilmLanguage(1)).thenReturn(testLanguage);

        mockMvc.perform(get("/api/films/" + title))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value(title))
                .andExpect(jsonPath("$.language").value(testLanguage));

    }

    @Test
    public void testGetFilmByTitle_FilmFoundWithFilmId() throws Exception {
        String title = "TestFilm";
        String testCategory = "Action";
        Film mockFilm = new Film();
        mockFilm.setTitle(title);
        mockFilm.setFilmId(123);

        when(databaseClient.queryDatabaseForObject(
                anyString(),
                eq(new Object[]{title}),
                any(RowMapper.class)
        )).thenReturn(mockFilm);

        when(apiController.getFilmCategory(123)).thenReturn(testCategory);

        mockMvc.perform(get("/api/films/"+title))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value(title))
                .andExpect(jsonPath("$.category").value(testCategory));

    }
}
