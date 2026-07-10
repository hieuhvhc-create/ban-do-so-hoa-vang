// ==========================================
// KHỞI TẠO BẢN ĐỒ & HIỂN THỊ DANH SÁCH
// ==========================================

if (document.getElementById("map")) {
    // 1. Khởi tạo bản đồ Leaflet (Vị trí trung tâm Hòa Vang, Đà Nẵng)
    var map = L.map("map").setView([15.985, 108.120], 12);

    // 2. Thêm lớp bản đồ nền từ OpenStreetMap
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    const list = document.getElementById("list");
    if (list) list.innerHTML = ""; // Xóa sạch danh sách tĩnh trong HTML cũ

    // Khởi tạo một Object để lưu trữ Marker theo ID (phục vụ tính năng tìm kiếm)
    const mapMarkers = {};

    // 3. Duyệt qua mảng dữ liệu diTich để cắm mốc (Marker) và tạo danh sách
    diTich.forEach(item => {
        // Kiểm tra xem di tích có tọa độ hợp lệ không
        if (item.lat && item.lng) {
            // Tạo Marker
            var marker = L.marker([item.lat, item.lng]).addTo(map);

            // Nội dung hiển thị khi click vào Marker
            let popupContent = `
                <div style="font-family: Arial, sans-serif; line-height: 1.4;">
                    <b style="font-size: 14px; color: #c62828;">${item.ten}</b><br>
                    <small style="color: #666;">${item.loai}</small><br><br>
                    <a href="detail.html?id=${item.id}" style="color: #007bff; text-decoration: none; font-weight: bold;">Xem chi tiết &rarr;</a>
                </div>
            `;
            marker.bindPopup(popupContent);

            // Lưu marker vào object để gọi lại sau này
            mapMarkers[item.id] = marker;
        }

        // Tạo thẻ danh sách <li> bên sidebar
        if (list) {
            const li = document.createElement("li");
            li.innerHTML = `<a href="detail.html?id=${item.id}">${item.ten}</a>`;
            
            // Sáng tạo thêm: Khi rê chuột vào tên ở sidebar, bản đồ tự dịch chuyển đến di tích đó
            li.addEventListener("mouseenter", () => {
                if (item.lat && item.lng) {
                    map.panTo([item.lat, item.lng]);
                    mapMarkers[item.id].openPopup();
                }
            });

            list.appendChild(li);
        }
    });

    // ==========================================
    // LOGIC XỬ LÝ TÌM KIẾM DI TÍCH
    // ==========================================
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");

    if (searchInput && searchBtn) {
        function thucHienTimKiem() {
            const tuKhoa = searchInput.value.toLowerCase().trim();
            if (tuKhoa === "") return;

            // Tìm di tích khớp với tên nhập vào
            const ketQua = diTich.find(item => item.ten.toLowerCase().includes(tuKhoa));

            if (ketQua && ketQua.lat && ketQua.lng) {
                // Di chuyển bản đồ tập trung vào điểm tìm thấy và phóng to
                map.setView([ketQua.lat, ketQua.lng], 16);
                // Tự động mở khung thông tin (Popup) của di tích đó
                if (mapMarkers[ketQua.id]) {
                    mapMarkers[ketQua.id].openPopup();
                }
            } else {
                alert("Không tìm thấy di tích nào khớp với tên bạn nhập!");
            }
        }

        // Kích hoạt khi bấm nút "Tìm kiếm"
        searchBtn.addEventListener("click", thucHienTimKiem);

        // Kích hoạt khi đang gõ ở ô input và bấm phím "Enter"
        searchInput.addEventListener("keypress", function (e) {
            if (e.key === "Enter") {
                thucHienTimKiem();
            }
        });
    }
}


// ==========================================
// TRANG CHI TIẾT (DETAIL.HTML) - ĐÃ TỐI ƯU
// ==========================================

if (document.getElementById("ten")) {
    // 1. Lấy ID từ thanh địa chỉ URL
    const urlParams = new URLSearchParams(window.location.search);
    const id = parseInt(urlParams.get("id"));

    // 2. Tìm di tích trong mảng data dựa vào ID
    const item = diTich.find(x => x.id === id);

    if (item) {
        // 3. Đổ dữ liệu văn bản vào giao diện
        document.getElementById("ten").innerText = item.ten || "";
        document.getElementById("diaChi").innerText = item.diaChi || "";
        document.getElementById("moTa").innerText = item.moTa || "";

        // SỬA CHUẨN: Lấy đúng trường xếp hạng chính thức dài của di tích
        const xepHangElem = document.getElementById("xepHang");
        if (xepHangElem) xepHangElem.innerText = item.xepHang || "Đang cập nhật xếp hạng...";

        // Gán dữ liệu lịch sử
        const lichSuElem = document.getElementById("lichSu");
        if (lichSuElem) lichSuElem.innerText = item.lichSu || "Dữ liệu lịch sử đang được ban ngành cập nhật...";

        // Xử lý hiển thị Hình ảnh di tích
        const hinhAnhElem = document.getElementById("hinhAnh");
        if (hinhAnhElem) {
            if (item.hinhAnh && item.hinhAnh !== "") {
                hinhAnhElem.src = item.hinhAnh;
                hinhAnhElem.style.display = "block";
            } else {
                hinhAnhElem.style.display = "none";
            }
        }

        // Xử lý hiển thị Video iFrame phát trực tuyến
        const videoElem = document.getElementById("video");
        if (videoElem) {
            if (item.video && item.video !== "") {
                videoElem.innerHTML = `<iframe src="${item.video}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
                videoElem.style.display = "block";
            } else {
                videoElem.style.display = "none";
            }
        }

        // SỬA CHUẨN: Xử lý nút Tài liệu văn bản thông minh theo đúng HTML mẫu
        const taiLieuElem = document.getElementById("taiLieu");
        if (taiLieuElem) {
            if (item.taiLieu && item.taiLieu.trim() !== "") {
                taiLieuElem.href = item.taiLieu;
                taiLieuElem.style.display = "inline-block"; // Chỉ hiện nút khi di tích thực sự đính kèm file tài liệu
            } else {
                taiLieuElem.style.display = "none"; // Tự ẩn hoàn toàn đi nếu không có file đính kèm
            }
        }
    } else {
        // Nếu gõ bậy ID trên URL không tồn tại
        document.getElementById("ten").innerText = "Không tìm thấy dữ liệu di tích này!";
        const moTaElem = document.getElementById("moTa");
        if (moTaElem) moTaElem.innerText = "Hệ thống không tìm thấy ID tương ứng. Vui lòng quay lại trang chủ bản đồ.";
    }
}
