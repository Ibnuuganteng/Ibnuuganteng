const videoPlayer = document.getElementById('videoPlayer');

// Update time display
videoPlayer.addEventListener('loadedmetadata', () => {
    document.getElementById('totalDuration').textContent = formatTime(videoPlayer.duration);
});

videoPlayer.addEventListener('timeupdate', () => {
    document.getElementById('currentTime').textContent = formatTime(videoPlayer.currentTime);
});

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function loadVideo(event) {
    const videoFile = event.target.files[0];
    if (videoFile) {
        const videoURL = URL.createObjectURL(videoFile);
        videoPlayer.src = videoURL;
        videoPlayer.play();
    }
}

function setVolume(value) {
    videoPlayer.volume = value;
}

function setPlaybackSpeed(value) {
    videoPlayer.playbackRate = value;
}

function setResolution(value) {
    const videoSrcMap = {
        "720p": "path/to/video_720p.mp4",
        "1080p": "path/to/video_1080p.mp4",
        "4k": "path/to/video_4k.mp4"
    };
    const videoSrc = videoSrcMap[value];
    if (videoSrc) {
        videoPlayer.src = videoSrc;
        videoPlayer.play();
    }
}

document.getElementById('downloadButton').onclick = function() {
    const videoSrc = videoPlayer.src;
    const link = document.createElement('a');
    link.href = videoSrc;
    link.download = 'video.mp4'; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

document.getElementById('shareButton').onclick = function() {
    const videoSrc = videoPlayer.src;
    if (navigator.share) {
        navigator.share({
            title: 'Tonton Video Ini!',
            text: 'Video menarik yang saya tonton.',
            url: videoSrc
        }).then(() => {
            console.log('Video dibagikan');
        }).catch(error => {
            console.log('Gagal membagikan:', error);
        });
    } else {
        prompt("Salin link ini untuk dibagikan:", videoSrc);
    }
};

function postComment() {
    const comment = document.getElementById('commentInput').value;
    if (comment) {
        const commentDiv = document.createElement('div');
        commentDiv.textContent = comment;
        document.getElementById('commentsList').appendChild(commentDiv);
        document.getElementById('commentInput').value = '';
        alert("Komentar berhasil diposting!");
    }
}

let playlist = [];

function addToPlaylist() {
    const videoSrc = videoPlayer.src;
    const videoTitle = videoPlayer.querySelector('source').getAttribute('data-title');

    if (!playlist.some(video => video.src === videoSrc)) {
        playlist.push({ src: videoSrc, title: videoTitle });
        updatePlaylist();
    }
}

function updatePlaylist() {
    const playlistDiv = document.getElementById('playlist');
    playlistDiv.innerHTML = '';
    playlist.forEach(video => {
        const listItem = document.createElement('div');
        const thumbnail = document.createElement('img');
        thumbnail.src = `https://via.placeholder.com/50?text=${video.title.charAt(0)}`;
        thumbnail.className = 'thumbnail';
        listItem.appendChild(thumbnail);
        
        const title = document.createTextNode(video.title);
        listItem.appendChild(title);
        
        playlistDiv.appendChild(listItem);
    });
}

function filterPlaylist() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filteredPlaylist = playlist.filter(video => video.title.toLowerCase().includes(query));
    const playlistDiv = document.getElementById('playlist');
    playlistDiv.innerHTML = '';

    filteredPlaylist.forEach(video => {
        const listItem = document.createElement('div');
        listItem.textContent = video.title;
        playlistDiv.appendChild(listItem);
    });
}
