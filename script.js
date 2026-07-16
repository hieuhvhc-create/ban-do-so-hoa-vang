// ==========================================
// KHỞI TẠO BẢN ĐỒ & HIỂN THỊ DANH SÁCH
// ==========================================

if (document.getElementById("map")) {
    // 1. Khởi tạo bản đồ Leaflet (Vị trí trung tâm Hòa Vang, Đà Nẵng)
    var map = L.map("map").setView([15.985, 108.120], 12);

    // 2. ĐÃ CẬP NHẬT: Thay thế OpenStreetMap bằng bản đồ nền Google Maps 
    // (Hiển thị đầy đủ Hoàng Sa, Trường Sa bằng tiếng Việt mà không cần API Key trả phí)
    L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        attribution: '&copy; Google Maps'
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
        searchBtn.
