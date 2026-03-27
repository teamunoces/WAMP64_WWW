async function loadReport() {
    const params = new URLSearchParams(window.location.search);
    let reportId = params.get("id");

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
        const response = await fetch(`/SYSTEM_VERSION_!/admin/Dashboard/Pending/review/programdesign/get.php?id=${reportId}`);
        const data = await response.json();

        console.log("Fetched data:", data);

        if (data.success && data.main) {
            // Fill top input fields
            document.getElementById('department').value = data.main.department || '';
            document.getElementById('title_of_activity').value = data.main.title_of_activity || '';
            document.getElementById('participants').value = data.main.participants || '';
            document.getElementById('location').value = data.main.location || '';
            


            // Populate table
            const tableBody = document.querySelector('.program-table tbody');
            tableBody.innerHTML = ''; // clear existing rows

            data.details.forEach(row => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td contenteditable="true">${row.program || ''}</td>
                    <td contenteditable="true">${row.objectives || ''}</td>
                    <td contenteditable="true">${row.program_content_and_activities || ''}</td>
                    <td contenteditable="true">${row.service_delivery || ''}</td>
                    <td contenteditable="true">${row.partnerships_and_stakeholders || ''}</td>
                    <td contenteditable="true">${row.facilitators_and_trainers || ''}</td>
                    <td contenteditable="true">${row.program_start_and_end_dates || ''}</td>
                    <td contenteditable="true">${row.frequency_of_activities || ''}</td>
                    <td contenteditable="true">${row.community_resources || ''}</td>
                    <td contenteditable="true">${row.school_resources || ''}</td>
                    <td contenteditable="true">${row.risk_management_and_contingency_plans || ''}</td>
                    <td contenteditable="true">${row.sustainability_and_follow_up || ''}</td>
                    <td contenteditable="true">${row.promotion_and_awareness || ''}</td>

                `;
                tableBody.appendChild(tr);
            });
        } else {
            console.warn("No data returned for this report ID.");
        }
    } catch (error) {
        console.error("Error loading data:", error);
    }
}

document.addEventListener("DOMContentLoaded", loadReport);