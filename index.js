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
    
    updateHighScore();
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
    
    skipBtn.addEventListener('click', () => {
        incorrectGuess();
        movieObjects.splice(chosenMovie, 1);
        updateHighScore();
        chooseMovie();
    });
    hintBtn.addEventListener('click', () => {
        displayHint();
    });
    
});

function updateHighScore() {
    let highScore = parseFloat(localStorage.getItem('highScore')) || 0;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }
    
    const highScoreElement = document.getElementById('high-score');
    if (highScoreElement) {
        highScoreElement.innerHTML = `<strong>High Score: </strong>${highScore}`;
    }
}

function runGame() {
    handleMovies().then(() => chooseMovie());
    console.log("Game started");
}

async function handleMovies() {
    const res = await fetch('./resources/movies.json');
    movieObjects = await res.json();
    movieList = [];
    movieObjects.forEach(movie => movieList.push(movie.movie));
}

function chooseMovie() {
    if (movieObjects.length === 0) {
        runGame();
        return;
    }
    chosenMovie = Math.random() * movieObjects.length | 0;

    const plotText = document.getElementById('plot-text');
    plotText.textContent = movieObjects[chosenMovie].plot;
    triggerFeedback(plotText, 'plot-update');
    
    const hintContainer = document.getElementById('hint-container');
    hintContainer.style.display = 'none';
    hintUsed = false;
    console.log(movieObjects[chosenMovie].movie);
}

function handleGuess(guess) {
    const isCorrect = guess === movieObjects[chosenMovie].movie;
    if (isCorrect) {
        correctGuess();
        // If correct, we clear any previous answer immediately
        document.getElementById('answer-container').innerHTML = '';
    } else {
        incorrectGuess();
    }
    const searchInput = document.getElementById('movie-search');
    searchInput.value = '';
    
    // Remove the seen movie from movieObjects
    movieObjects.splice(chosenMovie, 1);
    updateHighScore();
    chooseMovie();
}

function correctGuess() {
    hintUsed ? score = score+0.5 : score++;
    const scoreElement = document.getElementById('score');
    scoreElement.innerHTML = "<strong>Score: </strong> " + score;
    triggerFeedback(scoreElement, 'score-increase');
}

function incorrectGuess() {
    (score > 0) ? score = score - 0.5 : score;
    const scoreElement = document.getElementById('score');
    scoreElement.innerHTML = "<strong>Score: </strong>" + score;
    triggerFeedback(scoreElement, 'score-decrease');
    showAnswerPopup(movieObjects[chosenMovie].movie);
}

function showAnswerPopup(movieTitle) {
    const container = document.getElementById('answer-container');
    container.innerHTML = ''; // Clear existing popups
    const popup = document.createElement('div');
    popup.classList.add('answer-popup');
    popup.textContent = "The movie was: " + movieTitle;
    container.appendChild(popup);

    setTimeout(() => {
        popup.style.opacity = '0';
        setTimeout(() => {
            if (popup.parentNode) {
                popup.remove();
            }
        }, 500);
    }, 2000);
}

function triggerFeedback(element, className) {
    element.classList.add(className);
    setTimeout(() => {
        element.classList.remove(className);
    }, 500);
}

function displayHint() {
    hintUsed = true;
    const hintContainer = document.getElementById('hint-container');
    const hintText = document.getElementById('hintText');
    hintText.innerHTML = `<i>Hint: ${movieObjects[chosenMovie].hint}</i>`;
    hintContainer.style.display = 'flex';
}