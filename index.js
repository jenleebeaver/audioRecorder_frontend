//this is our call to the user#index in our rails backend server
const endPoint = "http://localhost:3000/api/v1/users"

//fetching users 
document.addEventListener('DOMContentLoaded', () => {
    //AJAX fetch request 
    fetch(endPoint)
    //using response JSON to append elements to the DOM 
    //.then returns promises.  If the promise is fulfilled or rejected THEN the handler function will be called asynchronously (scheduled in the thread loop).
    .then(response => response.json()
    .then(users => {
        console.log(users);
    }))
});