<?php

session_start();
header('Content-Type: application/json');

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

    // ===== Get logged-in user's info =====
    $createdBy = $_SESSION['name'] ?? 'Unknown User';
    $role = $_SESSION['role'] ?? 'N/A';
    $user_id = $_SESSION['user_id'] ?? '0'; // Ensure it matches your login session key
    $sessionDepartment = $_SESSION['department'] ?? '';

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
    if ($documentRow = $documentStmt->fetch()) {
        $documentInfo = array_merge($documentInfo, $documentRow);
    }
    

    // 1. Insert into pd_main with role and user_id
    $sqlMain = "INSERT INTO pd_main 
    (type, department, title_of_activity, participants, location, created_by_name, feedback, status, role, user_id, dean,
     ces_head, ces_head_suffix, vp_acad, vp_acad_suffix, vp_admin, vp_admin_suffix, school_president,
     school_president_suffix, issue_status, revision_number, date_effective, approved_by) 
    VALUES (:type, :department, :title_of_activity, :participants, :location, :created_by_name, :feedback, :status, :role, :user_id, :dean,
     :ces_head, :ces_head_suffix, :vp_acad, :vp_acad_suffix, :vp_admin, :vp_admin_suffix, :school_president,
     :school_president_suffix, :issue_status, :revision_number, :date_effective, :approved_by)";
    
    $stmtMain = $pdo->prepare($sqlMain);
    $stmtMain->execute([
        ':type'              => $_POST['type'] ?? 'Program Design',
        ':department'        => $_POST['department'] ?? '',
        ':title_of_activity' => $_POST['title_of_activity'] ?? '',
        ':participants'      => $_POST['participants'] ?? 0,
        ':location'          => $_POST['location'] ?? '',
        ':created_by_name'   => $createdBy,
        ':feedback'          => $_POST['feedback'] ?? '',
        ':status'            => $_POST['status'] ?? 'pending',
        ':role'              => $role,
        ':user_id'           => $user_id,
        ':dean'              => $approvalData['dean'],
        ':ces_head'          => $approvalData['ces_head'],
        ':ces_head_suffix'   => $approvalData['ces_head_suffix'],
        ':vp_acad'           => $approvalData['vp_acad'],
        ':vp_acad_suffix'    => $approvalData['vp_acad_suffix'],
        ':vp_admin'          => $approvalData['vp_admin'],
        ':vp_admin_suffix'   => $approvalData['vp_admin_suffix'],
        ':school_president'  => $approvalData['school_president'],
        ':school_president_suffix' => $approvalData['school_president_suffix'],
        ':issue_status'      => $documentInfo['issue_status'],
        ':revision_number'   => $documentInfo['revision_number'],
        ':date_effective'    => $documentInfo['date_effective'],
        ':approved_by'       => $documentInfo['approved_by']
    ]);

$reportId = $pdo->lastInsertId();

        // 2. Insert into pd_detail
        if (!empty($_POST['program'])) {
            $sqlDetail = "INSERT INTO pd_detail
            (report_id, program, objectives, program_content_and_activities, service_delivery, partnerships_and_stakeholders, facilitators_and_trainers, program_start_and_end_dates, frequency_of_activities, community_resources, school_resources, risk_management_and_contingency_plans, sustainability_and_follow_up, promotion_and_awareness)
            VALUES
            (:report_id, :program, :objectives, :program_content_and_activities, :service_delivery, :partnerships_and_stakeholders, :facilitators_and_trainers, :program_start_and_end_dates, :frequency_of_activities, :community_resources, :school_resources, :risk_management_and_contingency_plans, :sustainability_and_follow_up, :promotion_and_awareness)";
            
            $stmtDetail = $pdo->prepare($sqlDetail);

            foreach ($_POST['program'] as $i => $progName) {
                if (empty($progName) && empty($_POST['objectives'][$i])) continue;

                $stmtDetail->execute([
                    ':report_id'                        => $reportId,
                    ':program'                          => $progName,
                    ':objectives'                       => $_POST['objectives'][$i] ?? '',
                    ':program_content_and_activities'   => $_POST['program_content_and_activities'][$i] ?? '',
                    ':service_delivery'                 => $_POST['service_delivery'][$i] ?? '',
                    ':partnerships_and_stakeholders'    => $_POST['partnerships_and_stakeholders'][$i] ?? '',
                    ':facilitators_and_trainers'        => $_POST['facilitators_and_trainers'][$i] ?? '',
                    ':program_start_and_end_dates'      => $_POST['program_start_and_end_dates'][$i] ?? '',
                    ':frequency_of_activities'          => $_POST['frequency_of_activities'][$i] ?? '',
                    ':community_resources'              => $_POST['community_resources'][$i] ?? '',
                    ':school_resources'                 => $_POST['school_resources'][$i] ?? '',
                    ':risk_management_and_contingency_plans' => $_POST['risk_management_and_contingency_plans'][$i] ?? '',
                    ':sustainability_and_follow_up'     => $_POST['sustainability_and_follow_up'][$i] ?? '',
                    ':promotion_and_awareness'          => $_POST['promotion_and_awareness'][$i] ?? ''
                ]);
            }
        }

    echo "Data successfully inserted! Report ID: $reportId";

} catch (\PDOException $e) {
    http_response_code(500);
    echo "Database error: " . $e->getMessage();
}
?>
