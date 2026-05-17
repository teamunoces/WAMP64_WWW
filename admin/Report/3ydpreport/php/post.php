<?php
session_start();
header('Content-Type: application/json');

try {
    $conn = new mysqli("localhost", "root", "", "ces_reports_db");
    if ($conn->connect_error) throw new Exception($conn->connect_error);

    // Make sure required session variables exist
    if (!isset($_SESSION['name'], $_SESSION['department'], $_SESSION['role'], $_SESSION['user_id'])) {
        throw new Exception("User not logged in");
    }

    $created_by_name = $_SESSION['name'];
    $department = $_SESSION['department'];
    $role = $_SESSION['role'];
    $user_id = $_SESSION['user_id'];

    // --- Approval data scoped to the user's department ---
    $approvalConn = new mysqli("localhost", "root", "", "approval_db");
    if ($approvalConn->connect_error) throw new Exception($approvalConn->connect_error);

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

    $approvalStmt = $approvalConn->prepare("
        SELECT
            ces_head,
            ces_head_suffix,
            vp_acad,
            vp_acad_suffix,
            vp_admin,
            vp_admin_suffix,
            school_president,
            school_president_suffix
        FROM approvals
        ORDER BY updated_at DESC
        LIMIT 1
    ");
    if (($_SESSION['role'] ?? '') === 'admin') {
        $approvalStmt->execute();
        $approvalResult = $approvalStmt->get_result();
    } else {
        $approvalResult = false;
    }
    if ($approvalResult && $approvalRow = $approvalResult->fetch_assoc()) {
        $approvalData = array_merge($approvalData, $approvalRow);
    }
    $approvalStmt->close();

    $documentInfo = [
        'issue_status' => '',
        'revision_number' => '',
        'date_effective' => '',
        'approved_by' => ''
    ];

    $documentResult = $approvalConn->query("
        SELECT
            issue_status,
            revision_number,
            date_effective,
            approved_by
        FROM document_info
        ORDER BY updated_at DESC
        LIMIT 1
    ");
    if ($documentResult && $documentRow = $documentResult->fetch_assoc()) {
        $documentInfo = array_merge($documentInfo, $documentRow);
    }
    $approvalConn->close();

    $input = file_get_contents("php://input");
    $data = json_decode($input, true);
    if (!$data) throw new Exception("Invalid JSON input");

    // --- Main report fields ---
    $type = $data['report_type'] ?? '3-year Development Plan';
    $title = $data['title_of_project'] ?? '';
    $description = $data['description_of_project'] ?? '';
    $general_objectives = $data['general_objectives'] ?? '';
    $program_justification = $data['program_justification'] ?? '';
    $beneficiaries = $data['beneficiaries'] ?? '';
    $program_plan_text = $data['program_plan_text'] ?? '';

    // --- Insert main report ---
    $stmt = $conn->prepare("INSERT INTO `3ydp`
        (
            type,
            title_of_project,
            description_of_project,
            general_objectives,
            program_justification,
            beneficiaries,
            program_plan_text,
            created_by_name,
            department,
            role,
            user_id,
            dean,
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
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $paramTypes = str_repeat("s", 24);
    $stmt->bind_param(
        $paramTypes,
        $type,
        $title,
        $description,
        $general_objectives,
        $program_justification,
        $beneficiaries,
        $program_plan_text,
        $created_by_name,
        $department,
        $role,
        $user_id,
        $approvalData['dean'],
        $approvalData['ces_head'],
        $approvalData['ces_head_suffix'],
        $approvalData['vp_acad'],
        $approvalData['vp_acad_suffix'],
        $approvalData['vp_admin'],
        $approvalData['vp_admin_suffix'],
        $approvalData['school_president'],
        $approvalData['school_president_suffix'],
        $documentInfo['issue_status'],
        $documentInfo['revision_number'],
        $documentInfo['date_effective'],
        $documentInfo['approved_by']
    );
    $stmt->execute();
    $report_id = $conn->insert_id;
    $stmt->close();

    // --- Insert program rows ---
    $rows = $data['programPlanTable'] ?? [];
    $inserted = 0;

    if ($rows) {
        $stmt2 = $conn->prepare("INSERT INTO `3ydp_programs`
            (report_id, program, objectives, strategies, persons_agencies_involved, resources_needed, budget, means_of_verification, time_frame)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        
        foreach ($rows as $row) {
            $program = $row['program'] ?? '';
            $objectives = $row['objectives'] ?? '';
            $strategies = $row['strategies'] ?? '';
            $persons_agencies = $row['persons_agencies_involved'] ?? '';
            $resources_needed = $row['resources_needed'] ?? '';
            $budget = $row['budget'] ?? '';
            $means_of_verification = $row['means_of_verification'] ?? '';
            $time_frame = $row['time_frame'] ?? '';
            
            $stmt2->bind_param(
                "issssssss",
                $report_id,
                $program,
                $objectives,
                $strategies,
                $persons_agencies,
                $resources_needed,
                $budget,
                $means_of_verification,
                $time_frame
            );
            if ($stmt2->execute()) $inserted++;
        }
        $stmt2->close();
    }

    $conn->close();

    echo json_encode([
        "success" => true,
        "message" => "Report inserted with $inserted program row(s).",
        "report_id" => $report_id
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
