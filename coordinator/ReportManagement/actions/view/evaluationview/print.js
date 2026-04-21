// print.js - Print the evaluation sheet with repeating header/footer and no margin line
function printReport() {
    const evaluationContainer = document.querySelector('.evaluation-container');
    const evaluationForm = document.getElementById('evaluationForm');

    if (!evaluationContainer || !evaluationForm) {
        console.error('Evaluation content not found');
        alert('Could not find evaluation content to print');
        return;
    }

    // Clone the printable layout
    const printClone = evaluationContainer.cloneNode(true);

    // Preserve current form states in the clone
    fixFormStatesForPrint(printClone);

    // Extract header(s), footer, and form from the cloned layout
    const headerElements = [...printClone.querySelectorAll('header')];
    const footerElement = printClone.querySelector('footer');
    const formElement = printClone.querySelector('#evaluationForm');

    const headerHTML = headerElements.map(header => header.outerHTML).join('');
    const footerHTML = footerElement ? footerElement.outerHTML : '';
    const formHTML = formElement ? formElement.outerHTML : '';

    // Create print-only container
    const printContainer = document.createElement('div');
    printContainer.id = 'print-container';

    // Use a print table shell so thead/tfoot repeat during printing
    printContainer.innerHTML = `
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
                            ${formHTML}
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    `;

    const styleElement = document.createElement('style');
    styleElement.setAttribute('data-print-runtime', 'true');
    styleElement.textContent = `
        * {
            box-sizing: border-box;
        }

        @media print {
            @page {
                margin: 12mm;
                size: auto;
            }

            html, body {
                margin: 0 !important;
                padding: 0 !important;
                border: none !important;
                outline: none !important;
                background: white !important;
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
                width: 100%;
                margin: 0 !important;
                padding: 0 !important;
                border: none !important;
                outline: none !important;
                background: white !important;
            }

            /* Hide screen-only elements */
            #sidebarFrame,
            #headerFrame,
            .buttons,
            .admin-comment,
            .action-buttons,
            .wrapper {
                display: none !important;
            }

            /* Print shell */
            .print-shell {
                width: 100%;
                margin: 0 !important;
                padding: 0 !important;
                border-collapse: collapse;
                border-spacing: 0;
                table-layout: fixed;
                border: none !important;
                outline: none !important;
                background: white !important;
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
                vertical-align: top;
                background: white !important;
            }

            /* Repeating header/footer containers */
            .print-header,
            .print-footer,
            .print-body {
                width: 100%;
                margin: 0 !important;
                background: white !important;
                border: none !important;
                outline: none !important;
                box-shadow: none !important;
            }

            .print-header {
                padding: 0 0 10px 0 !important;
            }

            .print-footer {
                padding: 10px 0 0 0 !important;
            }

            .print-body {
                padding: 0 !important;
            }

            /* Neutralize outer layout box */
            .evaluation-container {
                max-width: none !important;
                width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                border: none !important;
                outline: none !important;
                box-shadow: none !important;
                background: white !important;
            }

            #evaluationForm {
                margin: 0 !important;
                padding: 0 !important;
                border: none !important;
                outline: none !important;
                box-shadow: none !important;
                background: white !important;
                pointer-events: none;
            }

            /* Remove margin lines from header/footer/layout */
            header,
            footer,
            .print-header,
            .print-footer,
            .header-content,
            .footer-bottom,
            .footer-logos {
                border: none !important;
                outline: none !important;
                box-shadow: none !important;
            }

            /* Header layout */
            .header-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 100%;
                gap: 12px;
                flex-wrap: nowrap;
                margin: 0 0 10px 0 !important;
                padding: 0 !important;
            }

            .logo-left {
                height: 90px;
                width: auto;
                flex: 0 0 auto;
            }

            .logos-right {
                display: flex;
                gap: 20px;
                align-items: center;
                flex: 0 0 auto;
            }

            .logos-right img {
                height: 80px;
                width: auto;
            }

            .college-info {
                text-align: center;
                flex: 1 1 auto;
                padding: 0 10px;
            }

            .college-info h1 {
                font-family: "Times New Roman", Times, serif;
                color: #4f81bd !important;
                font-size: 26px;
                margin: 0;
                font-weight: normal;
                line-height: 1.2;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }

            .college-info p {
                font-size: 11px;
                margin: 2px 0;
                color: #333;
                line-height: 1.3;
            }

            .college-info a {
                font-size: 13px;
                color: #0000EE !important;
                text-decoration: underline;
                word-break: break-all;
            }

            .office-title {
                text-align: center;
                font-size: 18px;
                color: #595959 !important;
                font-weight: bold;
                margin: 5px 0;
                letter-spacing: 0.5px;
                text-transform: uppercase;
            }

            .double-line {
                border-top: 4px double #4f81bd !important;
                margin-bottom: 15px;
            }

            header h1 {
                text-align: center;
                font-size: 18px;
                text-decoration: underline;
                margin: 15px 0 20px 0;
            }

            /* Form top section */
            .header-info .input-line {
                display: flex;
                margin-bottom: 10px;
                align-items: flex-end;
                flex-wrap: wrap;
            }

            .header-info label {
                font-weight: bold;
                margin-right: 10px;
                white-space: nowrap;
            }

            .full-line {
                border: none !important;
                border-bottom: 1px solid #000 !important;
                flex-grow: 1;
                background: transparent !important;
                font-family: inherit;
                font-size: inherit;
                padding: 4px 0;
                outline: none !important;
                box-shadow: none !important;
            }

            .checkbox-grid {
                display: flex;
                justify-content: space-between;
                margin: 20px 0;
                flex-wrap: wrap;
            }

            .checkbox-grid .column {
                width: 48%;
            }

            .checkbox-grid label {
                display: block;
                margin-bottom: 5px;
            }

            /* Inner content tables only */
            .legend-table,
            .evaluation-table,
            .doc-header {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
                page-break-inside: auto;
                break-inside: auto;
            }

            .legend-table th,
            .legend-table td,
            .evaluation-table th,
            .evaluation-table td,
            .doc-header th,
            .doc-header td {
                border: 1px solid #000 !important;
            }

            .legend-table td,
            .evaluation-table td,
            .doc-header td {
                padding: 8px;
                vertical-align: top;
            }

            .legend-table tr,
            .evaluation-table tr,
            .doc-header tr {
                page-break-inside: avoid;
                break-inside: avoid;
            }

            .evaluation-table thead {
                display: table-header-group;
            }

            .evaluation-table tbody {
                display: table-row-group;
            }

            .legend-table td.score-cell {
                width: 40px;
                text-align: center;
                font-weight: bold;
                vertical-align: middle;
            }

            .evaluation-table thead th {
                background-color: #f2f2f2 !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }

            .evaluation-table .num-col {
                width: 40px;
                text-align: center;
            }

            .category-row {
                background-color: #e9e9e9 !important;
                font-weight: bold;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }

            tr td em {
                font-size: 11px;
                display: block;
                margin-top: 2px;
            }

            /* Radio / checkbox */
            .radio-cell {
                text-align: center;
                vertical-align: middle;
            }

            input[type="radio"] {
                -webkit-appearance: radio !important;
                appearance: radio !important;
                opacity: 1 !important;
                display: inline-block !important;
                transform: scale(1.1) !important;
                margin: 0 4px !important;
                width: 16px !important;
                height: 16px !important;
                accent-color: #dc2626 !important;
                color: #dc2626 !important;
                background-color: transparent !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }

            input[type="radio"]::before,
            input[type="radio"]::after {
                display: none !important;
                content: none !important;
            }

            input[type="checkbox"] {
                accent-color: #dc2626 !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }

            /* Signature */
            .signature-section {
                margin-top: 40px;
                page-break-inside: avoid;
                break-inside: avoid;
            }

            .sig-line {
                margin-bottom: 10px;
                font-weight: bold;
                display: flex;
                align-items: center;
                flex-wrap: wrap;
            }

            .sig-input {
                border: none !important;
                border-bottom: 1px solid #000 !important;
                background: transparent !important;
                width: 280px;
                font-family: inherit;
                font-size: inherit;
                margin-left: 10px;
                padding: 4px 0;
                outline: none !important;
                box-shadow: none !important;
            }

            /* Document info */
            .document-info {
                margin-top: 50px;
                width: 30%;
                page-break-inside: avoid;
                break-inside: avoid;
            }

            .doc-header {
                width: auto;
                margin-right: auto;
                border-collapse: collapse;
                font-family: Arial, sans-serif;
                font-size: 11px;
                border: 1px solid #d1d1d1;
            }

            .doc-header td {
                padding: 5px 10px;
            }

            .doc-header .label {
                background-color: #002060 !important;
                color: white !important;
                width: 25%;
                font-size: 11px;
                font-weight: bold;
                padding: 4px 8px;
                text-align: left;
                white-space: nowrap;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }

            .doc-header td.value {
                width: 70%;
                font-size: 11px;
                text-align: left;
                padding: 4px 10px;
            }

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
                outline: none !important;
                box-shadow: none !important;
            }

            /* Footer image */
            footer {
                width: 100%;
                margin: 0 !important;
                padding: 0 !important;
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

            .footer-logos img {
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

            /* Page-break hygiene */
            h1, h2, h3, h4, h5, h6, p {
                page-break-after: avoid;
                break-after: avoid-page;
                orphans: 3;
                widows: 3;
            }

            img {
                max-width: 100%;
                height: auto;
                page-break-inside: avoid;
                break-inside: avoid;
            }

            * {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
        }
    `;

    document.head.appendChild(styleElement);
    document.body.appendChild(printContainer);

    const cleanup = () => {
        if (printContainer.parentNode) {
            printContainer.parentNode.removeChild(printContainer);
        }
        if (styleElement.parentNode) {
            styleElement.parentNode.removeChild(styleElement);
        }
        window.removeEventListener('afterprint', cleanup);
    };

    window.addEventListener('afterprint', cleanup);
    window.print();

    // Fallback cleanup
    setTimeout(cleanup, 1000);
}

function fixFormStatesForPrint(cloneElement) {
    // Preserve radio checked states
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

    // Preserve checkbox checked states
    const checkboxes = cloneElement.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
        if (checkbox.checked) {
            checkbox.setAttribute('checked', 'checked');
        } else {
            checkbox.removeAttribute('checked');
        }
    });

    // Preserve text/date/other input values
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