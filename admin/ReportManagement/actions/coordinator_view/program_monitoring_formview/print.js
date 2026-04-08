/**
 * print.js - Handles printing of the Program Monitoring Form
 * Based on the working print sample
 */

function printReport() {
    // Store original display values
    const sidebarFrame = document.getElementById('sidebarFrame');
    const headerFrame = document.getElementById('headerFrame');
    const buttons = document.querySelector('.buttons');
    
    // Hide elements for printing
    if (sidebarFrame) sidebarFrame.style.display = 'none';
    if (headerFrame) headerFrame.style.display = 'none';
    if (buttons) buttons.style.display = 'none';
    
    // Adjust main container margin for print
    const formContainer = document.querySelector('.form-container');
    if (formContainer) {
        formContainer.style.marginTop = '10px';
        formContainer.style.marginLeft = '0';
        formContainer.style.width = '100%';
    }
    
    // Create a style element for print-specific adjustments
    const printStyle = document.createElement('style');
    printStyle.innerHTML = `
        @media print {
            @page {
                size: Portrait;
                margin: 1.5cm;
            }
            
            body {
                background-color: white;
                padding: 0;
                margin: 0;
                display: block;
            }
            
            #sidebarFrame, #headerFrame, .buttons, .admin-comment {
                display: none !important;
            }
            
            .form-container {
                margin-top: 0 !important;
                margin-left: 0 !important;
                padding: 20px !important;
                width: 100% !important;
                max-width: 95% !important;
                box-shadow: none !important;
                background-color: white !important;
                overflow: visible !important;
                pointer-events: none !important;
            }
            
            /* Show textarea values */
            textarea {
                overflow: visible !important;
            }
            
            /* Show input values */
            input[type="text"] {
                background-color: transparent !important;
            }
            
            /* Preserve all colors and styles */
            th {
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
            
            /* Ensure checkbox states are visible */
            input[type="checkbox"] {
                transform: scale(1.2);
                margin: 0 4px;
            }
            
            input[type="checkbox"]:checked {
                accent-color: #ff0000d8;
            }
            
            /* Prevent page breaks inside important elements */
            .approvals-container, .document-info, footer, section {
                page-break-inside: avoid;
            }
            
            /* Ensure table rows don't break awkwardly */
            tr {
                page-break-inside: avoid;
            }
            
            /* Paper Lines Textarea Styling */
            .paper-lines {
                width: 100%;
                border: none;
                outline: none;
                font-size: 0.9em;
                line-height: 30px;
                padding: 0;
                background-attachment: local;
                background-image: linear-gradient(to bottom, transparent 29px, #000 29px);
                background-size: 100% 30px;
                background-color: transparent;
                font-family: Arial, sans-serif;
                overflow: hidden;
                margin-top: 8px;
            }
                #other_recommendations{
                 width: 100%;
                border: none;
                outline: none;
                font-size: 0.9em;
                line-height: 30px;
                padding: 0;
                background-attachment: local;
                background-image: linear-gradient(to bottom, transparent 29px, #000 29px);
                background-size: 100% 30px;
                background-color: transparent;
                font-family: Arial, sans-serif;
                overflow: hidden;
                margin-top: 8px;
                
                }
            
            /* Ensure all content is visible */
            .program-table td[contenteditable="true"] {
                background-color: white !important;
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
        if (formContainer) {
            formContainer.style.marginTop = '';
            formContainer.style.marginLeft = '';
            formContainer.style.width = '';
        }
        if (printStyle) printStyle.remove();
    }, 500);
}

// Make function globally available
window.printReport = printReport;