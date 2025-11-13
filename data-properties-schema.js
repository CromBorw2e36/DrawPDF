/**
 * SCHEMA TỔNG HỢP CÁC PROPERTIES CỦA BIẾN DATA
 * Sử dụng cho tất cả các template hợp đồng PDF
 * 
 * @version 1.0
 * @author Contract PDF Generator System
 * @date 2025-11-12
 */

const DataPropertiesSchema = {
  // ========== THÔNG TIN CHUNG HỢP ĐỒNG ==========
  common: {
    soVanBan: {
      type: "string",
      description: "Số văn bản hợp đồng",
      required: true,
      example: "HD001/2025"
    },
    ngayHop: {
      type: "string",
      description: "Ngày họp/ký hợp đồng (dd/mm/yyyy)",
      required: false,
      example: "15/11/2025",
      usedIn: ["phu-luc-hop-dong", "hop-dong-hoc-viec-tap-nghe"]
    },
    ngayKyDay: {
      type: "string", 
      description: "Ngày ký hợp đồng",
      required: false,
      example: "15",
      usedIn: ["hop-dong-cong-tac-vien"]
    },
    ngayKyMonth: {
      type: "string",
      description: "Tháng ký hợp đồng", 
      required: false,
      example: "11",
      usedIn: ["hop-dong-cong-tac-vien"]
    },
    ngayKyYear: {
      type: "string",
      description: "Năm ký hợp đồng",
      required: false,
      example: "2025", 
      usedIn: ["hop-dong-cong-tac-vien"]
    },
    ngayHieuLuc: {
      type: "string",
      description: "Ngày có hiệu lực hợp đồng/phụ lục (dd/mm/yyyy)",
      required: true,
      example: "01/12/2025"
    }
  },

  // ========== FLAGS ĐIỀU KIỆN ==========
  flags: {
    isCpyt: {
      type: "boolean",
      description: "Flag xác định công ty y tế hay TNHH (true: Y tế, false: TNHH)",
      required: false,
      default: false,
      usedIn: ["phu-luc-hop-dong-lao-dong"]
    },
    isHdldNguoiCaoTuoi: {
      type: "boolean", 
      description: "Flag hợp đồng lao động người cao tuổi (ảnh hưởng Điều 7)",
      required: false,
      default: false,
      usedIn: ["hop-dong-lao-dong-cpyt"]
    }
  },

  // ========== THÔNG TIN CÔNG TY/NGƯỜI SỬ DỤNG LAO ĐỘNG (BÊN A) ==========
  company: {
    // Tên công ty
    tenCongTy: {
      type: "string",
      description: "Tên công ty đầy đủ",
      required: true,
      example: "Công ty TNHH ABC"
    },
    companyShortName: {
      type: "string",
      description: "Tên ngắn gọn công ty",
      required: false,
      example: "Công ty ABC",
      usedIn: ["phu-luc-hop-dong", "hop-dong-hoc-viec-tap-nghe"]
    },
    companyFullName: {
      type: "string",
      description: "Tên đầy đủ công ty (dùng riêng cho học việc)",
      required: false,
      example: "Công ty Trách Nhiệm Hữu Hạn ABC",
      usedIn: ["hop-dong-hoc-viec-tap-nghe"]
    },

    // Địa chỉ và liên hệ
    companyAddress: {
      type: "string",
      description: "Địa chỉ công ty chính thức",
      required: true,
      example: "123 Đường ABC, Quận 1, TP.HCM"
    },
    diaChiCongTy: {
      type: "string",
      description: "Địa chỉ ký hợp đồng/văn phòng công ty",
      required: false,
      example: "Văn phòng Công ty ABC",
      usedIn: ["hop-dong-cong-tac-vien"]
    },
    companyPhone: {
      type: "string",
      description: "Số điện thoại công ty",
      required: true,
      example: "0123-456-789"
    },
    companyFax: {
      type: "string",
      description: "Số fax công ty",
      required: false,
      example: "0123-456-790",
      usedIn: ["phu-luc-hop-dong-lao-dong"]
    },
    companyTaxCode: {
      type: "string",
      description: "Mã số thuế công ty",
      required: false,
      example: "0123456789",
      usedIn: ["hop-dong-cong-tac-vien"]
    },

    // Người đại diện
    a_representative: {
      type: "string",
      description: "Tên người đại diện công ty",
      required: true,
      example: "Nguyễn Văn A"
    },
    a_nationality: {
      type: "string", 
      description: "Quốc tịch người đại diện",
      required: true,
      example: "Việt Nam",
      default: "Việt Nam"
    },
    a_title: {
      type: "string",
      description: "Chức vụ người đại diện",
      required: true,
      example: "Giám đốc"
    },
    a_cccd: {
      type: "string",
      description: "Số CCCD người đại diện",
      required: false,
      example: "123456789012",
      usedIn: ["hop-dong-cong-tac-vien"]
    },
    a_ngayCapCccd: {
      type: "string",
      description: "Ngày cấp CCCD người đại diện",
      required: false,
      example: "01/01/2020",
      usedIn: ["hop-dong-cong-tac-vien"]
    },

    // Ủy quyền
    soUyQuyen: {
      type: "string",
      description: "Số ủy quyền (optional)",
      required: false,
      example: "UQ001/2025"
    },
    ngayUyQuyen: {
      type: "string",
      description: "Ngày ủy quyền (optional)",
      required: false,
      example: "01/11/2025"
    }
  },

  // ========== THÔNG TIN NGƯỜI LAO ĐỘNG (BÊN B) ==========
  employee: {
    // Thông tin cá nhân
    b_fullName: {
      type: "string",
      description: "Họ tên đầy đủ người lao động",
      required: true,
      example: "Trần Thị B"
    },
    b_gender: {
      type: "string",
      description: "Giới tính người lao động",
      required: true,
      example: "Nữ",
      options: ["Nam", "Nữ"]
    },
    b_nationality: {
      type: "string",
      description: "Quốc tịch người lao động",
      required: true,
      example: "Việt Nam",
      default: "Việt Nam"
    },
    b_birthYear: {
      type: "string",
      description: "Ngày/tháng/năm sinh",
      required: true,
      example: "15/03/1990"
    },
    b_address: {
      type: "string",
      description: "Địa chỉ thường trú",
      required: true,
      example: "456 Đường XYZ, Quận 2, TP.HCM"
    },

    // Giấy tờ tuy thân
    b_idNo: {
      type: "string",
      description: "Số CCCD/CMND",
      required: true,
      example: "987654321098"
    },
    b_idDate: {
      type: "string",
      description: "Ngày cấp CCCD/CMND",
      required: true,
      example: "01/01/2015"
    },
    b_idPlace: {
      type: "string",
      description: "Nơi cấp CCCD/CMND",
      required: true,
      example: "CA TP.HCM"
    },

    // Thông tin đặc biệt (cho cộng tác viên)
    queQuanCongTacVien: {
      type: "string",
      description: "Quê quán cộng tác viên",
      required: false,
      example: "Hà Nội",
      usedIn: ["hop-dong-cong-tac-vien"]
    }
  },

  // ========== THÔNG TIN HỢP ĐỒNG VÀ CÔNG VIỆC ==========
  contract: {
    // Loại và thời hạn hợp đồng
    tenLoaiHopDong: {
      type: "string",
      description: "Loại hợp đồng (xác định/không xác định thời hạn)",
      required: false,
      example: "Hợp đồng xác định thời hạn",
      usedIn: ["hop-dong-lao-dong", "hop-dong-lao-dong-cpyt"]
    },
    thoiGianBatDauHopDong: {
      type: "string",
      description: "Thời điểm bắt đầu hợp đồng",
      required: true,
      example: "01/12/2025"
    },
    thoiGianKetThucHopDong: {
      type: "string",
      description: "Thời điểm kết thúc hợp đồng",
      required: false,
      example: "30/11/2026"
    },
    ngayBatDauHopDong: {
      type: "string",
      description: "Ngày bắt đầu hợp đồng (dd/mm/yyyy)",
      required: false,
      example: "01/12/2025",
      usedIn: ["hop-dong-hoc-viec-tap-nghe"]
    },
    ngayKetThucHopDong: {
      type: "string", 
      description: "Ngày kết thúc hợp đồng (dd/mm/yyyy)",
      required: false,
      example: "30/11/2026",
      usedIn: ["hop-dong-hoc-viec-tap-nghe"]
    },
    ngayHieuLucHopDong: {
      type: "string",
      description: "Ngày có hiệu lực hợp đồng (dd/mm/yyyy)",
      required: false,
      example: "01/12/2025",
      usedIn: ["hop-dong-hoc-viec-tap-nghe"]
    },

    // Nơi làm việc và vị trí
    tenNoiLamViec: {
      type: "string",
      description: "Địa điểm làm việc",
      required: true,
      example: "123 Đường ABC, Quận 1, TP.HCM"
    },
    tenViTriCongViec: {
      type: "string",
      description: "Vị trí công việc",
      required: true,
      example: "Nhân viên kinh doanh"
    },
    thoiGianLamViec: {
      type: "string",
      description: "Thời gian làm việc (giờ/ngày, giờ/tuần)",
      required: true,
      example: "8 giờ/ngày, 48 giờ/tuần",
      default: "8 giờ/ngày, 48 giờ/tuần"
    },
    huongDanCongViec: {
      type: "string",
      description: "Nội dung hướng dẫn công việc cụ thể",
      required: false,
      example: "Hướng dẫn quy trình sản xuất",
      usedIn: ["hop-dong-hoc-viec-tap-nghe"]
    },

    // Thông tin hợp đồng gốc (cho phụ lục)
    soHopDong: {
      type: "string",
      description: "Số hợp đồng lao động gốc", 
      required: false,
      example: "HDLD001/2025",
      usedIn: ["phu-luc-hop-dong-lao-dong"]
    },
    ngayKyHopDong: {
      type: "string",
      description: "Ngày ký hợp đồng gốc (dd/mm/yyyy)",
      required: false,
      example: "01/01/2025",
      usedIn: ["phu-luc-hop-dong-lao-dong"]
    },

    // Nội dung sửa đổi/bổ sung
    noiDungSuDoiHopDong: {
      type: "Array<string>",
      description: "Mảng các nội dung sửa đổi/bổ sung",
      required: false,
      example: ["Thay đổi mức lương", "Thay đổi vị trí công việc"],
      usedIn: ["hop-dong-cong-tac-vien", "phu-luc-hop-dong-lao-dong"]
    }
  },

  // ========== THÔNG TIN LƯƠNG VÀ PHÚC LỢI ==========
  salary: {
    // Lương chính
    luongChinh: {
      type: "string",
      description: "Mức lương cơ bản/chính (số tiền)",
      required: true,
      example: "10000000",
      note: "Đơn vị: VND"
    },

    // Lương bổ sung (cho thử việc)
    luongCoSo: {
      type: "string",
      description: "Lương vị trí công việc (optional)",
      required: false,
      example: "8000000",
      usedIn: ["hop-dong-thu-viec"]
    },
    phuCapHieuQua: {
      type: "string",
      description: "Phụ cấp hiệu quả công việc (optional)", 
      required: false,
      example: "2000000",
      usedIn: ["hop-dong-thu-viec"]
    },

    // Thanh toán
    ngayTraLuong: {
      type: "string",
      description: "Ngày trả lương hàng tháng",
      required: true,
      example: "05",
      note: "Ngày trong tháng (1-31)"
    }
  },

  // ========== THÔNG TIN CHỮ KÝ ==========
  signature: {
    signerA: {
      type: "string",
      description: "Tên người ký đại diện công ty",
      required: true,
      example: "Nguyễn Văn A"
    },
    signerB: {
      type: "string", 
      description: "Tên người ký lao động/cộng tác viên",
      required: true,
      example: "Trần Thị B"
    },
    signaturePathA: {
      type: "string",
      description: "Đường dẫn ảnh chữ ký người đại diện công ty",
      required: false,
      example: "/signatures/company_signature.png"
    },
    signaturePathB: {
      type: "string",
      description: "Đường dẫn ảnh chữ ký người lao động", 
      required: false,
      example: "/signatures/employee_signature.png"
    }
  }
};

