// print.js
function printReport() {
    // Store original display values
    const sidebarFrame = document.getElementById('sidebarFrame');
    const headerFrame = document.getElementById('headerFrame');
    const buttons = document.querySelector('.buttons');
    const formContainer = document.querySelector('.form-container');
    const body = document.body;
    
    // Hide elements for printing
    if (sidebarFrame) sidebarFrame.style.display = 'none';
    if (headerFrame) headerFrame.style.display = 'none';
    if (buttons) buttons.style.display = 'none';
    
    // Adjust container for print
    if (formContainer) {
        formContainer.style.marginTop = '0';
        formContainer.style.marginLeft = '0';
        formContainer.style.width = '100%';
        formContainer.style.maxWidth = '100%';
        formContainer.style.padding = '20px';
        formContainer.style.boxShadow = 'none';
        formContainer.style.backgroundColor = 'white';
    }
    
    if (body) {
        body.style.marginLeft = '0';
        body.style.backgroundColor = 'white';
    }
    
    // Create style element for print
    const printStyle = document.createElement('style');
    printStyle.id = 'print-style-temp';
    printStyle.innerHTML = `
        @media print {
            @page {
                size: portrait;
                margin: 0.5in;
            }
            
            * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
            }
            
            body {
                background-color: white !important;
                padding: 0 !important;
                margin: 0 !important;
                display: block !important;
            }
            
            #sidebarFrame, #headerFrame, .buttons {
                display: none !important;
            }
            
            .form-container {
                margin: 0 auto !important;
                padding: 20px !important;
                width: 100% !important;
                max-width: 100% !important;
                box-shadow: none !important;
                background-color: white !important;
                overflow: visible !important;
            }
            
            /* Header styles */
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
            
            .college-info {
                text-align: center !important;
                flex-grow: 1 !important;
            }
            
            .college-info h1 {
                color: #4f81bd !important;
                font-size: 24px !important;
                margin: 0 !important;
            }
            
            .college-info p {
                font-size: 11px !important;
                margin: 2px 0 !important;
            }
            
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
            
            /* Form type */
            .form-type {
                text-align: center !important;
                font-size: 20px !important;
                margin: 20px 0 30px 0 !important;
                font-weight: bold !important;
            }
            
            /* Input fields */
            .input-fields {
                margin-bottom: 30px !important;
                width: 100% !important;
            }
            
            .field {
                display: flex !important;
                align-items: baseline !important;
                margin-bottom: 12px !important;
                width: 100% !important;
            }
            
            .field label {
                font-weight: bold !important;
                font-size: 14px !important;
                min-width: 140px !important;
            }
            
            .field input {
                flex-grow: 1 !important;
                padding: 6px 10px !important;
                font-size: 14px !important;
                border: none !important;
                border-bottom: 1px solid #ccc !important;
                background: transparent !important;
            }
            
            /* Program table */
            .program-table {
                width: 100% !important;
                border-collapse: collapse !important;
                margin-top: 10px !important;
                font-size: 10px !important;
                table-layout: fixed !important;
            }
            
            .program-table th {
                background-color: #d9d9d9 !important;
                border: 1px solid #a6a6a6 !important;
                padding: 8px 4px !important;
                text-align: center !important;
                font-weight: bold !important;
            }
            
            .program-table td {
                border: 1px solid #a6a6a6 !important;
                padding: 6px !important;
                text-align: left !important;
                vertical-align: top !important;
                background-color: white !important;
            }
            
            /* Approvals section */
            .approvals-container {
                width: 100% !important;
                max-width: 900px !important;
                margin: 40px auto 0 auto !important;
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
            }
            
            .title {
                font-size: 12px !important;
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
                font-size: 14px !important;
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
                font-size: 10px !important;
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
            
            /* Prevent page breaks */
            .approvals-container, .document-info, footer, header, .program-table tbody tr {
                page-break-inside: avoid !important;
            }
            
            thead {
                display: table-header-group !important;
            }
            
            /* Input styling */
            input {
                border: none !important;
                background: transparent !important;
            }
        }
    `;
    
    document.head.appendChild(printStyle);
    
    // Trigger print
    window.print();
    
    // Restore original display after printing
    setTimeout(() => {
        if (sidebarFrame) sidebarFrame.style.display = '';
        if (headerFrame) headerFrame.style.display = '';
        if (buttons) buttons.style.display = '';
        if (formContainer) {
            formContainer.style.marginTop = '';
            formContainer.style.marginLeft = '';
            formContainer.style.width = '';
            formContainer.style.maxWidth = '';
            formContainer.style.padding = '';
            formContainer.style.boxShadow = '';
            formContainer.style.backgroundColor = '';
        }
        if (body) {
            body.style.marginLeft = '';
            body.style.backgroundColor = '';
        }
        const tempStyle = document.getElementById('print-style-temp');
        if (tempStyle && tempStyle.parentNode) {
            tempStyle.remove();
        }
    }, 500);
}

// Make function globally available
window.printReport = printReport;