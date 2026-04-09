// print.js - Handles printing of Certificate of Appearance

function printReport() {
    // Get all current form values from the main page
    const participant = document.getElementById('participant')?.value || '';
    const certDepartment = document.getElementById('cert_department')?.value || '';
    const activityName = document.getElementById('activity_name')?.value || '';
    const location = document.getElementById('location')?.value || '';
    const dateHeld = document.getElementById('date_held')?.value || '';
    const monthHeld = document.getElementById('month_held')?.value || '';
    const yearHeld = document.getElementById('year_held')?.value || '';
    const locationTwo = document.getElementById('location_two')?.value || '';
    const monitoredBy = document.getElementById('monitored_by')?.value || '';
    const verifiedBy = document.getElementById('verified_by')?.value || '';
    
    // Get approval section values
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
            <title>Certificate of Appearance</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: 'Arial', sans-serif;
                    background: white;
                    padding: 40px;
                    display: flex;
                    justify-content: center;
                }
                
                .certificate-container {
                    background-color: #fff;
                    width: 850px;
                    padding: 60px;
                    margin: 0 auto;
                    box-shadow: none;
                }
                
                /* Header Section */
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
                    font-size: 1.4rem;
                    letter-spacing: 2px;
                    margin-bottom: 50px;
                    text-transform: uppercase;
                }
                
                /* Content Section */
                .content p {
                    margin: 20px 0;
                    line-height: 2;
                }
                
                .line-wrap {
                    display: inline-flex;
                    flex-direction: column;
                    align-items: center;
                    vertical-align: middle;
                }
                
                .sub-label {
                    font-size: 0.85rem;
                    margin-top: 1px;
                }
                
                .sub-label-center {
                    text-align: center;
                    font-size: 0.85rem;
                    width: 100%;
                }
                
                .location-group, .date-group {
                    margin: 20px 0;
                }
                
                /* Display values as underlined text */
                .display-value {
                    border-bottom: 1px solid black;
                    display: inline-block;
                    min-width: 100px;
                    text-align: center;
                    padding: 0 5px;
                }
                
                .long-value {
                    min-width: 280px;
                }
                
                .full-value {
                    width: 90%;
                    display: inline-block;
                }
                
                .short-value {
                    min-width: 60px;
                }
                
                .month-value {
                    min-width: 80px;
                }
                
                .location-value {
                    min-width: 150px;
                }
                
                /* Signature Section */
                .signatures {
                    margin-top: 50px;
                    display: flex;
                    flex-direction: column;
                    gap: 40px;
                }
                
                .sig-line {
                    margin-top: 30px;
                    width: 300px;
                }
                
                .sig-line .display-value {
                    width: 100%;
                }
                
                /* Approvals Section */
                .approvals-container {
                    font-family: Arial, sans-serif;
                    width: 100%;
                    max-width: 900px;
                    margin: 0 auto;
                    color: #000;
                    margin-top: 80px;
                }
                
                .approval-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 20px;
                }
                
                .signature-group {
                    width: 35%;
                }
                
                .label {
                    font-weight: bold;
                    margin-bottom: 35px;
                }
                
                .signature-line {
                    border-bottom: 1.5px solid black;
                    margin-bottom: 5px;
                    min-height: 20px;
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
                
                /* Document Info Table */
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
                
                /* Footer */
                footer {
                    margin-top: 50px;
                    width: 100%;
                }
                
                .footer-bottom {
                    display: flex;
                    align-items: flex-end;
                    justify-content: flex-end;
                    padding-bottom: 5px;
                    width: 100%;
                }
                
                .footer-logos {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    margin-left: 30px;
                }
                
                .footer-logos img {
                    height: 40px;
                    width: auto;
                }
                
                /* Print styles */
                @media print {
                    body {
                        padding: 0;
                        margin: 0;
                    }
                    .certificate-container {
                        padding: 0.5in;
                        margin: 0;
                    }
                    .doc-header td.label {
                        background-color: #002060 !important;
                        color: white !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .college-info h1 {
                        color: #4f81bd !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .double-line {
                        border-top: 4px double #4f81bd !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                }
            </style>
        </head>
        <body>
            <div class="certificate-container">
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
                
                <header>
                    <h1>CERTIFICATE OF APPEARANCE</h1>
                </header>
                
                <!-- Content Section -->
                <section class="content">
                    <p>
                        This is to certify that 
                        <span class="line-wrap">
                            <span class="display-value long-value">${escapeHtml(participant)}</span>
                            <span class="sub-label">(Name)</span>
                        </span> 
                        of 
                        <span class="line-wrap">
                            <span class="display-value long-value">${escapeHtml(certDepartment)}</span>
                            <span class="sub-label">(Department)</span>
                        </span>,
                    </p>
                    
                    <p>
                        has visited and monitored the activity/project on 
                        <span class="display-value med-value" style="display: block; width: 100%;">${escapeHtml(activityName)}</span>
                        <div class="sub-label-center">(title of the activity/project)</div>
                    </p>
                    
                    <div class="location-group">
                        held at <span class="display-value full-value">${escapeHtml(location)}</span>
                    </div>
                    
                    <div class="date-group">
                        Done this <span class="display-value short-value">${escapeHtml(dateHeld)}</span>
                        day of <span class="display-value month-value">${escapeHtml(monthHeld)}</span>, 
                        <span class="display-value short-value">${escapeHtml(yearHeld)}</span> 
                        at <span class="display-value location-value">${escapeHtml(locationTwo)}</span>
                    </div>
                </section>
                
                <!-- Signatures Section -->
                <section class="signatures">
                    <div class="signature-block">
                        <p><strong>Monitored by:</strong></p>
                        <div class="sig-line">
                            <span class="display-value" style="width: 100%;">${escapeHtml(monitoredBy)}</span>
                            <span class="sub-label">Signature over printed name</span>
                        </div>
                    </div>
                    
                    <div class="signature-block">
                        <p><strong>Verified by the Barangay Official/Community Head/Beneficiary:</strong></p>
                        <div class="sig-line">
                            <span class="display-value" style="width: 100%;">${escapeHtml(verifiedBy)}</span>
                            <span class="sub-label">Signature over printed name</span>
                        </div>
                    </div>
                </section>
                
                <!-- Approvals Section -->
                <section class="approvals-container">
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
                </section>
                
                <!-- Document Information -->
                <section class="document-info">
                    <table class="doc-header">
                        <tr>
                            <td class="label">Form Code No.</td>
                            <td>:</td>
                            <td class="value">FM-DPM-SMCC-CES-07</td>
                        </tr>
                        <tr>
                            <td class="label">Issue Status</td>
                            <td>:</td>
                            <td class="value">${escapeHtml(issueStatus)}</td>
                        </tr>
                        <tr>
                            <td class="label">Revision No.</td>
                            <td>:</td>
                            <td class="value">${escapeHtml(revisionNumber)}</td>
                        </tr>
                        <tr>
                            <td class="label">Date Effective</td>
                            <td>:</td>
                            <td class="value">${escapeHtml(dateEffective)}</td>
                        </tr>
                        <tr>
                            <td class="label">Approved By</td>
                            <td>:</td>
                            <td class="value">${escapeHtml(approvedBy)}</td>
                        </tr>
                    </table>
                </section>
                
                <!-- Footer -->
                <footer>
                    <div class="footer-bottom">
                        <div class="footer-logos">
                            <img src="/SYSTEM_VERSION_!/coordinator/ReportManagement/actions/images/footerlogo.png" alt="Org Logo 1">
                        </div>
                    </div>
                </footer>
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
            setTimeout(function() {
                if (document.body.contains(iframe)) {
                    document.body.removeChild(iframe);
                }
            }, 1000);
        }, 200);
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