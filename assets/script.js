//Referencing ids/classes in the html file
const searchButtonEl = document.getElementById("searchBtn");
const netflixInfo = document.getElementById("movieInfo");
const movieImageEl = document.getElementById("displayedImg");
const movieReviewsEl = document.getElementById("movieReviews");
const myModalEl = document.getElementById("myModal");
const closeModalEl = document.getElementById("closeBtn");
const userFeedbackEl = document.getElementById("userFeedback");
let listSearchHistEl = document.getElementById("listSearchHistory");
let userSearchEl = document.getElementById("searchedMovie");


//setting the review to local storage
//setting the content to be saved as an array
const userReviews = JSON.parse(localStorage.getItem('userReviews')) || [];

const username = document.getElementById("userName");
const reviews = document.getElementById("userInput");

const searchMessage = {};
const openSesame = 'f1e2db7221msh65dad2e58f9a559p1d090djsn8e7db435221e';


function submitReview() {

    const review = {
        title: userSearchEl.value,
        username: username.value,
        review: reviews.value,
    };

    userReviews.push(review)

    localStorage.setItem('userReviews', JSON.stringify(userReviews));
    window.location.assign('./review.html');

};


// Get user input to perform search
let searchNetflixMovies = function (event) {
    event.preventDefault();

    let userSearchElValue = userSearchEl.value;
    // Use a modal
    if (!userSearchElValue.length || !userSearchElValue) {
        displayErrorMessages("Please enter movie name to search");
        return;
    }

    searchMessage['movieName'] = userSearchElValue;
    getNetflixMovie();
}

// Get the Netflix movie info
var getNetflixMovie = function () {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': `${openSesame}`,
            'X-RapidAPI-Host': 'unogs-unogs-v1.p.rapidapi.com'
        }
    };

    let movieName = searchMessage['movieName'];
    fetch(`https://unogs-unogs-v1.p.rapidapi.com/search/titles?order_by=date&country_list=78&title=${movieName}&type=movie`, options)
        .then(response => response.json())
        .then(response => {
            // Use a modal
            if(!response.results){
                displayErrorMessages(`"${movieName}" is not available on Netflix for the US  region`);
                userSearchEl.value = '';
                return;
            }

            searchMessage['movieMatch'] = response.results[0];
            searchMessage['movieID'] = response.results[0].imdb_id;
            getMoviesDetails();
        })
        .catch(err => console.error(err));
}

// Get movie details from Movie Database Alternative
var getMoviesDetails = function () {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': `${openSesame}`,
            'X-RapidAPI-Host': 'movie-database-alternative.p.rapidapi.com'
        }
    };

    let movieID = searchMessage['movieID'];
    fetch(`https://movie-database-alternative.p.rapidapi.com/?r=json&i=${movieID}`, options)
        .then(response => response.json())
        .then(response => {
            searchMessage['movieDB'] = response;
            getUserReviews();
        })
        .catch(err => console.error(err));
}

// Get user reviews from IMDB
let getUserReviews = function() {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': `${openSesame}`,
            'X-RapidAPI-Host': 'imdb8.p.rapidapi.com'
        }
    };

    let movieID = searchMessage['movieID'];
    fetch(`https://imdb8.p.rapidapi.com/title/get-user-reviews?tconst=${movieID}`, options)
        .then(response => response.json())
        .then(response => {
            searchMessage['reviews'] = response.reviews.slice(0,5);
            UpdateDisplay();
        })
        .catch(err => console.error(err));
}

// Display the movie info and reviews
let UpdateDisplay = function () {
    let movieDB = searchMessage['movieDB'];
    movieImageEl.innerHTML = `<img src="${movieDB.Poster}" alt="${movieDB.Title} cinema image" class="placeholderImg">`;

    netflixInfo.innerHTML = `<h5>${movieDB.Title}</h5><p>Plot: ${movieDB.Plot}</p><p>Date Released: ${movieDB.Released}</p><p>Rated: ${movieDB.Rated}</p><p>Actors: ${movieDB.Actors}</p><p>Genre: ${movieDB.Genre}</p><p>Runtime: ${movieDB.Runtime}</p><p>Ratings: ${movieDB.Ratings[0].Source} - ${movieDB.Ratings[0].Value}</p>`;

    let reviews = searchMessage['reviews'];
    movieReviewsEl.innerHTML = reviews.map(userReview => {
        return `<li><p>${userReview.author.displayName} - Rating: ${userReview.authorRating}</p><p>${userReview.reviewText}</p></li>`
    }).join('')
} 

// Display all error messages in a modal
let displayErrorMessages = function (errorMessage) {
    userFeedbackEl.textContent = errorMessage;
    myModalEl.style.display = 'block';
}

// close the modal
// closeModalEl.onclick = function() {
//     userFeedbackEl.textContent = '';
//     myModalEl.style.display = "none";
// }

searchButtonEl.addEventListener('click', searchNetflixMovies);
