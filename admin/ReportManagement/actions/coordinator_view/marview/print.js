/**
 * print.js - Monthly Accomplishment Report
 * Uses a print table shell so header/footer repeat without overlapping #main_content.
 */

async function printReport() {
    const mainContent = document.querySelector('#main_content');

    if (!mainContent) {
        alert('Unable to print: report content not found.');
        return;
    }

    const originalTitle = document.title;
    document.title = 'Monthly_Accomplishment_Report';

    try {
        const printFrame = createPrintIframe();
        const printDoc = printFrame.contentDocument || printFrame.contentWindow.document;

        const headerHTML = buildPrintHeaderHtml();
        const footerHTML = buildPrintFooterHtml();
        const printableBody = buildPrintableBody(mainContent);

        printDoc.open();
        printDoc.write(`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Monthly_Accomplishment_Report</title>
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

    html, body {
        margin: 0 !important;
        padding: 0 !important;
        width: 100%;
        background: #fff !important;
        color: #1a202c;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif;
        font-size: 11px;
        line-height: 1.35;
        overflow: visible !important;
    }

    body {
        background: #fff !important;
    }

    #print-container {
        display: block !important;
        width: 100%;
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
        outline: none !important;
        background: #fff !important;
    }

    .print-shell {
        width: 100%;
        margin: 0 !important;
        padding: 0 !important;
        border-collapse: collapse !important;
        border-spacing: 0 !important;
        table-layout: fixed !important;
        border: none !important;
        outline: none !important;
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
        outline: none !important;
        vertical-align: top !important;
        background: #fff !important;
    }

    .print-header,
    .print-footer,
    .print-body {
        width: 100%;
        margin: 0 !important;
        background: #fff !important;
        border: none !important;
        outline: none !important;
        box-shadow: none !important;
    }

    .print-header {
        padding: 0 0 8px 0 !important;
    }

    .print-footer {
        padding: 8px 0 0 0 !important;
    }

    .print-body {
        padding: 0 !important;
        margin: 0 !important;
    }

    .print-content,
    .print-content * {
        max-width: 100%;
    }

    .print-content {
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
        outline: none !important;
        box-shadow: none !important;
        background: #fff !important;
        overflow: visible !important;
    }

    .print-body-wrapper,
    #main_content,
    .print-approval-section,
    .print-document-info-section {
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
        box-shadow: none !important;
        background: transparent !important;
        overflow: visible !important;
    }

    #printContent,
    #printContent > .print-body-wrapper,
    #printContent > .print-body-wrapper > #main_content,
    #main_content,
    #main_content > *:first-child,
    .print-body-wrapper > *:first-child,
    .print-body-wrapper > *:first-child *:first-child {
        margin-top: 0 !important;
        padding-top: 0 !important;
    }

    #headerFrame,
    #sidebarFrame,
    .buttons,
    #downloadPDF,
    .admin-comment,
    .no-print,
    .print-hide,
    .action-buttons,
    .wrapper,
    [data-no-print="true"],
    button,
    script,
    noscript {
        display: none !important;
    }

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
        flex-wrap: nowrap;
        margin: 0 0 4px 0 !important;
        padding: 0 !important;
    }

    .logo-left {
        height: 56px;
        width: auto;
        display: block;
        flex: 0 0 auto;
    }

    .logos-right {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 8px;
        flex: 0 0 auto;
    }

    .logos-right img {
        height: 48px;
        width: auto;
        display: block;
    }

    .college-info {
        flex: 1 1 auto;
        text-align: center;
        padding: 0 6px;
    }

    .college-info h1 {
        margin: 0;
        font-family: "Times New Roman", Times, serif;
        font-size: 18px;
        line-height: 1.05;
        font-weight: normal;
        color: #4f81bd !important;
    }

    .college-info p {
        margin: 1px 0;
        font-size: 10px;
        line-height: 1.1;
        color: #333 !important;
    }

    .college-info a {
        font-size: 10px;
        color: #0000EE !important;
        text-decoration: underline;
        word-break: break-all;
    }

    .office-title {
        text-align: center;
        font-size: 14px;
        font-weight: bold;
        color: #595959 !important;
        margin: 1px 0;
        text-transform: uppercase;
        letter-spacing: 0.2px;
    }

    .double-line {
        border-top: 3px double #4f81bd !important;
        margin: 0 0 8px 0 !important;
    }

    .print-footer-inner {
        display: flex;
        align-items: flex-end;
        justify-content: flex-end;
        width: 100%;
        min-height: 24px;
        margin: 0 !important;
        padding: 0 !important;
    }

    .print-footer-logo {
        display: block;
        width: 100%;
        max-width: 100%;
        height: auto;
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
        outline: none !important;
        box-shadow: none !important;
        object-fit: contain;
        page-break-inside: avoid;
        break-inside: avoid;
    }

    header h1,
    #header h1 {
        text-align: center;
        text-transform: uppercase;
        font-size: 1.45rem;
        color: #2c3e50 !important;
        margin: 0 0 10px 0;
        border-bottom: 2px solid #eee;
        padding-bottom: 6px;
    }

    .header-table {
        width: 100% !important;
        border-collapse: collapse !important;
        margin: 0 0 12px 0 !important;
        table-layout: fixed !important;
    }

    .header-table td.label {
        width: 30% !important;
        padding: 6px !important;
        border: 1px solid #000 !important;
        font-weight: bold !important;
        background-color: #ffffff !important;
        word-break: break-word;
    }

    .header-table td.input_cell {
        width: 70% !important;
        padding: 6px !important;
        border: 1px solid #000 !important;
        word-break: break-word;
    }

    .main-table,
    table {
        width: 100% !important;
        max-width: 100% !important;
        border-collapse: collapse !important;
        table-layout: fixed !important;
        page-break-inside: auto;
        break-inside: auto;
    }

    .main-table {
        margin-top: 0 !important;
    }

    .main-table th {
        background-color: #e0e0e0 !important;
        color: #333 !important;
        border: 1px solid #000 !important;
        padding: 6px 4px !important;
        text-align: center;
        font-weight: bold;
        font-size: 10px !important;
        word-break: break-word;
        overflow-wrap: anywhere;
    }

    .main-table td {
        border: 1px solid #000 !important;
        padding: 6px 4px !important;
        vertical-align: top;
        font-size: 10px !important;
        word-break: break-word;
        overflow-wrap: anywhere;
    }

    tr {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        page-break-after: auto;
    }

    thead {
        display: table-header-group;
    }

    tfoot {
        display: table-footer-group;
    }

    .main-table td,
    .main-table th,
    .header-table td,
    .document-info td,
    .doc-header td {
        word-break: break-word !important;
        overflow-wrap: anywhere !important;
        white-space: normal !important;
    }

    .print-approval-section {
        margin-top: 8px !important;
        padding-top: 0 !important;
        page-break-before: auto !important;
        page-break-inside: auto !important;
        break-inside: auto !important;
    }

    .approvals-container {
        page-break-inside: auto !important;
        break-inside: auto !important;
        margin-top: 0 !important;
    }

    .approval-row {
        display: flex !important;
        flex-direction: row !important;
        justify-content: space-between !important;
        align-items: flex-start !important;
        gap: 16px;
        margin: 0 0 14px 0 !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
    }

    .signature-group {
        width: 35% !important;
    }

    .approval-centered {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        margin: 12px 0 0 0 !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
    }

    .admin-block {
        text-align: center !important;
        margin: 12px 0 6px 0 !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
    }

    .signature-line {
        border-bottom: 1.5px solid black !important;
        margin-bottom: 5px !important;
        min-height: 22px !important;
    }

    .name-underlined {
        text-decoration: underline !important;
    }

    .print-document-info-section {
        margin-top: 8px !important;
        width: 100% !important;
        display: block !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        clear: both !important;
    }

    .document-info {
        width: 34% !important;
        max-width: 34% !important;
        margin: 0 !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
    }

    .doc-header {
        width: 100% !important;
        border-collapse: collapse;
        table-layout: fixed !important;
        font-family: Arial, sans-serif;
        font-size: 10px;
        border: none !important;
    }

    .doc-header td.label {
        width: 38% !important;
        padding: 4px 6px !important;
        background-color: #002060 !important;
        color: white !important;
        font-weight: bold !important;
        border: 1px solid #d1d1d1 !important;
        text-align: left !important;
        white-space: nowrap !important;
    }

    .doc-header td:nth-child(2) {
        width: 4% !important;
        padding: 0 1px !important;
        font-weight: bold !important;
        border-top: 1px solid #d1d1d1 !important;
        border-bottom: 1px solid #d1d1d1 !important;
    }

    .doc-header td.value {
        width: 58% !important;
        padding: 4px 8px !important;
        border: 1px solid #d1d1d1 !important;
    }

    .document-info,
    footer,
    img {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
    }

    .printable-field {
        display: block;
        width: 100%;
        min-height: 1em;
        white-space: pre-wrap;
        word-break: break-word;
        overflow-wrap: anywhere;
        border: none !important;
        background: transparent !important;
        color: inherit;
        font-size: inherit;
        line-height: inherit;
    }

    .printable-checkbox {
        display: inline-block;
    }

    @media print {
        html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
        }
    }
</style>
</head>
<body>
    <div id="print-container">
        <table class="print-shell" role="presentation" aria-hidden="true">
            <thead>
                <tr>
                    <td>
                        <div class="print-header">
                            ${headerHTML}
                        </div>
                    </td>
                </tr>
            </thead>

            <tfoot>
                <tr>
                    <td>
                        <div class="print-footer">
                            ${footerHTML}
                        </div>
                    </td>
                </tr>
            </tfoot>

            <tbody>
                <tr>
                    <td>
                        <div class="print-body">
                            <div class="print-content" id="printContent"></div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</body>
</html>
        `);
        printDoc.close();

        const printContent = printDoc.getElementById('printContent');
        printContent.appendChild(printableBody);

        convertFormControlsToPrintable(printContent);

        await waitForImages(printDoc);
        await waitForFonts(printDoc);

        forceTopSpacingReset(printDoc);

        await nextFrame(printFrame.contentWindow);
        await nextFrame(printFrame.contentWindow);

        await runPrintAndCleanup(printFrame);

    } catch (error) {
        console.error('Print failed:', error);
        alert('Printing failed. Please try again.');
    } finally {
        document.title = originalTitle;
    }
}

