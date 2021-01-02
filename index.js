//this is our call to the user#index in our rails backend server
const endPoint = "http://localhost:3000/api/v1/users"

//fetching users 
document.addEventListener('DOMContentLoaded', () => {
    getUsers();
});

function getUsers() {
       //AJAX fetch request 
       fetch(endPoint)
       //using response JSON to append elements to the DOM 
       //.then returns promises.  If the promise is fulfilled or rejected THEN the handler function will be called asynchronously (scheduled in the thread loop).
       .then(response => response.json()
       .then(users => {
           //call users.data.forEach because data is nested in the jsonserializer  
           users.data.forEach(user => {
             const userMarkup = `
             <div data-id=${user.id}>
                <h1>${user.attributes.name}</h1>
                <h2>${user.attributes.recordings.title}</h2>
                <h3>${user.attributes.recordings.melody}</h3>
                <button data-id=${user.id}>edit</button>
            </div>
            </br>`;

            //updating the inner html with id user-container to show data in userMarkup 
            document.querySelector('#user-container').innerHTML += userMarkup
           });
       }))
}