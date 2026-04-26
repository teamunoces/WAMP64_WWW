async function printReport() {
    const contentBody = document.querySelector('.content-body');
    const reportForm = document.querySelector('form.report-form');

    if (!contentBody || !reportForm) {
        alert('Unable to print: report content not found.');
        return;
    }

    const printButton =
        document.querySelector('#print-button') ||
        document.querySelector('#downloadPDF') ||
        document.querySelector('[data-print-report]');

    const originalButtonText = printButton ? printButton.textContent : '';
    const originalButtonDisabled = printButton ? printButton.disabled : false;

    if (printButton) {
        printButton.textContent = 'Preparing print...';
        printButton.disabled = true;
    }

    try {
        const clonedContent = contentBody.cloneNode(true);

        syncFormValues(contentBody, clonedContent);
        removeNonPrintable(clonedContent);
        fixApprovalSection(clonedContent);

        const iframe = createPrintIframe();
        const doc = iframe.contentDocument || iframe.contentWindow.document;

        const leftLogoSrc = document.querySelector('.logo-left')?.src || '';
        const rightLogoSrc = document.querySelector('.logos-right img')?.src || '';
        const footerLogoSrc =
            document.querySelector('.footer-bottom img')?.src ||
            '../../images/footerlogo.png';

        doc.open();
        doc.write(`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Print Report</title>

<style>
* {
    box-sizing: border-box;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
}

@page {
    size: A4 portrait;
    margin: 12mm 12mm 12mm 12mm;
}

html,
body {
    margin: 0;
    padding: 0;
    background: #fff;
    color: #000;
    font-family: "Calibri Light", Calibri, Arial, sans-serif;
    font-size: 10pt;
    line-height: 1.35;
}

.print-root,
.print-main,
.print-content {
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
    background: #fff !important;
}

.print-root {
    width: 100%;
}

table.print-layout {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    table-layout: fixed;
    border: none !important;
}

.print-layout thead {
    display: table-header-group;
}

.print-layout tfoot {
    display: table-footer-group;
}

.print-layout tbody {
    display: table-row-group;
}

.print-layout tr,
.print-layout td,
.print-layout th {
    border: none !important;
    padding: 0;
    vertical-align: top;
}

.print-header-wrap {
    padding: 0 0 14px 0;
    background: #fff;
}

.print-footer-wrap {
    padding: 12px 0 0 0;
    background: #fff;
}

/* ===== HEADER ===== */
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
    display: block;
}

.logos-right {
    display: flex;
    gap: 20px;
    align-items: center;
}

.logos-right img {
    padding-right: 10px;
    height: 80px;
    width: auto;
    display: block;
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
    margin-bottom: 0;
}

/* ===== FOOTER ===== */
.print-footer-inner {
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    width: 100%;
    padding-bottom: 5px;
}

.print-footer-logo {
    height: 40px;
    width: auto;
    display: block;
}

/* ===== MAIN CONTENT ===== */
.print-main,
.print-content {
    width: 100%;
    max-width: 100%;
    overflow: visible !important;
}

.print-content,
.print-content * {
    max-width: 100%;
}

#headerFrame,
#sidebarFrame,
.buttons,
.admin-comment,
#admincomment,
.no-print,
.print-hide,
[data-no-print="true"],
button,
script,
noscript {
    display: none !important;
}

.print-content > footer,
.print-content .footer-bottom {
    display: none !important;
}

header h1,
#header h1 {
    text-align: center;
    text-transform: uppercase;
    font-family: "Century Gothic", Arial, sans-serif !important;
    font-size: 13pt !important;
    font-weight: normal !important;
    color: #000;
    margin-bottom: 30px;
    border-bottom: none !important;
    padding-bottom: 10px;
}

.form-section {
    margin-bottom: 30px;
}

.input-group {
    margin-bottom: 20px;
}

.input-group label {
    display: block;
    font-weight: bold;
    margin-bottom: 8px;
    color: #000;
}

.printable-field {
    display: block;
    width: 100%;
    min-height: 1em;
    white-space: pre-wrap;
    word-break: break-word;
    overflow-wrap: anywhere;
    color: #000;
    font-size: 10pt;
    line-height: 1.45;
    border: none !important;
    outline: none !important;
    box-shadow: none !important;
    background: transparent !important;
}

.printable-paper-lines {
    width: 100%;
    border: none !important;
    outline: none !important;
    overflow: hidden;
    font-family: "Calibri Light", Calibri, Arial, sans-serif;
    font-size: 10pt;
    line-height: 24px;
    background-image: linear-gradient(transparent 23px, #000 24px) !important;
    background-size: 100% 24px !important;
    background-attachment: local;
    display: block;
    padding: 5px;
    box-sizing: border-box;
    white-space: pre-wrap;
    word-break: break-word;
    overflow-wrap: anywhere;
    min-height: 48px;
    box-shadow: none !important;
}

.table-section {
    margin: 40px 0;
    width: 100%;
}

.table-wrapper {
    overflow-x: visible !important;
    background: #fff;
    border: none !important;
    margin-bottom: 30px;
    width: 100%;
}

table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
    page-break-inside: auto;
    break-inside: auto;
    border: none;
}

thead {
    display: table-header-group;
}

tfoot {
    display: table-footer-group;
}

tr {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
}

/* ===== PROGRAM PLAN TABLE ===== */
#programPlanTable {
    width: 100%;
    border-collapse: collapse !important;
    table-layout: fixed !important;
    border: 1px solid #cbd5e1 !important;
}

#programPlanTable thead th {
    border: 1px solid #cbd5e1 !important;
    background-color: #e2e8f0 !important;
    color: #334155 !important;
    font-weight: bold;
    font-size: 0.85rem;
    text-align: center;
    padding: 10px 6px;
    text-transform: uppercase;
    word-wrap: break-word;
}

#programPlanTable td {
    border: 1px solid #cbd5e1 !important;
    vertical-align: top;
    padding: 0;
}

#programPlanTable td .printable-field,
#programPlanTable td .printable-paper-lines {
    padding: 10px 8px !important;
    font-size: 0.85rem;
    line-height: 1.4;
    color: #1e293b;
    width: 100%;
    min-height: 60px;
    display: block;
    box-sizing: border-box;
    margin: 0;
    background-color: transparent !important;
}

/* ===== APPROVAL SECTION - FIXED NEW STYLE ===== */
.approvals {
    display: flex !important;
    flex-direction: column !important;
    gap: 35px !important;
    margin-top: 50px !important;
    width: 100% !important;
    font-family: "Calibri Light", Calibri, Arial, sans-serif !important;
    font-size: 10pt !important;
    color: #000 !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
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
    color: #000 !important;
}

.ces-head-block {
    width: 200px !important;
    text-align: left !important;
}

.ces-head-block .name,
.ces-head-block #ces_head {
    display: block !important;
    width: 200px !important;
    border-bottom: 1px solid #000 !important;
    font-family: "Calibri Light", Calibri, Arial, sans-serif !important;
    font-size: 10pt !important;
    font-weight: normal !important;
    text-transform: uppercase !important;
    min-height: 16px !important;
    line-height: 16px !important;
    text-align: left !important;
}

.ces-head-block .ces-head {
    display: block !important;
    font-family: "Calibri Light", Calibri, Arial, sans-serif !important;
    font-size: 10pt !important;
    font-weight: bold !important;
    text-align: left !important;
    margin-top: 1px !important;
}

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
    font-family: "Calibri Light", Calibri, Arial, sans-serif !important;
    font-size: 10pt !important;
    font-weight: normal !important;
    text-transform: uppercase !important;
    text-align: center !important;
    min-height: 16px !important;
    line-height: 16px !important;
}

.signature-block .title {
    display: block !important;
    font-family: "Calibri Light", Calibri, Arial, sans-serif !important;
    font-size: 9pt !important;
    font-weight: normal !important;
    text-align: center !important;
    margin-top: 1px !important;
}

.approval-section:nth-child(2) .label,
.approval-section:nth-child(3) .label {
    margin-bottom: 55px !important;
}

.approval-section:nth-child(2) .signature-block + .signature-block {
    margin-top: 40px !important;
}

.approval-section:nth-child(3) {
    margin-top: -8px !important;
}

/* Hide old approval layout if it exists inside cloned content */
.approvals-container,
.approval-row,
.signature-group,
.approval-centered,
.admin-block,
.name-underlined,
.signature-line {
    display: none !important;
}

/* ===== DOCUMENT INFO ===== */
.document-info {
    margin-top: 50px;
    width: 30%;
}

.doc-header {
    border-collapse: collapse;
    font-family: Arial, sans-serif;
    font-size: 11px;
    border: none !important;
    width: auto;
    margin-right: auto;
    table-layout: auto !important;
}

.doc-header td {
    padding: 5px 10px;
}

.doc-header td.label {
    background-color: #002060 !important;
    color: #fff !important;
    font-weight: bold;
    padding: 4px 8px;
    border: 1px solid #d1d1d1 !important;
    text-align: left;
    white-space: nowrap;
    width: 100px;
}

.doc-header td:nth-child(2) {
    width: 2%;
    padding: 0 1px;
    font-weight: bold;
    border-top: 1px solid #d1d1d1 !important;
    border-bottom: 1px solid #d1d1d1 !important;
}

.doc-header td.value {
    padding: 4px 10px;
    border: 1px solid #d1d1d1 !important;
    min-width: 120px;
}

.doc-header td.value .printable-field,
.doc-header td.value input,
.doc-header td.value p {
    border: none !important;
    background: transparent !important;
    font-family: inherit;
    font-size: inherit;
    color: #333;
    margin: 0;
    padding: 0;
    width: 100%;
    min-height: auto;
    line-height: inherit;
}

@media print {
    html,
    body {
        margin: 0 !important;
        padding: 0 !important;
        background: #fff !important;
    }
}
</style>
</head>

<body>
    <div class="print-root">
        <table class="print-layout" role="presentation">
            <thead>
                <tr>
                    <td>
                        <div class="print-header-wrap">
                            <div class="header-content">
                                ${leftLogoSrc ? `<img src="${escapeHtml(leftLogoSrc)}" alt="SMCC Logo" class="logo-left">` : ''}
                                <div class="college-info">
                                    <h1>Saint Michael College of Caraga</h1>
                                    <p>Brgy. 4, Nasipit, Agusan del Norte, Philippines</p>
                                    <p>District 8, Brgy. Triangulo, Nasipit, Agusan del Norte, Philippines</p>
                                    <p>Tel Nos. +63 085 343-3251 / +63 085 283-3113</p>
                                    <a href="http://www.smccnasipit.edu.ph">www.smccnasipit.edu.ph</a>
                                </div>
                                <div class="logos-right">
                                    ${rightLogoSrc ? `<img src="${escapeHtml(rightLogoSrc)}" alt="SOCOTEC Logo">` : ''}
                                </div>
                            </div>
                            <h2 class="office-title">OFFICE OF THE COMMUNITY EXTENSION SERVICES</h2>
                            <div class="double-line"></div>
                        </div>
                    </td>
                </tr>
            </thead>

            <tfoot>
                <tr>
                    <td>
                        <div class="print-footer-wrap">
                            <div class="print-footer-inner">
                                ${footerLogoSrc ? `<img src="${escapeHtml(footerLogoSrc)}" alt="Org Logo" class="print-footer-logo">` : ''}
                            </div>
                        </div>
                    </td>
                </tr>
            </tfoot>

            <tbody>
                <tr>
                    <td>
                        <main class="print-main">
                            <div class="print-content" id="printContent"></div>
                        </main>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</body>
</html>
        `);

        doc.close();

        const printContent = doc.getElementById('printContent');
        printContent.appendChild(clonedContent);

        convertFormControlsToPrintable(printContent);

        await waitForImages(doc);
        await nextFrame(iframe.contentWindow);
        await nextFrame(iframe.contentWindow);

        await printIframeAndCleanup(iframe, printButton, {
            originalButtonText,
            originalButtonDisabled
        });

    } catch (error) {
        console.error('Print error:', error);
        alert('Printing failed. Please try again.');

        if (printButton) {
            printButton.textContent = originalButtonText;
            printButton.disabled = originalButtonDisabled;
        }
    }
}

