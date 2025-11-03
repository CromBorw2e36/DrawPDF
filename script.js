// Load hình chữ ký mẫu (sửa lỗi CORS)
async function loadSignatureImage() {
    try {
        // Cách 1: Sử dụng fetch để load hình
        const response = await fetch('image/chu-ki-mau.jpg');
        if (!response.ok) throw new Error('Không thể load hình');
        
        const blob = await response.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                resolve(e.target.result);
            };
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.warn('Không thể load hình chữ ký, sử dụng chữ ký thường');
        return null;
    }
}

// Tạo hình chữ ký mẫu bằng canvas (backup method)
function createSampleSignature() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 120;
    canvas.height = 50;
    
    // Nền trắng
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 120, 50);
    
    // Viết chữ ký mẫu
    ctx.fillStyle = 'blue';
    ctx.font = 'italic 16px cursive';
    ctx.fillText('Nguyễn Văn A', 10, 30);
    
    // Thêm một số đường cong để giống chữ ký
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(10, 35);
    ctx.quadraticCurveTo(60, 45, 110, 35);
    ctx.stroke();
    
    return canvas.toDataURL('image/jpeg');
}

// Upload hình chữ ký từ user
function uploadSignatureImage() {
    return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    resolve(e.target.result);
                };
                reader.readAsDataURL(file);
            } else {
                resolve(null);
            }
        };
        
        input.click();
    });
}

// Tạo PDF với chữ ký tùy chọn
async function createPDFWithCustomSignature() {
    console.log('Chọn hình chữ ký của bạn...');
    const customSignature = await uploadSignatureImage();
    
    if (customSignature) {
        const pdf = new JsPdfService();
        pdf.addTitle('PDF VỚI CHỮ KÝ TÙY CHỌN')
            .addSpace(30)
            .addParagraph('Đây là PDF với chữ ký được upload từ máy tính của bạn.')
            .addSpace(30)
            .addSignatureWithImage('Tên của bạn', 'CHỨC VỤ', customSignature, new Date().toLocaleDateString('vi-VN'))
            .savePDF();
    } else {
        console.log('Không có hình được chọn');
    }
}

