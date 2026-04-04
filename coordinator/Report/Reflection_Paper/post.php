<?php
// post.php
// Handles saving reflection paper data to the database

session_start();

// Set response headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Check if user is logged in
if (!isset($_SESSION['name']) || !isset($_SESSION['role'])) {
    echo json_encode([
        'success' => false,
        'message' => 'User not authenticated. Please login first.'
    ]);
    exit();
}

// Check if request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method. Only POST is allowed.'
    ]);
    exit();
}

// Get JSON input
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);

// Validate JSON input
if (!$input) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid JSON input'
    ]);
    exit();
}

// Validate required fields
$requiredFields = ['beneficiary_name', 'implementing_department'];
$missingFields = [];

foreach ($requiredFields as $field) {
    if (empty($input[$field])) {
        $missingFields[] = $field;
    }
}

if (!empty($missingFields)) {
    echo json_encode([
        'success' => false,
        'message' => 'Missing required fields: ' . implode(', ', $missingFields)
    ]);
    exit();
}

// Database connection
$host = 'localhost';
$dbname = 'ces_reports_db';
$username = 'root'; // Change to your database username
$password = '';     // Change to your database password

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Prepare SQL statement with session data fields
    $sql = "INSERT INTO reflection_paper (
        beneficiary_name,
        implementing_department,
        extension_services,
        answer_one,
        answer_two,
        answer_three,
        beneficiary_signature,
        report_type,
        submitted_at,
        created_by_name,
        created_by_role,
        created_by_department,
        dean,
        created_at
    ) VALUES (
        :beneficiary_name,
        :implementing_department,
        :extension_services,
        :answer_one,
        :answer_two,
        :answer_three,
        :beneficiary_signature,
        :report_type,
        :submitted_at,
        :created_by_name,
        :created_by_role,
        :created_by_department,
        :dean,
        NOW()
    )";
    
    $stmt = $pdo->prepare($sql);
    
    // Sanitize and bind parameters from form input
    $beneficiary_name = htmlspecialchars(strip_tags(trim($input['beneficiary_name'])));
    $implementing_department = htmlspecialchars(strip_tags(trim($input['implementing_department'])));
    $extension_services = htmlspecialchars(strip_tags(trim($input['extension_services'] ?? '')));
    $answer_one = htmlspecialchars(strip_tags(trim($input['answer_one'] ?? '')));
    $answer_two = htmlspecialchars(strip_tags(trim($input['answer_two'] ?? '')));
    $answer_three = htmlspecialchars(strip_tags(trim($input['answer_three'] ?? '')));
    $beneficiary_signature = htmlspecialchars(strip_tags(trim($input['beneficiary_signature'] ?? '')));
    $report_type = htmlspecialchars(strip_tags(trim($input['report_type'] ?? 'MONTHLY ACCOMPLISHMENT REPORT- REFLECTION PAPER')));
    $submitted_at = $input['submitted_at'] ?? date('Y-m-d H:i:s');
    
    // Get session data
    $created_by_name = $_SESSION['name'] ?? '';
    $created_by_role = $_SESSION['role'] ?? '';
    $created_by_department = $_SESSION['department'] ?? '';
    $dean = $_SESSION['dean'] ?? '';
    
    // Execute the statement
    $stmt->execute([
        ':beneficiary_name' => $beneficiary_name,
        ':implementing_department' => $implementing_department,
        ':extension_services' => $extension_services,
        ':answer_one' => $answer_one,
        ':answer_two' => $answer_two,
        ':answer_three' => $answer_three,
        ':beneficiary_signature' => $beneficiary_signature,
        ':report_type' => $report_type,
        ':submitted_at' => $submitted_at,
        ':created_by_name' => $created_by_name,
        ':created_by_role' => $created_by_role,
        ':created_by_department' => $created_by_department,
        ':dean' => $dean
    ]);
    
    // Get the inserted ID
    $insertedId = $pdo->lastInsertId();
    
    // Return success response with session info
    echo json_encode([
        'success' => true,
        'message' => 'Report submitted successfully',
        'data' => [
            'id' => $insertedId,
            'beneficiary_name' => $beneficiary_name,
            'implementing_department' => $implementing_department,
            'submitted_at' => $submitted_at,
            'submitted_by' => $created_by_name,
            'department' => $created_by_department,
            'dean' => $dean
        ]
    ]);
    
} catch (PDOException $e) {
    // Log error (in production, use error_log)
    error_log("Database error: " . $e->getMessage());
    
    echo json_encode([
        'success' => false,
        'message' => 'Database error: Unable to save report. Please try again later.'
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'An unexpected error occurred: ' . $e->getMessage()
    ]);
}
?>