//this is our get request to the recording#index in our rails backend server
const endPoint = "http://localhost:3000/api/v1/recordings"
let blob
//fetching recordings 
document.addEventListener('DOMContentLoaded', () => {
    initRecorder();
    getRecordings();
});

function initRecorder() {
    const record = document.querySelector('#record-button');
    const stop = document.querySelector('#stop-button');
    const soundClips = document.querySelector('.sound-clips');
    let mediaRecorder;
    //stores audio data 
    let chunks = [];

    //this is our formhandler that takes our createRecordingForm event listener which gathers all of the input values and passes it to a function to execute the post fetch 
    function createFormHandler(e) {
        e.preventDefault()   
        const audioName = document.querySelector('#audio-name').value 
        // const userId = parseInt(document.querySelector('#users').value)
         blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
         blobToDataURL(blob, function(dataurl){
            sendAudioToServer(audioName, 23, dataurl);
         });    
    }

     //**dataURL to blob**
    //  function dataURLtoBlob(dataurl) {
    //     var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
    //         bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    //     while(n--){
    //         u8arr[n] = bstr.charCodeAt(n);
    //     }
    //     return new Blob([u8arr], {type:mime});
    // }

    //**blob to dataURL**
    function blobToDataURL(blob, callback) {
        var a = new FileReader();
        a.onload = function(e) {callback(e.target.result);}
        a.readAsDataURL(blob);
    }


    function sendAudioToServer(nameAudio, userId, audioData) {
        const formData = new FormData();
        //audio_url should be audioData
        const recordingObj = JSON.stringify({ title: nameAudio, user_id: userId, audio_url: audioData });
        console.log(recordingObj);
        formData.append('recording', recordingObj);
        return fetch(endPoint, {
          method: 'POST',
          body: formData
        });
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
                const deleteButton = document.createElement('button');
                const saveButton = document.createElement('button');
                
                // userLabel.innerHTML = userName;
                // clipLabel.innerHTML = clipName;
                clipContainer.classList.add('clip');
                audio.setAttribute('controls', '');
                deleteButton.innerHTML = "Delete";
                saveButton.innerHTML = "Save";
                
                clipContainer.appendChild(userLabel);
                clipContainer.appendChild(clipLabel);
                clipContainer.appendChild(audio);
                clipContainer.appendChild(deleteButton);
                clipContainer.appendChild(saveButton);
                soundClips.appendChild(clipContainer);
                
                const blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' })
                const audioURL = window.URL.createObjectURL(blob);

                // var a = document.createElement("a");
                // a.href = audioURL;
                // a.download = "audio.wav";
                // a.click();
                // console.log(audioURL);

                audio.src = audioURL;
                
                deleteButton.onclick = function(e) {
                    let evtTgt = e.target;
                    evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
                }

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

     
     const createRecordingForm = document.querySelector("#create-recording-form");
    //here we are creating a submit event on form by attaching submit event listener 
    createRecordingForm.addEventListener('submit', (e) => createFormHandler(e))

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


//this is our get function to make a call to our API backend 
function getRecordings() {
       //AJAX fetch request 
       fetch(endPoint)
       //using response JSON to append elements to the DOM 
       //.then returns promises.  If the promise is fulfilled or rejected THEN the handler function will be called asynchronously (scheduled in the thread loop).
       .then(response => response.json()
       .then(recordings => {
           //this is where we show our data 
           //call users.data.forEach because data is nested in the jsonserializer  
           recordings.data.forEach(recording => {
            //creating a new instance of recording class by passing in recording object from recording.js
            //args pass attributes to recording class
            console.log(recording);
            const recordingData = recording.attributes.audio.record
            const newRecording = new Recording(parseInt(recording.id), recordingData.title, recordingData.audio_url, recording.attributes.user.name); 
            console.log(newRecording);

             //updating the inner html with id recording-container to show data from Recording Card in recording.js
            document.querySelector('#recording-container').innerHTML += newRecording.renderRecordingCard()
            // debugger
            // render(recording)
           });
       }))
}

