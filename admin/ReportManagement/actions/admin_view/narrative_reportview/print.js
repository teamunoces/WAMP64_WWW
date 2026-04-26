// print.js - Narrative Report Print
// Fixed: prevents duplicate "Approved by" section.

async function printReport() {
    console.log("NEW NARRATIVE PRINT.JS LOADED - APPROVAL DUPLICATE FIXED");

    const narrateSuccess = document.getElementById('narrate_success')?.value || '';
    const provideData = document.getElementById('provide_data')?.value || '';
    const identifyProblems = document.getElementById('identify_problems')?.value || '';
    const proposeSolutions = document.getElementById('propose_solutions')?.value || '';

    const cesHead = document.getElementById('ces_head')?.textContent?.trim() || '';
    const vpAcad = document.getElementById('vp_acad')?.textContent?.trim() || '';
    const vpAdmin = document.getElementById('vp_admin')?.textContent?.trim() || '';
    const schoolPresident = document.getElementById('school_president')?.textContent?.trim() || '';

    const issueStatus = document.querySelector('input[name="issue_status"]')?.value || '';
    const revisionNumber = document.querySelector('input[name="revision_number"]')?.value || '';
    const dateEffective = document.querySelector('input[name="date_effective"]')?.value || '';
    const approvedBy = document.querySelector('input[name="approved_by"]')?.value || '';
    const documentType = document.querySelector('.document_type')?.textContent?.trim() || 'FM-DPM-SMCC-CES-05A';

    const originalTitle = document.title;
    document.title = 'Monthly_Accomplishment_Report_Narrative_Report';

    try {
        const iframe = createPrintIframe();
        const doc = iframe.contentDocument || iframe.contentWindow.document;

        const headerHTML = buildPrintHeaderHtml();
        const footerHTML = buildPrintFooterHtml();

        const bodyHTML = buildNarrativeBodyHtml({
            narrateSuccess,
            provideData,
            identifyProblems,
            proposeSolutions,
            cesHead,
            vpAcad,
            vpAdmin,
            schoolPresident,
            issueStatus,
            revisionNumber,
            dateEffective,
            approvedBy,
            documentType
        });

        doc.open();
        doc.write(`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Monthly Accomplishment Report - Narrative Report</title>
<meta name="viewport" content="width=device-width,initial-scale=1">

<style>
* {
    box-sizing: border-box;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
}

@page {
    size: A4 portrait;
    margin: 12mm 10mm 12mm 10mm;
}

html,
body {
    margin: 0 !important;
    padding: 0 !important;
    width: 100%;
    background: #fff !important;
    color: #000 !important;
    font-family: "Calibri Light", Calibri, Arial, sans-serif !important;
    font-size: 10pt !important;
    line-height: 1.35;
    overflow: visible !important;
}

#print-container {
    width: 100%;
    margin: 0 !important;
    padding: 0 !important;
    background: #fff !important;
}

.print-shell {
    width: 100%;
    border-collapse: collapse !important;
    border-spacing: 0 !important;
    table-layout: fixed !important;
    border: none !important;
    background: #fff !important;
}

.print-shell thead {
    display: table-header-group;
}

.print-shell tfoot {
    display: table-footer-group;
}

.print-shell tbody {
    display: table-row-group;
}

.print-shell > thead > tr,
.print-shell > tbody > tr,
.print-shell > tfoot > tr,
.print-shell > thead > tr > td,
.print-shell > tbody > tr > td,
.print-shell > tfoot > tr > td {
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    vertical-align: top !important;
    background: #fff !important;
}

.print-header {
    padding: 0 0 8px 0 !important;
}

.print-footer {
    padding: 8px 0 0 0 !important;
}

.print-body,
.print-content {
    width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    background: #fff !important;
    border: none !important;
    box-shadow: none !important;
}

/* ===== HEADER ===== */
.print-page-header {
    margin: 0 !important;
    padding: 0 !important;
}

.header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    gap: 10px;
    margin: 0 0 4px 0 !important;
    padding: 0 !important;
}

.logo-left {
    height: 56px;
    width: auto;
    display: block;
}

.logos-right {
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: flex-end;
}

.logos-right img {
    height: 48px;
    width: auto;
    display: block;
}

.college-info {
    text-align: center;
    flex: 1;
    padding: 0 6px;
}

.college-info h1 {
    font-family: "Times New Roman", Times, serif !important;
    color: #4f81bd !important;
    font-size: 18px !important;
    margin: 0;
    font-weight: normal;
    line-height: 1.05;
}

.college-info p {
    font-family: Arial, sans-serif !important;
    font-size: 10px !important;
    margin: 1px 0;
    color: #333 !important;
    line-height: 1.1;
}

.college-info a {
    font-family: Arial, sans-serif !important;
    font-size: 10px !important;
    color: #0000EE !important;
    text-decoration: underline;
}

.office-title {
    font-family: Arial, sans-serif !important;
    text-align: center;
    font-size: 14px !important;
    color: #595959 !important;
    font-weight: bold;
    margin: 1px 0;
    letter-spacing: 0.2px;
    text-transform: uppercase;
}

.double-line {
    border-top: 3px double #4f81bd !important;
    margin: 0 0 8px 0 !important;
}

/* ===== MAIN CONTENT ===== */
.report-container {
    width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    background: #fff !important;
    font-family: "Calibri Light", Calibri, Arial, sans-serif !important;
    font-size: 10pt !important;
}

.main-title {
    font-family: "Century Gothic", Arial, sans-serif !important;
    font-size: 13pt !important;
    font-weight: normal !important;
    text-align: center !important;
    text-transform: uppercase !important;
    color: #000 !important;
    margin: 0 0 28px 0 !important;
}

.report-list {
    list-style-type: upper-roman;
    padding-left: 40px;
    margin: 0;
    font-family: "Calibri Light", Calibri, Arial, sans-serif !important;
    font-size: 10pt !important;
}

.report-list li {
    margin-bottom: 30px;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
}

.label {
    display: block;
    font-family: "Calibri Light", Calibri, Arial, sans-serif !important;
    font-size: 10pt !important;
    font-weight: bold !important;
    margin-bottom: 5px;
    color: #000 !important;
}

.line-input {
    width: 100%;
    border: none !important;
    background: #fff !important;
    font-family: "Calibri Light", Calibri, Arial, sans-serif !important;
    font-size: 10pt !important;
    padding: 0;
    line-height: 1.5;
    white-space: pre-wrap;
    word-break: break-word;
    overflow-wrap: anywhere;
    min-height: 60px;
    color: #000 !important;
}

/* ===== APPROVAL SECTION - NO DUPLICATE APPROVED BY ===== */
.approvals {
    display: flex !important;
    flex-direction: column !important;
    gap: 35px !important;
    margin-top: 50px !important;
    width: 100% !important;
    font-family: "Calibri Light", Calibri, Arial, sans-serif !important;
    font-size: 10pt !important;
    color: #000 !important;
}

.approval-section {
    width: 100% !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
}

.approval-section .label {
    display: block !important;
    font-family: "Calibri Light", Calibri, Arial, sans-serif !important;
    font-size: 10pt !important;
    font-weight: normal !important;
    margin-bottom: 5px !important;
    text-align: left !important;
}

/* hide duplicate approved blocks if browser duplicates print nodes */
#print_approvals .approved-print-section ~ .approved-print-section,
#print_approvals .approval-section.approved-print-section ~ .approval-section.approved-print-section {
    display: none !important;
}

/* Prepared by */
.ces-head-block {
    width: 200px !important;
    text-align: left !important;
}

.ces-head-block .name {
    display: block !important;
    width: 200px !important;
    border-bottom: 1px solid #000 !important;
    font-size: 10pt !important;
    font-weight: normal !important;
    text-transform: uppercase !important;
    min-height: 16px !important;
    line-height: 16px !important;
    text-align: left !important;
}

.ces-head-block .ces-head {
    display: block !important;
    font-size: 10pt !important;
    font-weight: bold !important;
    text-align: left !important;
    margin-top: 1px !important;
}

/* Center signatures */
.signature-block {
    width: 340px !important;
    margin-left: auto !important;
    margin-right: auto !important;
    text-align: center !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
}

.signature-block .name {
    display: block !important;
    width: 100% !important;
    border-bottom: 1px solid #000 !important;
    font-size: 10pt !important;
    font-weight: normal !important;
    text-transform: uppercase !important;
    text-align: center !important;
    min-height: 16px !important;
    line-height: 16px !important;
}

.signature-block .title {
    display: block !important;
    font-size: 9pt !important;
    font-weight: normal !important;
    text-align: center !important;
    margin-top: 1px !important;
}

/* sample-like spacing */
.approval-section:nth-child(2) .label {
    margin-bottom: 55px !important;
}

.approval-section:nth-child(2) .signature-block + .signature-block {
    margin-top: 40px !important;
}

.approval-section.approved-print-section {
    margin-top: -8px !important;
}

.approval-section.approved-print-section .label {
    margin-bottom: 55px !important;
}

/* ===== DOCUMENT INFO ===== */
.document-info {
    margin-top: 50px !important;
    width: 305px !important;
    max-width: 305px !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
}

.doc-header {
    width: 100% !important;
    border-collapse: collapse !important;
    font-family: Arial, sans-serif !important;
    font-size: 11px !important;
    border: 1px solid #d1d1d1 !important;
    table-layout: fixed !important;
}

.doc-header td {
    border: 1px solid #d1d1d1 !important;
    vertical-align: middle;
}

.doc-header td.label {
    background-color: #002060 !important;
    color: #fff !important;
    font-weight: bold !important;
    text-align: left !important;
    white-space: nowrap !important;
    width: 100px !important;
    font-size: 11px !important;
    padding: 6px 8px !important;
    font-family: Arial, sans-serif !important;
    display: table-cell !important;
}

.doc-header td.colon {
    width: 14px !important;
    padding: 0 1px !important;
    font-weight: bold !important;
    text-align: center !important;
    background: #fff !important;
    color: #000 !important;
}

.doc-header td.value {
    padding: 6px 10px !important;
    min-width: 190px !important;
    text-align: left !important;
    background: #fff !important;
    color: #000 !important;
    white-space: nowrap !important;
}

/* ===== FOOTER ===== */
.print-footer-inner {
    width: 100%;
    margin: 0 !important;
    padding: 0 !important;
    background: #fff !important;
}

.print-footer-logo {
    display: block;
    width: 100%;
    max-width: 100%;
    height: auto;
    max-height: 26px;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    object-fit: contain;
}

img {
    max-width: 100%;
    height: auto;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
}

@media print {
    html,
    body {
        margin: 0 !important;
        padding: 0 !important;
        background: white !important;
    }
}
</style>
</head>

<body>
<div id="print-container">
    <table class="print-shell" role="presentation">
        <thead>
            <tr>
                <td>
                    <div class="print-header">${headerHTML}</div>
                </td>
            </tr>
        </thead>

        <tfoot>
            <tr>
                <td>
                    <div class="print-footer">${footerHTML}</div>
                </td>
            </tr>
        </tfoot>

        <tbody>
            <tr>
                <td>
                    <div class="print-body">
                        <div class="print-content">
                            ${bodyHTML}
                        </div>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
</div>
</body>
</html>
        `);

        doc.close();

        removeDuplicateApprovedSections(doc);

        await waitForImages(doc);
        await waitForFonts(doc);

        await nextFrame(iframe.contentWindow);
        await nextFrame(iframe.contentWindow);

        removeDuplicateApprovedSections(doc);

        await runPrintAndCleanup(iframe);
    } catch (error) {
        console.error('Print failed:', error);
        alert('Printing failed. Please try again.');
    } finally {
        document.title = originalTitle;
    }
}

