// ==========================================
// KHỞI TẠO BẢN ĐỒ & HIỂN THỊ DANH SÁCH
// ==========================================

if (document.getElementById("map")) {
    // 1. Khởi tạo bản đồ Leaflet (Vị trí trung tâm Hòa Vang, Đà Nẵng)
    var map = L.map("map").setView([15.985, 108.120], 12);

    // 2. Sử dụng bản đồ nền Google Maps (Hiển thị đầy đủ Hoàng Sa, Trường Sa bằng tiếng Việt)
    L.tileLayer("https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
        maxZoom: 20,
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
        attribution: "&copy; Google Maps"
    }).addTo(map);

    const list = document.getElementById("list");
    if (list) list.innerHTML = ""; // Xóa sạch danh sách tĩnh trong HTML cũ
