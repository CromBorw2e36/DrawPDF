async function init() {
  const obj = {
    TenCongTy: "CÔNG TY ABC",
    SoPhieu: "123/QD-ABC",
    NgayKy: "15/06/2024",
    CanCu: "Biên bản thỏa thuận chấm dứt hợp đồng",
    TenNhanVien: "NGUYỄN VĂN A",
    ChucDanh: "Nhân viên Kinh doanh",
    PhongBan: "Phòng Kinh doanh",
    NgayHieuLuc: "01/07/2024",
  }; // Placeholder to avoid empty file error

  const pdf = new JsPdfService();
  pdf
  .addDualSignature(
            {
                name: 'Công ty ' + obj.TenCongTy,
                title: '--------------',
                date: 'Số: ' + obj.SoPhieu
            },
            {
                name: 'Cộng hòa xã hội chủ nghĩa Việt Nam'.toUpperCase(), 
                title: 'Độc lập - Tự do - Hạnh phúc',
                date: [
                    { text: "Tây Ninh, ngày ", style: 'italic' },
                    { text: obj.NgayKy, style: 'italic' }
                ]
            }
        )
    .addTitle("QUYẾT ĐỊNH", { lineHeight: pdf.lineHeight, fontSize: 14 })
    .addSubTitle("Về việc chấm dứt Hợp đồng lao động", { align: "center", fontSize: 10 })
    .addSpace(3)
    .addSubTitle("CÔNG TY " + obj.TenCongTy, { align: "center", fontSize: 10 })
    .addParagraph(`- Căn cứ Bộ luật lao động hiện hành;`)
    .addParagraph(`- Căn cứ Điều lệ Công ty ${obj.TenCongTy};`)
    .addParagraph(`- Căn cứ hợp đồng lao động số ${obj.SoPhieu} ký ngày ${obj.NgayKy};`)
    .addParagraph(`- Căn cứ ${obj.CanCu},`)
    .addSubTitle("QUYẾT ĐỊNH", { align: "center", lineHeight: pdf.lineHeight, fontSize: 10 })
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
          lineHeight: pdf.lineHeight,
          showIndex: false,
        },
      }
    )
    .addSpace(2)
    .addMixedParagraph(
      [
        pdf.bold("Điều 2."),
        `Ông (Bà) ${obj.TenNhanVien} có trách nhiệm hoàn tất thủ tục bàn giao công việc, tài liệu, hồ sơ và các tài sản/công cụ dụng cụ (nếu có) liên quan đến vị trí đã đảm trách và thực hiện đầy đủ các thủ tục thanh lý hợp đồng lao động với Công ty theo quy định.`,
      ],
      { align: "justify" }
    )
    .addMixedParagraph(
      [
        pdf.bold("Điều 3."),
        `Bộ phận Nhân sự có trách nhiệm giải quyết các chế độ, quyền lợi (nếu có) cho người lao động thôi việc theo quy định.`,
      ],
      { align: "justify" }
    )
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
    "Nguyễn Văn A",
    "NHÂN VIÊN",
    "../image/chu-ki-mau.jpg",
    "Ngày 10/11/2025"
  );

  pdf
    .addSubTitle("Nơi nhận", { align: "left", fontSize: 10, lineHeight: pdf.lineHeight})
    .addParagraph(`- Như điều 4 “để thực hiện”;`, { align: "left", fontSize: 8 })
    .addParagraph(`- Lưu: Bộ phận Nhân sự. `, { align: "left", fontSize: 8 })
    .addFooter("HDG-HRA-SOP02.F03 (02-01/04/2025)", { align: "left", fontSize: 8, color: [128, 128, 128] });

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
