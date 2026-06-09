// layout.js

// 1. MẢNG DỮ LIỆU ĐỔ VÀO MENU HEADER TỰ ĐỘNG TỪ JS KHÔNG VIẾT CỨNG HTML
const navigationLinks = [
    { name: "Trang Chủ", url: "#", active: false },
    { name: "Trò Chơi", url: "#", active: false },
    { name: "Nạp Game", url: "#", active: true }, // Mục hiện tại đang đứng
    { name: "Tin Tức", url: "#", active: false },
    { name: "Hỗ Trợ", url: "#", active: false }
];

// 2. Hàm vẽ Header dựa theo trạng thái đăng nhập (isLoggedIn)
window.renderGlobalHeader = function (isLoggedIn, username, balance) {
    const headerContainer = document.getElementById("global-header");
    if (!headerContainer) return;

    // Tạo chuỗi HTML cho danh sách Menu động từ mảng dữ liệu cấu trúc ở trên
    const menuItemsHTML = navigationLinks.map(link => {
        if (link.active) {
            return `<a href="${link.url}" class="text-[#ff6b00] border-b-2 border-[#ff6b00] h-full flex items-center transition-all">${link.name}</a>`;
        }
        return `<a href="${link.url}" class="text-[#0a2e5c] hover:text-[#ff6b00] h-full flex items-center transition-colors">${link.name}</a>`;
    }).join('');

    let authZoneHTML = '';
    if (isLoggedIn) {
        // TRẠNG THÁI ĐÃ ĐĂNG NHẬP: Menu thả xuống ẩn chữ "Thoát" thô cứng khi bấm vào Avatar
        authZoneHTML = `
        <div class="relative inline-block text-left select-none">
            <div onclick="toggleUserDropdown(event)" class="flex items-center gap-3 bg-white border border-slate-200 hover:border-slate-300 py-1.5 px-4 rounded-full shadow-sm cursor-pointer transition-all active:scale-95">
                <div class="w-7 h-7 bg-amber-400 rounded-full overflow-hidden border border-white shadow-sm flex items-center justify-center shrink-0">
                    <img src="./images/nữMye.png" class="w-full h-full object-cover" />
                </div>
                <div class="flex flex-col text-left leading-tight min-w-[75px]">
                    <span class="text-[11px] font-extrabold text-orange-600 truncate">${username}</span>
                    <span class="text-[9px] text-slate-400 font-medium">MyE ID: 12233548</span>
                </div>
                <span class="h-5 w-[1px] bg-slate-200 block mx-0.5"></span>
                <div class="flex items-center gap-1 shrink-0 bg-amber-50/50 px-2 py-0.5 rounded-md border border-amber-100/60">
                    <img src="./images/coin M.png" class="w-3.5 h-3.5 object-contain" />
                    <span class="text-[11px] font-black text-slate-700 font-mono">${balance.toLocaleString('vi-VN')}</span>
                </div>
                <!-- Custom Dropdown SVG Arrow inside small circular boundary -->
                <div class="w-4 h-4 rounded-md border border-slate-200 flex items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors shrink-0">
                    <svg id="dropdown-arrow" class="w-2 h-2 text-slate-500 transition-transform duration-200" fill="none" stroke="currentColor" stroke-width="3.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </div>
            </div>
            
            <!-- Hộp bảng menu con ẩn hiện linh hoạt -->
            <div id="user-dropdown-menu" class="absolute right-0 mt-2 w-40 bg-white border border-slate-100 rounded-xl shadow-xl p-1.5 transition-all duration-200 opacity-0 pointer-events-none scale-95 transform origin-top-right z-50">
                <div class="px-3 py-2 border-b border-slate-50 text-left">
                    <p class="text-[10px] text-slate-400 font-medium leading-none">Xin chào,</p>
                    <p class="text-[11px] font-bold text-slate-700 truncate mt-1">${username}</p>
                </div>
                <button onclick="handleLogoutClick(); closeUserDropdown();" class="w-full text-left flex items-center gap-2 px-3 py-2 text-[11px] text-rose-500 hover:bg-rose-50 rounded-lg font-bold transition-colors mt-1">
                    <!-- SVG Exit Icon -->
                    <svg class="w-3.5 h-3.5 text-rose-500 shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                    </svg>
                    <span>Đăng xuất tài khoản</span>
                </button>
            </div>
        </div>
        `;
    } else {
        // TRẠNG THÁI CHƯA ĐĂNG NHẬP: Hiện nút đăng nhập màu cam glossy
        authZoneHTML = `
        <button onclick="handleLoginClick()" class="btn-glossy-orange text-white text-[11px] font-extrabold px-6 py-2 rounded-full transition-all transform active:scale-95 uppercase tracking-wider">
            Đăng nhập
        </button>
        `;
    }

    headerContainer.innerHTML = `
    <header class="w-full bg-white transition-all duration-200">
         <div class="max-w-4xl mx-auto px-4 h-20 flex items-center justify-between">
             <div class="flex items-center cursor-pointer pl-8">
                 <img src="./images/Logo-myE.png" alt="MyE Logo" class="h-[68px] object-contain" />
             </div>
             
             <!-- Điều hướng tự động nhúng mảng động ở giữa, tạo khoảng cách rộng rãi -->
             <nav class="hidden md:flex items-center gap-12 text-[13px] font-extrabold mx-auto h-full">
                 ${menuItemsHTML}
             </nav>
             
             <div id="auth-header-zone" class="flex items-center justify-end min-w-[120px]">
                 ${authZoneHTML}
             </div>
         </div>
     </header>
    `;

    // Cập nhật trạng thái scroll của header ngay khi render xong
    if (typeof handleHeaderScroll === "function") {
        handleHeaderScroll();
    }
}

