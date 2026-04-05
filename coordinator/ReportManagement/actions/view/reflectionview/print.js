// print.js - Handles printing of the monthly accomplishment report

function printReport() {
    // Get all current form values
    const beneficiaryName = document.getElementById('beneficiary_name')?.value || '';
    const implementingDept = document.getElementById('implementing_department')?.value || '';
    const answerOne = document.getElementById('answer_one')?.value || '';
    const answerTwo = document.getElementById('answer_two')?.value || '';
    const answerThree = document.getElementById('answer_three')?.value || '';
    const beneficiarySignature = document.getElementById('beneficiary_signature')?.value || '';
    
    // Get checkbox states
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const checkboxValues = [];
    checkboxes.forEach((cb) => {
        checkboxValues.push(cb.checked);
    });
    
    // Get document info values
    const issueStatus = document.querySelector('input[name="issue_status"]')?.value || '';
    const revisionNumber = document.querySelector('input[name="revision_number"]')?.value || '';
    const dateEffective = document.querySelector('input[name="date_effective"]')?.value || '';
    const approvedBy = document.querySelector('input[name="approved_by"]')?.value || '';
    
    // Create print iframe
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.top = '-9999px';
    iframe.style.left = '-9999px';
    iframe.style.width = '850px';
    iframe.style.height = '1200px';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);
    
    const doc = iframe.contentWindow.document;
    
    // Write content to iframe
    doc.open();
    doc.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Monthly Accomplishment Report</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.4;
                    color: #000;
                    background: white;
                    padding: 40px;
                }
                
                .report-container {
                    width: 850px;
                    margin: 0 auto;
                    background: white;
                    padding: 40px;
                    box-shadow: none;
                }
                
                /* Header styles */
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
                }
                
                .logos-right img {
                    height: 80px;
                    width: auto;
                }
                
                .college-info {
                    text-align: center;
                    flex: 1;
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
                    text-decoration: underline;
                }
                
                .office-title {
                    text-align: center;
                    font-size: 18px;
                    color: #595959;
                    font-weight: bold;
                    margin: 20px 0 5px;
                    text-transform: uppercase;
                }
                
                .double-line {
                    border-top: 4px double #4f81bd;
                    margin-bottom: 25px;
                }
                
                .main-title {
                    text-align: center;
                    font-size: 1.2rem;
                    text-decoration: underline;
                    margin-bottom: 25px;
                }
                
                /* Form groups */
                .input-group {
                    display: flex;
                    margin-bottom: 10px;
                    align-items: baseline;
                }
                
                .input-group label {
                    white-space: nowrap;
                    font-weight: bold;
                    width: 180px;
                }
                
                .line-input {
                    flex: 1;
                    border: none;
                    border-bottom: 1px solid black;
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
                    text-decoration: underline;
                }
                
                /* Checkbox grid */
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
                }
                
                .check-item label {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                }
                
                input[type="checkbox"] {
                    width: 16px;
                    height: 16px;
                    cursor: pointer;
                    margin: 0;
                }
                
                /* Questions */
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
                
                /* Answers */
                .answer-section {
                    margin: 20px 0;
                }
                
                .answer-block {
                    display: flex;
                    margin-bottom: 20px;
                    align-items: flex-start;
                }
                
                .answer-number {
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
                
                /* Signature */
                .signature-wrapper {
                    margin-top: 80px;
                    display: flex;
                    justify-content: flex-end;
                }
                
                .signature-block {
                    text-align: center;
                    width: 300px;
                }
                
                .signature-line {
                    border-bottom: 1px solid black;
                    padding: 5px;
                    margin-bottom: 5px;
                }
                
                .signature-label {
                    margin-top: 8px;
                    font-size: 0.9rem;
                }
                
                /* Document Info Table - Navy Blue Style */
                .document-info {
                    margin-top: 50px;
                    width: 32%;
                }
                
                .doc-header {
                    border-collapse: collapse;
                    font-family: Arial, sans-serif;
                    font-size: 11px;
                    border: 1px solid #d1d1d1;
                    width: auto;
                    margin-right: auto;
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
                    border-top: 1px solid #d1d1d1;
                    border-bottom: 1px solid #d1d1d1;
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
                    color: #333;
                    margin: 0;
                    padding: 0;
                    width: 100%;
                }
                
                /* Print styles */
                @media print {
                    body {
                        padding: 0;
                        margin: 0;
                    }
                    .report-container {
                        padding: 20px;
                        margin: 0;
                    }
                    .doc-header td.label {
                        background-color: #002060 !important;
                        color: white !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                }
            </style>
        </head>
        <body>
            <div class="report-container">
                <!-- Header -->
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
                
                <h1 class="main-title">MONTHLY ACCOMPLISHMENT REPORT - REFLECTION PAPER</h1>
                
                <!-- Info Section -->
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
                
                <!-- Checkbox Grid -->
                <div class="checkbox-grid">
                    <div class="column">
                        <div class="check-item"><label><input type="checkbox" ${checkboxValues[0] ? 'checked' : ''}> Reading Literacy and Numeracy Program</label></div>
                        <div class="check-item"><label><input type="checkbox" ${checkboxValues[1] ? 'checked' : ''}> Sustainable Livelihood Program</label></div>
                        <div class="check-item"><label><input type="checkbox" ${checkboxValues[2] ? 'checked' : ''}> Feeding Program</label></div>
                        <div class="check-item"><label><input type="checkbox" ${checkboxValues[3] ? 'checked' : ''}> Recollection/Retreat</label></div>
                        <div class="check-item"><label><input type="checkbox" ${checkboxValues[4] ? 'checked' : ''}> Lecture/Seminar</label></div>
                    </div>
                    <div class="column">
                        <div class="check-item"><label><input type="checkbox" ${checkboxValues[5] ? 'checked' : ''}> Training and Workshop</label></div>
                        <div class="check-item"><label><input type="checkbox" ${checkboxValues[6] ? 'checked' : ''}> Coastal Clean-Up drive</label></div>
                        <div class="check-item"><label><input type="checkbox" ${checkboxValues[7] ? 'checked' : ''}> Tree Planting Program</label></div>
                        <div class="check-item"><label><input type="checkbox" ${checkboxValues[8] ? 'checked' : ''}> Gardening Program</label></div>
                        <div class="check-item"><label><input type="checkbox" ${checkboxValues[9] ? 'checked' : ''}> Community Clean-up Drive</label></div>
                        <div class="check-item"><label><input type="checkbox" ${checkboxValues[10] ? 'checked' : ''}> Health/Crime Prevention/Environmental Awareness</label></div>
                    </div>
                </div>
                
                <!-- Questions -->
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
                
                <!-- Answers -->
                <div class="answer-section">
                    <p><strong>Answer:</strong></p>
                    <div class="answer-block">
                        <div class="answer-number">1.</div>
                        <div class="answer-text">${escapeHtml(answerOne) || '_________________________'}</div>
                    </div>
                    <div class="answer-block">
                        <div class="answer-number">2.</div>
                        <div class="answer-text">${escapeHtml(answerTwo) || '_________________________'}</div>
                    </div>
                    <div class="answer-block">
                        <div class="answer-number">3.</div>
                        <div class="answer-text">${escapeHtml(answerThree) || '_________________________'}</div>
                    </div>
                </div>
                
                <!-- Signature -->
                <div class="signature-wrapper">
                    <div class="signature-block">
                        <div class="signature-line">${escapeHtml(beneficiarySignature)}</div>
                        <div class="signature-label">Signature of the Beneficiary</div>
                    </div>
                </div>
                
                <!-- Document Info Table with Navy Blue Style -->
                <div class="document-info">
                    <table class="doc-header">
                        <tr>
                            <td class="label">Form Code No.</td>
                            <td>:</td>
                            <td class="value">FM-DPM-SMCC-CES-05B</td>
                        </tr>
                        <tr>
                            <td class="label">Issue Status</td>
                            <td>:</td>
                            <td class="value"><input type="text" value="${escapeHtml(issueStatus)}"></td>
                        </tr>
                        <tr>
                            <td class="label">Revision No.</td>
                            <td>:</td>
                            <td class="value"><input type="text" value="${escapeHtml(revisionNumber)}"></td>
                        </tr>
                        <tr>
                            <td class="label">Date Effective</td>
                            <td>:</td>
                            <td class="value"><input type="text" value="${escapeHtml(dateEffective)}"></td>
                        </tr>
                        <tr>
                            <td class="label">Approved By</td>
                            <td>:</td>
                            <td class="value"><input type="text" value="${escapeHtml(approvedBy)}"></td>
                        </tr>
                    </table>
                </div>
            </div>
        </body>
        </html>
    `);
    doc.close();
    
    // Wait for content to load then print
    iframe.onload = function() {
        setTimeout(function() {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
            
            // Remove iframe after print dialog closes
            const removeIframe = function() {
                if (document.body.contains(iframe)) {
                    document.body.removeChild(iframe);
                }
            };
            
            window.onafterprint = removeIframe;
            setTimeout(removeIframe, 1000);
        }, 100);
    };
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

window.printReport = printReport;