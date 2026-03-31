/**
 * download.js - Handles PDF download of the Program Monitoring Form
 * Requires: html2canvas and jspdf libraries
 * Usage: Include this file in your HTML and call downloadPDF()
 */

// Check if libraries are loaded
function checkLibraries() {
    if (typeof html2canvas === 'undefined') {
        throw new Error('html2canvas library not loaded. Please add the CDN script to your HTML head section.');
    }
    if (typeof jspdf === 'undefined') {
        throw new Error('jspdf library not loaded. Please add the CDN script to your HTML head section.');
    }
    return true;
}

// ========================
// PDF DOWNLOAD FUNCTION
// ========================
async function downloadPDF() {
    // Show loading indicator
    const loader = showLoadingIndicator();
    
    try {
        // Check if required libraries are loaded
        checkLibraries();
        
        // Get the form container
        const formContainer = document.querySelector('.form-container');
        if (!formContainer) {
            throw new Error('Form container not found');
        }
        
        // Clone the form for PDF generation
        const pdfContent = formContainer.cloneNode(true);
        
        // Remove buttons from PDF version
        const buttons = pdfContent.querySelectorAll('.submit-button, .print-button, .download-button, #downloadPDF, button');
        buttons.forEach(btn => btn.remove());
        
        // Remove iframes
        const iframes = pdfContent.querySelectorAll('iframe');
        iframes.forEach(iframe => iframe.remove());
        
        // Remove pointer-events: none from cloned content
        pdfContent.style.pointerEvents = 'auto';
        
        // Ensure all textareas show their content
        const textareas = pdfContent.querySelectorAll('textarea');
        textareas.forEach(textarea => {
            const div = document.createElement('div');
            div.style.border = '1px solid #ddd';
            div.style.padding = '8px';
            div.style.margin = '4px 0';
            div.style.backgroundColor = '#f9f9f9';
            div.style.whiteSpace = 'pre-wrap';
            div.style.borderRadius = '4px';
            div.textContent = textarea.value || '(empty)';
            textarea.parentNode.replaceChild(div, textarea);
        });
        
        // Handle paper-lines textareas
        const paperLines = pdfContent.querySelectorAll('.paper-lines');
        paperLines.forEach(textarea => {
            const div = document.createElement('div');
            div.style.border = '1px solid #ddd';
            div.style.padding = '8px';
            div.style.margin = '4px 0';
            div.style.backgroundColor = '#f9f9f9';
            div.style.whiteSpace = 'pre-wrap';
            div.style.minHeight = '40px';
            div.style.lineHeight = '30px';
            div.style.borderRadius = '4px';
            div.textContent = textarea.value || '(empty)';
            textarea.parentNode.replaceChild(div, textarea);
        });
        
        // Ensure all text input fields show their values
        const textInputs = pdfContent.querySelectorAll('input[type="text"]');
        textInputs.forEach(input => {
            const span = document.createElement('span');
            span.style.display = 'inline-block';
            span.style.padding = '4px 8px';
            span.style.backgroundColor = '#f5f5f5';
            span.style.borderRadius = '3px';
            span.style.border = '1px solid #ddd';
            span.textContent = input.value || '(not specified)';
            input.parentNode.replaceChild(span, input);
        });
        
        // Handle checkboxes - show checked status
        const checkboxes = pdfContent.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            const statusSpan = document.createElement('span');
            statusSpan.style.display = 'inline-block';
            statusSpan.style.padding = '2px 8px';
            statusSpan.style.borderRadius = '3px';
            statusSpan.style.fontSize = '12px';
            
            if (checkbox.checked) {
                statusSpan.textContent = '✓ Checked';
                statusSpan.style.backgroundColor = '#d4edda';
                statusSpan.style.color = '#155724';
            } else {
                statusSpan.textContent = '☐ Unchecked';
                statusSpan.style.backgroundColor = '#f8d7da';
                statusSpan.style.color = '#721c24';
            }
            
            checkbox.parentNode.replaceChild(statusSpan, checkbox);
        });
        
        // Style the PDF content
        pdfContent.style.padding = '40px';
        pdfContent.style.backgroundColor = 'white';
        pdfContent.style.maxWidth = '900px';
        pdfContent.style.margin = '0 auto';
        
        // Style tables
        const tables = pdfContent.querySelectorAll('table');
        tables.forEach(table => {
            table.style.width = '100%';
            table.style.borderCollapse = 'collapse';
            table.style.marginBottom = '20px';
            
            const cells = table.querySelectorAll('td, th');
            cells.forEach(cell => {
                cell.style.border = '1px solid #000';
                cell.style.padding = '8px';
                cell.style.verticalAlign = 'top';
            });
            
            const headers = table.querySelectorAll('th');
            headers.forEach(header => {
                header.style.backgroundColor = '#f2f2f2';
                header.style.fontWeight = 'bold';
            });
        });
        
        // Create a temporary container for rendering
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.top = '-9999px';
        tempContainer.style.left = '-9999px';
        tempContainer.appendChild(pdfContent);
        document.body.appendChild(tempContainer);
        
        // Generate filename with current date and time
        const now = new Date();
        const filename = `Program_Monitoring_Form_${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,'0')}-${now.getDate().toString().padStart(2,'0')}_${now.getHours().toString().padStart(2,'0')}${now.getMinutes().toString().padStart(2,'0')}${now.getSeconds().toString().padStart(2,'0')}.pdf`;
        
        // Use html2canvas to render the content
        const canvas = await html2canvas(pdfContent, {
            scale: 2,
            backgroundColor: '#ffffff',
            logging: false,
            useCORS: true,
            allowTaint: false
        });
        
        // Remove temporary container
        document.body.removeChild(tempContainer);
        
        // Create PDF using jspdf
        const { jsPDF } = window.jspdf;
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let position = 0;
        
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        // Add image to PDF
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        
        // Check if we need multiple pages
        let heightLeft = imgHeight - pageHeight;
        
        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        
        // Save the PDF
        pdf.save(filename);
        
        // Show success message
        alert(`✓ PDF downloaded successfully!\n\nFilename: ${filename}`);
        
    } catch (error) {
        console.error('PDF generation error:', error);
        let errorMsg = 'Error generating PDF: ' + error.message;
        if (error.message.includes('html2canvas') || error.message.includes('jspdf')) {
            errorMsg += '\n\nPlease add these CDN scripts to your HTML <head> section:\n' +
                       '<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"><\/script>\n' +
                       '<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"><\/script>';
        }
        alert(errorMsg);
    } finally {
        hideLoadingIndicator(loader);
    }
}

// ========================
// HELPER FUNCTIONS
// ========================
function showLoadingIndicator() {
    let loader = document.querySelector('.pdf-loader');
    if (!loader) {
        loader = document.createElement('div');
        loader.className = 'pdf-loader';
        loader.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                        background: rgba(0,0,0,0.7); z-index: 10000; display: flex; 
                        justify-content: center; align-items: center; flex-direction: column;">
                <div style="background: white; padding: 20px; border-radius: 10px; 
                            text-align: center; min-width: 250px;">
                    <div style="border: 4px solid #f3f3f3; border-top: 4px solid #2196F3; 
                                border-radius: 50%; width: 40px; height: 40px; 
                                animation: spin 1s linear infinite; margin: 0 auto 15px;"></div>
                    <p style="margin: 0; font-size: 16px; font-weight: 500;">Generating PDF...</p>
                    <p style="margin: 5px 0 0; font-size: 12px; color: #666;">Please wait</p>
                </div>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
        document.body.appendChild(loader);
    }
    loader.style.display = 'flex';
    return loader;
}

function hideLoadingIndicator(loader) {
    if (loader) {
        loader.style.display = 'none';
    }
}

// Make downloadPDF available globally
window.downloadPDF = downloadPDF;