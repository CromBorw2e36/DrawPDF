const obj = {
  TenCongTy: "CÔNG TY ABC",
  SoPhieu: "123/QD-ABC",
  NgayKy: "15/06/2024",
  CanCu: "Biên bản thỏa thuận chấm dứt hợp đồng",
  TenNhanVien: "NGUYỄN VĂN A",
}; // Placeholder to avoid empty file error

const pdf = new JsPdfService();
pdf
  .addTitle("QUYẾT ĐỊNH", { lineHeight: pdf.lineHeight, fontSize: 14 })
  .addSubTitle("Về việc chấm dứt Hợp đồng lao động", { align: "center", fontSize: 10 })
  .addSpace(3)
  .addSubTitle("CÔNG TY " + obj.TenCongTy, { align: "center", fontSize: 10 })
  .addParagraph(
    `- Căn cứ Bộ luật lao động hiện hành;\n` +
      `- Căn cứ Điều lệ Công ty ${obj.TenCongTy};\n` +
      `- Căn cứ hợp đồng lao động số ${obj.SoPhieu} ký ngày ${obj.NgayKy};\n` +
      `- Căn cứ ${obj.CanCu},\n`
  )
  .addSubTitle("QUYẾT ĐỊNH", { align: "center", lineHeight: pdf.lineHeight, fontSize: 10 })
  // Sử dụng addMixedParagraph để in đậm một số từ cụ thể
  .addMixedParagraph([pdf.bold("Điều 1.")], { align: "center" })
  .addMixedParagraph(
    [
      pdf.bold("Điều 2."),
      `Ông (Bà) ${obj.TenNhanVien} có trách nhiệm hoàn tất thủ tục bàn giao công việc, tài liệu, hồ sơ và các tài sản/công cụ dụng cụ (nếu có) liên quan đến vị trí đã đảm trách và thực hiện đầy đủ các thủ tục thanh lý hợp đồng lao động với Công ty theo quy định.`,
    ],
    { align: "left" }
  );

// Generate PDF and display in iframe
const pdfDataUrl = pdf.generateDataURL();
console.log(pdfDataUrl);

// Fill the iframe with PDF content
const iframe = document.querySelector("#pdfIframe");
if (iframe) {
  iframe.src = pdfDataUrl;
}
