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

// Define required fields
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

// Optional: Validate at least one extension service is selected
if (empty($input['extension_services'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Please select at least one extension service type.'
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
    
    // Sanitize input data
    $beneficiary_name = htmlspecialchars(strip_tags(trim($input['beneficiary_name'])));
    $implementing_department = htmlspecialchars(strip_tags(trim($input['implementing_department'])));
    $extension_services = htmlspecialchars(strip_tags(trim($input['extension_services'] ?? '')));
    $answer_one = htmlspecialchars(strip_tags(trim($input['answer_one'] ?? '')));
    $answer_two = htmlspecialchars(strip_tags(trim($input['answer_two'] ?? '')));
    $answer_three = htmlspecialchars(strip_tags(trim($input['answer_three'] ?? '')));
    $beneficiary_signature = htmlspecialchars(strip_tags(trim($input['beneficiary_signature'] ?? '')));
    $report_type = htmlspecialchars(strip_tags(trim($input['report_type'] ?? 'Monthly Accomplishment Report- Reflection Paper')));
    
    // Get session data
    $created_by_name = $_SESSION['name'] ?? '';
    $user_role = $_SESSION['role'] ?? '';
    $user_department = $_SESSION['department'] ?? '';
    $dean = $_SESSION['dean'] ?? '';
    $user_id = $_SESSION['user_id'] ?? $_SESSION['id'] ?? '';
    
    // Validate required session data
    if (empty($created_by_name)) {
        echo json_encode([
            'success' => false,
            'message' => 'Session error: User name not found.'
        ]);
        exit();
    }
    
    // Prepare SQL statement matching your table structure
    $sql = "INSERT INTO reflection_paper (
        type,
        beneficiary_name,
        implementing_department,
        extension_services,
        answer_one,
        answer_two,
        answer_three,
        beneficiary_signature,
        created_by_name,
        role,
        department,
        dean,
        user_id,
        status,
        archived,
        created_at
    ) VALUES (
        :type,
        :beneficiary_name,
        :implementing_department,
        :extension_services,
        :answer_one,
        :answer_two,
        :answer_three,
        :beneficiary_signature,
        :created_by_name,
        :role,
        :department,
        :dean,
        :user_id,
        :status,
        :archived,
        NOW()
    )";
    
    $stmt = $pdo->prepare($sql);
    
    // Execute with all parameters
    $result = $stmt->execute([
        ':type' => $report_type,
        ':beneficiary_name' => $beneficiary_name,
        ':implementing_department' => $implementing_department,
        ':extension_services' => $extension_services,
        ':answer_one' => $answer_one,
        ':answer_two' => $answer_two,
        ':answer_three' => $answer_three,
        ':beneficiary_signature' => $beneficiary_signature,
        ':created_by_name' => $created_by_name,
        ':role' => $user_role,
        ':department' => $user_department,
        ':dean' => $dean,
        ':user_id' => $user_id,
        ':status' => 'pending',  // Default status for new submissions
        ':archived' => 'not archived'
    ]);
    
    if (!$result) {
        throw new Exception('Failed to insert data into database');
    }
    
    // Get the inserted ID
    $insertedId = $pdo->lastInsertId();
    
    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'Report submitted successfully!',
        'data' => [
            'id' => $insertedId,
            'beneficiary_name' => $beneficiary_name,
            'implementing_department' => $implementing_department,
            'extension_services' => $extension_services,
            'status' => 'pending',
            'submitted_at' => date('Y-m-d H:i:s'),
            'submitted_by' => $created_by_name,
            'department' => $user_department,
            'role' => $user_role,
            'dean' => $dean
        ]
    ]);
    
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: Unable to save report. Please try again later.'
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'An unexpected error occurred. Please try again later.'
    ]);
}
?>