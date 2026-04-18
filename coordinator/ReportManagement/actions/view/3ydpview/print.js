/**
 * printReport()
 * * Captures the main content, converts inputs to printable text,
 * and ensures the table is responsive across paper sizes.
 */
function printReport() {
    // 1. Get the main printable elements
    const container = document.querySelector('.container');
    const adminComment = document.querySelector('.admin-comment');
    
    if (!container) {
        console.warn('No .container element found. Nothing to print.');
        alert('Unable to print: report container not found.');
        return;
    }
    
    // 2. Save original body content and head styles
    const originalBodyContent = document.body.innerHTML;
    const originalTitle = document.title;
    
    // 3. Clone the container and admin comment (deep clone)
    const printContainer = container.cloneNode(true);
    let printAdminComment = adminComment ? adminComment.cloneNode(true) : null;
    
    // 4. FIX: Convert Textareas and Inputs to static text
    const textareas = printContainer.querySelectorAll('textarea');
    textareas.forEach(ta => {
        const replacement = document.createElement('div');
        replacement.style.whiteSpace = 'pre-wrap';
        replacement.style.wordBreak = 'break-word';
        replacement.style.width = '100%';
        replacement.className = 'printable-text';
        replacement.innerText = ta.value;
        ta.parentNode.replaceChild(replacement, ta);
    });

    // Convert other input types if needed
    const inputs = printContainer.querySelectorAll('input, select');
    inputs.forEach(input => {
        const replacement = document.createElement('div');
        replacement.style.whiteSpace = 'pre-wrap';
        replacement.style.wordBreak = 'break-word';
        replacement.className = 'printable-text';
        
        if (input.type === 'checkbox' || input.type === 'radio') {
            replacement.innerText = input.checked ? '✓ Checked' : '□ Unchecked';
        } else {
            replacement.innerText = input.value || '';
        }
        
        input.parentNode.replaceChild(replacement, input);
    });

    // 5. Remove interactive / non-printable elements
    const unwantedSelectors = ['.buttons', 'button', '.no-print', 'script'];
    unwantedSelectors.forEach(selector => {
        printContainer.querySelectorAll(selector).forEach(el => el.remove());
        if (printAdminComment) {
            printAdminComment.querySelectorAll(selector).forEach(el => el.remove());
        }
    });
    
    // 6. Add comprehensive print styles
    const printStyles = document.createElement('style');
    printStyles.id = 'print-styles';
    printStyles.textContent = `
        @media print {
            @page {
                size: landscape;
                margin: 10mm;
            }
            
            body {
                margin: 0 !important;
                padding: 0 !important;
                background: white !important;
                color: black !important;
            }
            
            .container {
                width: 100% !important;
                max-width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                box-shadow: none !important;
            }
            
            table#programPlanTable {
                width: 100% !important;
                table-layout: auto !important;
                border-collapse: collapse !important;
                page-break-inside: auto !important;
            }
            
            tr {
                page-break-inside: avoid !important;
                page-break-after: auto !important;
            }
            
            th, td {
                border: 1px solid #000 !important;
                padding: 8px 4px !important;
                font-size: 9pt !important;
                vertical-align: top !important;
                word-wrap: break-word !important;
                overflow-wrap: break-word !important;
            }

            th {
                background-color: #f2f2f2 !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }

            .printable-text {
                min-height: 1em;
                line-height: 1.4;
            }

            .paper-lines {
                background-image: linear-gradient(transparent 29px, #ccc 30px) !important;
                background-size: 100% 31px !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
        }
    `;
    
    // 7. Store reference to existing styles to restore later
    const existingStyles = document.querySelectorAll('style:not(#print-styles)');
    const existingLinks = document.querySelectorAll('link[rel="stylesheet"]');
    
    // 8. Assemble the print view
    document.body.innerHTML = '';
    document.head.appendChild(printStyles);
    document.body.appendChild(printContainer);
    if (printAdminComment) document.body.appendChild(printAdminComment);
    
    // 9. Set up print event handlers
    const afterPrintHandler = function() {
        // Restore original content
        document.body.innerHTML = originalBodyContent;
        document.title = originalTitle;
        
        // Remove print styles
        const printStyleElement = document.querySelector('#print-styles');
        if (printStyleElement) {
            printStyleElement.remove();
        }
        
        // Re-attach any event listeners that might have been lost
        // Option 1: Re-initialize your page's JavaScript
        if (typeof initializePage === 'function') {
            initializePage();
        }
        
        // Option 2: Remove and re-add event listeners if needed
        const printButton = document.querySelector('#print-button'); // Adjust selector as needed
        if (printButton && typeof attachPrintHandler === 'function') {
            attachPrintHandler();
        }
        
        // Clean up event listeners
        window.removeEventListener('afterprint', afterPrintHandler);
    };
    
    // 10. Trigger print with proper event handling
    if (window.matchMedia) {
        const mediaQueryList = window.matchMedia('print');
        const handleBeforePrint = () => {
            // Optional: Any pre-print setup
        };
        
        mediaQueryList.addListener((mql) => {
            if (!mql.matches) {
                afterPrintHandler();
            }
        });
    }
    
    // Use both onafterprint and event listener for better compatibility
    window.onafterprint = afterPrintHandler;
    window.addEventListener('afterprint', afterPrintHandler);
    
    // Trigger print dialog
    window.print();
    
    // Fallback for browsers that don't support afterprint events
    setTimeout(() => {
        // Check if we're still in print mode (this is a fallback)
        if (document.body.innerHTML !== originalBodyContent && 
            document.body.innerHTML !== '') {
            afterPrintHandler();
        }
    }, 3000);
}

// Optional: Helper function to re-attach event listeners
function initializePage() {
    // Re-attach any event listeners that were on the original page
    // For example, re-bind the print button if it exists
    const printBtn = document.querySelector('#print-button');
    if (printBtn && typeof printReport === 'function') {
        // Remove existing listeners to avoid duplicates
        const newPrintBtn = printBtn.cloneNode(true);
        printBtn.parentNode.replaceChild(newPrintBtn, printBtn);
        newPrintBtn.addEventListener('click', printReport);
    }
    
    // Re-attach any other event listeners your page needs
    console.log('Page re-initialized after print');
}