// print.js
function printReport() {
    // Store original display values
    const sidebarFrame = document.getElementById('sidebarFrame');
    const headerFrame = document.getElementById('headerFrame');
    const buttons = document.querySelector('.buttons');
    const formContainer = document.querySelector('.form-container');
    const body = document.body;
    
    // Store original styles to restore later
    const originalStyles = {
        sidebarDisplay: sidebarFrame ? sidebarFrame.style.display : '',
        headerDisplay: headerFrame ? headerFrame.style.display : '',
        buttonsDisplay: buttons ? buttons.style.display : '',
        bodyMarginLeft: body ? body.style.marginLeft : '',
        bodyBackground: body ? body.style.backgroundColor : '',
        formContainerMarginTop: formContainer ? formContainer.style.marginTop : '',
        formContainerMarginLeft: formContainer ? formContainer.style.marginLeft : '',
        formContainerWidth: formContainer ? formContainer.style.width : '',
        formContainerMaxWidth: formContainer ? formContainer.style.maxWidth : '',
        formContainerPadding: formContainer ? formContainer.style.padding : '',
        formContainerBoxShadow: formContainer ? formContainer.style.boxShadow : '',
        formContainerBackground: formContainer ? formContainer.style.backgroundColor : ''
    };
    
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
    
    // Create a style element for print-specific adjustments
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
            
            /* Preserve all colors and styles */
            .program-table th {
                background-color: #d9d9d9 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            
            .doc-header td.label {
                background-color: #002060 !important;
                color: white !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            
            /* Ensure borders and lines are printed */
            .signature-line {
                border-bottom: 1.5px solid black !important;
            }
            
            .name-underlined {
                text-decoration: underline !important;
            }
            
            .double-line {
                border-top: 4px double #4f81bd !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            
            /* Keep all text colors */
            .college-info h1 {
                color: #4f81bd !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            
            /* Ensure all content is visible */
            .program-table td[contenteditable="true"] {
                background-color: white !important;
            }
            
            /* Prevent page breaks inside important elements */
            .approvals-container, .document-info, footer {
                page-break-inside: avoid;
            }
            
            /* Ensure table rows don't break awkwardly */
            tr {
                page-break-inside: avoid;
            }
        }
    `;
    
    document.head.appendChild(printStyle);
    
    // Trigger print
    window.print();
    
    // Restore original display after printing
    // Use a longer timeout to ensure print dialog is fully closed
    setTimeout(() => {
        // Restore iframes visibility
        if (sidebarFrame) sidebarFrame.style.display = originalStyles.sidebarDisplay;
        if (headerFrame) headerFrame.style.display = originalStyles.headerDisplay;
        if (buttons) buttons.style.display = originalStyles.buttonsDisplay;
        
        // Restore body styles
        if (body) {
            body.style.marginLeft = originalStyles.bodyMarginLeft;
            body.style.backgroundColor = originalStyles.bodyBackground;
        }
        
        // Restore form container styles
        if (formContainer) {
            formContainer.style.marginTop = originalStyles.formContainerMarginTop;
            formContainer.style.marginLeft = originalStyles.formContainerMarginLeft;
            formContainer.style.width = originalStyles.formContainerWidth;
            formContainer.style.maxWidth = originalStyles.formContainerMaxWidth;
            formContainer.style.padding = originalStyles.formContainerPadding;
            formContainer.style.boxShadow = originalStyles.formContainerBoxShadow;
            formContainer.style.backgroundColor = originalStyles.formContainerBackground;
        }
        
        // Remove the temporary print style
        const tempStyle = document.getElementById('print-style-temp');
        if (tempStyle && tempStyle.parentNode) {
            tempStyle.remove();
        }
        
        // Force a reflow to ensure styles are reapplied
        if (body) {
            // Trigger reflow
            void body.offsetHeight;
        }
    }, 1000); // Increased timeout to ensure print dialog is fully closed
}

// Make function globally available
window.printReport = printReport;