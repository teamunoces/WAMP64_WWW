// download.js - Handles PDF download with tight margins and red indicators
document.getElementById('downloadPDF')?.addEventListener('click', function() {
    downloadAsPDF();
});

async function downloadAsPDF() {
    if (typeof html2pdf === 'undefined') {
        await loadHtml2Pdf();
    }
    
    const evaluationContainer = document.querySelector('.evaluation-container');
    
    if (!evaluationContainer) {
        console.error('Evaluation container not found');
        return;
    }

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `Evaluation_Sheet_${dateStr}.pdf`;

    const opt = {
        // FIX 1: Set top margin to 0 to remove the wide space 
        margin: [0, 0.3, 0.5, 0.3], 
        filename: filename,
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: { 
            scale: 2, 
            useCORS: true,
            letterRendering: true,
            backgroundColor: '#ffffff',
            // FIX 2: Ensure layout is correct even if you're scrolled down 
            scrollY: 0,
            scrollX: 0,
            y: 0, 
            onclone: (clonedDoc) => {
                // Hide unwanted UI elements 
                const toHide = clonedDoc.querySelectorAll('#sidebarFrame, #headerFrame, .buttons, #admincomment, .admin-comment, .action-buttons');
                toHide.forEach(el => el.style.display = 'none');

                // FIX 3: Force both Radio buttons and Checkboxes to Red 
                const inputs = clonedDoc.querySelectorAll('input[type="radio"], input[type="checkbox"]');
                inputs.forEach(input => {
                    input.style.accentColor = '#dc2626';
                    input.style.color = '#dc2626';
                    
                    // Manually force checked state visibility for the PDF engine 
                    if (input.checked) {
                        input.setAttribute('checked', 'checked');
                    }
                });

                // Preserve table styling 
                const colored = clonedDoc.querySelectorAll('.doc-header .label, .category-row, .evaluation-table thead th');
                colored.forEach(el => {
                    el.style.setProperty('-webkit-print-color-adjust', 'exact', 'important');
                    el.style.setProperty('print-color-adjust', 'exact', 'important');
                });
            }
        },
        jsPDF: { 
            unit: 'in', 
            format: 'a4', 
            orientation: 'portrait'
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] } 
    };

    const loadingMsg = document.createElement('div');
    loadingMsg.innerHTML = '<b>Generating PDF...</b>';
    loadingMsg.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.9); color: white; padding: 20px;
        border-radius: 8px; z-index: 10000; text-align: center;
    `;
    document.body.appendChild(loadingMsg);

    try {
        await html2pdf().set(opt).from(evaluationContainer).save();
    } catch (error) {
        console.error('PDF Error:', error);
    } finally {
        if (loadingMsg.parentNode) document.body.removeChild(loadingMsg);
    }
}

function loadHtml2Pdf() {
    return new Promise((resolve, reject) => {
        if (typeof html2pdf !== 'undefined') return resolve();
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        script.crossOrigin = 'anonymous';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

window.downloadAsPDF = downloadAsPDF;