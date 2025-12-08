# JsPdfService Documentation# JsPdfService Documentation



## 📚 Mục lục nhanh## Giới thiệu

- [Giới thiệu](#giới-thiệu)

- [Cài đặt và Khởi tạo](#cài-đặt-và-khởi-tạo)JsPdfService là một wrapper class cho jsPDF library, cung cấp các tính năng mở rộng để tạo PDF với hỗ trợ tiếng Việt, chữ ký điện tử, format text đa dạng và nhiều tính năng nâng cao khác.

- [🔤 Text và Typography](#-text-và-typography)

- [✍️ Chữ ký điện tử](#️-chữ-ký-điện-tử)## Cài đặt và Khởi tạo

- [📋 Fill-in Forms](#-fill-in-forms)

- [📊 Tables và Layouts](#-tables-và-layouts)### Dependencies

- [📄 Page Management](#-page-management)```html

- [📤 Export và Upload](#-export-và-upload)<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/3.0.3/jspdf.umd.min.js"></script>

- [💡 Ví dụ hoàn chỉnh](#-ví-dụ-hoàn-chỉnh)<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/3.0.3/polyfills.umd.js"></script>

<!-- Font tiếng Việt -->

---<script src="fonts/Roboto-Bold-normal.js"></script>

<script src="fonts/Roboto-BoldItalic-normal.js"></script>

## Giới thiệu<script src="fonts/Roboto-Italic-normal.js"></script>

<script src="fonts/Roboto-Regular-normal.js"></script>

JsPdfService là một wrapper class cho jsPDF library, cung cấp các tính năng mở rộng để tạo PDF với hỗ trợ tiếng Việt, chữ ký điện tử, format text đa dạng và nhiều tính năng nâng cao khác.<script src="jspdf-service.js"></script>

```

---

### Khởi tạo

## Cài đặt và Khởi tạo```javascript

const pdf = new JsPdfService();

<details>```

<summary><b>📦 Dependencies</b></summary>

### Cấu hình mặc định

```html```javascript

<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/3.0.3/jspdf.umd.min.js"></script>{

<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/3.0.3/polyfills.umd.js"></script>  currentY: 20,           // Vị trí Y hiện tại

<!-- Font tiếng Việt -->  lineHeight: 1,          // Khoảng cách giữa các dòng

<script src="fonts/Roboto-Bold-normal.js"></script>  pageHeight: 297,        // Chiều cao trang (A4)

<script src="fonts/Roboto-BoldItalic-normal.js"></script>  pageWidth: 210,         // Chiều rộng trang (A4)

<script src="fonts/Roboto-Italic-normal.js"></script>  margins: {              // Lề trang

<script src="fonts/Roboto-Regular-normal.js"></script>    left: 15, 

<script src="jspdf-service.js"></script>    right: 15, 

```    top: 20, 

</details>    bottom: 20

  }

<details>}

<summary><b>🚀 Khởi tạo</b></summary>```



```javascript## 🔤 Tính năng Text và Typography

const pdf = new JsPdfService();

```### 1. addText(text, x, y, options)

Thêm text với nhiều tùy chọn format.

**Cấu hình mặc định:**

```javascript**Tham số:**

{- `text` (string): Nội dung text

  currentY: 20,           // Vị trí Y hiện tại- `x` (number, optional): Vị trí X (null = sử dụng margin left)

  lineHeight: 1,          // Khoảng cách giữa các dòng- `y` (number, optional): Vị trí Y (null = sử dụng currentY)

  pageHeight: 297,        // Chiều cao trang (A4)- `options` (object): Cấu hình text

  pageWidth: 210,         // Chiều rộng trang (A4)

  margins: {              // Lề trang**Options:**

    left: 15, ```javascript

    right: 15, {

    top: 20,   fontSize: 12,           // Cỡ chữ

    bottom: 20  fontStyle: "normal",    // "normal", "bold", "italic", "bolditalic"

  }  color: [0, 0, 0],      // Màu RGB

}  maxWidth: 180,         // Độ rộng tối đa

```  align: "left",         // "left", "center", "right", "justify"

</details>  lineHeight: 1,         // Khoảng cách dòng

  spacing: 1             // Khoảng cách sau text

---}

```

## 🔤 Text và Typography

**Ví dụ:**

<details>```javascript

<summary><b>1. addText(text, x, y, options)</b> - Thêm text cơ bản</summary>pdf.addText("Hello World", null, null, {

  fontSize: 14,

Thêm text với nhiều tùy chọn format.  fontStyle: "bold",

  color: [255, 0, 0],

**Tham số:**  align: "center"

- `text` (string): Nội dung text});

- `x` (number, optional): Vị trí X (null = margin left)```

- `y` (number, optional): Vị trí Y (null = currentY)

- `options` (object): Cấu hình text### 2. addTitle(title, options)

Thêm tiêu đề chính với style đặc biệt.

**Options:**

```javascript**Options mặc định:**

{```javascript

  fontSize: 12,           // Cỡ chữ{

  fontStyle: "normal",    // "normal", "bold", "italic", "bolditalic"  fontSize: 18,

  color: [0, 0, 0],      // Màu RGB  fontStyle: "bold", 

  maxWidth: 180,         // Độ rộng tối đa  color: [0, 0, 139],

  align: "left",         // "left", "center", "right", "justify"  align: "center",

  lineHeight: 1,         // Khoảng cách dòng  lineHeight: 7

  spacing: 1             // Khoảng cách sau text}

}```

```

### 3. addSubTitle(subtitle, options)

**Ví dụ:**Thêm tiêu đề phụ.

```javascript

pdf.addText("Hello World", null, null, {**Options mặc định:**

  fontSize: 14,```javascript

  fontStyle: "bold",{

  color: [255, 0, 0],  fontSize: 14,

  align: "center"  fontStyle: "bold",

});  color: [0, 0, 0],

```  lineHeight: 5.5

</details>}

```

<details>

<summary><b>2. addTitle(title, options)</b> - Thêm tiêu đề chính</summary>### 4. addParagraph(paragraph, options)

Thêm đoạn văn thông thường.

**Options mặc định:**

```javascript**Options mặc định:**

{```javascript

  fontSize: 18,{

  fontStyle: "bold",   fontSize: 10,

  color: [0, 0, 139],  fontStyle: "normal",

  align: "center",  color: [0, 0, 0],

  lineHeight: 7  lineHeight: 4,

}  spacing: 1

```}

```

**Ví dụ:**

```javascript## 🎨 Mixed Text và Styling

pdf.addTitle("QUYẾT ĐỊNH");

```### 1. addMixedText(textParts, options)

</details>Thêm text với nhiều style khác nhau trong cùng một dòng.



<details>**TextParts format:**

<summary><b>3. addSubTitle(subtitle, options)</b> - Thêm tiêu đề phụ</summary>```javascript

[

**Options mặc định:**  { text: "Normal text", style: "normal" },

```javascript  { text: "Bold text", style: "bold", color: [255, 0, 0] },

{  { text: "Italic text", style: "italic", fontSize: 12 }

  fontSize: 14,]

  fontStyle: "bold",```

  color: [0, 0, 0],

  lineHeight: 5.5**Ví dụ:**

}```javascript

```pdf.addMixedText([

</details>  { text: "Điều 1. ", style: "bold" },

  { text: "Nội dung quy định...", style: "normal" }

<details>], {

<summary><b>4. addParagraph(text, options)</b> - Thêm đoạn văn</summary>  align: "justify",

  fontSize: 11

Tự động xuống dòng và format đoạn văn.});

```

**Options:**

```javascript### 2. addMixedParagraph(textParts, options)

{Thêm đoạn văn với mixed text, hỗ trợ xuống dòng tự động.

  fontSize: 12,

  fontStyle: "normal",### 3. Helper Methods cho Mixed Text

  align: "justify",      // Căn đều 2 bên```javascript

  lineHeight: 5,pdf.bold("Text in đậm")

  indent: 10,           // Thụt đầu dòngpdf.italic("Text nghiêng") 

  spacing: 8            // Khoảng cách sau đoạnpdf.boldItalic("Text đậm nghiêng")

}pdf.normal("Text bình thường")

```pdf.colored("Text màu", [255, 0, 0])

```

**Ví dụ:**

```javascript**Ví dụ sử dụng:**

pdf.addParagraph("Căn cứ Luật Doanh nghiệp năm 2020...", {```javascript

  indent: 15,pdf.addMixedParagraph([

  align: "justify"  pdf.bold("Điều 1."),

});  pdf.normal(" Quy định về "),

```  pdf.italic("thời gian làm việc"),

</details>  pdf.normal("...")

]);

<details>```

<summary><b>5. addMixedText(segments, options)</b> - Text nhiều style</summary>

## 📝 Danh sách và Đánh số

Kết hợp nhiều đoạn text với style khác nhau trên cùng một dòng.

### 1. addNumberedList(items, options)

**Segments format:**Tạo danh sách có đánh số tự động.

```javascript

[**Tham số:**

  { text: "Bold text", style: "bold" },- `items` (array): Mảng các item

  { text: "Normal text", style: "normal" },- `options.itemOptions`: Cấu hình cho items

  { text: "Italic text", style: "italic" }

]**ItemOptions:**

``````javascript

{

**Ví dụ:**  numberStyle: "decimal",    // "decimal", "roman", "alpha", "none"

```javascript  fontSize: 10,

pdf.addMixedText([  indent: 6,                // Thụt lề

  { text: "Điều 1. ", style: "bold" },  lineHeight: 4,

  { text: "Nội dung quy định...", style: "normal" }  showIndex: true,          // Hiển thị số thứ tự

]);  startNumber: 1,           // Số bắt đầu

```  align: "left"             // "left", "center", "right", "justify" - Canh lề

</details>}

```

<details>

<summary><b>6. addNumberedList(items, options)</b> - Danh sách đánh số</summary>**Number Styles:**

- `"decimal"`: 1, 2, 3...

**Options:**- `"roman"`: I, II, III...

```javascript- `"alpha"`: A, B, C...

{- `"none"`: Chỉ hiển thị nội dung

  startNumber: 1,

  numberFormat: (n) => `${n}.`,  // Custom format**Alignment Options:**

  indent: 10,- `"left"`: Canh trái (mặc định)

  fontSize: 12,- `"center"`: Canh giữa

  lineHeight: 5- `"right"`: Canh phải

}- `"justify"`: Canh đều (dãn đều từ trái sang phải)

```

**Ví dụ:**

**Ví dụ:**```javascript

```javascript// Danh sách canh trái (mặc định)

pdf.addNumberedList([pdf.addNumberedList([

  "Điều khoản thứ nhất",  "Item đầu tiên",

  "Điều khoản thứ hai",  "Item thứ hai", 

  "Điều khoản thứ ba"  "Item thứ ba"

]);], {

```  itemOptions: {

</details>    numberStyle: "decimal",

    fontSize: 11,

<details>    indent: 8,

<summary><b>7. addBulletList(items, options)</b> - Danh sách bullet</summary>    align: "left"

  }

**Options:**});

```javascript

{// Danh sách canh giữa

  bullet: "•",          // Ký tự bulletpdf.addNumberedList([

  indent: 10,  "Item canh giữa",

  fontSize: 12  "Text dài sẽ được canh giữa tự động"

}], {

```  itemOptions: {

</details>    align: "center",

    fontSize: 12

---  }

});

## ✍️ Chữ ký điện tử

// Danh sách canh phải

<details>pdf.addNumberedList([

<summary><b>1. addSignature(name, title, date, options)</b> - Chữ ký cơ bản</summary>  "Item canh phải",

  "Số và text đều canh về bên phải"

Thêm chữ ký không có hình ảnh.], {

  itemOptions: {

**Options:**    align: "right",

```javascript    fontSize: 12

{  }

  align: "right",           // "left", "center", "right" });

  fontSize: 11,

  titleFontSize: 10,// Danh sách canh đều

  nameFontSize: 12,pdf.addNumberedList([

  spacing: 8,  "Item canh đều",

  signatureHeight: 20,  "Text dài sẽ được dãn đều từ lề trái đến lề phải, tạo ra khoảng cách đồng đều giữa các từ. Dòng cuối sẽ canh trái bình thường."

  blockWidth: 100], {

}  itemOptions: {

```    align: "justify",

    fontSize: 12

**Ví dụ:**  }

```javascript});

pdf.addSignature("Nguyễn Văn A", "Giám đốc", "15/06/2024", {```

  align: "right"

});### 2. addMultiLevelList(items, options)

```Tạo danh sách nhiều cấp độ.

</details>

**Items format:**

<details>```javascript

<summary><b>2. addSignatureWithImage(name, title, imageSource, date, options)</b> - Chữ ký có hình</summary>[

  { text: "Level 1 item", level: 0 },

**ImageSource:** Có thể là:  { text: "Level 2 item", level: 1 },

- File path: `"image/signature.png"`  { text: "Level 3 item", level: 2 },

- Data URL: `"data:image/png;base64,..."`  { text: "Back to Level 1", level: 0 }

- Base64: `"iVBORw0KGgoAAAANSUhEUgAA..."`]

```

**Options thêm:**

```javascript### 3. addNumberedText(text, options)

{Thêm text có đánh số tự động.

  dateFontSize: 10,

  imageWidth: 60,**Options:**

  imageHeight: 20,```javascript

  noteText: "(Ký và ghi rõ họ tên)"{

}  numberStyle: "decimal",

```  showNumber: true,

  resetOnNewStyle: false,

**Ví dụ:**  indent: 6,

```javascript  numberSuffix: ". "

await pdf.addSignatureFromFile(}

  "Trần Thị B", ```

  "Kế toán trưởng",

  "image/signature.jpg",## 🖼️ Xử lý Hình ảnh

  "15/06/2024"

);### 1. addImage(imageData, x, y, width, height, options)

```Thêm hình ảnh với nhiều tùy chọn.

</details>

**Options:**

<details>```javascript

<summary><b>3. addDualSignature(leftSig, rightSig)</b> - Chữ ký 2 cột</summary>{

  format: "JPEG",           // "JPEG", "PNG", "GIF", "WEBP"

**Signature Object:**  align: "left",            // "left", "center", "right"

```javascript  caption: null,            // Text chú thích

{  captionOptions: {

  name: "Người ký",    fontSize: 9,

  title: "Chức vụ",     fontStyle: "italic",

  date: "01/01/2024",    color: [100, 100, 100]

  image: "path/to/signature.png",  // Optional  },

  options: { fontSize: 10 }        // Optional  border: false,            // Viền ảnh

}  borderOptions: {

```    width: 1,

    color: [0, 0, 0]

**Ví dụ:**  },

```javascript  compression: "MEDIUM",    // "LOW", "MEDIUM", "HIGH"

pdf.addDualSignature(  rotation: 0               // Góc xoay (độ)

  {}

    name: "Người lập",```

    title: "Nhân viên",

    date: "15/06/2024"### 2. addImageFromPath(imagePath, x, y, width, height, options)

  },Thêm hình từ đường dẫn file.

  {

    name: "Người duyệt", ### 3. addImageFit(imageData, x, y, maxWidth, maxHeight, options)

    title: "Trưởng phòng",Thêm hình với auto-resize để fit trong khung.

    date: "16/06/2024",

    image: "image/manager-signature.png"**Ví dụ:**

  }```javascript

);// Từ file path

```await pdf.addImageFromPath("image/logo.jpg", null, null, 100, 50, {

</details>  align: "center",

  caption: "Logo công ty"

<details>});

<summary><b>4. addSecondarySignature(options)</b> ⭐ - Chữ ký nháy (góc trang)</summary>

// Auto-fit

Thêm chữ ký nháy (chữ ký phụ) hiển thị ở góc trang - tự động xuất hiện trên **TẤT CẢ các trang**.pdf.addImageFit(imageData, null, null, 150, 100, {

  align: "center"

**Đặc điểm:**});

- ✅ Chữ ký nhỏ gọn (15x15mm mặc định)```

- ✅ Hiển thị ở các góc trang (top-left, top-right, bottom-left, bottom-right)

- ✅ Có thể chọn nhiều vị trí cùng lúc## ✍️ Chữ ký điện tử

- ✅ Tự động xuất hiện khi tạo trang mới

- ✅ Hỗ trợ hiển thị số trang (VD: "Trang 1", "Trang 2"...)### 1. addSignature(name, title, date, options)

- ✅ Nếu có hình: hiển thị hình ảnhThêm chữ ký cơ bản không có hình.

- ✅ Nếu không có hình: hiển thị nameTag dạng watermark

**Options:**

**Options:**```javascript

```javascript{

{  align: "right",           // "left", "center", "right" 

  imageData: null,                    // Base64 image data (optional)  fontSize: 11,

  nameTag: "Secondary Signature",     // Text watermark (chữ không dấu)  titleFontSize: 10,

  positions: ["top-right"],           // Array: "top-left", "top-right", "bottom-left", "bottom-right"  nameFontSize: 12,

  width: 15,                          // Chiều rộng (mm)  spacing: 8,               // Khoảng cách giữa các dòng

  height: 15,                         // Chiều cao (mm)  signatureHeight: 20,      // Chiều cao vùng chữ ký

  margin: 5,                          // Khoảng cách từ mép trang (mm)  blockWidth: 100          // Độ rộng khối chữ ký

  fontSize: 8,                        // Font size cho nameTag}

  showPageNumber: false               // Hiển thị số trang sau nameTag```

}

```### 2. addSignatureWithImage(name, title, imageSource, date, options)

Thêm chữ ký có hình ảnh.

**Ví dụ:**

**ImageSource:** Có thể là:

```javascript- File path (string): `"image/signature.png"`

// 1. Chữ ký nháy với nameTag (watermark)- Data URL (string): `"data:image/png;base64,..."`

pdf.addSecondarySignature({- Base64 (string): `"iVBORw0KGgoAAAANSUhEUgAA..."`

  nameTag: "Nguoi duyet",

  positions: ["top-right"],**Options thêm:**

  width: 15,```javascript

  height: 15,{

  margin: 5  dateFontSize: 10,

});  imageWidth: 60,

  imageHeight: 20,

// 2. Chữ ký nháy với số trang ⭐  noteText: "(Ký và ghi rõ họ tên)"

pdf.addSecondarySignature({}

  nameTag: "Trang",```

  positions: ["top-right"],

  showPageNumber: true  // "Trang_1", "Trang_2", "Trang_3"...### 3. addSignatureFromFile(name, title, imagePath, date, options)

});Phương thức tiện lợi để thêm chữ ký từ file.



// 3. Chữ ký nháy với hình ảnh### 4. addDualSignature(leftSig, rightSig)

pdf.addSecondarySignature({Tạo layout chữ ký hai cột.

  imageData: "data:image/png;base64,...",

  positions: ["top-right", "bottom-left"],**Signature Object:**

  width: 20,```javascript

  height: 20{

});  name: "Người ký",

  title: "Chức vụ", 

// 4. Nhiều chữ ký nháy khác nhau  date: "01/01/2024",

pdf.addSecondarySignature({  image: "path/to/signature.png",  // Optional

  nameTag: "Nguoi lap",  options: { fontSize: 10 }        // Optional

  positions: ["top-left"],}

  width: 12,```

  height: 12,

  fontSize: 7**Ví dụ:**

});```javascript

// Chữ ký đơn

pdf.addSecondarySignature({pdf.addSignature("Nguyễn Văn A", "Giám đốc", "15/06/2024", {

  nameTag: "Ke toan",  align: "right"

  positions: ["bottom-right"],});

  width: 15,

  height: 15,// Chữ ký có hình

  showPageNumber: true  // "Ke toan_1", "Ke toan_2"...await pdf.addSignatureFromFile(

});  "Trần Thị B", 

```  "Kế toán trưởng",

  "image/signature.jpg",

**Lưu ý:**  "15/06/2024"

- NameTag nên dùng chữ không dấu để hiển thị đẹp);

- Chữ ký nháy sẽ tự động thêm vào khi gọi `addNewPage()` hoặc `checkPageBreak()`

- Có thể thêm nhiều chữ ký nháy với cấu hình khác nhau// Chữ ký đôi

- `showPageNumber: true` rất hữu ích để đánh số trang tự độngpdf.addDualSignature(

- Kích thước nhỏ gọn, không chiếm nhiều diện tích trang  {

    name: "Người lập",

</details>    title: "Nhân viên",

    date: "15/06/2024"

---  },

  {

## 📋 Fill-in Forms    name: "Người duyệt", 

    title: "Trưởng phòng",

<details>    date: "16/06/2024",

<summary><b>1. addFillInLine(label, options)</b> - Đường kẻ điền thông tin</summary>    image: "image/manager-signature.png"

  }

**Options:**);

```javascript```

{

  lineCount: 1,            // Số dòng### 5. addSecondarySignature(options)

  lineLength: 100,         // Độ dài đường kẻThêm chữ ký nháy (chữ ký phụ) hiển thị ở góc trang - tự động xuất hiện trên **TẤT CẢ các trang**.

  lineSpacing: 15,         // Khoảng cách giữa các dòng

  lineStyle: "solid",      // "solid", "dashed", "dotted"**Đặc điểm:**

  lineWidth: 0.5,- Chữ ký nhỏ gọn (15x15mm mặc định)

  lineColor: [0, 0, 0],- Hiển thị ở các góc trang (top-left, top-right, bottom-left, bottom-right)

  labelPosition: "left",   // "left", "top", "none"- Có thể chọn nhiều vị trí cùng lúc

  labelWidth: 40- Tự động xuất hiện khi tạo trang mới

}- Nếu có hình: hiển thị hình ảnh

```- Nếu không có hình: hiển thị nameTag dạng watermark màu trắng



**Ví dụ:****Options:**

```javascript```javascript

pdf.addFillInLine("Họ và tên:", {{

  lineLength: 120,  imageData: null,                    // Base64 image data (optional)

  lineCount: 1  nameTag: "Secondary Signature",     // Text watermark (chữ không dấu)

});  positions: ["top-right"],           // Array: "top-left", "top-right", "bottom-left", "bottom-right"

```  width: 15,                          // Chiều rộng (mm)

</details>  height: 15,                         // Chiều cao (mm)

  margin: 5,                          // Khoảng cách từ mép trang (mm)

<details>  fontSize: 8,                        // Font size cho nameTag

<summary><b>2. addFillInForm(fields, options)</b> - Form nhiều trường</summary>  showPageNumber: false               // Hiển thị số trang sau nameTag (VD: "Nguoi duyet 1", "Nguoi duyet 2")

}

**Fields format:**```

```javascript

[**Ví dụ:**

  { label: "Họ và tên:", lineCount: 1, lineLength: 120 },```javascript

  { label: "Địa chỉ:", lineCount: 2, lineLength: 150 }// Chữ ký nháy với nameTag (watermark)

]pdf.addSecondarySignature({

```  nameTag: "Nguoi duyet",

  positions: ["top-right"],

**Options:**  width: 15,

```javascript  height: 15,

{  margin: 5

  columns: 1,              // Số cột});

  columnSpacing: 30,       // Khoảng cách giữa các cột

  labelWidth: 50// Chữ ký nháy với số trang ⭐

}pdf.addSecondarySignature({

```  nameTag: "Trang",

  positions: ["top-right"],

**Ví dụ:**  showPageNumber: true  // Hiển thị "Trang 1", "Trang 2", "Trang 3"...

```javascript});

pdf.addFillInForm([

  { label: "Họ và tên:", lineCount: 1, lineLength: 120 },// Chữ ký nháy với hình ảnh

  { label: "Ngày sinh:", lineCount: 1, lineLength: 80 },pdf.addSecondarySignature({

  { label: "Địa chỉ:", lineCount: 2, lineLength: 150 }  imageData: "data:image/png;base64,...",

], {  positions: ["top-right", "bottom-left"],

  columns: 2,  width: 20,

  columnSpacing: 30  height: 20

});});

```

</details>// Nhiều chữ ký nháy khác nhau

pdf.addSecondarySignature({

<details>  nameTag: "Nguoi lap",

<summary><b>3. addSignatureFillIn(signatures, options)</b> - Khung chữ ký</summary>  positions: ["top-left"],

  width: 12,

Tạo khung để ký tay trực tiếp lên PDF.  height: 12,

  fontSize: 7

**Signatures format:**});

```javascript

[pdf.addSecondarySignature({

  { title: "Người lập", name: "(Ký, ghi rõ họ tên)" },  nameTag: "Ke toan",

  { title: "Người duyệt", name: "(Ký và đóng dấu)" }  positions: ["bottom-right"],

]  width: 15,

```  height: 15,

  showPageNumber: true  // "Ke toan 1", "Ke toan 2"...

**Ví dụ:**});

```javascript

pdf.addSignatureFillIn([// Thêm nội dung - chữ ký nháy tự động xuất hiện trên mọi trang

  { title: "Người đăng ký", name: "(Ký, ghi rõ họ tên)" }pdf.addTitle("TÀI LIỆU");

]);pdf.addParagraph("Nội dung...");

```// ... khi tạo trang mới, chữ ký nháy tự động xuất hiện

</details>```



---**Lưu ý:**

- NameTag nên dùng chữ không dấu để hiển thị đẹp

## 📊 Tables và Layouts- Chữ ký nháy sẽ tự động thêm vào khi gọi `addNewPage()` hoặc `checkPageBreak()`

- Có thể thêm nhiều chữ ký nháy với cấu hình khác nhau

<details>- Kích thước nhỏ gọn, không chiếm nhiều diện tích trang

<summary><b>1. addSimpleTable(headers, rows, options)</b> - Bảng đơn giản</summary>- `showPageNumber: true` rất hữu ích để đánh số trang tự động



**Options:**## 📋 Fill-in Forms và Lines

```javascript

{### 1. addFillInLine(label, options)

  startX: 15,Tạo đường kẻ để điền thông tin.

  startY: null,

  columnWidths: null,      // Auto calculate**Options:**

  headerHeight: 10,```javascript

  rowHeight: 8,{

  fontSize: 10,  lineCount: 1,            // Số dòng

  headerBold: true,  lineLength: 100,         // Độ dài đường kẻ

  borders: true,  lineSpacing: 15,         // Khoảng cách giữa các dòng

  borderColor: [0, 0, 0]  lineStyle: "solid",      // "solid", "dashed", "dotted"

}  lineWidth: 0.5,          // Độ dày

```  lineColor: [0, 0, 0],    // Màu đường kẻ

  labelPosition: "left",   // "left", "top", "none"

**Ví dụ:**  labelWidth: 40,          // Độ rộng label

```javascript  labelAlign: "left",      // "left", "right"

pdf.addSimpleTable(  afterSpacing: 10         // Khoảng cách sau

  ["STT", "Họ tên", "Chức vụ", "Ghi chú"],}

  [```

    ["1", "Nguyễn Văn A", "Giám đốc", ""],

    ["2", "Trần Thị B", "Kế toán", ""]### 2. addFillInForm(fields, options)

  ],Tạo form với nhiều trường fill-in.

  {

    columnWidths: [15, 50, 40, 50]**Fields format:**

  }```javascript

);[

```  { label: "Họ tên:", lineCount: 1, lineLength: 120 },

</details>  { label: "Địa chỉ:", lineCount: 2, lineLength: 150 },

  { label: "Điện thoại:", lineCount: 1, lineLength: 100 }

<details>]

<summary><b>2. addTwoColumnLayout(leftContent, rightContent, options)</b> - Layout 2 cột</summary>```



**Options:****Options:**

```javascript```javascript

{{

  leftWidth: 90,           // Độ rộng cột trái  columns: 1,              // Số cột

  spacing: 10,             // Khoảng cách giữa 2 cột  columnSpacing: 20,       // Khoảng cách giữa các cột

  fontSize: 11,  rowSpacing: 8,           // Khoảng cách giữa các hàng

  align: "left"  fieldSpacing: 15         // Khoảng cách giữa các field

}}

``````



**Ví dụ:**### 3. addSignatureFillIn(signers, options)

```javascriptTạo vùng chữ ký có đường kẻ.

pdf.addTwoColumnLayout(

  ["CÔNG TY ABC", "Số: 123/QD"],**Signers format:**

  ["CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", "Độc lập - Tự do - Hạnh phúc"]```javascript

);[

```  { 

</details>    title: "Người lập",

    name: "Tên người ký",

---    lineLength: 80,

    showDate: true

## 📄 Page Management  }

]

<details>```

<summary><b>Các phương thức quản lý trang</b></summary>

**Ví dụ:**

```javascript```javascript

// Thêm trang mới// Fill-in line đơn giản

pdf.addNewPage();pdf.addFillInLine("Họ tên:", {

  lineCount: 1,

// Kiểm tra và tự động xuống trang  lineLength: 120,

pdf.checkPageBreak(requiredHeight);  lineStyle: "solid"

});

// Thêm khoảng trống

pdf.addSpace(10);  // 10mm// Form hoàn chỉnh

pdf.addFillInForm([

// Reset vị trí Y  { label: "Họ tên:", lineCount: 1 },

pdf.resetPosition(20);  { label: "Ngày sinh:", lineCount: 1 },

  { label: "Địa chỉ:", lineCount: 2 }

// Lấy vị trí Y hiện tại], {

const currentY = pdf.getCurrentY();  columns: 2,

  columnSpacing: 30

// Thông tin trang});

const pageInfo = pdf.getPageInfo();

// Returns: { currentPage, totalPages, pageSize, currentY }// Signature form

```pdf.addSignatureFillIn([

</details>  { title: "Người lập", name: "(Ký, ghi rõ họ tên)" },

  { title: "Người duyệt", name: "(Ký, ghi rõ họ tên)" }

---], {

  layout: "horizontal"

## 📤 Export và Upload});

```

<details>

<summary><b>1. savePDF(filename)</b> - Lưu file PDF</summary>## 📚 Leader Dots và Table of Contents



```javascript### 1. addLeaderDots(leftText, rightText, options)

pdf.savePDF("document.pdf");Tạo dòng có dấu chấm dẫn.

```

</details>**Options:**

```javascript

<details>{

<summary><b>2. generateBlob()</b> - Tạo Blob</summary>  dotChar: ".",            // Ký tự dấu chấm

  spacing: 3,              // Khoảng cách giữa các dấu chấm

```javascript  minDots: 3,              // Số dấu chấm tối thiểu

const blob = pdf.generateBlob();  leftWidth: 100,          // Độ rộng phần trái

```  rightWidth: 30,          // Độ rộng phần phải

</details>  fontSize: 10,

  fontStyle: "normal"

<details>}

<summary><b>3. exportPDFFile(filename)</b> - Export File object</summary>```



```javascript### 2. addTableOfContents(items, options)

const file = pdf.exportPDFFile("document.pdf");Tạo mục lục với leader dots.

// Returns File object để upload

```**Items format:**

</details>```javascript

[

<details>  { title: "Chương 1: Giới thiệu", page: 1, level: 0 },

<summary><b>4. openInNewTab()</b> - Mở PDF trong tab mới</summary>  { title: "1.1 Tổng quan", page: 2, level: 1 },

  { title: "1.2 Mục tiêu", page: 3, level: 1 },

```javascript  { title: "Chương 2: Nội dung", page: 5, level: 0 }

pdf.openInNewTab();]

``````

</details>

### 3. addPriceList(items, options)

<details>Tạo bảng giá với leader dots.

<summary><b>5. uploadToServer(url, filename, additionalData)</b> - Upload lên server</summary>

**Items format:**

```javascript```javascript

const result = await pdf.uploadToServer([

  "/api/upload",  { name: "Sản phẩm A", price: 100000, unit: "VNĐ" },

  "document.pdf",  { name: "Sản phẩm B", price: 200000, unit: "VNĐ" }

  { userId: 123, type: "contract" }]

);```



console.log(result.success);### 4. addMenu(sections, options)

console.log(result.fileUrl);Tạo menu nhà hàng với leader dots.

```

</details>**Ví dụ:**

```javascript

---// Leader dots đơn giản

pdf.addLeaderDots("Tên sản phẩm", "Giá", {

## 💡 Ví dụ hoàn chỉnh  dotChar: ".",

  spacing: 3

<details>});

<summary><b>📄 Tạo Quyết định hành chính</b></summary>

// Mục lục

```javascriptpdf.addTableOfContents([

const pdf = new JsPdfService();  { title: "Giới thiệu", page: 1, level: 0 },

  { title: "Nội dung chính", page: 5, level: 0 },

// Header hai cột  { title: "Kết luận", page: 10, level: 0 }

pdf.addTwoColumnLayout(]);

  ["CÔNG TY ABC", "Số: 123/QD"],

  ["CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", "Độc lập - Tự do - Hạnh phúc"]// Bảng giá

);pdf.addPriceList([

  { name: "Combo A", price: 150000 },

pdf.addSpace(20);  { name: "Combo B", price: 200000 }

]);

// Nội dung chính```

pdf

  .addTitle("QUYẾT ĐỊNH")## 🔧 Layout và Utilities

  .addSubTitle("Về việc bổ nhiệm cán bộ")

  .addSpace(10)### 1. Spacing và Position

  .addParagraph("Căn cứ Luật Doanh nghiệp năm 2020...", {```javascript

    align: "justify"pdf.addSpace(10);           // Thêm khoảng trống

  })pdf.resetPosition(50);      // Reset vị trí Y

  .addSpace(5)pdf.getCurrentY();          // Lấy vị trí Y hiện tại

  .addMixedText([pdf.addNewPage();           // Thêm trang mới

    { text: "Điều 1. ", style: "bold" },```

    { text: "Bổ nhiệm ông/bà ... giữ chức vụ ...", style: "normal" }

  ])### 2. Lines và Borders

  .addSpace(5)```javascript

  .addNumberedList([pdf.addLine(x1, y1, x2, y2, {

    "Họ tên: Nguyễn Văn A",  lineWidth: 0.5,

    "Chức vụ: Trưởng phòng",   color: [0, 0, 0]

    "Từ ngày: 01/01/2024"});

  ]);```



// Chữ ký### 3. Headers và Footers

await pdf.addSignatureFromFile(```javascript

  "Nguyễn Văn B",pdf.addHeader("Header text", {

  "Giám đốc",   fontSize: 10,

  "image/signature.jpg",  align: "center",

  "01/01/2024"  y: 10

);});



// Exportpdf.addFooter("Footer text", {

pdf.savePDF("quyet-dinh.pdf");  fontSize: 8,

```  align: "left", 

</details>  y: 280,

  color: [128, 128, 128]

<details>});

<summary><b>📝 Tạo Form đăng ký</b></summary>```



```javascript## 📤 Export và Upload

const pdf = new JsPdfService();

### 1. Export Methods

pdf```javascript

  .addTitle("PHIẾU ĐĂNG KÝ")// Export thành File object để upload

  .addSpace(10)const file = pdf.exportPDFFile("document.pdf");

  .addFillInForm([

    { label: "Họ và tên:", lineCount: 1, lineLength: 120 },// Export các format khác

    { label: "Ngày sinh:", lineCount: 1, lineLength: 80 },const blob = pdf.exportPDF("blob");

    { label: "Số CMND:", lineCount: 1, lineLength: 100 },const arrayBuffer = pdf.exportPDF("arraybuffer");

    { label: "Địa chỉ:", lineCount: 2, lineLength: 150 },const dataURL = pdf.exportPDF("dataurl");

    { label: "Điện thoại:", lineCount: 1, lineLength: 100 },const base64 = pdf.exportPDF("base64");

    { label: "Email:", lineCount: 1, lineLength: 120 }```

  ], {

    columns: 2,### 2. Upload lên Server

    columnSpacing: 30```javascript

  })// Cách 1: Sử dụng File object

  .addSpace(20)const file = pdf.exportPDFFile("report.pdf");

  .addSignatureFillIn([const formData = new FormData();

    { title: "Người đăng ký", name: "(Ký, ghi rõ họ tên)" }formData.append("pdf", file);

  ]);fetch("/upload", { method: "POST", body: formData });



pdf.savePDF("form-dang-ky.pdf");// Cách 2: Sử dụng helper method

```await pdf.uploadPDFToServer("/api/upload", "report.pdf", {

</details>  fieldName: "document",

  additionalData: {

<details>    type: "report",

<summary><b>📋 Tài liệu với chữ ký nháy và số trang</b></summary>    userId: "123"

  },

```javascript  fetchOptions: {

const pdf = new JsPdfService();    headers: {

      "Authorization": "Bearer token"

// Thêm chữ ký nháy với số trang    }

pdf.addSecondarySignature({  }

  nameTag: "Trang",});

  positions: ["top-right"],```

  showPageNumber: true,

  fontSize: 8### 3. Preview và Save

});```javascript

pdf.previewPDF();           // Mở PDF trong tab mới

// Thêm chữ ký nháy người duyệtpdf.savePDF("document.pdf"); // Download file

pdf.addSecondarySignature({const dataURL = pdf.generateDataURL(); // Lấy Data URL

  nameTag: "Nguoi duyet",```

  positions: ["bottom-left"],

  fontSize: 7## 🎯 Trường hợp đặc biệt

});

### 1. Xử lý Font tiếng Việt

// Nội dung tài liệu```javascript

pdf.addTitle("BÁO CÁO THÁNG 12/2025");// Font sẽ được tự động setup trong constructor

pdf.addSpace(10);// Nếu không load được font, sẽ fallback về font mặc định

```

// Thêm nhiều trang - chữ ký nháy tự động xuất hiện

for (let i = 1; i <= 5; i++) {### 2. Auto Page Break

  pdf.addSubTitle(`Phần ${i}`);```javascript

  pdf.addParagraph("Lorem ipsum dolor sit amet...");// Tự động xuống trang khi hết chỗ

  // Trang mới tự động tạo khi hết chỗpdf.checkPageBreak(50); // Kiểm tra với chiều cao yêu cầu

}```



pdf.savePDF("bao-cao.pdf");### 3. Text Overflow

``````javascript

</details>// Text tự động xuống dòng khi vượt maxWidth

pdf.addText("Đoạn text rất dài...", null, null, {

---  maxWidth: 150,

  align: "justify"  // Canh đều hai bên

## 🔍 Debug và Tips});

```

<details>

<summary><b>⚙️ Performance Tips</b></summary>### 4. Mixed Content Alignment

```javascript

1. Sử dụng `addSpace()` thay vì nhiều `addText()` trống// Canh đều text có nhiều style

2. Gộp các `addText()` thành `addParagraph()` hoặc `addMixedText()`pdf.addMixedParagraph([

3. Kiểm tra `getCurrentY()` để tránh overlap  pdf.bold("Bold text "),

4. Sử dụng `resetPosition()` khi cần thiết  pdf.normal("normal text "),

5. Với chữ ký nháy, chỉ gọi `addSecondarySignature()` một lần ở đầu  pdf.italic("italic text")

</details>], {

  align: "justify",  // Sẽ canh đều cả mixed content

<details>  fontSize: 11

<summary><b>🐛 Error Handling</b></summary>});

```

```javascript

try {### 5. Image Error Handling

  const file = pdf.exportPDFFile("test.pdf");```javascript

} catch (error) {// Tự động tạo chữ ký text nếu không load được hình

  console.error("Lỗi tạo PDF:", error);await pdf.addSignatureFromFile("Name", "Title", "nonexistent.jpg");

}// Sẽ tạo chữ ký text thay thế

``````



Tất cả các method đều có console.log để debug. Kiểm tra console khi gặp vấn đề.### 6. Responsive Layout

</details>```javascript

// Tự động điều chỉnh layout theo kích thước trang

---const columnWidth = (pdf.pageWidth - pdf.margins.left - pdf.margins.right) / 2;

```

## 📊 API Reference Quick Links

## 📋 Ví dụ hoàn chỉnh

| Tính năng | Method | Mô tả |

|-----------|--------|-------|### Tạo Quyết định hành chính

| **Text** | `addText()` | Text cơ bản |```javascript

| | `addTitle()` | Tiêu đề chính |const pdf = new JsPdfService();

| | `addParagraph()` | Đoạn văn tự động xuống dòng |

| | `addMixedText()` | Text nhiều style |// Header hai cột

| **Lists** | `addNumberedList()` | Danh sách đánh số |const headerY = pdf.currentY;

| | `addBulletList()` | Danh sách bullet |const leftColumnX = pdf.margins.left;

| **Signatures** | `addSignature()` | Chữ ký cơ bản |const rightColumnX = pdf.pageWidth / 2 + 10;

| | `addSignatureWithImage()` | Chữ ký có hình |

| | `addDualSignature()` | Chữ ký 2 cột |// Cột trái

| | `addSecondarySignature()` ⭐ | Chữ ký nháy góc trang |pdf.doc.text("CÔNG TY ABC", leftColumnX, headerY);

| **Forms** | `addFillInLine()` | Đường kẻ điền thông tin |pdf.doc.text("Số: 123/QD", leftColumnX, headerY + 12);

| | `addFillInForm()` | Form nhiều trường |

| | `addSignatureFillIn()` | Khung chữ ký |// Cột phải  

| **Tables** | `addSimpleTable()` | Bảng dữ liệu |pdf.doc.text("CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", rightColumnX, headerY);

| | `addTwoColumnLayout()` | Layout 2 cột |pdf.doc.text("Độc lập - Tự do - Hạnh phúc", rightColumnX, headerY + 12);

| **Pages** | `addNewPage()` | Trang mới |

| | `checkPageBreak()` | Tự động xuống trang |pdf.currentY = headerY + 30;

| **Export** | `savePDF()` | Lưu file |

| | `exportPDFFile()` | Export File object |// Nội dung chính

| | `uploadToServer()` | Upload lên server |pdf

  .addTitle("QUYẾT ĐỊNH")

---  .addSubTitle("Về việc bổ nhiệm cán bộ")

  .addParagraph("Căn cứ Luật Doanh nghiệp...")

*Tài liệu được cập nhật lần cuối: December 8, 2025*    .addMixedParagraph([

*Phiên bản JsPdfService: 2.1*      pdf.bold("Điều 1. "),

*Tính năng mới: addSecondarySignature() với showPageNumber - Chữ ký nháy tự động trên mọi trang*    pdf.normal("Bổ nhiệm ông/bà ... giữ chức vụ ...")

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

*Tài liệu được cập nhật lần cuối: December 6, 2025*
*Phiên bản JsPdfService: 2.1*
*Tính năng mới: addSecondarySignature() - Chữ ký nháy tự động trên mọi trang*
