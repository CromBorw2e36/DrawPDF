async function init(data = {}) {
  const pdf = new JsPdfService();
  const M = pdf.margins;
  const lineHeightPage = 4;
  const fontSizeTitle = 16;
  const fontSizeSubTitle = 12;
  const fontSizeContent = 10.5;
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

  function renderTwoColumnHeader(pdf, obj = {}) {
    const doc = pdf.doc;

    // Kích thước & cột
    const { left: ML, right: MR } = pdf.margins;
    const pageW = pdf.pageWidth;
    const usableW = pageW - ML - MR;
    const gutter = 10; // khoảng cách 2 cột
    const colW = (usableW - gutter) / 2;

    // Toạ độ cột
    const headerY = pdf.getCurrentY();
    const leftX = ML;
    const rightX = ML + colW + gutter;

    // Helper: vẽ một block center theo X với font/style, trả về y cuối
    const drawCenteredBlock = (x, width, startY, lines, opts = {}) => {
      const lh = opts.lineHeight ?? 4;
      const fs = opts.fontSize ?? fontSizeContent;
      const fnt = opts.font ?? "Roboto";
      const stl = opts.fontStyle ?? "normal";
      const gap = opts.gapAfter ?? 0;

      doc.setFont(fnt, stl);
      doc.setFontSize(fs);

      let y = startY;
      for (const ln of lines) {
        // Cho phép ln là string hoặc array (đã split sẵn)
        const chunks = Array.isArray(ln) ? ln : doc.splitTextToSize(String(ln), width);
        chunks.forEach((row, idx) => {
          doc.text(row, x + width / 2, y + idx * lh, { align: "center", baseline: "top" });
        });
        y += chunks.length * lh;
      }
      return y + gap;
    };

    // Helper: gạch dưới ở giữa cột
    const drawCenteredUnderline = (x, width, y, lineLen = 40) => {
      const uW = Math.min(lineLen, width); // không vượt quá bề rộng cột
      const x1 = x + (width - uW) / 2;
      const x2 = x1 + uW;
      // dịch xuống 1px để không đè chữ trước đó
      doc.setLineWidth(0.3);
      doc.line(x1, y, x2, y);
      return y; // trả về y của đường kẻ (tham khảo)
    };

    // ===== CỘT TRÁI =====
    let yL = headerY;

    // Dòng 1: CÔNG TY + tên công ty (đậm, canh giữa theo cột)
    yL = drawCenteredBlock(
      leftX,
      colW,
      yL,
      [{ text: `${obj.TenCongTy || "CÔNG TY "}`, fs: fontSizeContent, st: "bold" }].map((t) => {
        doc.setFont("Roboto", t.st || "bold");
        doc.setFontSize(t.fs || fontSizeContent);
        return t.text;
      }),
      { fontSize: fontSizeSubTitle, fontStyle: "bold", lineHeight: lineHeightPage, gapAfter: 2 }
    );

    // Dòng 2: khoảng trống nhỏ
    // yL += 2;

    // Dòng 3: gạch dưới
    yL = drawCenteredUnderline(leftX, colW, yL + 4, 55);
    yL += 6;

    // ===== CỘT PHẢI =====
    let yR = headerY;

    // Dòng 1: Quốc hiệu (đậm)
    yR = drawCenteredBlock(rightX, colW, yR, ["CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM"], {
      fontSize: fontSizeSubTitle,
      fontStyle: "bold",
      lineHeight: lineHeightPage,
      gapAfter: 2,
    });

    // Dòng 2: Độc lập – Tự do – Hạnh phúc (đậm)
    yR = drawCenteredBlock(rightX, colW, yR, ["Độc lập – Tự do – Hạnh phúc"], {
      fontSize: fontSizeContent,
      fontStyle: "bold",
      lineHeight: lineHeightPage,
      gapAfter: 0,
    });

    // Dòng 3: gạch dưới
    yR = drawCenteredUnderline(rightX, colW, yR, 80 - 30);
    yR += 6;

    // ===== cập nhật currentY xuống hàng mới (theo cột cao hơn) =====
    const nextY = Math.max(yL, yR) + 6;
    pdf.resetPosition(nextY);

    // page-break an toàn nếu sắp đụng lề dưới
    pdf.checkPageBreak(fontSizeSubTitle);

    return nextY;
  }
  renderTwoColumnHeader(pdf, {
    TenCongTy: "CÔNG TY TNHH XNK TM CN DV Hùng Duy",
  });
  pdf.addText(`Số: ${val(data.soVanBan, "……….")}`, null, null, {
    fontSize: fontSizeContent,
    align: "left",
    spacing: 5,
  });
  pdf.addSpace(3);
  pdf.addTitle("HỢP ĐỒNG HỌC VIỆC/TẬP NGHỀ", { fontSize: 16, fontStyle: "bold", align: "center" });
  pdf.addSpace(3);

  // ===== Căn cứ =====
  pdf.addParagraph(
    "Căn cứ Bộ luật lao động 2019;\n" +
      `Căn cứ cơ cấu tổ chức và quy chế ${val(data.companyShortName, "Công ty ….")}.`,
    { fontSize: fontSizeContent, lineHeight: lineHeightPage, spacing: 1, align: "left" }
  );

  // ===== Mở đầu (thời gian, địa điểm) =====
  pdf.addParagraph(
    `Hôm nay, ngày ${val(data.ngayHop)} tại Văn phòng ${val(
      data.companyShortName,
      "Công ty ….."
    )}, chúng tôi gồm có:`,
    { fontSize: fontSizeContent, lineHeight: lineHeightPage, spacing: 1, align: "justify" }
  );

  // ===== BÊN A =====
  pdf.addSpace(4).addSubTitle("I. BÊN A: NGƯỜI SỬ DỤNG LAO ĐỘNG", {
    fontSize: fontSizeSubTitle,
    lineHeight: 1.5,
  });
  pdf.addParagraph(
    [
      `Ông (Bà)          : ${val(
        data.a_representative,
        "………"
      )}                                  Quốc tịch: ${val(data.a_nationality)}`,
      `Chức vụ           : ${val(data.a_title)}`,
      `Đại diện cho   : ${val(data.companyFullName, "Công ty ……")}`,
      `Địa chỉ             : ${val(data.companyAddress)}`,
      `Điện thoại       : ${val(data.companyPhone)}`,
    ].join("\n"),
    { fontSize: fontSizeContent, lineHeight: lineHeightPage, spacing: 1 }
  );
  pdf.addMixedParagraph(
    [`Sau đây gọi tắt là `, pdf.bold("“Công ty”, “Người sử dụng lao động”, “Bên A”")],
    { fontSize: fontSizeContent, lineHeight: lineHeightPage, spacing: 1 }
  );
  // ===== BÊN B =====
  pdf.addSpace(4).addSubTitle("II. BÊN B: NGƯỜI HỌC VIỆC/TẬP NGHỀ", {
    fontSize: fontSizeSubTitle,
    lineHeight: pdf.lineHeight,
  });
  pdf.addParagraph(
    [
      `Ông (Bà)                 : ${val(data.b_fullName)}                        Quốc tịch: ${val(
        data.b_nationality
      )}`,
      `Sinh năm                : ${val(data.b_birthYear)}                        Giới tính: ${val(
        data.b_gender
      )}`,
      `Địa chỉ thường trú : ${val(data.b_address)}`,
      `Số CCCD                 : ${val(data.b_idNo)}                Cấp ngày: ${val(
        data.b_idDate
      )}            Tại: ${val(data.b_idPlace)}`,
    ].join("\n"),
    { fontSize: fontSizeContent, lineHeight: lineHeightPage, spacing: 1 }
  );
  pdf.addMixedParagraph([`Sau đây gọi tắt là`, pdf.bold(" “Bên B”")], {
    fontSize: fontSizeContent,
    lineHeight: lineHeightPage,
    spacing: 1,
  });
  pdf.addMixedParagraph(
    [
      "Bên A và Bên B sau đây được gọi riêng là ",
      pdf.bold("“Bên” "),
      "và được gọi chung là ",
      pdf.bold("“Các Bên”"),
    ],
    { fontSize: fontSizeContent, lineHeight: lineHeightPage, spacing: 1 }
  );

  pdf.addMixedParagraph(
    [
      "Hai bên cùng ký kết hợp đồng học việc/tập nghề này và cam kết thực hiện đúng các điều khoản sau đây:",
    ],
    { fontSize: fontSizeContent, lineHeight: lineHeightPage, spacing: 1 }
  );

  // ===== Điều 1: Nội dung học việc/tập nghề =====
  pdf.addSpace(2).addSubTitle("Điều 1. Nội dung học việc/tập nghề", {
    fontSize: fontSizeSubTitle,
    lineHeight: 1.5,
  });
  pdf.addNumberedList(
    [
      "Vị trí công việc được hướng dẫn học việc/tập nghề:",
      "Thời gian: từ ngày  ........ đến ngày .......",
      "Địa điểm: [Ghi địa chỉ nơi học việc/tập nghề chính: trụ sở Công ty/chi nhánh/cơ sở khác của công ty] và những địa điểm khác theo bố trí của Công ty.",
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
  // ===== Điều 2: Chế độ học việc/tập nghề =====
  pdf.addSpace(2).addSubTitle("Điều 2. Chế độ học việc/tập nghề", {
    fontSize: fontSizeSubTitle,
    lineHeight: 1.5,
  });
  pdf.addNumberedList(
    [
      "Thời gian: 08 giờ /ngày, theo giờ hành chính hoặc theo ca (theo lịch sắp xếp của người phụ trách hướng dẫn). ",
      "Chế độ nghỉ ngơi: theo lịch nghỉ của Bên A và quy định của pháp luật hiện hành. ",
      "Chế độ nghỉ phép năm, nghỉ lễ, Tết theo quy định của Bên A phù hợp với quy định của pháp luật hiện hành. ",
      "Bên B được cấp phát công cụ dụng cụ, các phương tiện bảo hộ lao động cần thiết phù hợp cho vị trí công việc mà Bên B học việc/tập nghề.",
      "Nội dung được hướng dẫn, đào tạo trong quá trình học việc/tập nghề:",
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
  pdf.margins.left += 5;
  pdf.addNumberedList(
    [
      "Phương pháp vận hành và thao tác vận hành máy ly tâm.",
      "Hướng dẫn …..",
      "Hướng dẫn các quy định liên quan đến việc đảm bảo an toàn vệ sinh lao động, an toàn vệ sinh thực phẩm.",
      "Đào tạo các kiến thức bổ trợ khác có liên quan (nếu có).",
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
  pdf.margins.left -= 5;
  // ===== Điều 3: Nội dung đào tạo =====
  pdf.addSpace(2).addSubTitle("Điều 3. Sau học việc/tập nghề", {
    fontSize: fontSizeSubTitle,
    lineHeight: 1.5,
  });
  pdf.margins.left += 5;
  pdf.addNumberedList(
    [
      "Trước khi kết thúc thời gian học việc /tập nghề được nêu tại Điều 1, Bên A sẽ đánh giá quá trình học việc/tập nghề để quyết định về việc ký hợp đồng lao động với Bên B.",
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
  pdf.margins.left -= 5;

  // ===== Điều 4. Quyền lợi và nghĩa vụ của bên B =====
  pdf.addSpace(2).addSubTitle("Điều 4. Quyền lợi và nghĩa vụ của bên B", {
    fontSize: fontSizeSubTitle,
    lineHeight: pdf.lineHeight,
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
      "Mức lương: …….. đồng/tháng. (Được tính chi trả theo số ngày thực tế mà Bên B trực tiếp tham gia lao động trong thời gian học việc/tập nghề tại địa điểm của Bên A). ",
      "Ngày chi trả: vào ngày …. tây hàng tháng. ",
      "Hình thức chi trả: tiền mặt/chuyển khoản. ",
      "Trong thời gian học việc/tập nghề, nếu Bên B tham gia lao động ngoài giờ làm việc bình thường được nêu tại Điều 2 của hợp đồng này thì được Bên A trả lương làm thêm giờ theo quy định của Công ty. ",
      "Bên B được hưởng chế độ phúc lợi theo quy chế của Công ty (nếu có). ",
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
      "Cung cấp đầy đủ hồ sơ cá nhân để làm thủ tục học việc/ tập nghề tại Công ty.",
      "Tuân thủ theo sự điều hành, phân công và hướng dẫn của người phụ trách.",
      "Tuân thủ Nội quy lao động, quy định nội bộ và các chủ trương, chính sách của Công ty.",
      "Thực hiện đúng các cam kết khác về bảo mật thông tin đã ký (nếu có).",
      "Trong mọi trường hợp và dưới bất kỳ tình huống trực tiếp hay gián tiếp nào, Bên B không được nhận tiền, tài sản và/hoặc bất kỳ lợi ích nào từ bất kỳ cá nhân, tổ chức hoặc bên thứ ba nào khác (sau đây gọi chung là “Bên thứ ba”), dưới bất kỳ lý do gì, liên quan đến giao dịch của Công ty, vi phạm các quy định của Công ty có liên quan đến xung đột lợi ích, cạnh tranh, thông đồng, móc ngoặc, cho và nhận hối lộ, quà biếu/tiền hoặc tài sản khác gây thiệt hại đến lợi ích trực tiếp hay gián tiếp của Bên A.",
      "Bồi thường thiệt hại đã gây ra cho Bên A do vi phạm và trách nhiệm vật chất theo nội quy, quy định của Công ty và theo quy định của pháp luật.",
      "Phải hoàn trả các công cụ dụng cụ mà Bên A đã cung cấp trong trường hợp thôi học việc/tập nghề tại Công ty.",
      "Thực hiện đúng cam kết trong hợp đồng này và các thoả thuận bằng văn bản khác với Công ty (nếu có).",
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
  pdf.margins.left -= 5;
  // ===== Điều 5. Nghĩa vụ và quyền hạn của bên A =====
  pdf.addSpace(2).addSubTitle("Điều 5. Nghĩa vụ và quyền hạn của bên A", {
    fontSize: fontSizeSubTitle,
    lineHeight: 1.5,
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
      "Tạo điều kiện để cho Bên B hoàn thành việc học việc/tập nghề và thực hiện đầy đủ những điều khoản trong hợp đồng này.",
      "Thanh toán đầy đủ, đúng thời hạn các chế độ và quyền lợi cho Bên B theo hợp đồng này.",
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
      "Thực hiện hướng dẫn, đào tạo và quản lý, điều hành Bên B hoàn thành việc học việc/tập nghề và công việc được giao.",
      "Có quyền điều chuyển Bên B giữa các bộ phận, phòng/ban do nhu cầu công việc.",
      "Có quyền thay đổi, tạm hoãn, kỷ luật và chấm dứt hợp đồng khi Bên B vi phạm các điều khoản nêu trong hợp đồng, các quy định, quy chế của công ty và pháp luật của nhà nước.",
      "Yêu cầu Bên B bồi thường tổn thất do vi phạm các nội dung nêu tại hợp đồng này, nội quy lao động, quy định của Công ty và theo quy định của pháp luật.",
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
  pdf.margins.left -= 5;
  // ===== Điều 6. Chấm dứt hợp đồng =====
  pdf.addSpace(2).addSubTitle("Điều 6. Chấm dứt hợp đồng", {
    fontSize: fontSizeSubTitle,
    lineHeight: 1.5,
  });
  pdf.addNumberedList(["Hợp đồng này sẽ chấm dứt hiệu lực khi xảy ra một trong các trường sau:"], {
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
      "Kết thúc thời gian học việc/tập nghề quy định tại Điều 2 của hợp đồng này.",
      "Các bên thỏa thuận chấm dứt hợp đồng.",
      "Công ty bị chấm dứt hoạt động theo quy định pháp luật.",
      "Bên B bị Toà án tuyên bố hạn chế hoặc mất năng lực hành vi dân sự.",
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
  pdf.margins.left -= 5;
  pdf.addNumberedList(
    ["Bên B có quyền đơn phương chấm dứt hợp đồng vì một trong các lý do sau: "],
    {
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
    }
  );
  pdf.margins.left += 5;
  pdf.addNumberedList(
    [
      "Do đi làm nghĩa vụ quân sự có xác nhận của Uỷ ban nhân dân cấp phường, xã nơi cư trú.",
      "Do ốm đau, tai nạn không đủ sức khoẻ, có xác nhận của cơ sở khám bệnh, chữa bệnh có thẩm quyền.",
      "Do có thai, có giấy chứng nhận của cơ sở khám bệnh, chữa bệnh có thẩm quyền về việc thực hiện hợp đồng sẽ ảnh hưởng xấu đến thai nhi.",
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
  pdf.margins.left -= 5;
  pdf.addNumberedList(
    [
      "Bên A có quyền đơn phương chấm dứt hợp đồng vì một trong các lý do sau dẫn tới việc Bên A không còn nhu cầu tuyển dụng Bên B:",
    ],
    {
      itemOptions: {
        numberStyle: "number",
        numberFormat: "3.",
        indent: 4,
        fontSize: fontSizeContent,
        lineHeight: pdf.lineHeight,
        spacing: 1,
        align: "justify",
      },
      resetNumbers: true,
    }
  );
  pdf.margins.left += 5;
  pdf.addNumberedList(
    [
      "Do thiên tai, hỏa hoạn hoặc những lý do bất khả kháng khác theo quy định của pháp luật, mà Bên A đã tìm mọi biện pháp khắc phục nhưng vẫn buộc phải thu hẹp hoạt động sản xuất kinh doanh, giảm chỗ làm việc.",
      "Do thay đổi cơ cấu, công nghệ hoặc vì lý do kinh tế hoặc do sáp nhập, hợp nhất, chia tách Công ty. ",
      "Bên B có những hành vi vi phạm các điều khoản nêu trong hợp đồng này, nội quy, quy định của Công ty và của pháp luật nhà nước.",
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
  pdf.margins.left -= 5;
  // ===== Điều 7. Cam kết bảo mật thông tin của Bên B =====
  pdf.addSpace(2).addSubTitle("Điều 7. Cam kết bảo mật thông tin của Bên B", {
    fontSize: fontSizeSubTitle,
    lineHeight: 1.5,
  });
  pdf.margins.left += 5;
  pdf.addNumberedList(
    [
      "“Thông tin mật” của Công ty TNHH XNK TM CN DV Hùng Duy và các Đơn vị thành viên trực thuộc là bao gồm nhưng không giới hạn những nội dung sau đây: bí mật công nghệ, bí mật kinh doanh, thông tin khách hàng, kế hoạch tài chính, chiến lược công ty,... và các thông tin, tài liệu, ý tưởng thể hiện hoặc lưu trữ dưới dạng văn bản, dữ liệu máy tính, thư điện tử, hình ảnh, mã code, phần mềm tin học,...",
      "Bên B đồng ý và cam kết vô điều kiện rằng tuyệt đối bảo vệ và bảo mật thông tin mật (không được tiết lộ, sử dụng, cung cấp thông tin mật) cho bất kỳ cá nhân, tổ chức, bên thứ ba dưới bất kỳ cách thức và bất kỳ lý do nào (nếu chưa nhận được sự đồng ý bằng văn bản của Bên A) mà Bên B có được trong quá trình làm việc, có liên quan đến công việc và/hoặc thuộc quyền sở hữu hợp pháp của mình nhưng chưa được bộc lộ. Trừ trường hợp buộc phải thực hiện tiết lộ theo quy định của pháp luật và/hoặc yêu cầu của Cơ quan Nhà nước có thẩm quyền, Bên B phải thông báo cho Bên A biết trước để Bên A áp dụng những biện pháp cần thiết nhằm bảo vệ quyền và lợi ích hợp pháp của công ty trước những thông tin mật sắp bị bộc lộ.",
      "Bên B đồng ý và cam kết vô điều kiện rằng sẽ không tiến hành bất kỳ hoạt động giao dịch (ví dụ: liên hệ, cung cấp thông tin, trao đổi, mua bán,...) với bất kỳ cá nhân, tổ chức, bên thứ ba về thông tin mật làm ảnh hưởng trực tiếp/gián tiếp đến quyền và lợi ích hợp pháp của công ty. Đồng thời chấp nhận mọi hình thức kỷ luật hoặc yêu cầu bồi thường từ công ty do những thiệt hại/tổn thất/mất mát phát sinh do vi phạm nghĩa vụ bảo mật theo hợp đồng này.",
      "Bên B đồng ý và cam kết vô điều kiện rằng: đối với tất cả lời tuyên thệ tại Điều 7 của hợp đồng này có giá trị hiệu lực 02 năm sau khi chấm dứt Hợp đồng học việc/tập nghề tại công ty và/hoặc có giá trị hiệu lực đến khi thông tin mật đã được công ty bộc lộ, công khai rộng rãi trên các phương tiện truyền thông đại chúng.",
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
  pdf.margins.left -= 5;
  // ===== Điều 8. Cam kết bảo mật dữ liệu cá nhân của Bên B =====
  pdf.addSpace(2).addSubTitle("Điều 8. Cam kết bảo mật dữ liệu cá nhân của Bên B", {
    fontSize: fontSizeSubTitle,
    lineHeight: 1.5,
  });
  pdf.margins.left += 5;
  pdf.addNumberedList(
    [
      "“Dữ liệu cá nhân” của Bên B là những thông tin nhân thân, thông tin khác hoặc các thông tin riêng tư của cá nhân Bên B, gắn liền với Bên B mà bị xâm phạm sẽ gây ảnh hưởng trực tiếp tới quyền và lợi ích hợp pháp của cá nhân của Bên B (theo Nghị định 13/2023/NĐ-CP)",
      "Bên A cam kết bảo vệ và bảo mật dữ liệu cá nhân của Bên B.",
      "Bên A cam kết không tiến hành bất kỳ hoạt động giao dịch (ví dụ: liên hệ, cung cấp thông tin, trao đổi, mua bán,...) với bất kỳ cá nhân, tổ chức, bên thứ ba về dữ liệu cá nhân của Bên B. Trừ trường hợp buộc phải thực hiện tiết lộ theo quy định của pháp luật và/hoặc yêu cầu của Cơ quan Nhà nước có thẩm quyền làm ảnh hưởng trực tiếp/gián tiếp đến quyền và lợi ích hợp pháp của Bên B.",
      "Bên A sẽ chịu trách nhiệm bồi thường đối với trường hợp dữ liệu cá nhân của Bên B bị bộc lộ (khi chưa nhận được sự chấp thuận của Bên B) làm ảnh hưởng trực tiếp/gián tiếp đến quyền và lợi ích hợp pháp của Bên B.",
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
  pdf.margins.left -= 5;
  // ===== Điều 9. Các thỏa thuận khác =====
  pdf.addSpace(2).addSubTitle("Điều 9. Các thỏa thuận khác", {
    fontSize: fontSizeSubTitle,
    lineHeight: 1.5,
  });
  pdf.margins.left += 5;
  pdf.addNumberedList(
    [
      "Trong thời gian học việc/tập nghề, đối với thu nhập phát sinh hàng tháng từ 2.000.000 đồng trở lên Bên A sẽ trích 10% từ thu nhập hàng tháng của Bên B để nộp cho Nhà nước theo quy định của Luật thuế thu nhập cá nhân. Trong trường hợp Bên B cam kết tổng thu nhập năm chưa đến mức chịu thuế theo quy định của Nhà nước (theo mẫu cam kết quy định) thì Bên A sẽ tạm không thu thuế của Bên B. Bên B sẽ tự quyết toán thuế với Cơ quan thuế và chịu trách nhiệm về cam kết của mình.",
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
        showIndex: false,
      },
      resetNumbers: true,
    }
  );
  pdf.margins.left -= 5;
  // ===== Điều 10. Điều khoản chung =====
  pdf.addSpace(2).addSubTitle("Điều 10. Điều khoản chung", {
    fontSize: fontSizeSubTitle,
    lineHeight: 1.5,
  });
  pdf.margins.left += 5;
  pdf.addNumberedList(
    [
      "Các nội dung khác liên quan đến việc học việc/tập nghề không được quy định trong hợp đồng này sẽ được áp dụng theo Nội quy lao động, Thỏa ước lao động tập thể và theo quy định của pháp luật. ",
      "Hợp đồng này được lập thành hai (02) bản có giá trị pháp lý như nhau, mỗi bên giữ một (01) bản. ",
      "Hợp đồng được lập tại Công ty ….., và có hiệu lực kể từ ngày …………………",
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
  pdf.margins.left -= 5;
  // ===== Chữ ký =====
  pdf.addSpace(3);
  pdf.addDualSignature(
    {
      date: "", // trống theo mẫu
      title: "BÊN B",
      name: val(data.signerB, ""), // để trống cho ký tay
    },
    {
      date: "",
      title: "ĐẠI DIỆN BÊN A",
      name: val(data.signerA, ""),
    }
  );
  // ===== Footer =====
  pdf.addFooter("Trang {pageNumber}/{totalPages}", { fontSize: 8 });
  // ===== Footer số trang =====
  pdf.addFooter("Trang {pageNumber}/{totalPages}", { fontSize: 8 });
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
