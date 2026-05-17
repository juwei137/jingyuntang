// JavaScript Document
const images = {
  face: [
    "../images/lp1.JPG", "../images/lp2.JPG", "../images/lp3.JPG", "../images/lp4.JPG",
    "../images/lp5.JPG", "../images/lp6.JPG", "../images/lp7.JPG", "../images/lp8.JPG",
    "../images/lp9.JPG", "../images/lp10.JPG", "../images/lp11.JPG", "../images/lp12.JPG",
    "../images/lp13.JPG", "../images/lp14.JPG", "../images/lp15.JPG", "../images/lp16.JPG",
    "../images/lp17.JPG", "../images/lp18.JPG", "../images/lp19.JPG", "../images/lp20.JPG",
    "../images/lp21.JPG", "../images/lp22.JPG", "../images/lp23.JPG", "../images/lp24.JPG",
    "../images/lp25.JPG", "../images/lp26.JPG", "../images/lp27.JPG", "../images/lp28.JPG",
    "../images/lp29.JPG", "../images/lp30.JPG", "../images/lp31.JPG", "../images/lp32.JPG",
    "../images/lp33.JPG", "../images/lp34.JPG", "../images/lp35.JPG", "../images/lp36.JPG",
    "../images/lp37.JPG", "../images/lp38.JPG", "../images/lp39.JPG", "../images/lp40.JPG",
    "../images/lp41.JPG", "../images/lp42.JPG", "../images/lp43.JPG", "../images/lp44.JPG",
    "../images/lp45.JPG", "../images/lp46.JPG", "../images/lp47.JPG", "../images/lp48.JPG",
    "../images/lp49.JPG", "../images/lp50.JPG", "../images/lp51.JPG", "../images/lp52.JPG",
    "../images/lp53.JPG", "../images/lp54.JPG"
  ],
  cap: [
    "../images/mao1.JPG", "../images/mao2.JPG", "../images/mao3.JPG", "../images/mao4.JPG",
    "../images/mao5.JPG", "../images/mao6.JPG", "../images/mao7.JPG", "../images/mao8.JPG",
    "../images/mao9.JPG", "../images/mao10.JPG", "../images/mao11.JPG", "../images/mao12.JPG",
    "../images/mao13.JPG", "../images/mao14.JPG", "../images/mao15.JPG", "../images/mao16.JPG",
    "../images/mao17.JPG", "../images/mao18.JPG", "../images/mao19.JPG", "../images/mao20.JPG",
    "../images/mao21.JPG", "../images/mao22.JPG", "../images/mao23.JPG", "../images/mao24.JPG",
    "../images/mao25.JPG", "../images/mao26.JPG", "../images/mao27.JPG", "../images/mao28.JPG",
    "../images/mao29.JPG", "../images/mao30.JPG", "../images/mao31.JPG", "../images/mao32.JPG",
    "../images/mao33.JPG", "../images/mao34.JPG", "../images/mao35.JPG", "../images/mao36.JPG",
    "../images/mao37.JPG", "../images/mao38.JPG", "../images/mao39.JPG", "../images/mao40.JPG",
    "../images/mao41.JPG", "../images/mao42.JPG", "../images/mao43.JPG", "../images/mao44.JPG",
    "../images/mao45.JPG", "../images/mao46.JPG", "../images/mao47.JPG", "../images/mao48.JPG",
    "../images/mao49.JPG", "../images/mao50.JPG", "../images/mao51.JPG", "../images/mao52.JPG"
  ],
  role: [
    "../images/juese1.JPG", "../images/juese2.JPG", "../images/juese3.JPG", "../images/juese4.JPG",
    "../images/juese5.JPG", "../images/juese6.JPG", "../images/juese7.JPG", "../images/juese8.JPG",
    "../images/juese9.JPG", "../images/juese10.JPG", "../images/juese11.JPG", "../images/juese12.JPG",
    "../images/juese13.JPG", "../images/juese14.JPG", "../images/juese15.JPG", "../images/juese16.JPG",
    "../images/juese17.JPG", "../images/juese18.JPG", "../images/juese19.JPG", "../images/juese20.JPG",
    "../images/juese21.JPG", "../images/juese22.JPG", "../images/juese23.JPG", "../images/juese24.JPG",
    "../images/juese25.JPG", "../images/juese26.JPG", "../images/juese27.JPG", "../images/juese28.JPG",
    "../images/juese29.JPG", "../images/juese30.JPG", "../images/juese31.JPG", "../images/juese32.JPG",
    "../images/juese33.JPG", "../images/juese34.JPG", "../images/juese35.JPG", "../images/juese36.JPG",
    "../images/juese37.JPG", "../images/juese38.JPG", "../images/juese39.JPG", "../images/juese40.JPG",
    "../images/juese41.JPG", "../images/juese42.JPG", "../images/juese43.JPG", "../images/juese44.JPG",
    "../images/juese45.JPG", "../images/juese46.JPG", "../images/juese47.JPG", "../images/juese48.JPG",
    "../images/juese49.JPG", "../images/juese50.JPG", "../images/juese51.JPG"
  ]
};

