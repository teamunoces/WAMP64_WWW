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
(() => {
    const table = document.getElementById("programPlanTable");
    const addRowBtn = document.querySelector(".add-row-btn");
    const deleteRowBtn = document.querySelector(".delete-row-btn");
    const submitBtn = document.querySelector(".btn-submit");

    if(reportType === "3-year Development Plan"){
    }
    
    // --- Add new row dynamically ---
    addRowBtn.addEventListener("click", () => {
        const newRow = table.tBodies[0].rows[0].cloneNode(true);
        
        // Clear all input/textarea values
        newRow.querySelectorAll("textarea, input").forEach(cell => cell.value = "");
        
        table.tBodies[0].appendChild(newRow);
    });
    
    // --- Delete last row ---
    deleteRowBtn.addEventListener("click", () => {
        const tbody = table.tBodies[0];
        
        // Prevent deleting the last remaining row
        if (tbody.rows.length > 1) {
            tbody.deleteRow(tbody.rows.length - 1);
        } else {
            alert("At least one row must remain.");
        }
    });
    
    // --- Submit form ---
    submitBtn.addEventListener("click", function(e) {
        e.preventDefault();
        
        const data = {
            title_of_project: document.getElementById("title_of_project").value,
            description_of_project: document.getElementById("description_of_project").value,
            general_objectives: document.getElementById("general_objectives").value,
            program_justification: document.getElementById("program_justification").value,
            beneficiaries: document.getElementById("beneficiaries").value,
            program_plan_text: document.getElementById("program_plan").value,
            report_type: reportType,
            programPlanTable: []
        };
        
        const rows = table.querySelectorAll("tbody tr");
        data.programPlanTable = Array.from(rows)
            .map(row => {
                const cells = row.querySelectorAll("textarea, input");
                // Fixed mapping to match table structure
                return {
                    program: cells[0]?.value || "",
                    objectives: cells[1]?.value || "",
                    strategies: cells[2]?.value || "",  // Strategies and Action Plans
                    persons_agencies_involved: cells[3]?.value || "",  // Resources from School
                    resources_needed: cells[4]?.value || "",  // Resources from Community
                    budget: cells[5]?.value || "",  // Budget
                    means_of_verification: cells[6]?.value || "",  // Means of Verification
                    time_frame: cells[7]?.value || ""  // Time Frame
                };
            })
            .filter(row => row.program.trim() !== ""); // remove empty rows
        
        // Send data via POST to PHP
        fetch("./php/post.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(response => {
            if (response.success) {
                showSuccessBanner(response.message || "Report submitted successfully!");
                
                // Reset form
                document.querySelector("form").reset();
                
                // Keep only the first row and clear its values
                const tbody = table.tBodies[0];
                while (tbody.rows.length > 1) tbody.deleteRow(1);
                tbody.rows[0].querySelectorAll("textarea, input").forEach(cell => cell.value = "");
                
            } else {
                alert(`âŒ Error: ${response.message}`);
            }
        })
        .catch(() => alert("Error submitting report."));
    });
})();

document.addEventListener("DOMContentLoaded", function() {
    const clearBtn = document.querySelector(".btn-clear");
    
    clearBtn.addEventListener("click", function() {
        // Clear all textareas
        document.querySelectorAll("form textarea").forEach(textarea => {
            textarea.value = "";
        });
        
        // Clear all input fields
        document.querySelectorAll("form input").forEach(input => {
            input.value = "";
        });
        
        // Clear specific fields
        const idsToClear = [
            "title_of_project",
            "description_of_project", 
            "general_objectives",
            "program_justification",
            "beneficiaries",
            "program_plan"
        ];
        
        idsToClear.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = "";
        });
        
        // Reset table rows
        const tableBody = document.querySelector("#programPlanTable tbody");
        tableBody.innerHTML = `
            <tr>
                <td><textarea placeholder="..."></textarea></td>
                <td><textarea placeholder="..."></textarea></td>
                <td><textarea placeholder="..."></textarea></td>
                <td><textarea placeholder="..."></textarea></td>
                <td><textarea placeholder="..."></textarea></td>
                <td><textarea placeholder="..."></textarea></td>
                <td><textarea placeholder="..."></textarea></td>
                <td><textarea placeholder="..."></textarea></td>
            </tr>
        `;
    });
});

// Auto-expand textareas
const textareas = document.querySelectorAll('table td textarea');
textareas.forEach(textarea => {
    textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
});
