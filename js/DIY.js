const canvasContainer = document.querySelector('.canvas-container');
let W, H;

function resizeCanvases() {
    W = canvasContainer.clientWidth;
    H = canvasContainer.clientHeight;
    outlineCanvas.width = refCanvas.width = drawCanvas.width = arCanvas.width = W;
    outlineCanvas.height = refCanvas.height = drawCanvas.height = arCanvas.height = H;
    drawFixedOutline();
    if (currentTemplateId !== 'custom') {
        loadRefImage(currentTemplateId);
    }
}

const outlineCanvas = document.getElementById('outlineCanvas');
const refCanvas = document.getElementById('refCanvas');
const drawCanvas = document.getElementById('drawCanvas');
const arCanvas = document.getElementById('arCanvas');

let outlineCtx, refCtx, ctx, arCtx;

let isDrawing = false;
let currentTool = 'brush';
let currentColor = '#dc2626';
let currentSize = 8;
let refOpacity = 0.3;
let refScale = 1;
let isOutlineShow = true;
let currentTemplateId = 4;
let currentTemplateName = '孙悟空';
let currentTemplateUrl = "../images/swk.jpg";
let faceOutlineMode = 'full';

let historyStack = [];
let isUndoRedo = false;

const faceTemplates = {
    1: { url: "../images/gy.png", name: "关羽", desc: "忠勇侠义" },
    2: { url: "../images/cc.jpg", name: "曹操", desc: "奸诈多疑" },
    3: { url: "../images/bc.jpg", name: "包拯", desc: "刚直不阿" },
    4: { url: "../images/swk.jpg", name: "孙悟空", desc: "神通广大" },
    5: { url: "../images/ded.jpg", name: "窦尔敦", desc: "勇猛豪爽" },
    6: { url: "../images/zf.png", name: "张飞", desc: "勇猛忠诚" }
};

function initContexts() {
    outlineCtx = outlineCanvas.getContext('2d');
    refCtx = refCanvas.getContext('2d');
    ctx = drawCanvas.getContext('2d');
    arCtx = arCanvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
}

function drawFixedOutline() {
    outlineCtx.clearRect(0,0,W,H);
    if (!isOutlineShow) return;
    outlineCtx.lineWidth = 4;
    outlineCtx.strokeStyle = '#000';
    outlineCtx.beginPath();
    outlineCtx.ellipse(W/2, H/2, 190, 240, 0, 0, Math.PI*2);
    outlineCtx.stroke();

    if(faceOutlineMode === 'full'){
        outlineCtx.fillStyle = '#f0e6d2';
        outlineCtx.beginPath(); outlineCtx.ellipse(W/2-70, H/2-13, 37, 21, 0, 0, Math.PI*2); outlineCtx.fill();
        outlineCtx.beginPath(); outlineCtx.ellipse(W/2+70, H/2-13, 37, 21, 0, 0, Math.PI*2); outlineCtx.fill();
        outlineCtx.fillStyle = '#f0e6d2';
        outlineCtx.beginPath();
        outlineCtx.moveTo(W/2-70, H/2+145);
        outlineCtx.quadraticCurveTo(W/2, H/2+123, W/2+70, H/2+143);
        outlineCtx.quadraticCurveTo(W/2, H/2+173, W/2-70, H/2+143);
        outlineCtx.fill();
    }
}

function switchFaceOutlineMode(){
    faceOutlineMode = faceOutlineMode === 'full' ? 'empty' : 'full';
    drawFixedOutline();
}

function isForbidden(x,y){
    if(faceOutlineMode === 'empty') return false;
    const eye1 = Math.pow(x - (W/2-70),2)/(45*45) + Math.pow(y - (H/2-30),2)/(30*30) <= 1.05;
    const eye2 = Math.pow(x - (W/2+70),2)/(45*45) + Math.pow(y - (H/2-30),2)/(30*30) <= 1.05;
    const mouth = (y >= H/2+120 && y <= H/2+175 && x >= W/2-70 && x <= W/2+70);
    return eye1 || eye2 || mouth;
}

