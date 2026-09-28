Bg video · JS
// bg-video.js — background video controller for catering.html
// One video: loops forever. Several videos: plays them in order and crossfades.
 
document.addEventListener('DOMContentLoaded', function () {
    const bgVideos = document.querySelectorAll('.site-bg-video');
    if (!bgVideos.length) return;
 
    // Single video: loop it
    if (bgVideos.length === 1) {
        bgVideos[0].loop = true;
        bgVideos[0].play().catch(() => {});
        return;
    }
 
    // Several videos: cycle through them
    let currentIndex = 0;
 
    function playNext() {
        const current = bgVideos[currentIndex];
        const nextIndex = (currentIndex + 1) % bgVideos.length;
        const next = bgVideos[nextIndex];
 
        next.currentTime = 0;
        next.play().catch(() => {});
 
        // Crossfade (opacity transition is in style.css)
        next.classList.add('active');
        current.classList.remove('active');
 
        // Stop the old one after the fade so only one video decodes at a time
        setTimeout(() => current.pause(), 1600);
 
        currentIndex = nextIndex;
    }
 
    bgVideos.forEach((video, i) => {
        video.loop = false; // so the 'ended' event fires
        video.addEventListener('ended', () => {
            if (i === currentIndex) playNext();
        });
    });
 
    // Only the visible video starts playing; the others wait with preload="auto"
    bgVideos[currentIndex].play().catch(() => {});
});
 
