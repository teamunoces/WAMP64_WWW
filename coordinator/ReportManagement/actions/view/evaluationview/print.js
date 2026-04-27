// print.js - Fixed print view right-overlap/cut issue
function printReport() {
    const evaluationContainer = document.querySelector('.evaluation-container');
    const evaluationForm = document.getElementById('evaluationForm');

    if (!evaluationContainer || !evaluationForm) {
        console.error('Evaluation content not found');
        alert('Could not find evaluation content to print');
        return;
    }

    const oldPrint = document.getElementById('print-container');
    if (oldPrint) oldPrint.remove();

    const oldStyle = document.querySelector('style[data-print-runtime]');
    if (oldStyle) oldStyle.remove();

    const printClone = evaluationContainer.cloneNode(true);
    fixFormStatesForPrint(printClone);

    const headerElements = [...printClone.querySelectorAll('header')];
    const footerElement = printClone.querySelector('footer');
    const formElement = printClone.querySelector('#evaluationForm');

    const headerHTML = headerElements.map(header => header.outerHTML).join('');
    const footerHTML = footerElement ? footerElement.outerHTML : '';
    const formHTML = formElement ? formElement.outerHTML : '';

    const printContainer = document.createElement('div');
    printContainer.id = 'print-container';

    printContainer.innerHTML = `
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
    `;

    const styleElement = document.createElement('style');
    styleElement.setAttribute('data-print-runtime', 'true');

    styleElement.textContent = `
        * {
            box-sizing: border-box !important;
        }

        @media print {
            @page {
                size: A4 portrait;
                margin: 12mm;
            }

            html,
            body {
                width: 100% !important;
                max-width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                overflow: visible !important;
                background: #fff !important;
                font-family: Arial, sans-serif;
                font-size: 12px;
                line-height: 1.4;
                color: #333;
            }

            body > *:not(#print-container):not(style[data-print-runtime]) {
                display: none !important;
            }

            #print-container {
                display: block !important;
                width: 100% !important;
                max-width: 100% !important;
                min-width: 0 !important;
                margin: 0 !important;
                padding: 0 !important;
                overflow: visible !important;
                background: white !important;
                border: none !important;
                outline: none !important;
                box-shadow: none !important;
            }

            #sidebarFrame,
            #headerFrame,
            .buttons,
            .admin-comment,
            .action-buttons,
            .wrapper {
                display: none !important;
            }

            .print-shell {
                width: 100% !important;
                max-width: 100% !important;
                min-width: 0 !important;
                margin: 0 !important;
                padding: 0 !important;
                border-collapse: collapse !important;
                border-spacing: 0 !important;
                table-layout: fixed !important;
                background: white !important;
                border: none !important;
                outline: none !important;
                box-shadow: none !important;
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
                overflow: visible !important;
                background: white !important;
            }

            .print-header,
            .print-footer,
            .print-body,
            .evaluation-container,
            #evaluationForm {
                width: 100% !important;
                max-width: 100% !important;
                min-width: 0 !important;
                margin-left: 0 !important;
                margin-right: 0 !important;
                padding-left: 0 !important;
                padding-right: 0 !important;
                overflow: visible !important;
                border: none !important;
                outline: none !important;
                box-shadow: none !important;
                background: white !important;
            }

            .print-header {
                padding-bottom: 8px !important;
            }

            .print-footer {
                padding-top: 8px !important;
            }

            .print-body {
                padding: 0 !important;
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
                border: none !important;
                outline: none !important;
                box-shadow: none !important;
            }

            .header-content {
                display: flex !important;
                align-items: center !important;
                justify-content: space-between !important;
                gap: 8px !important;
                flex-wrap: nowrap !important;
                margin: 0 0 8px 0 !important;
                padding: 0 !important;
            }

            .logo-left {
                height: 75px !important;
                width: auto !important;
                max-width: 18% !important;
                flex: 0 0 auto !important;
                object-fit: contain !important;
            }

            .logo-left2 {
                height: 75px !important;
                width: auto !important;
                max-width: 18% !important;
                flex: 0 0 auto !important;
                object-fit: contain !important;
            }

            .logos-right {
                display: flex !important;
                gap: 4px !important;
                align-items: center !important;
                justify-content: flex-end !important;
                max-width: 100% !important;
                flex: 0 0 auto !important;
            }

            .logos-right img {
                height: 75px !important;
                width: auto !important;
                max-width: 100% !important;
                object-fit: contain !important;
            }

            .college-info {
                flex: 1 1 auto !important;
                min-width: 0 !important;
                max-width: 58% !important;
                text-align: center !important;
                padding: 0 4px !important;
                overflow-wrap: break-word !important;
                word-break: normal !important;
            }

            .college-info h1 {
                font-family: "Times New Roman", Times, serif;
                color: #4f81bd !important;
                font-size: 22px !important;
                margin: 0 !important;
                font-weight: normal !important;
                line-height: 1.1 !important;
            }

            .college-info p {
                font-size: 10px !important;
                margin: 1px 0 !important;
                line-height: 1.2 !important;
            }

            .college-info a {
                font-size: 10px !important;
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

            header h1 {
                text-align: center !important;
                font-size: 16px !important;
                text-decoration: underline !important;
                margin: 10px 0 15px 0 !important;
            }

            .header-info,
            .input-line,
            .checkbox-grid,
            .signature-section,
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
            }

            .header-info label {
                flex: 0 0 auto !important;
                font-weight: bold !important;
                margin-right: 8px !important;
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

            table,
            .legend-table,
            .evaluation-table,
            .doc-header {
                width: 100% !important;
                max-width: 100% !important;
                min-width: 0 !important;
                table-layout: fixed !important;
                border-collapse: collapse !important;
                overflow-wrap: break-word !important;
                word-wrap: break-word !important;
                word-break: normal !important;
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
            .evaluation-table td,
            .doc-header th,
            .doc-header td {
                border: 1px solid #000 !important;
                padding: 6px !important;
                vertical-align: top !important;
            }

            .legend-table tr,
            .evaluation-table tr,
            .doc-header tr {
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

            .document-info {
                margin-top: 45px !important;
                width: auto !important;
                max-width: 305px !important;
                margin-right: auto !important;
                margin-left: 0 !important;
                page-break-inside: avoid !important;
                break-inside: avoid !important;
            }

            .doc-header {
                width: 305px !important;
                max-width: 305px !important;
                font-size: 11px !important;
            }

            .doc-header .label {
                background-color: #002060 !important;
                color: white !important;
                font-weight: bold !important;
                width: 95px !important;
                white-space: nowrap !important;
                text-align: left !important;
            }

            .doc-header td.value {
                width: 210px !important;
                text-align: left !important;
            }

            .doc-header td.value input,
            .doc-header td.value p {
                width: 100% !important;
                border: none !important;
                background: transparent !important;
                margin: 0 !important;
                padding: 0 !important;
            }

            .footer-bottom,
            .footer-logos {
                display: flex !important;
                align-items: flex-end !important;
                justify-content: flex-end !important;
            }

            .footer-logos img {
                display: block !important;
                width: 100% !important;
                max-width: 100% !important;
                height: auto !important;
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
            }

            * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
        }
    `;

    document.head.appendChild(styleElement);
    document.body.appendChild(printContainer);

    const cleanup = () => {
        printContainer.remove();
        styleElement.remove();
        window.removeEventListener('afterprint', cleanup);
    };

    window.addEventListener('afterprint', cleanup);

    setTimeout(() => {
        window.print();
    }, 300);

    setTimeout(cleanup, 2000);
}

function fixFormStatesForPrint(cloneElement) {
    const radios = cloneElement.querySelectorAll('input[type="radio"]');
    radios.forEach((radio) => {
        if (radio.checked) {
            radio.setAttribute('checked', 'checked');
        } else {
            radio.removeAttribute('checked');
        }

        if (radio.name) {
            radio.setAttribute('name', radio.name);
        }
    });

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

window.printReport = printReport;