let gameMode = "", selectTypeName = "", first = null, lock = false, match = 0, step = 0, time = 0, timer, totalPairs = 0, cardList = [];
let currentGameSize = 6; // 记录当前游戏难度尺寸

function goMode(m) {
  gameMode = m;
  document.getElementById("modePage").style.display = "none";
  if (m == "all") {
    document.getElementById("levelPage").style.display = "block";
  } else {
    document.getElementById("typePage").style.display = "block";
  }
}

function selectType(t) {
  selectTypeName = t;
  document.getElementById("typePage").style.display = "none";
  document.getElementById("levelPage").style.display = "block";
}

function backToMode() {
  if (timer) clearInterval(timer);
  document.getElementById("modePage").style.display = "block";
  document.getElementById("typePage").style.display = "none";
  document.getElementById("levelPage").style.display = "none";
  document.getElementById("gamePage").style.display = "none";
}

function startGame(size) {
  currentGameSize = size; // 保存尺寸
  document.getElementById("levelPage").style.display = "none";
  document.getElementById("gamePage").style.display = "block";
  totalPairs = (size * size) / 2;
  reset();
  
  let pool;
  if (gameMode == "all") {
    pool = [...images.face, ...images.cap, ...images.role];
  } else {
    pool = [...images[selectTypeName]];
  }
  
  let selected = [];
  while (selected.length < totalPairs) {
    selected.push(pool[Math.floor(Math.random() * pool.length)]);
  }
  cardList = [...selected, ...selected];
  shuffle(cardList);
  const board = document.getElementById("board");
  board.style.gridTemplateColumns = `repeat(${size},70px)`;
  document.getElementById("total").innerText = totalPairs;
  renderCards();
  startTimer();
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
}

function renderCards() {
  const board = document.getElementById("board");
  board.innerHTML = "";
  cardList.forEach(img => {
    const c = document.createElement("div");
    c.className = "poker";
    c.dataset.img = img;
    c.innerHTML = `
      <div class="poker-face poker-back"></div>
      <div class="poker-face poker-front">
        <img src="${img}">
      </div>
    `;
    c.onclick = flip;
    board.appendChild(c);
  });
}

function flip() {
  const t = this;
  if (lock || t === first || t.classList.contains("flipped")) return;
  t.classList.add("flipped");
  step++;
  document.getElementById("step").innerText = step;
  if (!first) { first = t; return; }
  lock = true;
  if (first.dataset.img === t.dataset.img) {
    setTimeout(() => {
      first.classList.add("matched");
      t.classList.add("matched");
      match++;
      document.getElementById("now").innerText = match;
      if (match === totalPairs) win();
      first = null;
      lock = false;
    }, 400);
  } else {
    setTimeout(() => {
      first.classList.remove("flipped");
      t.classList.remove("flipped");
      first = null;
      lock = false;
    }, 800);
  }
}

function getCurrentGameUser() {
  return localStorage.getItem("currentUser") || localStorage.getItem("username");
}

// 根据尺寸获取难度名称
function getLevelBySize(size) {
  if (size === 6) return "简单";
  if (size === 8) return "中等";
  if (size === 10) return "困难";
  return "中等";
}

// 保存游戏记录
function saveGameRecordToStorage() {
  const user = getCurrentGameUser();
  if (!user) return false;
  
  const levelName = getLevelBySize(currentGameSize);
  
  let modeName = "";
  if (gameMode === 'all') {
    modeName = "混合模式";
  } else {
    if (selectTypeName === 'face') modeName = "脸谱模式";
    else if (selectTypeName === 'cap') modeName = "戏帽模式";
    else if (selectTypeName === 'role') modeName = "角色模式";
  }
  
  const recordsKey = `game_record_${user}`;
  let records = JSON.parse(localStorage.getItem(recordsKey) || '[]');
  
  const newRecord = {
    date: new Date().toLocaleString(),
    mode: modeName,
    type: selectTypeName || (gameMode === 'all' ? 'mix' : ''),
    level: levelName,
    steps: step,
    time: time,
    pairs: totalPairs,
    size: currentGameSize
  };
  
  records.unshift(newRecord);
  if (records.length > 50) records = records.slice(0, 50);
  localStorage.setItem(recordsKey, JSON.stringify(records));
  console.log("保存记录:", newRecord);
  return true;
}

function win() {
  if (timer) clearInterval(timer);
  document.getElementById("winBox").style.display = "flex";
  document.getElementById("s").innerText = step;
  document.getElementById("t").innerText = time;
  
  const user = getCurrentGameUser();
  if (user) {
    saveGameRecordToStorage();
  }
}

function startTimer() {
  timer = setInterval(() => {
    time++;
    document.getElementById("time").innerText = time;
  }, 1000);
}

function reset() {
  match = 0;
  step = 0;
  time = 0;
  first = null;
  lock = false;
  document.getElementById("now").innerText = 0;
  document.getElementById("step").innerText = 0;
  document.getElementById("time").innerText = 0;
  if (timer) clearInterval(timer);
}