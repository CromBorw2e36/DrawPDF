async function init(data = {}) {
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
    spacing: 5,
  });
  pdf.addText("Độc Lập – Tự Do – Hạnh Phúc", null, null, {
    fontSize: 11,
    fontStyle: "bold",
    align: "center",
    spacing: 5,
  });
  pdf.addText("---o0o---", null, null, { fontSize: 10.5, align: "center", spacing: 5 });
  pdf.addText(`Số : ${val(data.soVanBan)}`, null, null, {
    fontSize: 10.5,
    align: "left",
    spacing: 5,
  });
  pdf.addTitle("HỢP ĐỒNG LAO ĐỘNG", { fontSize: 16, fontStyle: "bold", align: "center" });
  // ===== I.	Bên Người sử dụng lao động: Công ty TNHH XNK TM CN DV Hùng Duy  =====
  pdf
    .addSubTitle(
      `I. Bên Người sử dụng lao động: ${val(data.tenCongTy ?? "Công ty ..............")}`,
      {
        fontSize: fontSizeSubTitle,
        lineHeight: lineHeightPage - 1,
      }
    );
  pdf.margins.left += 5;
  pdf.addMixedParagraph(
    [
      `Đại điện bởi Bà     : `,
      pdf.bold(val(data.a_representative || "LÊ MINH TRÚC")),
      `. Quốc tịch: ${val(data.a_nationality || "Việt Nam")}`,
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
      `Điện thoại             : ${val(data.companyPhone || "0276-3830099")}`,
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
  pdf.margins.left -= 5;
  // ===== II. Bên Người lao động =====
  pdf.addSpace(2).addSubTitle("II. Bên Người lao động:", {
    fontSize: fontSizeSubTitle,
    lineHeight: pdf.lineHeight,
  });
  pdf.margins.left += 5;
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
  pdf.margins.left -= 5;
  pdf.addMixedParagraph([`Sau đây gọi tắt là`, pdf.bold(" “Người lao động”")], {
    fontSize: fontSizeContent,
    lineHeight: lineHeightPage,
    spacing: 1,
  });
  pdf.addMixedParagraph(
    [
      "Công ty và Người lao động sau đây được gọi riêng là ",
      pdf.bold("“Bên” "),
      "và được gọi chung là ",
      pdf.bold("“Các Bên”"),
    ],
    { fontSize: fontSizeContent, lineHeight: lineHeightPage, spacing: 1 }
  );

  pdf.addMixedParagraph(
    [
      "Cùng thoả thuận ký kết hợp đồng lao động (",
      pdf.bold('"HĐLĐ "'),
      ") và cam kết làm đúng những điều khoản sau đây:",
    ],
    { fontSize: fontSizeContent, lineHeight: lineHeightPage, spacing: 1 }
  );

  // ===== Điều 1. Thời hạn và công việc hợp đồng	 =====
  pdf.addSpace(2).addSubTitle("Điều 1. Thời hạn và công việc hợp đồng	", {
    fontSize: fontSizeSubTitle,
    lineHeight: 1.5,
  });
  pdf.addNumberedList(
    [
      `Loại HĐLĐ                   : ${val(data.tenLoaiHopDong || "[Xác định thời hạn] /[Không xác định thời hạn]")}`,
      `Thời điểm bắt đầu     : ${val(data.thoiGianBatDauHopDong || "[Từ ngày …………]")}`,
      // `Thời điểm kết thúc    : ${val(data.thoiGianKetThucHopDong || "[Đến ngày ………] /[Không xác định]")}`, // Mẫu góc nội dụng
      `Thời điểm kết thúc    : ${val(data.thoiGianKetThucHopDong || " Không xác định")}`,
      `Địa điểm làm việc     : ${val(data.tenNoiLamViec || "[Ghi địa chỉ nơi làm việc chính: trụ sở Công ty/chi nhánh/cơ sở khác của công ty]")} và những địa điểm khác theo phân công/bố trí của Công ty.`,
      `Vị trí công việc           : ${val(data.tenViTriCongViec || "[Theo Quyết định phân công nhiệm vụ] / [Theo Quyết định bổ nhiệm]")}`,
      `Nhiệm vụ công việc : Thực hiện công việc theo bản mô tả công việc và hoàn thành những công việc khác theo yêu cầu hoạt động của Công ty.`,
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
  // ===== Điều 2. Chế độ làm việc =====
  pdf.addSpace(2).addSubTitle("Điều 2. Chế độ làm việc", {
    fontSize: fontSizeSubTitle,
    lineHeight: 1.5,
  });
  pdf.addNumberedList(
    [
     `Thời gian làm việc: ${val(data.thoiGianLamViec || "8 giờ/ngày, 48 giờ/tuần")}. Lịch làm việc cụ thể sẽ do Công ty quy định theo tính chất công việc hoặc theo nhu cầu của bộ phận và có thể được thay đổi, điều chỉnh phù hợp với tình hình hoạt động sản xuất kinh doanh của Công ty vào từng thời điểm. `,
     `Các công cụ dụng cụ lao động được cấp phát: phù hợp với yêu cầu cần thiết của công việc và theo chính sách chung của Công ty.`,
     `Điều kiện an toàn và vệ sinh lao động tại nơi làm việc theo quy định của pháp luật hiện hành.`,
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
  // ===== Điều 3. Quyền lợi và nghĩa vụ của Người lao động =====
  pdf.addSpace(2).addSubTitle("Điều 3. Quyền lợi và nghĩa vụ của Người lao động", {
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
      `Mức lương vị trí công việc (lương chính): ${val(data.luongChinh)} đồng/tháng.`,
      `Phụ cấp hiệu quả công việc: được chi trả căn cứ theo kết quả đánh giá hiệu quả công việc hàng tháng theo quy định của Công ty.\nHoặc: (Lương theo doanh số ngành: được chi trả căn cứ chỉ tiêu được giao và kết quả doanh số thực đạt.)`,
      `Phụ cấp lương và các khoản hỗ trợ khác (nếu có): theo chính sách tiền lương hiện hành của Công ty hoặc theo các quyết định cụ thể của Người sử dụng lao động.`,
      `Hình thức trả lương: Tiền mặt/chuyển khoản vào tài khoản cá nhân Người lao động. Người lao động tự chịu mọi chi phí phát sinh liên quan đến việc sử dụng và duy trì tài khoản cá nhân của mình. `,
      `Ngày trả lương: ngày ${val(data.ngayTraLuong || "8")} tây của tháng tiếp theo. Trong trường hợp ngày chuyển lương trùng với ngày nghỉ thì lương sẽ được chuyển vào ngày trước đó.`,
      `Người lao động được tham gia Bảo hiểm xã hội, Bảo hiểm y tế, Bảo hiểm tai nạn lao động bệnh nghề nghiệp, Bảo hiểm thất nghiệp với tỷ lệ trích nộp theo quy định của Luật Bảo hiểm tại từng thời điểm.`,
      `Chế độ nghỉ ngơi: Theo nội quy lao động Công ty và quy định của pháp luật lao động;`,
      `Chế độ nghỉ phép năm: Theo nội quy lao động Công ty. Cứ 05 năm làm việc tại Công ty thì số ngày nghỉ hằng năm được tăng thêm tương ứng 01 ngày;`,
      `Chế độ thưởng và khen thưởng: Theo quy chế của Công ty;  `,
      `Chế độ nâng lương: Theo chính sách tiền lương hiện hành của Công ty; `,
      `Chế độ đào tạo: Theo kế hoạch đào tạo hàng năm của Công ty.`,
    ],
    {
      itemOptions: {
        numberStyle: "alpha",
        numberFormat: "{number}.",
        indent: 4,
        fontSize: fontSizeContent,
        lineHeight: pdf.lineHeight,
        spacing: 1,
        align: "left",
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
      "Làm việc cho Công ty theo địa điểm/nơi làm việc được Công ty bố trí/phân công căn cứ theo tình hình thực tế của Công ty;",
      "Hoàn thành công việc được giao theo hợp đồng này một cách trung thực, cẩn trọng, tốt nhất đảm bảo lợi ích hợp pháp tối đa của Công ty và tuân thủ theo sự điều hành/phân công/điều động của cấp trên khi có yêu cầu;",
      "Đóng các loại bảo hiểm, thuế thu nhập cá nhân đầy đủ theo quy định của pháp luật; Và đóng phí công đoàn theo quy định của pháp luật khi tham gia công đoàn tại Công ty;",
      "Tuân thủ thời gian báo trước theo quy định của pháp luật khi muốn chấm dứt HĐLĐ này. Trong trường hợp đơn phương chấm dứt HĐLĐ trái luật, Người lao động phải bồi thường cho Công ty theo quy định của pháp luật;",
      "Tuân thủ nội quy lao động, các quy định nội bộ, các chủ trương, chính sách của Công ty và các nội quy/quy định tại nơi mà Người lao động được Công ty bố trí làm việc;",
      "Thực hiện đúng các cam kết khác về bảo mật thông tin đã ký (nếu có);",
      "Trong mọi trường hợp và dưới bất kỳ tình huống trực tiếp hay gián tiếp nào, Người lao động không được nhận tiền, tài sản và/hoặc bất kỳ lợi ích nào từ bất kỳ cá nhân, tổ chức hoặc bên thứ ba nào khác (sau đây gọi chung là “Bên thứ ba”), dưới bất kỳ lý do gì, liên quan đến giao dịch của Công ty, vi phạm các quy định của Công ty có liên quan đến xung đột lợi ích, cạnh tranh, thông đồng, móc ngoặc, cho và nhận hối lộ, quà biếu/tiền hoặc tài sản khác gây thiệt hại đến lợi ích trực tiếp hay gián tiếp của Công ty.",
      "Thực hiện đúng cam kết trong HĐLĐ và các thoả thuận bằng văn bản khác với Công ty (nếu có).",
    ],
    {
      itemOptions: {
        numberStyle: "alpha",
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
  pdf.margins.left -= 5;
  // ===== Điều 4. Nghĩa vụ và quyền hạn của Người sử dụng lao động =====
  pdf.addSpace(2).addSubTitle("Điều 4. Nghĩa vụ và quyền hạn của Người sử dụng lao động", {
    fontSize: fontSizeSubTitle,
    lineHeight: pdf.lineHeight,
  });
  pdf.addNumberedList(["Nghĩa vụ"], {
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
      "Bảo đảm việc làm và thực hiện đầy đủ những điều đã cam kết trong HĐLĐ.",
      "Thanh toán đầy đủ, đúng thời hạn các chế độ và quyền lợi của Người lao động theo HĐLĐ, Thoả ước lao động tập thể và Nội quy lao động của Công ty.",
    ],
    {
      itemOptions: {
        numberStyle: "alpha",
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
  pdf.margins.left -= 5;
  pdf.addNumberedList(["Quyền hạn"], {
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
      "Điều hành Người lao động hoàn thành công việc theo hợp đồng (bố trí, điều chuyển công tác phù hợp,…)",
      "Tạm hoãn, chấm dứt HĐLĐ, kỷ luật Người lao động theo quy định của pháp luật, Thoả ước lao động tập thể và Nội quy lao động của Công ty.",
      "Đơn phương chấm dứt HĐLĐ trước thời hạn khi Người lao động thường xuyên không hoàn thành công việc theo HĐLĐ và/hoặc không hoàn thành chỉ tiêu đánh giá hiệu quả công việc.",
      "Yêu cầu Người lao động bồi thường tổn thất do vi phạm các nội dung nêu tại hợp đồng này, nội quy lao động, quy định của Công ty và theo quy định của pháp luật.",
    ],
    {
      itemOptions: {
        numberStyle: "alpha",
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
  pdf.margins.left -= 5;
  // ===== Điều 5. Cam kết bảo mật thông tin của Người lao động =====
  pdf.addSpace(2).addSubTitle("Điều 5. Cam kết bảo mật thông tin của Người lao động", {
    fontSize: fontSizeSubTitle,
    lineHeight: pdf.lineHeight,
  });
  pdf.addNumberedList(
    [
      "“Thông tin mật” của Công ty TNHH XNK TM CN DV Hùng Duy và các Đơn vị thành viên trực thuộc là bao gồm nhưng không giới hạn những nội dung sau đây: bí mật công nghệ, bí mật kinh doanh, thông tin khách hàng, kế hoạch tài chính, chiến lược công ty,... và các thông tin, tài liệu, ý tưởng thể hiện hoặc lưu trữ dưới dạng văn bản, dữ liệu máy tính, thư điện tử, hình ảnh, mã code, phần mềm tin học,...",
      "Người lao động đồng ý và cam kết vô điều kiện rằng tuyệt đối bảo vệ và bảo mật thông tin mật (không được tiết lộ, sử dụng, cung cấp thông tin mật) cho bất kỳ cá nhân, tổ chức, bên thứ ba dưới bất kỳ cách thức và bất kỳ lý do nào (nếu chưa nhận được sự đồng ý bằng văn bản của Người sử dụng lao động) mà Người lao động có được trong quá trình làm việc, có liên quan đến công việc và/hoặc thuộc quyền sở hữu hợp pháp của mình nhưng chưa được bộc lộ. Trừ trường hợp buộc phải thực hiện tiết lộ theo quy định của pháp luật và/hoặc yêu cầu của Cơ quan Nhà nước có thẩm quyền, Người lao động phải thông báo cho Người sử dụng lao động biết trước để Người sử dụng lao động áp dụng những biện pháp cần thiết nhằm bảo vệ quyền và lợi ích hợp pháp của công ty trước những thông tin mật sắp bị bộc lộ.",
      "Người lao động đồng ý và cam kết vô điều kiện rằng sẽ không tiến hành bất kỳ hoạt động giao dịch (ví dụ: liên hệ, cung cấp thông tin, trao đổi, mua bán,...) với bất kỳ cá nhân, tổ chức, bên thứ ba về thông tin mật làm ảnh hưởng trực tiếp/gián tiếp đến quyền và lợi ích hợp pháp của công ty. Đồng thời chấp nhận mọi hình thức kỷ luật hoặc yêu cầu bồi thường từ công ty do những thiệt hại/tổn thất/mất mát phát sinh do vi phạm nghĩa vụ bảo mật theo hợp đồng này.",
      "Người lao động đồng ý và cam kết vô điều kiện rằng sau khi chấm dứt hợp đồng lao động tại Công ty: đối với tất cả lời tuyên thệ tại Điều 5 của hợp đồng này có giá trị hiệu lực 02 năm sau khi chấm dứt Hợp đồng lao động tại công ty và/hoặc có giá trị hiệu lực đến khi thông tin mật đã được công ty bộc lộ, công khai rộng rãi trên các phương tiện truyền thông đại chúng.",
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
  // ===== Điều 6. Cam kết bảo mật dữ liệu cá nhân của Người sử dụng lao động =====
  pdf
    .addSpace(2)
    .addSubTitle("Điều 6. Cam kết bảo mật dữ liệu cá nhân của Người sử dụng lao động", {
      fontSize: fontSizeSubTitle,
      lineHeight: pdf.lineHeight,
    });
  pdf.addNumberedList(
    [
      "“Dữ liệu cá nhân” của Người lao động là những thông tin nhân thân, thông tin khác hoặc các thông tin riêng tư của cá nhân Người lao động, gắn liền với Người lao động mà bị xâm phạm sẽ gây ảnh hưởng trực tiếp tới quyền và lợi ích hợp pháp của cá nhân của Người lao động",
      "Công ty cam kết bảo vệ và bảo mật dữ liệu cá nhân của Người lao động.",
      "Công ty cam kết không tiến hành bất kỳ hoạt động giao dịch (ví dụ: liên hệ, cung cấp thông tin, trao đổi, mua bán,...) với bất kỳ cá nhân, tổ chức, bên thứ ba về dữ liệu cá nhân của Người lao động. Trừ trường hợp buộc phải thực hiện tiết lộ theo quy định của pháp luật và/hoặc yêu cầu của Cơ quan Nhà nước có thẩm quyền làm ảnh hưởng trực tiếp/gián tiếp đến quyền và lợi ích hợp pháp của Người lao động.",
      "Công ty sẽ chịu trách nhiệm bồi thường đối với trường hợp dữ liệu cá nhân của Người lao động bị bộc lộ (khi chưa nhận được sự chấp thuận của Người lao động) làm ảnh hưởng trực tiếp/gián tiếp đến quyền và lợi ích hợp pháp của Người lao động.",
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
  // ===== Điều 7. Các thỏa thuận khác =====
  pdf.addSpace(2).addSubTitle("Điều 7. Các thỏa thuận khác", {
    fontSize: fontSizeSubTitle,
    lineHeight: pdf.lineHeight,
  });
  pdf.addNumberedList(
    [
      "Người lao động nghỉ ốm/thai sản/bệnh nghề nghiệp/tai nạn lao động/chế độ khác theo quy định của pháp luật hiện hành. ",
      "Công ty thực hiện các thủ tục nộp thuế thu nhập cá nhân của Người lao động và các khoản chi phí phát sinh khác cho cơ quan nhà nước (nếu có).",
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
  // ===== Điều 8. Điều khoản thi hành =====
  pdf.addSpace(2).addSubTitle("Điều 8. Điều khoản thi hành", {
    fontSize: fontSizeSubTitle,
    lineHeight: pdf.lineHeight,
  });
  pdf.addNumberedList(
    [
      "Những vấn đề về lao động không ghi trong hợp đồng này thì áp dụng theo Nội quy lao động,  Thoả ước lao động tập thể và theo quy định của pháp luật. ",
      "Khi hai bên ký kết phụ lục hợp đồng thì nội dung của phụ lục hợp đồng cũng có giá trị như nội dung của bản HĐLĐ này.",
      `HĐLĐ này được lập thành 02 bản có giá trị như nhau, mỗi bên giữ một bản và có hiệu lực kể từ ngày  ${val(data.ngayHieuLuc)}`,
      `Hợp đồng này được lập tại ${val(data.tenCongTy, "Công ty TNHH XNK TM CN DV Hùng Duy")}.`,
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
  pdf.addSpace(3);
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
      name: val(data.signerA , "LÊ MINH TRÚC"),
      signaturePath: data.signaturePathA || null,
      nameTag: "signaturePathA",
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
