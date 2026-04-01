// download.js - Handles PDF download of the evaluation sheet

// Find the download button and attach event listener
const downloadBtn = document.getElementById('downloadPDF');
if (downloadBtn) {
    downloadBtn.addEventListener('click', function(e) {
        e.preventDefault();
        downloadAsPDF();
    });
}

async function downloadAsPDF() {
    // Check if html2pdf is available
    if (typeof html2pdf === 'undefined') {
        await loadHtml2Pdf();
    }
    
    // Get the evaluation container
    const evaluationContainer = document.querySelector('.evaluation-container');
    
    if (!evaluationContainer) {
        console.error('Evaluation container not found');
        alert('Could not find evaluation content to download');
        return;
    }
    
    // Clone the container to avoid modifying the original
    const pdfContent = evaluationContainer.cloneNode(true);
    
    // Create a style element for PDF-specific styles
    const style = document.createElement('style');
    style.textContent = `
        /* Hide elements that should not appear in PDF */
        #sidebarFrame, #headerFrame, .buttons, .admin-comment {
            display: none !important;
        }
        
        /* Ensure the PDF content looks exactly like the original */
        .evaluation-container {
            max-width: 900px;
            margin: 0 auto;
            background: #fff;
            padding: 40px;
            pointer-events: none;
        }
        
        .header-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 15px;
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
            color: #4f81bd;
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
        
        .office-title {
            text-align: center;
            font-size: 18px;
            color: #595959;
            font-weight: bold;
            margin: 20px 0 5px 0;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }
        
        .double-line {
            border-top: 4px double #4f81bd;
            margin-bottom: 25px;
        }
        
        header h1 {
            text-align: center;
            font-size: 18px;
            text-decoration: underline;
            margin-bottom: 30px;
        }
        
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
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        
        table, th, td {
            border: 1px solid #000;
        }
        
        td {
            padding: 8px;
            vertical-align: top;
        }
        
        .category-row {
            background-color: #e9e9e9;
            font-weight: bold;
        }
        
        .signature-section {
            margin-top: 40px;
        }
        
        .sig-line {
            margin-bottom: 10px;
            font-weight: bold;
            display: flex;
            align-items: center;
        }
        
        .sig-input {
            border: none;
            border-bottom: 1px solid #000;
            background: transparent;
            width: 280px;
            margin-left: 10px;
            padding: 4px 0;
        }
        
        .radio-cell {
            text-align: center;
            vertical-align: middle;
        }
        
        .doc-header .label {
            background-color: #002060;
            color: #fff;
        }
        
        .document-info {
            margin-top: 50px;
            width: 30%;
        }
        
        /* Preserve colors in PDF */
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
        
        /* Ensure radio buttons are visible */
        input[type="radio"] {
            -webkit-appearance: radio;
            appearance: radio;
            opacity: 1;
            display: inline-block;
        }
    `;
    
    // Apply styles to the cloned content
    pdfContent.insertBefore(style, pdfContent.firstChild);
    
    // Get the current date for filename
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `Evaluation_Sheet_${dateStr}.pdf`;
    
    // Configure PDF options
    const opt = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2,
            letterRendering: true,
            useCORS: true
        },
        jsPDF: { 
            unit: 'in', 
            format: 'a4', 
            orientation: 'portrait' 
        }
    };
    
    // Show loading indicator
    const loadingMsg = document.createElement('div');
    loadingMsg.textContent = 'Generating PDF, please wait...';
    loadingMsg.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 20px;
        border-radius: 8px;
        z-index: 10000;
        font-family: Arial, sans-serif;
        font-size: 14px;
    `;
    document.body.appendChild(loadingMsg);
    
    try {
        await html2pdf().set(opt).from(pdfContent).save();
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF. Please try again or use the Print function instead.');
    } finally {
        if (loadingMsg && loadingMsg.parentNode) {
            loadingMsg.parentNode.removeChild(loadingMsg);
        }
    }
}

// Helper function to load html2pdf library
function loadHtml2Pdf() {
    return new Promise((resolve, reject) => {
        if (typeof html2pdf !== 'undefined') {
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load html2pdf library'));
        document.head.appendChild(script);
    });
}