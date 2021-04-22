class Recording {

    constructor(id, title, audio_url, user_name){
        this.id = id;
        this.title = title;
        this.audio_url = audio_url;
        this.user = user_name;
        Recording.all.push(this);
    }  

    renderRecordingCard() {
        return `
            <div data-id=${this.id}>
                <h3>${this.title}</h3> 
                <p>${this.user}</p>
                <p>${this.audio_url}</p>
                <br/>
                <button class="edit-btn" data-id=${this.id}>edit</button>
                <button id="delete-button" data-id=${this.id}>DELETE</button>
            </div>
            </br>`;
    }

    //utility method 
    static findById(id) {
        return this.all.find(recording => recording.id === id);
    }

    // NOTE: this.audio_url to blob 
    //  **dataURL to blob**
    dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type:mime});
    }

    renderUpdateForm() {
        return `
        <form class="edit-container" data-id=${this.id} style="width: 360px; height: scroll;">
            </br>
            <h1>Edit Your Recording</h1>

            <label>Title:</label>
            </br>
            <input id='input-title' type="text" name="title" value="${this.title}">
            <br/>
            <br/>

            <label>Audio Data:</label>
            </br>
            <input id='input-data' type="text" name="audio_url" value="${this.audio_url}">
            <br/>
            <br/>

            <input id='edit-button' type="submit" value="Edit Recording">    
        </form>
        `;
    }
}

Recording.all = [];