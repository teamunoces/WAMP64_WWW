/**
 * print.js - Handles printing functionality for Monthly Accomplishment Report
 * Ensures proper layout, preserves all colors, and hides iframes/buttons during print
 */

function printReport() {
    // Store original title
    const originalTitle = document.title;
    
    // Set print-specific title
    document.title = "Monthly_Accomplishment_Report";
    
    // Hide elements for printing
    const sidebarFrame = document.getElementById('sidebarFrame');
    const headerFrame = document.getElementById('headerFrame');
    const buttons = document.querySelector('.buttons');
    const adminComment = document.querySelector('.admin-comment');
    const reportContainer = document.querySelector('.report-container');
    const body = document.body;
    
    // Hide elements
    if (sidebarFrame) sidebarFrame.style.display = 'none';
    if (headerFrame) headerFrame.style.display = 'none';
    if (buttons) buttons.style.display = 'none';
    if (adminComment) adminComment.style.display = 'none';
    
    // Adjust container for print
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
    
    // Add comprehensive print styles
    addPrintStyles();
    
    // Trigger browser print dialog
    window.print();
    
    // Restore original state after printing
    setTimeout(() => {
        // Restore title
        document.title = originalTitle;
        
        // Restore hidden elements
        if (sidebarFrame) sidebarFrame.style.display = '';
        if (headerFrame) headerFrame.style.display = '';
        if (buttons) buttons.style.display = '';
        if (adminComment) adminComment.style.display = '';
        
        // Restore body styles
        if (body) {
            body.style.marginLeft = '';
            body.style.backgroundColor = '';
        }
        
        // Restore container styles
        if (reportContainer) {
            reportContainer.style.marginTop = '';
            reportContainer.style.marginLeft = '';
            reportContainer.style.width = '';
            reportContainer.style.maxWidth = '';
            reportContainer.style.padding = '';
            reportContainer.style.boxShadow = '';
            reportContainer.style.backgroundColor = '';
        }
        
        // Remove temporary styles
        removePrintStyles();
    }, 500);
}

/**
 * Add comprehensive print styles that preserve all colors
 */
function addPrintStyles() {
    // Remove any existing print style to avoid conflicts
    removePrintStyles();
    
    // Create comprehensive print stylesheet
    const style = document.createElement('style');
    style.id = 'print-preserve-colors';
    style.textContent = `
        @media print {
            /* Force color preservation for ALL elements */
            * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
            }
            
            /* Hide iframes, buttons, and admin comments */
            #headerFrame,
            #sidebarFrame,
            .buttons,
            #downloadPDF,
            .admin-comment {
                display: none !important;
            }
            
            /* Reset body margins for print */
            body {
                margin: 0 !important;
                padding: 0 !important;
                background-color: white !important;
            }
            
            /* Report container styling */
            .report-container {
                width: 100% !important;
                max-width: 95% !important;
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
            .header-table {
                width: 100% !important;
                border-collapse: collapse !important;
                margin-bottom: 20px !important;
            }
            
            .header-table td.label {
                width: 30% !important;
                background-color: #ffffff !important;
                padding: 8px !important;
                border: 1px solid #000 !important;
                font-weight: bold !important;
            }
            
            .header-table td.input_cell {
                width: 70% !important;
                padding: 8px !important;
                border: 1px solid #000 !important;
            }
            
            /* Main table header colors */
            .main-table th { 
                background-color: #e0e0e0 !important; 
                color: #333 !important;
                border: 1px solid #000 !important;
                padding: 8px !important;
            }
            
            .main-table td {
                border: 1px solid #000 !important;
                padding: 8px !important;
            }
            
            /* DOCUMENT INFO SECTION - NAVY BLUE BACKGROUND */
            .doc-header td.label {
                background-color: #002060 !important;
                color: white !important;
                font-weight: bold !important;
                padding: 4px 8px !important;
                border: 1px solid #d1d1d1 !important;
            }
            
            .doc-header td.value {
                padding: 4px 10px !important;
                border: 1px solid #d1d1d1 !important;
            }
            
            /* Ensure the document info section maintains its styling */
            .document-info {
                width: 30% !important;
                margin-top: 50px !important;
            }
            
            /* Signature lines and underlines */
            .signature-line {
                border-bottom: 1.5px solid black !important;
                margin-bottom: 5px !important;
                min-height: 25px !important;
            }
            
            .name-underlined {
                text-decoration: underline !important;
            }
            
            /* Input fields - remove borders for cleaner print */
            input[type="text"] {
                border: none !important;
                background: transparent !important;
            }
            
            /* Approval row - keep side by side */
            .approval-row {
                display: flex !important;
                flex-direction: row !important;
                justify-content: space-between !important;
                margin-bottom: 20px !important;
            }
            
            .signature-group {
                width: 35% !important;
            }
            
            .approval-centered {
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                margin-top: 30px !important;
            }
            
            .admin-block {
                text-align: center !important;
                margin-top: 20px !important;
                margin-bottom: 10px !important;
            }
            
            /* Page break handling */
            .approvals-container {
                page-break-inside: avoid;
            }
            
            .document-info {
                page-break-inside: avoid;
            }
            
            footer {
                page-break-inside: avoid;
            }
            
            /* Ensure tables don't break awkwardly */
            table {
                page-break-inside: auto;
            }
            
            tr {
                page-break-inside: avoid;
                page-break-after: auto;
            }
            
            thead {
                display: table-header-group;
            }
        }
        
        @page {
            size: A4;
            margin: 0.5in;
        }
    `;
    
    document.head.appendChild(style);
}

/**
 * Remove temporary print styles
 */
function removePrintStyles() {
    const existingStyle = document.getElementById('print-preserve-colors');
    if (existingStyle) {
        existingStyle.remove();
    }
}

// Make function globally available
window.printReport = printReport;