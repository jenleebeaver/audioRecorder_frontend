class Recording {

    constructor(recording, recordingAttributes){
        this.id = recording.id;
        this.title = recordingAttributes.title;
        this.audio_url = recordingAttributes.audio_url;
        this.user = recordingAttributes.user.name;
    }
}