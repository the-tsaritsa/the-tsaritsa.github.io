const patchDates = {
    '7.3': new Date('2026-12-16T00:00:00Z')
};

const timelinePatches = [
    { id: '6.6', date: new Date('2026-05-27T00:00:00Z') },
    { id: '6.7', date: new Date('2026-07-01T00:00:00Z') },
    { id: '7.0', date: new Date('2026-08-12T00:00:00Z') },
    { id: '7.1', date: new Date('2026-09-23T00:00:00Z') },
    { id: '7.2', date: new Date('2026-11-04T00:00:00Z') },
    { id: '7.3', date: new Date('2026-12-16T00:00:00Z') }
];

let currentPatch = '7.3';

function updateCountdown() {
    const target = patchDates[currentPatch];
    const now = new Date();
    const diff = target - now;

    if (diff <= 0) {
        document.getElementById('days').textContent = '000';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = days.toString().padStart(3, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
}

function updateReleaseDate() {
    const target = patchDates[currentPatch];
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('release-date').textContent = 
        target.toLocaleDateString('en-US', options);
}

function updateTimeline() {
    const now = new Date();
    const nodes = document.querySelectorAll('.timeline-node');
    const track = document.getElementById('timeline-track');
    
    let currentIndex = 0;
    for (let i = timelinePatches.length - 1; i >= 0; i--) {
        if (now >= timelinePatches[i].date) {
            currentIndex = i;
            break;
        }
    }

    nodes.forEach((node, index) => {
        node.classList.remove('current', 'passed');
        if (index === currentIndex) {
            node.classList.add('current');
        } else if (index < currentIndex) {
            node.classList.add('passed');
        }
    });

    const progress = (currentIndex / (timelinePatches.length - 1)) * 100;
    track.style.setProperty('--progress', `${progress}%`);
}

document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('bg-video');
    const poster = document.getElementById('poster');
    const audio = document.getElementById('background-audio');
    audio.volume = 0.3;

    video.addEventListener('canplaythrough', () => {
        poster.classList.add('hidden');
    });

    const audioBtn = document.getElementById('toggle-audio');
    let audioPlaying = false;

    // Try to autoplay audio
    audio.play().then(() => {
        audioPlaying = true;
        audioBtn.textContent = '🔇 Toggle Audio';
    }).catch(() => {
        audioPlaying = false;
    });

    audioBtn.addEventListener('click', () => {
        if (audioPlaying) {
            audio.pause();
            audioBtn.textContent = '🔊 Toggle Audio';
            audioPlaying = false;
        } else {
            audio.play().then(() => {
                audioPlaying = true;
                audioBtn.textContent = '🔇 Toggle Audio';
            });
        }
    });

    const videoBtn = document.getElementById('toggle-video');
    let videoVisible = true;

    videoBtn.addEventListener('click', () => {
        if (videoVisible) {
            video.classList.add('hidden');
        } else {
            video.classList.remove('hidden');
        }
        videoVisible = !videoVisible;
    });

    setInterval(updateCountdown, 1000);
    updateCountdown();
    updateReleaseDate();
    updateTimeline();

    // Check if user previously enabled audio
    if (localStorage.getItem('audioEnabled') === 'true') {
        audio.play().then(() => {
            audioPlaying = true;
            audioBtn.textContent = '🔇 Toggle Audio';
        }).catch(() => {
            audioPlaying = false;
        });
    }

    // Save preference when user clicks audio toggle
    audioBtn.addEventListener('click', () => {
        localStorage.setItem('audioEnabled', audioPlaying.toString());
    });
});
