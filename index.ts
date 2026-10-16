interface Movie {
    plot: string;
    movie: string;
    hint: string;
}

let chosenMovie = -1;
let movieList: string[] = [];
let movieObjects: Movie[] = [];
let score = 0;
let hintUsed = false;

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('movie-search') as HTMLInputElement;
    const resultsList = document.getElementById('search-results') as HTMLElement;
    const skipBtn = document.getElementById('skip') as HTMLButtonElement;
    const hintBtn = document.getElementById('hint') as HTMLButtonElement;
    
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
        if (!searchInput.contains(e.target as Node) && !resultsList.contains(e.target as Node)) {
            resultsList.style.display = 'none';
        }
    });

    // Reset scroll position when keyboard is dismissed (on mobile)
    searchInput.addEventListener('blur', () => {
        // Only scroll if the document has been scrolled (likely by the keyboard)
        if (window.scrollY > 0) {
            setTimeout(() => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }, 100);
        }
    });

    // Also handle the case where a search result is clicked
    // handleGuess already handles clearing input and moving to next movie,
    // but the blur event on searchInput will trigger when a result is clicked.
    
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

function updateHighScore(): void {
    let highScore = parseFloat(localStorage.getItem('highScore') ?? '') || 0;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', String(highScore));
    }
    
    const highScoreElement = document.getElementById('high-score');
    if (highScoreElement) {
        highScoreElement.innerHTML = `<strong>High Score: </strong>${highScore}`;
    }
}

function runGame(): void {
    handleMovies().then(() => chooseMovie());
    console.log("Game started");
}

async function handleMovies(): Promise<void> {
    const res = await fetch('./resources/movies.json');
    movieObjects = await res.json();
    movieList = [];
    movieObjects.forEach(movie => movieList.push(movie.movie));
}

function chooseMovie(): void {
    if (movieObjects.length === 0) {
        runGame();
        return;
    }
    chosenMovie = Math.random() * movieObjects.length | 0;

    const plotText = document.getElementById('plot-text') as HTMLElement;
    plotText.textContent = movieObjects[chosenMovie].plot;
    triggerFeedback(plotText, 'plot-update');
    
    const hintContainer = document.getElementById('hint-container') as HTMLElement;
    hintContainer.style.display = 'none';
    hintUsed = false;
    console.log(movieObjects[chosenMovie].movie);
}

function handleGuess(guess: string): void {
    const isCorrect = guess === movieObjects[chosenMovie].movie;
    if (isCorrect) {
        correctGuess();
        // If correct, we clear any previous answer immediately
        (document.getElementById('answer-container') as HTMLElement).innerHTML = '';
    } else {
        incorrectGuess();
    }
    const searchInput = document.getElementById('movie-search') as HTMLInputElement;
    searchInput.value = '';
    
    // Remove the seen movie from movieObjects
    movieObjects.splice(chosenMovie, 1);
    updateHighScore();
    chooseMovie();
}

function correctGuess(): void {
    hintUsed ? score = score+0.5 : score++;
    const scoreElement = document.getElementById('score') as HTMLElement;
    scoreElement.innerHTML = "<strong>Score: </strong> " + score;
    triggerFeedback(scoreElement, 'score-increase');
}

function incorrectGuess(): void {
    (score > 0) ? score = score - 0.5 : score;
    const scoreElement = document.getElementById('score') as HTMLElement;
    scoreElement.innerHTML = "<strong>Score: </strong>" + score;
    triggerFeedback(scoreElement, 'score-decrease');
    showAnswerPopup(movieObjects[chosenMovie].movie);
}

function showAnswerPopup(movieTitle: string): void {
    const container = document.getElementById('answer-container') as HTMLElement;
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

function triggerFeedback(element: HTMLElement, className: string): void {
    element.classList.add(className);
    setTimeout(() => {
        element.classList.remove(className);
    }, 500);
}

function displayHint(): void {
    hintUsed = true;
    const hintContainer = document.getElementById('hint-container') as HTMLElement;
    const hintText = document.getElementById('hintText') as HTMLElement;
    hintText.innerHTML = `<i>Hint: ${movieObjects[chosenMovie].hint}</i>`;
    hintContainer.style.display = 'flex';
}