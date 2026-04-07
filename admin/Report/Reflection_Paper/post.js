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
            beneficiary_name: document.getElementById('beneficiary_name')?.value.trim() || '',
            implementing_department: document.getElementById('implementing_department')?.value.trim() || '',
            
            // Extension services (checkboxes)
            extension_services: getSelectedExtensionServices(),
            
            // Answers to guide questions
            answer_one: document.getElementById('answer_one')?.value.trim() || '',
            answer_two: document.getElementById('answer_two')?.value.trim() || '',
            answer_three: document.getElementById('answer_three')?.value.trim() || '',
            
            // Signature
            beneficiary_signature: document.getElementById('beneficiary_signature')?.value.trim() || '',
            
            // Metadata
            report_type: window.reportType || "Monthly Accomplishment Report- Reflection Paper",
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
        
        if (!formData.extension_services) {
            alert('Please select at least one extension service type');
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
                resetForm();
            } else {
                alert('Error: ' + (data.message || 'Failed to submit report'));
            }
        })
        .catch(error => {
            console.error('Error submitting form:', error);
            alert('An error occurred while submitting the report. Please try again.');
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
        const selectedValues = Array.from(checkboxes)
            .map(cb => cb.value)
            .filter(value => value !== '');
        return selectedValues.join(', ');
    }
    
    /**
     * Reset the form fields
     */
    function resetForm() {
        // Clear text inputs
        const beneficiaryName = document.getElementById('beneficiary_name');
        const implementingDept = document.getElementById('implementing_department');
        const beneficiarySignature = document.getElementById('beneficiary_signature');
        
        if (beneficiaryName) beneficiaryName.value = '';
        if (implementingDept) implementingDept.value = '';
        if (beneficiarySignature) beneficiarySignature.value = '';
        
        // Clear checkboxes
        const checkboxes = document.querySelectorAll('input[name="extension_services[]"]');
        checkboxes.forEach(cb => cb.checked = false);
        
        // Clear textareas
        const answerOne = document.getElementById('answer_one');
        const answerTwo = document.getElementById('answer_two');
        const answerThree = document.getElementById('answer_three');
        
        if (answerOne) answerOne.value = '';
        if (answerTwo) answerTwo.value = '';
        if (answerThree) answerThree.value = '';
        
        // Reset textarea heights if autoExpand function exists
        if (typeof autoExpand === 'function') {
            if (answerOne) autoExpand(answerOne);
            if (answerTwo) autoExpand(answerTwo);
            if (answerThree) autoExpand(answerThree);
        }
        
        // Focus back to first field
        if (beneficiaryName) beneficiaryName.focus();
    }
});