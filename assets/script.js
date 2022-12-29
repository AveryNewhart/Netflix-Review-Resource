//Referencing ids/classes in the html file
let searchButtonEl = document.getElementById("clickSearch");
let listSearchHistEl = document.getElementById("listSearchHistory");
let userSearchEl = document.getElementById("searchedMovie");
let userSearchElValue = document.getElementById("searchedMovie").value;






//setting the review to local stroage
//setting the content to be saved as an array
const userReviews = JSON.parse(localStorage.getItem('userReviews')) || [];

const username = document.getElementById("userName");
const reviews = document.getElementById("userInput");


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


    
