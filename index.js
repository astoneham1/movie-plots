document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('movie-search');
    const resultsList = document.getElementById('search-results');

    // A dummy list of movies for demonstration
    // In a real app, you would fetch this from an API like OMDb or TMDB
    const movieList = [
        "Star Wars: A New Hope",
        "The Lord of the Rings",
        "Harry Potter",
        "The Matrix",
        "Inception",
        "Interstellar",
        "Finding Nemo",
        "Toy Story",
        "The Lion King",
        "Avengers: Endgame",
        "Spider-Man",
        "Batman Begins"
    ];

    // Listen for typing in the search box
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        resultsList.innerHTML = ''; // Clear previous results

        if (query.length < 3) {
            resultsList.style.display = 'none';
            return;
        }

        // Filter movies that match the query
        const matches = movieList.filter(movie =>
            movie.toLowerCase().includes(query)
        );

        if (matches.length > 0) {
            matches.forEach(movie => {
                const div = document.createElement('div');
                div.classList.add('result-item');
                div.textContent = movie;

                // Add click event to select the movie
                div.addEventListener('click', () => {
                    searchInput.value = movie;
                    resultsList.style.display = 'none';
                    console.log(`User selected: ${movie}`);
                    // logic to load the "badly explained plot" for this movie would go here
                });

                resultsList.appendChild(div);
            });
            resultsList.style.display = 'block';
        } else {
            resultsList.style.display = 'none';
        }
    });

    // Close the dropdown if the user clicks outside the search box
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !resultsList.contains(e.target)) {
            resultsList.style.display = 'none';
        }
    });
});