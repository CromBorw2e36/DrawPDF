async function init(data = {}) {
   //các properties cần thiết của biến data
   // data = {
   //   // Thông tin chung phụ lục hợp đồng
   //   soVanBan: string,                    // Số văn bản phụ lục hợp đồng
   //   ngayHop: string,                     // Ngày họp/ký phụ lục (dd/mm/yyyy)
   //   
   //   // Thông tin công ty/người sử dụng lao động (Bên A)
   //   companyShortName: string,            // Tên ngắn gọn công ty
   //   tenCongTy: string,                   // Tên công ty đầy đủ
   //   companyAddress: string,              // Địa chỉ công ty
   //   companyPhone: string,                // Số điện thoại công ty
   //   companyFax: string,                  // Số fax công ty
   //   a_representative: string,            // Tên người đại diện công ty
   //   a_nationality: string,               // Quốc tịch người đại diện
   //   a_title: string,                     // Chức vụ người đại diện
   //   soUyQuyen: string,                   // Số ủy quyền (optional)
   //   ngayUyQuyen: string,                 // Ngày ủy quyền (optional)
   //   
   //   // Thông tin người lao động (Bên B)
   //   b_fullName: string,                  // Họ tên đầy đủ người lao động
   //   b_gender: string,                    // Giới tính người lao động
   //   b_nationality: string,               // Quốc tịch người lao động
   //   b_birthYear: string,                 // Ngày/tháng/năm sinh
   //   b_address: string,                   // Địa chỉ thường trú
   //   b_idNo: string,                      // Số CCCD/CMND
   //   b_idDate: string,                    // Ngày cấp CCCD/CMND
   //   b_idPlace: string,                   // Nơi cấp CCCD/CMND
   //   
   //   // Thông tin hợp đồng gốc
   //   soHopDong: string,                   // Số hợp đồng lao động gốc
   //   ngayKyHopDong: string,               // Ngày ký hợp đồng gốc (dd/mm/yyyy)
   //   
   //   // Nội dung sửa đổi/bổ sung
   //   noiDungSuDoiHopDong: Array<string>,  // Mảng các nội dung sửa đổi/bổ sung
   //   
   //   // Thời gian hiệu lực
   //   ngayHieuLucPhuLuc: string,           // Ngày có hiệu lực phụ lục (dd/mm/yyyy)
   //   
   //   // Thông tin chữ ký
   //   signerA: string,                     // Tên người ký đại diện công ty
   //   signerB: string,                     // Tên người ký lao động
   //   signaturePathA: string,              // Đường dẫn ảnh chữ ký người đại diện công ty
   //   signaturePathB: string               // Đường dẫn ảnh chữ ký người lao động
   // }

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
    .addText(`Số : ${val(data.soVanBan)}/2024/PLHĐLĐ`, null, null, {
      fontSize: 10.5,
      align: "center",
      spacing: 5,
    })
    .addSpace(4);
  pdf.addParagraph(
    `Hôm nay, ngày ${(val(data.ngayHop), "..../..../........")} tại Văn phòng ${val(
      data.companyShortName,
      "Công ty ........................"
    )}, chúng tôi gồm có:`,
    { fontSize: fontSizeContent, lineHeight: lineHeightPage, spacing: 1, align: "justify" }
  );
  // ===== I.	Bên Người sử dụng lao động: Công ty TNHH XNK TM CN DV Hùng Duy  =====
  pdf.addSubTitle(
    `I. Bên Người sử dụng lao động: ${val(data.tenCongTy ?? "Công ty ..............")}`,
    {
      fontSize: fontSizeSubTitle,
      lineHeight: lineHeightPage - 1,
    }
  );
  pdf.addMixedParagraph(
    [
      `Đại điện bởi Bà     : `,
      pdf.bold(val(data.a_representative || "LÊ MINH TRÚC")),
      ` - Quốc tịch: ${val(data.a_nationality || "Việt Nam")}`,
    ],
    {
      fontSize: fontSizeContent,
      lineHeight: lineHeightPage,
      spacing: 0,
    }
  );
  const arrContent1 = [`Chức vụ                 : ${val(data.a_title || "Tổng Giám Đốc")}`];
  if (data.soUyQuuyen) {
    arrContent1.push(`Theo ủy quyền số ${val(data.soUyQuyen)}, ngày ${val(data.ngayUyQuyen)}`);
  }
  arrContent1.push(
    ...[
      `Địa chỉ                   : ${val(
        data.companyAddress ||
          "Số 250 Lý Thường Kiệt, Khu phố 4, P.Long Hoa, Thị Xã Hòa Thành, Tây Ninh."
      )}`,
      `Điện thoại             : ${val(data.companyPhone || "0276-3830099")}, FAX: ${val(
        data.companyFax || "0276.3830.099"
      )}`,
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
      `Ông (Bà)                         : ${val(data.b_fullName)}, Giới tính: ${val(
        data.b_gender
      )}, Quốc tịch: ${val(data.b_nationality)}`,
      `Ngày/tháng/năm sinh : ${val(data.b_birthYear)}`,
      `Địa chỉ thường trú        : ${val(data.b_address)}`,
      `Số CCCD                        : ${val(data.b_idNo)}, Cấp ngày: ${val(
        data.b_idDate
      )}, Tại: ${val(data.b_idPlace)}`,
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
      `Căn cứ Hợp đồng lao động (HĐLĐ) ${val(data.soHopDong)} số ký ngày ${val(
        data.ngayKyHopDong
      )} và nhu cầu sử dụng lao động, hai bên cùng nhau thỏa thuận để sửa đổi/bổ sung thêm một số Điều trong Hợp đồng đã ký trên, như sau:`,
    ],
    { fontSize: fontSizeContent, lineHeight: lineHeightPage, spacing: 1, align: "justify" }
  );
  // ===== Điều 1. Nội dung sửa đổi/bổ sung nội dung của HĐLĐ như sau:	 =====
  pdf.addSpace(2).addSubTitle("Điều 1. Nội dung sửa đổi/bổ sung nội dung của HĐLĐ như sau:", {
    fontSize: fontSizeSubTitle,
    lineHeight: 1.5,
  });
  pdf.addNumberedList(data.noiDungSuDoiHopDong ?? [`............................................................................................................................................................................`,`............................................................................................................................................................................`,`............................................................................................................................................................................`], {
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
  });
  // ===== Điều 2. Thời gian thực hiện: =====
  pdf.addSpace(2).addSubTitle("Điều 2. Thời gian thực hiện:", {
    fontSize: fontSizeSubTitle,
    lineHeight: 1.5,
  });
  pdf.addMixedParagraph(
    [
      `Những điều khoản thay đổi được ghi tại Điều 1 của Phụ lục hợp đồng này có hiệu lực kể từ ngày`,
      pdf.bold(val(data.ngayHieuLucPhuLuc || ".........../.........../...........")),
      ` cho đến khi có Phụ lục hợp đồng mới thay thế/bổ sung.`,
    ],
    { fontSize: fontSizeContent, lineHeight: lineHeightPage, spacing: 1, align: "justify" }
  );
  pdf.addParagraph(
    [
      `Phụ lục hợp đồng này là một bộ phận không tách rời của Hợp đồng lao động số ${val(data.soHopDong)} và được lập thành hai (02) bản, mỗi bên giữ một (01) bản có giá trị pháp lý như nhau.`,
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
      name: val(data.signerA, "LÊ MINH TRÚC"),
      signaturePath: data.signaturePathA || null,
      nameTag: "signaturePathA",
      note: "(Ký và đóng dấu)",
    }
  );
  // ===== Footer =====
  pdf.addFooter("{pageNumber}", { fontSize: 8, color: [151, 151, 151], align: "right" });
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
