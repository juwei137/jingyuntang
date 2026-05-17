// JavaScript Document
// ==================== 搜索功能 ====================
document.querySelector('.search-btn').addEventListener('click', function () {
    const searchText = document.querySelector('.search-input').value.trim();
    if (!searchText) {
        alert('请输入搜索内容');
        return;
    }
    alert(`正在搜索：${searchText}，找到相关结果`);
});

document.querySelector('.search-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        document.querySelector('.search-btn').click();
    }
});

// ==================== 京剧轮播图功能 ====================
window.onload = function () {
    const carouselItems = document.querySelectorAll('.carousel-item');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const carouselBox = document.getElementById('carouselBox');
    let currentIndex = 2;
    const totalItems = carouselItems.length;
    let autoPlayInterval;
    const playTime = 3000;

    function updateCarousel() {
        carouselItems.forEach((item, index) => {
            const offset = (index - currentIndex + totalItems) % totalItems;
            if (offset === 0) {
                item.style.opacity = 1;
                item.style.transform = 'translateX(-50%) scale(1)';
                item.style.zIndex = 3;
                item.style.left = '50%';
                item.style.right = 'auto';
            } else if (offset === 1) {
                item.style.opacity = 0.8;
                item.style.transform = 'translateX(40px) scale(0.85)';
                item.style.zIndex = 2;
                item.style.right = '50px';
                item.style.left = 'auto';
            } else if (offset === 2) {
                item.style.opacity = 0.6;
                item.style.transform = 'translateX(80px) scale(0.7)';
                item.style.zIndex = 1;
                item.style.right = '0';
                item.style.left = 'auto';
            } else if (offset === totalItems - 1) {
                item.style.opacity = 0.8;
                item.style.transform = 'translateX(-40px) scale(0.85)';
                item.style.zIndex = 2;
                item.style.left = '50px';
                item.style.right = 'auto';
            } else if (offset === totalItems - 2) {
                item.style.opacity = 0.6;
                item.style.transform = 'translateX(-80px) scale(0.7)';
                item.style.zIndex = 1;
                item.style.left = '0';
                item.style.right = 'auto';
            } else {
                item.style.opacity = 0;
                item.style.transform = 'scale(0.5)';
                item.style.zIndex = 0;
            }
        });
    }

    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % totalItems;
            updateCarousel();
        }, playTime);
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            stopAutoPlay();
            currentIndex = (currentIndex - 1 + totalItems) % totalItems;
            updateCarousel();
            startAutoPlay();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            stopAutoPlay();
            currentIndex = (currentIndex + 1) % totalItems;
            updateCarousel();
            startAutoPlay();
        });
    }

    // 鼠标悬停暂停
    if (carouselBox) {
        carouselBox.addEventListener('mouseenter', stopAutoPlay);
        carouselBox.addEventListener('mouseleave', startAutoPlay);
    }

    updateCarousel();
    startAutoPlay();
};