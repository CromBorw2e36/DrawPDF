# JsPdfService Documentation

## Giới thiệu

JsPdfService là một wrapper class cho jsPDF library, cung cấp các tính năng mở rộng để tạo PDF với hỗ trợ tiếng Việt, chữ ký điện tử, format text đa dạng và nhiều tính năng nâng cao khác.

## Cài đặt và Khởi tạo

### Dependencies
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/3.0.3/jspdf.umd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/3.0.3/polyfills.umd.js"></script>
<!-- Font tiếng Việt -->
<script src="fonts/Roboto-Bold-normal.js"></script>
<script src="fonts/Roboto-BoldItalic-normal.js"></script>
<script src="fonts/Roboto-Italic-normal.js"></script>
<script src="fonts/Roboto-Regular-normal.js"></script>
<script src="jspdf-service.js"></script>
```

### Khởi tạo
```javascript
const pdf = new JsPdfService();
```

### Cấu hình mặc định
```javascript
{
  currentY: 20,           // Vị trí Y hiện tại
  lineHeight: 1,          // Khoảng cách giữa các dòng
  pageHeight: 297,        // Chiều cao trang (A4)
  pageWidth: 210,         // Chiều rộng trang (A4)
  margins: {              // Lề trang
    left: 15, 
    right: 15, 
    top: 20, 
    bottom: 20
  }
}
```

## 🔤 Tính năng Text và Typography

### 1. addText(text, x, y, options)
Thêm text với nhiều tùy chọn format.

**Tham số:**
- `text` (string): Nội dung text
- `x` (number, optional): Vị trí X (null = sử dụng margin left)
- `y` (number, optional): Vị trí Y (null = sử dụng currentY)
- `options` (object): Cấu hình text

**Options:**
```javascript
{
  fontSize: 12,           // Cỡ chữ
  fontStyle: "normal",    // "normal", "bold", "italic", "bolditalic"
  color: [0, 0, 0],      // Màu RGB
  maxWidth: 180,         // Độ rộng tối đa
  align: "left",         // "left", "center", "right", "justify"
  lineHeight: 1,         // Khoảng cách dòng
  spacing: 1             // Khoảng cách sau text
}
```

**Ví dụ:**
```javascript
pdf.addText("Hello World", null, null, {
  fontSize: 14,
  fontStyle: "bold",
  color: [255, 0, 0],
  align: "center"
});
```

### 2. addTitle(title, options)
Thêm tiêu đề chính với style đặc biệt.

**Options mặc định:**
```javascript
{
  fontSize: 18,
  fontStyle: "bold", 
  color: [0, 0, 139],
  align: "center",
  lineHeight: 7
}
```

### 3. addSubTitle(subtitle, options)
Thêm tiêu đề phụ.

**Options mặc định:**
```javascript
{
  fontSize: 14,
  fontStyle: "bold",
  color: [0, 0, 0],
  lineHeight: 5.5
}
```

### 4. addParagraph(paragraph, options)
Thêm đoạn văn thông thường.

**Options mặc định:**
```javascript
{
  fontSize: 10,
  fontStyle: "normal",
  color: [0, 0, 0],
  lineHeight: 4,
  spacing: 1
}
```

## 🎨 Mixed Text và Styling

### 1. addMixedText(textParts, options)
Thêm text với nhiều style khác nhau trong cùng một dòng.

**TextParts format:**
```javascript
[
  { text: "Normal text", style: "normal" },
  { text: "Bold text", style: "bold", color: [255, 0, 0] },
  { text: "Italic text", style: "italic", fontSize: 12 }
]
```

**Ví dụ:**
```javascript
pdf.addMixedText([
  { text: "Điều 1. ", style: "bold" },
  { text: "Nội dung quy định...", style: "normal" }
], {
  align: "justify",
  fontSize: 11
});
```

### 2. addMixedParagraph(textParts, options)
Thêm đoạn văn với mixed text, hỗ trợ xuống dòng tự động.

### 3. Helper Methods cho Mixed Text
```javascript
pdf.bold("Text in đậm")
pdf.italic("Text nghiêng") 
pdf.boldItalic("Text đậm nghiêng")
pdf.normal("Text bình thường")
pdf.colored("Text màu", [255, 0, 0])
```

**Ví dụ sử dụng:**
```javascript
pdf.addMixedParagraph([
  pdf.bold("Điều 1."),
  pdf.normal(" Quy định về "),
  pdf.italic("thời gian làm việc"),
  pdf.normal("...")
]);
```

## 📝 Danh sách và Đánh số

### 1. addNumberedList(items, options)
Tạo danh sách có đánh số tự động.

**Tham số:**
- `items` (array): Mảng các item
- `options.itemOptions`: Cấu hình cho items

**ItemOptions:**
```javascript
{
  numberStyle: "decimal",    // "decimal", "roman", "alpha", "none"
  fontSize: 10,
  indent: 6,                // Thụt lề
  lineHeight: 4,
  showIndex: true,          // Hiển thị số thứ tự
  startNumber: 1,           // Số bắt đầu
  align: "left"             // "left", "center", "right", "justify" - Canh lề
}
```

**Number Styles:**
- `"decimal"`: 1, 2, 3...
- `"roman"`: I, II, III...
- `"alpha"`: A, B, C...
- `"none"`: Chỉ hiển thị nội dung

**Alignment Options:**
- `"left"`: Canh trái (mặc định)
- `"center"`: Canh giữa
- `"right"`: Canh phải
- `"justify"`: Canh đều (dãn đều từ trái sang phải)

**Ví dụ:**
```javascript
// Danh sách canh trái (mặc định)
pdf.addNumberedList([
  "Item đầu tiên",
  "Item thứ hai", 
  "Item thứ ba"
], {
  itemOptions: {
    numberStyle: "decimal",
    fontSize: 11,
    indent: 8,
    align: "left"
  }
});

