const audioPlayer = document.getElementById('audioPlayer');
let currentVinyl = null;
let currentTonearm = null;

document.querySelectorAll('.vinyl').forEach((vinyl, index) => {
  vinyl.addEventListener('click', () => {
    const tonearm = document.getElementById(`tonearm${index+1}`);
    const audioSrc = vinyl.dataset.audio;

    if (currentVinyl && currentVinyl !== vinyl) {
      currentVinyl.classList.remove('rotate');
      currentTonearm.classList.remove('play');
    }

    if (currentVinyl === vinyl && !audioPlayer.paused) {
      audioPlayer.pause();
      vinyl.classList.remove('rotate');
      tonearm.classList.remove('play');
      currentVinyl = null;
      currentTonearm = null;
    } else {
      audioPlayer.src = audioSrc;
      audioPlayer.play().catch(err => {
        console.log("播放失败：", err);
      });
      vinyl.classList.add('rotate');
      tonearm.classList.add('play');
      currentVinyl = vinyl;
      currentTonearm = tonearm;
    }
  });
});

audioPlayer.addEventListener('ended', () => {
  if (currentVinyl) currentVinyl.classList.remove('rotate');
  if (currentTonearm) currentTonearm.classList.remove('play');
});