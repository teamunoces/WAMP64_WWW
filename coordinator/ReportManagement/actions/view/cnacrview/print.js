// print.js
function printReport() {
    const reportContainer = document.querySelector('.report-container');

    if (!reportContainer) {
        console.error('Report container not found');
        alert('Could not find report content to print.');
        return;
    }

    // Clone the printable report
    const printClone = reportContainer.cloneNode(true);
    syncFormValues(reportContainer, printClone);

    // Extract repeating header/footer from the clone
    const headerElements = [...printClone.querySelectorAll('header')];
    const footerElement = printClone.querySelector('footer');

    const headerHTML = headerElements.map(el => el.outerHTML).join('');
    const footerHTML = footerElement ? footerElement.outerHTML : '';

    // Remove header/footer from the body clone so they do not duplicate
    headerElements.forEach(el => el.remove());
    if (footerElement) footerElement.remove();

    const printContainer = document.createElement('div');
    printContainer.id = 'print-runtime-root';

    printContainer.innerHTML = `
        <div class="print-header" id="printHeader">
            ${headerHTML}
        </div>

        <div class="print-footer" id="printFooter">
            ${footerHTML}
        </div>

        <div class="print-body" id="printBody">
            ${printClone.innerHTML}
        </div>
    `;

    const styleEl = document.createElement('style');
    styleEl.setAttribute('data-print-runtime', 'true');
    styleEl.textContent = `
        :root {
            --print-header-height: 160px;
            --print-footer-height: 80px;
            --print-page-side: 0.5in;
        }

        @media print {
            @page {
                size: portrait;
                margin: 0.5in;
            }

            * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                box-sizing: border-box;
            }

            html, body {
                margin: 0 !important;
                padding: 0 !important;
                background: white !important;
            }

            body > *:not(#print-runtime-root):not(style[data-print-runtime]) {
                display: none !important;
            }

            #print-runtime-root {
                display: block !important;
                width: 100%;
                background: white !important;
            }

            #sidebarFrame,
            #headerFrame,
            .buttons,
            .admin-comment {
                display: none !important;
            }

            .print-header,
            .print-footer {
                position: fixed;
                left: 0;
                right: 0;
                z-index: 9999;
                background: white !important;
                border: none !important;
                outline: none !important;
                box-shadow: none !important;
            }

            .print-header {
                top: 0;
                padding: 0.2in var(--print-page-side) 0.08in var(--print-page-side);
            }

            .print-footer {
                bottom: 0;
                padding: 0.08in var(--print-page-side) 0.2in var(--print-page-side);
            }

            .print-body {
                width: 100%;
                margin: 0 !important;
                padding:
                    calc(var(--print-header-height) + 0.12in)
                    var(--print-page-side)
                    calc(var(--print-footer-height) + 0.12in)
                    var(--print-page-side) !important;
                background: white !important;
            }

            .print-body,
            .print-header,
            .print-footer,
            header,
            footer,
            .header-content,
            .footer-bottom,
            .footer-logos {
                border: none !important;
                outline: none !important;
                box-shadow: none !important;
            }

            .report-container {
                margin: 0 !important;
                padding: 0 !important;
                width: 100% !important;
                max-width: 100% !important;
                box-shadow: none !important;
                background-color: white !important;
                border-radius: 0 !important;
            }

            /* Preserve header styles */
            .header-content {
                display: flex !important;
                align-items: center !important;
                justify-content: space-between !important;
                margin-bottom: 15px !important;
                width: 100% !important;
                gap: 12px !important;
                flex-wrap: nowrap !important;
            }

            .logo-left,
            .logos-right img {
                height: 80px !important;
                width: auto !important;
                max-width: 100% !important;
            }

            .college-info {
                flex: 1 1 auto !important;
                min-width: 0 !important;
                text-align: center !important;
            }

            .college-info h1 {
                color: #4f81bd !important;
                font-size: 24px !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }

            .college-info p {
                margin: 2px 0 !important;
            }

            /* Header Grid */
            .header-grid {
                display: grid !important;
                grid-template-columns: 145px 1fr 150px 1fr !important;
                border: 1px solid #000 !important;
                margin-bottom: 30px !important;
            }

            .bg-gray {
                background-color: #b3b3b3 !important;
            }

            /* Section headers */
            .section-header {
                background-color: #b3b3b3 !important;
                border: 1px solid #000 !important;
                margin-top: 20px !important;
            }

            /* Paper lines */
            .paper-lines {
                background-image: linear-gradient(to bottom, transparent 29px, #000 29px) !important;
                background-size: 100% 30px !important;
            }

            /* Preserve approval row layout */
            .approval-row {
                display: flex !important;
                flex-direction: row !important;
                justify-content: space-between !important;
                gap: 24px !important;
                margin-bottom: 20px !important;
            }

            .signature-group {
                width: 35% !important;
            }

            .signature-line {
                border-bottom: 1.5px solid black !important;
                margin-bottom: 5px !important;
            }

            .name-underlined {
                text-decoration: underline !important;
            }

            .doc-header td.label {
                background-color: #002060 !important;
                color: white !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }

            .double-line {
                border-top: 4px double #4f81bd !important;
                margin-bottom: 20px !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }

            .office-title {
                color: #595959 !important;
            }

            .approvals-container,
            .document-info,
            .section-header,
            .approval-row,
            .signature-group,
            .approval-centered {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
            }

            img {
                max-width: 100%;
                height: auto;
                page-break-inside: avoid !important;
                break-inside: avoid !important;
            }

            footer {
                margin: 0 !important;
                width: 100% !important;
            }
        }
    `;

    document.head.appendChild(styleEl);
    document.body.appendChild(printContainer);

    const applyMeasuredOffsets = () => {
        const header = document.getElementById('printHeader');
        const footer = document.getElementById('printFooter');

        if (!header || !footer) return;

        const headerHeight = Math.ceil(header.getBoundingClientRect().height);
        const footerHeight = Math.ceil(footer.getBoundingClientRect().height);

        document.documentElement.style.setProperty('--print-header-height', `${headerHeight}px`);
        document.documentElement.style.setProperty('--print-footer-height', `${footerHeight}px`);
    };

    const cleanup = () => {
        window.removeEventListener('afterprint', cleanup);
        if (printContainer.parentNode) printContainer.parentNode.removeChild(printContainer);
        if (styleEl.parentNode) styleEl.parentNode.removeChild(styleEl);
        document.documentElement.style.removeProperty('--print-header-height');
        document.documentElement.style.removeProperty('--print-footer-height');
    };

    requestAnimationFrame(() => {
        applyMeasuredOffsets();

        const images = [...printContainer.querySelectorAll('img')];
        if (!images.length) {
            window.addEventListener('afterprint', cleanup, { once: true });
            window.print();
            setTimeout(cleanup, 1500);
            return;
        }

        let done = 0;
        const finish = () => {
            done += 1;
            if (done >= images.length) {
                applyMeasuredOffsets();
                window.addEventListener('afterprint', cleanup, { once: true });
                window.print();
                setTimeout(cleanup, 1500);
            }
        };

        images.forEach((img) => {
            if (img.complete) {
                finish();
            } else {
                img.addEventListener('load', finish, { once: true });
                img.addEventListener('error', finish, { once: true });
            }
        });
    });
}

function syncFormValues(source, clone) {
    const sourceInputs = source.querySelectorAll('input, textarea, select');
    const cloneInputs = clone.querySelectorAll('input, textarea, select');

    sourceInputs.forEach((original, index) => {
        const target = cloneInputs[index];
        if (!target) return;

        const tag = target.tagName.toLowerCase();
        const type = (target.getAttribute('type') || '').toLowerCase();

        if (type === 'checkbox' || type === 'radio') {
            if (original.checked) {
                target.setAttribute('checked', 'checked');
                target.checked = true;
            } else {
                target.removeAttribute('checked');
                target.checked = false;
            }
            return;
        }

        if (tag === 'textarea') {
            target.value = original.value;
            target.textContent = original.value;
            return;
        }

        if (tag === 'select') {
            [...target.options].forEach((opt, i) => {
                opt.selected = original.options[i]?.selected || false;
                if (opt.selected) opt.setAttribute('selected', 'selected');
                else opt.removeAttribute('selected');
            });
            return;
        }

        target.value = original.value;
        target.setAttribute('value', original.value || '');
    });
}

window.printReport = printReport;