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
                showSuccessBanner("Evaluation submitted successfully!");
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
