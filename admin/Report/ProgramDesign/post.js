document.addEventListener("DOMContentLoaded", () => {
    const submitBtn = document.querySelector(".submit-button");
    const addRowBtn = document.querySelector(".add-row-btn");
    const deleteRowBtn = document.querySelector(".delete-row-btn");
    const tableBody = document.querySelector(".program-table tbody");

    // ===== Add Row Function =====
    addRowBtn.addEventListener("click", () => {
        const newRow = document.createElement("tr");
        // Create 11 editable cells
        for (let i = 0; i < 13; i++) {
            const td = document.createElement("td");
            td.contentEditable = "true";
            newRow.appendChild(td);
        }
        tableBody.appendChild(newRow);
    });
           // ===== Delete Row Function =====
    deleteRowBtn.addEventListener("click", () => {
        const rows = tableBody.querySelectorAll("tr");

        if (rows.length > 1) {
            tableBody.removeChild(rows[rows.length - 1]); // remove last row
        } else {
            alert("No rows to delete.");
        }
    });

    // ===== Submit Form via AJAX =====
    submitBtn.addEventListener("click", (e) => {
        e.preventDefault();

        const formData = new FormData();

        // 1. Collect Main Fields from the top of the page
        formData.append('type', typeof reportType !== 'undefined' ? reportType : 'Program Design');
        formData.append('department', document.getElementById("department").value);
        formData.append('title_of_activity', document.getElementById("title_of_activity").value);
        formData.append('participants', document.getElementById("participants").value);
        formData.append('location', document.getElementById("location").value);
        formData.append('feedback', '');
        formData.append('status', 'pending');

        // 2. Collect Table Data
        tableBody.querySelectorAll("tr").forEach((row) => {
            const cells = row.querySelectorAll("td");
            if (cells.length === 13) {
                formData.append(`program[]`, cells[0].innerText.trim());
                formData.append(`objectives[]`, cells[1].innerText.trim());
                formData.append(`program_content_and_activities[]`, cells[2].innerText.trim());
                formData.append(`service_delivery[]`, cells[3].innerText.trim());
                formData.append(`partnerships_and_stakeholders[]`, cells[4].innerText.trim());
                formData.append(`facilitators_and_trainers[]`, cells[5].innerText.trim());
                formData.append(`program_start_and_end_dates[]`, cells[6].innerText.trim());
                formData.append(`frequency_of_activities[]`, cells[7].innerText.trim());
                formData.append(`community_resources[]`, cells[8].innerText.trim());
                formData.append(`school_resources[]`, cells[9].innerText.trim());
                formData.append(`risk_management_and_contingency_plans[]`, cells[10].innerText.trim());
                formData.append(`sustainability_and_follow_up[]`, cells[11].innerText.trim());
                formData.append(`promotion_and_awareness[]`, cells[12].innerText.trim());
            }
        });

        // 3. Send to PHP
        fetch("post.php", {
            method: "POST",
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            alert(data);
            if(data.toLowerCase().includes("successfully")) {
                location.reload(); // Clear form on success
            }
        })
        .catch(err => {
            console.error(err);
            alert("Error submitting report.");
        });
    });
});