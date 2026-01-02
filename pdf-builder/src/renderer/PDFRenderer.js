/**
 * PDF Renderer using JsPdfService
 * Renders JSON blueprint to PDF using the existing JsPdfService
 */

class PDFRenderer {
  constructor() {
    this.pdfService = null;
  }

  /**
   * Render JSON blueprint to PDF using JsPdfService
   * @param {Object} blueprint - JSON blueprint from CKEditorParser
   * @param {Object} data - Variable data for replacement
   * @returns {JsPdfService} PDF service instance
   */
  render(blueprint, data = {}) {
    // Create new JsPdfService instance
    this.pdfService = new JsPdfService();

    // Render each page
    blueprint.pages.forEach((page, pageIndex) => {
      if (pageIndex > 0) {
        this.pdfService.addNewPage();
      }
      
      // Reset Y position for each page
      this.pdfService.resetPosition(blueprint.margins?.top || 20);
      
      // Render each element
      this.renderPage(page, data);
    });

    return this;
  }

  /**
   * Render a single page
   */
  renderPage(page, data) {
    page.elements.forEach(element => {
      switch (element.type) {
        case 'text':
          this.renderText(element, data);
          break;
        case 'heading':
          this.renderHeading(element, data);
          break;
        case 'table':
          this.renderTable(element, data);
          break;
        case 'image':
          this.renderImage(element, data);
          break;
        case 'line':
          this.renderLine(element);
          break;
        case 'space':
          this.pdfService.addSpace(element.height || 10);
          break;
      }
    });
  }

  /**
   * Render text element using JsPdfService
   */
  renderText(element, data) {
    const text = this.replaceVariables(element.content, data);
    const style = element.style || {};

    // Map styles to JsPdfService options
    const options = {
      fontSize: style.fontSize || 12,
      fontStyle: this.mapFontStyle(style),
      color: this.parseColor(style.color),
      align: style.align || 'left',
      lineHeight: style.lineHeight || 5
    };

    // Use y position if specified, otherwise let JsPdfService handle it
    if (element.y !== undefined) {
      this.pdfService.resetPosition(element.y);
    }

    this.pdfService.addText(text, element.x, null, options);
  }

  /**
   * Render heading element
   */
  renderHeading(element, data) {
    const text = this.replaceVariables(element.content, data);
    const level = element.level || 1;

    if (element.y !== undefined) {
      this.pdfService.resetPosition(element.y);
    }

    switch (level) {
      case 1:
        this.pdfService.addTitle(text, { align: element.style?.align || 'center' });
        break;
      case 2:
        this.pdfService.addSubTitle(text, { align: element.style?.align || 'left' });
        break;
      default:
        this.pdfService.addText(text, null, null, {
          fontSize: 14,
          fontStyle: 'bold',
          align: element.style?.align || 'left'
        });
    }
  }

  /**
   * Render table using JsPdfService addTable
   */
  renderTable(element, data) {
    const rows = element.rows || [];
    if (rows.length === 0) return;

    // Check if there's a dataVar for dynamic table
    if (element.dataVar) {
      const varName = element.dataVar.replace(/\{\{|\}\}/g, '');
      const tableData = data[varName];
      if (Array.isArray(tableData)) {
        this.renderDataTable(element, tableData);
        return;
      }
    }

    // Static table rendering
    if (element.y !== undefined) {
      this.pdfService.resetPosition(element.y);
    }

    // Try to use addTable if available, otherwise draw manually
    if (typeof this.pdfService.addTable === 'function') {
      const headers = rows[0]?.map(cell => 
        typeof cell === 'object' ? this.replaceVariables(cell.content, data) : cell
      ) || [];
      
      const dataRows = rows.slice(1).map(row =>
        row.map(cell => 
          typeof cell === 'object' ? this.replaceVariables(cell.content, data) : cell
        )
      );

      this.pdfService.addTable(headers, dataRows, element.style || {});
    } else {
      // Manual table drawing
      this.drawTableManually(element, data);
    }
  }

  /**
   * Render dynamic data table
   */
  renderDataTable(element, dataArray) {
    const columns = element.columns || [];
    if (columns.length === 0 || !Array.isArray(dataArray)) return;

    const headers = columns.map(col => col.label || col);
    const dataRows = dataArray.map(row =>
      columns.map(col => {
        const key = col.key || col;
        return String(row[key] || '');
      })
    );

    if (typeof this.pdfService.addTable === 'function') {
      this.pdfService.addTable(headers, dataRows, element.style || {});
    }
  }

