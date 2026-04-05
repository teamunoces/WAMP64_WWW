// download.js - Handles PDF download of the monthly accomplishment report

async function downloadPDF() {
    console.log('downloadPDF function called'); // Debug log
    
    const downloadBtn = document.getElementById('downloadPDF');
    console.log('Download button found:', downloadBtn); // Debug log
    
    const originalText = downloadBtn ? downloadBtn.innerHTML : 'Download PDF';
    
    if (downloadBtn) {
        downloadBtn.innerHTML = '⏳ Generating PDF...';
        downloadBtn.disabled = true;
        downloadBtn.style.opacity = '0.7';
    }
    
    try {
        console.log('Loading libraries...');
        // Load required libraries
        await loadHtml2Canvas();
        await loadJSPDF();
        console.log('Libraries loaded successfully');
        
        // Get all current form values
        const beneficiaryName = document.getElementById('beneficiary_name')?.value || '';
        const implementingDept = document.getElementById('implementing_department')?.value || '';
        const answerOne = document.getElementById('answer_one')?.value || '';
        const answerTwo = document.getElementById('answer_two')?.value || '';
        const answerThree = document.getElementById('answer_three')?.value || '';
        const beneficiarySignature = document.getElementById('beneficiary_signature')?.value || '';
        
        console.log('Form values retrieved');
        
        // Get checkbox states
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        const checkboxStates = [];
        checkboxes.forEach((cb, index) => {
            checkboxStates.push({
                index: index,
                checked: cb.checked,
                value: cb.value
            });
        });
        
        // Get document info values
        const issueStatus = document.querySelector('input[name="issue_status"]')?.value || '';
        const revisionNumber = document.querySelector('input[name="revision_number"]')?.value || '';
        const dateEffective = document.querySelector('input[name="date_effective"]')?.value || '';
        const approvedBy = document.querySelector('input[name="approved_by"]')?.value || '';
        
        console.log('Creating PDF wrapper...');
        
        // Create a wrapper for PDF content
        const pdfWrapper = document.createElement('div');
        pdfWrapper.style.width = '850px';
        pdfWrapper.style.margin = '0 auto';
        pdfWrapper.style.backgroundColor = 'white';
        pdfWrapper.style.padding = '40px';
        pdfWrapper.style.fontFamily = 'Arial, sans-serif';
        pdfWrapper.style.boxShadow = 'none';
        pdfWrapper.style.position = 'relative';
        
        // Build the PDF content directly (no admin comment)
        pdfWrapper.innerHTML = `
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                .container {
                    width: 100%;
                    padding: 0;
                    margin: 0;
                    box-shadow: none !important;
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
                }
                
                .college-info p {
                    font-size: 11px;
                    margin: 2px 0;
                    color: #333;
                }
                
                .college-info a {
                    font-size: 13px;
                    color: #0000EE;
                }
                
                .office-title {
                    text-align: center;
                    font-size: 18px;
                    color: #595959;
                    font-weight: bold;
                    margin: 20px 0 5px 0;
                    text-transform: uppercase;
                }
                
                .double-line {
                    border-top: 4px double #4f81bd;
                    margin-bottom: 25px;
                }
                
                header h1 {
                    text-align: center;
                    font-size: 1.2rem;
                    text-decoration: underline;
                    margin-bottom: 25px;
                }
                
                .input-group {
                    display: flex;
                    margin-bottom: 10px;
                    align-items: baseline;
                    width: 100%;
                }
                
                .input-group label {
                    white-space: nowrap;
                    margin-right: 10px;
                    font-weight: bold;
                    width: 180px;
                }
                
                .line-input {
                    flex-grow: 1;
                    border: none;
                    border-bottom: 1px solid black;
                    outline: none;
                    font-family: inherit;
                    font-size: 1rem;
                    padding: 5px;
                    background: transparent;
                }
                
                .instruction {
                    margin: 15px 0;
                    font-size: 0.95rem;
                }
                
                .translation {
                    color: #000000;
                    text-decoration: underline;
                }
                
                .checkbox-grid {
                    display: flex;
                    gap: 40px;
                    margin: 20px 0;
                }
                
                .column {
                    flex: 1;
                }
                
                .check-item {
                    margin-bottom: 8px;
                    display: flex;
                    align-items: center;
                }
                
                .check-item label {
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                input[type="checkbox"] {
                    width: 16px;
                    height: 16px;
                    cursor: pointer;
                    margin: 0;
                }
                
                .questions-section {
                    margin: 30px 0 20px;
                }
                
                .questions-section h3 {
                    text-decoration: underline;
                    margin-bottom: 15px;
                }
                
                .question {
                    margin-bottom: 15px;
                }
                
                .italic-trans {
                    font-style: italic;
                    margin-top: 3px;
                }
                
                .answer-section {
                    margin: 20px 0;
                }
                
                .answer-block {
                    display: flex;
                    align-items: flex-start;
                    margin-bottom: 20px;
                }
                
                .answer-block label {
                    font-weight: bold;
                    margin-right: 10px;
                    width: 25px;
                }
                
                .answer-text {
                    flex: 1;
                    line-height: 1.5;
                    white-space: pre-wrap;
                    word-wrap: break-word;
                    min-height: 60px;
                    padding: 5px;
                    border-bottom: 1px solid #ddd;
                }
                
                .signature-wrapper {
                    margin-top: 80px;
                    display: flex;
                    justify-content: flex-end;
                }
                
                .signature-block {
                    text-align: center;
                    width: 300px;
                }
                
                .signature-input {
                    width: 100%;
                    border: none;
                    border-bottom: 1px solid black;
                    text-align: center;
                    font-family: Arial, sans-serif;
                    font-size: 1.1rem;
                    padding: 5px;
                    outline: none;
                    background: transparent;
                }
                
                .signature-label {
                    margin-top: 8px;
                    font-size: 0.9rem;
                }
                
                .document-info {
                    margin-top: 50px;
                    width: 32%;
                }
                
                .doc-header {
                    border-collapse: collapse;
                    font-family: Arial, sans-serif;
                    font-size: 11px;
                    border: 1px solid #d1d1d1;
                    width: 100%;
                }
                
                .doc-header td {
                    border: 1px solid #d1d1d1;
                    padding: 5px 10px;
                }
                
                .doc-header td.label {
                    background-color: #002060;
                    color: white;
                    font-weight: bold;
                    padding: 4px 8px;
                    text-align: left;
                    white-space: nowrap;
                    width: 100px;
                }
                
                .doc-header td:nth-child(2) {
                    width: 2%;
                    padding: 0 1px;
                    font-weight: bold;
                    text-align: center;
                }
                
                .doc-header td.value {
                    padding: 4px 10px;
                    min-width: 120px;
                    text-align: left;
                }
                
                .doc-header td.value input {
                    border: none;
                    background: transparent;
                    font-family: inherit;
                    font-size: inherit;
                    width: 100%;
                }
                
                .admin-comment {
                    display: none !important;
                }
            </style>
            
            <div class="container">
                <header>
                    <div class="header-content">
                        <img src="/SYSTEM_VERSION_!/coordinator/ReportManagement/actions/images/smcclogo.png" alt="SMCC Logo" class="logo-left">
                        <div class="college-info">
                            <h1>Saint Michael College of Caraga</h1>
                            <p>Brgy. 4, Nasipit, Agusan del Norte, Philippines</p>
                            <p>District 8, Brgy. Triangulo, Nasipit, Agusan del Norte, Philippines</p>
                            <p>Tel Nos. +63 085 343-3251 / +63 085 283-3113</p>
                            <a href="http://www.smccnasipit.edu.ph">www.smccnasipit.edu.ph</a>
                        </div>
                        <div class="logos-right">
                            <img src="/SYSTEM_VERSION_!/coordinator/ReportManagement/actions/images/ISOlogo.png" alt="SOCOTEC Logo">
                        </div>
                    </div>
                    <h2 class="office-title">OFFICE OF THE COMMUNITY EXTENSION SERVICES</h2>
                    <div class="double-line"></div>
                </header>
                
                <h1 style="text-align: center; font-size: 1.2rem; text-decoration: underline; margin-bottom: 25px;">MONTHLY ACCOMPLISHMENT REPORT - REFLECTION PAPER</h1>
                
                <div class="input-group">
                    <label>Name of the Beneficiary:</label>
                    <div class="line-input" style="border-bottom: 1px solid black;">${escapeHtml(beneficiaryName)}</div>
                </div>
                <div class="input-group">
                    <label>Implementing Department:</label>
                    <div class="line-input" style="border-bottom: 1px solid black;">${escapeHtml(implementingDept)}</div>
                </div>
                
                <p class="instruction">
                    Kindly put a check (/) mark on the type of extension service extended 
                    <span class="translation">(Palihog ibutang ang tsek (/) sa klase sa serbisyo sa komunidad nga gihatag)</span>:
                </p>
                
                <div class="checkbox-grid">
                    <div class="column">
                        <div class="check-item"><label><input type="checkbox" ${checkboxStates[0]?.checked ? 'checked' : ''}> Reading Literacy and Numeracy Program</label></div>
                        <div class="check-item"><label><input type="checkbox" ${checkboxStates[1]?.checked ? 'checked' : ''}> Sustainable Livelihood Program</label></div>
                        <div class="check-item"><label><input type="checkbox" ${checkboxStates[2]?.checked ? 'checked' : ''}> Feeding Program</label></div>
                        <div class="check-item"><label><input type="checkbox" ${checkboxStates[3]?.checked ? 'checked' : ''}> Recollection/Retreat</label></div>
                        <div class="check-item"><label><input type="checkbox" ${checkboxStates[4]?.checked ? 'checked' : ''}> Lecture/Seminar</label></div>
                    </div>
                    <div class="column">
                        <div class="check-item"><label><input type="checkbox" ${checkboxStates[5]?.checked ? 'checked' : ''}> Training and Workshop</label></div>
                        <div class="check-item"><label><input type="checkbox" ${checkboxStates[6]?.checked ? 'checked' : ''}> Coastal Clean-Up drive</label></div>
                        <div class="check-item"><label><input type="checkbox" ${checkboxStates[7]?.checked ? 'checked' : ''}> Tree Planting Program</label></div>
                        <div class="check-item"><label><input type="checkbox" ${checkboxStates[8]?.checked ? 'checked' : ''}> Gardening Program</label></div>
                        <div class="check-item"><label><input type="checkbox" ${checkboxStates[9]?.checked ? 'checked' : ''}> Community Clean-up Drive</label></div>
                        <div class="check-item"><label><input type="checkbox" ${checkboxStates[10]?.checked ? 'checked' : ''}> Health/Crime Prevention/Environmental Awareness</label></div>
                    </div>
                </div>
                
                <div class="questions-section">
                    <h3>Guide Questions:</h3>
                    <div class="question">
                        <p>1. How did the program influence your sense of social responsibility?</p>
                        <p class="italic-trans">Giunsa sa programa pagpalambo sa imong pagbati sa sosyal nga responsibilidad?</p>
                    </div>
                    <div class="question">
                        <p>2. What values did you develop or strengthen through participation?</p>
                        <p class="italic-trans">Unsang mga kinaiya ang imong napalambo o napalig-on pinaagi sa pag-apil sa programa?</p>
                    </div>
                    <div class="question">
                        <p>3. How will you apply what you learned from the program in your daily life or real-life situations?</p>
                        <p class="italic-trans">Giunsa nimo pag-aplikar ang imong nahibal-an gikan sa programa sa imong adlaw-adlaw nga kinabuhi o sa tinuod nga kahimtang?</p>
                    </div>
                </div>
                
                <div class="answer-section">
                    <p><strong>Answer:</strong></p>
                    <div class="answer-block">
                        <label>1.</label>
                        <div class="answer-text">${escapeHtml(answerOne) || '_________________________'}</div>
                    </div>
                    <div class="answer-block">
                        <label>2.</label>
                        <div class="answer-text">${escapeHtml(answerTwo) || '_________________________'}</div>
                    </div>
                    <div class="answer-block">
                        <label>3.</label>
                        <div class="answer-text">${escapeHtml(answerThree) || '_________________________'}</div>
                    </div>
                </div>
                
                <div class="signature-wrapper">
                    <div class="signature-block">
                        <div class="signature-input" style="border-bottom: 1px solid black; min-height: 30px;">${escapeHtml(beneficiarySignature)}</div>
                        <div class="signature-label">Signature of the Beneficiary</div>
                    </div>
                </div>
                
                <div class="document-info">
                    <table class="doc-header">
                        <tr><td class="label">Form Code No.</td><td>:</td><td class="value">FM-DPM-SMCC-CES-05B</td></tr>
                        <tr><td class="label">Issue Status</td><td>:</td><td class="value"><input type="text" value="${escapeHtml(issueStatus)}"></td></tr>
                        <tr><td class="label">Revision No.</td><td>:</td><td class="value"><input type="text" value="${escapeHtml(revisionNumber)}"></td></tr>
                        <tr><td class="label">Date Effective</td><td>:</td><td class="value"><input type="text" value="${escapeHtml(dateEffective)}"></td></tr>
                        <tr><td class="label">Approved By</td><td>:</td><td class="value"><input type="text" value="${escapeHtml(approvedBy)}"></td></tr>
                    </table>
                </div>
            </div>
        `;
        
        console.log('PDF wrapper created, appending to body...');
        
        // Create temporary container for rendering
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.top = '-9999px';
        tempContainer.style.left = '-9999px';
        tempContainer.style.backgroundColor = 'white';
        tempContainer.appendChild(pdfWrapper);
        document.body.appendChild(tempContainer);
        
        console.log('Waiting for rendering...');
        // Wait for rendering
        await new Promise(resolve => setTimeout(resolve, 500));
        
        console.log('Rendering to canvas...');
        // Render to canvas
        const canvas = await html2canvas(pdfWrapper, {
            scale: 2,
            backgroundColor: '#ffffff',
            logging: true,
            useCORS: true,
            allowTaint: false,
            windowWidth: pdfWrapper.scrollWidth,
            windowHeight: pdfWrapper.scrollHeight
        });
        
        console.log('Canvas created, removing temp container...');
        // Remove temporary container
        document.body.removeChild(tempContainer);
        
        console.log('Creating PDF...');
        // Create PDF
        const { jsPDF } = window.jspdf;
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        let pdf = new jsPDF({
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait'
        });
        
        let position = 0;
        let heightLeft = imgHeight;
        
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        
        // Save the PDF
        const now = new Date();
        const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        pdf.save(`Monthly_Accomplishment_Report_${dateStr}.pdf`);
        console.log('PDF saved successfully!');
        
    } catch (error) {
        console.error('PDF Error:', error);
        alert('Error generating PDF: ' + error.message);
    } finally {
        if (downloadBtn) {
            downloadBtn.innerHTML = originalText;
            downloadBtn.disabled = false;
            downloadBtn.style.opacity = '1';
        }
    }
}