function fixApprovalSection(root) {
    const existingApproval =
        root.querySelector('.approvals') ||
        root.querySelector('.approvals-container');

    if (!existingApproval) return;

    const cesHead =
        document.getElementById('ces_head')?.textContent?.trim() ||
        root.querySelector('#ces_head')?.textContent?.trim() ||
        '';

    const vpAcad =
        document.getElementById('vp_acad')?.textContent?.trim() ||
        root.querySelector('#vp_acad')?.textContent?.trim() ||
        '';

    const vpAdmin =
        document.getElementById('vp_admin')?.textContent?.trim() ||
        root.querySelector('#vp_admin')?.textContent?.trim() ||
        '';

    const schoolPresident =
        document.getElementById('school_president')?.textContent?.trim() ||
        root.querySelector('#school_president')?.textContent?.trim() ||
        '';

    const newApproval = document.createElement('section');
    newApproval.className = 'approvals';
    newApproval.innerHTML = `
        <div class="approval-section">
            <div class="label">Prepared by:</div>
            <div class="ces-head-block">
                <div id="ces_head" class="name">${escapeHtml(cesHead)}</div>
                <span class="ces-head"><strong>CES Head</strong></span>
            </div>
        </div>

        <div class="approval-section">
            <div class="label">Recommending Approval:</div>
            <div class="signature-block">
                <span id="vp_acad" class="name">${escapeHtml(vpAcad)}</span>
                <span class="title">Vice-President for Academic Affairs and Research</span>
            </div>

            <div class="signature-block" style="margin-top: 40px;">
                <span id="vp_admin" class="name">${escapeHtml(vpAdmin)}</span>
                <span class="title">Vice-President for Administrative Affairs</span>
            </div>
        </div>

        <div class="approval-section">
            <div class="label">Approved by:</div>
            <div class="signature-block">
                <span id="school_president" class="name">${escapeHtml(schoolPresident)}</span>
                <span class="title">School President</span>
            </div>
        </div>
    `;

    existingApproval.replaceWith(newApproval);
}

