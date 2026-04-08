// print.js - Handles printing of the evaluation sheet with exact color/layout preservation
function printReport() {
    // Get the evaluation form element
    const evaluationForm = document.getElementById('evaluationForm');
    
    if (!evaluationForm) {
        console.error('Evaluation form not found');
        alert('Could not find evaluation content to print');
        return;
    }
    
    // Clone the evaluation form to avoid modifying the original
    const printContent = evaluationForm.cloneNode(true);
    
    // Ensure radio button states are preserved
    fixRadioStatesForPrint(printContent);
    
    // Extract header content from the parent evaluation-container
    const evaluationContainer = document.querySelector('.evaluation-container');
    let headerHTML = '';
    let footerHTML = '';
    
    if (evaluationContainer) {
        // Extract header content (the first header with header-content and office-title)
        const mainHeader = evaluationContainer.querySelector('header:first-of-type');
        if (mainHeader) {
            headerHTML = mainHeader.outerHTML;
        }
        
        // Extract the second header (the "EVALUATION SHEET FOR EXTENSION SERVICES" title)
        const titleHeader = evaluationContainer.querySelector('header:not(:first-of-type)');
        if (titleHeader) {
            headerHTML += titleHeader.outerHTML;
        }
        
        // Extract footer content
        const footerElement = evaluationContainer.querySelector('footer');
        if (footerElement) {
            footerHTML = footerElement.outerHTML;
        }
    }
    
    // Create a comprehensive style element for print-specific styles
    const style = document.createElement('style');
    style.textContent = `
        /* ===== BASE PRINT STYLES ===== */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #333;
            background: white;
            margin: 0;
            padding: 0;
        }
        
        /* Hide frames, buttons, and admin elements */
        #sidebarFrame, #headerFrame, .buttons, .admin-comment, .action-buttons {
            display: none !important;
        }
        
        /* Main form styling - NO header/footer inside */
        #evaluationForm {
            max-width: 900px;
            margin: 0 auto;
            background: white !important;
            padding: 0 40px 40px 40px !important;
            box-shadow: none;
            pointer-events: none;
        }
        
        /* ===== PRINT PAGE MARGINS ===== */
        @page {
            margin: 15mm 15mm 15mm 15mm;
        }
        
        /* ===== HEADER SECTION - REPEATING ON EVERY PAGE ===== */
        .print-header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: white;
            z-index: 1000;
            padding: 10px 20px 5px 20px;
            border-bottom: 1px solid #ddd;
            page-break-after: avoid;
        }
        
        /* ===== FOOTER SECTION - REPEATING ON EVERY PAGE ===== */
        .print-footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: white;
            z-index: 1000;
            padding: 5px 20px 10px 20px;
            border-top: 1px solid #ddd;
            page-break-before: avoid;
        }
        
        /* ===== MAIN CONTENT SPACING ===== */
        #evaluationForm {
            /* Space for fixed header */
            margin-top: 180px;
            /* Space for fixed footer */
            margin-bottom: 80px;
            /* Prevent content from being hidden */
            page-break-inside: avoid;
        }
        
        /* Ensure proper spacing for all pages */
        @media print {
            body {
                margin: 0;
                padding: 0;
            }
            
            .print-header {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                background: white;
                z-index: 1000;
                padding: 10px 20px 5px 20px;
                border-bottom: 1px solid #ddd;
            }
            
            .print-footer {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: white;
                z-index: 1000;
                padding: 5px 20px 10px 20px;
                border-top: 1px solid #ddd;
            }
            
            #evaluationForm {
                margin-top: 250px !important;
                margin-bottom: 100px !important;
                padding-top: 0;
            }
        }
        
        /* ===== HEADER CONTENT STYLES ===== */
        .header-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 10px;
            width: 100%;
        }
        
        .logo-left {
            height: 90px;
            width: auto;
        }
        
        .logos-right {
            display: flex;
            gap: 20px;
            align-items: center;
        }
        
        .logos-right img {
            height: 80px;
            width: auto;
        }
        
        .college-info {
            text-align: center;
            flex-grow: 1;
            padding: 0 20px;
        }
        
        .college-info h1 {
            font-family: "Times New Roman", Times, serif;
            color: #4f81bd !important;
            font-size: 26px;
            margin: 0;
            font-weight: normal;
            line-height: 1.2;
        }
        
        .college-info p {
            font-size: 11px;
            margin: 2px 0;
            color: #333;
            line-height: 1.4;
        }
        
        .college-info a {
            font-size: 13px;
            color: #0000EE !important;
            text-decoration: underline;
        }
        
        /* ===== OFFICE TITLE ===== */
        .office-title {
            text-align: center;
            font-size: 18px;
            color: #595959 !important;
            font-weight: bold;
            margin: 5px 0 5px 0;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }
        
        .double-line {
            border-top: 4px double #4f81bd !important;
            margin-bottom: 15px;
        }
        
        /* ===== SECOND HEADER STYLES ===== */
        header h1 {
            text-align: center;
            font-size: 18px;
            text-decoration: underline;
            margin: 15px 0 20px 0;
        }
        
        /* ===== HEADER INFO ===== */
        .header-info .input-line {
            display: flex;
            margin-bottom: 10px;
            align-items: flex-end;
        }
        
        .header-info label {
            font-weight: bold;
            margin-right: 10px;
            white-space: nowrap;
        }
        
        .full-line {
            border: none;
            border-bottom: 1px solid #000 !important;
            flex-grow: 1;
            background: transparent;
            font-family: inherit;
            font-size: inherit;
            padding: 4px 0;
        }
        
        /* ===== CHECKBOX GRID ===== */
        .checkbox-grid {
            display: flex;
            justify-content: space-between;
            margin: 20px 0;
        }
        
        .checkbox-grid .column {
            width: 48%;
        }
        
        .checkbox-grid label {
            display: block;
            margin-bottom: 5px;
        }
        
        /* ===== TABLES ===== */
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        
        table, th, td {
            border: 1px solid #000 !important;
        }
        
        td {
            padding: 8px;
            vertical-align: top;
        }
        
        .legend-table td.score-cell {
            width: 40px;
            text-align: center;
            font-weight: bold;
            vertical-align: middle;
        }
        
        .evaluation-table thead th {
            background-color: #f2f2f2 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        
        .evaluation-table .num-col {
            width: 40px;
            text-align: center;
        }
        
        .category-row {
            background-color: #e9e9e9 !important;
            font-weight: bold;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        
        tr td em {
            font-size: 11px;
            display: block;
            margin-top: 2px;
        }
        
        /* Radio button styling - RED color without check mark */
        .radio-cell {
            text-align: center;
            vertical-align: middle;
        }
        
        input[type="radio"] {
            -webkit-appearance: radio !important;
            appearance: radio !important;
            opacity: 1 !important;
            display: inline-block !important;
            transform: scale(1.1) !important;
            margin: 0 4px !important;
            width: 16px !important;
            height: 16px !important;
            accent-color: #dc2626 !important;
            color: #dc2626 !important;
        }
        
        input[type="radio"]::before,
        input[type="radio"]::after {
            display: none !important;
            content: none !important;
        }
        
        input[type="radio"]:checked {
            accent-color: #dc2626 !important;
            background-color: #dc2626 !important;
        }
        
        /* ===== SIGNATURE SECTION ===== */
        .signature-section {
            margin-top: 40px;
            page-break-inside: avoid;
        }
        
        .sig-line {
            margin-bottom: 10px;
            font-weight: bold;
            display: flex;
            align-items: center;
        }
        
        .sig-input {
            border: none;
            border-bottom: 1px solid #000 !important;
            background: transparent;
            width: 280px;
            font-family: inherit;
            font-size: inherit;
            margin-left: 10px;
            padding: 4px 0;
        }
        
        .date-input {
            width: 180px;
        }
        
        /* ===== DOCUMENT INFO TABLE ===== */
        .document-info {
            margin-top: 50px;
            width: 30%;
            page-break-inside: avoid;
        }
        
        .doc-header {
            width: auto;
            margin-right: auto;
            border-collapse: collapse;
            font-family: Arial, sans-serif;
            font-size: 11px;
            border: 1px solid #d1d1d1;
        }
        
        .doc-header td {
            border: 1px solid #000 !important;
            padding: 5px 10px;
        }
        
        .doc-header .label {
            background-color: #002060 !important;
            color: white !important;
            width: 25%;
            font-size: 11px;
            font-weight: bold;
            padding: 4px 8px;
            text-align: left;
            white-space: nowrap;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        
        .doc-header td.value {
            width: 70%;
            font-size: 11px;
            text-align: left;
            padding: 4px 10px;
        }
        
        .doc-header td.value input,
        .doc-header td.value p {
            border: none;
            background: transparent;
            font-family: inherit;
            font-size: inherit;
            color: #333;
            margin: 0;
            padding: 0;
            width: 100%;
        }
        
        /* ===== FOOTER STYLES ===== */
        footer {
            margin-top: 10px;
            width: 100%;
        }
        
        .footer-bottom {
            display: flex;
            align-items: flex-end;
            justify-content: flex-end;
            padding-bottom: 5px;
            width: 100%;
        }
        
        .footer-logos {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-left: 30px;
        }
        
        .footer-logos img {
            height: 40px;
            width: auto;
        }
        
        /* ===== PRINT-SPECIFIC OPTIMIZATIONS ===== */
        @media print {
            .doc-header td.label {
                background-color: #002060 !important;
                color: white !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            
            .category-row {
                background-color: #e9e9e9 !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            
            .evaluation-table thead th {
                background-color: #f2f2f2 !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            
            .college-info h1 {
                color: #4f81bd !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            
            .office-title {
                color: #595959 !important;
            }
            
            .double-line {
                border-top: 4px double #4f81bd !important;
            }
            
            input[type="radio"] {
                accent-color: #dc2626 !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            
            table, th, td {
                border: 1px solid #000 !important;
            }
            
            .full-line, .sig-input {
                border-bottom: 1px solid #000 !important;
            }
            
            #evaluationForm {
                box-shadow: none;
                background: white !important;
            }
            
            body {
                background: white;
            }
        }
    `;
    
    // Get all original styles from the page
    const originalStyles = document.querySelectorAll('link[rel="stylesheet"], style:not([data-print-ignore])');
    let stylesHTML = '';
    originalStyles.forEach(styleTag => {
        if (styleTag.tagName === 'LINK') {
            stylesHTML += `<link rel="stylesheet" href="${styleTag.href}">`;
        } else if (styleTag.tagName === 'STYLE' && styleTag.textContent) {
            if (!styleTag.textContent.includes('@media print')) {
                stylesHTML += `<style>${styleTag.innerHTML}</style>`;
            }
        }
    });
    
    // Create a temporary container for printing
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
        alert('Please allow pop-ups to print the document. Check your browser settings.');
        return;
    }
    
    // Write the print document
    printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Extension Services Evaluation Sheet</title>
            ${stylesHTML}
            ${style.outerHTML}
            <style>
                input[type="radio"] {
                    -webkit-appearance: radio !important;
                    appearance: radio !important;
                    opacity: 1 !important;
                    display: inline-block !important;
                    margin: 0 4px !important;
                    transform: scale(1.1) !important;
                    width: 16px !important;
                    height: 16px !important;
                    accent-color: #dc2626 !important;
                    color: #dc2626 !important;
                }
                
                input[type="radio"]::before,
                input[type="radio"]::after,
                input[type="radio"]:checked::before,
                input[type="radio"]:checked::after {
                    display: none !important;
                    content: none !important;
                }
                
                input[type="radio"]:checked {
                    accent-color: #dc2626 !important;
                }
                
                * {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }
            </style>
        </head>
        <body>
            <!-- Repeating Header (extracted from the evaluation-container) -->
            <div class="print-header">
                ${headerHTML}
            </div>
            
            <!-- Repeating Footer (extracted from the evaluation-container) -->
            <div class="print-footer">
                ${footerHTML}
            </div>
            
            <!-- Main Content (the form without headers and footer) -->
            <form id="evaluationForm" class="evaluation-container">
                ${printContent.innerHTML}
            </form>
            
            <script>
                let printTriggered = false;
                
                window.onload = function() {
                    setTimeout(function() {
                        if (!printTriggered) {
                            printTriggered = true;
                            window.focus();
                            window.print();
                        }
                    }, 500);
                };
                
                window.onafterprint = function() {
                    setTimeout(function() {
                        window.close();
                        if (window.opener) {
                            window.opener.focus();
                        }
                    }, 100);
                };
                
                setTimeout(function() {
                    if (!printTriggered) {
                        printTriggered = true;
                        window.print();
                        setTimeout(function() {
                            window.close();
                        }, 3000);
                    }
                }, 1000);
            <\/script>
        </body>
        </html>
    `);
    
    printWindow.document.close();
}

// Helper function to preserve radio button states
function fixRadioStatesForPrint(cloneElement) {
    const radios = cloneElement.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => {
        if (radio.checked) {
            radio.setAttribute('checked', 'checked');
        }
        if (radio.name) {
            radio.setAttribute('name', radio.name);
        }
        radio.style.accentColor = '#dc2626';
    });
    
    const checkboxes = cloneElement.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            checkbox.setAttribute('checked', 'checked');
        }
    });
    
    const inputs = cloneElement.querySelectorAll('input[type="text"], input[type="date"], textarea');
    inputs.forEach(input => {
        if (input.value) {
            input.setAttribute('value', input.value);
        }
    });
}

// Export for global use
window.printReport = printReport;