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

        // Uncomment if you want to remove the inner report title block
        // removeInternalReportTitleBlock(clonedContent);

        const iframe = createPrintIframe();
        const doc = iframe.contentDocument || iframe.contentWindow.document;

        const leftLogoSrc = document.querySelector('.logo-left')?.src || '';
         const left2LogoSrc = document.querySelector('.logo-left2')?.src || '';
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

    html, body {
        margin: 0;
        padding: 0;
        background: #fff;
        color: #1a202c;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif;
        letter-spacing: -0.011em;
        line-height: 1.5;
        font-size: 12px;
    }

    body {
        background: #fff !important;
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
        outline: none !important;
        box-shadow: none !important;
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
        border: none !important;
        outline: none !important;
        box-shadow: none !important;
    }

    .print-footer-wrap {
        padding: 12px 0 0 0;
        background: #fff;
        border: none !important;
        outline: none !important;
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
        display: block;
    }
    .logo-left2 {
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

    .print-main {
        width: 100%;
    }

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
        font-size: 1.8rem;
        color: #2c3e50;
        margin-bottom: 30px;
        border-bottom: 2px solid #eee;
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
        color: #444;
    }

    .printable-field {
        display: block;
        width: 100%;
        min-height: 1em;
        white-space: pre-wrap;
        word-break: break-word;
        overflow-wrap: anywhere;
        color: #1e293b;
        font-size: 1rem;
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
        font-family: Arial, sans-serif;
        font-size: 16px;
        line-height: 31px;
        background-image: linear-gradient(transparent 30px, #000 31px) !important;
        background-size: 100% 31px !important;
        background-attachment: local;
        display: block;
        padding: 5px;
        box-sizing: border-box;
        white-space: pre-wrap;
        word-break: break-word;
        overflow-wrap: anywhere;
        min-height: 62px;
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
        outline: none !important;
        box-shadow: none !important;
        margin-bottom: 30px;
        width: 100%;
    }

    /* General tables: no forced outer border */
    table {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;
        page-break-inside: auto;
        break-inside: auto;
        border: none;
        outline: none;
        box-shadow: none;
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

    /* ================= PROGRAM PLAN TABLE (MATCH SCREENSHOT) ================= */
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

    #programPlanTable th:nth-child(1),
    #programPlanTable td:nth-child(1) { width: 14%; }

    #programPlanTable th:nth-child(2),
    #programPlanTable td:nth-child(2) { width: 12%; }

    #programPlanTable th:nth-child(3),
    #programPlanTable td:nth-child(3) { width: 18%; }

    #programPlanTable th:nth-child(4),
    #programPlanTable td:nth-child(4) { width: 14%; }

    #programPlanTable th:nth-child(5),
    #programPlanTable td:nth-child(5) { width: 14%; }

    #programPlanTable th:nth-child(6),
    #programPlanTable td:nth-child(6) { width: 10%; }

    #programPlanTable th:nth-child(7),
    #programPlanTable td:nth-child(7) { width: 12%; }

    #programPlanTable th:nth-child(8),
    #programPlanTable td:nth-child(8) { width: 12%; }

    .approvals-container {
        margin-top: 30px;
        font-family: Arial, sans-serif;
        width: 100%;
        max-width: 900px;
        margin: 0 auto;
        color: #000;
        page-break-inside: avoid;
        break-inside: avoid;
    }

    .approval-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        gap: 20px;
    }

    .signature-group {
        width: 35%;
    }

    .label {
        font-weight: bold;
        margin-bottom: 35px;
    }

    .signature-line {
        border-bottom: 1.5px solid #000 !important;
        min-height: 25px;
        margin-bottom: 5px;
        text-align: center;
        font-weight: bold;
        text-transform: uppercase;
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
        border-bottom: 1.5px solid #000 !important;
        text-decoration: none !important;
        text-transform: uppercase;
        display: inline-block;
        padding: 0 15px;
        min-width: 250px;
    }

    /* ---------------- DOCUMENT INFO ---------------- */
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
        outline: none !important;
        box-shadow: none !important;
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
        box-shadow: none !important;
        outline: none !important;
    }

    @media print {
        html, body {
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
                                ${left2LogoSrc ? `<img src="${escapeHtml(left2LogoSrc)}" alt="CES logo" class="logo-left2">` : ''}
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

function removeInternalReportTitleBlock(root) {
    const internalHeader = root.querySelector('#header');
    if (internalHeader) {
        internalHeader.remove();
    }
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
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}