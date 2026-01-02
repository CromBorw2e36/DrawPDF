/**
 * CKEditor HTML Parser
 * Converts CKEditor HTML output to JSON blueprint for PDF rendering
 */

// Page dimensions in mm
const PAGE = {
  WIDTH: 210,
  HEIGHT: 297,
  MARGIN_TOP: 20,
  MARGIN_BOTTOM: 20,
  MARGIN_LEFT: 15,
  MARGIN_RIGHT: 15,
  get CONTENT_WIDTH() { return this.WIDTH - this.MARGIN_LEFT - this.MARGIN_RIGHT; },
  get CONTENT_HEIGHT() { return this.HEIGHT - this.MARGIN_TOP - this.MARGIN_BOTTOM; }
};

// Font settings
const FONTS = {
  DEFAULT_SIZE: 12,
  LINE_HEIGHT: 1.5,
  H1_SIZE: 18,
  H2_SIZE: 16,
  H3_SIZE: 14
};

class CKEditorParser {
  constructor() {
    this.currentY = PAGE.MARGIN_TOP;
    this.currentPage = 0;
    this.pages = [{ pageNumber: 1, elements: [] }];
  }

  /**
   * Parse CKEditor HTML to JSON blueprint
   * @param {string} html - CKEditor HTML output
   * @returns {Object} JSON blueprint
   */
  parse(html) {
    // Reset state
    this.currentY = PAGE.MARGIN_TOP;
    this.currentPage = 0;
    this.pages = [{ pageNumber: 1, elements: [] }];

    // Create DOM parser
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Process all child nodes of body
    const children = doc.body.children;
    for (let i = 0; i < children.length; i++) {
      this.processNode(children[i]);
    }

    return {
      version: '1.0',
      pageSize: { width: PAGE.WIDTH, height: PAGE.HEIGHT, unit: 'mm' },
      margins: {
        top: PAGE.MARGIN_TOP,
        bottom: PAGE.MARGIN_BOTTOM,
        left: PAGE.MARGIN_LEFT,
        right: PAGE.MARGIN_RIGHT
      },
      pages: this.pages
    };
  }

  /**
   * Process a DOM node
   */
  processNode(node) {
    const tagName = node.tagName?.toLowerCase();

    switch (tagName) {
      case 'p':
        this.processParagraph(node);
        break;
      case 'h1':
        this.processHeading(node, 1);
        break;
      case 'h2':
        this.processHeading(node, 2);
        break;
      case 'h3':
        this.processHeading(node, 3);
        break;
      case 'ul':
        this.processList(node, 'bullet');
        break;
      case 'ol':
        this.processList(node, 'number');
        break;
      case 'table':
        this.processTable(node);
        break;
      case 'figure':
        // Could be image or table
        if (node.querySelector('table')) {
          this.processTable(node.querySelector('table'));
        } else if (node.querySelector('img')) {
          this.processImage(node.querySelector('img'));
        }
        break;
      case 'hr':
        this.processHorizontalRule();
        break;
      default:
        // Try to get text content
        if (node.textContent?.trim()) {
          this.addTextElement(node.textContent.trim(), {});
        }
    }
  }

  /**
   * Process paragraph element
   */
  processParagraph(node) {
    const text = node.innerHTML;
    const styles = this.extractStyles(node);
    
    // Check for alignment
    const align = node.style.textAlign || 'left';
    
    this.addTextElement(text, { ...styles, align });
  }

  /**
   * Process heading element
   */
  processHeading(node, level) {
    const text = node.innerHTML;
    const fontSizes = { 1: FONTS.H1_SIZE, 2: FONTS.H2_SIZE, 3: FONTS.H3_SIZE };
    
    this.addTextElement(text, {
      fontSize: fontSizes[level],
      fontWeight: 'bold',
      align: node.style.textAlign || 'left'
    });
  }

  /**
   * Process list
   */
  processList(node, type) {
    const items = node.querySelectorAll('li');
    items.forEach((item, index) => {
      const prefix = type === 'number' ? `${index + 1}. ` : '• ';
      const text = prefix + item.innerHTML;
      this.addTextElement(text, { indent: 10 });
    });
  }

