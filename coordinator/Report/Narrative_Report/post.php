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
$department = $_SESSION['department'] ?? '';

// Database connection
$host = 'localhost';
$dbname = 'ces_reports_db';
$username = 'root';  // Change this
$password = '';  // Change this

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $approvalData = [
        'dean' => $_SESSION['dean'] ?? '',
        'ces_head' => '',
        'ces_head_suffix' => '',
        'vp_acad' => '',
        'vp_acad_suffix' => '',
        'vp_admin' => '',
        'vp_admin_suffix' => '',
        'school_president' => '',
        'school_president_suffix' => ''
    ];

    $approvalStmt = $pdo->prepare("
        SELECT ces_head, ces_head_suffix, vp_acad, vp_acad_suffix,
               vp_admin, vp_admin_suffix, school_president, school_president_suffix
        FROM approval_db.approvals
        ORDER BY updated_at DESC
        LIMIT 1
    ");
    $approvalStmt->execute();
    if ($approvalRow = $approvalStmt->fetch(PDO::FETCH_ASSOC)) {
        $approvalData = array_merge($approvalData, $approvalRow);
    }

    $documentInfo = [
        'issue_status' => '',
        'revision_number' => '',
        'date_effective' => '',
        'approved_by' => ''
    ];

    $documentStmt = $pdo->query("
        SELECT issue_status, revision_number, date_effective, approved_by
        FROM approval_db.document_info
        ORDER BY updated_at DESC
        LIMIT 1
    ");
    if ($documentRow = $documentStmt->fetch(PDO::FETCH_ASSOC)) {
        $documentInfo = array_merge($documentInfo, $documentRow);
    }
    
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
                feedback,
                ces_head,
                ces_head_suffix,
                vp_acad,
                vp_acad_suffix,
                vp_admin,
                vp_admin_suffix,
                school_president,
                school_president_suffix,
                issue_status,
                revision_number,
                date_effective,
                approved_by
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
                '',
                :ces_head,
                :ces_head_suffix,
                :vp_acad,
                :vp_acad_suffix,
                :vp_admin,
                :vp_admin_suffix,
                :school_president,
                :school_president_suffix,
                :issue_status,
                :revision_number,
                :date_effective,
                :approved_by
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
        ':dean' => $approvalData['dean'],
        ':department' => $department,
        ':ces_head' => $approvalData['ces_head'],
        ':ces_head_suffix' => $approvalData['ces_head_suffix'],
        ':vp_acad' => $approvalData['vp_acad'],
        ':vp_acad_suffix' => $approvalData['vp_acad_suffix'],
        ':vp_admin' => $approvalData['vp_admin'],
        ':vp_admin_suffix' => $approvalData['vp_admin_suffix'],
        ':school_president' => $approvalData['school_president'],
        ':school_president_suffix' => $approvalData['school_president_suffix'],
        ':issue_status' => $documentInfo['issue_status'],
        ':revision_number' => $documentInfo['revision_number'],
        ':date_effective' => $documentInfo['date_effective'],
        ':approved_by' => $documentInfo['approved_by']
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
