/**
 * print.js - Program Monitoring Form
 * Repeats header/footer on every printed page and prevents overlap.
 */

async function printReport() {
    const formContainer =
        document.querySelector('.form-container') ||
        document.querySelector('#main_content') ||
        document.querySelector('form');

    if (!formContainer) {
        alert('Unable to print: form content not found.');
        return;
    }

    const originalTitle = document.title;
    document.title = 'Program_Monitoring_Form';

    try {
        const iframe = createPrintIframe();
        const doc = iframe.contentDocument || iframe.contentWindow.document;

        const headerHTML = buildPrintHeaderHtml();
        const footerHTML = buildPrintFooterHtml();
        const printableBody = buildPrintableBody(formContainer);

        doc.open();
        doc.write(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Program Monitoring Form</title>
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

        html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100%;
            background: #fff !important;
            color: #000;
            font-family: Arial, sans-serif;
            font-size: 11px;
            line-height: 1.4;
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

        .print-header-shell,
        .print-footer-shell,
        .print-body {
            width: 100%;
            margin: 0 !important;
            background: #fff !important;
            border: none !important;
            outline: none !important;
            box-shadow: none !important;
        }

        .print-header-shell {
            padding: 0 0 8px 0 !important;
        }

        .print-footer-shell {
            padding: 8px 0 0 0 !important;
        }

        .print-body {
            padding: 0 !important;
            margin: 0 !important;
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
        .form-container,
        #main_content,
        .approvals-container,
        .document-info {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            outline: none !important;
            box-shadow: none !important;
            background: #fff !important;
            overflow: visible !important;
            pointer-events: none !important;
            user-select: text !important;
        }

        .print-body-wrapper > *:first-child,
        .print-body-wrapper > *:first-child *:first-child,
        .form-container > *:first-child,
        #main_content > *:first-child {
            margin-top: 0 !important;
            padding-top: 0 !important;
        }

        #sidebarFrame,
        #headerFrame,
        .buttons,
        .admin-comment,
        .no-print,
        .print-hide,
        [data-no-print="true"],
        button,
        script,
        noscript,
        .print-header,
        .print-footer,
        footer,
        .footer-bottom,
        .footer-logos {
            display: none !important;
        }

        /* Header */
        .print-page-header {
            margin: 0 !important;
            padding: 0 !important;
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
            color: #4f81bd !important;
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
            color: #0000EE !important;
            text-decoration: underline;
        }

        .office-title {
            text-align: center;
            font-size: 18px;
            color: #595959 !important;
            font-weight: bold;
            margin: 20px 0 5px 0;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }

        .double-line {
            border-top: 4px double #4f81bd !important;
            margin-bottom: 25px;
        }

        /* Main flat layout */
        .form-container {
            background: #fff !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
        }

        h2 {
            text-align: center;
            margin: 0 0 30px 0 !important;
            text-transform: capitalize;
            font-size: 16px !important;
        }

        h3 {
            margin-top: 30px;
            margin-bottom: 10px;
            font-size: 1.1em;
        }

        .header-info {
            margin-bottom: 20px;
        }

        .input-group {
            display: flex;
            margin-bottom: 8px;
            align-items: flex-end;
        }

        .input-group label {
            font-weight: bold;
            white-space: nowrap;
            margin-right: 10px;
        }

        .input-group input,
        .input-group .printable-field {
            border: none !important;
            border-bottom: 1px solid black !important;
            width: 100% !important;
            outline: none !important;
            background: transparent !important;
            color: #000 !important;
            padding: 2px 4px !important;
            min-height: 18px !important;
        }

        table {
            width: 100% !important;
            border-collapse: collapse !important;
            margin-bottom: 20px;
        }

        th, td {
            border: 1px solid black !important;
            padding: 8px !important;
            font-size: 0.9em !important;
            vertical-align: top !important;
            color: #000 !important;
        }

        th {
            background-color: #ffffff !important;
            text-align: center;
            text-transform: uppercase;
        }

        .center-text {
            text-align: center !important;
        }

        tbody tr {
            height: 30px;
        }

        tr {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
        }

        .checkbox-cell {
            text-align: center !important;
            vertical-align: middle !important;
        }

        input[type="checkbox"] {
            cursor: default !important;
        }

        .followUp {
            width: 70px !important;
            padding: 4px !important;
            text-align: center !important;
            border: none !important;
            background: transparent !important;
            color: #000 !important;
        }

        textarea {
            width: 100% !important;
            border: 1px solid #ccc !important;
            padding: 4px !important;
            font-family: Arial, sans-serif !important;
            font-size: 0.9em !important;
            resize: none !important;
            background: transparent !important;
            color: #000 !important;
        }

        .paper-lines,
        #other_recommendations {
            width: 100% !important;
            border: none !important;
            outline: none !important;
            font-size: 0.9em !important;
            line-height: 30px !important;
            padding: 0 !important;
            background-attachment: local !important;
            background-image: linear-gradient(to bottom, transparent 29px, #000 29px) !important;
            background-size: 100% 30px !important;
            background-color: transparent !important;
            font-family: Arial, sans-serif !important;
            overflow: hidden !important;
            margin-top: 8px !important;
        }

        .footer-notes {
            margin-top: 20px;
        }

        #feedbackTable {
            width: 100% !important;
            border-collapse: collapse !important;
            font-family: Arial, sans-serif !important;
        }

        #feedbackTable th,
        #feedbackTable td {
            border: 1px solid #000 !important;
            padding: 10px !important;
        }

        .feedbackSummary,
        .feedbackAction {
            width: 100% !important;
            box-sizing: border-box !important;
            border: none !important;
            padding: 8px !important;
            font-family: inherit !important;
            font-size: 0.9em !important;
            display: block !important;
            overflow: hidden !important;
            min-height: 50px !important;
            background: transparent !important;
        }

        #otherIssues {
            width: 100% !important;
            box-sizing: border-box !important;
            border: none !important;
            padding: 8px !important;
            font-family: inherit !important;
            font-size: 13px !important;
            display: block !important;
            overflow: hidden !important;
            min-height: 38px !important;
            background: transparent !important;
        }

        .printable-field {
            display: block;
            width: 100%;
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

        /* Section III checkbox styling */
        #recommendationsTable td:first-child {
            width: 120px !important;
            white-space: nowrap !important;
            text-align: left !important;
            vertical-align: middle !important;
            padding: 8px 10px !important;
        }

        #recommendationsTable td:first-child .printable-choice {
            display: inline-flex !important;
            align-items: center !important;
            gap: 6px !important;
            margin-right: 10px !important;
            vertical-align: middle !important;
        }

        #recommendationsTable td:first-child .choice-label {
            font-size: 0.9em !important;
            color: #000 !important;
            line-height: 1 !important;
        }

        .printable-box {
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            width: 13px !important;
            height: 13px !important;
            border: 1px solid #666 !important;
            border-radius: 2px !important;
            background: #fff !important;
            color: transparent !important;
            font-size: 10px !important;
            line-height: 1 !important;
            vertical-align: middle !important;
        }

        .printable-box.checked {
            background: #e1251b !important;
            border-color: #e1251b !important;
            color: #fff !important;
            font-weight: bold !important;
        }

        .printable-box.checked::before {
            content: "✓";
            transform: translateY(-0.5px);
        }

        #recommendationsTable td:last-child {
            vertical-align: middle !important;
            line-height: 1.35 !important;
        }

        /* Approvals */
        .approvals-container {
            font-family: Arial, sans-serif;
            width: 100% !important;
            max-width: 900px !important;
            margin: 0 auto !important;
            color: #000;
            page-break-inside: auto !important;
            break-inside: auto !important;
        }

        .approval-row {
            display: flex !important;
            justify-content: space-between !important;
            margin-bottom: 20px !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
        }

        .signature-group {
            width: 35% !important;
        }

        .label {
            font-weight: bold !important;
            margin-bottom: 35px !important;
        }

        .signature-line {
            border-bottom: 1.5px solid black !important;
            margin-bottom: 5px !important;
        }

        .title {
            font-size: 14px !important;
        }

        .bold {
            font-weight: bold !important;
        }

        .left-align {
            text-align: left !important;
            width: 100% !important;
        }

        .approval-centered {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
        }

        .admin-block {
            text-align: center !important;
            margin-top: 30px !important;
            margin-bottom: 10px !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
        }

        .name-underlined {
            font-weight: bold !important;
            text-decoration: underline !important;
            text-transform: uppercase !important;
            font-size: 16px !important;
            display: inline-block !important;
            margin-bottom: 2px !important;
        }

        /* Document Info */
        .document-info {
            margin-top: 50px !important;
            width: 30% !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
        }

        .doc-header {
            width: auto !important;
            margin-right: auto !important;
            border-collapse: collapse !important;
            font-family: Arial, sans-serif !important;
            font-size: 11px !important;
            border: 1px solid #d1d1d1 !important;
        }

        .doc-header td {
            border: 1px solid #000 !important;
            padding: 5px 10px !important;
        }

        .doc-header td.label {
            background-color: #002060 !important;
            color: #fff !important;
            width: 100px !important;
            font-size: 11px !important;
            font-weight: bold !important;
            padding: 4px 8px !important;
            border: 1px solid #d1d1d1 !important;
            text-align: left !important;
            white-space: nowrap !important;
        }

        .doc-header td:nth-child(2) {
            width: 2% !important;
            padding: 0 1px !important;
            font-weight: bold !important;
            border-top: 1px solid #d1d1d1 !important;
            border-bottom: 1px solid #d1d1d1 !important;
            text-align: center !important;
        }

        .doc-header td.value {
            width: 70% !important;
            font-size: 11px !important;
            text-align: left !important;
            padding: 4px 10px !important;
            border: 1px solid #d1d1d1 !important;
            min-width: 120px !important;
        }

        .doc-header td.value input,
        .doc-header td.value p {
            border: none !important;
            background: transparent !important;
            font-family: inherit !important;
            font-size: inherit !important;
            color: #333 !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
        }

        .doc-header td.value input:disabled {
            color: black !important;
            cursor: default !important;
        }

        /* Footer */
        .print-footer-inner,
        footer {
            width: 100%;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            background: #fff !important;
        }

        .footer-bottom {
            display: flex;
            align-items: flex-end;
            justify-content: flex-end;
            width: 100%;
            margin: 0 !important;
            padding: 0 !important;
        }

        .footer-logos {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            width: 100%;
            gap: 0;
            margin: 0 !important;
            padding: 0 !important;
        }

        .footer-logos img,
        .print-footer-logo {
            display: block;
            width: 100%;
            max-width: 100%;
            height: auto;
            max-height: 26px;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            outline: none !important;
            box-shadow: none !important;
            object-fit: contain;
        }

        img {
            max-width: 100%;
            height: auto;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
        }

        @media print {
            .no-print { display: none !important; }
            body { background-color: white !important; padding: 0 !important; }
            .form-container { box-shadow: none !important; width: 100% !important; max-width: none !important; }
            .paper-lines,
            #other_recommendations {
                background-image: linear-gradient(to bottom, transparent 29px, #000 29px) !important;
                background-size: 100% 30px !important;
                border: none !important;
            }

            #print-container,
            .print-shell,
            .print-shell tbody,
            .print-shell tbody > tr,
            .print-body {
                height: auto !important;
                min-height: 0 !important;
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
                        <div class="print-header-shell">
                            ${headerHTML}
                        </div>
                    </td>
                </tr>
            </thead>

            <tfoot>
                <tr>
                    <td>
                        <div class="print-footer-shell">
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
        doc.close();

        const printContent = doc.getElementById('printContent');
        printContent.appendChild(printableBody);

        convertFormControlsToPrintable(printContent);

        await waitForImages(doc);
        await waitForFonts(doc);

        forceTopSpacingReset(doc);

        await nextFrame(iframe.contentWindow);
        await nextFrame(iframe.contentWindow);

        await runPrintAndCleanup(iframe);
    } catch (error) {
        console.error('Print failed:', error);
        alert('Printing failed. Please try again.');
    } finally {
        document.title = originalTitle;
    }
}

