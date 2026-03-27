// download.js
/**
 * Download PDF functionality for Community Needs Assessment Report
 * Uses html2pdf library to generate PDF with proper formatting
 */

document.addEventListener('DOMContentLoaded', function() {
    const downloadBtn = document.getElementById('downloadPDF');
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadPDF);
    }
});

function downloadPDF() {
    // Show loading state
    const downloadBtn = document.getElementById('downloadPDF');
    if (!downloadBtn) return;
    
    const originalText = downloadBtn.textContent;
    downloadBtn.textContent = 'Generating PDF...';
    downloadBtn.disabled = true;
    
    // Get the report container
    const element = document.querySelector('.report-container');
    
    // If report container doesn't exist, show error and return
    if (!element) {
        console.error('Report container not found');
        alert('Could not find form content to generate PDF.');
        downloadBtn.textContent = originalText;
        downloadBtn.disabled = false;
        return;
    }
    
    // Store original display values
    const sidebarFrame = document.getElementById('sidebarFrame');
    const headerFrame = document.getElementById('headerFrame');
    const buttons = document.querySelector('.buttons');
    const adminComment = document.querySelector('.admin-comment');
    const body = document.body;
    
    // Store original body styles
    const originalBodyMargin = body ? body.style.marginLeft : '';
    const originalBodyBg = body ? body.style.backgroundColor : '';
    
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
    
    // Store original container styles
    const originalMarginTop = container.style.marginTop;
    const originalMarginLeft = container.style.marginLeft;
    const originalMaxWidth = container.style.maxWidth;
    const originalPadding = container.style.padding;
    const originalBoxShadow = container.style.boxShadow;
    const originalWidth = container.style.width;
    const originalBg = container.style.backgroundColor;
    const originalBorderRadius = container.style.borderRadius;
    
    // Apply PDF-specific styles
    container.style.marginTop = '0';
    container.style.marginLeft = '0';
    container.style.maxWidth = '100%';
    container.style.padding = '20px';
    container.style.boxShadow = 'none';
    container.style.width = '100%';
    container.style.backgroundColor = 'white';
    container.style.borderRadius = '0';
    
    // Get title for filename
    const titleInput = document.querySelector('textarea[name="title_of_program"]');
    const reportId = document.getElementById('currentReportId')?.value || '';
    const fileName = titleInput && titleInput.value ? 
        `Community_Needs_Assessment_${titleInput.value.replace(/\s+/g, '_').substring(0, 50)}` : 
        `Community_Needs_Assessment_${reportId || 'form'}`;
    
    // Configure PDF options
    const opt = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: `${fileName}.pdf`,
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: { 
            scale: 3,
            letterRendering: true,
            useCORS: true,
            logging: false,
            allowTaint: false,
            backgroundColor: '#ffffff'
        },
        jsPDF: { 
            unit: 'in', 
            format: 'letter', 
            orientation: 'portrait' 
        },
        pagebreak: { 
            mode: ['css', 'legacy'],
            before: '.page-break',
            after: ['footer'],
            avoid: ['tr', 'img', '.signature-group', '.approval-centered', 'thead', '.section-header']
        }
    };
    
    // Create style element for PDF color preservation
    const style = document.createElement('style');
    style.id = 'pdf-color-preserve';
    style.innerHTML = `
        /* Force color and style preservation */
        * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
        }
        
        body {
            background-color: white !important;
            margin: 0 !important;
            padding: 0 !important;
        }
        
        .report-container {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 auto !important;
            padding: 20px !important;
            background-color: white !important;
            box-shadow: none !important;
            border-radius: 0 !important;
        }
        
        /* Header styles */
        .header-content {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            margin-bottom: 15px !important;
            width: 100% !important;
        }
        
        .logo-left {
            height: 90px !important;
            width: auto !important;
        }
        
        .logos-right img {
            height: 80px !important;
            width: auto !important;
        }
        
        .college-info {
            text-align: center !important;
            flex-grow: 1 !important;
        }
        
        .college-info h1 {
            color: #4f81bd !important;
            font-family: "Times New Roman", Times, serif !important;
            font-size: 26px !important;
            margin: 0 !important;
        }
        
        .college-info p {
            font-size: 11px !important;
            margin: 2px 0 !important;
        }
        
        /* Office title and double line */
        .office-title {
            text-align: center !important;
            font-size: 18px !important;
            color: #595959 !important;
            font-weight: bold !important;
            margin: 20px 0 5px 0 !important;
        }
        
        .double-line {
            border-top: 4px double #4f81bd !important;
            margin-bottom: 25px !important;
        }
        
        /* Header Grid */
        .header-grid {
            display: grid !important;
            grid-template-columns: 145px 1fr 150px 1fr !important;
            border: 1px solid #000 !important;
            margin-bottom: 30px !important;
        }
        
        .label-box {
            padding: 8px !important;
            font-weight: bold !important;
            font-size: 14px !important;
            border-right: 1px solid #000 !important;
        }
        
        .bg-gray {
            background-color: #b3b3b3 !important;
        }
        
        .header-grid input {
            padding: 8px !important;
            border: none !important;
            background: transparent !important;
        }
        
        /* Section headers */
        .section-header {
            background-color: #b3b3b3 !important;
            border: 1px solid #000 !important;
            padding: 8px 15px !important;
            font-weight: bold !important;
            font-size: 14px !important;
            margin-top: 20px !important;
            display: flex !important;
        }
        
        /* Form groups */
        .form-group {
            margin-bottom: 20px !important;
        }
        
        .form-group label {
            font-weight: bold !important;
            font-size: 14px !important;
            margin-bottom: 8px !important;
            display: block !important;
        }
        
        /* Paper lines */
        .paper-lines {
            width: 100% !important;
            border: none !important;
            outline: none !important;
            resize: none !important;
            font-size: 16px !important;
            line-height: 30px !important;
            padding: 0 !important;
            background-image: linear-gradient(to bottom, transparent 29px, #000 29px) !important;
            background-size: 100% 30px !important;
            background-color: transparent !important;
            font-family: Arial, sans-serif !important;
            overflow: hidden !important;
        }
        
        /* Approvals section */
        .approvals-container {
            font-family: Arial, sans-serif !important;
            width: 100% !important;
            max-width: 900px !important;
            margin: 40px auto 0 auto !important;
            color: #000 !important;
        }
        
        .approval-row {
            display: flex !important;
            justify-content: space-between !important;
            margin-bottom: 20px !important;
            flex-direction: row !important;
        }
        
        .signature-group {
            width: 35% !important;
        }
        
        .label {
            font-weight: bold !important;
            margin-bottom: 35px !important;
        }
        
        .signature-line {
            border-bottom: 1.5px solid black !important;
            margin-bottom: 5px !important;
            min-height: 25px !important;
            text-align: center !important;
            font-weight: bold !important;
        }
        
        .title {
            font-size: 14px !important;
        }
        
        .bold {
            font-weight: bold !important;
        }
        
        .left-align {
            text-align: left !important;
            width: 100% !important;
        }
        
        .approval-centered {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
        }
        
        .admin-block {
            text-align: center !important;
            margin-top: 30px !important;
            margin-bottom: 10px !important;
        }
        
        .name-underlined {
            font-weight: bold !important;
            text-decoration: underline !important;
            text-transform: uppercase !important;
            font-size: 16px !important;
            display: inline-block !important;
            margin-bottom: 2px !important;
            min-width: 250px !important;
        }
        
        /* Document info table */
        .document-info {
            margin-top: 50px !important;
            width: 30% !important;
        }
        
        .doc-header {
            border-collapse: collapse !important;
            font-family: Arial, sans-serif !important;
            font-size: 11px !important;
            border: 1px solid #d1d1d1 !important;
            width: auto !important;
            margin-right: auto !important;
        }
        
        .doc-header td.label {
            background-color: #002060 !important;
            color: white !important;
            font-weight: bold !important;
            padding: 4px 8px !important;
            border: 1px solid #d1d1d1 !important;
            white-space: nowrap !important;
            width: 100px !important;
        }
        
        .doc-header td.value {
            padding: 4px 10px !important;
            border: 1px solid #d1d1d1 !important;
            background-color: white !important;
        }
        
        /* Footer */
        footer {
            margin-top: 40px !important;
            width: 100% !important;
        }
        
        .footer-bottom {
            display: flex !important;
            align-items: flex-end !important;
            justify-content: flex-end !important;
            padding-bottom: 5px !important;
        }
        
        .footer-logos img {
            height: 40px !important;
            width: auto !important;
        }
        
        /* Hide elements */
        #sidebarFrame, #headerFrame, .buttons, .admin-comment {
            display: none !important;
        }
        
        /* Prevent page breaks */
        .approvals-container, .document-info, footer, header, .section-header, .form-group {
            page-break-inside: avoid !important;
        }
        
        /* Ensure table headers repeat on new pages */
        thead {
            display: table-header-group !important;
        }
        
        /* Input and textarea styling */
        input, textarea {
            border: none !important;
            background: transparent !important;
        }
    `;
    
    document.head.appendChild(style);
    
    // Generate PDF
    html2pdf().set(opt).from(element).save()
        .then(() => {
            // Restore original display
            if (sidebarFrame) sidebarFrame.style.display = '';
            if (headerFrame) headerFrame.style.display = '';
            if (buttons) buttons.style.display = '';
            if (adminComment) adminComment.style.display = '';
            if (body) {
                body.style.marginLeft = originalBodyMargin;
                body.style.backgroundColor = originalBodyBg;
            }
            if (container) {
                container.style.marginTop = originalMarginTop;
                container.style.marginLeft = originalMarginLeft;
                container.style.maxWidth = originalMaxWidth;
                container.style.padding = originalPadding;
                container.style.boxShadow = originalBoxShadow;
                container.style.width = originalWidth;
                container.style.backgroundColor = originalBg;
                container.style.borderRadius = originalBorderRadius;
            }
            const pdfStyle = document.getElementById('pdf-color-preserve');
            if (pdfStyle && pdfStyle.parentNode) {
                pdfStyle.remove();
            }
            
            // Reset button state
            downloadBtn.textContent = originalText;
            downloadBtn.disabled = false;
        })
        .catch(error => {
            console.error('PDF generation failed:', error);
            alert('Failed to generate PDF. Please try again.');
            
            // Restore original display
            if (sidebarFrame) sidebarFrame.style.display = '';
            if (headerFrame) headerFrame.style.display = '';
            if (buttons) buttons.style.display = '';
            if (adminComment) adminComment.style.display = '';
            if (body) {
                body.style.marginLeft = originalBodyMargin;
                body.style.backgroundColor = originalBodyBg;
            }
            if (container) {
                container.style.marginTop = originalMarginTop;
                container.style.marginLeft = originalMarginLeft;
                container.style.maxWidth = originalMaxWidth;
                container.style.padding = originalPadding;
                container.style.boxShadow = originalBoxShadow;
                container.style.width = originalWidth;
                container.style.backgroundColor = originalBg;
                container.style.borderRadius = originalBorderRadius;
            }
            const pdfStyle = document.getElementById('pdf-color-preserve');
            if (pdfStyle && pdfStyle.parentNode) {
                pdfStyle.remove();
            }
            
            // Reset button state
            downloadBtn.textContent = originalText;
            downloadBtn.disabled = false;
        });
}

// Make function globally available
window.downloadPDF = downloadPDF;