function buildNarrativeBodyHtml(data) {
    return `
        <div class="report-container">
            <h1 class="main-title">MONTHLY ACCOMPLISHMENT REPORT- NARRATIVE REPORT</h1>

            <form id="narrativeForm">
                <ol class="report-list">
                    <li>
                        <label class="label">Narrate Success</label>
                        <div class="line-input">${escapeHtml(data.narrateSuccess)}</div>
                    </li>
                    <li>
                        <label class="label">Provide Data</label>
                        <div class="line-input">${escapeHtml(data.provideData)}</div>
                    </li>
                    <li>
                        <label class="label">Identify Problems</label>
                        <div class="line-input">${escapeHtml(data.identifyProblems)}</div>
                    </li>
                    <li>
                        <label class="label">Propose Solutions</label>
                        <div class="line-input">${escapeHtml(data.proposeSolutions)}</div>
                    </li>
                </ol>
            </form>
        </div>

        <section class="approvals" id="print_approvals">
            <div class="approval-section">
                <div class="label">Prepared by:</div>
                <div class="ces-head-block">
                    <div class="name">${escapeHtml(data.cesHead)}</div>
                    <span class="ces-head"><strong>CES Head</strong></span>
                </div>
            </div>

            <div class="approval-section">
                <div class="label">Recommending Approval:</div>

                <div class="signature-block">
                    <span class="name">${escapeHtml(data.vpAcad)}</span>
                    <span class="title">Vice-President for Academic Affairs and Research</span>
                </div>

                <div class="signature-block" style="margin-top: 40px;">
                    <span class="name">${escapeHtml(data.vpAdmin)}</span>
                    <span class="title">Vice-President for Administrative Affairs</span>
                </div>
            </div>

            <div class="approval-section approved-print-section">
                <div class="label">Approved by:</div>

                <div class="signature-block">
                    <span class="name">${escapeHtml(data.schoolPresident)}</span>
                    <span class="title">School President</span>
                </div>
            </div>
        </section>

        <section class="document-info">
            <table class="doc-header">
                <tr>
                    <td class="label">Form Code No.</td>
                    <td class="colon">:</td>
                    <td class="value">${escapeHtml(data.documentType)}</td>
                </tr>
                <tr>
                    <td class="label">Issue Status</td>
                    <td class="colon">:</td>
                    <td class="value">${escapeHtml(data.issueStatus)}</td>
                </tr>
                <tr>
                    <td class="label">Revision No.</td>
                    <td class="colon">:</td>
                    <td class="value">${escapeHtml(data.revisionNumber)}</td>
                </tr>
                <tr>
                    <td class="label">Date Effective</td>
                    <td class="colon">:</td>
                    <td class="value">${escapeHtml(data.dateEffective)}</td>
                </tr>
                <tr>
                    <td class="label">Approved By</td>
                    <td class="colon">:</td>
                    <td class="value">${escapeHtml(data.approvedBy)}</td>
                </tr>
            </table>
        </section>
    `;
}