// Danh sách canh giữa
pdf.addNumberedList([
  "Item canh giữa",
  "Text dài sẽ được canh giữa tự động"
], {
  itemOptions: {
    align: "center",
    fontSize: 12
  }
});

// Danh sách canh phải
pdf.addNumberedList([
  "Item canh phải",
  "Số và text đều canh về bên phải"
], {
  itemOptions: {
    align: "right",
    fontSize: 12
  }
});

// Danh sách canh đều
pdf.addNumberedList([
  "Item canh đều",
  "Text dài sẽ được dãn đều từ lề trái đến lề phải, tạo ra khoảng cách đồng đều giữa các từ. Dòng cuối sẽ canh trái bình thường."
], {
  itemOptions: {
    align: "justify",
    fontSize: 12
  }
});
```

### 2. addMultiLevelList(items, options)
Tạo danh sách nhiều cấp độ.

**Items format:**
```javascript
[
  { text: "Level 1 item", level: 0 },
  { text: "Level 2 item", level: 1 },
  { text: "Level 3 item", level: 2 },
  { text: "Back to Level 1", level: 0 }
]
```

### 3. addNumberedText(text, options)
Thêm text có đánh số tự động.

**Options:**
```javascript
{
  numberStyle: "decimal",
  showNumber: true,
  resetOnNewStyle: false,
  indent: 6,
  numberSuffix: ". "
}
```

## 🖼️ Xử lý Hình ảnh

### 1. addImage(imageData, x, y, width, height, options)
Thêm hình ảnh với nhiều tùy chọn.

**Options:**
```javascript
{
  format: "JPEG",           // "JPEG", "PNG", "GIF", "WEBP"
  align: "left",            // "left", "center", "right"
  caption: null,            // Text chú thích
  captionOptions: {
    fontSize: 9,
    fontStyle: "italic",
    color: [100, 100, 100]
  },
  border: false,            // Viền ảnh
  borderOptions: {
    width: 1,
    color: [0, 0, 0]
  },
  compression: "MEDIUM",    // "LOW", "MEDIUM", "HIGH"
  rotation: 0               // Góc xoay (độ)
}
```

### 2. addImageFromPath(imagePath, x, y, width, height, options)
Thêm hình từ đường dẫn file.

### 3. addImageFit(imageData, x, y, maxWidth, maxHeight, options)
Thêm hình với auto-resize để fit trong khung.

**Ví dụ:**
```javascript
// Từ file path
await pdf.addImageFromPath("image/logo.jpg", null, null, 100, 50, {
  align: "center",
  caption: "Logo công ty"
});

