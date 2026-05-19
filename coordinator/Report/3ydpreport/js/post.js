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
    const draftBtn = document.querySelector(".btn-draft");
    const clearBtn = document.querySelector(".btn-clear");
    const draftNotice = document.getElementById("draftNotice");
    const resumeDraftBtn = document.getElementById("resumeDraftBtn");
    const closeDraftNoticeBtn = document.getElementById("closeDraftNoticeBtn");
    const form = document.querySelector("form");

    let currentDraftId = null;
    let currentUserId = null;
    let localStorageKey = null;
    let autosaveTimer = null;
    let databaseDraft = null;

    function getBlankRowHtml() {
        return `
            <tr>
                <td><textarea rows="5" placeholder="..."></textarea></td>
                <td><textarea rows="5" placeholder="..."></textarea></td>
                <td><textarea rows="5" placeholder="..."></textarea></td>
                <td><textarea rows="5" placeholder="..."></textarea></td>
                <td><textarea rows="5" placeholder="..."></textarea></td>
                <td><textarea rows="5" placeholder="..."></textarea></td>
                <td><textarea rows="5" placeholder="..."></textarea></td>
                <td><textarea rows="5" placeholder="..."></textarea></td>
            </tr>
        `;
    }

    function attachTextareaAutoExpand(scope = document) {
        scope.querySelectorAll('textarea').forEach(textarea => {
            textarea.addEventListener('input', function() {
                this.style.height = 'auto';
                this.style.height = `${this.scrollHeight}px`;
            });
        });
    }

    function resizeAllTextareas() {
        document.querySelectorAll('textarea').forEach(textarea => {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        });
    }

    function collectFormData(action = "submit") {
        const rows = table.querySelectorAll("tbody tr");

        return {
            action,
            draft_id: currentDraftId,
            title_of_project: document.getElementById("title_of_project").value,
            description_of_project: document.getElementById("description_of_project").value,
            general_objectives: document.getElementById("general_objectives").value,
            program_justification: document.getElementById("program_justification").value,
            beneficiaries: document.getElementById("beneficiaries").value,
            program_plan_text: document.getElementById("program_plan").value,
            report_type: reportType,
            programPlanTable: Array.from(rows).map(row => {
                const cells = row.querySelectorAll("textarea, input");

                return {
                    program: cells[0]?.value || "",
                    objectives: cells[1]?.value || "",
                    strategies: cells[2]?.value || "",
                    persons_agencies_involved: cells[3]?.value || "",
                    resources_needed: cells[4]?.value || "",
                    budget: cells[5]?.value || "",
                    means_of_verification: cells[6]?.value || "",
                    time_frame: cells[7]?.value || ""
                };
            })
        };
    }

    function fillForm(data) {
        document.getElementById("title_of_project").value = data.title_of_project || "";
        document.getElementById("description_of_project").value = data.description_of_project || "";
        document.getElementById("general_objectives").value = data.general_objectives || "";
        document.getElementById("program_justification").value = data.program_justification || "";
        document.getElementById("beneficiaries").value = data.beneficiaries || "";
        document.getElementById("program_plan").value = data.program_plan_text || "";

        const rows = Array.isArray(data.programPlanTable) && data.programPlanTable.length
            ? data.programPlanTable
            : [{}];

        const tbody = table.tBodies[0];
        tbody.innerHTML = rows.map(getBlankRowHtml).join("");

        rows.forEach((row, index) => {
            const cells = tbody.rows[index].querySelectorAll("textarea, input");
            cells[0].value = row.program || "";
            cells[1].value = row.objectives || "";
            cells[2].value = row.strategies || "";
            cells[3].value = row.persons_agencies_involved || "";
            cells[4].value = row.resources_needed || "";
            cells[5].value = row.budget || "";
            cells[6].value = row.means_of_verification || "";
            cells[7].value = row.time_frame || "";
        });

        attachTextareaAutoExpand(tbody);
        resizeAllTextareas();
    }

    function resetForm() {
        form.reset();
        table.tBodies[0].innerHTML = getBlankRowHtml();
        attachTextareaAutoExpand(table.tBodies[0]);
        currentDraftId = null;
    }

    function setLocalStorageKey(userId) {
        currentUserId = userId;
        localStorageKey = `draft_data_${userId}`;
    }

    function saveLocalDraft() {
        if (!localStorageKey || !currentDraftId) {
            return;
        }

        localStorage.setItem(localStorageKey, JSON.stringify({
            saved_at: new Date().toISOString(),
            draft_id: currentDraftId,
            data: collectFormData("local_autosave")
        }));
    }

    function startLocalAutosave() {
        stopLocalAutosave();
        saveLocalDraft();
        autosaveTimer = setInterval(saveLocalDraft, 30000);
    }

    function stopLocalAutosave() {
        if (autosaveTimer) {
            clearInterval(autosaveTimer);
            autosaveTimer = null;
        }
    }

    function clearLocalDraft() {
        if (localStorageKey) {
            localStorage.removeItem(localStorageKey);
        }
    }

    async function postJson(payload) {
        const response = await fetch("./php/post.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || "Request failed.");
        }

        return result;
    }

    async function checkDatabaseDraft() {
        try {
            const result = await postJson({ action: "get_draft" });
            setLocalStorageKey(result.user_id);

            if (result.draft) {
                databaseDraft = result.draft;
                currentDraftId = Number(result.draft.id);
                draftNotice.hidden = false;
            }
        } catch (error) {
            console.warn("Draft check failed:", error);
        }
    }

    addRowBtn.addEventListener("click", () => {
        const newRow = table.tBodies[0].rows[0].cloneNode(true);
        newRow.querySelectorAll("textarea, input").forEach(cell => {
            cell.value = "";
            cell.style.height = "";
        });
        table.tBodies[0].appendChild(newRow);
        attachTextareaAutoExpand(newRow);
    });

    deleteRowBtn.addEventListener("click", () => {
        const tbody = table.tBodies[0];

        if (tbody.rows.length > 1) {
            tbody.deleteRow(tbody.rows.length - 1);
        } else {
            alert("At least one row must remain.");
        }
    });

    resumeDraftBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!databaseDraft) {
            return;
        }

        fillForm(databaseDraft);
        currentDraftId = Number(databaseDraft.id);
        draftNotice.hidden = true;
        startLocalAutosave();
        showSuccessBanner("Draft loaded. Local auto-save is now active.");
    });

    closeDraftNoticeBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        draftNotice.hidden = true;
    });

    draftBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            const result = await postJson(collectFormData("save_draft"));
            currentDraftId = Number(result.draft_id);
            setLocalStorageKey(result.user_id);
            startLocalAutosave();
            draftNotice.hidden = true;
            showSuccessBanner(result.message || "Draft saved successfully.");
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    });

    submitBtn.addEventListener("click", async function(e) {
        e.preventDefault();

        try {
            const result = await postJson(collectFormData("submit"));
            showSuccessBanner(result.message || "Report submitted successfully!");
            stopLocalAutosave();
            clearLocalDraft();
            resetForm();
            draftNotice.hidden = true;
            databaseDraft = null;
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    });

    clearBtn.addEventListener("click", function(e) {
        e.preventDefault();
        e.stopPropagation();
        resetForm();
    });

    attachTextareaAutoExpand();
    checkDatabaseDraft();
})();
