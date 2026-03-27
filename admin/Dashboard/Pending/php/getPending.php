<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

$host = "localhost";
$user = "root";
$pass = "";
$dbname = "ces_reports_db"; 

try {
    $conn = new mysqli($host, $user, $pass, $dbname);
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    $statusParam = $_GET['status'] ?? 'pending,need fix';
    $statusArray = array_map('trim', explode(',', $statusParam));
    $placeholders = implode(',', array_fill(0, count($statusArray), '?'));

    // Define tables and their column mappings
    $tables = [
        '3ydp'  => ['id', 'type', 'title_of_project AS title', 'created_by_name AS name', 'department', 'created_at AS date'],
        'pd_main' => ['id', 'type', 'title_of_activity AS title', 'created_by_name AS name', 'department', 'created_at AS date'],
        'dpir' => ['id', 'type', 'title_of_program AS title', 'created_by_name AS name', 'department', 'created_at AS date'],
        'mar_header' => ['id', 'type', 'title_act AS title', 'created_by_name AS name', 'department', 'created_at AS date'],
        'coordinator_cnacr' => ['id', 'type', 'title_of_program AS title', 'created_by_name AS name', 'department', 'created_at AS date']
    ];

    $allReports = [];
    foreach ($tables as $table => $columns) {
        $columnList = implode(', ', $columns);
        
        // Check if this table has a role column
        $checkRoleQuery = "SHOW COLUMNS FROM $table LIKE 'role'";
        $roleCheck = $conn->query($checkRoleQuery);
        $hasRoleColumn = $roleCheck && $roleCheck->num_rows > 0;
        
        // Build query with role filter if the column exists
        if ($hasRoleColumn) {
            $query = "SELECT $columnList 
                    FROM $table 
                    WHERE status IN ($placeholders) 
                    AND role = 'coordinator'";
        } else {
            // If no role column exists, check if this table is coordinator-specific
            // Based on table name pattern or other criteria
            if (strpos($table, 'coordinator') !== false) {
                // If table name contains 'coordinator', assume all records are for coordinators
                $query = "SELECT $columnList 
                        FROM $table 
                        WHERE status IN ($placeholders)";
            } else {
                // Skip tables without role column
                continue;
            }
        }

        $stmt = $conn->prepare($query);
        if (!$stmt) {
            // Log error if needed
            continue;
        }

        $types = str_repeat('s', count($statusArray));
        $stmt->bind_param($types, ...$statusArray);

        $stmt->execute();
        $result = $stmt->get_result();

        $tableReports = [];
        while ($row = $result->fetch_assoc()) {
            $tableReports[] = $row;
        }

        // Only add table if it has reports
        if (!empty($tableReports)) {
            $allReports[$table] = $tableReports;
        }
        
        $stmt->close();
    }

    // Also check if any admin data is being included (for debugging)
    // You can remove this after confirming it works
    foreach ($allReports as $table => $reports) {
        foreach ($reports as $report) {
            // This will help identify if any non-coordinator data is still showing
            if (isset($report['name'])) {
                // Optional: Add logging here if needed
            }
        }
    }

    echo json_encode($allReports);

} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>