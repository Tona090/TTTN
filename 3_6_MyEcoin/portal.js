// portal.js

// 1. MẢNG DATA MOCK GÓI NẠP - Trỏ đường dẫn ảnh vào folder ./images/
const myeCoinPackages = [
    { id: 1, name: "20 MyE Coin", amount: 20, image: "./images/20 MYE COIN.png", price: 20000 },
    { id: 2, name: "50 MyE Coin", amount: 50, image: "./images/50 MYE COIN.png", price: 50000 },
    { id: 3, name: "100 MyE Coin", amount: 100, image: "./images/100 MYE COIN.png", price: 100000 },
    { id: 4, name: "500 MyE Coin", amount: 500, image: "./images/500 MYE COIN.png", price: 450000 },
    { id: 5, name: "1000 MyE Coin", amount: 1000, image: "./images/1000 MYE COIN.png", price: 900000 },
    { id: 6, name: "2000 MyE Coin", amount: 2000, image: "./images/2000 MYE COIN.png", price: 1800000 },
    { id: 7, name: "5000 MyE Coin", amount: 5000, image: "./images/5000 MyE Coin.png", price: 4500000 },
    { id: 8, name: "10.000 MyE Coin", amount: 10000, image: "./images/10.000 MyE Coin.png", price: 9000000 }
];

// 2. MẢNG DATA MOCK HÌNH THỨC NẠP - Đồng bộ chuẩn tên file trong folder ./images/
const paymentMethods = [
    { id: 'direct', name: 'Thanh toán trực tiếp', image: './images/Thanh toán trực tiếp.png' },
    { id: 'zalopay', name: 'ZaloPay', image: './images/ZaloPay.png' },
    { id: 'momo', name: 'Ví Momo', image: './images/MOMO.png' },
    { id: 'atm', name: 'ATM/Banking', image: './images/AMT.png' },
    { id: 'visa', name: 'Visa/Master', image: './images/Visa.png' },
    { id: 'id_account', name: 'Tài khoản định danh (Bank VA)', image: './images/Tài khoản định danh.png' },
    { id: 'qr', name: 'QR Code', image: './images/icon qr.png' }
];

// Quản lý trạng thái dữ liệu trên trang
let isLoggedIn = false;
let selectedMethodId = 'direct';
let userBalance = 1200;

// Mảng chứa lịch sử giao dịch ban đầu
const transactionHistory = [
    { id: "MYE88321", time: "03/06/2026 09:15", package: "100 MyE Coin", method: "Ví Momo", price: 100000, amount: 100 },
    { id: "MYE85492", time: "01/06/2026 14:20", package: "500 MyE Coin", method: "ZaloPay", price: 450000, amount: 500 }
];

// Hàm render hình thức nạp (Đã tích hợp hover phát sáng viền cam + bóng đổ mịn màng)
function renderMethods() {
    const grid = document.getElementById("methods-grid");
    if (!grid) return;
    grid.innerHTML = paymentMethods.map(method => {
        const isSelected = selectedMethodId === method.id;
        return `
            <div onclick="selectMethod('${method.id}')" 
                 class="flex flex-col items-center justify-center p-5 cursor-pointer rounded-2xl border bg-white text-center transition-all duration-200 shadow-sm 
                        ${isSelected ? 'border-[#ff6b00] ring-2 ring-orange-100 shadow-[0_0_12px_rgba(255,107,0,0.2)]' : 'border-slate-200/70 hover:border-[#ff6b00] hover:shadow-[0_0_12px_rgba(255,107,0,0.25)]'}">
                <img src="${method.image}" alt="${method.name}" class="w-20 h-20 object-contain mb-3" />
                <span class="text-sm font-bold text-slate-600 leading-tight">${method.name}</span>
            </div>
        `;
    }).join('');
}