function createPrintIframe() {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.style.opacity = '0';
    iframe.style.pointerEvents = 'none';
    iframe.setAttribute('aria-hidden', 'true');
    document.body.appendChild(iframe);
    return iframe;
}

function syncFormValues(sourceRoot, clonedRoot) {
    const sourceFields = sourceRoot.querySelectorAll('input, textarea, select');
    const clonedFields = clonedRoot.querySelectorAll('input, textarea, select');

    sourceFields.forEach((sourceField, index) => {
        const clonedField = clonedFields[index];
        if (!clonedField) return;

        const tag = sourceField.tagName.toLowerCase();

        if (tag === 'textarea') {
            clonedField.value = sourceField.value;
            clonedField.textContent = sourceField.value;
            return;
        }

        if (tag === 'select') {
            clonedField.value = sourceField.value;
            Array.from(clonedField.options).forEach(opt => {
                opt.selected = opt.value === sourceField.value;
            });
            return;
        }

        if (tag === 'input') {
            const type = (sourceField.type || '').toLowerCase();

            if (type === 'checkbox' || type === 'radio') {
                clonedField.checked = sourceField.checked;
                if (sourceField.checked) clonedField.setAttribute('checked', 'checked');
                else clonedField.removeAttribute('checked');
            } else {
                clonedField.value = sourceField.value;
                clonedField.setAttribute('value', sourceField.value);
            }
        }
    });
}

