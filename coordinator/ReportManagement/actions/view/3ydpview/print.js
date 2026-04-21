async function printReport() {
    const reportRoot =
        document.querySelector('form.report-form') ||
        document.querySelector('.report-form') ||
        document.querySelector('.container');

    if (!reportRoot) {
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
        const clonedReport = reportRoot.cloneNode(true);

        syncFormValues(reportRoot, clonedReport);
        removeNonPrintable(clonedReport);
        removeDuplicateReportHeaderFooter(clonedReport);

        const iframe = createPrintIframe();
        const doc = iframe.contentDocument || iframe.contentWindow.document;

        const logoLeft =
            document.querySelector('.logo-left')?.src ||
            document.querySelector('.header-content img')?.src ||
            '';

        const rightLogos = Array.from(document.querySelectorAll('.logos-right img'))
            .map(img => img.src)
            .filter(Boolean);

        const footerLogo =
            document.querySelector('.footer-bottom img')?.src ||
            '../../images/footerlogo.png';

        doc.open();
        doc.write(`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Program Assessment Plan</title>
<style>
    :root {
        --page-top: 16mm;
        --page-right: 12mm;
        --page-bottom: 16mm;
        --page-left: 12mm;

        --print-header-height: 170px;
        --print-footer-height: 64px;
        --print-gap-after-header: 24px;
        --print-gap-before-footer: 16px;

        --content-top-offset: calc(var(--print-header-height) + var(--print-gap-after-header));
        --content-bottom-offset: calc(var(--print-footer-height) + var(--print-gap-before-footer));
    }

    * {
        box-sizing: border-box;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
    }

    @page {
        size: A4 portrait;
        margin: var(--page-top) var(--page-right) var(--page-bottom) var(--page-left);
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

    .print-shell {
        width: 100%;
        position: relative;
    }

    .print-header,
    .print-footer {
        position: fixed;
        left: var(--page-left);
        right: var(--page-right);
        background: #fff;
        z-index: 9999;
    }

    .print-header {
        top: 0;
        padding: 0 0 12px 0;
    }

    .print-footer {
        bottom: 0;
        padding-top: 6px;
        background: #fff;
    }

    .header-content-print {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        margin-bottom: 10px;
        gap: 12px;
    }

    .logo-left-print {
        height: 90px;
        width: auto;
        max-width: 90px;
        object-fit: contain;
        display: block;
    }

    .logos-right-print {
        display: flex;
        gap: 12px;
        align-items: center;
    }

    .logos-right-print img {
        height: 70px;
        width: auto;
        object-fit: contain;
        display: block;
    }

    .college-info-print {
        text-align: center;
        flex-grow: 1;
        padding: 0 10px;
    }

    .college-info-print h1 {
        font-family: "Times New Roman", Times, serif;
        color: #4f81bd;
        font-size: 26px;
        margin: 0;
        font-weight: normal;
        line-height: 1.2;
        text-transform: uppercase;
    }

    .college-info-print p {
        font-size: 11px;
        margin: 2px 0;
        color: #333;
        line-height: 1.3;
    }

    .office-title-print {
        text-align: center;
        font-size: 18px;
        color: #595959;
        font-weight: bold;
        margin: 10px 0 5px 0;
        letter-spacing: 0.5px;
        text-transform: uppercase;
    }

    .double-line-print {
        border-top: 4px double #4f81bd;
        margin-bottom: 0;
    }

    .print-main {
        width: 100%;
        padding-top: var(--content-top-offset);
        padding-bottom: var(--content-bottom-offset);
    }

    .print-report-card {
        width: 100%;
        max-width: 100%;
        margin: 0 auto;
        background: #fff;
        padding: 0;
        box-shadow: none;
        border-radius: 0;
    }

    .print-report-content,
    .print-report-content * {
        max-width: 100%;
    }

    .print-report-content {
        overflow: visible !important;
    }

    .report-form,
    form.report-form,
    .container,
    .table-section,
    .table-wrapper {
        width: 100% !important;
        max-width: 100% !important;
        overflow: visible !important;
        margin: 0 !important;
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

    /* Remove duplicate in-content document header/footer from cloned report */
    .print-report-content > .header-content,
    .print-report-content > .office-title,
    .print-report-content > .double-line,
    .print-report-content > footer,
    .print-report-content .footer-bottom {
        display: none !important;
    }

    header h1 {
        text-align: center;
        text-transform: uppercase;
        font-size: 1.5rem;
        color: #2c3e50;
        margin-bottom: 24px;
        border-bottom: 2px solid #eee;
        padding-bottom: 10px;
    }

    .form-section {
        margin-bottom: 24px;
    }

    .input-group {
        margin-bottom: 16px;
    }

    .input-group label {
        display: block;
        font-weight: bold;
        margin-bottom: 6px;
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
        font-size: 0.95rem;
        line-height: 1.45;
    }

    .printable-paper-lines {
        display: block;
        width: 100%;
        min-height: 62px;
        white-space: pre-wrap;
        word-break: break-word;
        overflow-wrap: anywhere;
        color: #1e293b;
        font-size: 0.95rem;
        line-height: 31px;
        padding: 5px;
        border: none;
        background-image: linear-gradient(transparent 30px, #000 31px) !important;
        background-size: 100% 31px !important;
        background-attachment: local;
    }

    .table-section {
        margin: 30px 0;
        width: 100%;
    }

    .table-wrapper {
        overflow: visible !important;
        background: #fff;
        border: 1px solid #e2e8f0;
        margin-bottom: 24px;
        width: 100%;
    }

    table {
        width: 100% !important;
        border-collapse: collapse !important;
        table-layout: fixed !important;
        word-wrap: break-word !important;
        page-break-inside: auto;
        break-inside: auto;
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

    table thead th {
        font-weight: bold;
        background-color: #f8fafc !important;
        color: #475569;
        font-size: 0.82rem;
        padding: 8px 4px;
        border: 1px solid #cbd5e1;
        text-transform: uppercase;
        text-align: center;
        word-wrap: break-word;
    }

    table td {
        border: 1px solid #cbd5e1;
        padding: 6px 5px;
        vertical-align: top;
    }

    table td .printable-field,
    table td .printable-paper-lines {
        margin: 0;
        font-size: 0.85rem;
        color: #1e293b;
    }

    table th:nth-child(1), table td:nth-child(1) { width: 12%; }
    table th:nth-child(3), table td:nth-child(3) { width: 15%; }

    .approvals-container {
        margin-top: 30px;
        font-family: Arial, sans-serif;
        width: 100%;
        max-width: 900px;
        margin-left: auto;
        margin-right: auto;
        color: #000;
        break-inside: avoid;
        page-break-inside: avoid;
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

    .document-info {
        margin-top: 40px;
        width: 30%;
    }

    .doc-header {
        width: auto;
        margin-right: auto;
        border-collapse: collapse;
        font-family: Arial, sans-serif;
        font-size: 11px;
        border: 1px solid #d1d1d1;
        table-layout: auto !important;
    }

    .doc-header td {
        border: 1px solid #000;
        padding: 5px 10px;
    }

    .doc-header td.label {
        background-color: #002060 !important;
        color: #fff !important;
        width: 100px;
        font-size: 11px;
        font-weight: bold;
        padding: 4px 8px;
        text-align: left;
        white-space: nowrap;
    }

    .doc-header td:nth-child(2) {
        width: 2%;
        padding: 0 1px;
        font-weight: bold;
    }

    .doc-header td.value {
        padding: 4px 10px;
        min-width: 120px;
        text-align: left;
    }

    .paper-lines {
        width: 100%;
        border: none;
        outline: none;
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
    }

    .print-footer-inner {
        display: flex;
        align-items: flex-end;
        justify-content: flex-end;
        width: 100%;
    }

    .print-footer-image-only {
        min-height: 40px;
    }

    .print-footer-logo {
        display: block;
        max-width: 100%;
        width: auto;
        max-height: 48px;
        object-fit: contain;
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
    <div class="print-shell">
        <header class="print-header" id="printHeader">
            <div class="header-content-print">
                <div style="width:90px; display:flex; justify-content:flex-start;">
                    ${logoLeft ? `<img class="logo-left-print" src="${escapeHtml(logoLeft)}" alt="College Logo">` : ''}
                </div>

                <div class="college-info-print">
                    <h1>UNIVERSITY OF MINDANAO</h1>
                    <p>PROGRAM ASSESSMENT PLAN</p>
                    <p>Academic Year 2025–2026</p>
                </div>

                <div class="logos-right-print" style="min-width:90px; justify-content:flex-end;">
                    ${rightLogos.map(src => `<img src="${escapeHtml(src)}" alt="Logo">`).join('')}
                </div>
            </div>

            <div class="office-title-print">PROGRAM ASSESSMENT PLAN</div>
            <div class="double-line-print"></div>
        </header>

        <footer class="print-footer" id="printFooter">
            <div class="print-footer-inner print-footer-image-only">
                <img src="${escapeHtml(footerLogo)}" alt="Footer Logo" class="print-footer-logo">
            </div>
        </footer>

        <main class="print-main">
            <div class="print-report-card">
                <div class="print-report-content" id="printReportContent"></div>
            </div>
        </main>
    </div>
</body>
</html>
        `);
        doc.close();

        doc.getElementById('printReportContent').appendChild(clonedReport);

        convertFormControlsToPrintable(doc.getElementById('printReportContent'));

        await waitForImages(doc);
        applyMeasuredPrintOffsets(doc);

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

function removeDuplicateReportHeaderFooter(root) {
    const selectors = [
        ':scope > .header-content',
        ':scope > .office-title',
        ':scope > .double-line',
        ':scope > footer',
        '.footer-bottom'
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
            (field.closest('.paper-lines') !== null);

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
            replacement.className = 'printable-field';
            const type = (field.type || 'text').toLowerCase();

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

            if (['hidden', 'button', 'submit', 'reset', 'file'].includes(type)) {
                field.remove();
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

function applyMeasuredPrintOffsets(doc) {
    const root = doc.documentElement;
    const header = doc.getElementById('printHeader');
    const footer = doc.getElementById('printFooter');

    if (!header || !footer) return;

    const headerHeight = Math.ceil(header.getBoundingClientRect().height);
    const footerHeight = Math.ceil(footer.getBoundingClientRect().height);

    root.style.setProperty('--print-header-height', (headerHeight + 6) + 'px');
    root.style.setProperty('--print-footer-height', (footerHeight + 4) + 'px');
    root.style.setProperty('--print-gap-after-header', '26px');
    root.style.setProperty('--print-gap-before-footer', '16px');
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
            }, 150);
        };

        win.onafterprint = cleanup;
        setTimeout(cleanup, 4000);

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