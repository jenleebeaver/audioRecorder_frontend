//this is our get request to the recording#index in our rails backend server
const endPoint = "http://localhost:3000/api/v1/recordings"
let blob
const jwtToken = localStorage.getItem('jwt_token')

//fetching recordings 
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM is Loaded");
    initLoad();
    initRecorder();
    getRecordings();
});

function initLoad() {
    const userExist = localStorage.getItem('jwt_token');
    if (userExist) {
        // document.querySelector('.signin-container').style.display = 'block';
        document.querySelector('.logout-btn').style.display = 'block';
        document.querySelector('.login-container').style.display = 'none';
        document.querySelector('.form-container').style.display = 'block';
        document.querySelector('#recording-list-container').style.display = 'flex';     
    } else {
        // document.querySelector('.signin-container').style.display = 'none';
        document.querySelector('.logout-btn').style.display = 'none';
        document.querySelector('#recording-list-container').style.display = 'none'; 
        // document.querySelector('#recording-container').style.display = 'none'; 
    }
}

//LOGIN FORM 
const loginForm = document.querySelector('#login-form')
loginForm.addEventListener("submit", (e) => loginFormHandler(e))

function loginFormHandler(e) {
    //prevents refresh on submit 
    e.preventDefault()
    const emailInput = e.target.querySelector('#login-email').value
    const pwInput = e.target.querySelector('#login-password').value
    loginFetch(emailInput, pwInput)
}

function loginFetch(email, password){
    //strong params = nested user data 
    const bodyData = {user: {
        email: email, 
        password: password
    }
}
    console.log(bodyData);
    fetch("http://localhost:3000/api/v1/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(bodyData)
    })
    //promise represents the value of a complete asynchronous operation. Allows us to know if event is a success or failure: pending, fulfilled, or rejected
    .then(response => response.json())
    .then(json => {
        console.log(json);
        //storing token from login fetch request json in localStorage
        localStorage.setItem('jwt_token', json.jwt)
        renderUserProfile()
    })
}

//EDIT FORM 
function loadRecordingEvents() {
    const editBtns = document.querySelectorAll('.edit-btn');
    editBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
        const id = parseInt(e.target.getAttribute("data-id"));
        const recording = Recording.findById(id);
        console.log(recording); 
        document.querySelector('#update-recording').innerHTML = recording.renderUpdateForm();
        // console.log(parseInt(e.target.getAttribute("data-id")));
        })
    })
}

document.querySelector('#update-recording').addEventListener('submit', e => updateFormHandler(e))
    
function updateFormHandler(e) {
    e.preventDefault();
    
    const id = parseInt(e.target.dataset.id);
    const recording = Recording.findById(id);
    const title = e.target.querySelector('#input-title').value;
    const audio_url = e.target.querySelector('#input-data').value;
    patchRecording(recording, title, audio_url)
}