function startDraw(e) {
    ctx.globalCompositeOperation = 'source-over';
    const rect = drawCanvas.getBoundingClientRect();
    const scaleX = drawCanvas.width / rect.width;
    const scaleY = drawCanvas.height / rect.height;
    let x = ((e.touches ? e.touches[0].clientX : e.clientX) - rect.left) * scaleX;
    let y = ((e.touches ? e.touches[0].clientY : e.clientY) - rect.top) * scaleY;
    if (isForbidden(x, y)) { isDrawing = false; return; }
    isDrawing = true;
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function onDraw(e) {
    if (!isDrawing) return;
    const rect = drawCanvas.getBoundingClientRect();
    const scaleX = drawCanvas.width / rect.width;
    const scaleY = drawCanvas.height / rect.height;
    let x = ((e.touches ? e.touches[0].clientX : e.clientX) - rect.left) * scaleX;
    let y = ((e.touches ? e.touches[0].clientY : e.clientY) - rect.top) * scaleY;
    if (isForbidden(x, y)) { ctx.moveTo(x, y); return; }

    if (currentTool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = 'rgba(0,0,0,1)';
    } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = currentColor;
    }
    ctx.lineWidth = currentSize;
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

// ===================== 吸管工具 完美可用 =====================
let isEyedropperActive = false;
const eyedropperTool = document.getElementById('eyedropperTool');
const refImg = document.getElementById('refImg');
const customColor = document.getElementById('customColor');

eyedropperTool.addEventListener('click', () => {
    isEyedropperActive = !isEyedropperActive;
    eyedropperTool.classList.toggle('active', isEyedropperActive);
    document.body.style.cursor = isEyedropperActive ? 'crosshair' : 'default';
});

// 吸画布
drawCanvas.addEventListener('click', (e) => {
    if (!isEyedropperActive) return;
    const rect = drawCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const p = ctx.getImageData(x, y, 1, 1).data;
    setPickColor(rgbToHex(p[0], p[1], p[2]));
});

// 吸参考图
refImg.addEventListener('click', (e) => {
    if (!isEyedropperActive) return;
    e.preventDefault();
    const cvs = document.createElement('canvas');
    const c = cvs.getContext('2d');
    cvs.width = refImg.naturalWidth;
    cvs.height = refImg.naturalHeight;
    c.drawImage(refImg, 0, 0);
    
    const imgRect = refImg.getBoundingClientRect();
    const scaleX = cvs.width / imgRect.width;
    const scaleY = cvs.height / imgRect.height;
    const x = (e.clientX - imgRect.left) * scaleX;
    const y = (e.clientY - imgRect.top) * scaleY;
    
    const p = c.getImageData(x, y, 1, 1).data;
    setPickColor(rgbToHex(p[0], p[1], p[2]));
});

function rgbToHex(r,g,b){
    return '#' + [r,g,b].map(c=>c.toString(16).padStart(2,'0')).join('');
}

function setPickColor(hex) {
    currentColor = hex;
    customColor.value = hex;
    document.querySelectorAll('.color-box').forEach(b => b.classList.remove('active'));
    isEyedropperActive = false;
    eyedropperTool.classList.remove('active');
    document.body.style.cursor = 'default';
}

// ===================== 结束吸管工具 =====================

function stopDraw() {
    if (isDrawing) saveHistory();
    isDrawing = false;
    ctx.globalCompositeOperation = 'source-over';
}

function fillArea(e) {
    const rect = drawCanvas.getBoundingClientRect();
    const scaleX = drawCanvas.width / rect.width;
    const scaleY = drawCanvas.height / rect.height;
    let x = ((e.touches ? e.touches[0].clientX : e.clientX) - rect.left) * scaleX;
    let y = ((e.touches ? e.touches[0].clientY : e.clientY) - rect.top) * scaleY;
    if (isForbidden(x, y)) return;
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(W/2, H/2, W*0.28, H*0.38, 0, 0, Math.PI*2);
    ctx.clip();
    ctx.fillStyle = currentColor;
    ctx.fillRect(0,0,W,H);
    ctx.restore();
    drawFixedOutline();
    saveHistory();
}

function saveHistory() {
    if (isUndoRedo) return;
    historyStack.push(drawCanvas.toDataURL());
    if (historyStack.length > 30) historyStack.shift();
}

function undoDraw() {
    if (historyStack.length <= 1) return;
    isUndoRedo = true;
    historyStack.pop();
    const img = new Image();
    img.onload = () => { ctx.clearRect(0,0,W,H); ctx.drawImage(img,0,0,W,H); drawFixedOutline(); isUndoRedo = false; };
    img.src = historyStack[historyStack.length-1];
}

function loadRefImage(templateId) {
    let imgUrl = templateId === 'custom' ? currentTemplateUrl : faceTemplates[templateId]?.url || faceTemplates[4].url;
    document.getElementById('refImg').src = imgUrl;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
        refCtx.clearRect(0,0,W,H);
        if (!document.getElementById('refSwitch').checked) return;
        refCtx.globalAlpha = refOpacity;
        const scale = Math.min(W/img.width, H/img.height)*0.8*refScale;
        const w = img.width*scale, h = img.height*scale;
        refCtx.drawImage(img, (W-w)/2, (H-h)/2, w, h);
        refCtx.globalAlpha = 1;
    };
    img.src = imgUrl;
}

function saveFaceImage() {
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const cx = c.getContext('2d');
    cx.drawImage(outlineCanvas,0,0);
    cx.drawImage(drawCanvas,0,0);
    const a = document.createElement('a');
    a.download = '脸谱作品.png';
    a.href = c.toDataURL();
    a.click();
}

function loadMyWorks() {}
window.viewWork = ()=>{};

