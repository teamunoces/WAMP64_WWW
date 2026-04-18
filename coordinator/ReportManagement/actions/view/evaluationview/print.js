// print.js - Handles printing of the evaluation sheet with exact color/layout preservation
function printReport() {
    // Get the evaluation form element
    const evaluationForm = document.getElementById('evaluationForm');
    
    if (!evaluationForm) {
        console.error('Evaluation form not found');
        alert('Could not find evaluation content to print');
        return;
    }
    
    // Get the parent evaluation container for header/footer
    const evaluationContainer = document.querySelector('.evaluation-container');
    
    if (!evaluationContainer) {
        console.error('Evaluation container not found');
        alert('Could not find evaluation container');
        return;
    }
    
    // Clone the entire evaluation container
    const printClone = evaluationContainer.cloneNode(true);
    
    // Ensure radio button states are preserved in the clone
    fixRadioStatesForPrint(printClone);
    
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
    
    // Create print-specific styles
    const printStyles = `
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
        
        /* Hide everything except print-container */
        body > *:not(#print-container) {
            display: none !important;
        }
        
        #print-container {
            display: block !important;
            position: relative;
            width: 100%;
            background: white;
        }
        
        /* Hide frames, buttons, and admin elements */
        #sidebarFrame, #headerFrame, .buttons, .admin-comment, .action-buttons {
            display: none !important;
        }
        
        /* Main container */
        .evaluation-container {
            max-width: 900px;
            margin: 0 auto;
            background: white !important;
            padding: 0;
            box-shadow: none;
        }
        
        /* Main form - proper spacing */
        #evaluationForm {
            background: white !important;
            padding: 20px 40px 120px 40px !important;
            box-shadow: none;
            pointer-events: none;
        }
        
        /* ===== PRINT PAGE MARGINS ===== */
        @page {
            margin: 0.5in;
        }
        
        /* ===== HEADER - Fixed on every page ===== */
        .print-header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: white;
            z-index: 1000;
            padding: 10px 20px 10px 20px;
            border-bottom: 1px solid #ddd;
            box-sizing: border-box;
        }
        
        /* ===== FOOTER - Fixed on every page ===== */
        .print-footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: white;
            z-index: 1000;
            padding: 10px 20px;
            border-top: 1px solid #ddd;
            box-sizing: border-box;
        }
        
        /* ===== SPACER BLOCKS - Prevent overlap ===== */
        .header-spacer {
            height: 230px;
        }
        
        .footer-spacer {
            height: 80px;
        }
        
        /* ===== TABLE PAGE BREAK HANDLING ===== */
        table {
            page-break-inside: auto;
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            page-break-after: auto;
        }
        
        tr {
            page-break-inside: avoid;
        }
        
        td {
            page-break-inside: avoid;
        }
        
        thead {
            display: table-header-group;
        }
        
        tbody {
            display: table-row-group;
        }
        
        /* Prevent headings from breaking awkwardly */
        h1, h2, h3, h4, h5, h6, p {
            page-break-after: avoid;
            orphans: 3;
            widows: 3;
        }
        
        /* Prevent images from breaking across pages */
        img {
            page-break-inside: avoid;
            max-width: 100%;
            height: auto;
        }
        
        /* ===== HEADER CONTENT STYLES ===== */
        .header-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 10px;
            width: 100%;
            flex-wrap: wrap;
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
            word-break: break-all;
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
            flex-wrap: wrap;
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
            flex-wrap: wrap;
        }
        
        .checkbox-grid .column {
            width: 48%;
        }
        
        .checkbox-grid label {
            display: block;
            margin-bottom: 5px;
        }
        
        /* ===== TABLES ===== */
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
        
        /* Radio button styling */
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
        
        input[type="checkbox"] {
            accent-color: #dc2626 !important;
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
            flex-wrap: wrap;
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
            flex-wrap: wrap;
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
            
            .evaluation-container {
                box-shadow: none;
                background: white !important;
            }
            
            body {
                background: white;
            }
        }
    `;
    
    // Extract header and footer from the clone
    const clonedContainer = printClone;
    const headerElements = clonedContainer.querySelectorAll('header');
    const footerElement = clonedContainer.querySelector('footer');
    const formElement = clonedContainer.querySelector('#evaluationForm');
    
    // Build header HTML from all header elements
    let headerHTML = '';
    headerElements.forEach(header => {
        headerHTML += header.outerHTML;
    });
    
    // Build footer HTML
    let footerHTML = footerElement ? footerElement.outerHTML : '';
    
    // Get form HTML
    let formHTML = formElement ? formElement.outerHTML : '';
    
    // Create a temporary div to hold the print content
    const printContainer = document.createElement('div');
    printContainer.id = 'print-container';
    printContainer.innerHTML = `
        <!-- Fixed Header (appears on every page) -->
        <div class="print-header">
            ${headerHTML}
        </div>
        
        <!-- HEADER SPACER - Prevents content from hiding behind header -->
        <div class="header-spacer"></div>
        
        <!-- MAIN CONTENT -->
        <div class="evaluation-container">
            ${formHTML}
        </div>
        
        <!-- FOOTER SPACER - Prevents content from hiding behind footer -->
        <div class="footer-spacer"></div>
        
        <!-- Fixed Footer (appears on every page) -->
        <div class="print-footer">
            ${footerHTML}
        </div>
    `;
    
    // Add print styles to the page
    const styleElement = document.createElement('style');
    styleElement.textContent = printStyles;
    document.head.appendChild(styleElement);
    
    // Add print container to body
    document.body.appendChild(printContainer);
    
    // Trigger print
    window.print();
    
    // Clean up after printing to restore original page
    setTimeout(() => {
        // Remove print container
        if (printContainer && printContainer.parentNode) {
            printContainer.parentNode.removeChild(printContainer);
        }
        // Remove print styles
        if (styleElement && styleElement.parentNode) {
            styleElement.parentNode.removeChild(styleElement);
        }
    }, 500);
}

// Helper function to preserve radio button and input states
function fixRadioStatesForPrint(cloneElement) {
    // Preserve radio button states
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
    
    // Preserve checkbox states
    const checkboxes = cloneElement.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            checkbox.setAttribute('checked', 'checked');
        }
    });
    
    // Preserve text input values
    const inputs = cloneElement.querySelectorAll('input[type="text"], input[type="date"], textarea');
    inputs.forEach(input => {
        if (input.value) {
            input.setAttribute('value', input.value);
        }
    });
}

// Export for global use
window.printReport = printReport;