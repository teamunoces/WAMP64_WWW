/**
 * download.js - Handles PDF download functionality for Monthly Accomplishment Report
 * Uses html2pdf library to convert the report to PDF while maintaining ALL colors
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add event listener to download button
    const downloadBtn = document.getElementById('downloadPDF');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadAsPDF);
    }
});

/**
 * Main function to download report as PDF with ALL colors preserved
 */
async function downloadAsPDF() {
    try {
        // Show loading indicator
        showLoadingIndicator();
        
        // Get the report container element
        const element = document.querySelector('.report-container');
        
        if (!element) {
            throw new Error('Report container not found');
        }
        
        // Store original styles to restore later
        const sidebarFrame = document.getElementById('sidebarFrame');
        const headerFrame = document.getElementById('headerFrame');
        const buttons = document.querySelector('.buttons');
        const adminComment = document.querySelector('.admin-comment');
        const body = document.body;
        const originalBodyMargin = body.style.marginLeft;
        const originalBodyBg = body.style.backgroundColor;
        
        // Hide elements for PDF generation
        if (sidebarFrame) sidebarFrame.style.display = 'none';
        if (headerFrame) headerFrame.style.display = 'none';
        if (buttons) buttons.style.display = 'none';
        if (adminComment) adminComment.style.display = 'none';
        
        // Adjust body and container for PDF
        if (body) {
            body.style.marginLeft = '0';
            body.style.backgroundColor = 'white';
        }
        
        const container = element;
        const originalMarginTop = container.style.marginTop;
        const originalMarginLeft = container.style.marginLeft;
        const originalMaxWidth = container.style.maxWidth;
        const originalPadding = container.style.padding;
        const originalBoxShadow = container.style.boxShadow;
        const originalWidth = container.style.width;
        
        // Apply PDF-specific styles
        container.style.marginTop = '0';
        container.style.marginLeft = '0';
        container.style.maxWidth = '100%';
        container.style.padding = '20px';
        container.style.boxShadow = 'none';
        container.style.width = '100%';
        
        // Apply comprehensive PDF-specific styling
        applyPDFStyles(container);
        
        // Configure PDF options
        const opt = {
            margin: [0.5, 0.5, 0.5, 0.5],
            filename: generateFileName(),
            image: { type: 'jpeg', quality: 1.0 },
            html2canvas: { 
                scale: 3,
                letterRendering: true,
                useCORS: true,
                logging: false,
                backgroundColor: '#FFFFFF',
                allowTaint: false
            },
            jsPDF: { 
                unit: 'in', 
                format: 'a4', 
                orientation: 'portrait'
            },
            pagebreak: { 
                mode: ['css', 'legacy'],
                avoid: ['tr', 'thead', 'tfoot', '.approvals-container', '.document-info']
            }
        };
        
        // Generate PDF
        await html2pdf().set(opt).from(container).save();
        
        // Restore original display
        if (sidebarFrame) sidebarFrame.style.display = '';
        if (headerFrame) headerFrame.style.display = '';
        if (buttons) buttons.style.display = '';
        if (adminComment) adminComment.style.display = '';
        if (body) {
            body.style.marginLeft = originalBodyMargin;
            body.style.backgroundColor = originalBodyBg;
        }
        
        container.style.marginTop = originalMarginTop;
        container.style.marginLeft = originalMarginLeft;
        container.style.maxWidth = originalMaxWidth;
        container.style.padding = originalPadding;
        container.style.boxShadow = originalBoxShadow;
        container.style.width = originalWidth;
        
        // Remove added styles
        removePDFStyles();
        
        // Hide loading indicator
        hideLoadingIndicator();
        
    } catch (error) {
        console.error('PDF generation failed:', error);
        hideLoadingIndicator();
        alert('Failed to generate PDF. Please try again.');
    }
}

/**
 * Apply comprehensive PDF-specific styles
 */
function applyPDFStyles(container) {
    // Remove any existing PDF styles
    removePDFStyles();
    
    // Create style element
    const style = document.createElement('style');
    style.id = 'pdf-preserve-colors';
    style.textContent = `
        /* Force color preservation for ALL elements */
        * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
        }
        
        /* Report container styling */
        .report-container {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 auto !important;
            padding: 20px !important;
            background-color: white !important;
            box-shadow: none !important;
        }
        
        /* Header colors */
        .college-info h1 { 
            color: #4f81bd !important; 
        }
        
        .office-title { 
            color: #595959 !important; 
        }
        
        .double-line { 
            border-top: 4px double #4f81bd !important; 
        }
        
        /* Header table */
        .header-table td.label {
            background-color: #b3b3b3 !important;
            font-weight: bold !important;
        }
        
        /* Main table header colors */
        .main-table th { 
            background-color: #e0e0e0 !important; 
            color: #333 !important;
            border: 1px solid #000 !important;
        }
        
        .main-table td {
            border: 1px solid #000 !important;
        }
        
        /* DOCUMENT INFO SECTION - NAVY BLUE BACKGROUND */
        .doc-header td.label {
            background-color: #002060 !important;
            color: white !important;
            font-weight: bold !important;
        }
        
        .doc-header td.value {
            background-color: white !important;
            color: #333 !important;
        }
        
        /* Signature lines */
        .signature-line {
            border-bottom: 1.5px solid black !important;
        }
        
        .name-underlined {
            text-decoration: underline !important;
        }
        
        /* Input fields */
        input[type="text"] {
            border: none !important;
            background: transparent !important;
        }
        
        /* Approval row - keep side by side */
        .approval-row {
            display: flex !important;
            flex-direction: row !important;
            justify-content: space-between !important;
        }
        
        .signature-group {
            width: 35% !important;
        }
        
        /* Page break handling */
        .approvals-container, .document-info, footer {
            page-break-inside: avoid;
        }
        
        thead {
            display: table-header-group;
        }
    `;
    
    document.head.appendChild(style);
}

/**
 * Remove PDF styles
 */
function removePDFStyles() {
    const existingStyle = document.getElementById('pdf-preserve-colors');
    if (existingStyle) {
        existingStyle.remove();
    }
}

/**
 * Generate filename with current date
 */
function generateFileName() {
    const date = new Date();
    const formattedDate = date.toISOString().slice(0, 10);
    const month = document.getElementById('month')?.value || 'Month';
    const department = document.getElementById('department')?.value || 'Department';
    
    const cleanMonth = month.replace(/[^a-zA-Z0-9]/g, '_');
    const cleanDept = department.replace(/[^a-zA-Z0-9]/g, '_');
    
    return `MAR_${cleanDept}_${cleanMonth}_${formattedDate}.pdf`;
}

/**
 * Show loading indicator
 */
function showLoadingIndicator() {
    if (!document.getElementById('pdf-loading-overlay')) {
        const overlay = document.createElement('div');
        overlay.id = 'pdf-loading-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        `;
        
        const loader = document.createElement('div');
        loader.style.cssText = `
            background: white;
            padding: 20px 40px;
            border-radius: 8px;
            font-family: Arial, sans-serif;
            font-size: 16px;
            font-weight: bold;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            color: #002060;
            border-left: 4px solid #002060;
        `;
        loader.textContent = 'Generating PDF...';
        
        overlay.appendChild(loader);
        document.body.appendChild(overlay);
    }
}

/**
 * Hide loading indicator
 */
function hideLoadingIndicator() {
    const overlay = document.getElementById('pdf-loading-overlay');
    if (overlay) {
        overlay.remove();
    }
}

// Make functions globally available
window.downloadAsPDF = downloadAsPDF;