// Auto-fit
pdf.addImageFit(imageData, null, null, 150, 100, {
  align: "center"
});
```

## ✍️ Chữ ký điện tử

### 1. addSignature(name, title, date, options)
Thêm chữ ký cơ bản không có hình.

**Options:**
```javascript
{
  align: "right",           // "left", "center", "right" 
  fontSize: 11,
  titleFontSize: 10,
  nameFontSize: 12,
  spacing: 8,               // Khoảng cách giữa các dòng
  signatureHeight: 20,      // Chiều cao vùng chữ ký
  blockWidth: 100          // Độ rộng khối chữ ký
}
```

### 2. addSignatureWithImage(name, title, imageSource, date, options)
Thêm chữ ký có hình ảnh.

**ImageSource:** Có thể là:
- File path (string): `"image/signature.png"`
- Data URL (string): `"data:image/png;base64,..."`
- Base64 (string): `"iVBORw0KGgoAAAANSUhEUgAA..."`

**Options thêm:**
```javascript
{
  dateFontSize: 10,
  imageWidth: 60,
  imageHeight: 20,
  noteText: "(Ký và ghi rõ họ tên)"
}
```

### 3. addSignatureFromFile(name, title, imagePath, date, options)
Phương thức tiện lợi để thêm chữ ký từ file.

### 4. addDualSignature(leftSig, rightSig)
Tạo layout chữ ký hai cột.

**Signature Object:**
```javascript
{
  name: "Người ký",
  title: "Chức vụ", 
  date: "01/01/2024",
  image: "path/to/signature.png",  // Optional
  options: { fontSize: 10 }        // Optional
}
```

**Ví dụ:**
```javascript
// Chữ ký đơn
pdf.addSignature("Nguyễn Văn A", "Giám đốc", "15/06/2024", {
  align: "right"
});

// Chữ ký có hình
await pdf.addSignatureFromFile(
  "Trần Thị B", 
  "Kế toán trưởng",
  "image/signature.jpg",
  "15/06/2024"
);

// Chữ ký đôi
pdf.addDualSignature(
  {
    name: "Người lập",
    title: "Nhân viên",
    date: "15/06/2024"
  },
  {
    name: "Người duyệt", 
    title: "Trưởng phòng",
    date: "16/06/2024",
    image: "image/manager-signature.png"
  }
);
```

## 📋 Fill-in Forms và Lines

### 1. addFillInLine(label, options)
Tạo đường kẻ để điền thông tin.

**Options:**
```javascript
{
  lineCount: 1,            // Số dòng
  lineLength: 100,         // Độ dài đường kẻ
  lineSpacing: 15,         // Khoảng cách giữa các dòng
  lineStyle: "solid",      // "solid", "dashed", "dotted"
  lineWidth: 0.5,          // Độ dày
  lineColor: [0, 0, 0],    // Màu đường kẻ
  labelPosition: "left",   // "left", "top", "none"
  labelWidth: 40,          // Độ rộng label
  labelAlign: "left",      // "left", "right"
  afterSpacing: 10         // Khoảng cách sau
}
```

### 2. addFillInForm(fields, options)
Tạo form với nhiều trường fill-in.

**Fields format:**
```javascript
[
  { label: "Họ tên:", lineCount: 1, lineLength: 120 },
  { label: "Địa chỉ:", lineCount: 2, lineLength: 150 },
  { label: "Điện thoại:", lineCount: 1, lineLength: 100 }
]
```

**Options:**
```javascript
{
  columns: 1,              // Số cột
  columnSpacing: 20,       // Khoảng cách giữa các cột
  rowSpacing: 8,           // Khoảng cách giữa các hàng
  fieldSpacing: 15         // Khoảng cách giữa các field
}
```

### 3. addSignatureFillIn(signers, options)
Tạo vùng chữ ký có đường kẻ.

**Signers format:**
```javascript
[
  { 
    title: "Người lập",
    name: "Tên người ký",
    lineLength: 80,
    showDate: true
  }
]
```

**Ví dụ:**
```javascript
// Fill-in line đơn giản
pdf.addFillInLine("Họ tên:", {
  lineCount: 1,
  lineLength: 120,
  lineStyle: "solid"
});

// Form hoàn chỉnh
pdf.addFillInForm([
  { label: "Họ tên:", lineCount: 1 },
  { label: "Ngày sinh:", lineCount: 1 },
  { label: "Địa chỉ:", lineCount: 2 }
], {
  columns: 2,
  columnSpacing: 30
});

