// post.js
// Function to get all data from the form fields
function getFormData() {
    // Get all input values using their IDs
    const formData = {
        participant: document.getElementById('name')?.value || document.getElementById('participant')?.value || '',
        cert_department: document.getElementById('cert_department')?.value || '',
        activity_name: document.getElementById('activity_name')?.value || '',
        location: document.getElementById('location')?.value || '',
        date_held: document.getElementById('date_held')?.value || '',
        month_held: document.getElementById('month_held')?.value || '',
        location_two: document.getElementById('location_two')?.value || '',
        monitored_by: document.getElementById('monitored_by')?.value || '',
        verified_by: document.getElementById('verified_by')?.value || '',
        report_type: window.reportType || 'Certificate of Appearance', // Get report type from global variable
        feedback: document.getElementById('feedback')?.value || ''
    };
    
    return formData;
}

// Function to display the collected data
function displayFormData() {
    const data = getFormData();
    console.log('Form Data:', data);
    
    // Display in a formatted way
    console.log('\n=== CERTIFICATE DATA ===');
    console.log(`Report Type: ${data.report_type}`);
    console.log(`Name: ${data.participant}`);
    console.log(`Department: ${data.cert_department}`);
    console.log(`Activity/Project: ${data.activity_name}`);
    console.log(`Location: ${data.location}`);
    console.log(`Date Held: ${data.date_held} ${data.month_held}, 2025`);
    console.log(`Location Two: ${data.location_two}`);
    console.log(`Monitored By: ${data.monitored_by}`);
    console.log(`Verified By: ${data.verified_by}`);
    console.log(`Feedback: ${data.feedback}`);
    console.log('========================\n');
    
    return data;
}

// Function to submit data to server
async function submitFormData(endpoint = 'post.php') {
    const data = getFormData();
    
    // Validate required fields
    const validation = validateFormData();
    if (!validation.isValid) {
        console.error('Validation errors:', validation.errors);
        alert('Please fill in all required fields:\n' + validation.errors.join('\n'));
        return null;
    }
    
    // Show loading indicator
    const submitButton = document.querySelector('.submit-button');
    const originalButtonText = submitButton ? submitButton.textContent : 'Submit';
    if (submitButton) {
        submitButton.textContent = 'Submitting...';
        submitButton.disabled = true;
    }
    
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log('Data submitted successfully:', result);
            alert(`Success! ${result.message}\nReport ID: ${result.report_id}`);
            
            // Optional: Clear form after successful submission
            if (confirm('Form submitted successfully! Do you want to clear the form?')) {
                clearForm();
            }
            
            return result;
        } else {
            console.error('Failed to submit data:', result.message);
            alert(`Error: ${result.message}`);
            return null;
        }
    } catch (error) {
        console.error('Error submitting data:', error);
        alert('Error submitting form. Please check your connection and try again.');
        return null;
    } finally {
        // Restore button
        if (submitButton) {
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        }
    }
}

// Function to validate form data
function validateFormData() {
    const data = getFormData();
    const errors = [];
    
    if (!data.participant || !data.participant.trim()) errors.push('Participant Name is required');
    if (!data.cert_department || !data.cert_department.trim()) errors.push('Department is required');
    if (!data.activity_name || !data.activity_name.trim()) errors.push('Activity/Project name is required');
    if (!data.location || !data.location.trim()) errors.push('Location is required');
    if (!data.date_held || !data.date_held.trim()) errors.push('Date is required');
    if (!data.month_held || !data.month_held.trim()) errors.push('Month is required');
    if (!data.location_two || !data.location_two.trim()) errors.push('Location two is required');
    if (!data.monitored_by || !data.monitored_by.trim()) errors.push('Monitored by is required');
    if (!data.verified_by || !data.verified_by.trim()) errors.push('Verified by is required');
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// Function to clear all form fields
function clearForm() {
    const fields = [
        'name',
        'participant',
        'cert_department',
        'activity_name',
        'location',
        'date_held',
        'month_held',
        'location_two',
        'monitored_by',
        'verified_by',
        'feedback'
    ];
    
    fields.forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (element) {
            element.value = '';
        }
    });
    
    console.log('Form cleared successfully');
    alert('Form has been cleared');
}

// Function to handle form submission with validation
async function handleFormSubmission(event) {
    if (event) {
        event.preventDefault();
    }
    
    const validation = validateFormData();
    
    if (!validation.isValid) {
        console.error('Validation errors:', validation.errors);
        alert('Please fill in all required fields:\n' + validation.errors.join('\n'));
        return false;
    }
    
    const formData = getFormData();
    console.log('Form data collected successfully:', formData);
    console.log('Report Type:', formData.report_type);
    
    // Submit the data to the server
    const result = await submitFormData();
    
    if (result && result.success) {
        // Optional: Trigger any custom events or callbacks
        const customEvent = new CustomEvent('formSubmitted', { detail: result });
        document.dispatchEvent(customEvent);
    }
    
    return result;
}

// Function to get report type
function getReportType() {
    return window.reportType || 'Certificate of Appearance';
}

// Function to display report type info
function displayReportType() {
    const reportType = getReportType();
    console.log('Current Report Type:', reportType);
    
    // Display in the UI if element exists
    const reportTypeElement = document.getElementById('report_type_display');
    if (reportTypeElement) {
        reportTypeElement.textContent = reportType;
    }
}

// Function to set report type dynamically
function setReportType(type) {
    window.reportType = type;
    console.log('Report type set to:', type);
    displayReportType();
}

// Enhanced FormHandler class with full support
class FormHandler {
    constructor() {
        this.formFields = [
            'name',
            'participant',
            'cert_department',
            'activity_name',
            'location',
            'date_held',
            'month_held',
            'location_two',
            'monitored_by',
            'verified_by',
            'feedback'
        ];
        this.endpoint = 'post.php';
    }
    
