// print.js
function printReport() {
    // Store original display values
    const sidebarFrame = document.getElementById('sidebarFrame');
    const headerFrame = document.getElementById('headerFrame');
    const buttons = document.querySelector('.buttons');
    const adminComment = document.querySelector('.admin-comment');
    const reportContainer = document.querySelector('.report-container');
    const body = document.body;
    
    // Hide elements for printing (only if they exist)
    if (sidebarFrame) sidebarFrame.style.display = 'none';
    if (headerFrame) headerFrame.style.display = 'none';
    if (buttons) buttons.style.display = 'none';
    if (adminComment) adminComment.style.display = 'none';
    
    // Adjust main container for print
    if (reportContainer) {
        reportContainer.style.marginTop = '0';
        reportContainer.style.marginLeft = '0';
        reportContainer.style.width = '100%';
        reportContainer.style.maxWidth = '100%';
        reportContainer.style.padding = '20px';
        reportContainer.style.boxShadow = 'none';
        reportContainer.style.backgroundColor = 'white';
    }
    
    if (body) {
        body.style.marginLeft = '0';
        body.style.backgroundColor = 'white';
    }
    
    // Create a style element for print-specific adjustments
    const printStyle = document.createElement('style');
    printStyle.innerHTML = `
        @media print {
            @page {
                size: portrait;
                margin: 0.5in;
            }
            
            * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            
            body {
                background-color: white !important;
                padding: 0 !important;
                margin: 0 !important;
                display: block !important;
            }
            
            #sidebarFrame, #headerFrame, .buttons, .admin-comment {
                display: none !important;
            }
            
            .report-container {
                margin: 0 !important;
                padding: 20px !important;
                width: 100% !important;
                max-width: 100% !important;
                box-shadow: none !important;
                background-color: white !important;
                border-radius: 0 !important;
            }
            
            /* Preserve header styles */
            .header-content {
                display: flex !important;
                align-items: center !important;
                justify-content: space-between !important;
                margin-bottom: 15px !important;
                width: 100% !important;
            }
            
            .logo-left, .logos-right img {
                height: 80px !important;
                width: auto !important;
            }
            
            .college-info h1 {
                color: #4f81bd !important;
                font-size: 24px !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            
            /* Header Grid */
            .header-grid {
                display: grid !important;
                grid-template-columns: 145px 1fr 150px 1fr !important;
                border: 1px solid #000 !important;
                margin-bottom: 30px !important;
            }
            
            .bg-gray {
                background-color: #b3b3b3 !important;
            }
            
            /* Section headers */
            .section-header {
                background-color: #b3b3b3 !important;
                border: 1px solid #000 !important;
                margin-top: 20px !important;
            }
            
            /* Paper lines */
            .paper-lines {
                background-image: linear-gradient(to bottom, transparent 29px, #000 29px) !important;
                background-size: 100% 30px !important;
            }
            
            /* Preserve approval row layout - keep side by side */
            .approval-row {
                display: flex !important;
                flex-direction: row !important;
                justify-content: space-between !important;
                margin-bottom: 20px !important;
            }
            
            .signature-group {
                width: 35% !important;
            }
            
            .signature-line {
                border-bottom: 1.5px solid black !important;
                margin-bottom: 5px !important;
            }
            
            .name-underlined {
                text-decoration: underline !important;
            }
            
            /* Document info table */
            .doc-header td.label {
                background-color: #002060 !important;
                color: white !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            
            /* Double line */
            .double-line {
                border-top: 4px double #4f81bd !important;
                margin-bottom: 20px !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            
            /* Office title */
            .office-title {
                color: #595959 !important;
            }
            
            /* Prevent page breaks */
            .approvals-container, .document-info, footer, header {
                page-break-inside: avoid;
            }
            
            /* Keep footer at bottom */
            footer {
                margin-top: 30px !important;
            }
        }
    `;
    
    document.head.appendChild(printStyle);
    
    // Trigger print
    window.print();
    
    // Restore original display after printing (with a small delay)
    setTimeout(() => {
        if (sidebarFrame) sidebarFrame.style.display = '';
        if (headerFrame) headerFrame.style.display = '';
        if (buttons) buttons.style.display = '';
        if (adminComment) adminComment.style.display = '';
        if (body) {
            body.style.marginLeft = '';
            body.style.backgroundColor = '';
        }
        if (reportContainer) {
            reportContainer.style.marginTop = '';
            reportContainer.style.marginLeft = '';
            reportContainer.style.width = '';
            reportContainer.style.maxWidth = '';
            reportContainer.style.padding = '';
            reportContainer.style.boxShadow = '';
            reportContainer.style.backgroundColor = '';
        }
        if (printStyle && printStyle.parentNode) {
            printStyle.remove();
        }
    }, 500);
}

// Make function globally available
window.printReport = printReport;