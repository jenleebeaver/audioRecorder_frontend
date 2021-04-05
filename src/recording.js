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
}

Recording.all = [];