// JavaScript Document
(function() {
    // ==================== 登录状态管理 ====================
    
    window.isUserLoggedIn = function() {
        return localStorage.getItem("jyLogin") === "true" || 
               localStorage.getItem("currentUser") !== null;
    };
    
    window.getCurrentUser = function() {
        if (localStorage.getItem("currentUser")) {
            return localStorage.getItem("currentUser");
        }
        if (localStorage.getItem("username")) {
            return localStorage.getItem("username");
        }
        return null;
    };
    
    window.logoutUser = function() {
        localStorage.removeItem("jyLogin");
        localStorage.removeItem("currentUser");
        localStorage.removeItem("username");
        alert("已退出登录");
        location.reload();
    };
    
    window.showLoginModal = function(callback, message) {
        if (window.isUserLoggedIn()) {
            if (callback) callback(true);
            return;
        }
        
        let mask = document.getElementById('globalLoginModal');
        if (mask) mask.remove();
        
        mask = document.createElement('div');
        mask.id = 'globalLoginModal';
        mask.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.7); z-index: 10001;
            display: flex; align-items: center; justify-content: center;
        `;
        mask.innerHTML = `
            <div style="background:#fff9ef; border-radius:12px; width:360px; padding:30px; text-align:center; box-shadow:0 10px 30px rgba(0,0,0,0.2);">
                <h3 style="color:#C41E3A; margin-bottom:10px;">需要登录</h3>
                <p style="color:#666; margin-bottom:20px; font-size:14px;">${message || '请先登录账号后继续操作'}</p>
                <input type="text" id="modalUsername" placeholder="用户名" style="width:100%; padding:12px; margin:10px 0; border:1px solid #dbc078; border-radius:6px; box-sizing:border-box;">
                <input type="password" id="modalPassword" placeholder="密码" style="width:100%; padding:12px; margin:10px 0; border:1px solid #dbc078; border-radius:6px; box-sizing:border-box;">
                <button id="modalLoginBtn" style="background:#C41E3A; color:#fff; border:none; padding:12px 20px; border-radius:6px; width:100%; cursor:pointer; font-size:16px;">登录</button>
                <button id="modalRegisterBtn" style="margin-top:12px; background:#DBC078; color:#333; border:none; padding:10px 20px; border-radius:6px; width:100%; cursor:pointer;">注册新账号</button>
                <button id="modalCloseBtn" style="margin-top:15px; background:none; border:none; color:#999; cursor:pointer;">暂不登录，继续浏览</button>
            </div>
        `;
        document.body.appendChild(mask);
        
        document.getElementById('modalLoginBtn').onclick = function() {
            const user = document.getElementById('modalUsername').value.trim();
            const pwd = document.getElementById('modalPassword').value.trim();
            if (!user || !pwd) {
                alert("请输入用户名和密码");
                return;
            }
            if (localStorage.getItem(user) === pwd || pwd === "123456") {
                localStorage.setItem("jyLogin", "true");
                localStorage.setItem("currentUser", user);
                localStorage.setItem("username", user);
                if (!localStorage.getItem(user)) {
                    localStorage.setItem(user, pwd);
                }
                alert("登录成功！");
                mask.remove();
                if (callback) callback(true);
            } else {
                alert("用户名或密码错误！\n提示：可直接输入任意用户名和密码123456登录");
            }
        };
        
        document.getElementById('modalRegisterBtn').onclick = function() {
            const user = document.getElementById('modalUsername').value.trim();
            const pwd = document.getElementById('modalPassword').value.trim();
            if (!user || !pwd) {
                alert("请输入用户名和密码");
                return;
            }
            if (localStorage.getItem(user)) {
                alert("用户名已存在，请直接登录");
                return;
            }
            localStorage.setItem(user, pwd);
            localStorage.setItem("jyLogin", "true");
            localStorage.setItem("currentUser", user);
            localStorage.setItem("username", user);
            alert("注册成功！已自动登录");
            mask.remove();
            if (callback) callback(true);
        };
        
        document.getElementById('modalCloseBtn').onclick = function() {
            mask.remove();
            if (callback) callback(false);
        };
        
        mask.addEventListener('click', function(e) {
            if (e.target === mask) {
                mask.remove();
                if (callback) callback(false);
            }
        });
    };
    
    // ==================== 权限检查函数 ====================
    
    window.checkDownloadPermission = function(fileName, fileUrl, callback) {
        if (window.isUserLoggedIn()) {
            const a = document.createElement('a');
            a.href = fileUrl;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            if (callback) callback(true);
            return true;
        } else {
            window.showLoginModal(function(success) {
                if (success && callback) {
                    const a = document.createElement('a');
                    a.href = fileUrl;
                    a.download = fileName;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    callback(true);
                } else if (callback) {
                    callback(false);
                }
            }, "下载资源需要登录账号");
            return false;
        }
    };
    
    window.checkHistoryPermission = function(callback) {
        if (window.isUserLoggedIn()) {
            if (callback) callback(true);
            return true;
        } else {
            window.showLoginModal(function(success) {
                if (callback) callback(success);
            }, "查看历史成绩需要登录账号");
            return false;
        }
    };
    
    window.checkPublishPermission = function(callback) {
        if (window.isUserLoggedIn()) {
            if (callback) callback(true);
            return true;
        } else {
            window.showLoginModal(function(success) {
                if (callback) callback(success);
            }, "发布内容需要登录账号");
            return false;
        }
    };
    
    window.checkSavePermission = function(callback) {
        if (window.isUserLoggedIn()) {
            if (callback) callback(true);
            return true;
        } else {
            window.showLoginModal(function(success) {
                if (callback) callback(success);
            }, "保存作品需要登录账号");
            return false;
        }
    };
    
    window.checkGameRecordPermission = function(callback) {
        if (window.isUserLoggedIn()) {
            if (callback) callback(true);
            return true;
        } else {
            if (callback) callback(false);
            return false;
        }
    };
    
    // ==================== 统一搜索功能 ====================
    window.initSearch = function() {
        const searchBtn = document.querySelector('.search-btn');
        const searchInput = document.querySelector('.search-input');
        if (!searchBtn || !searchInput) return;
        
        const searchHandler = function() {
            const keyword = searchInput.value.trim();
            if (!keyword) {
                alert('请输入搜索内容');
                return;
            }
            sessionStorage.setItem('searchKeyword', keyword);
            alert(`正在搜索：“${keyword}”\n相关结果可在各板块中查找`);
        };
        
        searchBtn.addEventListener('click', searchHandler);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') searchHandler();
        });
    };
    
    // ==================== 用户数据显示 ====================
    window.updateUserDisplay = function() {
        const userElements = document.querySelectorAll('.user-name-display');
        if (window.isUserLoggedIn()) {
            const username = window.getCurrentUser();
            userElements.forEach(el => {
                el.textContent = username;
                el.style.display = 'inline';
            });
        } else {
            userElements.forEach(el => {
                el.style.display = 'none';
            });
        }
    };
    
    // ==================== 页面初始化 ====================
    window.addEventListener('DOMContentLoaded', function() {
        window.initSearch();
        setTimeout(function() {
            window.setNavActive();
        }, 100);
        window.updateUserDisplay();
    });
})();