function buildPrintableBody(mainContent) {
    const wrapper = document.createElement('div');
    wrapper.className = 'print-body-wrapper';

    const clonedMainContent = mainContent.cloneNode(true);
    removeNonPrintable(clonedMainContent);
    syncFormValues(mainContent, clonedMainContent);
    wrapper.appendChild(clonedMainContent);

    const approvalSource =
        document.querySelector('.approvals-container') ||
        document.querySelector('.approval-row')?.closest('section, div');

    if (approvalSource) {
        const approvalClone = approvalSource.cloneNode(true);
        removeNonPrintable(approvalClone);
        syncFormValues(approvalSource, approvalClone);

        const approvalWrap = document.createElement('div');
        approvalWrap.className = 'print-approval-section';
        approvalWrap.appendChild(approvalClone);
        wrapper.appendChild(approvalWrap);
    }

    const documentInfoSource =
        document.querySelector('.document-info') ||
        document.querySelector('.doc-header')?.closest('.document-info, div');

    if (documentInfoSource) {
        const documentInfoClone = documentInfoSource.cloneNode(true);
        removeNonPrintable(documentInfoClone);
        syncFormValues(documentInfoSource, documentInfoClone);

        const documentInfoWrap = document.createElement('div');
        documentInfoWrap.className = 'print-document-info-section';
        documentInfoWrap.appendChild(documentInfoClone);
        wrapper.appendChild(documentInfoWrap);
    }

    return wrapper;
}

