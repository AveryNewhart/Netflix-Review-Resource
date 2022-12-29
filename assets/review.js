// referencing ids in the html
// setitng the const that will be used to reference getting the item from local storage
const reviewListEl = document.getElementById("reviewList");
const userReviews = JSON.parse(localStorage.getItem('userReviews')) || [];

// how the reviews will be displayed / getting the data to display
reviewListEl.innerHTML = userReviews
    .map(review => {
    return `<li class="user-review">${review.title}, ${review.username}, ${review.review}</li>`
    })
    .join('')


//clear reviews
function clearReviews() {
    localStorage.clear();
}