async function loadReport() {
    // Try URL first
    const params = new URLSearchParams(window.location.search);
    let reportId = params.get("id");

    // Fallback to hidden input if URL doesn't have ?id=
    if (!reportId) {
        const hiddenInput = document.getElementById('currentReportId');
        if (hiddenInput && hiddenInput.value) {
            reportId = hiddenInput.value;
        }
    }

    if (!reportId) {
        alert("No report ID found");
        return;
    }

    try {
        const response = await fetch(`./get.php?id=${reportId}`);
        const data = await response.json();

        console.log("Loaded report:", data);

        if (data.error) {
            alert("Error: " + data.error);
            return;
        }

        const project = data.project;
        const programs = data.programs;

        // Display feedback in admin comment section (DISPLAY ONLY - NOT FOR UPDATE)
        displayFeedback(project.feedback);

        /* Fill top form fields */
        document.getElementById("title_of_project").value = project.title_of_project || "";
        autoExpand(document.getElementById("title_of_project"));
        
        document.getElementById("description_of_project").value = project.description_of_project || "";
        autoExpand(document.getElementById("description_of_project"));
        
        document.getElementById("general_objectives").value = project.general_objectives || "";
        autoExpand(document.getElementById("general_objectives"));
        
        document.getElementById("program_justification").value = project.program_justification || "";
        autoExpand(document.getElementById("program_justification"));
        
        document.getElementById("beneficiaries").value = project.beneficiaries || "";
        autoExpand(document.getElementById("beneficiaries"));
        
        document.getElementById("program_plan_text").value = project.program_plan_text || "";
        autoExpand(document.getElementById("program_plan_text"));

        /* Fill program table */
        const tableBody = document.querySelector("#programPlanTable tbody");
        if (!tableBody) return;
        tableBody.innerHTML = "";

        if (!programs || programs.length === 0) {
            // Add one empty row if no programs
            addEmptyProgramRow(tableBody);
        } else {
            programs.forEach(p => {
                addProgramRow(tableBody, p);
            });
        }

    } catch (error) {
        console.error("Error loading report:", error);
        alert("Error loading report: " + error.message);
    }
}

// Display feedback in admin comment (DISPLAY ONLY)
function displayFeedback(feedback) {
    const adminComment = document.getElementById('admincomment');
    if (adminComment) {
        adminComment.value = feedback || '';
        autoExpand(adminComment);
        // Make it read-only to indicate it's for display only
        adminComment.readOnly = true;
        // Optional: add a class to style it differently
        adminComment.classList.add('feedback-display');
    }
}
// Auto-expand textareas
function autoExpand(element) {
    if (!element) return;
    element.style.height = 'auto';
    element.style.height = (element.scrollHeight) + 'px';
}
// Add a program row to the table
function addProgramRow(tableBody, programData = {}) {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td><textarea class="program-field" rows="5" placeholder="Enter program...">${escapeHtml(programData.program || '')}</textarea></td>
        <td><textarea class="objectives-field" rows="5" placeholder="Enter objectives...">${escapeHtml(programData.objectives || '')}</textarea></td>
        <td><textarea class="strategies-field" rows="5" placeholder="Enter strategies...">${escapeHtml(programData.strategies || '')}</textarea></td>
        <td><textarea class="persons-field" rows="5" placeholder="Enter persons/agencies...">${escapeHtml(programData.persons_agencies_involved || '')}</textarea></td>
        <td><textarea class="resources-field" rows="5" placeholder="Enter resources needed...">${escapeHtml(programData.resources_needed || '')}</textarea></td>
        <td><textarea class="budget-field" rows="5" placeholder="Enter budget...">${escapeHtml(programData.budget || '')}</textarea></td>
        <td><textarea class="means-field" rows="5" placeholder="Enter means of verification...">${escapeHtml(programData.means_of_verification || '')}</textarea></td>
        <td><textarea class="timeframe-field" rows="5" placeholder="Enter time frame...">${escapeHtml(programData.time_frame || '')}</textarea></td>
    `;
    tableBody.appendChild(row);
    
    // Auto-expand all textareas in the new row
    row.querySelectorAll('textarea').forEach(textarea => {
        autoExpand(textarea);
        textarea.addEventListener('input', function() { autoExpand(this); });
    });
}// Add an empty program row
function addEmptyProgramRow(tableBody) {
    addProgramRow(tableBody, {});
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}


document.addEventListener("DOMContentLoaded", loadReport);