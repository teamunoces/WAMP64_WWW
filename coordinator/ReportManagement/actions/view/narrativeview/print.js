// print.js - Handles printing of the monthly accomplishment report - narrative report

function printReport() {
    // Get all current form values
    const narrateSuccess = document.getElementById('narrate_success')?.value || '';
    const provideData = document.getElementById('provide_data')?.value || '';
    const identifyProblems = document.getElementById('identify_problems')?.value || '';
    const proposeSolutions = document.getElementById('propose_solutions')?.value || '';
    
    // Get signature/approval values
    const createdByName = document.getElementById('created_by_name')?.textContent || '';
    const dean = document.getElementById('dean')?.textContent || '';
    const cesHead = document.getElementById('ces_head')?.textContent || '';
    const vpAcad = document.getElementById('vp_acad')?.textContent || '';
    const vpAdmin = document.getElementById('vp_admin')?.textContent || '';
    const schoolPresident = document.getElementById('school_president')?.textContent || '';
    
    // Get document info values
    const issueStatus = document.querySelector('input[name="issue_status"]')?.value || '';
    const revisionNumber = document.querySelector('input[name="revision_number"]')?.value || '';
    const dateEffective = document.querySelector('input[name="date_effective"]')?.value || '';
    const approvedBy = document.querySelector('input[name="approved_by"]')?.value || '';
    const documentType = document.querySelector('.document_type')?.textContent || 'FM-DPM-SMCC-CES-05A';
    
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
            <title>Monthly Accomplishment Report - Narrative Report</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: 'Segoe UI', Arial, sans-serif;
                    line-height: 1.4;
                    color: #000;
                    background: white;
                    padding: 40px;
                }
                
                .report-container {
                    max-width: 850px;
                    width: 100%;
                    margin: 0 auto;
                    background: white;
                    padding: 50px;
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
                    font-size: 1.25rem;
                    text-decoration: underline;
                    margin-bottom: 40px;
                    text-transform: uppercase;
                }
                
                /* Report list styles */
                .report-list {
                    list-style-type: upper-roman;
                    padding-left: 40px;
                }
                
                .report-list li {
                    margin-bottom: 30px;
                }
                
                .label {
                    display: block;
                    font-weight: bold;
                    margin-bottom: 5px;
                    font-size: 1.1rem;
                }
                
                .line-input {
                    width: 100%;
                    border: none;
                    background: white;
                    font-family: inherit;
                    font-size: 1rem;
                    padding: 12px 0;
                    line-height: 1.5;
                    white-space: pre-wrap;
                    word-wrap: break-word;
                    min-height: 60px;
                }
                
                /* Approvals Section */
                .approvals-container {
                    font-family: Arial, sans-serif;
                    width: 100%;
                    max-width: 900px;
                    margin: 80px auto 0;
                    color: #000;
                }
                
                .approval-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 20px;
                }
                
                .signature-group {
                    width: 35%;
                }
                
                .signature-line {
                    border-bottom: 1.5px solid black;
                    margin-bottom: 5px;
                    min-height: 30px;
                }
                
                .title {
                    font-size: 14px;
                }
                
                .bold {
                    font-weight: bold;
                }
                
                .left-align {
                    text-align: left;
                    width: 100%;
                }
                
                .approval-centered {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                
                .admin-block {
                    text-align: center;
                    margin-top: 30px;
                    margin-bottom: 10px;
                }
                
                .name-underlined {
                    font-weight: bold;
                    text-decoration: underline;
                    text-transform: uppercase;
                    font-size: 16px;
                    display: inline-block;
                    margin-bottom: 2px;
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
                    font-size: 11px;
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
                
                <h1 class="main-title">MONTHLY ACCOMPLISHMENT REPORT - NARRATIVE REPORT</h1>
                
                <!-- Narrative Report Content -->
                <ol class="report-list">
                    <li>
                        <div class="label">Narrate Success</div>
                        <div class="line-input">${escapeHtml(narrateSuccess) || '_________________________'}</div>
                    </li>
                    <li>
                        <div class="label">Provide Data</div>
                        <div class="line-input">${escapeHtml(provideData) || '_________________________'}</div>
                    </li>
                    <li>
                        <div class="label">Identify Problems</div>
                        <div class="line-input">${escapeHtml(identifyProblems) || '_________________________'}</div>
                    </li>
                    <li>
                        <div class="label">Propose Solutions</div>
                        <div class="line-input">${escapeHtml(proposeSolutions) || '_________________________'}</div>
                    </li>
                </ol>
            </div>
            
            <!-- Approvals Section -->
            <div class="approvals-container">
                <div class="approval-row">
                    <div class="signature-group">
                        <div class="label">Prepared by:</div>
                        <div class="signature-line">${escapeHtml(createdByName)}</div>
                        <div class="title bold">CES Coordinator</div>
                    </div>
                </div>
                
                <div class="label" style="margin-top: 20px;">Noted by:</div>
                <div class="approval-row">
                    <div class="signature-group">
                        <div class="signature-line">${escapeHtml(dean)}</div>
                        <div class="title bold">Dean</div>
                    </div>
                    <div class="signature-group">
                        <div class="signature-line">${escapeHtml(cesHead)}</div>
                        <div class="title bold">CES Head</div>
                    </div>
                </div>
                
                <div class="approval-centered" style="margin-top: 40px;">
                    <div class="label left-align">Recommending Approval:</div>
                    <div class="admin-block">
                        <div class="name-underlined">${escapeHtml(vpAcad)}</div>
                        <div class="title bold">Vice-President for Academic Affairs and Research</div>
                    </div>
                    <div class="admin-block">
                        <div class="name-underlined">${escapeHtml(vpAdmin)}</div>
                        <div class="title bold">Vice-President for Administrative Affairs</div>
                    </div>
                </div>
                
                <div class="approval-centered">
                    <div class="label left-align">Approved by:</div>
                    <div class="admin-block">
                        <div class="name-underlined">${escapeHtml(schoolPresident)}</div>
                        <div class="title bold">School President</div>
                    </div>
                </div>
            </div>
            
            <!-- Document Info Table -->
            <div class="document-info">
                <table class="doc-header">
                    <tr>
                        <td class="label">Form Code No.</td>
                        <td>:</td>
                        <td class="value">${escapeHtml(documentType)}</td>
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