function removeDuplicateApprovedSections(doc) {
    const approvedSections = Array.from(
        doc.querySelectorAll('#print_approvals .approved-print-section')
    );

    approvedSections.forEach((section, index) => {
        if (index > 0) section.remove();
    });

    const labels = Array.from(doc.querySelectorAll('#print_approvals .approval-section .label'));
    let approvedFound = false;

    labels.forEach(label => {
        if (label.textContent.trim().toLowerCase() === 'approved by:') {
            if (approvedFound) {
                label.closest('.approval-section')?.remove();
            } else {
                approvedFound = true;
            }
        }
    });
}

function buildPrintHeaderHtml() {
    const leftLogo = document.querySelector('.logo-left')?.src ||
        '/SYSTEM_VERSION_!/coordinator/ReportManagement/actions/images/smcclogo.png';

    const rightLogos = Array.from(document.querySelectorAll('.logos-right img'))
        .map(img => img.src)
        .filter(Boolean);

    const officeTitle =
        document.querySelector('.office-title')?.textContent?.trim() ||
        'OFFICE OF THE COMMUNITY EXTENSION SERVICES';

    const collegeInfoNode = document.querySelector('.college-info');

    const collegeInfoHtml = collegeInfoNode
        ? collegeInfoNode.innerHTML
        : `
            <h1>Saint Michael College of Caraga</h1>
            <p>Brgy. 4, Nasipit, Agusan del Norte, Philippines</p>
            <p>District 8, Brgy. Triangulo, Nasipit, Agusan del Norte, Philippines</p>
            <p>Tel Nos. +63 085 343-3251 / +63 085 283-3113</p>
            <p><a href="http://www.smccnasipit.edu.ph">www.smccnasipit.edu.ph</a></p>
        `;

    const rightLogoHtml = rightLogos.length
        ? rightLogos.map(src => `<img src="${escapeHtml(src)}" alt="Logo">`).join('')
        : `<img src="/SYSTEM_VERSION_!/coordinator/ReportManagement/actions/images/ISOlogo.png" alt="SOCOTEC Logo">`;

    return `
        <div class="print-page-header">
            <div class="header-content">
                <img src="${escapeHtml(leftLogo)}" alt="SMCC Logo" class="logo-left">
                <div class="college-info">${collegeInfoHtml}</div>
                <div class="logos-right">${rightLogoHtml}</div>
            </div>
            <div class="office-title">${escapeHtml(officeTitle)}</div>
            <div class="double-line"></div>
        </div>
    `;
}

