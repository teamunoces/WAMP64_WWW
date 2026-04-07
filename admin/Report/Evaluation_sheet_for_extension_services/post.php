<?php
/**
 * save_evaluation_report.php
 * Receives JSON data from Evaluation Report Form and saves to evaluation_reports table
 */

// Enable error reporting for debugging (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Set headers for JSON response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed. Use POST.']);
    exit();
}

// Get JSON input
$jsonInput = file_get_contents('php://input');
$data = json_decode($jsonInput, true);

// Validate JSON
if ($data === null) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON data received']);
    exit();
}

// Database configuration
$dbConfig = [
    'host' => 'localhost',
    'username' => 'root',
    'password' => '',
    'database' => 'ces_reports_db'
];

// Database connection
$conn = new mysqli(
    $dbConfig['host'],
    $dbConfig['username'],
    $dbConfig['password'],
    $dbConfig['database']
);

// Check connection
if ($conn->connect_error) {
    error_log("DB Connection Error: " . $conn->connect_error);
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database connection error. Please try again later.'
    ]);
    exit();
}

// Set charset
$conn->set_charset("utf8mb4");

// Start session to get user info
session_start();

// ========================
// EXTRACT DATA FROM JSON
// ========================

// Basic information
$type = $data['type'] ?? '';
$venue = $data['venue'] ?? '';
$implementing_department = $data['implementing_department'] ?? '';
$serviceTypes = is_array($data['serviceTypes']) ? implode(', ', $data['serviceTypes']) : ($data['serviceTypes'] ?? '');
$evaluatedBy = $data['evaluatedBy'] ?? '';
$signature = $data['signature'] ?? '';
$evaluationDate = $data['evaluationDate'] ?? '';
$feedback = $data['feedback'] ?? '';  // Now optional, will be empty if not provided

// Extract ratings (questions 1-15)
$q1_rating = isset($data['ratings']['q1']) ? intval($data['ratings']['q1']) : null;
$q2_rating = isset($data['ratings']['q2']) ? intval($data['ratings']['q2']) : null;
$q3_rating = isset($data['ratings']['q3']) ? intval($data['ratings']['q3']) : null;
$q4_rating = isset($data['ratings']['q4']) ? intval($data['ratings']['q4']) : null;
$q5_rating = isset($data['ratings']['q5']) ? intval($data['ratings']['q5']) : null;
$q6_rating = isset($data['ratings']['q6']) ? intval($data['ratings']['q6']) : null;
$q7_rating = isset($data['ratings']['q7']) ? intval($data['ratings']['q7']) : null;
$q8_rating = isset($data['ratings']['q8']) ? intval($data['ratings']['q8']) : null;
$q9_rating = isset($data['ratings']['q9']) ? intval($data['ratings']['q9']) : null;
$q10_rating = isset($data['ratings']['q10']) ? intval($data['ratings']['q10']) : null;
$q11_rating = isset($data['ratings']['q11']) ? intval($data['ratings']['q11']) : null;
$q12_rating = isset($data['ratings']['q12']) ? intval($data['ratings']['q12']) : null;
$q13_rating = isset($data['ratings']['q13']) ? intval($data['ratings']['q13']) : null;
$q14_rating = isset($data['ratings']['q14']) ? intval($data['ratings']['q14']) : null;
$q15_rating = isset($data['ratings']['q15']) ? intval($data['ratings']['q15']) : null;

// User information from session
$createdByName = $_SESSION['name'] ?? 'Unknown User';
$userRole = $_SESSION['role'] ?? $_SESSION['user_role'] ?? '';
$userId = $_SESSION['user_id'] ?? $_SESSION['id'] ?? '';
$dean = $_SESSION['dean'] ?? $_SESSION['department_head'] ?? '';
$department = $_SESSION['department'] ?? $_SESSION['user_department'] ?? '';

// Status and archive flags
$status = 'pending';
$archived = 'not archived';

// Validate required fields
if (empty($venue)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Venue is required'
    ]);
    $conn->close();
    exit();
}

if (empty($evaluatedBy)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Evaluated by is required'
    ]);
    $conn->close();
    exit();
}

// ========================
// BUILD AND EXECUTE SQL
// ========================

$sql = "INSERT INTO evaluation_reports (
    type,
    venue, implementing_department, service_types,
    q1_rating, q2_rating, q3_rating, q4_rating, q5_rating,
    q6_rating, q7_rating, q8_rating, q9_rating, q10_rating,
    q11_rating, q12_rating, q13_rating, q14_rating, q15_rating,
    evaluated_by, signature, evaluation_date,
    created_by_name, status, archived, role, user_id, dean, department
) VALUES (
    ?,
    ?, ?, ?,
    ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?,
    ?, ?, ?, ?, ?,
    ?, ?, ?,
    ?, ?, ?, ?, ?, ?, ?
)";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    error_log("SQL Prepare Error: " . $conn->error);
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error. Please try again later.'
    ]);
    $conn->close();
    exit();
}


$stmt->bind_param(
    "ssssiiiiiiiiiiiiiiissssssssss",
    $type,
    $venue,
    $implementing_department,
    $serviceTypes,
    $q1_rating,
    $q2_rating,
    $q3_rating,
    $q4_rating,
    $q5_rating,
    $q6_rating,
    $q7_rating,
    $q8_rating,
    $q9_rating,
    $q10_rating,
    $q11_rating,
    $q12_rating,
    $q13_rating,
    $q14_rating,
    $q15_rating,
    $evaluatedBy,
    $signature,
    $evaluationDate,
    $createdByName,
    $status,
    $archived,
    $userRole,
    $userId,
    $dean,
    $department
);

if ($stmt->execute()) {
    $insertedId = $conn->insert_id;
    error_log("Evaluation report submitted successfully - ID: $insertedId, Venue: $venue, By: $evaluatedBy");
    
    echo json_encode([
        'success' => true,
        'message' => 'Evaluation Report submitted successfully',
        'report_id' => $insertedId,
        'submission_date' => date('Y-m-d H:i:s'),
        'venue' => $venue,
        'status' => $status
    ]);
} else {
    error_log("Database Insert Error: " . $stmt->error);
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to save report. Please try again.',
        'error' => $stmt->error
    ]);
}

$stmt->close();
$conn->close();
?>