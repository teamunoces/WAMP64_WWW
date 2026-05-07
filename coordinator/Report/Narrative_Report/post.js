function showSuccessBanner(message = 'Report submitted successfully!') {
    let banner = document.getElementById('submissionSuccessBanner');

    if (!banner) {
        banner = document.createElement('div');
        banner.id = 'submissionSuccessBanner';
        banner.setAttribute('role', 'status');
        banner.style.position = 'fixed';
        banner.style.top = '78px';
        banner.style.right = '24px';
        banner.style.zIndex = '10000';
        banner.style.maxWidth = '420px';
        banner.style.padding = '14px 18px';
        banner.style.borderRadius = '8px';
        banner.style.background = 'linear-gradient(135deg, #59AF29 0%, #254911 100%)';
        banner.style.color = '#ffffff';
        banner.style.boxShadow = '0 10px 24px rgba(37, 73, 17, 0.28)';
        banner.style.fontFamily = 'Inter, Segoe UI, Arial, sans-serif';
        banner.style.fontSize = '14px';
        banner.style.fontWeight = '700';
        banner.style.letterSpacing = '0';
        banner.style.lineHeight = '1.4';
        banner.style.opacity = '0';
        banner.style.transform = 'translateY(-10px)';
        banner.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
        document.body.appendChild(banner);
    }

    banner.textContent = message;
    requestAnimationFrame(() => {
        banner.style.opacity = '1';
        banner.style.transform = 'translateY(0)';
    });

    clearTimeout(window.submissionSuccessBannerTimer);
    window.submissionSuccessBannerTimer = setTimeout(() => {
        banner.style.opacity = '0';
        banner.style.transform = 'translateY(-10px)';
    }, 3500);
}
// post.js
document.addEventListener('DOMContentLoaded', function() {
    const submitBtn = document.querySelector('.submit-button');
    const form = document.getElementById('narrativeForm');

    if (submitBtn) {
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();

            // Get form data
            const narrateSuccess = document.getElementById('narrate_success').value.trim();
            const provideData = document.getElementById('provide_data').value.trim();
            const identifyProblems = document.getElementById('identify_problems').value.trim();
            const proposeSolutions = document.getElementById('propose_solutions').value.trim();

            // Basic validation
            if (!narrateSuccess || !provideData || !identifyProblems || !proposeSolutions) {
                alert('Please fill in all fields before submitting.');
                return;
            }

            // Get report type from URL parameter or default
            const urlParams = new URLSearchParams(window.location.search);
            const reportType = urlParams.get('type') || 'Monthly Accomplishment Report- Narrative Report';

            // Prepare data for POST
            const postData = {
                type: reportType,
                narrate_success: narrateSuccess,
                provide_data: provideData,
                identify_problems: identifyProblems,
                propose_solutions: proposeSolutions
            };

            // Disable button to prevent double submission
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';

            // Send AJAX request
            fetch('post.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showSuccessBanner('Report submitted successfully!');
                    form.reset(); // Clear the form
                } else {
                    alert('Error: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while submitting the report. Please try again.');
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit';
            });
        });
    }
});
