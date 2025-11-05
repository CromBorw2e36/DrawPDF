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

    // Insert image to PDF với nhiều tính năng
    addImage(imageData, x = null, y = null, width = 100, height = 100, options = {}) {
        const defaultOptions = {
            format: 'JPEG',
            align: 'left',
            caption: null,
            captionOptions: {
                fontSize: 9,
                fontStyle: 'italic',
                color: [100, 100, 100]
            },
            border: false,
            borderOptions: {
                width: 1,
                color: [0, 0, 0]
            },
            compression: 'MEDIUM',
            rotation: 0,
            ...options
        };
        
        let xPos = x !== null ? x : this.margins.left;
        const yPos = y !== null ? y : this.currentY;
        
        // Căn chỉnh hình ảnh
        if (defaultOptions.align === 'center') {
            xPos = (this.pageWidth - width) / 2;
        } else if (defaultOptions.align === 'right') {
            xPos = this.pageWidth - this.margins.right - width;
        }
        
        // Kiểm tra có đủ chỗ không
        this.checkPageBreak(height + 15);
        
        try {
            // Auto-detect format từ data URL
            let format = defaultOptions.format;
            if (typeof imageData === 'string' && imageData.startsWith('data:')) {
                if (imageData.includes('data:image/png')) format = 'PNG';
                else if (imageData.includes('data:image/jpeg') || imageData.includes('data:image/jpg')) format = 'JPEG';
                else if (imageData.includes('data:image/gif')) format = 'GIF';
                else if (imageData.includes('data:image/webp')) format = 'WEBP';
            }
            
            // Thêm hình ảnh với jsPDF addImage
            this.doc.addImage(
                imageData, 
                format, 
                xPos, 
                this.currentY, 
                width, 
                height,
                '', // alias (để trống)
                defaultOptions.compression,
                defaultOptions.rotation
            );
            
            // Thêm border nếu cần
            if (defaultOptions.border) {
                this.doc.setLineWidth(defaultOptions.borderOptions.width);
                const borderColor = Array.isArray(defaultOptions.borderOptions.color) ? 
                    defaultOptions.borderOptions.color : [0, 0, 0];
                this.doc.setDrawColor(...borderColor);
                this.doc.rect(xPos, this.currentY, width, height);
            }
            
            // Cập nhật vị trí Y
            this.currentY += height + 5;
            
            // Thêm caption nếu có
            if (defaultOptions.caption) {
                this.addText(defaultOptions.caption, null, null, {
                    ...defaultOptions.captionOptions,
                    align: defaultOptions.align
                });
            } else {
                this.currentY += 5;
            }
            
        } catch (error) {
            console.error('Lỗi khi thêm ảnh:', error);
            // Thêm placeholder nếu lỗi
            this.addText(`[Lỗi hiển thị ảnh: ${error.message}]`, xPos, null, {
                fontSize: 10,
                color: [255, 0, 0],
                align: defaultOptions.align
            });
        }
        
        return this;
    }

    // Thêm ảnh từ file path
    async addImageFromPath(imagePath, x = null, y = null, width = 100, height = 100, options = {}) {
        try {
            const imageData = await this.loadImageFromPath(imagePath);
            if (imageData) {
                return this.addImage(imageData, x, y, width, height, options);
            } else {
                throw new Error(`Không thể load ảnh từ ${imagePath}`);
            }
        } catch (error) {
            console.error('Lỗi khi thêm ảnh từ path:', error);
            // Thêm placeholder
            this.addText(`[Không thể load ảnh: ${imagePath}]`, x, y, {
                fontSize: 10,
                color: [255, 0, 0]
            });
        }
        return this;
    }

    // Thêm ảnh với auto-resize để fit trong khung
    addImageFit(imageData, x = null, y = null, maxWidth = 150, maxHeight = 150, options = {}) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                // Tính toán kích thước fit
                let { width, height } = this.calculateFitSize(
                    img.naturalWidth, 
                    img.naturalHeight, 
                    maxWidth, 
                    maxHeight
                );
                
                this.addImage(imageData, x, y, width, height, options);
                resolve(this);
            };
            img.onerror = () => {
                console.error('Không thể load ảnh để tính kích thước');
                this.addImage(imageData, x, y, maxWidth, maxHeight, options);
                resolve(this);
            };
            img.src = imageData;
        });
    }

    // Tính toán kích thước fit
    calculateFitSize(originalWidth, originalHeight, maxWidth, maxHeight) {
        const widthRatio = maxWidth / originalWidth;
        const heightRatio = maxHeight / originalHeight;
        const ratio = Math.min(widthRatio, heightRatio);
        
        return {
            width: originalWidth * ratio,
            height: originalHeight * ratio
        };
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

    // Thêm chữ ký đẹp mắt với nội dung căn giữa theo khối
    addSignature(name, title, date = null, options = {}) {
        const signatureOptions = {
            align: 'right',
            fontSize: 11,
            titleFontSize: 10,
            nameFontSize: 12,
            spacing: 8,
            signatureHeight: 20,
            blockWidth: 100, // Độ rộng khối chữ ký
            ...options
        };
        
        const currentDate = date || new Date().toLocaleDateString('vi-VN');
        
        // Tính vị trí X của khối chữ ký
        let blockX;
        if (signatureOptions.align === 'right') {
            blockX = this.pageWidth - this.margins.right - signatureOptions.blockWidth;
        } else if (signatureOptions.align === 'center') {
            blockX = (this.pageWidth - signatureOptions.blockWidth) / 2;
        } else {
            blockX = this.margins.left;
        }
        
        // Tính X căn giữa trong khối
        const centerX = blockX + (signatureOptions.blockWidth / 2);
        
        // Ngày tháng - căn giữa trong khối
        this.doc.setFontSize(signatureOptions.fontSize);
        try {
            this.doc.setFont('Roboto', 'normal');
        } catch {
            this.doc.setFont('helvetica', 'normal');
        }
        this.doc.setTextColor(0, 0, 0);
        
        const dateWidth = this.doc.getTextWidth(currentDate);
        const dateX = centerX - (dateWidth / 2);
        this.doc.text(currentDate, dateX, this.currentY);
        this.currentY += signatureOptions.spacing;
        
        // Tiêu đề chức vụ - căn giữa trong khối
        this.doc.setFontSize(signatureOptions.titleFontSize);
        try {
            this.doc.setFont('Roboto', 'bold');
        } catch {
            this.doc.setFont('helvetica', 'bold');
        }
        
        const titleWidth = this.doc.getTextWidth(title);
        const titleX = centerX - (titleWidth / 2);
        this.doc.text(title, titleX, this.currentY);
        this.currentY += 5;
        
        // Ghi chú ký tên - căn giữa trong khối
        const noteText = '(Ký và ghi rõ họ tên)';
        this.doc.setFontSize(9);
        try {
            this.doc.setFont('Roboto', 'italic');
        } catch {
            this.doc.setFont('helvetica', 'italic');
        }
        this.doc.setTextColor(100, 100, 100);
        
        const noteWidth = this.doc.getTextWidth(noteText);
        const noteX = centerX - (noteWidth / 2);
        this.doc.text(noteText, noteX, this.currentY);
        this.currentY += signatureOptions.spacing;
        
        // Vùng trống cho chữ ký
        this.addSpace(signatureOptions.signatureHeight);
        
        // Tên người ký - căn giữa trong khối
        this.doc.setFontSize(signatureOptions.nameFontSize);
        try {
            this.doc.setFont('Roboto', 'bold');
        } catch {
            this.doc.setFont('helvetica', 'bold');
        }
        this.doc.setTextColor(0, 0, 0);
        
        const nameWidth = this.doc.getTextWidth(name);
        const nameX = centerX - (nameWidth / 2);
        this.doc.text(name, nameX, this.currentY);
        this.currentY += 15;
        
        return this;
    }

    // Load hình từ file path
    async loadImageFromPath(imagePath) {
        try {
            const response = await fetch(imagePath);
            if (!response.ok) throw new Error(`Không thể load hình từ ${imagePath}`);
            
            const blob = await response.blob();
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    resolve(e.target.result);
                };
                reader.onerror = function(e) {
                    reject(new Error('Lỗi khi đọc file'));
                };
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            console.warn(`Không thể load hình từ ${imagePath}:`, error.message);
            return null;
        }
    }

    // Thêm chữ ký có hình ảnh với nội dung căn giữa theo khối
    async addSignatureWithImage(name, title, imageSource, date = null, options = {}) {
        const signatureOptions = {
            align: 'right',
            fontSize: 11,
            titleFontSize: 10,
            nameFontSize: 12,
            spacing: 8,
            imageWidth: 60,
            imageHeight: 20,
            blockWidth: 100, // Độ rộng khối chữ ký
            ...options
        };
        
        const currentDate = date || new Date().toLocaleDateString('vi-VN');
        
        // Tính vị trí X của khối chữ ký
        let blockX;
        if (signatureOptions.align === 'right') {
            blockX = this.pageWidth - this.margins.right - signatureOptions.blockWidth;
        } else if (signatureOptions.align === 'center') {
            blockX = (this.pageWidth - signatureOptions.blockWidth) / 2;
        } else {
            blockX = this.margins.left;
        }
        
        // Tính X căn giữa trong khối
        const centerX = blockX + (signatureOptions.blockWidth / 2);
        
        // Ngày tháng - căn giữa trong khối
        this.doc.setFontSize(signatureOptions.fontSize);
        try {
            this.doc.setFont('Roboto', 'normal');
        } catch {
            this.doc.setFont('helvetica', 'normal');
        }
        this.doc.setTextColor(0, 0, 0);
        
        const dateWidth = this.doc.getTextWidth(currentDate);
        const dateX = centerX - (dateWidth / 2);
        this.doc.text(currentDate, dateX, this.currentY);
        this.currentY += signatureOptions.spacing;
        
        // Tiêu đề chức vụ - căn giữa trong khối
        this.doc.setFontSize(signatureOptions.titleFontSize);
        try {
            this.doc.setFont('Roboto', 'bold');
        } catch {
            this.doc.setFont('helvetica', 'bold');
        }
        
        const titleWidth = this.doc.getTextWidth(title);
        const titleX = centerX - (titleWidth / 2);
        this.doc.text(title, titleX, this.currentY);
        this.currentY += 5;
        
        // Ghi chú ký tên - căn giữa trong khối
        const noteText = '(Ký và ghi rõ họ tên)';
        this.doc.setFontSize(9);
        try {
            this.doc.setFont('Roboto', 'italic');
        } catch {
            this.doc.setFont('helvetica', 'italic');
        }
        this.doc.setTextColor(100, 100, 100);
        
        const noteWidth = this.doc.getTextWidth(noteText);
        const noteX = centerX - (noteWidth / 2);
        this.doc.text(noteText, noteX, this.currentY);
        this.currentY += signatureOptions.spacing;
        
        this.addSpace(5);
        
        // Xử lý imageSource (có thể là path hoặc data)
        let imageData = null;
        
        if (imageSource) {
            if (typeof imageSource === 'string') {
                // Nếu là string, kiểm tra xem là path hay data URL
                if (imageSource.startsWith('data:')) {
                    // Là data URL
                    imageData = imageSource;
                } else {
                    // Là file path, load từ path
                    imageData = await this.loadImageFromPath(imageSource);
                }
            } else {
                // Đã là imageData
                imageData = imageSource;
            }
        }
        
        // Thêm hình chữ ký - căn giữa trong khối
        if (imageData) {
            const imageX = centerX - (signatureOptions.imageWidth / 2);
            
            this.addImage(imageData, imageX, this.currentY, 
                signatureOptions.imageWidth, signatureOptions.imageHeight, {
                format: 'JPEG'
            });
        } else {
            // Nếu không có hình, tạo vùng trống
            this.addSpace(signatureOptions.imageHeight + 10);
        }
        
        // Tên người ký - căn giữa trong khối
        this.doc.setFontSize(signatureOptions.nameFontSize);
        try {
            this.doc.setFont('Roboto', 'bold');
        } catch {
            this.doc.setFont('helvetica', 'bold');
        }
        this.doc.setTextColor(0, 0, 0);
        
        const nameWidth = this.doc.getTextWidth(name);
        const nameX = centerX - (nameWidth / 2);
        this.doc.text(name, nameX, this.currentY);
        this.currentY += 15;
        
        return this;
    }

    // Thêm chữ ký từ file path (phương thức tiện lợi)
    async addSignatureFromFile(name, title, imagePath, date = null, options = {}) {
        return await this.addSignatureWithImage(name, title, imagePath, date, options);
    }

    // Thêm chữ ký với nhiều tùy chọn hình ảnh
    async addSmartSignature(name, title, imageOptions = {}, date = null, options = {}) {
        const { 
            imagePath = null, 
            imageData = null, 
            fallbackText = null,
            createFallback = true 
        } = imageOptions;
        
        let finalImageData = null;
        
        // Thử load từ path trước
        if (imagePath) {
            finalImageData = await this.loadImageFromPath(imagePath);
        }
        
        // Nếu không được, dùng imageData
        if (!finalImageData && imageData) {
            finalImageData = imageData;
        }
        
        // Nếu vẫn không có và cho phép tạo fallback
        if (!finalImageData && createFallback) {
            finalImageData = this.createTextSignature(fallbackText || name);
        }
        
        return await this.addSignatureWithImage(name, title, finalImageData, date, options);
    }

    // Tạo chữ ký text đơn giản
    createTextSignature(text, width = 120, height = 40) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;
        
        // Nền trắng
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);
        
        // Viết chữ ký
        ctx.fillStyle = '#1a5490';
        ctx.font = 'italic bold 14px cursive, "Times New Roman", serif';
        
        // Căn giữa text
        const textWidth = ctx.measureText(text).width;
        const x = (width - textWidth) / 2;
        const y = height / 2 + 5;
        
        ctx.fillText(text, x, y);
        
        // Thêm đường gạch dưới
        ctx.strokeStyle = '#1a5490';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x - 5, y + 8);
        ctx.lineTo(x + textWidth + 5, y + 8);
        ctx.stroke();
        
        return canvas.toDataURL('image/png');
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

    // Tạo bố cục chữ ký hai cột với nội dung căn giữa theo khối
    addDualSignature(leftSig, rightSig) {
        const blockWidth = 90;
        const leftBlockX = this.margins.left;
        const rightBlockX = this.pageWidth / 2 + 10;
        const leftCenterX = leftBlockX + (blockWidth / 2);
        const rightCenterX = rightBlockX + (blockWidth / 2);
        
        // Lưu vị trí Y ban đầu
        const originalY = this.currentY;
        
        // Chữ ký bên trái - căn giữa trong khối
        this.currentY = originalY;
        
        // Date trái
        const leftDate = leftSig.date || new Date().toLocaleDateString('vi-VN');
        this.doc.setFontSize(11);
        try { this.doc.setFont('Roboto', 'normal'); } catch { this.doc.setFont('helvetica', 'normal'); }
        this.doc.setTextColor(0, 0, 0);
        const leftDateWidth = this.doc.getTextWidth(leftDate);
        this.doc.text(leftDate, leftCenterX - (leftDateWidth / 2), this.currentY);
        this.currentY += 8;
        
        // Title trái
        this.doc.setFontSize(10);
        try { this.doc.setFont('Roboto', 'bold'); } catch { this.doc.setFont('helvetica', 'bold'); }
        const leftTitleWidth = this.doc.getTextWidth(leftSig.title);
        this.doc.text(leftSig.title, leftCenterX - (leftTitleWidth / 2), this.currentY);
        this.currentY += 5;
        
        // Note trái
        const leftNote = '(Ký và ghi rõ họ tên)';
        this.doc.setFontSize(9);
        try { this.doc.setFont('Roboto', 'italic'); } catch { this.doc.setFont('helvetica', 'italic'); }
        this.doc.setTextColor(100, 100, 100);
        const leftNoteWidth = this.doc.getTextWidth(leftNote);
        this.doc.text(leftNote, leftCenterX - (leftNoteWidth / 2), this.currentY);
        this.currentY += 25;
        
        // Name trái
        this.doc.setFontSize(11);
        try { this.doc.setFont('Roboto', 'bold'); } catch { this.doc.setFont('helvetica', 'bold'); }
        this.doc.setTextColor(0, 0, 0);
        const leftNameWidth = this.doc.getTextWidth(leftSig.name);
        this.doc.text(leftSig.name, leftCenterX - (leftNameWidth / 2), this.currentY);
        
        const leftEndY = this.currentY;
        
        // Chữ ký bên phải - căn giữa trong khối
        this.currentY = originalY;
        
        // Date phải
        const rightDate = rightSig.date || new Date().toLocaleDateString('vi-VN');
        this.doc.setFontSize(11);
        try { this.doc.setFont('Roboto', 'normal'); } catch { this.doc.setFont('helvetica', 'normal'); }
        this.doc.setTextColor(0, 0, 0);
        const rightDateWidth = this.doc.getTextWidth(rightDate);
        this.doc.text(rightDate, rightCenterX - (rightDateWidth / 2), this.currentY);
        this.currentY += 8;
        
        // Title phải
        this.doc.setFontSize(10);
        try { this.doc.setFont('Roboto', 'bold'); } catch { this.doc.setFont('helvetica', 'bold'); }
        const rightTitleWidth = this.doc.getTextWidth(rightSig.title);
        this.doc.text(rightSig.title, rightCenterX - (rightTitleWidth / 2), this.currentY);
        this.currentY += 5;
        
        // Note phải
        const rightNote = '(Ký và ghi rõ họ tên)';
        this.doc.setFontSize(9);
        try { this.doc.setFont('Roboto', 'italic'); } catch { this.doc.setFont('helvetica', 'italic'); }
        this.doc.setTextColor(100, 100, 100);
        const rightNoteWidth = this.doc.getTextWidth(rightNote);
        this.doc.text(rightNote, rightCenterX - (rightNoteWidth / 2), this.currentY);
        this.currentY += 25;
        
        // Name phải
        this.doc.setFontSize(11);
        try { this.doc.setFont('Roboto', 'bold'); } catch { this.doc.setFont('helvetica', 'bold'); }
        this.doc.setTextColor(0, 0, 0);
        const rightNameWidth = this.doc.getTextWidth(rightSig.name);
        this.doc.text(rightSig.name, rightCenterX - (rightNameWidth / 2), this.currentY);
        
        // Điều chỉnh Y về vị trí thấp nhất
        this.currentY = Math.max(leftEndY, this.currentY) + 10;
        
        return this;
    }

    // Thêm leader dots (dấu chấm dẫn)
    addLeaderDots(leftText, rightText, options = {}) {
        const leaderOptions = {
            fontSize: 11,
            fontStyle: 'normal',
            color: [0, 0, 0],
            dotChar: '.',
            dotSpacing: 3, // Khoảng cách giữa các dấu chấm
            minDots: 3, // Số chấm tối thiểu
            leftPadding: 5, // Khoảng cách sau text trái
            rightPadding: 5, // Khoảng cách trước text phải
            lineHeight: 6,
            ...options
        };
        
        // Thiết lập font
        this.doc.setFontSize(leaderOptions.fontSize);
        try {
            this.doc.setFont('Roboto', leaderOptions.fontStyle);
        } catch {
            this.doc.setFont('helvetica', leaderOptions.fontStyle);
        }
        const leaderColor = Array.isArray(leaderOptions.color) ? 
            leaderOptions.color : [0, 0, 0];
        this.doc.setTextColor(...leaderColor);
        
        // Tính toán vị trí
        const leftTextWidth = this.doc.getTextWidth(leftText);
        const rightTextWidth = this.doc.getTextWidth(rightText);
        const dotWidth = this.doc.getTextWidth(leaderOptions.dotChar);
        
        const leftX = this.margins.left;
        const rightX = this.pageWidth - this.margins.right - rightTextWidth;
        const leftEndX = leftX + leftTextWidth + leaderOptions.leftPadding;
        const rightStartX = rightX - leaderOptions.rightPadding;
        
        // Tính số lượng chấm
        const availableWidth = rightStartX - leftEndX;
        const dotsCount = Math.max(
            leaderOptions.minDots, 
            Math.floor(availableWidth / (dotWidth + leaderOptions.dotSpacing))
        );
        
        // Kiểm tra page break
        this.checkPageBreak(leaderOptions.lineHeight + 3);
        
        // Vẽ text trái
        this.doc.text(leftText, leftX, this.currentY);
        
        // Vẽ các dấu chấm
        let dotX = leftEndX;
        for (let i = 0; i < dotsCount; i++) {
            if (dotX + dotWidth <= rightStartX) {
                this.doc.text(leaderOptions.dotChar, dotX, this.currentY);
                dotX += dotWidth + leaderOptions.dotSpacing;
            }
        }
        
        // Vẽ text phải
        this.doc.text(rightText, rightX, this.currentY);
        
        this.currentY += leaderOptions.lineHeight;
        
        return this;
    }

    // Thêm table of contents với leader dots
    addTableOfContents(items, options = {}) {
        const tocOptions = {
            title: 'MỤC LỤC',
            titleOptions: {
                fontSize: 16,
                fontStyle: 'bold',
                align: 'center'
            },
            itemOptions: {
                fontSize: 11,
                fontStyle: 'normal',
                indent: 0
            },
            subItemOptions: {
                fontSize: 10,
                fontStyle: 'normal',
                indent: 15
            },
            ...options
        };
        
        // Thêm tiêu đề mục lục
        if (tocOptions.title) {
            this.addText(tocOptions.title, null, null, tocOptions.titleOptions);
            this.addSpace(10);
        }
        
        // Thêm các mục
        items.forEach(item => {
            const itemText = typeof item === 'string' ? item : item.title;
            const pageNum = typeof item === 'object' ? item.page : '';
            const isSubItem = typeof item === 'object' && item.isSubItem;
            
            const itemOpts = isSubItem ? tocOptions.subItemOptions : tocOptions.itemOptions;
            const leftPadding = itemOpts.indent || 0;
            
            // Tạo text với indent
            const paddedText = ' '.repeat(leftPadding / 3) + itemText;
            
            this.addLeaderDots(paddedText, pageNum.toString(), {
                ...itemOpts,
                leftPadding: 5,
                rightPadding: 5
            });
        });
        
        return this;
    }

    // Thêm price list với leader dots
    addPriceList(items, options = {}) {
        const priceOptions = {
            title: 'BẢNG GIÁ',
            titleOptions: {
                fontSize: 16,
                fontStyle: 'bold',
                align: 'center'
            },
            itemOptions: {
                fontSize: 11,
                fontStyle: 'normal'
            },
            currency: 'VNĐ',
            ...options
        };
        
        // Thêm tiêu đề
        if (priceOptions.title) {
            this.addText(priceOptions.title, null, null, priceOptions.titleOptions);
            this.addSpace(10);
        }
        
        // Thêm các mục giá
        items.forEach(item => {
            const itemName = item.name || item.title;
            const price = item.price || item.cost || 0;
            const priceText = this.formatPrice(price, priceOptions.currency);
            
            this.addLeaderDots(itemName, priceText, {
                ...priceOptions.itemOptions,
                leftPadding: 8,
                rightPadding: 8
            });
        });
        
        return this;
    }

    // Thêm menu với leader dots
    addMenu(sections, options = {}) {
        const menuOptions = {
            title: 'THỰC ĐƠN',
            titleOptions: {
                fontSize: 18,
                fontStyle: 'bold',
                align: 'center',
                color: [139, 0, 0]
            },
            sectionOptions: {
                fontSize: 14,
                fontStyle: 'bold',
                color: [0, 0, 139]
            },
            itemOptions: {
                fontSize: 11,
                fontStyle: 'normal'
            },
            currency: 'VNĐ',
            ...options
        };
        
        // Thêm tiêu đề menu
        if (menuOptions.title) {
            this.addText(menuOptions.title, null, null, menuOptions.titleOptions);
            this.addSpace(15);
        }
        
        // Thêm các section
        sections.forEach(section => {
            // Tên section
            this.addText(section.name, null, null, menuOptions.sectionOptions);
            this.addSpace(8);
            
            // Các món trong section
            section.items.forEach(item => {
                const dishName = `${item.name}${item.description ? ` - ${item.description}` : ''}`;
                const priceText = this.formatPrice(item.price, menuOptions.currency);
                
                this.addLeaderDots(dishName, priceText, {
                    ...menuOptions.itemOptions,
                    leftPadding: 10,
                    rightPadding: 10,
                    dotChar: '.',
                    dotSpacing: 2
                });
            });
            
            this.addSpace(12);
        });
        
        return this;
    }

    // Thêm index với leader dots
    addIndex(entries, options = {}) {
        const indexOptions = {
            title: 'CHỈ MỤC',
            titleOptions: {
                fontSize: 16,
                fontStyle: 'bold',
                align: 'center'
            },
            itemOptions: {
                fontSize: 10,
                fontStyle: 'normal'
            },
            columns: 2, // Số cột
            ...options
        };
        
        // Thêm tiêu đề
        if (indexOptions.title) {
            this.addText(indexOptions.title, null, null, indexOptions.titleOptions);
            this.addSpace(10);
        }
        
        if (indexOptions.columns === 1) {
            // Single column
            entries.forEach(entry => {
                this.addLeaderDots(entry.term, entry.pages.join(', '), {
                    ...indexOptions.itemOptions,
                    leftPadding: 5,
                    rightPadding: 5,
                    lineHeight: 5
                });
            });
        } else {
            // Multiple columns
            const itemsPerColumn = Math.ceil(entries.length / indexOptions.columns);
            const columnWidth = (this.pageWidth - this.margins.left - this.margins.right) / indexOptions.columns;
            
            for (let col = 0; col < indexOptions.columns; col++) {
                const startIdx = col * itemsPerColumn;
                const endIdx = Math.min(startIdx + itemsPerColumn, entries.length);
                const columnItems = entries.slice(startIdx, endIdx);
                
                const originalY = this.currentY;
                const columnX = this.margins.left + (col * columnWidth);
                
                // Reset Y cho cột mới (trừ cột đầu tiên)
                if (col > 0) this.currentY = originalY;
                
                columnItems.forEach(entry => {
                    const termWidth = this.doc.getTextWidth(entry.term);
                    const pagesWidth = this.doc.getTextWidth(entry.pages.join(', '));
                    
                    // Tính toán leader dots cho cột
                    this.doc.setFontSize(indexOptions.itemOptions.fontSize);
                    const dotWidth = this.doc.getTextWidth('.');
                    const availableWidth = columnWidth - termWidth - pagesWidth - 15;
                    const dotsCount = Math.max(3, Math.floor(availableWidth / (dotWidth + 2)));
                    
                    // Vẽ term
                    this.doc.text(entry.term, columnX, this.currentY);
                    
                    // Vẽ dots
                    let dotX = columnX + termWidth + 5;
                    for (let i = 0; i < dotsCount; i++) {
                        this.doc.text('.', dotX, this.currentY);
                        dotX += dotWidth + 2;
                    }
                    
                    // Vẽ pages
                    const pageX = columnX + columnWidth - pagesWidth - 5;
                    this.doc.text(entry.pages.join(', '), pageX, this.currentY);
                    
                    this.currentY += 5;
                });
            }
        }
        
        return this;
    }

    // Format giá tiền
    formatPrice(price, currency = 'VNĐ') {
        if (typeof price === 'number') {
            return price.toLocaleString('vi-VN') + ' ' + currency;
        }
        return price.toString() + ' ' + currency;
    }

    // Thêm Fill-in line (đường kẻ để điền thông tin)
    addFillInLine(label = '', options = {}) {
        const defaultFillOptions = {
            lineCount: 1, // Số dòng kẻ
            lineLength: 100, // Độ dài mỗi dòng
            lineSpacing: 8, // Khoảng cách giữa các dòng
            lineStyle: 'dots', // 'solid', 'dashed', 'dotted', 'dots'
            lineWidth: 0.5, // Độ dày đường kẻ
            lineColor: [0, 0, 0], // Màu đường kẻ
            dotSpacing: 1, // Khoảng cách giữa các dấu chấm (cho style 'dots')
            dotChar: '.', // Ký tự dùng cho dots
            labelPosition: 'left', // 'left', 'right', 'above', 'below', 'none'
            labelOptions: {
                fontSize: 11,
                fontStyle: 'normal',
                color: [0, 0, 0],
                spacing: 5 // Khoảng cách từ label đến line
            },
            align: 'left', // 'left', 'center', 'right'
            showPlaceholder: false, // Hiển thị placeholder text
            placeholderText: '(điền thông tin)',
            placeholderOptions: {
                fontSize: 9,
                fontStyle: 'italic',
                color: [150, 150, 150]
            }
        };

        // Merge options safely
        const fillOptions = {
            ...defaultFillOptions,
            ...options,
            labelOptions: {
                ...defaultFillOptions.labelOptions,
                ...(options.labelOptions || {})
            },
            placeholderOptions: {
                ...defaultFillOptions.placeholderOptions,
                ...(options.placeholderOptions || {})
            }
        };

        let startX, startY;
        const yPos = this.currentY;

        // Tính toán vị trí X dựa trên align
        if (fillOptions.align === 'center') {
            startX = (this.pageWidth - fillOptions.lineLength) / 2;
        } else if (fillOptions.align === 'right') {
            startX = this.pageWidth - this.margins.right - fillOptions.lineLength;
        } else {
            startX = this.margins.left;
        }

        // Xử lý label
        if (label && fillOptions.labelPosition !== 'none') {
            this.doc.setFontSize(fillOptions.labelOptions.fontSize);
            try {
                this.doc.setFont('Roboto', fillOptions.labelOptions.fontStyle);
            } catch {
                this.doc.setFont('helvetica', fillOptions.labelOptions.fontStyle);
            }
            const labelColor = Array.isArray(fillOptions.labelOptions.color) ? 
                fillOptions.labelOptions.color : [0, 0, 0];
            this.doc.setTextColor(...labelColor);

            const labelWidth = this.doc.getTextWidth(label);

            if (fillOptions.labelPosition === 'above') {
                // Label ở trên
                const labelX = fillOptions.align === 'center' ? 
                    (this.pageWidth - labelWidth) / 2 : 
                    (fillOptions.align === 'right' ? 
                        this.pageWidth - this.margins.right - labelWidth : 
                        this.margins.left);
                this.doc.text(label, labelX, this.currentY);
                this.currentY += fillOptions.labelOptions.spacing;
            } else if (fillOptions.labelPosition === 'left') {
                // Label ở bên trái
                this.doc.text(label, this.margins.left, this.currentY);
                startX = this.margins.left + labelWidth + fillOptions.labelOptions.spacing;
                fillOptions.lineLength = Math.min(fillOptions.lineLength, 
                    this.pageWidth - this.margins.right - startX);
            } else if (fillOptions.labelPosition === 'right') {
                // Label ở bên phải (vẽ line trước)
                // Sẽ vẽ sau khi vẽ line
            }
        }

        // Kiểm tra page break
        const totalHeight = (fillOptions.lineCount - 1) * fillOptions.lineSpacing + 10;
        this.checkPageBreak(totalHeight);

        // Thiết lập style đường kẻ
        this.doc.setLineWidth(fillOptions.lineWidth);
        const drawColor = Array.isArray(fillOptions.lineColor) ? 
            fillOptions.lineColor : [0, 0, 0];
        this.doc.setDrawColor(...drawColor);

        // Vẽ các đường kẻ hoặc dots
        for (let i = 0; i < fillOptions.lineCount; i++) {
            const lineY = this.currentY + (i * fillOptions.lineSpacing);
            
            if (fillOptions.lineStyle === 'dots') {
                // Vẽ bằng dấu chấm
                this.doc.setFontSize(fillOptions.labelOptions.fontSize);
                try {
                    this.doc.setFont('Roboto', 'normal');
                } catch {
                    this.doc.setFont('helvetica', 'normal');
                }
                const lineColor = Array.isArray(fillOptions.lineColor) ? 
                    fillOptions.lineColor : [0, 0, 0];
                this.doc.setTextColor(...lineColor);
                
                const dotWidth = this.doc.getTextWidth(fillOptions.dotChar);
                const totalDots = Math.floor(fillOptions.lineLength / (dotWidth + fillOptions.dotSpacing));
                
                for (let j = 0; j < totalDots; j++) {
                    const dotX = startX + (j * (dotWidth + fillOptions.dotSpacing));
                    if (dotX + dotWidth <= startX + fillOptions.lineLength) {
                        this.doc.text(fillOptions.dotChar, dotX, lineY);
                    }
                }
            } else {
                // Vẽ bằng đường kẻ thông thường
                if (fillOptions.lineStyle === 'dashed') {
                    this.doc.setLineDashPattern([3, 2], 0);
                } else if (fillOptions.lineStyle === 'dotted') {
                    this.doc.setLineDashPattern([1, 2], 0);
                } else {
                    this.doc.setLineDashPattern([], 0); // solid
                }
                
                this.doc.line(startX, lineY, startX + fillOptions.lineLength, lineY);
            }

            // Thêm placeholder text nếu có
            if (fillOptions.showPlaceholder && fillOptions.placeholderText) {
                this.doc.setFontSize(fillOptions.placeholderOptions.fontSize);
                try {
                    this.doc.setFont('Roboto', fillOptions.placeholderOptions.fontStyle);
                } catch {
                    this.doc.setFont('helvetica', fillOptions.placeholderOptions.fontStyle);
                }
                const placeholderColor = Array.isArray(fillOptions.placeholderOptions.color) ? 
                    fillOptions.placeholderOptions.color : [150, 150, 150];
                this.doc.setTextColor(...placeholderColor);
                
                const placeholderY = lineY - 2; // Hơi trên đường kẻ một chút
                this.doc.text(fillOptions.placeholderText, startX + 5, placeholderY);
            }
        }

        // Reset line dash
        this.doc.setLineDashPattern([], 0);

        // Xử lý label bên phải (sau khi vẽ line)
        if (label && fillOptions.labelPosition === 'right') {
            this.doc.setFontSize(fillOptions.labelOptions.fontSize);
            try {
                this.doc.setFont('Roboto', fillOptions.labelOptions.fontStyle);
            } catch {
                this.doc.setFont('helvetica', fillOptions.labelOptions.fontStyle);
            }
            const rightLabelColor = Array.isArray(fillOptions.labelOptions.color) ? 
                fillOptions.labelOptions.color : [0, 0, 0];
            this.doc.setTextColor(...rightLabelColor);

            const labelX = startX + fillOptions.lineLength + fillOptions.labelOptions.spacing;
            this.doc.text(label, labelX, this.currentY);
        }

        // Xử lý label bên dưới
        if (label && fillOptions.labelPosition === 'below') {
            const finalLineY = this.currentY + ((fillOptions.lineCount - 1) * fillOptions.lineSpacing);
            this.currentY = finalLineY + fillOptions.labelOptions.spacing;

            const labelWidth = this.doc.getTextWidth(label);
            const labelX = fillOptions.align === 'center' ? 
                (this.pageWidth - labelWidth) / 2 : 
                (fillOptions.align === 'right' ? 
                    this.pageWidth - this.margins.right - labelWidth : 
                    this.margins.left);
            this.doc.text(label, labelX, this.currentY);
        }

        // Cập nhật currentY
        this.currentY += ((fillOptions.lineCount - 1) * fillOptions.lineSpacing) + 10;

        return this;
    }

    // Tạo form fill-in nhanh
    addFillInForm(fields, options = {}) {
        const formOptions = {
            title: null,
            titleOptions: {
                fontSize: 14,
                fontStyle: 'bold',
                color: [0, 0, 0]
            },
            fieldSpacing: 12,
            columns: 1, // Số cột
            ...options
        };

        // Thêm tiêu đề form nếu có
        if (formOptions.title) {
            this.addText(formOptions.title, null, null, formOptions.titleOptions);
            this.addSpace(8);
        }

        if (formOptions.columns === 1) {
            // Single column
            fields.forEach(field => {
                const fieldOptions = {
                    lineLength: 150,
                    labelPosition: 'left',
                    ...field.options
                };
                
                this.addFillInLine(field.label || '', fieldOptions);
                this.addSpace(formOptions.fieldSpacing - 10);
            });
        } else {
            // Multi-column
            const fieldsPerColumn = Math.ceil(fields.length / formOptions.columns);
            const columnWidth = (this.pageWidth - this.margins.left - this.margins.right) / formOptions.columns;

            for (let i = 0; i < fields.length; i += fieldsPerColumn) {
                const columnFields = fields.slice(i, i + fieldsPerColumn);
                const colIndex = Math.floor(i / fieldsPerColumn);
                const originalY = this.currentY;

                columnFields.forEach((field, fieldIndex) => {
                    if (colIndex > 0) {
                        this.currentY = originalY + (fieldIndex * formOptions.fieldSpacing);
                    }

                    const fieldOptions = {
                        lineLength: columnWidth - 20,
                        labelPosition: 'above',
                        align: 'left',
                        ...field.options
                    };

                    const startX = this.margins.left + (colIndex * columnWidth);
                    
                    // Override startX calculation
                    const originalMarginLeft = this.margins.left;
                    this.margins.left = startX;
                    
                    this.addFillInLine(field.label || '', fieldOptions);
                    
                    // Restore margins
                    this.margins.left = originalMarginLeft;

                    if (colIndex === 0) {
                        // Chỉ increment Y cho cột đầu tiên
                        this.addSpace(formOptions.fieldSpacing - 10);
                    }
                });
            }
        }

        return this;
    }

    // Tạo signature line với fill-in
    addSignatureFillIn(signers = [], options = {}) {
        const sigOptions = {
            layout: 'horizontal', // 'horizontal', 'vertical'
            signatureWidth: 120,
            dateWidth: 80,
            spacing: 20,
            showDate: true,
            dateLabel: 'Ngày:',
            signatureLabel: 'Chữ ký:',
            nameLabel: 'Họ tên:',
            titleLabel: 'Chức vụ:',
            ...options
        };

        if (sigOptions.layout === 'horizontal') {
            // Horizontal layout
            const totalWidth = signers.length * (sigOptions.signatureWidth + sigOptions.spacing) - sigOptions.spacing;
            let startX = (this.pageWidth - totalWidth) / 2;

            signers.forEach((signer, index) => {
                const signerX = startX + (index * (sigOptions.signatureWidth + sigOptions.spacing));
                const originalMarginLeft = this.margins.left;
                
                // Tạm thời thay đổi margin
                this.margins.left = signerX;

                // Ngày
                if (sigOptions.showDate) {
                    this.addFillInLine(sigOptions.dateLabel, {
                        lineLength: sigOptions.dateWidth,
                        labelPosition: 'left',
                        align: 'left'
                    });
                }

                // Chức vụ/Title
                if (signer.title) {
                    this.addText(signer.title, signerX + (sigOptions.signatureWidth - this.doc.getTextWidth(signer.title)) / 2, null, {
                        fontSize: 10,
                        fontStyle: 'bold'
                    });
                }

                // Chữ ký
                this.addFillInLine(sigOptions.signatureLabel, {
                    lineLength: sigOptions.signatureWidth,
                    labelPosition: 'above',
                    align: 'left'
                });

                // Họ tên
                this.addFillInLine(sigOptions.nameLabel, {
                    lineLength: sigOptions.signatureWidth,
                    labelPosition: 'left',
                    align: 'left'
                });

                // Restore margin
                this.margins.left = originalMarginLeft;
            });
        } else {
            // Vertical layout
            signers.forEach(signer => {
                if (signer.title) {
                    this.addText(signer.title, null, null, {
                        fontSize: 12,
                        fontStyle: 'bold',
                        align: 'center'
                    });
                }

                if (sigOptions.showDate) {
                    this.addFillInLine(sigOptions.dateLabel, {
                        lineLength: sigOptions.dateWidth,
                        labelPosition: 'left',
                        align: 'center'
                    });
                }

                this.addFillInLine(sigOptions.signatureLabel, {
                    lineLength: sigOptions.signatureWidth,
                    labelPosition: 'above',
                    align: 'center'
                });

                this.addFillInLine(sigOptions.nameLabel, {
                    lineLength: sigOptions.signatureWidth,
                    labelPosition: 'left',
                    align: 'center'
                });

                this.addSpace(sigOptions.spacing);
            });
        }

        return this;
    }

    // Thêm dotted fill-in line (dấu chấm thay vì đường kẻ)
    addDottedFillIn(label = '', options = {}) {
        const dottedOptions = {
            lineStyle: 'dots',
            dotChar: '.',
            dotSpacing: 2,
            lineLength: 100,
            labelPosition: 'left',
            ...options
        };
        
        return this.addFillInLine(label, dottedOptions);
    }

    // Thêm form với dotted lines
    addDottedForm(fields, options = {}) {
        const dottedFormOptions = {
            fieldDefaults: {
                lineStyle: 'dots',
                dotChar: '.',
                dotSpacing: 2
            },
            ...options
        };

        // Áp dụng dotted style cho tất cả fields
        const processedFields = fields.map(field => ({
            ...field,
            options: {
                ...dottedFormOptions.fieldDefaults,
                ...field.options
            }
        }));

        return this.addFillInForm(processedFields, dottedFormOptions);
    }

    // Thêm signature với dotted lines
    addDottedSignature(signers = [], options = {}) {
        const dottedSigOptions = {
            lineStyle: 'dots',
            dotChar: '.',
            dotSpacing: 2,
            ...options
        };

        // Override các fill-in methods tạm thời
        const originalAddFillInLine = this.addFillInLine.bind(this);
        this.addFillInLine = (label, opts = {}) => {
            return originalAddFillInLine(label, {
                lineStyle: 'dots',
                dotChar: '.',
                dotSpacing: 2,
                ...opts
            });
        };

        const result = this.addSignatureFillIn(signers, dottedSigOptions);

        // Restore original method
        this.addFillInLine = originalAddFillInLine;

        return result;
    }

    // Thêm custom dotted pattern
    addCustomDottedLine(label = '', pattern = '.', spacing = 2, length = 100, options = {}) {
        return this.addFillInLine(label, {
            lineStyle: 'dots',
            dotChar: pattern,
            dotSpacing: spacing,
            lineLength: length,
            ...options
        });
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