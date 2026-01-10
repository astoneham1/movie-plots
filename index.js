let chosenMovie = -1;
let movieList = [];
let movieObjects = [];
let score = 0;
let hintUsed = false;

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('movie-search');
    const resultsList = document.getElementById('search-results');
    const skipBtn = document.getElementById('skip');
    const hintBtn = document.getElementById('hint');
    
    runGame();
    
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        resultsList.innerHTML = ''; // Clear previous results

        if (query.length < 2) {
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
                    handleGuess(movie);
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
    
    skipBtn.addEventListener('click', runGame);
    hintBtn.addEventListener('click', () => {
        displayHint();
    });
    
});

function runGame() {
    handleMovies().then(() => chooseMovie());
    console.log("Movie chosen");
}

async function handleMovies() {
    const res = await fetch('./resources/movies.json');
    movieObjects = await res.json();
    movieObjects.forEach(movie => movieList.push(movie.movie));
    console.log(movieList);
}

function chooseMovie() {
    chosenMovie = Math.random() * movieObjects.length | 0;
    const plotText = document.getElementById('plot-text');
    plotText.textContent = movieObjects[chosenMovie].plot;
}

function handleGuess(guess) {
    if (guess === movieObjects[chosenMovie].movie) {
        correctGuess();
    } else {
        incorrectGuess();
    }
    const searchInput = document.getElementById('movie-search');
    searchInput.value = '';
    chooseMovie();
}

function correctGuess() {
    hintUsed ? score = score+0.5 : score++;
    document.getElementById('score').innerHTML = "<strong>Score: </strong> " + score;
}

function incorrectGuess() {
    (score > 0) ? score = score - 0.5 : score;
    document.getElementById('score').innerHTML = "<strong>Score: </strong>" + score;
}

function displayHint() {
    hintUsed = true;
}