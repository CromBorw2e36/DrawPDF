# Data Properties Schema Documentation

## Object tổng hợp tất cả properties cần thiết cho hệ thống PDF Contract Generator

File này được tạo ra để chuẩn hóa và quản lý tất cả các properties sử dụng trong 6 template hợp đồng:

1. `hop-dong-lao-dong` - Hợp đồng lao động TNHH
2. `hop-dong-lao-dong-cpyt` - Hợp đồng lao động công ty y tế  
3. `hop-dong-thu-viec` - Hợp đồng thử việc
4. `hop-dong-hoc-viec-tap-nghe` - Hợp đồng học việc/tập nghề
5. `hop-dong-cong-tac-vien` - Hợp đồng cộng tác viên
6. `phu-luc-hop-dong-lao-dong` - Phụ lục hợp đồng lao động

## Sử dụng

```javascript
// Import schema
const { DataPropertiesSchema, TemplatePropertiesMapping, ValidationHelpers } = require('./data-properties-schema.js');

// Validate data cho template
const validationResult = ValidationHelpers.validateTemplate('hop-dong-thu-viec', dataObject);
if (!validationResult.isValid) {
  console.error('Validation errors:', validationResult.errors);
}

// Tạo sample data cho template
const sampleData = ValidationHelpers.createSampleData('hop-dong-lao-dong');
console.log(sampleData);
```

## Cấu trúc Schema

### 1. Common Properties
- `soVanBan`: Số văn bản hợp đồng
- `ngayHop`: Ngày họp/ký hợp đồng  
- `ngayHieuLuc`: Ngày có hiệu lực

### 2. Flags Properties
- `isCpyt`: Công ty y tế hay TNHH
- `isHdldNguoiCaoTuoi`: Hợp đồng người cao tuổi

### 3. Company Properties (Bên A)
- Thông tin cơ bản: `tenCongTy`, `companyAddress`, `companyPhone`
- Người đại diện: `a_representative`, `a_nationality`, `a_title`
- Ủy quyền: `soUyQuyen`, `ngayUyQuyen`

### 4. Employee Properties (Bên B)  
- Thông tin cá nhân: `b_fullName`, `b_gender`, `b_nationality`, `b_birthYear`, `b_address`
- Giấy tờ: `b_idNo`, `b_idDate`, `b_idPlace`

### 5. Contract Properties
- Thời hạn: `thoiGianBatDauHopDong`, `thoiGianKetThucHopDong`
- Công việc: `tenNoiLamViec`, `tenViTriCongViec`, `thoiGianLamViec`

### 6. Salary Properties
- Lương: `luongChinh`, `luongCoSo`, `phuCapHieuQua`
- Thanh toán: `ngayTraLuong`

### 7. Signature Properties
- Chữ ký: `signerA`, `signerB`, `signaturePathA`, `signaturePathB`

## Template Mapping

Mỗi template có danh sách properties required và optional riêng:

```javascript
TemplatePropertiesMapping["hop-dong-thu-viec"].required
// => ["soVanBan", "tenCongTy", "companyAddress", ...]

TemplatePropertiesMapping["hop-dong-thu-viec"].optional  
// => ["soUyQuyen", "ngayUyQuyen", "luongCoSo", ...]
```

## Validation

Hệ thống validation tự động kiểm tra:
- Properties bắt buộc có đầy đủ không
- Properties có giá trị hợp lệ không
- Template có được hỗ trợ không

## Sample Data Generation

Có thể tự động tạo data mẫu cho từng template để test:

```javascript
const sampleData = ValidationHelpers.createSampleData('hop-dong-lao-dong');
// Trả về object với tất cả properties cần thiết và giá trị mẫu
```

---
**Generated:** 2025-11-12  
**Version:** 1.0  
**Author:** Contract PDF Generator System