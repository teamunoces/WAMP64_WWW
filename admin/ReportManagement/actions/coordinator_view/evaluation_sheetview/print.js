// print.js - Evaluation Sheet Print
// Fixed: no right overlap + bigger right-side logos

async function printReport() {
    const evaluationContainer = document.querySelector('.evaluation-container');
    const evaluationForm = document.getElementById('evaluationForm');

    if (!evaluationContainer || !evaluationForm) {
        console.error('Evaluation content not found');
        alert('Could not find evaluation content to print');
        return;
    }

    const oldIframe = document.getElementById('print-iframe');
    if (oldIframe) oldIframe.remove();

    const printClone = evaluationContainer.cloneNode(true);
    fixFormStatesForPrint(printClone);

    const headerElements = [...printClone.querySelectorAll('header')];
    const footerElement = printClone.querySelector('footer');
    const formElement = printClone.querySelector('#evaluationForm');

    const headerHTML = headerElements.map(header => header.outerHTML).join('');
    const footerHTML = footerElement ? footerElement.outerHTML : '';
    const formHTML = formElement ? formElement.outerHTML : '';

    const iframe = document.createElement('iframe');
    iframe.id = 'print-iframe';
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

    const doc = iframe.contentDocument || iframe.contentWindow.document;

    doc.open();
    doc.write(`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Evaluation Sheet for Extension Services</title>

<style>
    * {
        box-sizing: border-box !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
    }

    @page {
        size: A4 portrait;
        margin: 12mm;
    }

    html,
    body {
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
        overflow: visible !important;
        background: #fff !important;
        font-family: Arial, sans-serif !important;
        font-size: 15px !important;
        line-height: 1.4 !important;
        color: #333 !important;
    }

    .print-container,
    .print-shell,
    .print-header,
    .print-footer,
    .print-body,
    .evaluation-container,
    #evaluationForm {
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        margin: 0 !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
        overflow: visible !important;
        background: #fff !important;
        border: none !important;
        outline: none !important;
        box-shadow: none !important;
    }

    .print-shell {
        border-collapse: collapse !important;
        border-spacing: 0 !important;
        table-layout: fixed !important;
    }

    .print-shell thead {
        display: table-header-group !important;
    }

    .print-shell tfoot {
        display: table-footer-group !important;
    }

    .print-shell tbody {
        display: table-row-group !important;
    }

    .print-shell tr,
    .print-shell td {
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
        vertical-align: top !important;
        overflow: hidden !important;
        background: #fff !important;
    }

    .print-header {
        padding-bottom: 8px !important;
        overflow: hidden !important;
    }

    .print-footer {
        padding-top: 8px !important;
        overflow: hidden !important;
    }

    header,
    footer,
    .header-content,
    .footer-bottom,
    .footer-logos {
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        overflow: hidden !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
        border: none !important;
        outline: none !important;
        box-shadow: none !important;
    }

    .header-content {
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        gap: 5px !important;
        flex-wrap: nowrap !important;
        margin: 0 0 8px 0 !important;
        padding: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
        overflow: hidden !important;
    }

    .logo-left,
    .logo-left2 {
        height: 78px !important;
        width: auto !important;
        max-width: 14% !important;
        flex: 0 0 auto !important;
        object-fit: contain !important;
    }

    .logos-right {
        display: flex !important;
        align-items: center !important;
        justify-content: flex-end !important;
        gap: 4px !important;
        flex: 0 0 23% !important;
        width: 23% !important;
        max-width: 23% !important;
        min-width: 0 !important;
        overflow: hidden !important;
    }

    .logos-right img {
        height: 82px !important;
        width: auto !important;
        max-width: 48% !important;
        object-fit: contain !important;
        display: block !important;
        flex: 0 1 auto !important;
    }

    .college-info {
        flex: 1 1 auto !important;
        min-width: 0 !important;
        max-width: 49% !important;
        text-align: center !important;
        padding: 0 3px !important;
        overflow: hidden !important;
        overflow-wrap: break-word !important;
        word-break: normal !important;
    }

    .college-info h1 {
        font-family: "Times New Roman", Times, serif !important;
        color: #4f81bd !important;
        font-size: 21px !important;
        margin: 0 !important;
        font-weight: normal !important;
        line-height: 1.1 !important;
        text-decoration: none !important;
    }

    .college-info p {
        font-size: 9.5px !important;
        margin: 1px 0 !important;
        line-height: 1.2 !important;
    }

    .college-info a {
        font-size: 9.5px !important;
        word-break: break-word !important;
    }

    .office-title {
        text-align: center !important;
        font-size: 16px !important;
        color: #595959 !important;
        font-weight: bold !important;
        margin: 4px 0 !important;
        text-transform: uppercase !important;
    }

    .double-line {
        border-top: 4px double #4f81bd !important;
        margin-bottom: 10px !important;
    }

    header h1,
    #report_title {
        display: block !important;
        text-align: center !important;
        font-size: 16px !important;
        text-decoration: underline !important;
        margin: 10px 0 15px 0 !important;
        color: #000 !important;
    }

    .header-info,
    .input-line,
    .checkbox-grid,
    .signature-section,
    .approvals-container,
    .document-info {
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        overflow: visible !important;
    }

    .header-info .input-line {
        display: flex !important;
        align-items: flex-end !important;
        flex-wrap: nowrap !important;
        margin-bottom: 8px !important;
        gap: 8px !important;
    }

    .header-info label {
        flex: 0 0 auto !important;
        font-weight: bold !important;
        white-space: nowrap !important;
    }

    .full-line,
    .sig-input {
        flex: 1 1 auto !important;
        min-width: 0 !important;
        max-width: 100% !important;
        border: none !important;
        border-bottom: 1px solid #000 !important;
        background: transparent !important;
        outline: none !important;
        box-shadow: none !important;
    }

    .checkbox-grid {
        display: flex !important;
        justify-content: space-between !important;
        gap: 10px !important;
        flex-wrap: nowrap !important;
        margin: 15px 0 !important;
    }

    .checkbox-grid .column {
        width: 50% !important;
        max-width: 50% !important;
        min-width: 0 !important;
    }

    .checkbox-grid label {
        display: block !important;
        margin-bottom: 5px !important;
        font-size: 14px !important;
        line-height: 1.3 !important;
    }

    table,
    .legend-table,
    .evaluation-table {
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        table-layout: fixed !important;
        border-collapse: collapse !important;
        overflow-wrap: break-word !important;
        word-wrap: break-word !important;
    }

    th,
    td {
        max-width: 100% !important;
        overflow-wrap: break-word !important;
        word-wrap: break-word !important;
        word-break: normal !important;
        white-space: normal !important;
    }

    .legend-table th,
    .legend-table td,
    .evaluation-table th,
    .evaluation-table td {
        border: 1px solid #000 !important;
        padding: 6px !important;
        vertical-align: top !important;
        font-size: 13px !important;
    }

    .legend-table tr,
    .evaluation-table tr {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
    }

    .evaluation-table thead {
        display: table-header-group !important;
    }

    .evaluation-table .num-col,
    .legend-table td.score-cell {
        width: 35px !important;
        max-width: 35px !important;
        text-align: center !important;
        vertical-align: middle !important;
    }

    .radio-cell {
        width: 38px !important;
        max-width: 38px !important;
        text-align: center !important;
        vertical-align: middle !important;
    }

    input[type="radio"] {
        -webkit-appearance: radio !important;
        appearance: radio !important;
        display: inline-block !important;
        width: 14px !important;
        height: 14px !important;
        margin: 0 !important;
        transform: none !important;
        accent-color: #dc2626 !important;
    }

    input[type="checkbox"] {
        accent-color: #dc2626 !important;
    }

    input,
    textarea,
    select {
        max-width: 100% !important;
        min-width: 0 !important;
        font-family: inherit !important;
        font-size: inherit !important;
    }

    .signature-section {
        margin-top: 35px !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
    }

    .sig-line {
        display: flex !important;
        align-items: center !important;
        flex-wrap: nowrap !important;
        margin-bottom: 10px !important;
        font-weight: bold !important;
    }

    .sig-input {
        width: auto !important;
        margin-left: 10px !important;
        padding: 4px 0 !important;
    }

    .approvals-container {
        margin-top: 35px !important;
        font-size: 14px !important;
        page-break-inside: auto !important;
        break-inside: auto !important;
    }

    .approval-row {
        display: flex !important;
        justify-content: space-between !important;
        gap: 40px !important;
        margin-bottom: 20px !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
    }

    .signature-group {
        width: 42% !important;
    }

    .label {
        font-weight: bold !important;
        margin-bottom: 30px !important;
        font-size: 14px !important;
    }

    .signature-line {
        border-bottom: 1.5px solid #000 !important;
        min-height: 20px !important;
        margin-bottom: 5px !important;
    }

    .title {
        font-size: 13px !important;
    }

    .bold {
        font-weight: bold !important;
    }

    .approval-centered {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
    }

    .left-align {
        width: 100% !important;
        text-align: left !important;
    }

    .admin-block {
        text-align: center !important;
        margin-top: 25px !important;
        margin-bottom: 10px !important;
    }

    .name-underlined {
        display: inline-block !important;
        font-size: 15px !important;
        font-weight: bold !important;
        text-decoration: underline !important;
        text-transform: uppercase !important;
        min-width: 220px !important;
    }

    .document-info {
        margin-top: 45px !important;
        width: 305px !important;
        max-width: 305px !important;
        min-width: 0 !important;
        margin-right: auto !important;
        margin-left: 0 !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        overflow: hidden !important;
    }

    .doc-header {
        width: 305px !important;
        max-width: 305px !important;
        min-width: 0 !important;
        table-layout: fixed !important;
        border-collapse: collapse !important;
        font-size: 11px !important;
    }

    .doc-header td {
        border: 1px solid #000 !important;
        padding: 4px 5px !important;
        font-size: 11px !important;
        line-height: 1.15 !important;
        vertical-align: middle !important;
        overflow-wrap: break-word !important;
        word-break: normal !important;
    }

    .doc-header .label {
        background-color: #002060 !important;
        color: white !important;
        font-weight: bold !important;
        width: 95px !important;
        white-space: nowrap !important;
        text-align: left !important;
        font-size: 11px !important;
        margin: 0 !important;
    }

    .doc-header td:nth-child(2) {
        width: 12px !important;
        text-align: center !important;
        font-weight: bold !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
    }

    .doc-header td.value {
        width: 198px !important;
        text-align: left !important;
    }

    .doc-header td.value input,
    .doc-header td.value p,
    .doc-header input,
    .doc-header p {
        width: 100% !important;
        max-width: 100% !important;
        border: none !important;
        background: transparent !important;
        margin: 0 !important;
        padding: 0 !important;
        font-family: inherit !important;
        font-size: inherit !important;
        color: #000 !important;
        outline: none !important;
        box-shadow: none !important;
    }

    .footer-bottom,
    .footer-logos {
        display: flex !important;
        align-items: flex-end !important;
        justify-content: flex-end !important;
        width: 100% !important;
        max-width: 100% !important;
        overflow: hidden !important;
    }

    .footer-logos img {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
        height: auto !important;
        max-height: 72px !important;
        object-fit: contain !important;
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
        outline: none !important;
        box-shadow: none !important;
    }

    img {
        max-width: 100% !important;
        height: auto !important;
        object-fit: contain !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
    }

    h1, h2, h3, h4, h5, h6, p {
        max-width: 100% !important;
        overflow-wrap: break-word !important;
        page-break-after: avoid !important;
        break-after: avoid-page !important;
        orphans: 3;
        widows: 3;
    }

    .category-row,
    .evaluation-table thead th {
        background-color: #f2f2f2 !important;
        font-weight: bold !important;
    }

    @media print {
        body {
            background: white !important;
        }
    }
</style>
</head>

<body>
    <div class="print-container">
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
                        <div class="print-body">${formHTML}</div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</body>
</html>
    `);
    doc.close();

    await waitForImages(doc);
    await waitForFonts(doc);
    await nextFrame(iframe.contentWindow);
    await nextFrame(iframe.contentWindow);

    iframe.contentWindow.focus();
    iframe.contentWindow.print();

    const cleanup = () => {
        iframe.remove();
        iframe.contentWindow.removeEventListener('afterprint', cleanup);
    };

    iframe.contentWindow.addEventListener('afterprint', cleanup);

    setTimeout(() => {
        if (document.body.contains(iframe)) {
            iframe.remove();
        }
    }, 3000);
}

