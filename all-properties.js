/**
 * OBJECT TỔNG HỢP TẤT CẢ PROPERTIES CỦA HỆ THỐNG PDF CONTRACT
 * Sử dụng cho tất cả 6 templates hợp đồng
 */

const AllContractProperties = {
  // ========== THÔNG TIN CHUNG ==========
  soVanBan: "string",                    // Số văn bản hợp đồng
  ngayHop: "string",                     // Ngày họp/ký hợp đồng (dd/mm/yyyy)
  ngayKyDay: "string",                   // Ngày ký hợp đồng
  ngayKyMonth: "string",                 // Tháng ký hợp đồng
  ngayKyYear: "string",                  // Năm ký hợp đồng
  ngayHieuLuc: "string",                 // Ngày có hiệu lực hợp đồng (dd/mm/yyyy)
  ngayBatDauHopDong: "string",           // Ngày bắt đầu hợp đồng (dd/mm/yyyy)
  ngayKetThucHopDong: "string",          // Ngày kết thúc hợp đồng (dd/mm/yyyy)
  ngayHieuLucHopDong: "string",          // Ngày có hiệu lực hợp đồng (dd/mm/yyyy)

  // ========== FLAGS ==========
  isCpyt: "boolean",                     // Flag công ty y tế hay TNHH
  isHdldNguoiCaoTuoi: "boolean",         // Flag hợp đồng người cao tuổi

  // ========== THÔNG TIN CÔNG TY (BÊN A) ==========
  tenCongTy: "string",                   // Tên công ty đầy đủ
  companyShortName: "string",            // Tên ngắn gọn công ty
  companyFullName: "string",             // Tên đầy đủ công ty (học việc)
  companyAddress: "string",              // Địa chỉ công ty
  diaChiCongTy: "string",                // Địa chỉ ký hợp đồng/văn phòng
  companyPhone: "string",                // Số điện thoại công ty
  companyFax: "string",                  // Số fax công ty
  companyTaxCode: "string",              // Mã số thuế công ty
  
  a_representative: "string",            // Tên người đại diện công ty
  a_nationality: "string",               // Quốc tịch người đại diện
  a_title: "string",                     // Chức vụ người đại diện
  a_cccd: "string",                      // Số CCCD người đại diện
  a_ngayCapCccd: "string",               // Ngày cấp CCCD người đại diện
  
  soUyQuyen: "string",                   // Số ủy quyền (optional)
  ngayUyQuyen: "string",                 // Ngày ủy quyền (optional)

  // ========== THÔNG TIN NGƯỜI LAO ĐỘNG (BÊN B) ==========
  b_fullName: "string",                  // Họ tên đầy đủ người lao động
  b_gender: "string",                    // Giới tính người lao động
  b_nationality: "string",               // Quốc tịch người lao động
  b_birthYear: "string",                 // Ngày/tháng/năm sinh
  b_address: "string",                   // Địa chỉ thường trú
  b_idNo: "string",                      // Số CCCD/CMND
  b_idDate: "string",                    // Ngày cấp CCCD/CMND
  b_idPlace: "string",                   // Nơi cấp CCCD/CMND
  queQuanCongTacVien: "string",          // Quê quán cộng tác viên

  // ========== THÔNG TIN HỢP ĐỒNG VÀ CÔNG VIỆC ==========
  tenLoaiHopDong: "string",              // Loại hợp đồng (xác định/không xác định thời hạn)
  thoiGianBatDauHopDong: "string",       // Thời điểm bắt đầu hợp đồng
  thoiGianKetThucHopDong: "string",      // Thời điểm kết thúc hợp đồng
  tenNoiLamViec: "string",               // Địa điểm làm việc
  tenViTriCongViec: "string",            // Vị trí công việc
  thoiGianLamViec: "string",             // Thời gian làm việc (giờ/ngày, giờ/tuần)
  huongDanCongViec: "string",            // Nội dung hướng dẫn công việc cụ thể
  
  soHopDong: "string",                   // Số hợp đồng lao động gốc
  ngayKyHopDong: "string",               // Ngày ký hợp đồng gốc (dd/mm/yyyy)
  noiDungSuDoiHopDong: "Array<string>",  // Mảng nội dung sửa đổi/bổ sung

  // ========== THÔNG TIN LƯƠNG VÀ PHÚC LỢI ==========
  luongChinh: "string",                  // Mức lương cơ bản/chính
  luongCoSo: "string",                   // Lương vị trí công việc (thử việc)
  phuCapHieuQua: "string",               // Phụ cấp hiệu quả công việc (thử việc)
  ngayTraLuong: "string",                // Ngày trả lương hàng tháng

  // ========== THÔNG TIN CHỮ KÝ ==========
  signerA: "string",                     // Tên người ký đại diện công ty
  signerB: "string",                     // Tên người ký lao động
  signaturePathA: "string",              // Đường dẫn ảnh chữ ký người đại diện công ty
  signaturePathB: "string"               // Đường dẫn ảnh chữ ký người lao động
};

// Export cho sử dụng
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AllContractProperties;
}