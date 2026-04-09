// download.js
document.getElementById('downloadPDF').addEventListener('click', function() {
    // Show loading indicator
    const downloadBtn = document.getElementById('downloadPDF');
    const originalText = downloadBtn.textContent;
    downloadBtn.textContent = 'Generating PDF...';
    downloadBtn.disabled = true;
    
    // Get the certificate container element
    const certificateContainer = document.querySelector('.certificate-container');
    
    if (!certificateContainer) {
        console.error('Certificate container not found');
        alert('Certificate container not found');
        downloadBtn.textContent = originalText;
        downloadBtn.disabled = false;
        return;
    }
    
    // Clone the certificate container deeply
    const downloadContent = certificateContainer.cloneNode(true);
    
    // Transfer all input values from original to cloned version
    const originalInputs = certificateContainer.querySelectorAll('input[type="text"]');
    const clonedInputs = downloadContent.querySelectorAll('input[type="text"]');
    
    originalInputs.forEach((original, index) => {
        if (clonedInputs[index]) {
            clonedInputs[index].value = original.value;
        }
    });
    
    // Transfer textarea values
    const originalTextareas = certificateContainer.querySelectorAll('textarea');
    const clonedTextareas = downloadContent.querySelectorAll('textarea');
    
    originalTextareas.forEach((original, index) => {
        if (clonedTextareas[index]) {
            clonedTextareas[index].value = original.value;
        }
    });
    
    // Transfer any div content that might have been edited
    const originalNames = certificateContainer.querySelectorAll('#created_by_name, #dean, #ces_head, #vp_acad, #vp_admin, #school_president');
    const clonedNames = downloadContent.querySelectorAll('#created_by_name, #dean, #ces_head, #vp_acad, #vp_admin, #school_president');
    
    originalNames.forEach((original, index) => {
        if (clonedNames[index]) {
            clonedNames[index].textContent = original.textContent;
        }
    });
    
    // Create a temporary container for PDF generation
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '-9999px';
    tempContainer.style.backgroundColor = 'white';
    tempContainer.appendChild(downloadContent);
    document.body.appendChild(tempContainer);
    
    // Ensure all images load properly
    const images = downloadContent.querySelectorAll('img');
    let imagesLoaded = 0;
    const totalImages = images.length;
    
    const checkAllImagesLoaded = () => {
        imagesLoaded++;
        if (imagesLoaded === totalImages || totalImages === 0) {
            generatePDF();
        }
    };
    
    if (totalImages > 0) {
        images.forEach(img => {
            if (img.complete) {
                checkAllImagesLoaded();
            } else {
                img.addEventListener('load', checkAllImagesLoaded);
                img.addEventListener('error', checkAllImagesLoaded);
            }
        });
    } else {
        generatePDF();
    }
    
    function generatePDF() {
        // Options for PDF generation
        const options = {
            margin: [0.1, 0.1, 0.1, 0.1],
            filename: `Certificate_of_Appearance_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 3,
                letterRendering: true,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            },
            jsPDF: { 
                unit: 'in', 
                format: 'letter', 
                orientation: 'portrait' 
            }
        };
        
        // Generate PDF
        html2pdf().set(options).from(downloadContent).save().then(() => {
            // Clean up
            document.body.removeChild(tempContainer);
            downloadBtn.textContent = originalText;
            downloadBtn.disabled = false;
        }).catch(error => {
            console.error('PDF generation error:', error);
            alert('Error generating PDF. Please try again.');
            document.body.removeChild(tempContainer);
            downloadBtn.textContent = originalText;
            downloadBtn.disabled = false;
        });
    }
});