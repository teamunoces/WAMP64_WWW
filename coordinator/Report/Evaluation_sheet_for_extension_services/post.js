// evaluation.js - SIMPLIFIED VERSION (POST ONLY, NO CALCULATIONS)

document.addEventListener('DOMContentLoaded', function () {

    // =========================
    // ELEMENTS
    // =========================
    const form = document.getElementById('evaluationForm');
    const submitBtn = document.querySelector('.submit-button');
    
    // Check if elements exist
    if (!submitBtn) {
        console.error("Submit button not found!");
        return;
    }

    const apiUrl = 'post.php';

    // =========================
    // COLLECT FORM DATA
    // =========================
    function collectFormData() {
        const venue = document.getElementById('venue')?.value || '';
        const implementing_department = document.getElementById('implementing_department')?.value || '';

        const serviceTypes = Array.from(
            document.querySelectorAll('input[name="service_types[]"]:checked')
        ).map(cb => cb.value);

        const ratings = {};
        for (let i = 1; i <= 15; i++) {
            const selected = document.querySelector(`input[name="q${i}"]:checked`);
            ratings[`q${i}`] = selected ? parseInt(selected.value) : null;
        }

        const evaluatedBy = document.querySelector('input[name="evaluated_by"]')?.value || '';
        const signature = document.querySelector('input[name="signature"]')?.value || '';
        const evaluationDate = document.querySelector('input[name="date"]')?.value || '';
        
        // Get the report type from the page title or hidden field
        // The reportType is set in the HTML via JavaScript variable
        let type = '';
        if (typeof reportType !== 'undefined') {
            type = reportType;
        } else {
            // Fallback: get from the page title
            const pageTitle = document.querySelector('title')?.innerText || '';
            type = pageTitle || 'Evaluation Sheet for Extension Services';
        }

        return {
            type: type,  // Add the type field
            venue,
            implementing_department,  // Keep the underscore to match PHP expectation
            serviceTypes,
            ratings,
            evaluatedBy,
            signature,
            evaluationDate
        };
    }

    // =========================
    // VALIDATION
    // =========================
    function validateForm(data) {
        const errors = [];

        if (!data.venue || !data.venue.trim()) errors.push("Venue is required");
        if (!data.implementing_department || !data.implementing_department.trim()) errors.push("Implementing department is required");
        if (!data.evaluatedBy || !data.evaluatedBy.trim()) errors.push("Evaluator name is required");

        // Check if at least one question is answered
        let answeredCount = 0;
        for (let i = 1; i <= 15; i++) {
            if (data.ratings[`q${i}`]) answeredCount++;
        }
        
        if (answeredCount === 0) {
            errors.push("Please answer at least one question");
        }

        return errors;
    }

    // =========================
    // DISPLAY ERRORS
    // =========================
    function showErrors(errors) {
        const errorContainer = document.getElementById('errorMessages');

        // Create error container if it doesn't exist
        if (!errorContainer) {
            const container = document.createElement('div');
            container.id = 'errorMessages';
            container.style.marginBottom = '10px';
            if (form && form.firstChild) {
                form.insertBefore(container, form.firstChild);
            }
        }

        const container = document.getElementById('errorMessages');
        if (container) {
            container.innerHTML = errors.map(e =>
                `<div style="color: #721c24; background-color: #f8d7da; border: 1px solid #f5c6cb; padding: 10px; margin: 10px 0; border-radius: 4px;">${e}</div>`
            ).join('');
        } else {
            alert(errors.join('\n'));
        }
    }

    // Clear errors
    function clearErrors() {
        const errorContainer = document.getElementById('errorMessages');
        if (errorContainer) {
            errorContainer.innerHTML = '';
        }
    }

    // =========================
    // SUBMIT TO BACKEND
    // =========================
    async function submitToBackend(data) {
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = "Submitting...";
        }

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                alert("Evaluation submitted successfully!");
                // Reset form
                if (form) {
                    form.reset();
                    // Clear radio buttons specifically (reset doesn't always clear radio groups)
                    const radioButtons = form.querySelectorAll('input[type="radio"]');
                    radioButtons.forEach(radio => radio.checked = false);
                }
            } else {
                throw new Error(result.message || "Submission failed");
            }

        } catch (err) {
            console.error(err);
            alert("Error: " + err.message);
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = "Submit";
            }
        }
    }

    // =========================
    // SUBMIT BUTTON CLICK
    // =========================
    if (submitBtn) {
        submitBtn.addEventListener('click', function (e) {
            e.preventDefault();
            
            clearErrors();

            const data = collectFormData();
            const errors = validateForm(data);

            if (errors.length > 0) {
                showErrors(errors);
                return;
            }

            // Direct submission without modal
            if (confirm("Are you sure you want to submit this evaluation?")) {
                submitToBackend(data);
            }
        });
    }

    console.log("Evaluation system ready (simplified - POST only)");
});