function buildPrintHeaderHtml() {
    const leftLogo = document.querySelector('.logo-left')?.src || '';
    const rightLogos = Array.from(document.querySelectorAll('.logos-right img'))
        .map(img => img.src)
        .filter(Boolean);

    const officeTitle =
        document.querySelector('.office-title')?.textContent?.trim() ||
        'Monthly Accomplishment Report';

    const collegeInfoNode = document.querySelector('.college-info');
    const collegeInfoHtml = collegeInfoNode
        ? collegeInfoNode.innerHTML
        : `
            <h1>SAINT MICHAEL COLLEGE OF CARAGA</h1>
            <p>Brgy. 4, Nasipit, Agusan del Norte, Philippines</p>
            <p>District 8, Brgy. Triangulo, Nasipit, Agusan del Norte, Philippines</p>
            <p>Tel Nos. +63 085 343-3251 / +63 085 283-3113</p>
            <p><a href="https://www.smccnasipit.edu.ph">www.smccnasipit.edu.ph</a></p>
        `;

    return `
        <div class="print-page-header">
            <div class="header-content">
                ${leftLogo ? `<img src="${escapeHtml(leftLogo)}" alt="Logo" class="logo-left">` : '<div></div>'}
                <div class="college-info">${collegeInfoHtml}</div>
                <div class="logos-right">
                    ${rightLogos.map(src => `<img src="${escapeHtml(src)}" alt="Logo">`).join('')}
                </div>
            </div>
            <div class="office-title">${escapeHtml(officeTitle)}</div>
            <div class="double-line"></div>
        </div>
    `;
}

