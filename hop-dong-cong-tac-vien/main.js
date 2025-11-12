async function init(data = {}) {
  //các properties cần thiết của biến data
  // data = {
  //   // Thông tin chung hợp đồng
  //   soVanBan: string,                    // Số văn bản hợp đồng cộng tác viên
  //   ngayKyDay: string,                   // Ngày ký hợp đồng
  //   ngayKyMonth: string,                 // Tháng ký hợp đồng
  //   ngayKyYear: string,                  // Năm ký hợp đồng
  //   
  //   // Thông tin công ty (Bên A)
  //   tenCongTy: string,                   // Tên công ty đầy đủ
  //   diaChiCongTy: string,                // Địa chỉ ký hợp đồng/văn phòng công ty
  //   companyAddress: string,              // Địa chỉ công ty chính thức
  //   companyPhone: string,                // Số điện thoại công ty
  //   companyTaxCode: string,              // Mã số thuế công ty
  //   a_representative: string,            // Tên người đại diện công ty
  //   a_title: string,                     // Chức vụ người đại diện
  //   a_cccd: string,                      // Số CCCD người đại diện
  //   a_ngayCapCccd: string,               // Ngày cấp CCCD người đại diện
  //   a_quocTich: string,                  // Quốc tịch người đại diện
  //   soUyQuyen: string,                   // Số ủy quyền (optional)
  //   ngayUyQuyen: string,                 // Ngày ủy quyền (optional)
  //   
  //   // Thông tin cộng tác viên (Bên B)
  //   tenCongTacVien: string,              // Họ tên cộng tác viên
  //   ngaySinhCongTacVien: string,         // Ngày/tháng/năm sinh cộng tác viên
  //   gioiTinhCongTacVien: string,         // Giới tính cộng tác viên
  //   queQuanCongTacVien: string,          // Quê quán cộng tác viên
  //   diaChiCongTacVien: string,           // Địa chỉ thường trú cộng tác viên
  //   cccdCongTacVien: string,             // Số CCCD cộng tác viên
  //   ngayCapCccdCongTacVien: string,      // Ngày cấp CCCD cộng tác viên
  //   
  //   // Nội dung công việc và hợp đồng
  //   noiDungSuDoiHopDong: Array<string>,  // Mảng nội dung công việc và thời gian (optional)
  //                                        // Mặc định: [nội dung CTV, thời hạn, địa điểm, thời gian làm việc]
  //   
  //   // Thông tin thù lao
  //   luong: string,                       // Thù lao cộng tác viên (đồng/ngày)
  //   ngayNhanLuong: string,               // Ngày thanh toán thù lao hàng tháng
  //   
  //   // Thông tin chữ ký
  //   signerA: string,                     // Tên người ký đại diện Bên A
  //   signerB: string,                     // Tên người ký Bên B (cộng tác viên)
  //   signaturePathA: string,              // Đường dẫn ảnh chữ ký Bên A
  //   signaturePathB: string               // Đường dẫn ảnh chữ ký Bên B
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
  pdf.addText(
    `Tây Ninh, Ngày ${val(data.ngayKyDay, "....")} tháng ${val(data.ngayKyMonth, "....")}` +
      ` năm ${val(data.ngayKyYear, "....")}.`,
    null,
    null,
    {
      fontSize: 10.5,
      fontStyle: "italic",
      align: "right",
      spacing: 5,
    }
  );
  pdf.addTitle("HỢP ĐỒNG CỘNG TÁC VIÊN", {
    fontSize: 16,
    fontStyle: "bold",
    align: "center",
    spacing: 1,
    lineHeight: pdf.lineHeight,
  });
  pdf
    .addText(`Số : ${val(data.soVanBan)}`, null, null, {
      fontSize: 10.5,
      fontStyle: "italic",
      align: "center",
      spacing: 5,
    })
    .addSpace(4);
  pdf.addParagraph(
    [
      `Căn cứ Bộ luật Dân sự nước Cộng hòa xã hội chủ nghĩa Việt Nam ngày 24/11/2015;`,
      `Căn cứ Bộ luật Lao động 2019;`,
      `Căn cứ nhu cầu và năng lực của hai bên;`,
      `Hợp đồng cộng tác viên này (sau đây gọi là “Hợp đồng”) được ký kết tại ${val(
        data.diaChiCongTy
      )} và bởi các bên:`,
    ],
    {
      fontSize: fontSizeContent,
      lineHeight: lineHeightPage + 1,
      spacing: 1,
      align: "left",
      fontStyle: "italic",
    }
  );
  // ===== BÊN A -  CÔNG TY CỔ PHẦN Y TẾ HÙNG DUY  =====
  pdf.addSubTitle(`BÊN A - ${val(data.tenCongTy ?? "Công ty ..............")}`.toUpperCase(), {
    fontSize: fontSizeSubTitle,
    lineHeight: lineHeightPage - 1,
  });
  pdf.addParagraph(
    [
      `Địa chỉ                         : ${val(data.companyAddress)}`,
      `Điện thoại                   : ${val(data.companyPhone)}`,
      `Mã số thuế                 : ${val(data.companyTaxCode)}`,
    ].join("\n"),
    {
      fontSize: fontSizeContent,
      lineHeight: lineHeightPage + 1,
      spacing: 1,
    }
  );
  pdf.addMixedParagraph([`Đại điện bởi Ông/Bà : `, pdf.bold(val(data.a_representative))], {
    fontSize: fontSizeContent,
    lineHeight: lineHeightPage + 1,
    spacing: 0,
  });

  const arrContent1 = [
    `Chức vụ                      : ${val(data.a_title)}`,
    `CCCD                          : ${val(data.a_cccd)},      Cấp ngày: ${val(data.a_ngayCapCccd)}`,
    `Quốc tịch                   : ${val(data.a_quocTich)}`,
  ];
  if (data.soUyQuuyen) {
    arrContent1.slice(
      1,
      0,
      `Theo ủy quyền số ${val(data.soUyQuyen)}, ngày ${val(data.ngayUyQuyen)}`
    );
  }
  pdf.addParagraph(arrContent1.join("\n"), {
    fontSize: fontSizeContent,
    lineHeight: lineHeightPage + 1,
    spacing: 1,
  });
  // ===== BÊN B - CỘNG TÁC VIÊN  =====
  pdf.addSpace(2).addSubTitle(`BÊN B - CỘNG TÁC VIÊN`.toUpperCase(), {
    fontSize: fontSizeSubTitle,
    lineHeight: lineHeightPage - 1,
  });
  pdf.addParagraph(
    [
      `Họ và tên cộng tác viên : ${val(data.tenCongTacVien)}`,
      `Ngày tháng năm sinh    : ${val(data.tenCongTacVien)}. Giới tính: ${val(
        data.tenCongTacVien
      )}`,
      `Quê quán                         : ${val(data.tenCongTacVien)} `,
      `Địa chỉ thường trú          : ${val(data.tenCongTacVien)}`,
      `Số CCCD                          : ${val(data.tenCongTacVien)}. Ngày cấp: ${val(
        data.tenCongTacVien
      )}.`,
    ].join("\n"),
    { fontSize: fontSizeContent, lineHeight: lineHeightPage + 1, spacing: 1 }
  );
  pdf.addParagraph(
    [
      `Hai bên cùng thỏa thuận ký kết hợp đồng cộng tác viên và cam kết đúng những điều khoản sau đây:`,
    ],
    {
      fontSize: fontSizeContent,
      lineHeight: lineHeightPage,
      spacing: 1,
      align: "justify",
      fontStyle: "italic",
    }
  );
  // ===== Điều 1. Nội dung sửa đổi/bổ sung nội dung của HĐLĐ như sau:	 =====
  pdf.addSpace(1).addSubTitle("Điều 1: Công việc và thời gian làm việc theo hợp đồng", {
    fontSize: fontSizeSubTitle,
    lineHeight: 1.5,
  });
  pdf.addNumberedList(
    data.noiDungSuDoiHopDong ?? [
      `Nội dung công việc: Bên B đồng ý làm cộng tác viên theo nhu cầu công việc của bên A.`,
      `Thời hạn hợp đồng: Từ ngày ……………. đến ngày …………………..`,
      `Địa điểm làm việc: 82 Phạm Văn Đồng, KP Hiệp Long, Phường Thanh Điền, Tây Ninh.`,
      `Thời gian làm việc: Tùy theo nhu cầu của bên A.`,
    ],
    {
      itemOptions: {
        numberStyle: "number",
        numberFormat: "{number}.",
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
  pdf.addSpace(2).addSubTitle("Điều 2: Quyền lợi và nghĩa vụ của bên B", {
    fontSize: fontSizeSubTitle,
    lineHeight: 1.5,
  });
  pdf.addNumberedList(["Quyền lợi"], {
    itemOptions: {
      numberStyle: "number",
      numberFormat: "1.",
      indent: 4,
      fontSize: fontSizeContent,
      lineHeight: pdf.lineHeight,
      spacing: 1,
      align: "justify",
    },
    resetNumbers: true,
  });
  pdf.margins.left += 5;
  pdf.addNumberedList(
    [
      `Thù lao: ${val(data.luong)}. đồng/ngày`,
      `Phương thức thanh toán: Tiền mặt/chuyển khoản vào tài khoản cá nhân của bên B.`,
      `Ngày thanh toán: ngày ${val(
        data.ngayNhanLuong
      )} tây của tháng tiếp theo. Trong trường hợp ngày ${val(
        data.ngayNhanLuong
      )} tây trùng với ngày nghỉ thì sẽ được thanh toán vào ngày sau đó liền kề.`,
      `Yêu cầu bên A cung cấp thông tin, tài liệu và phương tiện để thực hiện công việc.`,
      `Yêu cầu bên A thanh toán đầy đủ và đúng hạn.`,
    ],
    {
      itemOptions: {
        numberStyle: "alpha",
        numberFormat: "{number})",
        indent: 4,
        fontSize: fontSizeContent,
        lineHeight: pdf.lineHeight,
        spacing: 1,
        align: "justify",
      },
      resetNumbers: true,
    }
  );
  pdf.margins.left -= 5;
  pdf.addNumberedList(["Nghĩa vụ"], {
    itemOptions: {
      numberStyle: "number",
      numberFormat: "2.",
      indent: 4,
      fontSize: fontSizeContent,
      lineHeight: pdf.lineHeight,
      spacing: 1,
      align: "justify",
    },
    resetNumbers: true,
  });
  pdf.margins.left += 5;
  pdf.addNumberedList(
    [
      `Thực hiện công việc đúng chất lượng, số lượng, thời hạn, địa điểm và các thoả thuận khác.`,
      `Không giao cho người khác thực hiện thay công việc nếu không có sự đồng ý của bên A.`,
      `Bảo quản và giao lại cho bên A tài liệu và phương tiện được giao sau khi hoàn thành công việc.`,
      `Báo cho bên A về việc thông tin, tài liệu không đầy đủ, phương tiện không bảo đảm chất lượng để hoàn thành công việc.`,
      `Giữ bí mật thông tin mà mình biết được trong thời gian thực hiện công việc.`,
      `Bồi thường thiệt hại cho bên A nếu làm mất, hư hỏng tài liệu, phương tiện được giao hoặc tiết lộ bí mật thông tin.`,
    ],
    {
      itemOptions: {
        numberStyle: "alpha",
        numberFormat: "{number})",
        indent: 4,
        fontSize: fontSizeContent,
        lineHeight: pdf.lineHeight,
        spacing: 1,
        align: "justify",
      },
      resetNumbers: true,
    }
  );
  pdf.margins.left -= 5;
  pdf.addSpace(2).addSubTitle("Điều 3: Quyền lợi và nghĩa vụ của bên A", {
    fontSize: fontSizeSubTitle,
    lineHeight: 1.5,
  });
  pdf.addNumberedList(["Quyền lợi"], {
    itemOptions: {
      numberStyle: "number",
      numberFormat: "1.",
      indent: 4,
      fontSize: fontSizeContent,
      lineHeight: pdf.lineHeight,
      spacing: 1,
      align: "justify",
    },
    resetNumbers: true,
  });
  pdf.margins.left += 5;
  pdf.addNumberedList(
    [
      `Yêu cầu bên B thực hiện công việc theo đúng chất lượng, số lượng, thời hạn, địa điểm và các thoả thuận khác.`,
      `Đơn phương chấm dứt thực hiện hợp đồng và yêu cầu bồi thường thiệt hại nếu bên B vi phạm nghiêm trọng nghĩa vụ.`,
      `Được phép tạm giữ thù lao trong trường hợp bên B chưa hoàn thành các công việc được giao hoặc chưa giao trả tài sản của công ty (thiết bị, công cụ làm việc, trang phục…) sau khi kết thúc công việc.`,
      `Có quyền đòi bồi thường, khiếu nại với cơ quan có thẩm quyền để bảo vệ quyền lợi của mình nếu bên B vi phạm pháp luật hay các điều khoản của hợp đồng này.`,
    ],
    {
      itemOptions: {
        numberStyle: "alpha",
        numberFormat: "{number})",
        indent: 4,
        fontSize: fontSizeContent,
        lineHeight: pdf.lineHeight,
        spacing: 1,
        align: "justify",
      },
      resetNumbers: true,
    }
  );
  pdf.margins.left -= 5;
  pdf.addNumberedList(["Nghĩa vụ"], {
    itemOptions: {
      numberStyle: "number",
      numberFormat: "2.",
      indent: 4,
      fontSize: fontSizeContent,
      lineHeight: pdf.lineHeight,
      spacing: 1,
      align: "justify",
    },
    resetNumbers: true,
  });
  pdf.margins.left += 5;
  pdf.addNumberedList(
    [
      `Cung cấp cho bên B thông tin, tài liệu và các phương tiện cần thiết để thực hiện công việc, bảo đảm việc làm cho bên B theo hợp đồng đã ký.`,
      `Thanh toán thù lao đầy đủ và đúng hạn cho bên B.`,
    ],
    {
      itemOptions: {
        numberStyle: "alpha",
        numberFormat: "{number})",
        indent: 4,
        fontSize: fontSizeContent,
        lineHeight: pdf.lineHeight,
        spacing: 1,
        align: "justify",
      },
      resetNumbers: true,
    }
  );
  pdf.margins.left -= 5;
  pdf.addSpace(2).addSubTitle("Điều 4: Chấm dứt hợp đồng cộng tác viên", {
    fontSize: fontSizeSubTitle,
    lineHeight: 1.5,
  });
  pdf.addParagraph([`Các trường hợp chấm dứt:`], {
    fontSize: fontSizeContent,
    lineHeight: lineHeightPage,
    spacing: 1,
  });
  pdf.addNumberedList(
    [
      `Hoàn thành công việc theo hợp đồng. `,
      `Một trong hai bên đơn phương chấm dứt hợp đồng phải báo trước cho bên kia ít nhất 07 ngày, nếu không thông báo mà gây thiệt hại cho bên kia thì phải bồi thường theo quy định của pháp luật.`,
      `Hai bên thỏa thuận chấm dứt hợp đồng trước thời hạn.`,
    ],
    {
      itemOptions: {
        numberStyle: "number",
        numberFormat: "{number}.",
        indent: 4,
        fontSize: fontSizeContent,
        lineHeight: pdf.lineHeight,
        spacing: 1,
        align: "justify",
      },
      resetNumbers: true,
    }
  );
  pdf.addSpace(2).addSubTitle("Điều 5: Điều khoản chung", {
    fontSize: fontSizeSubTitle,
    lineHeight: 1.5,
  });

  pdf.addNumberedList(
    [
      `Trong quá trình thực hiện hợp đồng, hai bên có thể thỏa thuận lại nội dung của hợp đồng theo thực tế làm việc phù hợp với pháp luật.`,
      `Trong trường hợp có bất kỳ điều khoản hoặc quy định nào của hợp đồng này bị vô hiệu hoặc không thể thực hiện theo quyết định, phán quyết của cơ quan nhà nước có thẩm quyền thì các điều khoản và quy định còn lại của hợp đồng vẫn có giá trị hiệu lực đối với các bên.`,
      `Những vấn đề không ghi trong hợp đồng này thì áp dụng theo quy định của pháp luật dân sự.`,
      `Hợp đồng này được lập thành 02 bản, có giá trị pháp lý như nhau, mỗi bên giữ 01 bản chịu trách nhiệm thực hiện./.`,
    ],
    {
      itemOptions: {
        numberStyle: "number",
        numberFormat: "{number}.",
        indent: 4,
        fontSize: fontSizeContent,
        lineHeight: pdf.lineHeight,
        spacing: 1,
        align: "justify",
      },
      resetNumbers: true,
    }
  );
  // ===== Chữ ký =====
  pdf.addDualSignature(
    {
      date: "", // trống theo mẫu
      title: "BÊN B",
      name: val(data.signerB), // để trống cho ký tay
      signaturePath: data.signaturePathB || null,
      nameTag: "signaturePathB",
    },
    {
      date: "",
      title: "BÊN A",
      name: val(data.signerA),
      signaturePath: data.signaturePathA || null,
      nameTag: "signaturePathA",
    }
  );
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