// Signature form
pdf.addSignatureFillIn([
  { title: "Người lập", name: "(Ký, ghi rõ họ tên)" },
  { title: "Người duyệt", name: "(Ký, ghi rõ họ tên)" }
], {
  layout: "horizontal"
});
```

## 📚 Leader Dots và Table of Contents

### 1. addLeaderDots(leftText, rightText, options)
Tạo dòng có dấu chấm dẫn.

**Options:**
```javascript
{
  dotChar: ".",            // Ký tự dấu chấm
  spacing: 3,              // Khoảng cách giữa các dấu chấm
  minDots: 3,              // Số dấu chấm tối thiểu
  leftWidth: 100,          // Độ rộng phần trái
  rightWidth: 30,          // Độ rộng phần phải
  fontSize: 10,
  fontStyle: "normal"
}
```

### 2. addTableOfContents(items, options)
Tạo mục lục với leader dots.

**Items format:**
```javascript
[
  { title: "Chương 1: Giới thiệu", page: 1, level: 0 },
  { title: "1.1 Tổng quan", page: 2, level: 1 },
  { title: "1.2 Mục tiêu", page: 3, level: 1 },
  { title: "Chương 2: Nội dung", page: 5, level: 0 }
]
```

### 3. addPriceList(items, options)
Tạo bảng giá với leader dots.

**Items format:**
```javascript
[
  { name: "Sản phẩm A", price: 100000, unit: "VNĐ" },
  { name: "Sản phẩm B", price: 200000, unit: "VNĐ" }
]
```

### 4. addMenu(sections, options)
Tạo menu nhà hàng với leader dots.

**Ví dụ:**
```javascript
// Leader dots đơn giản
pdf.addLeaderDots("Tên sản phẩm", "Giá", {
  dotChar: ".",
  spacing: 3
});

// Mục lục
pdf.addTableOfContents([
  { title: "Giới thiệu", page: 1, level: 0 },
  { title: "Nội dung chính", page: 5, level: 0 },
  { title: "Kết luận", page: 10, level: 0 }
]);

// Bảng giá
pdf.addPriceList([
  { name: "Combo A", price: 150000 },
  { name: "Combo B", price: 200000 }
]);
```

## 🔧 Layout và Utilities

### 1. Spacing và Position
```javascript
pdf.addSpace(10);           // Thêm khoảng trống
pdf.resetPosition(50);      // Reset vị trí Y
pdf.getCurrentY();          // Lấy vị trí Y hiện tại
pdf.addNewPage();           // Thêm trang mới
```

### 2. Lines và Borders
```javascript
pdf.addLine(x1, y1, x2, y2, {
  lineWidth: 0.5,
  color: [0, 0, 0]
});
```

### 3. Headers và Footers
```javascript
pdf.addHeader("Header text", {
  fontSize: 10,
  align: "center",
  y: 10
});

pdf.addFooter("Footer text", {
  fontSize: 8,
  align: "left", 
  y: 280,
  color: [128, 128, 128]
});
```

## 📤 Export và Upload

### 1. Export Methods
```javascript
// Export thành File object để upload
const file = pdf.exportPDFFile("document.pdf");

// Export các format khác
const blob = pdf.exportPDF("blob");
const arrayBuffer = pdf.exportPDF("arraybuffer");
const dataURL = pdf.exportPDF("dataurl");
const base64 = pdf.exportPDF("base64");
```

### 2. Upload lên Server
```javascript
// Cách 1: Sử dụng File object
const file = pdf.exportPDFFile("report.pdf");
const formData = new FormData();
formData.append("pdf", file);
fetch("/upload", { method: "POST", body: formData });