// Hàm render gói nạp (Đã tích hợp hover phát sáng viền cam lấp lánh đè lớp)
function renderPackages() {
    const grid = document.getElementById("packages-grid");
    if (!grid) return;
    grid.innerHTML = myeCoinPackages.map(pkg => {
        return `
            <div class="package-card bg-white rounded-2xl border border-slate-200/60 flex flex-col justify-between shadow-sm relative group overflow-hidden transition-all duration-200 
                        hover:border-[#ff6b00] hover:shadow-[0_0_14px_rgba(255,107,0,0.3)]">
                <!-- Khối ảnh nền xanh trên cùng -->
                <div class="w-full h-28 bg-[#f0f6ff] flex items-center justify-center overflow-hidden">
                    <img src="${pkg.image}" alt="${pkg.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                
                <!-- Khu vực chữ thông tin và nút mua ở dưới -->
                <div class="p-3.5 flex items-center justify-between gap-1 bg-white">
                    <div class="text-left min-w-0 flex-1">
                        <p class="text-[11px] text-slate-500 font-bold truncate">${pkg.name}</p>
                        <p class="text-[11px] text-orange-600 font-extrabold mt-0.5 truncate">${pkg.price.toLocaleString('vi-VN')} VND</p>
                    </div>
                    <button onclick="handleBuy(${pkg.id})" class="bg-[#ff6b00] hover:bg-[#e05e00] text-white text-[10px] font-black px-3 py-1.5 rounded-lg transition-colors uppercase tracking-wider shrink-0 shadow-sm active:scale-95">
                        Mua
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Hàm cập nhật đồng bộ giá trị số dư tài khoản lên giao diện công khai
function updateBalanceUI() {
    if (typeof window.renderGlobalHeader === "function") {
        window.renderGlobalHeader(isLoggedIn, "myepro123", userBalance);
    }

    const infoCardBalanceZone = document.getElementById("user-balance-display");
    if (infoCardBalanceZone) {
        infoCardBalanceZone.innerHTML = `${userBalance.toLocaleString('vi-VN')} <img src="./images/coin M.png" class="w-7 h-7 md:w-8 h-8 object-contain inline" />`;
    }
}

// Lắng nghe sự kiện đổi cổng hình thức nạp
window.selectMethod = function (id) {
    selectedMethodId = id;
    renderMethods();
}

// Xử lý giả lập click nút ĐĂNG NHẬP màu cam trên thanh Header
window.handleLoginClick = function () {
    isLoggedIn = true;
    updateBalanceUI();
}

// Xử lý giả lập click nút THOÁT tài khoản
window.handleLogoutClick = function () {
    isLoggedIn = false;
    updateBalanceUI();
}
// Hàm kiểm tra và mở khóa cuộn trang nếu không còn modal nào hiển thị
function checkAndUnlockScroll() {
    const historyModal = document.getElementById("history-modal");
    const isHistoryOpen = historyModal && !historyModal.classList.contains("opacity-0");

    const loginWarningModal = document.getElementById("login-warning-modal");
    const isWarningOpen = loginWarningModal && !loginWarningModal.classList.contains("opacity-0");

    if (!isHistoryOpen && !isWarningOpen) {
        document.body.classList.remove("overflow-hidden");
    }
}

// Hàm tắt thông báo Toast
window.closeToast = function (toast) {
    if (!toast) return;
    toast.remove();
}

// Hàm hiển thị thông báo Toast thay thế alert() mặc định
window.showToast = function (message, type = 'success') {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast-item flex items-start gap-3 p-4 rounded-xl border bg-white/95 backdrop-blur-md shadow-xl max-w-sm pointer-events-auto transition-all relative overflow-hidden`;

    let borderColor = 'border-emerald-200';
    let iconBg = 'bg-emerald-50 text-emerald-500';
    let progressBarBg = 'bg-emerald-500';
    let iconSvg = `
        <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
    `;

    if (type === 'warning' || type === 'error') {
        borderColor = 'border-amber-200';
        iconBg = 'bg-amber-50 text-amber-600';
        progressBarBg = 'bg-amber-500';
        iconSvg = `
            <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
        `;
    }

    toast.classList.add(borderColor);

    toast.innerHTML = `
        <div class="w-8 h-8 rounded-full ${iconBg} flex items-center justify-center shrink-0">
            ${iconSvg}
        </div>
        <div class="flex-1 pt-0.5">
            <p class="text-xs font-bold text-slate-800 leading-tight">${type === 'success' ? 'Thành công' : 'Bảo mật / Cảnh báo'}</p>
            <p class="text-[11px] text-slate-500 mt-1 leading-snug font-medium">${message}</p>
        </div>
        <button onclick="window.closeToast(this.parentElement)" class="text-slate-400 hover:text-slate-600 font-bold text-xs shrink-0 self-start p-0.5 ml-2">&times;</button>
        <div class="toast-progress absolute bottom-0 left-0 right-0 h-[3px] ${progressBarBg}"></div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        if (toast.parentElement) {
            window.closeToast(toast);
        }
    }, 2500);
}

// Các hàm điều khiển Popup Cảnh báo đăng nhập
window.openLoginWarning = function () {
    const modal = document.getElementById("login-warning-modal");
    if (!modal) return;
    modal.classList.remove("opacity-0", "pointer-events-none");
    modal.children[0].classList.remove("scale-95");
    document.body.classList.add("overflow-hidden");
}

window.closeLoginWarning = function () {
    const modal = document.getElementById("login-warning-modal");
    if (!modal) return;
    modal.classList.add("opacity-0", "pointer-events-none");
    modal.children[0].classList.add("scale-95");
    checkAndUnlockScroll();
}

window.triggerLoginFromWarning = function () {
    closeLoginWarning();
    if (typeof window.handleLoginClick === "function") {
        window.handleLoginClick();
    }
    // Hiển thị thêm thông báo Toast cho sinh động
    if (typeof window.showToast === "function") {
        window.showToast("Đăng nhập tài khoản thành công! Số dư đã được cập nhật.", "success");
    }
}

// Logic khi bấm nút MUA xu
window.handleBuy = function (id) {
    if (!isLoggedIn) {
        window.openLoginWarning();
        return;
    }

    const pkg = myeCoinPackages.find(p => p.id === id);
    const method = paymentMethods.find(m => m.id === selectedMethodId);

    const now = new Date();
    const timeStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const randomId = "MYE" + Math.floor(10000 + Math.random() * 90000);

    transactionHistory.unshift({
        id: randomId,
        time: timeStr,
        package: pkg.name,
        method: method.name,
        price: pkg.price,
        amount: pkg.amount
    });

    userBalance += pkg.amount;
    updateBalanceUI();

    window.showToast(`Giao dịch thành công! Bạn đã nạp thành công gói ${pkg.name}. Số dư tài khoản đã được cập nhật tự động.`, "success");
}
// Đổ dữ liệu mảng lịch sử ra bảng Modal Popup
function renderHistoryTable() {
    const tbody = document.getElementById("history-table-body");
    if (!tbody) return;

    tbody.innerHTML = transactionHistory.map(item => {
        return `
            <tr class="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                <td class="py-3 px-3 text-slate-500 font-medium">${item.time}</td>
                <td class="py-3 px-3 font-bold text-slate-700">${item.package}</td>
                <td class="py-3 px-3 text-slate-600 font-medium">${item.method}</td>
                <td class="py-3 px-3 font-extrabold text-slate-800">${item.price.toLocaleString('vi-VN')}đ</td>
                <td class="py-3 px-3 text-right">
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">Thành công</span>
                </td>
            </tr>
        `;
    }).join('');
}

// Mở/Đóng popup lịch sử
window.openHistory = function () {
    const modal = document.getElementById("history-modal");
    if (!modal) return;
    renderHistoryTable();
    modal.classList.remove("opacity-0", "pointer-events-none");
    modal.children[0].classList.remove("scale-95");
    document.body.classList.add("overflow-hidden");
}

window.closeHistory = function () {
    const modal = document.getElementById("history-modal");
    if (!modal) return;
    modal.classList.add("opacity-0", "pointer-events-none");
    modal.children[0].classList.add("scale-95");
    checkAndUnlockScroll();
}



// Khởi chạy hệ thống khi DOM sẵn sàng
document.addEventListener("DOMContentLoaded", function () {
    renderMethods();
    renderPackages();
    setTimeout(updateBalanceUI, 200);
});