/**
 * TEMPLATE MAPPING - Xác định properties nào được sử dụng trong template nào
 */
const TemplatePropertiesMapping = {
  "hop-dong-lao-dong": {
    required: [
      "soVanBan", "tenCongTy", "companyAddress", "companyPhone", 
      "a_representative", "a_nationality", "a_title",
      "b_fullName", "b_gender", "b_nationality", "b_birthYear", "b_address", "b_idNo", "b_idDate", "b_idPlace",
      "tenLoaiHopDong", "thoiGianBatDauHopDong", "thoiGianKetThucHopDong", "tenNoiLamViec", "tenViTriCongViec", "thoiGianLamViec",
      "luongChinh", "ngayTraLuong", "ngayHieuLuc", "signerA", "signerB"
    ],
    optional: ["soUyQuyen", "ngayUyQuyen", "signaturePathA", "signaturePathB"]
  },
  
  "hop-dong-lao-dong-cpyt": {
    required: [
      "soVanBan", "isHdldNguoiCaoTuoi", "tenCongTy", "companyAddress", "companyPhone",
      "a_representative", "a_nationality", "a_title", 
      "b_fullName", "b_gender", "b_nationality", "b_birthYear", "b_address", "b_idNo", "b_idDate", "b_idPlace",
      "tenLoaiHopDong", "thoiGianBatDauHopDong", "thoiGianKetThucHopDong", "tenNoiLamViec", "tenViTriCongViec", "thoiGianLamViec",
      "luongChinh", "ngayTraLuong", "ngayHieuLuc", "signerA", "signerB"
    ],
    optional: ["soUyQuyen", "ngayUyQuyen", "signaturePathA", "signaturePathB"]
  },

  "hop-dong-thu-viec": {
    required: [
      "soVanBan", "tenCongTy", "companyAddress", "companyPhone",
      "a_representative", "a_nationality", "a_title",
      "b_fullName", "b_gender", "b_nationality", "b_birthYear", "b_address", "b_idNo", "b_idDate", "b_idPlace",
      "thoiGianBatDauHopDong", "thoiGianKetThucHopDong", "tenNoiLamViec", "tenViTriCongViec", "thoiGianLamViec",
      "luongChinh", "ngayTraLuong", "ngayHieuLuc", "signerA", "signerB"
    ],
    optional: ["soUyQuyen", "ngayUyQuyen", "luongCoSo", "phuCapHieuQua", "signaturePathA", "signaturePathB"]
  },

  "hop-dong-hoc-viec-tap-nghe": {
    required: [
      "soVanBan", "ngayHop", "companyFullName", "companyShortName", "companyAddress", "companyPhone",
      "a_representative", "a_nationality", "a_title",
      "b_fullName", "b_nationality", "b_birthYear", "b_gender", "b_address", "b_idNo", "b_idDate", "b_idPlace",
      "ngayBatDauHopDong", "ngayKetThucHopDong", "tenNoiLamViec", "huongDanCongViec",
      "luongChinh", "ngayTraLuong", "signerA", "signerB"
    ],
    optional: ["ngayHieuLucHopDong", "signaturePathA", "signaturePathB"]
  },

  "hop-dong-cong-tac-vien": {
    required: [
      "soVanBan", "ngayKyDay", "ngayKyMonth", "ngayKyYear", "tenCongTy", "diaChiCongTy", "companyAddress", "companyPhone", "companyTaxCode",
      "a_representative", "a_title", "a_cccd", "a_ngayCapCccd", "a_nationality",
      "b_fullName", "b_birthYear", "b_gender", "queQuanCongTacVien", "b_address", "b_idNo", "b_idDate",
      "luongChinh", "ngayTraLuong", "signerA", "signerB"
    ],
    optional: ["soUyQuyen", "ngayUyQuyen", "noiDungSuDoiHopDong", "signaturePathA", "signaturePathB"]
  },

  "phu-luc-hop-dong-lao-dong": {
    required: [
      "soVanBan", "ngayHop", "isCpyt", "companyShortName", "tenCongTy", "companyAddress", "companyPhone",
      "a_representative", "a_nationality", "a_title",
      "b_fullName", "b_gender", "b_nationality", "b_birthYear", "b_address", "b_idNo", "b_idDate", "b_idPlace",
      "soHopDong", "ngayKyHopDong", "ngayHieuLuc", "signerA", "signerB"
    ],
    optional: ["companyFax", "soUyQuyen", "ngayUyQuyen", "luongChinh", "noiDungSuDoiHopDong", "signaturePathA", "signaturePathB"]
  }
};

