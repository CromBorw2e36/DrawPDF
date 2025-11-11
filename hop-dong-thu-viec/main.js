async function init(data = {}) {
  const pdf = new JsPdfService();
  const doc = pdf.doc;
  const M = pdf.margins;

  const val = (v, fallback = "……") => (v && String(v).trim() ? String(v) : fallback);

  // ===== Header =====
  pdf.addText("CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM", null, pdf.getCurrentY(), {
    fontSize: 12,
    fontStyle: "bold",
    align: "center",
    spacing: 5,
  });
  pdf.addText("Độc Lập – Tự Do – Hạnh Phúc", null, null, {
    fontSize: 11,
    align: "center",
    spacing: 5,
  });
  pdf.addText("---o0o---", null, null, { fontSize: 10.5, align: "center", spacing: 5 });
  pdf.addText(`Số : ${val(data.soVanBan, "")}`, null, null, {
    fontSize: 10.5,
    align: "left",
    spacing: 5,
  });
  pdf.addTitle("HỢP ĐỒNG THỬ VIỆC", { fontSize: 16, fontStyle: "bold", align: "center" });
  pdf.addSpace(4);

  // ===== Bên NSDLĐ (cứng) =====
  pdf.addSubTitle("I. Bên Người sử dụng lao động: Công ty TNHH XNK TM CN DV Hùng Duy", {
    fontSize: 12,
    lineHeight: 1.5,
  });
  pdf.addMixedText(["Đại diện bởi Bà     : ", pdf.bold("LÊ MINH TRÚC"), " - Quốc tịch: Việt Nam"], {
    fontSize: 10.5,
    lineHeight: 4,
    spacing: 1,
  });
  pdf.addParagraph(
    [
      "Chức vụ                 : Tổng Giám Đốc",
      `Theo Ủy quyền số ${val(data.authNo, "…..")}, ngày ${val(data.authDate, "….")}`,
      "Địa chỉ                   : Số 250 Lý Thường Kiệt, Khu phố 4, P.Long Hoa, Thị Xã Hòa Thành, Tây Ninh.",
      "Điện thoại             : 0276-3830099",
    ].join("\n"),
    { fontSize: 10.5, lineHeight: 4, spacing: 1 }
  );
  pdf.addMixedText(["Sau đây gọi tắt là ", pdf.bold('"Công ty", "Người sử dụng lao động"')], {
    fontSize: 10.5,
    lineHeight: 5,
    spacing: 1,
  });
  // ===== Bên NLĐ (có chỗ điền) =====
  pdf.addSubTitle("II. Bên Người lao động:", { fontSize: 12, lineHeight: 1.5 });
  pdf.addParagraph(
    [
      `Ông/Bà                           : ${val(
        data.empName,
        "……………………………………"
      )}    Giới tính: ${val(data.empGender, "…………..")}  , Quốc tịch: ${val(
        data.empNationality,
        "…."
      )}`,
      `Ngày/tháng/năm sinh : ${val(data.empDob, "………………………………..")}`,
      `Địa chỉ thường trú        : ${val(data.empAddress, "………………………………………………………")}`,
      `Số CMND/CCCD          : ${val(data.empId, "………………………")} Cấp ngày: ${val(
        data.empIdDate,
        "…………………….."
      )} Tại:  ${val(data.empIdPlace, "…………………")}`,
    ].join("\n"),
    { fontSize: 10.5, lineHeight: 4, spacing: 1 }
  );
  pdf.addMixedText(["Sau đây gọi tắt là ", pdf.bold('"Người lao động"')], {
    fontSize: 10.5,
    lineHeight: 4,
    spacing: 1,
  });
  pdf.addMixedText(
    [
      "Công ty và Người lao động sau đây được gọi riêng là ",
      pdf.bold('"Bên"'),
      " và được gọi chung là ",
      pdf.bold('"Các bên"'),
    ],
    { fontSize: 10.5, lineHeight: 4, spacing: 1 }
  );
  pdf.addMixedText(
    ["Cùng thỏa thuận ký kết Hợp đồng thử việc ", pdf.bold("(HĐTV)"), " với các điều khoản sau:"],
    { fontSize: 10.5, lineHeight: pdf.lineHeight + 5, spacing: 1 }
  );
  // ===== Điều 1 =====
  pdf.addSubTitle("Điều 1. Thời hạn và công việc hợp đồng", { fontSize: 12, lineHeight: 2 });

  pdf.addNumberedList(
    [
      `Thời gian thử việc: [từ ngày ${val(data.trialFrom, "…………………..")}] [đến ngày ${val(
        data.trialTo,
        "………………….."
      )}].`,
      "Địa điểm làm việc: Trụ sở Công ty/chi nhánh/cơ sở khác của Công ty và theo phân công của Công ty.",
      `Vị trí công việc: ${val(data.position, "………………………………………………………………………………")}`,
      "Nhiệm vụ công việc: Thực hiện công việc theo bản mô tả công việc và các công việc khác theo yêu cầu.",
    ],
    {
      itemOptions: {
        numberStyle: "number",
        numberFormat: "{number}.",
        indent: 4,
        fontSize: 10.5,
        lineHeight: pdf.lineHeight,
        spacing: 1,
      },
      resetNumbers: true,
    }
  );
  // ===== Điều 2 =====
  pdf.addSpace(2).addSubTitle("Điều 2. Chế độ làm việc", { fontSize: 12, lineHeight: 1.5 });
  pdf.addNumberedList(
    [
      "Thời gian làm việc: 8 giờ/ngày, 48 giờ/tuần. Lịch làm việc cụ thể sẽ được sắp xếp/điều chỉnh linh hoạt theo yêu cầu công việc và để phù hợp với điều kiện thực tế hoạt động sản xuất kinh doanh của Công ty vào từng thời điểm.",
      "Các công cụ dụng cụ lao động được cấp phát: phù hợp với yêu cầu cần thiết của công việc và chính sách chung của Công ty.",
      "Điều kiện an toàn và vệ sinh lao động tại nơi làm việc theo quy định của pháp luật hiện hành.",
    ],
    {
      itemOptions: {
        numberStyle: "number",
        numberFormat: "{number}.",
        indent: 4,
        fontSize: 10.5,
        lineHeight: pdf.lineHeight,
        spacing: 1,
        align: "justify",
      },
      resetNumbers: true,
    }
  );
  // ===== Điều 3 =====
  pdf.addSpace(2).addSubTitle("Điều 3. Quyền lợi và nghĩa vụ của người lao động", {
    fontSize: 12,
    spacing: 1.5,
    lineHeight: pdf.lineHeight,
  });

  // — Quyền lợi —
  [
    "Trong thời gian thử việc, đối với thu nhập phát sinh hàng tháng từ 2.000.000 VNĐ trở lên, Người sử dụng lao động sẽ thực hiện tạm khấu trừ 10% thuế",
    "thu nhập cá nhân đối với người lao động theo quy định pháp luật (trừ trường hợp người lao động có cam kết theo mẫu để không tạm khấu trừ). Người",
    "lao động tự chịu trách nhiệm về việc kê khai quyết toán thuế với Cơ quan thuế và chịu trách nhiệm về cam kết của mình.",
  ].forEach((line) => pdf.addParagraph(line, { fontSize: 10.5, lineHeight: 4, spacing: 0.5 }));

  pdf.margins.left += 5;
  pdf.addNumberedList(
    [`Tiền lương thử việc: ${val(data.salary, "…………….")} đồng/tháng, trong đó:`],
    {
      itemOptions: {
        numberStyle: "number",
        numberFormat: "-",
        indent: 4,
        fontSize: 10.5,
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
      `Lương vị trí công việc ${val(data.salaryBase, "……………………….")} đồng/tháng.`,
      `Phụ cấp hiệu quả công việc : ${val(
        data.allowance,
        "………………………….."
      )} đồng/tháng. Tiền phụ cấp thực tế căn cứ theo kết quả đánh giá hiệu quả công việc hàng tháng theo quy định của Công ty`,
    ],
    {
      itemOptions: {
        numberStyle: "number",
        numberFormat: "•",
        indent: 4,
        fontSize: 10.5,
        lineHeight: pdf.lineHeight,
        spacing: 1,
        align: "justify",
      },
      resetNumbers: true,
    }
  );
  pdf
    .addMixedText(
      [
        pdf.bold("Hoặc: "),
        `Lương theo doanh số ngành: được chi trả căn cứ chỉ tiêu được giao và kết quả doanh số thực đạt.`,
      ],
      {
        fontSize: 10.5,
        fontStyle: "normal",
        spacing: 3,
        lineHeight: pdf.lineHeight + 2.5,
      }
    )
    .addSpace(1);
  pdf.margins.left -= 5;
  pdf.addNumberedList(
    [
      "Hình thức trả lương: chi trả tiền mặt/chuyển khoản vào tài khoản cá nhân Người lao động.",
      "Người lao động tự chịu các chi phí và rủi ro (nếu có) liên quan đến việc sử dụng và duy trì tài khoản cá nhân của mình.",
      "Ngày trả lương: ngày 8 tây của tháng tiếp theo. Trong trường hợp ngày lương theo quy định nêu trên trùng với ngày nghỉ thì tiền lương sẽ được chi vào ngày trước đó.",
      "Chế độ nghỉ ngơi: Theo nội quy lao động Công ty và quy định pháp luật lao động.",
    ],
    {
      itemOptions: {
        numberStyle: "number",
        numberFormat: "-",
        indent: 4,
        fontSize: 10.5,
        lineHeight: pdf.lineHeight,
        spacing: 1,
        align: "justify",
      },
      resetNumbers: true,
    }
  );
  pdf.margins.left -= 5;
  // — Nghĩa vụ —
  pdf.addParagraph(["2. Nghĩa vụ"], {
    fontSize: 10.5,
    fontStyle: "normal",
    spacing: 3,
    lineHeight: pdf.lineHeight,
  });
  pdf.margins.left += 5;
  pdf.addNumberedList(
    [
      "Làm việc cho Công ty theo địa điểm/nơi làm việc được Công ty bố trí/phân công căn cứ theo tình hình thực tế của Công ty.",
      "Hoàn thành công việc được giao theo hợp đồng này một cách trung thực, nghiêm túc, tận tâm và khẩn trương, hiệu quả best effort, tuân thủ theo sự điều hành/phân công/điều động của cấp trên khi có yêu cầu.",
      "Tuân thủ nội quy lao động, các quy định nội bộ, các chủ trương, chính sách của Công ty và các quy định tại nơi làm việc, các quy định/quy chế/quy trình nghiệp vụ/phối hợp trong quá trình làm việc; đồng thời tuân thủ các quy định tại nơi mà Người lao động được Công ty bố trí làm việc.",
      "Thực hiện đúng các cam kết khác về bảo mật thông tin đã ký (nếu có).",
      "Trong mọi trường hợp và dưới bất kỳ tình huống trực tiếp hay gián tiếp nào, Người lao động tuyệt đối không được tiết lộ, chia sẻ, sử dụng trái phép hoặc gây thiệt hại đến lợi ích trực tiếp hay gián tiếp của Công ty.",
      "Bồi thường thiệt hại đã gây ra cho Công ty do vi phạm và trách nhiệm theo hợp đồng, theo thỏa thuận khác (nếu có), theo nội quy, quy chế của Công ty và theo quy định của pháp luật.",
      "Thực hiện đúng cam kết trong hợp đồng này và các thoả thuận bằng văn bản khác với Công ty (nếu có).",
    ],
    {
      itemOptions: {
        numberStyle: "number",
        numberFormat: "-",
        indent: 4,
        fontSize: 10.5,
        lineHeight: pdf.lineHeight,
        spacing: 1,
        align: "justify",
      },
      resetNumbers: true,
    }
  );
  pdf.margins.left -= 5;
  // ===== Điều 4 =====
  pdf.addSpace(2).addSubTitle("Điều 4. Nghĩa vụ và quyền hạn của người sử dụng lao động", {
    fontSize: 12,
    lineHeight: 1.5,
  });
  pdf.addParagraph(["1. Nghĩa vụ"], {
    fontSize: 10.5,
    fontStyle: "normal",
    spacing: 3,
    lineHeight: pdf.lineHeight,
  });
  pdf.margins.left += 5;
  pdf.addNumberedList(
    [
      "Bảo đảm việc làm và thực hiện đầy đủ những điều khoản trong hợp đồng.",
      "Thanh toán đầy đủ, đúng thời hạn các chế độ và quyền lợi của Người lao động theo hợp đồng này, Thoả ước lao động tập thể và Nội quy lao động của Công ty.",
    ],
    {
      itemOptions: {
        numberStyle: "number",
        numberFormat: "-",
        indent: 4,
        fontSize: 10.5,
        lineHeight: pdf.lineHeight,
        spacing: 1,
        align: "justify",
      },
      resetNumbers: true,
    }
  );
  pdf.margins.left -= 5;
  pdf.addParagraph(["2. Quyền hạn"], {
    fontSize: 10.5,
    fontStyle: "normal",
    spacing: 3,
    lineHeight: pdf.lineHeight,
  });
  pdf.margins.left += 5;
  pdf.addNumberedList(
    [
      "Điều hành Người lao động hoàn thành công việc theo hợp đồng (bố trí, điều chuyển công tác phù hợp,…)",
      "Tạm hoãn, chấm dứt hợp đồng thử việc, kỷ luật người lao động theo quy định của pháp luật, và nội quy lao động của Công ty.",
      "Yêu cầu Người lao động bồi thường tổn thất do vi phạm các nội dung nêu tại hợp đồng này, nội quy lao động, quy định của Công ty và theo quy định của pháp luật.",
    ],
    {
      itemOptions: {
        numberStyle: "number",
        numberFormat: "-",
        indent: 4,
        fontSize: 10.5,
        lineHeight: pdf.lineHeight,
        spacing: 1,
        align: "justify",
      },
      resetNumbers: true,
    }
  );
  pdf.margins.left -= 5;

  // ===== Điều 5 =====
  pdf.addSpace(2).addSubTitle("Điều 5. Cam kết bảo mật thông tin của Người lao động:", {
    fontSize: 12,
    spacing: 1.5,
    lineHeight: pdf.lineHeight,
  });

  pdf.margins.left += 5;
  pdf.addNumberedList(
    [
      "“Thông tin mật” của Công ty TNHH XNK TM CN DV Hùng Duy và các Đơn vị thành viên trực thuộc là bao gồm nhưng không giới hạn những nội dung sau đây: bí mật công nghệ, bí mật kinh doanh, thông tin khách hàng, kế hoạch tài chính, chiến lược công ty,... và các thông tin, tài liệu, ý tưởng thể hiện hoặc lưu trữ dưới dạng văn bản, dữ liệu máy tính, thư điện tử, hình ảnh, mã code, phần mềm tin học,...",
      "Người lao động đồng ý và cam kết vô điều kiện rằng tuyệt đối bảo vệ và bảo mật thông tin mật (không được tiết lộ, sử dụng, cung cấp thông tin mật) cho bất kỳ cá nhân, tổ chức, bên thứ ba dưới bất kỳ cách thức và bất kỳ lý do nào (nếu chưa nhận được sự đồng ý bằng văn bản của Người sử dụng lao động) mà Người lao động có được trong quá trình làm việc, có liên quan đến công việc và/hoặc thuộc quyền sở hữu hợp pháp của mình nhưng chưa được bộc lộ. Trừ trường hợp buộc phải thực hiện tiết lộ theo quy định của pháp luật và/hoặc yêu cầu của Cơ quan Nhà nước có thẩm quyền, Người lao động phải thông báo cho người sử dụng lao động biết trước để Người sử dụng lao động áp dụng những biện pháp cần thiết nhằm bảo vệ quyền và lợi ích hợp pháp của công ty trước những thông tin mật sắp bị bộc lộ.",
      "Người lao động đồng ý và cam kết vô điều kiện rằng sẽ không tiến hành bất kỳ hoạt động giao dịch (ví dụ: liên hệ, cung cấp thông tin, trao đổi, mua bán,...) với bất kỳ cá nhân, tổ chức, bên thứ ba về thông tin mật làm ảnh hưởng trực tiếp/gián tiếp đến quyền và lợi ích hợp pháp của công ty. Đồng thời chấp nhận mọi hình thức kỷ luật hoặc yêu cầu bồi thường từ công ty do những thiệt hại/tổn thất/mất mát phát sinh do vi phạm nghĩa vụ bảo mật theo hợp đồng này.",
      "Người lao động đồng ý và cam kết vô điều kiện rằng: đối với tất cả lời tuyên thệ tại Điều 5 của hợp đồng này có giá trị hiệu lực 02 năm sau khi chấm dứt Hợp đồng thử việc tại công ty và/hoặc có giá trị hiệu lực đến khi thông tin mật đã được công ty bộc lộ, công khai rộng rãi trên các phương tiện truyền thông đại chúng.",
    ],
    {
      itemOptions: {
        numberStyle: "number",
        numberFormat: "{number}.",
        indent: 4,
        fontSize: 10.5,
        lineHeight: pdf.lineHeight,
        spacing: 1,
        align: "justify",
      },
      resetNumbers: true,
    }
  );

  pdf.margins.left -= 5;
  // ===== Điều 6 =====
  pdf
    .addSpace(2)
    .addSubTitle("Điều 6. Cam kết bảo mật dữ liệu cá nhân của Người sử dụng lao động:", {
      fontSize: 12,
      spacing: 1.5,
      lineHeight: pdf.lineHeight,
    });
  pdf.margins.left += 5;
  pdf.addNumberedList(
    [
      "“Dữ liệu cá nhân” của người lao động là những thông tin nhân thân, thông tin khác hoặc các thông tin riêng tư của cá nhân người lao động, gắn liền với người lao động mà bị xâm phạm sẽ gây ảnh hưởng trực tiếp tới quyền và lợi ích hợp pháp của cá nhân của người lao động (theo Nghị định 13/2023/NĐ-CP)",
      "Công ty cam kết bảo vệ và bảo mật dữ liệu cá nhân của người lao động.",
      "Công ty cam kết không tiến hành bất kỳ hoạt động giao dịch (ví dụ: liên hệ, cung cấp thông tin, trao đổi, mua bán,...) với bất kỳ cá nhân, tổ chức, bên thứ ba về dữ liệu cá nhân của người lao động. Trừ trường hợp buộc phải thực hiện tiết lộ theo quy định của pháp luật và/hoặc yêu cầu của Cơ quan Nhà nước có thẩm quyền làm ảnh hưởng trực tiếp/gián tiếp đến quyền và lợi ích hợp pháp của người lao động.",
      "Công ty sẽ chịu trách nhiệm bồi thường đối với trường hợp dữ liệu cá nhân của người lao động bị bộc lộ (khi chưa nhận được sự chấp thuận của người lao động) làm ảnh hưởng trực tiếp/gián tiếp đến quyền và lợi ích hợp pháp của người lao động.",
    ],
    {
      itemOptions: {
        numberStyle: "number",
        numberFormat: "{number}.",
        indent: 4,
        fontSize: 10.5,
        lineHeight: pdf.lineHeight,
        spacing: 1,
        align: "justify",
      },
      resetNumbers: true,
    }
  );
  pdf.margins.left -= 5;
  // ===== Điều 7 =====
  pdf.addSpace(2).addSubTitle("Điều 7. Các thỏa thuận khác", {
    fontSize: 12,
    spacing: 1.5,
    lineHeight: pdf.lineHeight,
  });
  pdf.margins.left += 5;
  pdf.addParagraph(
    "Trong thời gian thử việc, đối với thu nhập phát sinh hàng tháng từ 2.000.000 đồng trở lên Công ty sẽ trích 10% từ thu nhập hàng tháng của Người lao động để nộp cho Nhà nước theo quy định của Luật thuế thu nhập cá nhân. Trong trường hợp Người lao động cam kết tổng thu nhập năm chưa đến mức chịu thuế theo quy định của Nhà nước (cam kết theo mẫu quy định) thì Công ty sẽ tạm không thu thuế của Người lao động. Người lao động sẽ tự quyết toán thuế với Cơ quan thuế và chịu trách nhiệm về cam kết của mình.",
    { fontSize: 10.5, lineHeight: 4, spacing: pdf.lineHeight, align: "justify" }
  );
  pdf.margins.left -= 5;
  // ===== Điều 8 =====
  pdf.addSpace(2).addSubTitle("Điều 8. Điều khoản thi hành", {
    fontSize: 12,
    spacing: 1.5,
    lineHeight: pdf.lineHeight,
  });
  pdf.margins.left += 5;
  pdf.addNumberedList(
    [
      "Những vấn đề về lao động không ghi trong hợp đồng này thì áp dụng theo Nội quy lao động,  Thoả ước lao động tập thể và theo quy định của pháp luật. ",
      `Hợp đồng thử việc này được lập thành 02 bản có giá trị như nhau, mỗi bên giữ 01 bản và có hiệu lực kể từ ngày ${val(
        data.effectiveDate,
        "………………….."
      )}.`,
      "Hợp đồng này được lập tại Công ty TNHH XNK TM CN DV Hùng Duy.",
    ],
    {
      itemOptions: {
        numberStyle: "number",
        numberFormat: "{number}.",
        indent: 4,
        fontSize: 10.5,
        lineHeight: pdf.lineHeight,
        spacing: 1,
        align: "justify",
      },
      resetNumbers: true,
    }
  );
  pdf.margins.left -= 5;

  // ===== Chữ ký =====
  pdf.addSpace(1);
  pdf.addDualSignature(
    {
      date: "", // trống theo mẫu
      title: "NGƯỜI LAO ĐỘNG",
      name: val(data.signerEmployee, ""), // để trống cho ký tay
      signaturePath: data.signaturePathA || null,
      nameTag: "signaturePathA",
    },
    {
      date: "",
      title: "NGƯỜI SỬ DỤNG LAO ĐỘNG",
      name: "LÊ MINH TRÚC",
      signaturePath: data.signaturePathA || null,
      nameTag: "signaturePathA",
    }
  );

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