    // Get all form data as an object including report type
    getAllData() {
        const data = {};
        this.formFields.forEach(field => {
            const element = document.getElementById(field);
            data[field] = element ? element.value : '';
        });
        
        // Handle mapping for different field names
        const mappedData = {
            participant: data.name || data.participant,
            cert_department: data.cert_department,
            activity_name: data.activity_name,
            location: data.location,
            date_held: data.date_held,
            month_held: data.month_held,
            location_two: data.location_two,
            monitored_by: data.monitored_by,
            verified_by: data.verified_by,
            report_type: window.reportType || 'Certificate of Appearance',
            feedback: data.feedback
        };
        
        return mappedData;
    }
    
    // Get data as FormData object (for file uploads)
    getFormData() {
        const formData = new FormData();
        const data = this.getAllData();
        
        Object.keys(data).forEach(key => {
            if (data[key] !== undefined && data[key] !== null) {
                formData.append(key, data[key]);
            }
        });
        
        return formData;
    }
    
    // Get data as URLSearchParams (for application/x-www-form-urlencoded)
    getURLEncodedData() {
        const data = this.getAllData();
        const params = new URLSearchParams();
        
        Object.keys(data).forEach(key => {
            if (data[key] !== undefined && data[key] !== null) {
                params.append(key, data[key]);
            }
        });
        
        return params;
    }
    
    // Convert data to JSON string
    getJSONData() {
        return JSON.stringify(this.getAllData(), null, 2);
    }
    
    // Log all data to console
    logData() {
        const data = this.getAllData();
        console.table(data);
        console.log('Report Type:', data.report_type);
        console.log('JSON Output:', this.getJSONData());
    }
    
    // Validate all required fields
    validate() {
        const data = this.getAllData();
        const required = ['participant', 'cert_department', 'activity_name', 'monitored_by', 'verified_by'];
        const missing = required.filter(field => !data[field] || !data[field].trim());
        
        if (missing.length > 0) {
            console.warn('Missing required fields:', missing);
            return {
                isValid: false,
                missing: missing
            };
        }
        
        return {
            isValid: true,
            missing: []
        };
    }
    
    // Submit data to server
    async submit(endpoint = null) {
        const validation = this.validate();
        if (!validation.isValid) {
            throw new Error(`Please fill in all required fields: ${validation.missing.join(', ')}`);
        }
        
        const data = this.getAllData();
        const submitEndpoint = endpoint || this.endpoint;
        
        try {
            const response = await fetch(submitEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            console.log('Submission result:', result);
            console.log('Submitted with Report Type:', data.report_type);
            return result;
        } catch (error) {
            console.error('Submission error:', error);
            throw error;
        }
    }
    
    // Reset all form fields
    reset() {
        this.formFields.forEach(field => {
            const element = document.getElementById(field);
            if (element) {
                element.value = '';
            }
        });
        console.log('Form reset successfully');
    }
    
    // Set endpoint
    setEndpoint(endpoint) {
        this.endpoint = endpoint;
        console.log('Endpoint set to:', endpoint);
    }
    
    // Fill form with data
    fillForm(data) {
        Object.keys(data).forEach(field => {
            const element = document.getElementById(field);
            if (element && data[field] !== undefined) {
                element.value = data[field];
            }
        });
        console.log('Form filled with data');
    }
}

// Initialize the form handler
const formHandler = new FormHandler();

// Event listeners setup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('post.js loaded successfully');
    
    // Find the submit button
    const submitButton = document.querySelector('.submit-button');
    
    if (submitButton) {
        console.log('Submit button found, attaching event listener');
        // Remove any existing listeners to avoid duplicates
        submitButton.removeEventListener('click', handleFormSubmission);
        submitButton.addEventListener('click', handleFormSubmission);
    } else {
        console.warn('Submit button not found. Make sure the button has class "submit-button"');
    }
    
    // Optional: Add clear button if exists
    const clearButton = document.getElementById('clearBtn');
    if (clearButton) {
        clearButton.removeEventListener('click', clearForm);
        clearButton.addEventListener('click', clearForm);
    }
    
    // Add reset button if exists
    const resetButton = document.getElementById('resetBtn');
    if (resetButton) {
        resetButton.addEventListener('click', () => formHandler.reset());
    }
    
    // Display report type info
    displayReportType();
    
    // Log initial form state
    console.log('Current Report Type from PHP:', getReportType());
    formHandler.logData();
    
    // Add real-time validation on input changes (optional)
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            // Optional: Real-time validation feedback
            if (input.value.trim() === '') {
                input.style.borderColor = '#ff6b6b';
            } else {
                input.style.borderColor = '#4ecdc4';
            }
        });
        
        input.addEventListener('blur', () => {
            // Reset border color on blur
            input.style.borderColor = '';
        });
    });
    
    // Add keyboard shortcut for submit (Ctrl+Enter)
    document.addEventListener('keydown', (event) => {
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
            event.preventDefault();
            handleFormSubmission(event);
        }
    });
});

// Make functions available globally
window.getFormData = getFormData;
window.displayFormData = displayFormData;
window.submitFormData = submitFormData;
window.validateFormData = validateFormData;
window.clearForm = clearForm;
window.handleFormSubmission = handleFormSubmission;
window.getReportType = getReportType;
window.setReportType = setReportType;
window.formHandler = formHandler;

// Export functions if using modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getFormData,
        displayFormData,
        submitFormData,
        validateFormData,
        clearForm,
        handleFormSubmission,
        getReportType,
        setReportType,
        FormHandler
    };
}