// Helper function to escape HTML
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Load html2canvas library
function loadHtml2Canvas() {
    return new Promise((resolve, reject) => {
        if (typeof html2canvas !== 'undefined') {
            console.log('html2canvas already loaded');
            resolve();
            return;
        }
        console.log('Loading html2canvas...');
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        script.onload = () => {
            console.log('html2canvas loaded');
            resolve();
        };
        script.onerror = () => {
            console.error('Failed to load html2canvas');
            reject(new Error('Failed to load html2canvas library'));
        };
        document.head.appendChild(script);
    });
}

// Load jsPDF library
function loadJSPDF() {
    return new Promise((resolve, reject) => {
        if (typeof window.jspdf !== 'undefined') {
            console.log('jsPDF already loaded');
            resolve();
            return;
        }
        console.log('Loading jsPDF...');
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        script.onload = () => {
            console.log('jsPDF loaded');
            resolve();
        };
        script.onerror = () => {
            console.error('Failed to load jsPDF');
            reject(new Error('Failed to load jsPDF library'));
        };
        document.head.appendChild(script);
    });
}

// Make function globally available
window.downloadPDF = downloadPDF;

// Add event listener when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const downloadBtn = document.getElementById('downloadPDF');
    if (downloadBtn) {
        console.log('Download button found, attaching event listener');
        // Remove any existing listeners to avoid duplicates
        const newBtn = downloadBtn.cloneNode(true);
        downloadBtn.parentNode.replaceChild(newBtn, downloadBtn);
        newBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Download button clicked');
            downloadPDF();
        });
    } else {
        console.log('Download button not found');
    }
});