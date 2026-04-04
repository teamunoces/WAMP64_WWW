// post.js
// This script handles form submission for the reflection paper

document.addEventListener('DOMContentLoaded', function() {
    // Get the submit button
    const submitButton = document.querySelector('.submit-button');
    
    if (!submitButton) {
        console.error('Submit button not found');
        return;
    }
    
    // Add click event listener to submit button
    submitButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Collect all form data
        const formData = {
            // Basic info
            beneficiary_name: document.getElementById('beneficiary_name')?.value || '',
            implementing_department: document.getElementById('implementing_department')?.value || '',
            
            // Extension services (checkboxes)
            extension_services: getSelectedExtensionServices(),
            
            // Answers to guide questions
            answer_one: document.getElementById('answer_one')?.value || '',
            answer_two: document.getElementById('answer_two')?.value || '',
            answer_three: document.getElementById('answer_three')?.value || '',
            
            // Signature
            beneficiary_signature: document.getElementById('beneficiary_signature')?.value || '',
            
            // Metadata
            report_type: window.reportType || "MONTHLY ACCOMPLISHMENT REPORT- REFLECTION PAPER",
            submitted_at: new Date().toISOString()
        };
        
        // Validate required fields
        if (!formData.beneficiary_name) {
            alert('Please enter the beneficiary name');
            document.getElementById('beneficiary_name')?.focus();
            return;
        }
        
        if (!formData.implementing_department) {
            alert('Please enter the implementing department');
            document.getElementById('implementing_department')?.focus();
            return;
        }
        
        // Show loading state
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Submitting...';
        submitButton.disabled = true;
        
        // Send data to server
        fetch('post.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert('Report submitted successfully!');
                // Optional: Reset form or redirect
                // resetForm();
                // window.location.href = 'thankyou.php';
            } else {
                alert('Error: ' + (data.message || 'Failed to submit report'));
                console.error('Server error:', data);
            }
        })
        .catch(error => {
            console.error('Error submitting form:', error);
            alert('An error occurred while submitting the report. Please try again.\n\n' + error.message);
        })
        .finally(() => {
            // Restore button state
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        });
    });
    
    /**
     * Get all selected extension services as a comma-separated string
     * @returns {string} Comma-separated list of selected services
     */
    function getSelectedExtensionServices() {
        const checkboxes = document.querySelectorAll('input[name="extension_services[]"]:checked');
        const selectedValues = Array.from(checkboxes).map(cb => cb.value);
        return selectedValues.join(', ');
    }
    
    /**
     * Reset the form fields
     */
    function resetForm() {
        document.getElementById('beneficiary_name').value = '';
        document.getElementById('implementing_department').value = '';
        
        // Clear checkboxes
        const checkboxes = document.querySelectorAll('input[name="extension_services[]"]');
        checkboxes.forEach(cb => cb.checked = false);
        
        // Clear textareas
        document.getElementById('answer_one').value = '';
        document.getElementById('answer_two').value = '';
        document.getElementById('answer_three').value = '';
        
        // Clear signature
        document.getElementById('beneficiary_signature').value = '';
    }
});