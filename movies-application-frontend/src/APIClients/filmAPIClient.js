const BASE_URL = 'http://localhost:8080/api';

export const filmAPIClient = {
    
    getFilmByTitle: async (title) => {
        try {
            title = encodeURIComponent(title);
            const response = await fetch(`${BASE_URL}/films/${title}`);
            // Check if response status is OK
            if (!response.ok) {
                throw new Error('Failed to fetch film by title');
            }
            return await response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    createFilm: async (film) => {
        try {
            const response = await fetch(`${BASE_URL}/films/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(film)
            });
            if (!response.ok && response.status !== 201) {
                throw new Error('Failed to create film');
            }
            return await response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    updateFilm: async (filmId, changes) => {
        try {
            const response = await fetch(`${BASE_URL}/films/update/${filmId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(changes)
            });
            if (!response.ok) {
                throw new Error('Failed to edit film');
            }
            return await response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    
}