function clearCanvas() {
    if(confirm('确定清空？')){
        ctx.clearRect(0,0,W,H);
        drawFixedOutline();
        saveHistory();
    }
}

window.addEventListener('resize', () => setTimeout(resizeCanvases, 100));

function bindEvents() {
    drawCanvas.addEventListener('mousedown', startDraw);
    drawCanvas.addEventListener('mousemove', onDraw);
    drawCanvas.addEventListener('mouseup', stopDraw);
    drawCanvas.addEventListener('mouseout', stopDraw);
    drawCanvas.addEventListener('touchstart', startDraw);
    drawCanvas.addEventListener('touchmove', onDraw);
    drawCanvas.addEventListener('touchend', stopDraw);

    document.getElementById('brushTool').onclick = ()=>{ currentTool='brush'; document.querySelectorAll('.tool-icon').forEach(e=>e.classList.remove('active')); document.getElementById('brushTool').classList.add('active'); };
    document.getElementById('eraserTool').onclick = ()=>{ currentTool='eraser'; document.querySelectorAll('.tool-icon').forEach(e=>e.classList.remove('active')); document.getElementById('eraserTool').classList.add('active'); };
    document.getElementById('fillTool').onclick = ()=>{ currentTool='fill'; document.querySelectorAll('.tool-icon').forEach(e=>e.classList.remove('active')); document.getElementById('fillTool').classList.add('active'); };
    drawCanvas.addEventListener('click', e=>{ if(currentTool==='fill') fillArea(e); });

    document.querySelectorAll('.color-box').forEach(b=>{
        b.onclick = ()=>{ currentColor = b.dataset.color; document.querySelectorAll('.color-box').forEach(e=>e.classList.remove('active')); b.classList.add('active'); };
    });
    document.getElementById('customColor').oninput = e=>{ currentColor = e.target.value; document.querySelectorAll('.color-box').forEach(e=>e.classList.remove('active')); };

    document.querySelectorAll('.brush-dot').forEach(d=>{
        d.onclick = ()=>{ currentSize = +d.dataset.size; document.querySelectorAll('.brush-dot').forEach(e=>e.classList.remove('active')); d.classList.add('active'); };
    });

    document.querySelectorAll('.template-item').forEach(i=>{
        i.onclick = ()=>{
            document.querySelectorAll('.template-item').forEach(e=>e.classList.remove('active'));
            i.classList.add('active');
            const id = i.dataset.id;
            if(id==='custom') document.getElementById('customImgInput').click();
            else { currentTemplateId=+id; currentTemplateName=i.dataset.name; loadRefImage(currentTemplateId); }
        };
    });

    document.getElementById('switchOutlineBtn').onclick = switchFaceOutlineMode;
    document.getElementById('refSwitch').onchange = e=>{ e.target.checked ? loadRefImage(currentTemplateId) : refCtx.clearRect(0,0,W,H); };
    document.getElementById('opacitySlider').oninput = e=>{ refOpacity = e.target.value/100; loadRefImage(currentTemplateId); };
    document.getElementById('zoomIn').onclick = ()=>{ refScale = Math.min(refScale+0.1,2); loadRefImage(currentTemplateId); };
    document.getElementById('zoomOut').onclick = ()=>{ refScale = Math.max(refScale-0.5,0.5); loadRefImage(currentTemplateId); };
    document.getElementById('resetRef').onclick = ()=>{ refScale=1; refOpacity=0.3; document.getElementById('opacitySlider').value=30; loadRefImage(currentTemplateId); };
    document.getElementById('undoBtn').onclick = undoDraw;
    document.getElementById('clearAll').onclick = clearCanvas;
    document.getElementById('toggleOutline').onclick = ()=>{ isOutlineShow=!isOutlineShow; drawFixedOutline(); };
    document.getElementById('saveImg').onclick = saveFaceImage;

    document.getElementById('uploadTemplateBtn').onclick = ()=>document.getElementById('customImgInput').click();
    document.getElementById('customImgInput').onchange = e=>{
        const f = e.target.files[0];
        if(!f) return;
        const r = new FileReader();
        r.onload = ev=>{ currentTemplateUrl=ev.target.result; currentTemplateId='custom'; currentTemplateName='自定义'; loadRefImage('custom'); };
        r.readAsDataURL(f);
    };

    document.getElementById('openAR').onclick = async ()=>{
        document.getElementById('arPanel').style.display='block';
        const s = await navigator.mediaDevices.getUserMedia({video:true});
        document.getElementById('videoFeed').srcObject = s;
    };
    document.getElementById('closeAR').onclick = ()=>{
        document.getElementById('arPanel').style.display='none';
        const v = document.getElementById('videoFeed');
        if(v.srcObject) v.srcObject.getTracks().forEach(t=>t.stop());
    };
}

window.onload = () => {
    initContexts();
    resizeCanvases();
    bindEvents();
    saveHistory();
};