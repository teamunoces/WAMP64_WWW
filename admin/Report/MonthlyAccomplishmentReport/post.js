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
document.addEventListener("DOMContentLoaded", () => {
    const submitBtn = document.querySelector(".submit-button");
    const addRowBtn = document.querySelector(".add-row-btn");
    const deleteRowBtn = document.querySelector(".delete-row-btn");
    const tableBody = document.querySelector(".main-table tbody");

    // ===== Add Row Function =====
    addRowBtn.addEventListener("click", () => {
        const newRow = document.createElement("tr");
        // Create 11 editable cells
        for (let i = 0; i < 8; i++) {
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
        formData.append('type', typeof reportType !== 'undefined' ? reportType : 'Monthly Accomplishment Report');
        formData.append('department', document.getElementById("department").value);
        formData.append('month', document.getElementById("month").value);
        formData.append('title_act', document.getElementById("title_act").value);
        formData.append('location', document.getElementById("location").value);
        formData.append('benefeciaries', document.getElementById("benefeciaries").value);
        formData.append('feedback', '');
        formData.append('status', 'pending');

        // 2. Collect Table Data
        tableBody.querySelectorAll("tr").forEach((row) => {
            const cells = row.querySelectorAll("td");
            if (cells.length === 8) {
                formData.append(`date_of_act[]`, cells[0].innerText.trim());
                formData.append(`activities_conducted[]`, cells[1].innerText.trim());
                formData.append(`objectives[]`, cells[2].innerText.trim());
                formData.append(`act_status[]`, cells[3].innerText.trim());
                formData.append(`issues_or_concerns[]`, cells[4].innerText.trim());
                formData.append(`financial_report[]`, cells[5].innerText.trim());
                formData.append(`recommendations[]`, cells[6].innerText.trim());
                formData.append(`plans_for_next_months[]`, cells[7].innerText.trim());

            }
        });

        // 3. Send to PHP
        fetch("post.php", {
            method: "POST",
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            if(data.toLowerCase().includes("successfully")) {
                showSuccessBanner("Report submitted successfully!");
                setTimeout(() => location.reload(), 1200);
            } else {
                alert(data);
            }
        })
        .catch(err => {
            alert("Error submitting report.");
        });
    });
});