function removeNonPrintable(root) {
    const selectors = [
        '#headerFrame',
        '#sidebarFrame',
        '.buttons',
        '.admin-comment',
        '#admincomment',
        '.no-print',
        '.print-hide',
        '[data-no-print="true"]',
        'button',
        'script',
        'noscript'
    ];

    selectors.forEach(selector => {
        root.querySelectorAll(selector).forEach(el => el.remove());
    });
}

function convertFormControlsToPrintable(root) {
    if (!root) return;

    const fields = root.querySelectorAll('input, textarea, select');

    fields.forEach(field => {
        const tag = field.tagName.toLowerCase();
        const replacement = document.createElement('div');

        const hasPaperLines =
            field.classList.contains('paper-lines') ||
            field.closest('.paper-lines') !== null;

        if (tag === 'textarea') {
            replacement.className = hasPaperLines ? 'printable-paper-lines' : 'printable-field';
            replacement.textContent = field.value || '';
            field.replaceWith(replacement);
            return;
        }

        if (tag === 'select') {
            replacement.className = 'printable-field';
            const selectedText =
                field.options[field.selectedIndex]
                    ? field.options[field.selectedIndex].text
                    : (field.value || '');
            replacement.textContent = selectedText;
            field.replaceWith(replacement);
            return;
        }

        if (tag === 'input') {
            const type = (field.type || 'text').toLowerCase();

            if (['hidden', 'button', 'submit', 'reset', 'file'].includes(type)) {
                field.remove();
                return;
            }

            replacement.className = 'printable-field';

            if (type === 'checkbox') {
                replacement.textContent = field.checked ? '✓ Checked' : '□ Unchecked';
                field.replaceWith(replacement);
                return;
            }

            if (type === 'radio') {
                replacement.textContent = field.checked ? '◉ Selected' : '○';
                field.replaceWith(replacement);
                return;
            }

            replacement.textContent = field.value || '';
            field.replaceWith(replacement);
        }
    });
}

function waitForImages(doc) {
    const images = Array.from(doc.images || []);
    if (!images.length) return Promise.resolve();

    return Promise.all(
        images.map(img => {
            if (img.complete && img.naturalWidth > 0) {
                return Promise.resolve();
            }

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

function nextFrame(win) {
    return new Promise(resolve => win.requestAnimationFrame(() => resolve()));
}

function printIframeAndCleanup(iframe, printButton, state) {
    return new Promise(resolve => {
        const win = iframe.contentWindow;
        let cleaned = false;

        const cleanup = () => {
            if (cleaned) return;
            cleaned = true;

            try {
                win.onafterprint = null;
            } catch (e) {}

            setTimeout(() => {
                if (iframe.parentNode) iframe.parentNode.removeChild(iframe);

                if (printButton) {
                    printButton.textContent = state.originalButtonText;
                    printButton.disabled = state.originalButtonDisabled;
                }

                resolve();
            }, 200);
        };

        win.onafterprint = cleanup;
        setTimeout(cleanup, 5000);

        win.focus();
        win.print();
    });
}

function escapeHtml(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}