function fixFormStatesForPrint(cloneElement) {
    const rows = cloneElement.querySelectorAll('.evaluation-table tbody tr');

    rows.forEach((row) => {
        const categoryCell = row.querySelector('.category-row td, td[colspan="5"]');
        const categoryText = categoryCell ? categoryCell.textContent.trim() : '';

        if (categoryText === 'Program Relevance') {
            let currentRow = row.nextElementSibling;

            while (currentRow && !currentRow.classList.contains('category-row')) {
                const radios = currentRow.querySelectorAll('input[type="radio"]');

                radios.forEach((radio) => {
                    radio.checked = false;
                    radio.removeAttribute('checked');
                });

                currentRow = currentRow.nextElementSibling;
            }
        }
    });

    const radios = cloneElement.querySelectorAll('input[type="radio"]');

    radios.forEach((radio) => {
        const row = radio.closest('tr');
        const isProgramRelevance = row && row.dataset.removeProgramRelevanceCheck === 'true';

        if (isProgramRelevance) {
            radio.checked = false;
            radio.removeAttribute('checked');
            return;
        }

        if (radio.checked) {
            radio.setAttribute('checked', 'checked');
        } else {
            radio.removeAttribute('checked');
        }

        if (radio.name) {
            radio.setAttribute('name', radio.name);
        }
    });

    removeProgramRelevanceChecks(cloneElement);

    const checkboxes = cloneElement.querySelectorAll('input[type="checkbox"]');

    checkboxes.forEach((checkbox) => {
        if (checkbox.checked) {
            checkbox.setAttribute('checked', 'checked');
        } else {
            checkbox.removeAttribute('checked');
        }
    });

    const inputs = cloneElement.querySelectorAll('input, textarea, select');

    inputs.forEach((input) => {
        const tag = input.tagName.toLowerCase();

        if (tag === 'textarea') {
            input.textContent = input.value || '';
            return;
        }

        if (tag === 'select') {
            [...input.options].forEach((option) => {
                if (option.selected) {
                    option.setAttribute('selected', 'selected');
                } else {
                    option.removeAttribute('selected');
                }
            });
            return;
        }

        const type = (input.getAttribute('type') || '').toLowerCase();

        if (
            type !== 'radio' &&
            type !== 'checkbox' &&
            type !== 'button' &&
            type !== 'submit' &&
            type !== 'reset' &&
            type !== 'file' &&
            type !== 'password'
        ) {
            input.setAttribute('value', input.value || '');
        }
    });
}

function removeProgramRelevanceChecks(cloneElement) {
    const categoryRows = cloneElement.querySelectorAll('.evaluation-table tbody tr.category-row');

    categoryRows.forEach((categoryRow) => {
        const text = categoryRow.textContent.trim();

        if (text !== 'Program Relevance') return;

        let row = categoryRow.nextElementSibling;

        while (row && !row.classList.contains('category-row')) {
            const radios = row.querySelectorAll('input[type="radio"]');

            radios.forEach((radio) => {
                radio.checked = false;
                radio.removeAttribute('checked');
                radio.defaultChecked = false;
            });

            row = row.nextElementSibling;
        }
    });
}

function waitForImages(doc) {
    const images = Array.from(doc.querySelectorAll('img'));

    if (!images.length) return Promise.resolve();

    return Promise.all(
        images.map((img) => {
            if (img.complete && img.naturalWidth > 0) {
                return Promise.resolve();
            }

            return new Promise((resolve) => {
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
    } catch (error) {
        console.warn('Font loading skipped:', error);
    }
}

function nextFrame(win) {
    return new Promise((resolve) => {
        win.requestAnimationFrame(() => resolve());
    });
}

window.printReport = printReport;