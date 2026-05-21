<?php
session_start();
header('Content-Type: application/json');

$conn = new mysqli("localhost", "root", "", "ces_database");

if ($conn->connect_error) {
    echo json_encode(["error" => $conn->connect_error]);
    exit;
}

$reports = [];

// ✅ ONLY THESE TABLES WILL BE USED
$allowedTables = [
    "report_3ydp",
    "report_cert_appearance",
    "report_cnacr",
    "report_coordinator_cnacr",
    "report_mar_header",
    "report_narrative",
    "report_program_monitoring_form",
    "report_reflection_paper",
    "report_evaluation",
    "report_pd_main"
];

foreach ($allowedTables as $tableName) {

    // ✅ CHECK IF TABLE EXISTS (SAFE)
    $checkTable = $conn->query("SHOW TABLES LIKE '$tableName'");
    if ($checkTable->num_rows == 0) continue;

    // ✅ CHECK COLUMNS
    $hasStatus   = $conn->query("SHOW COLUMNS FROM `$tableName` LIKE 'status'")->num_rows > 0;
    $hasRole     = $conn->query("SHOW COLUMNS FROM `$tableName` LIKE 'role'")->num_rows > 0;
    $hasArchived = $conn->query("SHOW COLUMNS FROM `$tableName` LIKE 'archived'")->num_rows > 0;

    // ✅ BUILD QUERY
    $query = "SELECT * FROM `$tableName`";
    if ($hasArchived) {
        $query .= " WHERE archived = 'not archived'";
    }

    $result = $conn->query($query);

    if ($result) {
        while ($row = $result->fetch_assoc()) {

            // ✅ TITLE DETECTION
            $title = $row['title'] ??
                     $row['title_act'] ??
                     $row['title_of_project'] ??
                     $row['title_of_activity'] ??
                     $row['title_of_program'] ??
                     $row['program_title'] ??
                     "N/A";

            // ✅ DEPARTMENT DETECTION
            $department = $row['department'] ??
                          $row['office'] ??
                          "N/A";

            // ✅ DATE DETECTION
            $created_at = $row['created_at'] ??
                          $row['date_created'] ??
                          null;

            // ✅ ROLE FIX
            $role = $hasRole ? strtolower($row['role']) : 'coordinator';

            // ✅ STATUS FIX
            $status = $hasStatus ? strtolower($row['status']) : 'pending';

            $reports[] = [
                "id" => $row['id'] ?? null,
                "title" => $title,
                "department" => $department,
                "created_at" => $created_at,
                "type" => $row['type'] ?? '',
                "status" => $status,
                "role" => $role,
                "source_table" => $tableName
            ];
        }
    }
}

echo json_encode($reports);
$conn->close();
?>
