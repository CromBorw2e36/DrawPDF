async function init(data = {}) {
  const pdf = new JsPdfService();
  const doc = pdf.doc;

  // Thiết lập font Roboto mặc định cho toàn bộ document
  doc.setFont("Roboto", "normal");

  // tiện dùng
  const M = pdf.margins;
  const pageW = pdf.pageWidth;
  const usableW = pageW - M.left - M.right;

  // ====== helpers nội bộ ======
  const setRoboto = (style = "normal") => doc.setFont("Roboto", style);
  const box = (x, y, w, h) => doc.rect(x, y, w, h);
  const tick = (x, y, checked) => {
    doc.rect(x, y, 4, 4);
    if (checked) {
      const lw = doc.getLineWidth();
      doc.setLineWidth(0.5);
      doc.line(x + 0.7, y + 0.7, x + 3.3, y + 3.3);
      doc.line(x + 3.3, y + 0.7, x + 0.7, y + 3.3);
      doc.setLineWidth(lw);
    }
  };

  // =========================================================
  // HEADER
  pdf.addTitle("BẢNG ĐÁNH GIÁ ỨNG VIÊN", { fontFamily: "Roboto" }).addSpace(4);
  setRoboto("normal");

  // =========================================================
  // 1. THÔNG TIN ỨNG VIÊN
  pdf.addSubTitle("1. THÔNG TIN ỨNG VIÊN", {
    fontSize: 12,
    fontFamily: "Roboto",
    lineHeight: pdf.lineHeight,
  });
  doc.autoTable({
    startY: pdf.getCurrentY() + 2,
    theme: "grid",
    margin: { left: M.left, right: M.right },
    tableWidth: usableW,
    styles: { font: "Roboto", fontStyle: "normal", fontSize: 10, cellPadding: 2, valign: "middle" },
    headStyles: { font: "Roboto", fontStyle: "bold" },
    body: [
      ["Họ tên ứng viên", { content: data.hoTen || "", colSpan: 3 }],
      ["Ngày tháng năm sinh", { content: data.ngaySinh || "", colSpan: 3 }],
      ["Trình độ chuyên môn", data.trinhDo || "", "Giới tính:", data.gioiTinh || ""],
      [
        { content: "Vị trí /chức danh ứng tuyển", colSpan: 3, styles: { halign: "left" } },
        data.viTri || "",
      ],
      [
        {
          content: "Điểm Bài kiểm tra năng lực chuyên môn (nếu có):",
          colSpan: 3,
          styles: { halign: "left" },
        },
        data.diemTest ?? "",
      ],
    ],
    columnStyles: {
      0: { cellWidth: 55 },
      1: { cellWidth: 60 },
      2: { cellWidth: 25 },
      3: { cellWidth: 45 },
    },
  });
  pdf.resetPosition(doc.lastAutoTable.finalY + 3);
  pdf.addSpace(4);
  // =========================================================
  // 2. ĐÁNH GIÁ ỨNG VIÊN
  pdf.addSubTitle("2. ĐÁNH GIÁ ỨNG VIÊN", {
    fontSize: 12,
    fontFamily: "Roboto",
    lineHeight: pdf.lineHeight,
  });

  const bodyDanhGia = [
    [
      "1  Trình độ học vấn",
      "Bằng cấp/Chứng chỉ …………………………………………………………………………………………………….",
      data.d1 ?? "",
    ],
    [
      "2  Thâm niên",
      "Xác nhận qua hồ sơ, lý lịch cá nhân …………………………………………………………………………………………………….",
      data.d2 ?? "",
    ],
    [
      "3  Ngoại ngữ",
      "Bằng cấp/Chứng chỉ hoặc qua kỳ thi do Công ty tổ chức …………………………………………………………………………………………………….",
      data.d3 ?? "",
    ],
    [
      "4  Tin học",
      "Bằng cấp/Chứng chỉ hoặc qua kỳ thi do Công ty tổ chức …………………………………………………………………………………………………….",
      data.d4 ?? "",
    ],
    [
      "5  Kinh nghiệm",
      "Xác nhận qua hồ sơ, lý lịch cá nhân và quá trình làm việc …………………………………………………………………………………………………….",
      data.d5 ?? "",
    ],
    [
      "6  Năng lực giải quyết vấn đề",
      "Xác nhận qua quá trình làm việc tại Công ty hoặc các Đơn vị khác trước khi tuyển dụng …………………………………………………………………………………………………….",
      data.d6 ?? "",
    ],
    [
      "7  Năng lực tư vấn, đào tạo",
      "Xác nhận qua quá trình làm việc tại Công ty hoặc các Đơn vị khác trước khi tuyển dụng …………………………………………………………………………………………………….",
      data.d7 ?? "",
    ],
    [
      "8  Năng lực nghiên cứu, sáng tạo",
      "Xác nhận qua:\n+ Công bố bài báo hoặc công trình nghiên cứu trên các tạp chí khoa học hoặc các hội đồng nghiệm thu;\n+ Hoặc, kết quả thực hiện các sáng kiến cải tiến mang lại hiệu quả cao cho Công ty;\n+ Hoặc, kết quả ứng dụng các kỹ thuật chuyên môn cao tại Bệnh viện.\n………………………………………………………………………………………………….",
      data.d8 ?? "",
    ],
  ];

  doc.autoTable({
    startY: pdf.getCurrentY() + 2,
    theme: "grid",
    margin: { left: M.left, right: M.right },
    tableWidth: usableW,
    head: [["Tiêu chí đánh giá", "Bằng chứng đánh giá", "Điểm đánh giá (Từ 0 đến 3 điểm)"]],
    body: bodyDanhGia,
    styles: { font: "Roboto", fontStyle: "normal", fontSize: 10, cellPadding: 2, valign: "middle" },
    headStyles: { font: "Roboto", fontStyle: "bold" },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 100 },
      2: { cellWidth: 25, halign: "center" },
    },
  });
  pdf.resetPosition(doc.lastAutoTable.finalY + 4);
  pdf.addSpace(4);

  // Tổng điểm & ghi chú
  const total = bodyDanhGia.reduce((s, r) => s + Number(r[2] || 0), 0);
  setRoboto("bold");
  doc.text(`TỔNG ĐIỂM: ${total}`, M.left, pdf.getCurrentY());
  setRoboto("normal");
  pdf.addSpace(4);
  pdf.addParagraph(
    [
      "Kết quả điểm đánh giá:",
      "- Đạt 22 - 24 điểm: Xem xét xếp ngạch chuyên gia;",
      "- Đạt 14 - 21 điểm: Xem xét xếp ngạch chuyên viên;",
      "- Đạt 06 - 13 điểm: Xem xét xếp ngạch nhân viên;",
      "- Đạt dưới 06 điểm: Không tuyển dụng.",
    ],
    { fontSize: 9, lineHeight: 3, spacing: 0.5, fontFamily: "Roboto" }
  );

  // =========================================================
  // TRANG 2
  pdf.addNewPage();
  pdf.addTitle("BẢNG ĐÁNH GIÁ ỨNG VIÊN", { fontFamily: "Roboto" }).addSpace(4);
  // Thiết lập font size 10 cho nội dung trang 2
  doc.setFontSize(10);
  // ---- block phỏng vấn: nhãn trái + khung phải
  function drawInterviewBlock(label, pass, fail, height) {
    const col1W = 42;
    const x1 = M.left,
      y1 = pdf.getCurrentY() + 2;
    box(x1, y1, col1W, height); // khung trái
    setRoboto("bold");
    doc.text(label, x1 + 2, y1 + 6);
    setRoboto("normal");

    const x2 = x1 + col1W,
      w2 = usableW - col1W;
    box(x2, y1, w2, height); // khung phải

    // nội dung
    doc.text(
      "Nội dung nhận xét: (kiến thức chuyên môn, kinh nghiệm, kỹ năng, thái độ...)",
      x2 + 2,
      y1 + 6
    );

    // vẽ các đường gạch chấm thủ công để tránh chồng lấp
    for (let i = 0; i < 2; i++) {
      const lineY = y1 + 12 + i * 5;
      // vẽ đường chấm
      let dotX = x2 + 4;
      while (dotX < x2 + w2 - 8) {
        doc.circle(dotX, lineY, 0.3, "F");
        dotX += 3;
      }
    }

    // ký tên & họ tên
    doc.text("Ký tên:", x2 + 2, y1 + height - 10);
    doc.text(
      "Họ và tên: ........................................................",
      x2 + 2,
      y1 + height - 4
    );

    // kết quả checkbox
    const baseY = y1 + height - 4;
    let cx = x2 + w2 - 120;
    doc.text("Kết quả :", cx, baseY);
    cx += 14;
    tick(cx, baseY - 4, !!pass);
    doc.text("Đạt/Phù hợp", cx + 6, baseY);
    cx += 50;
    tick(cx, baseY - 4, !!fail);
    doc.text("Không đạt/Không phù hợp", cx + 6, baseY);

    // cập nhật vị trí currentY chính xác
    pdf.currentY = y1 + height + 2;
  }

  drawInterviewBlock("Phỏng vấn viên 1", data.pv1Pass, data.pv1Fail, 40);
  drawInterviewBlock("Phỏng vấn viên 2", data.pv2Pass, data.pv2Fail, 40);

  // Phòng nhân sự (cao hơn)
  drawInterviewBlock("Phòng Nhân sự", data.nsPass, data.nsFail, 45);

  // =========================================================
  // 3. PHÊ DUYỆT KẾT QUẢ TUYỂN CHỌN VÀ CHẾ ĐỘ NHÂN SỰ
  pdf.addSpace(4).addSubTitle("3. PHÊ DUYỆT KẾT QUẢ TUYỂN CHỌN VÀ CHẾ ĐỘ NHÂN SỰ", {
    fontSize: 12,
    fontFamily: "Roboto",
    lineHeight: pdf.lineHeight,
  });
  doc.setFontSize(8);

  const leftW = usableW / 2 - 2,
    rightW = usableW / 2 - 2;
  const leftX = M.left,
    rightX = M.left + leftW + 4;
  const topY = pdf.getCurrentY() + 2,
    blockH = 65;

  // khối trái
  box(leftX, topY, leftW, blockH);
  let ly = topY + 6;
  tick(leftX + 2, ly - 4, !!data.approveHire);
  doc.text("Đồng ý tuyển dụng", leftX + 8, ly);
  ly += 6;
  tick(leftX + 2, ly - 4, !!data.returnFile);
  doc.text("Trả hồ sơ (không đạt)", leftX + 8, ly);

  ly += 8;
  doc.text(`Ngày nhận việc: ${data.ngayNhanViec || "......./....../........"}`, leftX + 2, ly);
  ly += 5;
  doc.text(`Cấp bậc nhân sự: ${data.capBac || ""}`, leftX + 2, ly);
  ly += 5;
  doc.text(`Ngạch lương: ${data.ngachLuong || ""}`, leftX + 2, ly);
  ly += 5;
  doc.text(`Nhóm chức danh: ${data.nhomChucDanh || ""}`, leftX + 2, ly);
  ly += 5;
  doc.text(`Bậc: ${data.bac || ""}`, leftX + 2, ly);

  ly += 6;
  doc.text("(Chọn 1 trong 2 lựa chọn)", leftX + 2, ly);
  ly += 6;
  tick(leftX + 2, ly - 4, !!data.hdtv);
  doc.text("Ký HĐTV và đánh giá thử việc: ... tháng", leftX + 8, ly);
  ly += 6;
  tick(leftX + 2, ly - 4, !!data.hdlc);
  doc.text("Ký HĐLĐ xác định thời hạn (theo đề xuất của Công ty)", leftX + 8, ly);

  // khối phải: cấp thẩm quyền phê duyệt
  box(rightX, topY, rightW, blockH);
  setRoboto("bold");
  doc.text("CẤP THẨM QUYỀN PHÊ DUYỆT", rightX + rightW / 2, topY + 6, { align: "center" });
  setRoboto("normal");
  doc.text("Họ tên:", rightX + 8, topY + 18);
  doc.text("Ngày: ......./....../.........", rightX + 8, topY + 25);
  // vùng ký tên
  doc.text("(Ký và ghi rõ họ tên)", rightX + rightW / 2, topY + 35, { align: "center" });
  // đường gạch ký
  doc.line(rightX + 14, topY + 50, rightX + rightW - 14, topY + 50);

  pdf.resetPosition(topY + blockH + 4);

  // Footer (số trang)
  pdf.addFooter("Trang {pageNumber}/{totalPages}", { fontFamily: "Roboto" });

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