// Demo đơn xin nghỉ phép - Test tự động sang trang
async function createLeaveRequestDemo() {
    const pdf = new JsPdfService();
    
    // Load hình chữ ký hoặc tạo mẫu
    let signatureImage = await loadSignatureImage();
    if (!signatureImage) {
        signatureImage = createSampleSignature();
        console.log('Sử dụng chữ ký mẫu được tạo bằng canvas');
    }
    
    // Header - Thông tin công ty
    pdf.addText('CÔNG TY TNHH ABC TECHNOLOGY', null, null, {
            fontSize: 14,
            fontStyle: 'bold',
            align: 'center'
        })
        .addText('Địa chỉ: 123 Đường Nguyễn Văn Linh, Quận 7, TP.HCM', null, null, {
            fontSize: 10,
            align: 'center'
        })
        .addText('Điện thoại: 028-1234-5678 | Email: contact@abc.com', null, null, {
            fontSize: 10,
            align: 'center'
        })
        .addLine()
        .addSpace(6)
        
        // Tiêu đề chính
        .addTitle('ĐƠN XIN NGHỈ PHÉP', {
            fontSize: 20,
            fontStyle: 'bold',
            color: [220, 20, 60]
        })
        .addSpace(8)
        
        // Thông tin người xin nghỉ
        .addText('Kính gửi: Ban Giám đốc Công ty TNHH ABC Technology', null, null, {
            fontSize: 12,
            fontStyle: 'bold'
        })
        .addSpace(10)
        
        .addText('Tôi tên là: Nguyễn Văn Nam', null, null, { fontSize: 12 })
        .addText('Chức vụ: Nhân viên Phát triển Phần mềm', null, null, { fontSize: 12 })
        .addText('Phòng ban: Phòng Công nghệ Thông tin', null, null, { fontSize: 12 })
        .addText('Mã số nhân viên: NV001234', null, null, { fontSize: 12 })
        .addSpace(15)
        
        // Nội dung đơn
        .addSubTitle('NỘI DUNG ĐƠN XIN NGHỈ PHÉP')
        .addParagraph('Do có việc gia đình đột xuất cần giải quyết gấp, tôi xin được phép nghỉ làm từ ngày 15/11/2025 đến ngày 20/11/2025 (tổng cộng 6 ngày làm việc).')
        
        .addParagraph('Trong thời gian nghỉ phép, tôi đã sắp xếp và bàn giao công việc như sau:')
        
        .addBulletPoint('Hoàn thành tất cả các task được giao trong dự án WebApp trước ngày 14/11/2025')
        .addBulletPoint('Bàn giao code và tài liệu kỹ thuật cho anh Trần Văn B (Team Lead)')
        .addBulletPoint('Cập nhật tiến độ dự án lên hệ thống quản lý JIRA')
        .addBulletPoint('Thông báo với khách hàng về lịch trình tạm dừng và ngày quay lại làm việc')
        .addBulletPoint('Hướng dẫn anh Lê Văn C xử lý các vấn đề kỹ thuật có thể phát sinh')
        
        .addSpace(10)
        .addParagraph('Tôi cam kết sẽ hoàn thành toàn bộ công việc còn dang dở sau khi trở lại làm việc vào ngày 21/11/2025. Trong trường hợp khẩn cấp, tôi có thể được liên hệ qua số điện thoại: 0901-234-567.')
        
        .addSpace(10)
        .addParagraph('Kính mong Ban Giám đốc xem xét và chấp thuận đơn xin nghỉ phép của tôi.')
        
        .addSpace(20)
        
        // Chữ ký người xin nghỉ (có hình chữ ký)
        .addSignatureWithImage('Nguyễn Văn Nam', 'NGƯỜI XIN NGHỈ PHÉP', signatureImage, 'TP.HCM, ngày 10 tháng 11 năm 2025')
        
        .addSpace(30)
        
        // Phần ý kiến phê duyệt
        .addLine()
        .addSubTitle('Ý KIẾN PHÊ DUYỆT CỦA CẤP TRÊN TRỰC TIẾP')
        .addSpace(10)
        
        .addText('□ Đồng ý cho nghỉ phép', null, null, { fontSize: 12 })
        .addText('□ Không đồng ý', null, null, { fontSize: 12 })
        .addText('□ Khác: ________________________', null, null, { fontSize: 12 })
        
        .addSpace(15)
        .addSignatureWithImage('Trần Văn Bình', 'TRƯỞNG PHÒNG IT', signatureImage, 'Ngày ___/___/2025')
        
        .addSpace(30)
        
        // Phần HR
        .addLine()
        .addSubTitle('Ý KIẾN CỦA PHÒNG NHÂN SỰ')
        .addSpace(10)
        
        .addText('Ghi chú về ngày phép năm còn lại: _______ ngày', null, null, { fontSize: 12 })
        .addText('Tình trạng lương: □ Có lương □ Không lương', null, null, { fontSize: 12 })
        .addText('Ghi chú khác: ________________________________________', null, null, { fontSize: 12 })
        
        .addSpace(15)
        .addSignature('Lê Thị Mai', 'TRƯỞNG PHÒNG NHÂN SỰ', 'Ngày ___/___/2025')
        
        .addSpace(20)
        
        // Phần ban giám đốc
        .addLine()
        .addSubTitle('QUYẾT ĐỊNH CỦA BAN GIÁM ĐỐC')
        .addSpace(10)
        
        .addText('□ Chấp thuận nghỉ phép theo đúng thời gian đề xuất', null, null, { fontSize: 12 })
        .addText('□ Chấp thuận nhưng điều chỉnh thời gian: Từ ___/___/___ đến ___/___/___', null, null, { fontSize: 12 })
        .addText('□ Không chấp thuận', null, null, { fontSize: 12 })
        .addText('Lý do: ________________________________________', null, null, { fontSize: 12 })
        .addText('_____________________________________________', null, null, { fontSize: 12 })
        
        .addSpace(15)
        .addSignatureWithImage('Phạm Minh Đức', 'GIÁM ĐỐC CÔNG TY', signatureImage, 'Ngày ___/___/2025')
        
        // Footer với số trang
        .addFooter('Trang {pageNumber} / {totalPages} - Mẫu đơn xin nghỉ phép', {
            fontSize: 8,
            align: 'center'
        });
    
    return pdf;
}

// Demo chữ ký đôi
function createDualSignatureDemo() {
    const pdf = new JsPdfService();
    
    pdf.addTitle('BIÊN BẢN GIAO NHẬN CÔNG VIỆC')
        .addSpace(20)
        .addParagraph('Hôm nay, ngày 10 tháng 11 năm 2025, tại Công ty ABC Technology, chúng tôi gồm có:')
        .addSpace(10)
        
        .addText('BÊN GIAO: Anh Nguyễn Văn A - Nhân viên cũ', null, null, { fontSize: 12 })
        .addText('BÊN NHẬN: Anh Trần Văn B - Nhân viên mới', null, null, { fontSize: 12 })
        .addSpace(15)
        
        .addParagraph('Tiến hành giao nhận các công việc sau:')
        .addBulletPoint('Dự án WebApp ABC - 80% hoàn thành')
        .addBulletPoint('Database và tài liệu kỹ thuật')  
        .addBulletPoint('Tài khoản hệ thống và mật khẩu')
        .addBulletPoint('Danh sách khách hàng và liên hệ')
        .addSpace(30)
        
        // Chữ ký đôi
        .addDualSignature(
            {
                name: 'Nguyễn Văn A',
                title: 'BÊN GIAO',
                date: 'Ngày 10/11/2025'
            },
            {
                name: 'Trần Văn B', 
                title: 'BÊN NHẬN',
                date: 'Ngày 10/11/2025'
            }
        )
        .addSpace(30)
        
        .addLine()
        .addSpace(20)
        .addSignature('Phạm Minh Đức', 'GIÁM ĐỐC XÁC NHẬN', 'TP.HCM, ngày 10/11/2025');
        
    return pdf;
}