function buildPrintableBody(formContainer) {
    const wrapper = document.createElement('div');
    wrapper.className = 'print-body-wrapper';

    const clonedMain = formContainer.cloneNode(true);
    removeNonPrintable(clonedMain);

    const firstHeader = clonedMain.querySelector('header');
    if (firstHeader) firstHeader.remove();

    clonedMain.querySelectorAll('footer, .footer-bottom, .footer-logos')
        .forEach(el => el.remove());

    syncFormValues(formContainer, clonedMain);
    wrapper.appendChild(clonedMain);

    const approvalSource =
        document.querySelector('.approvals-container') ||
        document.querySelector('.approval-row')?.closest('section, div');

    if (approvalSource && !wrapper.querySelector('.approvals-container')) {
        const approvalClone = approvalSource.cloneNode(true);
        removeNonPrintable(approvalClone);
        syncFormValues(approvalSource, approvalClone);
        wrapper.appendChild(approvalClone);
    }

    const documentInfoSource =
        document.querySelector('.document-info') ||
        document.querySelector('.doc-header')?.closest('.document-info, div');

    if (documentInfoSource && !wrapper.querySelector('.document-info')) {
        const docInfoClone = documentInfoSource.cloneNode(true);
        removeNonPrintable(docInfoClone);
        syncFormValues(documentInfoSource, docInfoClone);
        wrapper.appendChild(docInfoClone);
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
        'PROGRAM MONITORING FORM';

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

function removeNonPrintable(root) {
    const selectors = [
        '#sidebarFrame',
        '#headerFrame',
        '.buttons',
        '.admin-comment',
        '.no-print',
        '.print-hide',
        '[data-no-print="true"]',
        'button',
        'script',
        'noscript',
        '.print-header',
        '.print-footer'
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

    // Fix Section III first: replace the whole applicability cell once
    const recommendationRows = root.querySelectorAll('#recommendationsTable tbody tr');

    recommendationRows.forEach(row => {
        const firstCell = row.querySelector('td:first-child');
        if (!firstCell) return;

        const yesInput = firstCell.querySelector('.recYes');
        const naInput = firstCell.querySelector('.recNa');

        if (yesInput || naInput) {
            const yesChecked = !!yesInput && yesInput.checked;
            const naChecked = !!naInput && naInput.checked;

            firstCell.innerHTML = `
                <span class="printable-choice">
                    <span class="printable-box ${yesChecked ? 'checked' : ''}"></span>
                    <span class="choice-label">yes</span>
                </span>
                <span class="printable-choice">
                    <span class="printable-box ${naChecked ? 'checked' : ''}"></span>
                    <span class="choice-label">N/A</span>
                </span>
            `;
        }
    });

    const fields = root.querySelectorAll('input, textarea, select');

    fields.forEach(field => {
        const tag = field.tagName.toLowerCase();

        if (tag === 'textarea') {
            const replacement = document.createElement('div');
            replacement.className = field.classList.contains('paper-lines')
                ? 'printable-field paper-lines'
                : 'printable-field';
            replacement.textContent = field.value || '';
            field.replaceWith(replacement);
            return;
        }

        if (tag === 'select') {
            const replacement = document.createElement('div');
            replacement.className = 'printable-field';
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

            // skip recYes/recNa because Section III cell was already rebuilt above
            if (field.classList.contains('recYes') || field.classList.contains('recNa')) {
                return;
            }

            if (type === 'checkbox') {
                const replacement = document.createElement('span');
                replacement.className = `printable-box ${field.checked ? 'checked' : ''}`;
                field.replaceWith(replacement);
                return;
            }

            if (type === 'radio') {
                const replacement = document.createElement('span');
                replacement.className = `printable-box ${field.checked ? 'checked' : ''}`;
                field.replaceWith(replacement);
                return;
            }

            const replacement = document.createElement('div');
            replacement.className = 'printable-field';
            replacement.textContent = field.value || '';
            field.replaceWith(replacement);
        }
    });
}

function forceTopSpacingReset(doc) {
    const printContent = doc.getElementById('printContent');
    const bodyWrapper = doc.querySelector('.print-body-wrapper');
    const firstBlock = doc.querySelector('#printContent > .print-body-wrapper > *:first-child');

    if (printContent) {
        printContent.style.marginTop = '0';
        printContent.style.paddingTop = '0';
    }

    if (bodyWrapper) {
        bodyWrapper.style.marginTop = '0';
        bodyWrapper.style.paddingTop = '0';
    }

    if (firstBlock) {
        firstBlock.style.marginTop = '0';
        firstBlock.style.paddingTop = '0';
    }
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