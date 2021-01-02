//this is our call to the user#index in our rails backend server
const endPoint = "http://localhost:3000/api/v1/recordings"

//fetching users 
document.addEventListener('DOMContentLoaded', () => {
    getRecordings();
});

function getRecordings() {
       //AJAX fetch request 
       fetch(endPoint)
       //using response JSON to append elements to the DOM 
       //.then returns promises.  If the promise is fulfilled or rejected THEN the handler function will be called asynchronously (scheduled in the thread loop).
       .then(response => response.json()
       .then(recordings => {
           //call users.data.forEach because data is nested in the jsonserializer  
           recordings.data.forEach(recording => {
             const recordingMarkup = `
             <div data-id=${recording.id}>
                <h1>${recording.attributes.title}</h1> 
                <h2>${recording.attributes.melody}</h2>
                <h3>${recording.attributes.user.name}</h3>
                <button data-id=${recording.id}>edit</button>
            </div>
            </br>`;
            console.log(recording)
            //updating the inner html with id user-container to show data in userMarkup 
            document.querySelector('#recording-container').innerHTML += recordingMarkup
           });
       }))
}