function buildPrintFooterHtml() {
    const footerImg =
        document.querySelector('.footer-bottom img')?.src ||
        document.querySelector('.footer-logos img')?.src ||
        document.querySelector('footer img')?.src ||
        '';

    return `
        <div class="print-footer-inner">
            ${footerImg ? `<img src="${escapeHtml(footerImg)}" alt="Footer Logo" class="print-footer-logo">` : '&nbsp;'}
        </div>
    `;
}

function createPrintIframe() {
    const iframe = document.createElement('iframe');
    iframe.setAttribute('aria-hidden', 'true');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.style.opacity = '0';
    iframe.style.pointerEvents = 'none';
    document.body.appendChild(iframe);
    return iframe;
}

function waitForImages(docOrRoot) {
    const root = docOrRoot.querySelectorAll ? docOrRoot : docOrRoot.documentElement;
    const images = Array.from(root.querySelectorAll('img'));

    if (!images.length) return Promise.resolve();

    return Promise.all(
        images.map(img => {
            if (img.complete && img.naturalWidth > 0) return Promise.resolve();

            return new Promise(resolve => {
                const done = () => {
                    img.removeEventListener('load', done);
                    img.removeEventListener('error', done);
                    resolve();
                };

                img.addEventListener('load', done, { once: true });
                img.addEventListener('error', done, { once: true });
                setTimeout(done, 3000);
            });
        })
    );
}

async function waitForFonts(doc) {
    try {
        if (doc.fonts && doc.fonts.ready) {
            await doc.fonts.ready;
        }
    } catch (_) {}
}

function nextFrame(win) {
    return new Promise(resolve => win.requestAnimationFrame(() => resolve()));
}

function runPrintAndCleanup(iframe) {
    return new Promise(resolve => {
        const win = iframe.contentWindow;
        let cleaned = false;

        const cleanup = () => {
            if (cleaned) return;
            cleaned = true;

            try {
                win.onafterprint = null;
            } catch (_) {}

            setTimeout(() => {
                if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
                resolve();
            }, 150);
        };

        win.onafterprint = cleanup;
        setTimeout(cleanup, 5000);

        win.focus();
        win.print();
    });
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

window.printReport = printReport;