// Cách 2: Sử dụng helper method
await pdf.uploadPDFToServer("/api/upload", "report.pdf", {
  fieldName: "document",
  additionalData: {
    type: "report",
    userId: "123"
  },
  fetchOptions: {
    headers: {
      "Authorization": "Bearer token"
    }
  }
});
```

### 3. Preview và Save
```javascript
pdf.previewPDF();           // Mở PDF trong tab mới
pdf.savePDF("document.pdf"); // Download file
const dataURL = pdf.generateDataURL(); // Lấy Data URL
```

## 🎯 Trường hợp đặc biệt

### 1. Xử lý Font tiếng Việt
```javascript
// Font sẽ được tự động setup trong constructor
// Nếu không load được font, sẽ fallback về font mặc định
```

### 2. Auto Page Break
```javascript
// Tự động xuống trang khi hết chỗ
pdf.checkPageBreak(50); // Kiểm tra với chiều cao yêu cầu
```

### 3. Text Overflow
```javascript
// Text tự động xuống dòng khi vượt maxWidth
pdf.addText("Đoạn text rất dài...", null, null, {
  maxWidth: 150,
  align: "justify"  // Canh đều hai bên
});
```

### 4. Mixed Content Alignment
```javascript
// Canh đều text có nhiều style
pdf.addMixedParagraph([
  pdf.bold("Bold text "),
  pdf.normal("normal text "),
  pdf.italic("italic text")
], {
  align: "justify",  // Sẽ canh đều cả mixed content
  fontSize: 11
});
```

### 5. Image Error Handling
```javascript
// Tự động tạo chữ ký text nếu không load được hình
await pdf.addSignatureFromFile("Name", "Title", "nonexistent.jpg");
// Sẽ tạo chữ ký text thay thế
```

### 6. Responsive Layout
```javascript
// Tự động điều chỉnh layout theo kích thước trang
const columnWidth = (pdf.pageWidth - pdf.margins.left - pdf.margins.right) / 2;
```

## 📋 Ví dụ hoàn chỉnh

### Tạo Quyết định hành chính
```javascript
const pdf = new JsPdfService();

// Header hai cột
const headerY = pdf.currentY;
const leftColumnX = pdf.margins.left;
const rightColumnX = pdf.pageWidth / 2 + 10;

// Cột trái
pdf.doc.text("CÔNG TY ABC", leftColumnX, headerY);
pdf.doc.text("Số: 123/QD", leftColumnX, headerY + 12);

// Cột phải  
pdf.doc.text("CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", rightColumnX, headerY);
pdf.doc.text("Độc lập - Tự do - Hạnh phúc", rightColumnX, headerY + 12);

pdf.currentY = headerY + 30;

// Nội dung chính
pdf
  .addTitle("QUYẾT ĐỊNH")
  .addSubTitle("Về việc bổ nhiệm cán bộ")
  .addParagraph("Căn cứ Luật Doanh nghiệp...")
  .addMixedParagraph([
    pdf.bold("Điều 1. "),
    pdf.normal("Bổ nhiệm ông/bà ... giữ chức vụ ...")
  ])
  .addNumberedList([
    "Họ tên: Nguyễn Văn A",
    "Chức vụ: Trưởng phòng", 
    "Từ ngày: 01/01/2024"
  ]);

// Chữ ký
await pdf.addSignatureFromFile(
  "Giám đốc",
  "Nguyễn Văn B", 
  "image/signature.jpg"
);

// Export
const file = pdf.exportPDFFile("quyet-dinh.pdf");
```

### Tạo Form đăng ký
```javascript
const pdf = new JsPdfService();

pdf
  .addTitle("PHIẾU ĐĂNG KÝ")
  .addFillInForm([
    { label: "Họ và tên:", lineCount: 1, lineLength: 120 },
    { label: "Ngày sinh:", lineCount: 1, lineLength: 80 },
    { label: "Số CMND:", lineCount: 1, lineLength: 100 },
    { label: "Địa chỉ:", lineCount: 2, lineLength: 150 },
    { label: "Điện thoại:", lineCount: 1, lineLength: 100 },
    { label: "Email:", lineCount: 1, lineLength: 120 }
  ], {
    columns: 2,
    columnSpacing: 30
  })
  .addSignatureFillIn([
    { title: "Người đăng ký", name: "(Ký, ghi rõ họ tên)" }
  ]);

pdf.savePDF("form-dang-ky.pdf");
```

## 🔍 Debug và Troubleshooting

### Console Logging
Tất cả các method đều có console.log để debug:
```javascript
// Kiểm tra console để xem thông tin debug
console.log("PDF đã được tạo:", pdfDataUrl);
console.log("Upload thành công:", result);
```

### Error Handling
```javascript
try {
  const file = pdf.exportPDFFile("test.pdf");
} catch (error) {
  console.error("Lỗi tạo PDF:", error);
}
```

### Performance Tips
1. Sử dụng `addSpace()` thay vì nhiều `addText()` trống
2. Gộp các `addText()` thành `addParagraph()` hoặc `addMixedText()`
3. Kiểm tra `getCurrentY()` để avoid overlap
4. Sử dụng `resetPosition()` khi cần thiết

---

*Tài liệu được cập nhật lần cuối: November 2024*
*Phiên bản JsPdfService: 2.0*
