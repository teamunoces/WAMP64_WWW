/**
 * download.js - Handle PDF download of narrative report
 * Fixed: Proper approval section matching CSS layout
 */

function loadLibraries() {
    return new Promise((resolve, reject) => {
        if (window.html2canvas && window.jspdf) {
            resolve();
            return;
        }
        const libs = [
            'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
        ];
        let loadedCount = 0;
        libs.forEach(src => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => {
                loadedCount++;
                if (loadedCount === libs.length) resolve();
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    });
}

async function downloadPDF() {
    const button = document.getElementById('downloadPDF');
    const originalText = button.textContent;

    try {
        button.textContent = 'Generating PDF...';
        button.disabled = true;

        await loadLibraries();
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');

        const margin = 20;
        const pageWidth = 210;
        const pageHeight = 297;
        const contentWidth = pageWidth - (margin * 2);
        let currentY = margin;

        // Helper function to check and add new page
        function checkPage(neededSpace = 20) {
            if (currentY + neededSpace > pageHeight - margin) {
                pdf.addPage();
                currentY = margin;
                return true;
            }
            return false;
        }

        // 1. CAPTURE HEADER (As Image for Logo/Branding)
        const header = document.querySelector('.report-container header');
        if (header) {
            const canvas = await html2canvas(header, { scale: 2, backgroundColor: '#ffffff' });
            const imgHeight = (canvas.height * contentWidth) / canvas.width;
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', margin, currentY, contentWidth, imgHeight);
            currentY += imgHeight + 10;
        }

        // 2. MAIN TITLE
        checkPage(20);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text("MONTHLY ACCOMPLISHMENT REPORT - NARRATIVE REPORT", pageWidth / 2, currentY, { align: 'center' });
        currentY += 15;

        // 3. NARRATIVE SECTIONS (I to IV)
        const sections = [
            { id: 'narrate_success', title: 'I. Narrate Success' },
            { id: 'provide_data', title: 'II. Provide Data' },
            { id: 'identify_problems', title: 'III. Identify Problems' },
            { id: 'propose_solutions', title: 'IV. Propose Solutions' }
        ];

        for (const sec of sections) {
            const val = document.getElementById(sec.id)?.value || "";
            
            checkPage(20);
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'bold');
            pdf.text(sec.title, margin, currentY);
            currentY += 8;

            pdf.setFontSize(11);
            pdf.setFont('helvetica', 'normal');
            const lines = pdf.splitTextToSize(val || '_________________________', contentWidth);
            
            for (const line of lines) {
                if (currentY > pageHeight - margin - 10) {
                    pdf.addPage();
                    currentY = margin;
                }
                pdf.text(line, margin, currentY);
                currentY += 6;
            }
            currentY += 10;
        }

        // 4. APPROVAL SECTION (Matching CSS Layout)
        const getSignatory = (id) => {
            const element = document.getElementById(id);
            return element?.textContent?.trim() || '';
        };

        // Check space for approvals
        checkPage(150);

        // Prepared by section (signature-group layout)
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Prepared by:', margin, currentY);
        currentY += 12;
        
        // Signature line
        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(0.3);
        pdf.line(margin, currentY, margin + 70, currentY);
        currentY += 3;
        
        const preparedByName = getSignatory('created_by_name') || '_________________________';
        pdf.setFont('helvetica', 'normal');
        pdf.text(preparedByName, margin, currentY);
        currentY += 8;
        
        pdf.setFont('helvetica', 'bold');
        pdf.text('CES Coordinator', margin, currentY);
        currentY += 25;

        // Noted by section (two signature groups side by side)
        pdf.setFont('helvetica', 'bold');
        pdf.text('Noted by:', margin, currentY);
        currentY += 12;
        
        // Dean signature group (left)
        pdf.setFont('helvetica', 'normal');
        pdf.text('Dean:', margin, currentY);
        currentY += 8;
        
        pdf.line(margin, currentY, margin + 70, currentY);
        currentY += 3;
        
        const deanName = getSignatory('dean') || '_________________________';
        pdf.text(deanName, margin, currentY);
        currentY += 8;
        pdf.setFont('helvetica', 'bold');
        pdf.text('Dean', margin, currentY);
        currentY += 5;
        
        // CES Head signature group (right)
        pdf.setFont('helvetica', 'normal');
        pdf.text('CES Head:', margin + 100, currentY - 25);
        currentY = currentY - 17;
        pdf.line(margin + 100, currentY, margin + 170, currentY);
        currentY += 3;
        
        const cesHeadName = getSignatory('ces_head') || '_________________________';
        pdf.text(cesHeadName, margin + 100, currentY);
        currentY += 8;
        pdf.setFont('helvetica', 'bold');
        pdf.text('CES Head', margin + 100, currentY);
        currentY += 20;

        // Recommending Approval section (centered)
        checkPage(80);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Recommending Approval:', margin, currentY);
        currentY += 12;
        
        // VP Academic Affairs (centered)
        const vpAcadName = getSignatory('vp_acad') || '_________________________';
        pdf.setFont('helvetica', 'normal');
        const vpAcadWidth = pdf.getStringUnitWidth(vpAcadName) * 11 / pdf.internal.scaleFactor;
        pdf.text(vpAcadName, pageWidth / 2 - vpAcadWidth / 2, currentY);
        currentY += 8;
        
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        const vpAcadTitle = 'Vice-President for Academic Affairs and Research';
        const vpAcadTitleWidth = pdf.getStringUnitWidth(vpAcadTitle) * 9 / pdf.internal.scaleFactor;
        pdf.text(vpAcadTitle, pageWidth / 2 - vpAcadTitleWidth / 2, currentY);
        currentY += 15;
        
        // VP Administrative Affairs (centered)
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        const vpAdminName = getSignatory('vp_admin') || '_________________________';
        const vpAdminWidth = pdf.getStringUnitWidth(vpAdminName) * 11 / pdf.internal.scaleFactor;
        pdf.text(vpAdminName, pageWidth / 2 - vpAdminWidth / 2, currentY);
        currentY += 8;
        
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        const vpAdminTitle = 'Vice-President for Administrative Affairs';
        const vpAdminTitleWidth = pdf.getStringUnitWidth(vpAdminTitle) * 9 / pdf.internal.scaleFactor;
        pdf.text(vpAdminTitle, pageWidth / 2 - vpAdminTitleWidth / 2, currentY);
        currentY += 20;

        // Approved by section (centered)
        checkPage(50);
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Approved by:', margin, currentY);
        currentY += 12;
        
        const presidentName = getSignatory('school_president') || '_________________________';
        pdf.setFont('helvetica', 'normal');
        const presidentWidth = pdf.getStringUnitWidth(presidentName) * 11 / pdf.internal.scaleFactor;
        pdf.text(presidentName, pageWidth / 2 - presidentWidth / 2, currentY);
        currentY += 8;
        
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        const presidentTitle = 'School President';
        const presidentTitleWidth = pdf.getStringUnitWidth(presidentTitle) * 9 / pdf.internal.scaleFactor;
        pdf.text(presidentTitle, pageWidth / 2 - presidentTitleWidth / 2, currentY);
        currentY += 25;

        // 5. DOCUMENT INFO TABLE (Matching CSS Navy Blue Style)
        checkPage(60);
        
        // Get document info values from the form
        const issueStatus = document.querySelector('input[name="issue_status"]')?.value || '03';
        const revisionNumber = document.querySelector('input[name="revision_number"]')?.value || '04';
        const dateEffective = document.querySelector('input[name="date_effective"]')?.value || '23 January 2005';
        const approvedBy = document.querySelector('input[name="approved_by"]')?.value || 'President';
        const documentType = document.querySelector('.document_type')?.textContent || 'FM-DPM-SMCC-CES-05A';
        
        const tableData = [
            ['Form Code No.', documentType],
            ['Issue Status', issueStatus],
            ['Revision No.', revisionNumber],
            ['Date Effective', dateEffective],
            ['Approved By', approvedBy]
        ];
        
        let tableY = currentY;
        const labelWidth = 45;
        const colonWidth = 5;
        const valueWidth = 70;
        const rowHeight = 8;
        
        tableData.forEach((row) => {
            // Draw label cell (dark blue background)
            pdf.setFillColor(0, 32, 96);
            pdf.rect(margin, tableY, labelWidth, rowHeight, 'F');
            pdf.setTextColor(255, 255, 255);
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(9);
            pdf.text(row[0], margin + 2, tableY + 5.5);
            
            // Draw colon cell
            pdf.setFillColor(255, 255, 255);
            pdf.rect(margin + labelWidth, tableY, colonWidth, rowHeight);
            pdf.setTextColor(0, 0, 0);
            pdf.setFont('helvetica', 'normal');
            pdf.text(':', margin + labelWidth + 2, tableY + 5.5);
            
            // Draw value cell
            pdf.setFillColor(255, 255, 255);
            pdf.rect(margin + labelWidth + colonWidth, tableY, valueWidth, rowHeight);
            pdf.setTextColor(0, 0, 0);
            pdf.text(row[1], margin + labelWidth + colonWidth + 2, tableY + 5.5);
            
            tableY += rowHeight;
        });
        
        currentY = tableY + 10;

        // Save PDF
        const fileName = `Monthly_Accomplishment_Report_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.pdf`;
        pdf.save(fileName);

    } catch (error) {
        console.error("PDF Error:", error);
        alert("Could not generate PDF. Check console.\n\nError: " + error.message);
    } finally {
        button.textContent = originalText;
        button.disabled = false;
    }
}

// Event Listener
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('downloadPDF');
    if (btn) btn.addEventListener('click', downloadPDF);
});

window.downloadPDF = downloadPDF;