  /**
   * Manual table drawing when addTable is not available
   */
  drawTableManually(element, data) {
    const rows = element.rows || [];
    const startX = element.x || this.pdfService.margins.left;
    const tableWidth = element.width || (this.pdfService.pageWidth - startX - this.pdfService.margins.right);
    const rowHeight = element.rowHeight || 8;
    const numCols = rows[0]?.length || 1;
    const colWidth = tableWidth / numCols;

    const doc = this.pdfService.doc;
    let currentY = this.pdfService.getCurrentY();

    doc.setLineWidth(0.5);
    doc.setFontSize(10);

    rows.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const cellX = startX + (colIndex * colWidth);
        const content = typeof cell === 'object' 
          ? this.replaceVariables(cell.content, data)
          : this.replaceVariables(String(cell), data);
        const isHeader = typeof cell === 'object' ? cell.isHeader : rowIndex === 0;

        // Header background
        if (isHeader) {
          doc.setFillColor(240, 240, 240);
          doc.rect(cellX, currentY, colWidth, rowHeight, 'F');
        }

        // Cell border
        doc.setDrawColor(0, 0, 0);
        doc.rect(cellX, currentY, colWidth, rowHeight);

        // Cell text
        try {
          doc.setFont('Roboto', isHeader ? 'bold' : 'normal');
        } catch {
          doc.setFont('helvetica', isHeader ? 'bold' : 'normal');
        }
        doc.setTextColor(0, 0, 0);

        const plainText = content.replace(/<[^>]*>/g, '');
        const textY = currentY + (rowHeight / 2) + 2;
        doc.text(plainText, cellX + 2, textY, { maxWidth: colWidth - 4 });
      });

      currentY += rowHeight;
    });

    this.pdfService.resetPosition(currentY + 5);
  }

  /**
   * Render image element
   */
  renderImage(element, data) {
    let src = this.replaceVariables(element.src, data);
    
    if (element.y !== undefined) {
      this.pdfService.resetPosition(element.y);
    }

    if (src && (src.startsWith('data:') || src.startsWith('http'))) {
      this.pdfService.addImage(
        src,
        element.x,
        null,
        element.width || 50,
        element.height || 50,
        element.style || {}
      );
    }
  }

  /**
   * Render line element
   */
  renderLine(element) {
    this.pdfService.addLine(
      element.x1,
      element.y1,
      element.x2,
      element.y2,
      element.style || {}
    );
  }

  /**
   * Replace {{variables}} with data values
   */
  replaceVariables(text, data) {
    if (!text || typeof text !== 'string') return text || '';
    
    return text.replace(/\{\{([^}]+)\}\}/g, (match, varName) => {
      const value = data[varName.trim()];
      return value !== undefined ? String(value) : match;
    });
  }

  /**
   * Map style to font style string
   */
  mapFontStyle(style) {
    if (style.fontWeight === 'bold' && style.fontStyle === 'italic') {
      return 'bolditalic';
    } else if (style.fontWeight === 'bold') {
      return 'bold';
    } else if (style.fontStyle === 'italic') {
      return 'italic';
    }
    return 'normal';
  }

  /**
   * Parse color to RGB array
   */
  parseColor(color) {
    if (!color) return [0, 0, 0];
    
    if (Array.isArray(color)) return color;
    
    // Handle hex color
    if (typeof color === 'string' && color.startsWith('#')) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
      if (result) {
        return [
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16)
        ];
      }
    }
    
    // Handle rgb() format
    if (typeof color === 'string' && color.startsWith('rgb')) {
      const match = color.match(/(\d+),\s*(\d+),\s*(\d+)/);
      if (match) {
        return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
      }
    }
    
    return [0, 0, 0];
  }

  /**
   * Get PDF as data URL
   */
  getDataUrl() {
    return this.pdfService.generateDataURL();
  }

  /**
   * Download PDF
   */
  download(filename = 'document.pdf') {
    this.pdfService.savePDF(filename);
  }

  /**
   * Get PDF as Blob
   */
  getBlob() {
    return this.pdfService.generateBlob();
  }

  /**
   * Preview PDF in new tab
   */
  preview() {
    this.pdfService.previewPDF();
  }
}

export default PDFRenderer;
