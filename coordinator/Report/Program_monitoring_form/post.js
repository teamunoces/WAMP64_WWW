document.addEventListener('DOMContentLoaded', () => {
    // FIXED: Use querySelector for class, not getElementById
    const submitBtn = document.querySelector('.submit-button');

    // ========================
    // PAPER LINES TEXTAREA FUNCTIONS
    // ========================
    function autoExpand(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = (textarea.scrollHeight) + 'px';
    }

    function handleTab(e) {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = e.target.selectionStart;
            const end = e.target.selectionEnd;
            e.target.value = e.target.value.substring(0, start) + "    " + e.target.value.substring(end);
            e.target.selectionStart = e.target.selectionEnd = start + 4;
            autoExpand(e.target);
        }
    }

    function initializePaperLines() {
        const textareas = document.querySelectorAll('.paper-lines');
        textareas.forEach(el => {
            autoExpand(el);
            el.addEventListener('input', function() { autoExpand(this); });
            el.addEventListener('keydown', handleTab);
        });
    }

    // ========================
    // MUTUAL EXCLUSIVITY
    // ========================
    function setupMutualExclusion() {
        const naChecks = document.querySelectorAll('.naCheck');
        const yesChecks = document.querySelectorAll('.yesCheck');

        naChecks.forEach(naCheck => {
            naCheck.addEventListener('change', function() {
                if (this.checked) {
                    const rowId = this.getAttribute('data-row');
                    const correspondingYes = document.querySelector(`.yesCheck[data-row="${rowId}"]`);
                    if (correspondingYes) correspondingYes.checked = false;
                }
            });
        });

        yesChecks.forEach(yesCheck => {
            yesCheck.addEventListener('change', function() {
                if (this.checked) {
                    const rowId = this.getAttribute('data-row');
                    const correspondingNa = document.querySelector(`.naCheck[data-row="${rowId}"]`);
                    if (correspondingNa) correspondingNa.checked = false;
                }
            });
        });
    }

    function setupRecommendationExclusion() {
        const recYesList = document.querySelectorAll('.recYes');
        const recNaList = document.querySelectorAll('.recNa');

        recYesList.forEach(recYes => {
            recYes.addEventListener('change', function() {
                if (this.checked) {
                    const rowIdx = this.getAttribute('data-rec');
                    const sameRowNa = document.querySelector(`.recNa[data-rec="${rowIdx}"]`);
                    if (sameRowNa) sameRowNa.checked = false;
                }
            });
        });

        recNaList.forEach(recNa => {
            recNa.addEventListener('change', function() {
                if (this.checked) {
                    const rowIdx = this.getAttribute('data-rec');
                    const sameRowYes = document.querySelector(`.recYes[data-rec="${rowIdx}"]`);
                    if (sameRowYes) sameRowYes.checked = false;
                }
            });
        });
    }

    // ========================
    // COLLECT ALL FORM DATA
    // ========================
    function collectFormData() {
        const headerData = {
            programTitle: document.getElementById('programTitle')?.value || '',
            activityConducted: document.getElementById('activityConducted')?.value || '',
            location: document.getElementById('location')?.value || '',
            beneficiaries: document.getElementById('beneficiaries')?.value || '',
            dateOfMonitoring: document.getElementById('monitoringDate')?.value || '',
            monitoredBy: document.getElementById('monitoredBy')?.value || ''
        };

        const issuesList = [];
        const issueRows = document.querySelectorAll('#issuesTable tbody tr');
        
        for (let i = 0; i < issueRows.length - 1; i++) {
            const row = issueRows[i];
            const naChecked = row.querySelector('.naCheck')?.checked || false;
            const yesChecked = row.querySelector('.yesCheck')?.checked || false;
            const indicatorText = row.querySelector('td:nth-child(3)')?.innerText.trim() || '';
            const followUpValue = row.querySelector('.followUp')?.value.trim() || '';

            issuesList.push({
                indicator: indicatorText,
                status: naChecked ? 'N/A' : (yesChecked ? 'YES' : 'Not marked'),
                followUpRequired: followUpValue.toUpperCase()
            });
        }
        
        const otherIssuesText = document.getElementById('otherIssues')?.value || '';
        issuesList.push({
            indicator: 'Others (Please Specify)',
            status: 'Specified',
            details: otherIssuesText,
            followUpRequired: ''
        });

        const feedbackList = [];
        const feedbackTypes = ['positive', 'negative', 'suggestions'];

        feedbackTypes.forEach(type => {
            const checkBox = document.querySelector(`.feedbackCheck[data-feedback="${type}"]`);
            const summaryElem = document.querySelector(`.feedbackSummary[data-feedback="${type}"]`);
            const actionElem = document.querySelector(`.feedbackAction[data-feedback="${type}"]`);
            
            const summary = summaryElem?.value?.trim() || '';
            const action = actionElem?.value?.trim() || '';
            const isChecked = checkBox?.checked || false;
            
            if (isChecked || summary || action) {
                let feedbackTypeText = '';
                if (type === 'positive') feedbackTypeText = 'Positive Feedback';
                else if (type === 'negative') feedbackTypeText = 'Negative Feedback';
                else feedbackTypeText = 'Suggestions for Improvement';
                
                feedbackList.push({
                    feedbackType: feedbackTypeText,
                    isChecked: isChecked,
                    summary: summary,
                    actionsToImprove: action
                });
            }
        });

        const recommendations = [];
        const recRows = document.querySelectorAll('#recommendationsTable tbody tr');
        
        recRows.forEach((row) => {
            const recYes = row.querySelector('.recYes')?.checked || false;
            const recNa = row.querySelector('.recNa')?.checked || false;
            const recommendationText = row.querySelector('td:nth-child(2)')?.innerText.trim() || '';
            let applicability = '';
            if (recYes) applicability = 'Yes';
            else if (recNa) applicability = 'N/A';
            else applicability = 'Not specified';
            
            recommendations.push({
                recommendation: recommendationText,
                applicability: applicability
            });
        });

        const otherRecommendationsTextarea = document.querySelector('.footer-notes .paper-lines');
        const otherRecommendations = otherRecommendationsTextarea?.value || '';

        return {
            reportType: window.reportType || 'Program Monitoring Form',
            timestamp: new Date().toLocaleString(),
            header: headerData,
            issuesAndChallenges: issuesList,
            participantFeedback: feedbackList,
            actionsForNextActivity: {
                standardRecommendations: recommendations,
                otherRecommendations: otherRecommendations
            }
        };
    }

    // Auto-expand for textareas
    const textareas = document.querySelectorAll('.feedbackSummary, .feedbackAction, #otherIssues');
    textareas.forEach(textarea => {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
        if (textarea.value) {
            textarea.style.height = (textarea.scrollHeight) + 'px';
        }
    });

    // ========================
    // SUBMIT: Send to Backend
    // ========================
    async function handleSubmit(e) {
        if (e) e.preventDefault();
        
        const formData = collectFormData();
        
        console.log("Form Data Collected:", formData);
        
        // Show loading state
        if (submitBtn) {
            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;
        }
        
        try {
            const response = await fetch('post.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                alert('✓ Form submitted successfully!\n\n' +
                      'Report ID: ' + (result.report_id || 'N/A') + '\n' +
                      'Program: ' + result.program_title + '\n' +
                      'Status: ' + (result.status || 'pending'));
                
                // Optional: Reset form after successful submission
                if (confirm('Form submitted successfully! Would you like to reset the form for a new entry?')) {
                    resetForm();
                }
            } else {
                throw new Error(result.message || 'Submission failed');
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert('Error: ' + error.message + '\n\nPlease check console for details.');
        } finally {
            if (submitBtn) {
                submitBtn.textContent = 'Submit';
                submitBtn.disabled = false;
            }
        }
    }
    
    function resetForm() {
        // Clear all text inputs
        document.querySelectorAll('input[type="text"]').forEach(input => {
            if (input.type !== 'checkbox') input.value = '';
        });
        
        // Clear all textareas
        document.querySelectorAll('textarea').forEach(textarea => {
            textarea.value = '';
            textarea.style.height = 'auto';
        });
        
        // Uncheck all checkboxes
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Clear follow-up fields
        document.querySelectorAll('.followUp').forEach(field => {
            field.value = '';
        });
        
        alert('Form has been reset.');
    }

    function setupFollowUpAutoFormat() {
        const followUpFields = document.querySelectorAll('.followUp');
        followUpFields.forEach(field => {
            field.addEventListener('input', function() {
                let val = this.value.toUpperCase();
                if (val === 'Y' || val === 'N' || val === 'YES' || val === 'NO') {
                    this.value = (val === 'Y' || val === 'YES') ? 'Y' : 'N';
                } else if (val.length > 1) {
                    this.value = val.charAt(0);
                }
            });
        });
    }

    function initialize() {
        if (submitBtn) submitBtn.addEventListener('click', handleSubmit);
        
        setupMutualExclusion();
        setupRecommendationExclusion();
        setupFollowUpAutoFormat();
        initializePaperLines();
    }

    initialize();
});