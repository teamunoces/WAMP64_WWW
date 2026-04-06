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
                    alert('Report submitted successfully!');
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