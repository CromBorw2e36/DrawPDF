async function init() {
  const obj = {
    TenCongTy: "HÙNG VƯƠNG CORPORATION",
    SoPhieu: "123/QD-ABC",
    NgayKy: "15/06/2024",
    CanCu: "Biên bản thỏa thuận chấm dứt hợp đồng",
    TenNhanVien: "NGUYỄN VĂN A",
    ChucDanh: "Nhân viên Kinh doanh",
    PhongBan: "Phòng Kinh doanh",
    NgayHieuLuc: "01/07/2024",
    TenNguoiDaiDien: "LÊ THỊ B",
  }; // Placeholder to avoid empty file error

  const pdf = new JsPdfService();

  // Thêm header với hai cột
  const headerY = pdf.currentY;
  const leftColumnX = pdf.margins.left;
  const rightColumnX = pdf.pageWidth / 2 + 10;
  const columnWidth = (pdf.pageWidth - pdf.margins.left - pdf.margins.right) / 2 - 10;

  // Cột trái - Thông tin công ty (canh giữa)
  const leftCenterX = leftColumnX + columnWidth / 2;
  
  // Dòng 1: Công ty + Tên công ty
  pdf.doc.setFontSize(10);
  const companyText = "CÔNG TY " + obj.TenCongTy;
  const companyWidth = pdf.doc.getTextWidth(companyText);
  pdf.doc.setFont("Roboto", "bold");
  pdf.doc.text(companyText, leftCenterX - companyWidth / 2, headerY);
  
  // Dòng 2: Khoảng trống
  const line2Y = headerY + 6;
  
  // Dòng 3: Gạch dưới
  const line3Y = headerY + 12;
  const underlineText = "_________________";
  const underlineWidth = pdf.doc.getTextWidth(underlineText);
  pdf.doc.setFont("Roboto", "normal");
  pdf.doc.text(underlineText, leftCenterX - underlineWidth / 2, line3Y);
  
  // Dòng 4: Số quyết định
  const line4Y = headerY + 18;
  const soPhieuText = "Số: " + obj.SoPhieu;
  const soPhieuWidth = pdf.doc.getTextWidth(soPhieuText);
  pdf.doc.setFont("Roboto", "italic");
  pdf.doc.text(soPhieuText, leftCenterX - soPhieuWidth / 2, line4Y);

  // Cột phải - Thông tin quốc gia và ngày ký (canh giữa)
  const rightCenterX = rightColumnX + columnWidth / 2;

  // Dòng 1: Cộng hòa xã hội chủ nghĩa Việt Nam
  pdf.doc.setFontSize(10);
  const vnText = "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM";
  const vnWidth = pdf.doc.getTextWidth(vnText);
  pdf.doc.setFont("Roboto", "bold");
  pdf.doc.text(vnText, rightCenterX - vnWidth / 2, headerY);
  
  // Dòng 2: Độc lập - Tự do - Hạnh phúc
  const docLapText = "Độc lập - Tự do - Hạnh phúc";
  const docLapWidth = pdf.doc.getTextWidth(docLapText);
  pdf.doc.setFont("Roboto", "bold");
  pdf.doc.text(docLapText, rightCenterX - docLapWidth / 2, line2Y);
  
  // Dòng 3: Gạch dưới
  const rightUnderlineText = "_________________";
  const rightUnderlineWidth = pdf.doc.getTextWidth(rightUnderlineText);
  pdf.doc.setFont("Roboto", "normal");
  pdf.doc.text(rightUnderlineText, rightCenterX - rightUnderlineWidth / 2, line3Y);
  
  // Dòng 4: Tây Ninh, ngày
  const dateText = "Tây Ninh, ngày " + obj.NgayKy;
  const dateWidth = pdf.doc.getTextWidth(dateText);
  pdf.doc.setFont("Roboto", "italic");
  pdf.doc.text(dateText, rightCenterX - dateWidth / 2, line4Y);

  // Cập nhật vị trí Y sau header
  pdf.currentY = headerY + 25;
  pdf.addSpace(5);

  pdf
    .addSpace(5)
    .addTitle("QUYẾT ĐỊNH", { lineHeight: 4, fontSize: 18 })
    .addSubTitle("Về việc chấm dứt Hợp đồng lao động", { align: "center", fontSize: 10, lineHeight: 3 })
    .addSpace(2)
    .addSubTitle("CÔNG TY " + obj.TenCongTy, { align: "center", fontSize: 10, lineHeight: 3 })
    .addParagraph(`- Căn cứ Bộ luật lao động hiện hành;`)
    .addParagraph(`- Căn cứ Điều lệ Công ty ${obj.TenCongTy};`)
    .addParagraph(`- Căn cứ hợp đồng lao động số ${obj.SoPhieu} ký ngày ${obj.NgayKy};`)
    .addParagraph(`- Căn cứ ${obj.CanCu},`)
    .addSpace(3)
    .addSubTitle("QUYẾT ĐỊNH", { align: "center", lineHeight: 3, fontSize: 10 })
    .addMixedParagraph([pdf.bold("Điều 1."), pdf.normal("Chấm dứt Hợp đồng lao động đối với:")], {
      align: "left",
    })
    .addNumberedList(
      [
        "-  Ông (Bà): " + obj.TenNhanVien,
        "-  Chức danh/Vị trí: " + obj.ChucDanh,
        "-  Phòng ban/Bộ phận: " + obj.PhongBan,
        "-  Kể từ ngày: " + obj.NgayHieuLuc,
      ],
      {
        itemOptions: {
          numberStyle: "decimal",
          fontSize: 10,
          indent: 6,
          lineHeight: 3,
          showIndex: false,
        },
      }
    )
    .addSpace(3)
    .addMixedParagraph(
      [
        pdf.bold("Điều 2."),
        `Ông (Bà) ${obj.TenNhanVien} có trách nhiệm hoàn tất thủ tục bàn giao công việc, tài liệu, hồ sơ và các tài sản/công cụ dụng cụ (nếu có) liên quan đến vị trí đã đảm trách và thực hiện đầy đủ các thủ tục thanh lý hợp đồng lao động với Công ty theo quy định.`,
      ],
      { align: "justify" }
    )
    .addSpace(3)
    .addMixedParagraph(
      [
        pdf.bold("Điều 3."),
        `Bộ phận Nhân sự có trách nhiệm giải quyết các chế độ, quyền lợi (nếu có) cho người lao động thôi việc theo quy định.`,
      ],
      { align: "justify" }
    )
    .addSpace(3)
    .addMixedParagraph(
      [
        pdf.bold("Điều 4."),
        `Quyết định có hiệu lực kể từ ngày ký/${obj.NgayKy}. Các phòng ban/bộ phận có liên quan và nhân sự tại điều 1 chịu trách nhiệm thi hành Quyết định này.`,
      ],
      { align: "justify" }
    )
    .addSpace(3);
  // Signature
  await pdf.addSignatureFromFile(
    obj.TenNguoiDaiDien,
    "NGƯỜI ĐƯỢC ỦY QUYỀN]",
    "",
    "[CHỨC DANH CỦA NGƯỜI ĐẠI DIỆN THEO PHÁP LUẬT/",
    {
      noteText: "(Ký và ghi rõ họ tên)",
      spacing: pdf.lineHeight * 5,
      dateFontSize: 10,
      titleFontSize: 10,
      nameTag: "signaturePath",
    }
  );

  pdf
    .addSubTitle("Nơi nhận", { align: "left", fontSize: 10, lineHeight: pdf.lineHeight })
    .addParagraph(`- Như điều 4 “để thực hiện”;`, { align: "left", fontSize: 8 })
    .addParagraph(`- Lưu: Bộ phận Nhân sự. `, { align: "left", fontSize: 8 })
    .addFooter("HDG-HRA-SOP02.F03 (02-01/04/2025)", {
      align: "left",
      fontSize: 8,
      color: [128, 128, 128],
    });

  // Generate PDF and display in iframe
  const pdfDataUrl = pdf.generateDataURL();
  console.log(pdfDataUrl);

  // Fill the iframe with PDF content
  const iframe = document.querySelector("#pdfIframe");
  if (iframe) {
    iframe.src = pdfDataUrl;
  }
}
init();