function buildPrintFooterHtml() {
    const footerImg = document.querySelector('.footer-bottom img')?.src || '';
    return `
        <div class="print-footer-inner">
            ${footerImg ? `<img src="${escapeHtml(footerImg)}" alt="Footer Logo" class="print-footer-logo">` : ''}
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

function removeNonPrintable(root) {
    const selectors = [
        '#headerFrame',
        '#sidebarFrame',
        '.buttons',
        '#downloadPDF',
        '.admin-comment',
        '.no-print',
        '.print-hide',
        '.action-buttons',
        '.wrapper',
        '[data-no-print="true"]',
        'button',
        'script',
        'noscript'
    ];

    selectors.forEach(selector => {
        root.querySelectorAll(selector).forEach(el => el.remove());
    });
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
                if (sourceField.checked) {
                    clonedField.setAttribute('checked', 'checked');
                } else {
                    clonedField.removeAttribute('checked');
                }
            } else {
                clonedField.value = sourceField.value;
                clonedField.setAttribute('value', sourceField.value);
            }
        }
    });
}

function convertFormControlsToPrintable(root) {
    if (!root) return;

    const fields = root.querySelectorAll('input, textarea, select');

    fields.forEach(field => {
        const tag = field.tagName.toLowerCase();
        const replacement = document.createElement('div');
        replacement.className = 'printable-field';

        if (tag === 'textarea') {
            replacement.textContent = field.value || '';
            field.replaceWith(replacement);
            return;
        }

        if (tag === 'select') {
            const selectedText = field.options[field.selectedIndex]
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

            if (type === 'checkbox') {
                replacement.innerHTML = `<span class="printable-checkbox">${field.checked ? '&#10003;' : '&#9633;'}</span>`;
                field.replaceWith(replacement);
                return;
            }

            if (type === 'radio') {
                replacement.innerHTML = `<span class="printable-checkbox">${field.checked ? '&#9679;' : '&#9675;'}</span>`;
                field.replaceWith(replacement);
                return;
            }

            replacement.textContent = field.value || '';
            field.replaceWith(replacement);
        }
    });
}

function waitForImages(docOrRoot) {
    const root = docOrRoot.querySelectorAll ? docOrRoot : docOrRoot.documentElement;
    const images = Array.from(root.querySelectorAll('img'));

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

async function waitForFonts(doc) {
    try {
        if (doc.fonts && doc.fonts.ready) {
            await doc.fonts.ready;
        }
    } catch (_) {}
}

function forceTopSpacingReset(doc) {
    const printContent = doc.getElementById('printContent');
    const bodyWrapper = doc.querySelector('.print-body-wrapper');
    const mainContent = doc.querySelector('#main_content');
    const firstBlock = doc.querySelector('#printContent > .print-body-wrapper > *:first-child');

    if (printContent) {
        printContent.style.marginTop = '0';
        printContent.style.paddingTop = '0';
    }

    if (bodyWrapper) {
        bodyWrapper.style.marginTop = '0';
        bodyWrapper.style.paddingTop = '0';
    }

    if (mainContent) {
        mainContent.style.marginTop = '0';
        mainContent.style.paddingTop = '0';
    }

    if (firstBlock) {
        firstBlock.style.marginTop = '0';
        firstBlock.style.paddingTop = '0';
    }
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
                if (iframe.parentNode) {
                    iframe.parentNode.removeChild(iframe);
                }
                resolve();
            }, 150);
        };

        win.onafterprint = cleanup;
        setTimeout(cleanup, 5000);

        win.focus();
        win.print();
    });
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

window.printReport = printReport;