// Demo so sánh các loại chữ ký
async function createSignatureComparisonDemo() {
    const pdf = new JsPdfService();
    let signatureImage = await loadSignatureImage();
    if (!signatureImage) {
        signatureImage = createSampleSignature();
    }
    
    pdf.addTitle('SO SÁNH CÁC LOẠI CHỮ KÝ')
        .addSpace(20)
        
        .addSubTitle('1. Chữ ký thường (văn bản)')
        .addSignature('Nguyễn Văn A', 'NHÂN VIÊN', 'Ngày 10/11/2025')
        .addSpace(20)
        
        .addSubTitle('2. Chữ ký có hình ảnh')
        .addSignatureWithImage('Nguyễn Văn A', 'NHÂN VIÊN', signatureImage, 'Ngày 10/11/2025')
        .addSpace(20)
        
        .addSubTitle('3. Chữ ký đơn giản với đường kẻ')
        .addSimpleSignature('Nguyễn Văn A', 'NHÂN VIÊN')
        .addSpace(20)
        
        .addSubTitle('4. Chữ ký đôi')
        .addDualSignature(
            { name: 'Người ký 1', title: 'CHỨC VỤ 1', date: '10/11/2025' },
            { name: 'Người ký 2', title: 'CHỨC VỤ 2', date: '10/11/2025' }
        );
        
    return pdf;
}

// Tạo và preview PDF với async/await
async function generatePDFs() {
    try {
        // Tạo PDF đơn nghỉ phép với chữ ký có hình
        const leaveRequestPDF = await createLeaveRequestDemo();
        
        // Demo chữ ký đôi
        const dualSigPDF = createDualSignatureDemo();
        
        // Demo so sánh chữ ký
        const comparisonPDF = await createSignatureComparisonDemo();
        
        // Log thông tin trang
        console.log('Thông tin PDF đơn nghỉ phép:', leaveRequestPDF.getPageInfo());
        console.log('Thông tin PDF chữ ký đôi:', dualSigPDF.getPageInfo());
        console.log('Thông tin PDF so sánh chữ ký:', comparisonPDF.getPageInfo());
        
        // Preview PDF so sánh chữ ký
        comparisonPDF.savePDF();
        
        // Hoặc save PDF
        // leaveRequestPDF.savePDF('don-xin-nghi-phep-co-chu-ky.pdf');
        // dualSigPDF.savePDF('bien-ban-giao-nhan.pdf');
        
    } catch (error) {
        console.error('Lỗi khi tạo PDF:', error);
    }
}

// Functions để handle button clicks
async function generateLeaveRequestPDF() {
    try {
        console.log('Đang tạo PDF đơn nghỉ phép...');
        const pdf = await createLeaveRequestDemo();
        pdf.savePDF();
    } catch (error) {
        console.error('Lỗi khi tạo PDF:', error);
        alert('Có lỗi xảy ra khi tạo PDF: ' + error.message);
    }
}

async function generateDualSignaturePDF() {
    try {
        console.log('Đang tạo PDF biên bản giao nhận...');
        const pdf = createDualSignatureDemo();
        pdf.savePDF();
    } catch (error) {
        console.error('Lỗi khi tạo PDF:', error);
        alert('Có lỗi xảy ra khi tạo PDF: ' + error.message);
    }
}

async function generateSignatureComparisonPDF() {
    try {
        console.log('Đang tạo PDF so sánh chữ ký...');
        const pdf = await createSignatureComparisonDemo();
        pdf.savePDF();
    } catch (error) {
        console.error('Lỗi khi tạo PDF:', error);
        alert('Có lỗi xảy ra khi tạo PDF: ' + error.message);
    }
}

async function generateAllPDFs() {
    try {
        console.log('Đang tạo tất cả PDF...');
        
        // Tạo đơn nghỉ phép
        const leaveRequestPDF = await createLeaveRequestDemo();
        
        // Tạo biên bản giao nhận
        const dualSigPDF = createDualSignatureDemo();
        
        // Tạo so sánh chữ ký
        const comparisonPDF = await createSignatureComparisonDemo();
        
        // Log thông tin
        console.log('Thông tin PDF đơn nghỉ phép:', leaveRequestPDF.getPageInfo());
        console.log('Thông tin PDF biên bản:', dualSigPDF.getPageInfo());
        console.log('Thông tin PDF so sánh:', comparisonPDF.getPageInfo());
        
        // Preview PDF chính (đơn nghỉ phép)
        leaveRequestPDF.savePDF();
        
        console.log('Đã tạo xong tất cả PDF!');
        
    } catch (error) {
        console.error('Lỗi khi tạo PDF:', error);
        alert('Có lỗi xảy ra: ' + error.message);
    }
}

// Auto-run khi tải trang (chỉ chạy console log)
console.log('PDF Service đã sẵn sàng! Nhấn các button để test.');

// Gọi function async (comment lại để không auto-run)
// generatePDFs();

