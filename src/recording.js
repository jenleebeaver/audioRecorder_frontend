class Recording {

    constructor(id, title, audio_url, user_name){
        this.id = id;
        this.title = title;
        this.audio_url = audio_url;
        this.user = user_name;
        Recording.all.push(this);
        // debugger
    }  

    renderRecordingCard() {
        // debugger
        return `
            <div data-id=${this.id}>
                <h1>${this.title}</h1> 
                <h2>${this.user}</h2>
                <a>${this.audio_url}</a>
                <br/>
                <button data-id=${this.id}>edit</button>
            </div>
            </br>`;
    }

    //utility method 
    static findById(id) {
        return this.all.find(recording => recording.id === id);
    }

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
        <form data-id=${this.id}>
            <h3>Edit Your Recording</h3>

            <label>Title:</label>
            <input id='input-title' type="text" name="title" value="${this.title}">
            <br/>
            <br/>

            <label>Audio Data:</label>
            <input id='input-data' type="text" name="audio_url" value="${this.audio_url}">
            <br/>
            <br/>

            <input id='edit-button' type="submit" value="Edit Recording">  
            <input id='delete-button' type="submit" value="Delete Recording">   
        </form>
        `;
    }
}

Recording.all = [];