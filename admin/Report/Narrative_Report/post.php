<?php
session_start();
header('Content-Type: application/json');

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in']);
    exit;
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    echo json_encode(['success' => false, 'message' => 'Invalid input data']);
    exit;
}

// Sanitize and validate inputs
$type = isset($input['type']) ? htmlspecialchars($input['type']) : '';
$narrate_success = isset($input['narrate_success']) ? htmlspecialchars($input['narrate_success']) : '';
$provide_data = isset($input['provide_data']) ? htmlspecialchars($input['provide_data']) : '';
$identify_problems = isset($input['identify_problems']) ? htmlspecialchars($input['identify_problems']) : '';
$propose_solutions = isset($input['propose_solutions']) ? htmlspecialchars($input['propose_solutions']) : '';

// Validate required fields
if (empty($narrate_success) || empty($provide_data) || empty($identify_problems) || empty($propose_solutions)) {
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit;
}

// Get user data from session
$created_by_name = $_SESSION['name'] ?? '';
$role = $_SESSION['role'] ?? '';
$user_id = $_SESSION['user_id'] ?? '';
$dean = $_SESSION['dean'] ?? '';
$department = $_SESSION['department'] ?? '';

// Database connection
$host = 'localhost';
$dbname = 'ces_reports_db';
$username = 'root';  // Change this
$password = '';  // Change this

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Prepare INSERT statement
    $sql = "INSERT INTO narrative_report (
                type, 
                narrate_success, 
                provide_data, 
                identify_problems, 
                propose_solutions, 
                created_by_name, 
                role, 
                user_id, 
                dean, 
                department,
                status,
                archived,
                feedback
            ) VALUES (
                :type, 
                :narrate_success, 
                :provide_data, 
                :identify_problems, 
                :propose_solutions, 
                :created_by_name, 
                :role, 
                :user_id, 
                :dean, 
                :department,
                'pending',
                'not archived',
                ''
            )";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':type' => $type,
        ':narrate_success' => $narrate_success,
        ':provide_data' => $provide_data,
        ':identify_problems' => $identify_problems,
        ':propose_solutions' => $propose_solutions,
        ':created_by_name' => $created_by_name,
        ':role' => $role,
        ':user_id' => $user_id,
        ':dean' => $dean,
        ':department' => $department
    ]);
    
    echo json_encode([
        'success' => true, 
        'message' => 'Report submitted successfully',
        'report_id' => $pdo->lastInsertId()
    ]);
    
} catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Database error occurred']);
}
?>