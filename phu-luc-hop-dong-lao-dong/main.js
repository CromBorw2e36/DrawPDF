async function init(data = {}) {
  const isCpyt = data.isCpyt;
  //các properties cần thiết của biến data

  const pdf = new JsPdfService();
  pdf.lineHeight += 2;
  const M = pdf.margins;
  const lineHeightPage = 4;
  const fontSizeTitle = 16;
  const fontSizeSubTitle = 11;
  const fontSizeContent = 11;
  const val = (v, fallback = "........................") =>
    v && String(v).trim() ? String(v) : fallback;
  const fill = (label, value, opts = {}) => {
    pdf.addFillInLine(label, {
      presetValue: value && String(value).trim() ? String(value) : null,
      labelWidth: opts.labelWidth ?? 70,
      lineLength: opts.lineLength ?? 100,
      gap: opts.gap ?? 6,
      style: opts.style ?? "dotted",
      fontSize: opts.fontSize ?? fontSizeContent,
      align: opts.align ?? "left",
    });
  };

  // ===== Header =====
  pdf.addHeader("HD000232", { fontSize: 8, color: [119, 119, 119], align: "right" });
  pdf.addText("CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM", null, pdf.getCurrentY(), {
    fontSize: 12,
    fontStyle: "bold",
    align: "center",
    spacing: 2,
  });
  pdf.addText("Độc Lập – Tự Do – Hạnh Phúc", null, null, {
    fontSize: 11,
    fontStyle: "bold",
    align: "center",
    spacing: 2,
  });
  pdf.addText("---o0o---", null, null, { fontSize: 10.5, align: "center", spacing: 5 });
  pdf.addTitle("PHỤ LỤC HỢP ĐỒNG LAO ĐỘNG", {
    fontSize: 16,
    fontStyle: "bold",
    align: "center",
    spacing: 1,
    lineHeight: pdf.lineHeight,
  });
  pdf
    .addText(`Số : ${val(data.soVanBan)}`, null, null, {
      fontSize: 10.5,
      align: "center",
      spacing: 5,
    })
    .addSpace(4);
  pdf.addParagraph(
    `Hôm nay, ngày ${(val(data.ngayHop), "..../..../........")} tại Văn phòng` +
      ` ${val(data.companyShortName, "Công ty ........................")}, chúng tôi gồm có:`,
    { fontSize: fontSizeContent, lineHeight: lineHeightPage, spacing: 1, align: "justify" }
  );
  // ===== I.	Bên Người sử dụng lao động: Công ty TNHH XNK TM CN DV Hùng Duy  =====
  pdf.addSubTitle(`I. Bên Người sử dụng lao động: ${val(data.tenCongTy, "")}`.toUpperCase(), {
    fontSize: fontSizeSubTitle,
    lineHeight: lineHeightPage - 1,
  });
  pdf.addMixedParagraph(
    [
      `Đại điện bởi ông/bà     : `,
      pdf.bold(val(data.a_representative)),
      `    - Quốc tịch: ${val(data.a_nationality)}`,
    ],
    {
      fontSize: fontSizeContent,
      lineHeight: lineHeightPage,
      spacing: 0,
    }
  );
  const arrContent1 = [`Chức vụ                         : ${val(data.a_title)}`];
  if (data.soUyQuuyen) {
    arrContent1.push(`Theo ủy quyền số ${val(data.soUyQuyen)}, ngày ${val(data.ngayUyQuyen)}`);
  }
  arrContent1.push(
    ...[
      `Địa chỉ                           : ${val(data.companyAddress)}`,
      `Điện thoại                     : ${val(data.companyPhone)}, FAX: ${val(data.companyFax)}`,
    ]
  );
  pdf.addParagraph(arrContent1.join("\n"), {
    fontSize: fontSizeContent,
    lineHeight: lineHeightPage,
    spacing: 1,
  });
  pdf.addMixedParagraph([`Sau đây gọi tắt là `, pdf.bold("“Công ty”, “Người sử dụng lao động”")], {
    fontSize: fontSizeContent,
    lineHeight: lineHeightPage,
    spacing: 1,
  });
  // ===== II. Bên Người lao động =====
  pdf.addSpace(2).addSubTitle("II. Bên Người lao động:", {
    fontSize: fontSizeSubTitle,
    lineHeight: pdf.lineHeight,
  });
  pdf.addParagraph(
    [
      `Ông (Bà)                         : ${val(data.b_fullName)}, ` +
        `Giới tính: ${val(data.b_gender)}, Quốc tịch: ${val(data.b_nationality)}`,
      `Ngày/tháng/năm sinh : ${val(data.b_birthYear)}`,
      `Địa chỉ thường trú        : ${val(data.b_address)}`,
      `Số CCCD                        : ${val(data.b_idNo)}, ` +
        `Cấp ngày: ${val(data.b_idDate)}, Tại: ${val(data.b_idPlace)}`,
    ].join("\n"),
    { fontSize: fontSizeContent, lineHeight: lineHeightPage, spacing: 1 }
  );
  pdf.addMixedParagraph([`Sau đây gọi tắt là`, pdf.bold(" “Người lao động”")], {
    fontSize: fontSizeContent,
    lineHeight: lineHeightPage,
    spacing: 1,
  });

  pdf.addParagraph(
    [
      `Căn cứ Hợp đồng lao động (HĐLĐ) số ${val(data.soHopDong)} ký ngày` +
        ` ${val(data.ngayKyHopDong)} và nhu cầu sử dụng lao động, ` +
        `hai bên cùng nhau thỏa thuận để sửa đổi/bổ sung thêm một số Điều trong Hợp đồng đã ký trên, như sau:`,
    ],
    { fontSize: fontSizeContent, lineHeight: lineHeightPage, spacing: 1, align: "justify" }
  );
  // ===== Điều 1. Nội dung sửa đổi/bổ sung nội dung của HĐLĐ như sau:	 =====
  pdf.addSpace(2).addSubTitle("Điều 1. Nội dung sửa đổi/bổ sung nội dung của HĐLĐ như sau:", {
    fontSize: fontSizeSubTitle,
    lineHeight: 1.5,
  });
  if (isCpyt)
    pdf.addParagraph(
      [
        `Sửa đổi, bổ sung điểm a khoản 1 điều 3 của Hợp đồng lao động thành:`,
        `Mức lương chức danh công việc: ${val(data.luong)}.đồng/tháng.`,
      ],
      { fontSize: fontSizeContent, lineHeight: lineHeightPage, spacing: 1, align: "left" }
    );
  else
    pdf.addNumberedList(
      data.noiDungSuDoiHopDong ?? [
        `............................................................................................................................................................................`,
        `............................................................................................................................................................................`,
        `............................................................................................................................................................................`,
      ],
      {
        itemOptions: {
          numberStyle: "number",
          numberFormat: "-",
          indent: 4,
          fontSize: fontSizeContent,
          lineHeight: pdf.lineHeight,
          spacing: 1,
          align: "justify",
        },
        resetNumbers: true,
      }
    );
  // ===== Điều 2. Thời gian thực hiện: =====
  pdf.addSpace(1).addSubTitle("Điều 2. Thời gian thực hiện:", {
    fontSize: fontSizeSubTitle,
    lineHeight: 1.5,
  });
  pdf.addMixedParagraph(
    [
      `Những điều khoản thay đổi được ghi tại Điều 1 của Phụ lục hợp đồng này có hiệu lực kể từ ngày`,
      pdf.bold(val(data.ngayHieuLucPhuLuc || "..../..../....")),
      ` cho đến khi có Phụ lục hợp đồng mới thay thế/bổ sung.`,
    ],
    { fontSize: fontSizeContent, lineHeight: lineHeightPage, spacing: 1, align: "justify" }
  );
  pdf.addParagraph(
    [
      `Phụ lục hợp đồng này là một bộ phận không tách rời của Hợp đồng lao động số ${val(
        data.soHopDong
      )} và được lập thành hai (02) bản, mỗi bên giữ một (01) bản có giá trị pháp lý như nhau.`,
    ],
    {
      fontSize: fontSizeContent,
      lineHeight: lineHeightPage,
      spacing: 1,
      align: "justify",
    }
  );
  // ===== Chữ ký =====
  pdf.addDualSignature(
    {
      date: "", // trống theo mẫu
      title: "NGƯỜI LAO ĐỘNG",
      name: val(data.signerB), // để trống cho ký tay
      signaturePath: data.signaturePathB || null,
      nameTag: "signaturePathB",
    },
    {
      date: "",
      title: "NGƯỜI SỬ DỤNG LAO ĐỘNG",
      name: val(data.signerA),
      signaturePath: data.signaturePathA || null,
      nameTag: "signaturePathA",
      note: "(Ký và đóng dấu)",
    }
  );
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
