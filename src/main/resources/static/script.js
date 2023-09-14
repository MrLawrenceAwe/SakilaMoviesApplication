function fetchFilmDetails() {
    const title = document.getElementById("filmTitleInput").value;
    fetch(`/api/films/${title}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Not Found');
            }
            return response.json();
        })
        .then(data => {
            document.getElementById("filmId").textContent = data.filmId;
            document.getElementById("filmTitle").textContent = data.title;
            document.getElementById("filmDescription").textContent = data.description;
        })
        .catch(error => {
            console.error('Error fetching the film:', error);
            alert('Film not found');
        });
}