  /**
   * Process table
   */
  processTable(tableNode) {
    const rows = [];
    const tableRows = tableNode.querySelectorAll('tr');
    
    tableRows.forEach(tr => {
      const cells = [];
      const tds = tr.querySelectorAll('td, th');
      tds.forEach(td => {
        cells.push({
          content: td.innerHTML,
          isHeader: td.tagName.toLowerCase() === 'th'
        });
      });
      rows.push(cells);
    });

    // Calculate table height (approximate)
    const rowHeight = 8; // mm per row
    const tableHeight = rows.length * rowHeight + 5;

    // Check if need new page
    if (this.currentY + tableHeight > PAGE.HEIGHT - PAGE.MARGIN_BOTTOM) {
      this.newPage();
    }

    this.addElement({
      type: 'table',
      x: PAGE.MARGIN_LEFT,
      y: this.currentY,
      width: PAGE.CONTENT_WIDTH,
      rows: rows,
      rowHeight: rowHeight,
      style: {
        borderColor: '#000000',
        borderWidth: 0.5,
        headerBg: '#f0f0f0'
      }
    });

    this.currentY += tableHeight;
  }

  /**
   * Process image
   */
  processImage(imgNode) {
    const src = imgNode.src || imgNode.getAttribute('src');
    const width = parseInt(imgNode.width) || 50;
    const height = parseInt(imgNode.height) || 50;
    
    // Convert px to mm (approximate)
    const widthMm = Math.min(width * 0.264, PAGE.CONTENT_WIDTH);
    const heightMm = height * 0.264;

    // Check if need new page
    if (this.currentY + heightMm > PAGE.HEIGHT - PAGE.MARGIN_BOTTOM) {
      this.newPage();
    }

    this.addElement({
      type: 'image',
      x: PAGE.MARGIN_LEFT,
      y: this.currentY,
      width: widthMm,
      height: heightMm,
      src: src
    });

    this.currentY += heightMm + 5;
  }

  /**
   * Process horizontal rule
   */
  processHorizontalRule() {
    this.addElement({
      type: 'line',
      x1: PAGE.MARGIN_LEFT,
      y1: this.currentY,
      x2: PAGE.WIDTH - PAGE.MARGIN_RIGHT,
      y2: this.currentY,
      style: { color: '#cccccc', width: 0.5 }
    });
    this.currentY += 5;
  }

  /**
   * Extract inline styles from node
   */
  extractStyles(node) {
    const styles = {};
    const html = node.innerHTML;

    // Check for bold
    if (html.includes('<strong>') || html.includes('<b>') || 
        node.style.fontWeight === 'bold') {
      styles.fontWeight = 'bold';
    }

    // Check for italic
    if (html.includes('<i>') || html.includes('<em>') ||
        node.style.fontStyle === 'italic') {
      styles.fontStyle = 'italic';
    }

    // Check for underline
    if (html.includes('<u>') || node.style.textDecoration?.includes('underline')) {
      styles.underline = true;
    }

    // Check for color
    const colorMatch = html.match(/color:\s*([^;"]+)/);
    if (colorMatch) {
      styles.color = colorMatch[1];
    }

    // Check for font size
    const sizeMatch = html.match(/font-size:\s*(\d+)/);
    if (sizeMatch) {
      styles.fontSize = parseInt(sizeMatch[1]);
    }

    return styles;
  }

  /**
   * Add text element
   */
  addTextElement(htmlContent, styles) {
    // Strip HTML tags for plain text
    const plainText = htmlContent.replace(/<[^>]*>/g, '');
    
    if (!plainText.trim()) return;

    const fontSize = styles.fontSize || FONTS.DEFAULT_SIZE;
    const lineHeight = fontSize * FONTS.LINE_HEIGHT * 0.352778; // pt to mm
    
    // Estimate number of lines
    const charsPerLine = Math.floor(PAGE.CONTENT_WIDTH / (fontSize * 0.3));
    const lines = Math.ceil(plainText.length / charsPerLine);
    const elementHeight = lines * lineHeight;

    // Check if need new page
    if (this.currentY + elementHeight > PAGE.HEIGHT - PAGE.MARGIN_BOTTOM) {
      this.newPage();
    }

    this.addElement({
      type: 'text',
      x: PAGE.MARGIN_LEFT + (styles.indent || 0),
      y: this.currentY,
      width: PAGE.CONTENT_WIDTH - (styles.indent || 0),
      content: plainText,
      htmlContent: htmlContent, // Keep original for rich text
      style: {
        fontSize: fontSize,
        fontWeight: styles.fontWeight || 'normal',
        fontStyle: styles.fontStyle || 'normal',
        color: styles.color || '#000000',
        align: styles.align || 'left',
        underline: styles.underline || false
      }
    });

    this.currentY += elementHeight + 2; // Add small spacing
  }

  /**
   * Add element to current page
   */
  addElement(element) {
    this.pages[this.currentPage].elements.push(element);
  }

  /**
   * Create new page
   */
  newPage() {
    this.currentPage++;
    this.pages.push({
      pageNumber: this.currentPage + 1,
      elements: []
    });
    this.currentY = PAGE.MARGIN_TOP;
  }
}

export default CKEditorParser;
export { PAGE, FONTS };
