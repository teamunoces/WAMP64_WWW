let reportData = {
    pending: {}
};

const isDebug = new URLSearchParams(window.location.search).has("debug");
const debugLog = (...args) => {
    if (isDebug) {
        console.log(...args);
    }
};
const debugWarn = (...args) => {
    if (isDebug) {
        console.warn(...args);
    }
};

const reviewPages = {
    "community needs assessment consolidated report": "./review/cnacr/cnacrreview.php",
    "3-year development plan": "./review/3ydp/3ydpreview.php",
    "program design": "./review/programdesign/pdview.php",
    "departmental planned initiative report": "./review/dpir/dpirreview.php",
    "monthly accomplishment report": "./review/monthlyaccomplishment/monthlyaccomplishmentreview.php",
    "evaluation sheet for extension services": "./review/evaluation/evaluationreview.php",
    "Certificate of Appearance" : "./review/coa/coareview.php",
    "Monthly Accomplishment Report- Reflection Paper" : "./review/reflection/reflectionreview.php",
    "Monthly Accomplishment Report- Narrative Report" : "./review/narrative/narrativeview.php"



};

async function loadReports(status, tableBodyId) {
    try {
        debugLog(`Loading reports with status: ${status}`);
        
        const response = await fetch(`/SYSTEM_VERSION_!/coordinator/Dashboard/PHP/getPending.php?status=${encodeURIComponent(status)}`);
        const data = await response.json();
        
        debugLog("Raw response from server:", data);
        
        if (data.error) {
            debugWarn("Server Error:", data.error);
            alert("Server Error: " + data.error);
            return;
        }
        
        // Check debug info
        if (data._debug) {
            debugLog("Debug info:", data._debug);
            if (data._debug.total_records_found === 0) {
                debugWarn("No records found. Check debug info above.");
            }
        }
        
        // Check if there's a message
        if (data._message) {
            debugLog("Server message:", data._message);
        }
        
        reportData[status] = data;
        
        let combined = [];
        let tablesWithData = [];
        
        // Combine all reports from all tables
        Object.entries(data).forEach(([tableName, tableData]) => {
            // Skip debug and message keys
            if (tableName !== '_debug' && tableName !== '_message' && Array.isArray(tableData)) {
                debugLog(`Table ${tableName}: ${tableData.length} records`);
                if (tableData.length > 0) {
                    tablesWithData.push(tableName);
                    debugLog(`Sample record from ${tableName}:`, tableData[0]);
                }
                combined = combined.concat(tableData);
            }
        });
        
        debugLog(`Tables with data: ${tablesWithData.join(', ') || 'none'}`);
        debugLog(`Total combined records: ${combined.length}`);
        
        if (combined.length === 0) {
            debugLog("No reports to display. Check if:");
            debugLog("1. The user_id in session matches records in database");
            debugLog("2. The status filter is correct");
            debugLog("3. The table columns match the SELECT query");
        }
        
        renderTable(combined, tableBodyId, status);
        
    } catch (error) {
        debugWarn("Connection Error:", error);
        alert("Error loading reports: " + error.message);
    }
}

function renderTable(data, tableBodyId, status) {
    const tableBody = document.getElementById(tableBodyId);
    if (!tableBody) {
        debugWarn(`Table body with id '${tableBodyId}' not found`);
        return;
    }

    if (!Array.isArray(data) || data.length === 0) {
        tableBody.innerHTML =
            `<tr>
                <td colspan="7" class="no-reports">No pending reports found for user ID: ${data._debug?.user_id_from_session || 'unknown'}</td>
            </tr>`;
        return;
    }

    debugLog(`Rendering ${data.length} reports`);
    
    tableBody.innerHTML = data.map(report => {
        debugLog("Rendering report:", report);
        
        return `
        <tr>
            <td>${report.type || 'N/A'}</td>
            <td>${report.title || 'N/A'}</td>
            <td>${report.name || 'N/A'}</td>
            <td>${report.department || 'N/A'}</td>
            <td>${report.date || 'N/A'}</td>
            <td>${report.status || 'N/A'}</td>
          
        </tr>
    `}).join('');
}

function applyFilter(status, tableBodyId) {
    const filterId = "pendingTypeFilter";
    
    const selected = document
        .getElementById(filterId)
        .value
        .toLowerCase();

    let combined = [];

    const dataObj = reportData[status] || {};

    for (let table in dataObj) {
        if (table !== '_debug' && table !== '_message' && Array.isArray(dataObj[table])) {
            combined = combined.concat(dataObj[table]);
        }
    }

    const filtered =
        selected === "all"
            ? combined
            : combined.filter(r =>
                (r.type || "").toLowerCase() === selected
            );

    renderTable(filtered, tableBodyId, status);
}

function viewReport(reportId, reportType, status) {
    const typeKey = reportType.toLowerCase().trim();
    
    if (reviewPages.hasOwnProperty(typeKey)) {
        const baseUrl = reviewPages[typeKey];
        const url = `${baseUrl}?id=${encodeURIComponent(reportId)}&status=${encodeURIComponent(status)}&page=pending`;
        window.location.href = url;
    } else {
        debugWarn(`No review page found for report type: ${reportType}`);
        alert(`Review page not configured for report type: ${reportType}`);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    debugLog("DOM loaded, loading reports...");
    loadReports("pending", "pendingTableBody");
});