/**
 * VALIDATION FUNCTIONS
 */
const ValidationHelpers = {
  /**
   * Validate data object cho template cụ thể
   */
  validateTemplate: (templateName, data) => {
    const mapping = TemplatePropertiesMapping[templateName];
    if (!mapping) {
      throw new Error(`Template "${templateName}" không được hỗ trợ`);
    }

    const errors = [];
    
    // Kiểm tra required properties
    mapping.required.forEach(prop => {
      if (!data[prop] || data[prop].toString().trim() === '') {
        errors.push(`Property "${prop}" là bắt buộc cho template "${templateName}"`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  },

  /**
   * Tạo data object mẫu cho template
   */
  createSampleData: (templateName) => {
    const mapping = TemplatePropertiesMapping[templateName];
    if (!mapping) {
      throw new Error(`Template "${templateName}" không được hỗ trợ`);
    }

    const sampleData = {};
    
    // Lấy tất cả properties (required + optional)
    const allProps = [...mapping.required, ...mapping.optional];
    
    // Tạo sample data
    allProps.forEach(propPath => {
      const value = getPropertyExample(propPath);
      if (value !== undefined) {
        sampleData[propPath] = value;
      }
    });

    return sampleData;
  }
};

/**
 * Helper function để lấy example value từ schema
 */
function getPropertyExample(propertyPath) {
  // Tìm property trong tất cả các sections
  const sections = [DataPropertiesSchema.common, DataPropertiesSchema.flags, DataPropertiesSchema.company, 
                   DataPropertiesSchema.employee, DataPropertiesSchema.contract, DataPropertiesSchema.salary, 
                   DataPropertiesSchema.signature];
  
  for (const section of sections) {
    if (section[propertyPath]) {
      return section[propertyPath].example || section[propertyPath].default;
    }
  }
  
  return undefined;
}

// Export cho sử dụng
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    DataPropertiesSchema,
    TemplatePropertiesMapping,
    ValidationHelpers
  };
}