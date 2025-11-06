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
  // pdf.addTitle("BẢNG ĐÁNH GIÁ ỨNG VIÊN", { fontFamily: "Roboto" }).addSpace(4);
  doc.autoTable({
    startY: pdf.getCurrentY() - 10,
    theme: "grid",
    margin: { left: M.left, right: M.right },
    tableWidth: usableW, 
    styles: {
      font: "Roboto",
      fontStyle: "bold",
      fontSize: 17,
      cellPadding: 2,
      valign: "middle",     
      minCellHeight: 20,
      lineColor: [0, 0, 0],
    },
    body: [
      [{ content: "" }, "BẢNG ĐÁNH GIÁ ỨNG VIÊN"],
    ],    columnStyles: {
      0: { cellWidth: 50 }, 
      1: { cellWidth: usableW - 50 + 5, halign: "center" }, 
    },
    didDrawCell: function (dataCell) {
      // Chèn ảnh vào cột đầu tiên
      data.imgPath = "../image/hong-hung-logo.png"; 
      if (dataCell.column.index === 0 && dataCell.row.index === 0 && data.imgPath) {
        const { x, y, width, height } = dataCell.cell;
        const imgSize = Math.min(width, height) - 4; 
        const imgX = x + (width - imgSize) / 2;
        const imgY = y + (height - imgSize) / 2;
        doc.addImage(data.imgPath, "PNG", imgX, imgY, imgSize, imgSize);
      }
    },
  });
  pdf.addSpace(20);  
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
    styles: { font: "Roboto", fontStyle: "normal", fontSize: 10, cellPadding: 2, valign: "middle",lineColor: [0, 0, 0], },
    headStyles: { font: "Roboto", fontStyle: "bold" },
    body: [
      ["Họ tên ứng viên", { content: data.hoTen || "", colSpan: 3 }],
      ["Ngày tháng năm sinh", { content: data.ngaySinh || "", colSpan: 3 }],
      ["Trình độ chuyên môn", data.trinhDo || "", "Giới tính:", data.gioiTinh || ""],
      [
        { content: "Vị trí /chức danh ứng tuyển", styles: { halign: "left" } },
        { content: data.viTri || "", colSpan: 3},
      ],
      [
        {
          content: "Điểm Bài kiểm tra năng lực chuyên môn (nếu có):",
          colSpan: 1,
          styles: { halign: "left" },
        },
        {
          content: data.diemTest ?? "",
          colSpan: 3,
        },
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

  const total = bodyDanhGia.reduce((s, r) => s + Number(r[2] || 0), 0);
  // Thêm dòng tổng kết vào cuối bảng
  bodyDanhGia.push([
      { content: "Tổng kết", 
        colSpan: 2,
        styles: { halign: "center", fontStyle: "bold"}
      },
      total,
    ]
  );

  doc.autoTable({
    startY: pdf.getCurrentY() + 2,
    theme: "grid",
    margin: { left: M.left, right: M.right },
    tableWidth: usableW,    
    head: [["Tiêu chí đánh giá", "Bằng chứng đánh giá", "Điểm đánh giá (Từ 0 đến 3 điểm)"]],
    body: bodyDanhGia,    
    styles: { font: "Roboto", fontStyle: "normal", fontSize: 10, cellPadding: 2, valign: "middle",lineColor: [0, 0, 0], },
    headStyles: { 
      font: "Roboto", 
      fontStyle: "bold", 
      fillColor: [255, 255, 255], 
      textColor: [0, 0, 0],
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
      halign: "center",
    }, // Màu nền trắng, chữ đen và border đen cho header
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: 120 },
      2: { cellWidth: 25, halign: "center" },
    },
  });
  pdf.resetPosition(doc.lastAutoTable.finalY + 4);

  //  ghi chú
  setRoboto("normal");
  pdf.addParagraph(
    [
      "Kết quả điểm đánh giá:",
      "- Đạt 22 - 24 điểm: Xem xét xếp ngạch chuyên gia;",
      "- Đạt 14 - 21 điểm: Xem xét xếp ngạch chuyên viên;",
      "- Đạt 06 - 13 điểm: Xem xét xếp ngạch nhân viên;",
      "- Đạt dưới 06 điểm: Không tuyển dụng.",
    ],
    { fontSize: 10, lineHeight: 4, spacing: 0.5, fontFamily: "Roboto" }
  );

  // =========================================================
  // TRANG 2
  pdf.addNewPage();

  doc.autoTable({
    startY: pdf.getCurrentY() - 10,
    theme: "grid",
    margin: { left: M.left, right: M.right },
    tableWidth: usableW, 
    styles: {
      font: "Roboto",
      fontStyle: "bold",
      fontSize: 17,
      cellPadding: 2,
      valign: "middle",     
      minCellHeight: 20,
      lineColor: [0, 0, 0],
    },
    body: [
      [{ content: "" }, "BẢNG ĐÁNH GIÁ ỨNG VIÊN"],
    ],    columnStyles: {
      0: { cellWidth: 50 }, 
      1: { cellWidth: usableW - 50 , halign: "center" }, 
    },
    didDrawCell: function (dataCell) {
      // Chèn ảnh vào cột đầu tiên
      data.imgPath = "../image/hong-hung-logo.png"; 
      if (dataCell.column.index === 0 && dataCell.row.index === 0 && data.imgPath) {
        const { x, y, width, height } = dataCell.cell;
        const imgSize = Math.min(width, height) - 4; 
        const imgX = x + (width - imgSize) / 2;
        const imgY = y + (height - imgSize) / 2;
        doc.addImage(data.imgPath, "PNG", imgX, imgY, imgSize, imgSize);
      }
    },
  });
  pdf.addSpace(15); 

  // Thiết lập font size 10 cho nội dung trang 2
  doc.setFontSize(10);
  // ---- block phỏng vấn: nhãn trái + khung phải
  function drawInterviewBlock(label, pass, fail, height, obj = {}) {
    obj.content = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet, mauris in tristique lobortis, dolor quam pulvinar velit, in fringilla nisl magna at metus. Nullam suscipit a magna ut porttitor. Nunc lacus arcu, ornare in iaculis a, interdum nec ligula. Morbi vestibulum volutpat ultrices.";
    obj.name = "Nguyễn Văn A";
    obj.pathSignature = "../image/chu-ki-mau.jpg";
    const col1W = 42;
    const x1 = M.left,
      y1 = pdf.getCurrentY() + 2;
    box(x1, y1, col1W, height + 10); // khung trái
    setRoboto("bold");
    doc.text(obj.label ?? label, x1 + 2, y1 + (height + 10) / 2);
    setRoboto("normal");

    const x2 = x1 + col1W,
      w2 = usableW - col1W;
    box(x2, y1, w2, height + 10); // khung phải    // nội dung
    setRoboto("italic");
    const contentText = "Nội dung nhận xét: (kiến thức chuyên môn, kinh nghiệm, kỹ năng, thái độ...)";
    const textLines = doc.splitTextToSize(contentText, w2 - 8); // Chia text thành nhiều dòng
    let textY = y1 + 6;
    textLines.forEach((line, index) => {
      doc.text(line, x2 + 2, textY + (index * 4));
    });
    setRoboto("normal");

    //Note chỉnh sửa: Nội dung nhận xét
    if (obj.content) {
      const commentLines = doc.splitTextToSize(obj.content, w2 - 8);
      let commentY = textY + (textLines.length * 4) + 2;
      commentLines.forEach((line, index) => {
        doc.text(line, x2 + 2, commentY + (index * 4));
      });
    }    // ký tên & họ tên
    doc.text("Ký tên:", x2 + 2, y1 + height - 10);
    
    // Note chỉnh sửa: Thêm hình chữ ký số nếu có
    if (obj.pathSignature) {
      try {
        const signatureX = x2 + w2 - 60; // Đặt chữ ký ở phía bên phải
        const signatureY = y1 + height - 18;
        const signatureW = 50;
        const signatureH = 15;
        doc.addImage(obj.pathSignature, "JPEG", signatureX, signatureY, signatureW, signatureH);
      } catch (error) {
        console.warn("Không thể load chữ ký:", obj.pathSignature, error);
        // Vẽ placeholder cho chữ ký
        const signatureX = x2 + w2 - 60;
        const signatureY = y1 + height - 18;
        doc.setFillColor(240, 240, 240);
        doc.rect(signatureX, signatureY, 50, 15, "F");
        doc.setTextColor(128, 128, 128);
        doc.setFontSize(8);
        doc.text("Chữ ký", signatureX + 25, signatureY + 8, { align: "center" });
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
      }
    }
    
    doc.text(
      "Họ và tên: " + (obj.name || "........................................................"),
      x2 + 2,
      y1 + height - 4
    );

    // kết quả checkbox
    const baseY = y1 + height + 4;
    let cx = x2 + w2 - 120;
    doc.text("Kết quả :", cx, baseY);
    cx += 14;
    tick(cx, baseY - 4, !!pass);
    doc.text("Đạt/Phù hợp", cx + 6, baseY);
    cx += 50;
    tick(cx, baseY - 4, !!fail);
    doc.text("Không đạt/Không phù hợp", cx + 6, baseY);

    // cập nhật vị trí currentY chính xác
    pdf.currentY = y1 + height + 10;
  }

  drawInterviewBlock("Phỏng vấn viên 1", data.pv1Pass, data.pv1Fail, 40);
  drawInterviewBlock("Phỏng vấn viên 2", data.pv2Pass, data.pv2Fail, 40);

  // Phòng nhân sự (cao hơn)
  drawInterviewBlock("Phòng Nhân sự", data.nsPass, data.nsFail, 45);

  // =========================================================
  // 3. PHÊ DUYỆT KẾT QUẢ TUYỂN CHỌN VÀ CHẾ ĐỘ NHÂN SỰ
  pdf.addSpace(10).addSubTitle("3. PHÊ DUYỆT KẾT QUẢ TUYỂN CHỌN VÀ CHẾ ĐỘ NHÂN SỰ", {
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

  //Note chỉnh sửa: Chổ này nên để add hình chữ ký số nếu có

  pdf.resetPosition(topY + blockH + 4);

  // Footer (số trang)
  pdf.addFooter("Trang {pageNumber}/{totalPages}", { fontFamily: "Roboto" })
      .addFooter("HDY-HRD-SOP01.F05 (01-01/10/2024)", {
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
