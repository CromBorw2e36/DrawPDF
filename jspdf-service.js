class JsPdfService{
    constructor(){
        this.doc = new jspdf.jsPDF();
        this.currentY = 20; // Vị trí Y hiện tại để tự động xuống dòng
        this.lineHeight = 4.5; // Khoảng cách giữa các dòng (giảm từ 7 xuống 4.5)
        this.pageHeight = this.doc.internal.pageSize.height;
        this.pageWidth = this.doc.internal.pageSize.width;
        this.margins = { left: 15, right: 15, top: 20, bottom: 20 };
        
        // Thiết lập font tiếng Việt mặc định
        this.setupVietnameseFont();
    }

    // Thiết lập font tiếng Việt
    setupVietnameseFont() {
        // Kiểm tra và thêm font Roboto nếu có
        try {
            this.doc.getFontList();
            // this.doc.addFont('fonts/Roboto-Regular-normal.js', 'Roboto', 'normal');
            // this.doc.addFont('fonts/Roboto-Bold-normal.js', 'Roboto', 'bold');
            // this.doc.addFont('fonts/Roboto-Italic-normal.js', 'Roboto', 'italic');
            // this.doc.addFont('fonts/Roboto-BoldItalic-normal.js', 'Roboto', 'bolditalic');
            // this.doc.setFont('Roboto', 'normal');
        } catch (error) {
            console.warn('Không thể load font Roboto, sử dụng font mặc định');
            this.doc.setFont('helvetica', 'normal');
        }
    }

    // Kiểm tra và tự động xuống trang
    checkPageBreak(requiredHeight = 10) {
        if (this.currentY + requiredHeight > this.pageHeight - this.margins.bottom) {
            this.addNewPage();
        }
    }

    // Insert text to PDF với hỗ trợ tiếng Việt và xuống dòng
    addText(text, x = null, y = null, options = {}) {
        // Cấu hình mặc định
        const defaultOptions = {
            fontSize: 12,
            fontStyle: 'normal',
            color: [0, 0, 0],
            maxWidth: this.pageWidth - this.margins.left - this.margins.right,
            align: 'left',
            lineHeight: this.lineHeight
        };
        
        const config = { ...defaultOptions, ...options };
        const xPos = x !== null ? x : this.margins.left;
        const yPos = y !== null ? y : this.currentY;
        
        // Thiết lập font và màu
        this.doc.setFontSize(config.fontSize);
        try {
            this.doc.setFont('Roboto', config.fontStyle);
        } catch {
            this.doc.setFont('helvetica', config.fontStyle);
        }
        this.doc.setTextColor(config.color[0], config.color[1], config.color[2]);
        
        // Chia text thành các dòng với độ rộng tối đa
        const lines = this.doc.splitTextToSize(text, config.maxWidth);
        
        // Tính toán chiều cao cần thiết
        const totalHeight = lines.length * config.lineHeight;
        this.checkPageBreak(totalHeight + 5);
        
        // Vẽ từng dòng
        let currentLineY = this.currentY;
        lines.forEach((line, index) => {
            if (config.align === 'center') {
                const textWidth = this.doc.getTextWidth(line);
                const centerX = (this.pageWidth - textWidth) / 2;
                this.doc.text(line, centerX, currentLineY);
            } else if (config.align === 'right') {
                const textWidth = this.doc.getTextWidth(line);
                const rightX = this.pageWidth - this.margins.right - textWidth;
                this.doc.text(line, rightX, currentLineY);
            } else {
                this.doc.text(line, xPos, currentLineY);
            }
            currentLineY += config.lineHeight;
        });
        
        // Cập nhật vị trí Y
        this.currentY = currentLineY + 3;
        
        return this;
    }

    // Thêm tiêu đề với style đặc biệt
    addTitle(title, options = {}) {
        const titleOptions = {
            fontSize: 18,
            fontStyle: 'bold',
            color: [0, 0, 139],
            align: 'center',
            lineHeight: 7, // Giảm từ 10 xuống 7
            ...options
        };
        
        this.addText(title, null, null, titleOptions);
        this.currentY += 3; // Giảm khoảng trống sau tiêu đề từ 5 xuống 3
        
        return this;
    }

    // Thêm tiêu đề phụ
    addSubTitle(subtitle, options = {}) {
        const subtitleOptions = {
            fontSize: 14,
            fontStyle: 'bold',
            color: [0, 0, 0],
            lineHeight: 5.5, // Giảm từ 8 xuống 5.5
            ...options
        };
        
        this.addText(subtitle, null, null, subtitleOptions);
        this.currentY += 2; // Giảm từ 3 xuống 2
        
        return this;
    }

    // Thêm đoạn văn với các option linh hoạt
    addParagraph(paragraph, options = {}) {
        const paragraphOptions = {
            fontSize: 11,
            fontStyle: 'normal',
            color: [0, 0, 0],
            lineHeight: 4, // Giảm từ 6 xuống 4
            ...options
        };
        
        this.addText(paragraph, null, null, paragraphOptions);
        this.currentY += 3; // Giảm khoảng trống giữa các đoạn từ 5 xuống 3
        
        return this;
    }

    // Thêm text với bullet point
    addBulletPoint(text, options = {}) {
        const bulletOptions = {
            fontSize: 11,
            fontStyle: 'normal',
            color: [0, 0, 0],
            lineHeight: 4, // Giảm từ 6 xuống 4
            ...options
        };
        
        // Thêm bullet
        this.doc.setFontSize(bulletOptions.fontSize);
        this.doc.text('•', this.margins.left, this.currentY);
        
        // Thêm text với indent
        const indentedText = text;
        const textOptions = {
            ...bulletOptions,
            maxWidth: bulletOptions.maxWidth - 10
        };
        
        this.addText(indentedText, this.margins.left + 8, this.currentY, textOptions);
        
        return this;
    }

    // Insert image to PDF
    addImage(imageData, x = null, y = null, width = 100, height = 100, options = {}) {
        const xPos = x !== null ? x : this.margins.left;
        const yPos = y !== null ? y : this.currentY;
        
        // Kiểm tra có đủ chỗ không
        this.checkPageBreak(height + 10);
        
        try {
            const format = options.format || 'JPEG';
            this.doc.addImage(imageData, format, xPos, this.currentY, width, height);
            
            // Thêm caption nếu có
            if (options.caption) {
                this.currentY += height + 5;
                this.addText(options.caption, null, null, {
                    fontSize: 9,
                    fontStyle: 'italic',
                    align: 'center',
                    color: [100, 100, 100]
                });
            } else {
                this.currentY += height + 10;
            }
            
        } catch (error) {
            console.error('Lỗi khi thêm ảnh:', error);
        }
        
        return this;
    }

    // Thêm đường kẻ ngang
    addLine(x1 = null, y1 = null, x2 = null, y2 = null, options = {}) {
        const startX = x1 !== null ? x1 : this.margins.left;
        const startY = y1 !== null ? y1 : this.currentY;
        const endX = x2 !== null ? x2 : this.pageWidth - this.margins.right;
        const endY = y2 !== null ? y2 : startY;
        
        const lineOptions = {
            lineWidth: 0.5,
            color: [0, 0, 0],
            ...options
        };
        
        this.doc.setLineWidth(lineOptions.lineWidth);
        this.doc.setDrawColor(lineOptions.color[0], lineOptions.color[1], lineOptions.color[2]);
        this.doc.line(startX, startY, endX, endY);
        
        this.currentY = startY + 8;
        
        return this;
    }

    // Thêm trang mới
    addNewPage() {
        this.doc.addPage();
        this.currentY = this.margins.top;
        return this;
    }

    // Thêm khoảng trống
    addSpace(height = 10) {
        this.currentY += height;
        this.checkPageBreak();
        return this;
    }

    // Reset vị trí
    resetPosition(y = null) {
        this.currentY = y !== null ? y : this.margins.top;
        return this;
    }

    // Lấy vị trí hiện tại
    getCurrentY() {
        return this.currentY;
    }

    // Thêm header cho tất cả trang
    addHeader(text, options = {}) {
        const headerOptions = {
            fontSize: 10,
            fontStyle: 'normal',
            align: 'center',
            y: 10,
            ...options
        };
        
        const totalPages = this.doc.internal.getNumberOfPages();
        const currentPage = this.doc.internal.getCurrentPageInfo().pageNumber;
        
        for (let i = 1; i <= totalPages; i++) {
            this.doc.setPage(i);
            this.doc.setFontSize(headerOptions.fontSize);
            try {
                this.doc.setFont('Roboto', headerOptions.fontStyle);
            } catch {
                this.doc.setFont('helvetica', headerOptions.fontStyle);
            }
            
            if (headerOptions.align === 'center') {
                const textWidth = this.doc.getTextWidth(text);
                const centerX = (this.pageWidth - textWidth) / 2;
                this.doc.text(text, centerX, headerOptions.y);
            } else {
                this.doc.text(text, this.margins.left, headerOptions.y);
            }
        }
        
        // Quay lại trang hiện tại
        this.doc.setPage(currentPage);
        
        return this;
    }

    // Thêm footer cho tất cả trang
    addFooter(text, options = {}) {
        const footerOptions = {
            fontSize: 8,
            fontStyle: 'normal',
            align: 'center',
            y: this.pageHeight - 10,
            ...options
        };
        
        const totalPages = this.doc.internal.getNumberOfPages();
        const currentPage = this.doc.internal.getCurrentPageInfo().pageNumber;
        
        for (let i = 1; i <= totalPages; i++) {
            this.doc.setPage(i);
            this.doc.setFontSize(footerOptions.fontSize);
            try {
                this.doc.setFont('Roboto', footerOptions.fontStyle);
            } catch {
                this.doc.setFont('helvetica', footerOptions.fontStyle);
            }
            
            const footerText = text.replace('{pageNumber}', i).replace('{totalPages}', totalPages);
            
            if (footerOptions.align === 'center') {
                const textWidth = this.doc.getTextWidth(footerText);
                const centerX = (this.pageWidth - textWidth) / 2;
                this.doc.text(footerText, centerX, footerOptions.y);
            } else if (footerOptions.align === 'right') {
                const textWidth = this.doc.getTextWidth(footerText);
                this.doc.text(footerText, this.pageWidth - this.margins.right - textWidth, footerOptions.y);
            } else {
                this.doc.text(footerText, this.margins.left, footerOptions.y);
            }
        }
        
        // Quay lại trang hiện tại
        this.doc.setPage(currentPage);
        
        return this;
    }

    // Save PDF
    savePDF(filename = 'document.pdf') {
        try {
            this.doc.save(filename);
            console.log(`PDF đã được lưu: ${filename}`);
        } catch (error) {
            console.error('Lỗi khi lưu PDF:', error);
        }
    }

    // Gen blob PDF
    generateBlob() {
        try {
            return this.doc.output('blob');
        } catch (error) {
            console.error('Lỗi khi tạo blob:', error);
            return null;
        }
    }

    // Tạo Data URL
    generateDataURL() {
        try {
            return this.doc.output('dataurlstring');
        } catch (error) {
            console.error('Lỗi khi tạo data URL:', error);
            return null;
        }
    }

    // Preview PDF
    previewPDF() {
        try {
            const pdfDataUrl = this.doc.output('dataurlstring');
            window.open(pdfDataUrl, '_blank');
        } catch (error) {
            console.error('Lỗi khi preview PDF:', error);
        }
    }

    // Thêm chữ ký đẹp mắt
    addSignature(name, title, date = null, options = {}) {
        const signatureOptions = {
            align: 'right',
            fontSize: 11,
            titleFontSize: 10,
            nameFontSize: 12,
            spacing: 8, // Giảm spacing từ 15 xuống 8
            signatureHeight: 20, // Giảm chiều cao vùng chữ ký từ 30 xuống 20
            ...options
        };
        
        const currentDate = date || new Date().toLocaleDateString('vi-VN');
        
        // Ngày tháng
        this.addText(currentDate, null, null, {
            align: signatureOptions.align,
            fontSize: signatureOptions.fontSize
        });
        
        this.addSpace(signatureOptions.spacing);
        
        // Tiêu đề chức vụ
        this.addText(title, null, null, {
            align: signatureOptions.align,
            fontSize: signatureOptions.titleFontSize,
            fontStyle: 'bold'
        });
        
        // Ghi chú ký tên
        this.addText('(Ký và ghi rõ họ tên)', null, null, {
            align: signatureOptions.align,
            fontSize: 9,
            fontStyle: 'italic',
            color: [100, 100, 100]
        });
        
        // Vùng trống cho chữ ký
        this.addSpace(signatureOptions.signatureHeight);
        
        // Tên người ký
        this.addText(name, null, null, {
            align: signatureOptions.align,
            fontSize: signatureOptions.nameFontSize,
            fontStyle: 'bold'
        });
        
        this.addSpace(10);
        
        return this;
    }

    // Thêm chữ ký có hình ảnh
    addSignatureWithImage(name, title, imageData, date = null, options = {}) {
        const signatureOptions = {
            align: 'right',
            fontSize: 11,
            titleFontSize: 10,
            nameFontSize: 12,
            spacing: 8, // Giảm spacing từ 15 xuống 8
            imageWidth: 60,
            imageHeight: 20, // Giảm chiều cao hình từ 25 xuống 20
            ...options
        };
        
        const currentDate = date || new Date().toLocaleDateString('vi-VN');
        
        // Ngày tháng
        this.addText(currentDate, null, null, {
            align: signatureOptions.align,
            fontSize: signatureOptions.fontSize
        });
        
        this.addSpace(signatureOptions.spacing);
        
        // Tiêu đề chức vụ
        this.addText(title, null, null, {
            align: signatureOptions.align,
            fontSize: signatureOptions.titleFontSize,
            fontStyle: 'bold'
        });
        
        // Ghi chú
        this.addText('(Ký và ghi rõ họ tên)', null, null, {
            align: signatureOptions.align,
            fontSize: 9,
            fontStyle: 'italic',
            color: [100, 100, 100]
        });
        
        this.addSpace(5);
        
        // Thêm hình chữ ký
        if (imageData) {
            let xPos;
            if (signatureOptions.align === 'right') {
                xPos = this.pageWidth - this.margins.right - signatureOptions.imageWidth;
            } else if (signatureOptions.align === 'center') {
                xPos = (this.pageWidth - signatureOptions.imageWidth) / 2;
            } else {
                xPos = this.margins.left;
            }
            
            this.addImage(imageData, xPos, this.currentY, 
                signatureOptions.imageWidth, signatureOptions.imageHeight, {
                format: 'JPEG'
            });
        } else {
            // Nếu không có hình, tạo vùng trống
            this.addSpace(signatureOptions.imageHeight + 10);
        }
        
        // Tên người ký
        this.addText(name, null, null, {
            align: signatureOptions.align,
            fontSize: signatureOptions.nameFontSize,
            fontStyle: 'bold'
        });
        
        this.addSpace(10);
        
        return this;
    }

    // Thêm chữ ký đơn giản với đường gạch
    addSimpleSignature(name, title, x = null, options = {}) {
        const sigOptions = {
            fontSize: 11,
            lineWidth: 100,
            spacing: 8,
            ...options
        };
        
        const xPos = x || this.margins.left;
        
        // Tiêu đề
        this.addText(title, xPos, null, {
            fontSize: sigOptions.fontSize,
            fontStyle: 'bold'
        });
        
        this.addSpace(sigOptions.spacing);
        
        // Đường kẻ cho chữ ký
        this.doc.setLineWidth(0.5);
        this.doc.line(xPos, this.currentY, xPos + sigOptions.lineWidth, this.currentY);
        
        this.addSpace(5);
        
        // Tên
        this.addText(name, xPos, null, {
            fontSize: sigOptions.fontSize - 1
        });
        
        this.addSpace(15);
        
        return this;
    }

    // Tạo bố cục chữ ký hai cột
    addDualSignature(leftSig, rightSig) {
        const leftX = this.margins.left;
        const rightX = this.pageWidth / 2 + 10;
        const startY = this.currentY;
        
        // Lưu vị trí Y ban đầu
        const originalY = this.currentY;
        
        // Chữ ký bên trái
        this.currentY = originalY;
        this.addText(leftSig.date || new Date().toLocaleDateString('vi-VN'), leftX, null, {
            fontSize: 11
        });
        this.addSpace(10);
        this.addText(leftSig.title, leftX, null, {
            fontSize: 10,
            fontStyle: 'bold'
        });
        this.addText('(Ký và ghi rõ họ tên)', leftX, null, {
            fontSize: 9,
            fontStyle: 'italic',
            color: [100, 100, 100]
        });
        this.addSpace(25);
        this.addText(leftSig.name, leftX, null, {
            fontSize: 11,
            fontStyle: 'bold'
        });
        
        const leftEndY = this.currentY;
        
        // Chữ ký bên phải
        this.currentY = originalY;
        this.addText(rightSig.date || new Date().toLocaleDateString('vi-VN'), rightX, null, {
            fontSize: 11
        });
        this.addSpace(10);
        this.addText(rightSig.title, rightX, null, {
            fontSize: 10,
            fontStyle: 'bold'
        });
        this.addText('(Ký và ghi rõ họ tên)', rightX, null, {
            fontSize: 9,
            fontStyle: 'italic',
            color: [100, 100, 100]
        });
        this.addSpace(25);
        this.addText(rightSig.name, rightX, null, {
            fontSize: 11,
            fontStyle: 'bold'
        });
        
        // Điều chỉnh Y về vị trí thấp nhất
        this.currentY = Math.max(leftEndY, this.currentY) + 10;
        
        return this;
    }

    // Lấy thông tin trang
    getPageInfo() {
        return {
            currentPage: this.doc.internal.getCurrentPageInfo().pageNumber,
            totalPages: this.doc.internal.getNumberOfPages(),
            pageSize: this.doc.internal.pageSize,
            currentY: this.currentY
        };
    }
}