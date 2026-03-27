<?php
header('Content-Type: application/json');

// Database configuration
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "ces_reports_db";

// Define arrays
$departments = ["CCIS", "CTHM", "CAS", "CBM", "JHS", "SHS", "CTE", "CCJE", "CCF"];
$months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Document types and their corresponding tables
$documents = [
    "3-Year Development Plan" => "3ydp",
    "Community Needs Assessment Consolidated Report" => "coordinator_cnacr",
    "Monthly Accomplishment Report" => "mar_header",
    "Program Design" => "pd_main"
];

$docKeys = ["devPlan", "needsAssessment", "monthlyReport", "programDesign"];

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    echo json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]);
    exit;
}

// Set charset to UTF-8
$conn->set_charset("utf8");

// Initialize submission data array
$submissionData = [];

// Get current year
$currentYear = date('Y');

// For each department
foreach ($departments as $department) {
    $submissionData[$department] = [];
    
    // For each document type
    $docIndex = 0;
    foreach ($documents as $docName => $tableName) {
        // Initialize monthly data array with zeros for 12 months
        $monthlyData = array_fill(0, 12, 0);
        
        // Query to get submissions for this department and document type
        // Added role = 'coordinator' condition
        $sql = "SELECT 
                    MONTH(created_at) as month,
                    COUNT(*) as submission_count
                FROM $tableName 
                WHERE department = ? 
                    AND status = 'approve'
                    AND role = 'coordinator'
                    AND YEAR(created_at) = ?
                GROUP BY MONTH(created_at)
                ORDER BY month";
        
        $stmt = $conn->prepare($sql);
        if ($stmt) {
            $stmt->bind_param("si", $department, $currentYear);
            $stmt->execute();
            $result = $stmt->get_result();
            
            // Fill in the months where submissions exist
            while ($row = $result->fetch_assoc()) {
                $monthIndex = (int)$row['month'] - 1; // Convert month (1-12) to index (0-11)
                if ($monthIndex >= 0 && $monthIndex < 12) {
                    $monthlyData[$monthIndex] = 1; // Mark as submitted if at least one exists
                }
            }
            $stmt->close();
        }
        
        $submissionData[$department][$docKeys[$docIndex]] = $monthlyData;
        $docIndex++;
    }
}

$conn->close();

// Return the data as JSON
echo json_encode([
    'success' => true,
    'months' => $months,
    'departments' => $departments,
    'documents' => array_keys($documents),
    'docKeys' => $docKeys,
    'submissionData' => $submissionData,
    'currentYear' => $currentYear
]);
?>