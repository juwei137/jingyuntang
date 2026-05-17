// JavaScript Document
const audio = new Audio("../audios/bwbj.mp3");
audio.volume = 0.8;

const playBtn = document.getElementById("playBtn");
const vinyl = document.getElementById("vinyl");
const tonearm = document.getElementById("tonearm");
const progressBar = document.getElementById("progressBar");
const progressBarWrap = document.querySelector(".progress-bar-wrap");
const lyricArea = document.getElementById("lyricArea");
const collectBtn = document.getElementById("collectBtn");
const volumeSlider = document.getElementById("volumeSlider");
const fontsizeSlider = document.getElementById("fontsizeSlider");
const downloadBtn = document.getElementById("downloadBtn");
const currentTimeEl = document.getElementById("currentTime");
const totalTimeEl = document.getElementById("totalTime");

let isPlaying = false;

const lyricTime = [0, 28, 68, 95, 124, 146, 177, 196];
const lyricLines = document.querySelectorAll(".lyric-line");

// 当前歌曲信息
const currentSong = {
    name: "霸王别姬",
    artist: "梅兰芳",
    type: "梅派经典",
    audioSrc: "../audios/bwbj.mp3"
};

function formatTime(s) {
    let m = Math.floor(s / 60);
    let sec = Math.floor(s % 60);
    return (m < 10 ? "0" + m : m) + ":" + (sec < 10 ? "0" + sec : sec);
}

audio.addEventListener("loadedmetadata", function(){
    totalTimeEl.innerText = formatTime(audio.duration);
});

playBtn.onclick = function () {
    if (isPlaying) {
        audio.pause();
        vinyl.classList.remove("rotate");
        tonearm.classList.remove("play");
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    } else {
        audio.play();
        vinyl.classList.add("rotate");
        tonearm.classList.add("play");
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }
    isPlaying = !isPlaying;
};

audio.ontimeupdate = function () {
    if(!audio.duration) return;
    let per = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = per + "%";
    currentTimeEl.innerText = formatTime(audio.currentTime);
    syncLyric(audio.currentTime);
};

function setProgress(e) {
    if (!audio.duration) return;
    let rect = progressBarWrap.getBoundingClientRect();
    let x = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    let percent = (x - rect.left) / rect.width;
    percent = Math.max(0, Math.min(1, percent));
    audio.currentTime = percent * audio.duration;
}
progressBarWrap.addEventListener("mousedown", setProgress);
progressBarWrap.addEventListener("mousemove", (e) => e.buttons === 1 && setProgress(e));
progressBarWrap.addEventListener("touchstart", setProgress);
progressBarWrap.addEventListener("touchmove", setProgress);

function syncLyric(t) {
    let idx = 0;
    for(let i = 0; i < lyricTime.length; i++){
        if(t >= lyricTime[i]){
            idx = i;
        } else {
            break;
        }
    }
    lyricLines.forEach(line => line.classList.remove("active"));
    const activeLine = lyricLines[idx];
    if (activeLine) activeLine.classList.add("active");
    
    if (activeLine) {
        const areaTop = lyricArea.scrollTop;
        const areaH = lyricArea.clientHeight;
        const lineTop = activeLine.offsetTop;
        const lineH = activeLine.offsetHeight;
        if (lineTop + lineH > areaTop + areaH - 60) {
            lyricArea.scrollTop = lineTop - areaH + 120;
        }
    }
}

volumeSlider.oninput = function () {
    audio.volume = this.value / 100;
};

// 获取当前登录用户
function getCurrentUser() {
    return localStorage.getItem("currentUser") || localStorage.getItem("username");
}

// 更新收藏按钮状态
function updateCollectButtonState() {
    const user = getCurrentUser();
    if (user) {
        const favorites = JSON.parse(localStorage.getItem(`favorites_${user}`) || '[]');
        const isFavorited = favorites.some(fav => fav.name === currentSong.name);
        if (isFavorited) {
            collectBtn.classList.add("active");
            collectBtn.innerHTML = '<i class="fas fa-heart"></i>';
        } else {
            collectBtn.classList.remove("active");
            collectBtn.innerHTML = '<i class="far fa-heart"></i>';
        }
    } else {
        collectBtn.classList.remove("active");
        collectBtn.innerHTML = '<i class="far fa-heart"></i>';
    }
}

// 切换收藏状态
function toggleFavorite() {
    const user = getCurrentUser();
    if (!user) {
        if (typeof window.showLoginModal === 'function') {
            window.showLoginModal(function(success) {
                if (success) {
                    toggleFavorite();
                }
            }, "收藏歌曲需要登录");
        } else {
            alert("请先登录后收藏");
            window.location.href = '个人中心.html';
        }
        return;
    }
    
    const favoritesKey = `favorites_${user}`;
    let favorites = JSON.parse(localStorage.getItem(favoritesKey) || '[]');
    const existingIndex = favorites.findIndex(fav => fav.name === currentSong.name);
    
    if (existingIndex === -1) {
        favorites.push({
            name: currentSong.name,
            artist: currentSong.artist,
            type: currentSong.type,
            audioSrc: currentSong.audioSrc,
            time: new Date().toLocaleString()
        });
        collectBtn.classList.add("active");
        collectBtn.innerHTML = '<i class="fas fa-heart"></i>';
        alert(`已收藏《${currentSong.name}》`);
    } else {
        favorites.splice(existingIndex, 1);
        collectBtn.classList.remove("active");
        collectBtn.innerHTML = '<i class="far fa-heart"></i>';
        alert(`已取消收藏《${currentSong.name}》`);
    }
    
    localStorage.setItem(favoritesKey, JSON.stringify(favorites));
}

collectBtn.onclick = function() {
    toggleFavorite();
};

fontsizeSlider.oninput = function(){
    lyricArea.style.fontSize = this.value + "px";
};

downloadBtn.onclick = function() {
    if (typeof window !== 'undefined' && window.checkDownloadPermission) {
        window.checkDownloadPermission("霸王别姬-梅兰芳.mp3", audio.src);
    } else {
        const user = getCurrentUser();
        if (user) {
            const a = document.createElement('a');
            a.href = audio.src;
            a.download = "霸王别姬-梅兰芳.mp3";
            a.click();
        } else {
            alert("请先登录后下载");
        }
    }
};

audio.onended = function () {
    vinyl.classList.remove("rotate");
    tonearm.classList.remove("play");
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    isPlaying = false;
    lyricLines.forEach(l => l.classList.remove("active"));
    progressBar.style.width = "0%";
    currentTimeEl.innerText = "00:00";
    lyricArea.scrollTop = 0;
};

// 页面加载时检查收藏状态
window.addEventListener('DOMContentLoaded', function() {
    updateCollectButtonState();
});