// Hàm mở rộng ẩn hiện dropdown menu tài khoản cá nhân
window.toggleUserDropdown = function (event) {
    event.stopPropagation();
    const menu = document.getElementById("user-dropdown-menu");
    const arrow = document.getElementById("dropdown-arrow");
    if (!menu) return;

    const isHidden = menu.classList.contains("opacity-0");
    if (isHidden) {
        menu.classList.remove("opacity-0", "pointer-events-none", "scale-95");
        if (arrow) arrow.classList.add("rotate-180");
    } else {
        closeUserDropdown();
    }
}

window.closeUserDropdown = function () {
    const menu = document.getElementById("user-dropdown-menu");
    const arrow = document.getElementById("dropdown-arrow");
    if (menu) {
        menu.classList.add("opacity-0", "pointer-events-none", "scale-95");
    }
    if (arrow) arrow.classList.remove("rotate-180");
}

document.addEventListener("click", function () {
    closeUserDropdown();
});

// 3. HÀM VẼ FOOTER CHÂN TRANG: ĐÃ PHÓNG TO LOGO LÊN H-24 CHO CÂN ĐỐI HOÀN HẢO
window.renderGlobalFooter = function () {
    const footerContainer = document.getElementById("global-footer");
    if (!footerContainer) return;

    footerContainer.innerHTML = `
    <footer class="bg-[#EAEAEA] text-[#555555] py-8 text-xs mt-6 border-t border-slate-300">
        <div class="max-w-5xl mx-auto px-4 text-center space-y-3">
            <div class="flex items-center justify-center">
                <img src="./images/Logo-myE.png" alt="MyE Logo" class="h-32 object-contain" />
            </div>
            <div class="text-[13px] font-medium text-slate-700 space-y-0.5">
                <p>Email: hotro@mye.vn</p>
                <p>Hotline: 0902 500 198</p>
            </div>
            <div class="space-y-1 text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
                <p class="font-extrabold text-slate-800 text-xs uppercase tracking-wide">CÔNG TY CỔ PHẦN MYE</p>
                <p>Chịu trách nhiệm quản lí nội dung: Ông Lâm Trung Hiệp</p>
                <p>Địa chỉ: 477/22 Âu Cơ, Phường Phú Trung, Quận Tân Phú, Thành phố Hồ Chí Minh, Việt Nam</p>
                <p>Giấy phép G1 số: Số 297/GP-BTTTT. Ngày cấp 14/07/2020, Nơi cấp Bộ Thông Tin và Truyền Thông</p>
            </div>
            <div class="pt-2 text-[11px] text-slate-500 flex justify-center gap-4 font-medium">
                <a href="#" class="hover:underline">Điều khoản dịch vụ</a>
                <span class="text-slate-300">|</span>
                <a href="#" class="hover:underline">Chính sách bảo mật</a>
            </div>
            <div class="text-[11px] text-slate-400 pt-1">
                ©Copyright © 2026 MYE. All Rights Reserved.
            </div>
        </div>
    </footer>
    `;
}

// Hàm xử lý border/shadow cho header khi cuộn trang
window.handleHeaderScroll = function () {
    const header = document.querySelector("#global-header header");
    if (!header) return;
    if (window.scrollY > 0) {
        header.classList.add("border-b", "border-slate-200/80", "shadow-sm", "shadow-slate-100");
    } else {
        header.classList.remove("border-b", "border-slate-200/80", "shadow-sm", "shadow-slate-100");
    }
}

window.addEventListener("scroll", handleHeaderScroll);

document.addEventListener("DOMContentLoaded", function () {
    renderGlobalFooter();
    setTimeout(handleHeaderScroll, 100);
});
