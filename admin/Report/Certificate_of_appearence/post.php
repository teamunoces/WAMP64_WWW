<?php
session_start();
header('Content-Type: application/json');

// Enable error reporting for debugging (remove in production)
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Database configuration
$host = 'localhost';
$db   = 'ces_reports_db';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
    
    // Get JSON input from the request body
    $input = json_decode(file_get_contents('php://input'), true);
    
    // If not JSON, try regular POST
    if (!$input) {
        $input = $_POST;
    }
    
    // Validate required fields
    $requiredFields = ['participant', 'cert_department', 'activity_name', 'monitored_by', 'verified_by'];
    $missingFields = [];
    
    foreach ($requiredFields as $field) {
        if (empty($input[$field])) {
            $missingFields[] = $field;
        }
    }
    
    if (!empty($missingFields)) {
        throw new Exception('Missing required fields: ' . implode(', ', $missingFields));
    }
    
    // ===== Get logged-in user's info =====
    $createdBy = $_SESSION['name'] ?? 'Unknown User';
    $role = $_SESSION['role'] ?? 'N/A';
    $user_id = $_SESSION['user_id'] ?? '0';
    $dean = $_SESSION['dean'] ?? 'N/A';
    $department = $_SESSION['department'] ?? 'N/A';
    
    // ===== Get report type from input =====
    $reportType = $input['report_type'] ?? 'Certificate of Appearance';
    
    // Start transaction
    $pdo->beginTransaction();
    
    // Insert into cert_appearance table
    $sql = "INSERT INTO cert_appearance 
            (type, participant, cert_department, activity_name, location, date_held, month_held, year_held, location_two, 
             monitored_by, verified_by, created_by_name, feedback, status, role, user_id, dean, department, archived) 
            VALUES 
            (:type, :participant, :cert_department, :activity_name, :location, :date_held, :month_held, :year_held, :location_two, 
             :monitored_by, :verified_by, :created_by_name, :feedback, :status, :role, :user_id, :dean, :department, :archived)";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':type'              => $reportType,
        ':participant'       => $input['participant'] ?? '', // Using 'name' as participant
        ':cert_department'   => $input['cert_department'] ?? '',
        ':activity_name'     => $input['activity_name'] ?? '',
        ':location'          => $input['location'] ?? '',
        ':date_held'         => $input['date_held'] ?? '',
        ':month_held'        => $input['month_held'] ?? '',
        ':year_held'         => $input['year_held'] ?? '',
        ':location_two'      => $input['location_two'] ?? '',
        ':monitored_by'      => $input['monitored_by'] ?? '',
        ':verified_by'       => $input['verified_by'] ?? '',
        ':created_by_name'   => $createdBy,
        ':feedback'          => $input['feedback'] ?? '',
        ':status'            => 'pending', // Default status
        ':role'              => $role,
        ':user_id'           => $user_id,
        ':dean'              => $dean,
        ':department'        => $department,
        ':archived'          => 'not archived'
    ]);
    
    $reportId = $pdo->lastInsertId();
    
    // Optional: Insert into audit log
    if (isset($input['enable_audit']) && $input['enable_audit'] === true) {
        $sqlAudit = "INSERT INTO audit_log 
                     (user_id, action, table_name, record_id, details, ip_address, created_at) 
                     VALUES 
                     (:user_id, :action, :table_name, :record_id, :details, :ip_address, NOW())";
        
        $stmtAudit = $pdo->prepare($sqlAudit);
        $stmtAudit->execute([
            ':user_id'      => $user_id,
            ':action'       => 'INSERT',
            ':table_name'   => 'cert_appearance',
            ':record_id'    => $reportId,
            ':details'      => json_encode($input),
            ':ip_address'   => $_SERVER['REMOTE_ADDR'] ?? ''
        ]);
    }
    
    // Commit transaction
    $pdo->commit();
    
    // Prepare success response
    $response = [
        'success' => true,
        'message' => 'Certificate data successfully inserted!',
        'report_id' => $reportId,
        'report_type' => $reportType,
        'data' => [
            'participant' => $input['name'],
            'department' => $input['cert_department'],
            'activity_name' => $input['activity_name'],
            'monitored_by' => $input['monitored_by'],
            'verified_by' => $input['verified_by'],
            'created_by' => $createdBy,
            'status' => 'pending'
        ]
    ];
    
    echo json_encode($response);
    
} catch (PDOException $e) {
    // Rollback transaction on error
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    
    http_response_code(500);
    $errorResponse = [
        'success' => false,
        'message' => 'Database error occurred',
        'error' => $e->getMessage() // Remove in production
    ];
    echo json_encode($errorResponse);
    
} catch (Exception $e) {
    http_response_code(400);
    $errorResponse = [
        'success' => false,
        'message' => $e->getMessage()
    ];
    echo json_encode($errorResponse);
}
?>