function patchRecording(recording, title, audio_url) {
    const bodyJSON = {title, audio_url}
    console.log(bodyJSON)
    fetch(`http://localhost:3000/api/v1/recordings/${recording.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify(bodyJSON),
    })
    location.reload()
    alert(`Your recording has been edited.`)
    .then(response => response.json())
    .then(updatedRecording => {
        console.log(updatedRecording)
    });
}

//

function renderUserProfile() {
    console.log(localStorage.getItem('jwt_token'));
    fetch('http://localhost:3000/api/v1/profile', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
        }
    })
    .then(res => res.json())
    .then(json => {
        alert(`Welcome back ${json.user.data.attributes.name}`);
        initLoad();
    })
}

function logout() {
        localStorage.removeItem('jwt_token');
        location.reload();
}

function initRecorder() {
    const record = document.querySelector('#record-button');
    const stop = document.querySelector('#stop-button');
    const soundClips = document.querySelector('.sound-clips');
    let mediaRecorder;
    //stores audio data 
    let chunks = [];

    // RECORDING FORM 
    const createRecordingForm = document.querySelector("#create-recording-form");
    //here we are creating a submit event on form by attaching submit event listener 
    createRecordingForm.addEventListener('submit', (e) => createFormHandler(e))

    //this is our formhandler that takes our createRecordingForm event listener which gathers all of the input values and passes it to a function to execute the post fetch 
    //grab ID from jwt_token 
    function createFormHandler(e) {
        e.preventDefault()   
        const audioName = document.querySelector('#audio-name').value 
        const idUser = localStorage.getItem('jwt_token')  
         blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
         blobToDataURL(blob, function(dataurl){
            sendAudioToServer(audioName, idUser, dataurl);
         });    
    }

    //**blob to dataURL**
    function blobToDataURL(blob, callback) {
        var a = new FileReader();
        a.onload = function(e) {callback(e.target.result);}
        a.readAsDataURL(blob);
    }


    function sendAudioToServer(nameAudio, userId, audioData) {
        const formData = new FormData;
        //audio_url should be audioData
        const recordingObj = JSON.stringify({ title: nameAudio, user_id: userId, audio_url: audioData });
        console.log(recordingObj);
        formData.append('recording', recordingObj);
        return fetch(endPoint, {
          method: 'POST',
          headers: {"Content-Type": "application/json"},
          body: recordingObj
        })
        .then(response => response.json())
        .then(recording => {
            location.reload();
        })
    }  
  
    // navigator object is included in the browser - chrome, safari, firefox . Here we are grabbing the audio recorder utility in the browser and checking if it exists. 
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        console.log('getUserMedia supported.');

        navigator.mediaDevices.getUserMedia (
           // constraints - only audio needed for this app
           {
              audio: true
           })
     
           // Success callback. Gives us access to stream. 
           .then(function(stream) {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = function(e) {
                chunks.push(e.data);
            };
            mediaRecorder.onstop = function(e) {
                console.log("recorder stopped");
                
                // const userName = prompt('Enter user name');
                // const clipName = prompt('Enter a name for your sound clip');
                
                const clipContainer = document.createElement('article');
                const clipLabel = document.createElement('p');
                const userLabel = document.createElement('h1');
                const audio = document.createElement('audio');

                // const deleteButton only deletes downloaded file on frontend  
                // const deleteButton = document.createElement('button');
                // const saveButton = document.createElement('button');
                
                // userLabel.innerHTML = userName;
                // clipLabel.innerHTML = clipName;
                clipContainer.classList.add('clip');
                audio.setAttribute('controls', '');
                // deleteButton.innerHTML = "Delete";
                // saveButton.innerHTML = "Save";
                
                clipContainer.appendChild(userLabel);
                clipContainer.appendChild(clipLabel);
                clipContainer.appendChild(audio);
                // clipContainer.appendChild(deleteButton);
                // clipContainer.appendChild(saveButton);
                soundClips.appendChild(clipContainer);
                
                const blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' })
                const audioURL = window.URL.createObjectURL(blob);

                // var a = document.createElement("a");
                // a.href = audioURL;
                // a.download = "audio.wav";
                // a.click();
                // console.log(audioURL);

                audio.src = audioURL;
                
                // deleteButton.onclick = function(e) {
                //     let evtTgt = e.target;
                //     evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
                // }

            }
            }
           )
     
           // Error callback
           .catch(function(err) {
              console.log('The following getUserMedia error occurred: ' + err);
           }
        );
     } else {
        console.log('getUserMedia not supported on your browser!');
     };



    //DELETE *REFACTOR*
    // const deleteButton = document.getElementById("delete-button");
    // deleteButton.addEventListener('click', e => {
    //     console.log('clicked');
    //     // const id = parseInt(e.target.dataset.id);
    //     // const recording = Recording.findById(id);
    //     // console.log(recording);
    //     // document.querySelector('#update-recording').innerHTML = recording.renderUpdateForm();
    //     //solution for inner edit form needs to be nested 
    //     // e.target.innerHTML = recording.renderUpdateForm();
    // });
     

     record.onclick = function() {
         //preventDefault: preventing the default functionality that makes buttons refresh page 
        mediaRecorder.start();
        console.log(mediaRecorder.state);
        console.log("recorder started");
        record.style.background = "red";
        record.style.color = "black";
      };

      stop.onclick = function() {
        mediaRecorder.stop();
        console.log(mediaRecorder.state);
        console.log("recorder stopped");
        record.style.background = "";
        record.style.color = "";
        };
    }


//make a call to our API backend 
function getRecordings() {
       //AJAX fetch request 
       fetch(endPoint)
       //using response JSON to append elements to the DOM 
       //.then returns promises.  If the promise is fulfilled or rejected THEN the handler function will be called asynchronously (scheduled in the thread loop).
       .then(response => response.json()
       .then(recordings => {
           //this is where we show our data 
           //call recordings.data.forEach because data is nested in the jsonserializer  
           recordings.data.forEach(recording => {
                //creating a new instance of recording class by passing in recording object from recording.js
                //args pass attributes to recording class
                const recordingData = recording.attributes.audio.record
                const newRecording = new Recording(parseInt(recording.id), recordingData.title, recordingData.audio_url, recording.attributes.user.name); 
                //updating the inner html with id recording-container to show data from Recording Card in recording.js
                document.querySelector('#recording-container').innerHTML += newRecording.renderRecordingCard();
           });

           loadRecordingEvents()
       }))
}

