<?php
session_start();
header('Content-Type: application/json');

function sendJson($payload, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($payload);
    exit;
}

function requireLogin() {
    if (!isset($_SESSION['name'], $_SESSION['department'], $_SESSION['role'], $_SESSION['user_id'])) {
        throw new Exception("User not logged in");
    }
}

function ensureDraftStatus(mysqli $conn) {
    $result = $conn->query("SHOW COLUMNS FROM `3ydp` LIKE 'status'");
    $column = $result ? $result->fetch_assoc() : null;

    if (!$column || stripos($column['Type'], 'enum(') !== 0 || strpos($column['Type'], "'draft'") !== false) {
        return;
    }

    preg_match_all("/'((?:[^'\\\\]|\\\\.)*)'/", $column['Type'], $matches);
    $values = array_map(fn($value) => "'" . $conn->real_escape_string(stripslashes($value)) . "'", $matches[1]);
    $values[] = "'draft'";

    $nullSql = strtoupper($column['Null']) === 'YES' ? 'NULL' : 'NOT NULL';
    $defaultSql = $column['Default'] !== null ? " DEFAULT '" . $conn->real_escape_string($column['Default']) . "'" : '';
    $sql = "ALTER TABLE `3ydp` MODIFY `status` ENUM(" . implode(",", $values) . ") $nullSql$defaultSql";

    if (!$conn->query($sql)) {
        throw new Exception("Unable to update status enum for drafts: " . $conn->error);
    }
}

function getApprovalData() {
    $approvalConn = new mysqli("localhost", "root", "", "approval_db");
    if ($approvalConn->connect_error) {
        throw new Exception($approvalConn->connect_error);
    }

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
    $approvalStmt->execute();
    $approvalResult = $approvalStmt->get_result();

    if ($approvalRow = $approvalResult->fetch_assoc()) {
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

    return [$approvalData, $documentInfo];
}

function normalizeReportData(array $data) {
    return [
        'type' => $data['report_type'] ?? '3-year Development Plan',
        'title' => $data['title_of_project'] ?? '',
        'description' => $data['description_of_project'] ?? '',
        'general_objectives' => $data['general_objectives'] ?? '',
        'program_justification' => $data['program_justification'] ?? '',
        'beneficiaries' => $data['beneficiaries'] ?? '',
        'program_plan_text' => $data['program_plan_text'] ?? '',
        'rows' => is_array($data['programPlanTable'] ?? null) ? $data['programPlanTable'] : []
    ];
}

function replaceProgramRows(mysqli $conn, int $reportId, array $rows) {
    $deleteStmt = $conn->prepare("DELETE FROM `3ydp_programs` WHERE report_id=?");
    $deleteStmt->bind_param("i", $reportId);
    $deleteStmt->execute();
    $deleteStmt->close();

    if (!$rows) {
        return 0;
    }

    $stmt = $conn->prepare("INSERT INTO `3ydp_programs`
        (report_id, program, objectives, strategies, persons_agencies_involved, resources_needed, budget, means_of_verification, time_frame)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $inserted = 0;

    foreach ($rows as $row) {
        $program = $row['program'] ?? '';
        $objectives = $row['objectives'] ?? '';
        $strategies = $row['strategies'] ?? '';
        $personsAgencies = $row['persons_agencies_involved'] ?? '';
        $resourcesNeeded = $row['resources_needed'] ?? '';
        $budget = $row['budget'] ?? '';
        $meansOfVerification = $row['means_of_verification'] ?? '';
        $timeFrame = $row['time_frame'] ?? '';

        if (
            trim($program) === '' &&
            trim($objectives) === '' &&
            trim($strategies) === '' &&
            trim($personsAgencies) === '' &&
            trim($resourcesNeeded) === '' &&
            trim($budget) === '' &&
            trim($meansOfVerification) === '' &&
            trim($timeFrame) === ''
        ) {
            continue;
        }

        $stmt->bind_param(
            "issssssss",
            $reportId,
            $program,
            $objectives,
            $strategies,
            $personsAgencies,
            $resourcesNeeded,
            $budget,
            $meansOfVerification,
            $timeFrame
        );

        if ($stmt->execute()) {
            $inserted++;
        }
    }

    $stmt->close();
    return $inserted;
}

function findDraftId(mysqli $conn, int $userId, string $type) {
    $stmt = $conn->prepare("SELECT id FROM `3ydp` WHERE user_id=? AND type=? AND status='draft' ORDER BY id DESC LIMIT 1");
    $stmt->bind_param("is", $userId, $type);
    $stmt->execute();
    $row = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    return $row ? (int) $row['id'] : null;
}

function saveReport(mysqli $conn, array $data, string $status, ?int $requestedDraftId = null) {
    $report = normalizeReportData($data);
    [$approvalData, $documentInfo] = getApprovalData();

    $createdByName = $_SESSION['name'];
    $department = $_SESSION['department'];
    $role = $_SESSION['role'];
    $userId = (int) $_SESSION['user_id'];
    $reportId = null;

    if ($requestedDraftId) {
        $checkStmt = $conn->prepare("SELECT id FROM `3ydp` WHERE id=? AND user_id=? AND status='draft' LIMIT 1");
        $checkStmt->bind_param("ii", $requestedDraftId, $userId);
        $checkStmt->execute();
        $draftRow = $checkStmt->get_result()->fetch_assoc();
        $checkStmt->close();
        $reportId = $draftRow ? (int) $draftRow['id'] : null;
    }

    if (!$reportId && $status === 'draft') {
        $reportId = findDraftId($conn, $userId, $report['type']);
    }

    $conn->begin_transaction();

    try {
        if ($reportId) {
            $stmt = $conn->prepare("UPDATE `3ydp`
                SET
                    type=?,
                    title_of_project=?,
                    description_of_project=?,
                    general_objectives=?,
                    program_justification=?,
                    beneficiaries=?,
                    program_plan_text=?,
                    created_by_name=?,
                    department=?,
                    role=?,
                    user_id=?,
                    dean=?,
                    ces_head=?,
                    ces_head_suffix=?,
                    vp_acad=?,
                    vp_acad_suffix=?,
                    vp_admin=?,
                    vp_admin_suffix=?,
                    school_president=?,
                    school_president_suffix=?,
                    issue_status=?,
                    revision_number=?,
                    date_effective=?,
                    approved_by=?,
                    status=?
                WHERE id=? AND user_id=?");
            $paramTypes = "ssssssssssissssssssssssssii";
            $stmt->bind_param(
                $paramTypes,
                $report['type'],
                $report['title'],
                $report['description'],
                $report['general_objectives'],
                $report['program_justification'],
                $report['beneficiaries'],
                $report['program_plan_text'],
                $createdByName,
                $department,
                $role,
                $userId,
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
                $documentInfo['approved_by'],
                $status,
                $reportId,
                $userId
            );
            $stmt->execute();
            $stmt->close();
        } else {
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
                    approved_by,
                    status
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $paramTypes = "ssssssssssissssssssssssss";
            $stmt->bind_param(
                $paramTypes,
                $report['type'],
                $report['title'],
                $report['description'],
                $report['general_objectives'],
                $report['program_justification'],
                $report['beneficiaries'],
                $report['program_plan_text'],
                $createdByName,
                $department,
                $role,
                $userId,
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
                $documentInfo['approved_by'],
                $status
            );
            $stmt->execute();
            $reportId = $conn->insert_id;
            $stmt->close();
        }

        $inserted = replaceProgramRows($conn, $reportId, $report['rows']);
        $conn->commit();

        return [$reportId, $inserted];
    } catch (Exception $e) {
        $conn->rollback();
        throw $e;
    }
}

function loadDraft(mysqli $conn) {
    $userId = (int) $_SESSION['user_id'];
    $stmt = $conn->prepare("SELECT * FROM `3ydp` WHERE user_id=? AND status='draft' ORDER BY id DESC LIMIT 1");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $draft = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if (!$draft) {
        return null;
    }

    $programStmt = $conn->prepare("SELECT program, objectives, strategies, persons_agencies_involved, resources_needed, budget, means_of_verification, time_frame FROM `3ydp_programs` WHERE report_id=? ORDER BY id ASC");
    $draftId = (int) $draft['id'];
    $programStmt->bind_param("i", $draftId);
    $programStmt->execute();
    $programResult = $programStmt->get_result();
    $programs = [];

    while ($row = $programResult->fetch_assoc()) {
        $programs[] = $row;
    }

    $programStmt->close();

    return [
        'id' => $draft['id'],
        'title_of_project' => $draft['title_of_project'],
        'description_of_project' => $draft['description_of_project'],
        'general_objectives' => $draft['general_objectives'],
        'program_justification' => $draft['program_justification'],
        'beneficiaries' => $draft['beneficiaries'],
        'program_plan_text' => $draft['program_plan_text'],
        'report_type' => $draft['type'],
        'programPlanTable' => $programs
    ];
}

try {
    requireLogin();

    $conn = new mysqli("localhost", "root", "", "ces_reports_db");
    if ($conn->connect_error) {
        throw new Exception($conn->connect_error);
    }

    ensureDraftStatus($conn);

    $input = file_get_contents("php://input");
    $data = json_decode($input, true);

    if (!is_array($data)) {
        throw new Exception("Invalid JSON input");
    }

    $action = $data['action'] ?? 'submit';

    if ($action === 'get_draft') {
        sendJson([
            "success" => true,
            "user_id" => (int) $_SESSION['user_id'],
            "draft" => loadDraft($conn)
        ]);
    }

    if ($action === 'save_draft') {
        [$reportId, $inserted] = saveReport($conn, $data, 'draft', isset($data['draft_id']) ? (int) $data['draft_id'] : null);
        sendJson([
            "success" => true,
            "message" => "Draft saved successfully.",
            "draft_id" => $reportId,
            "user_id" => (int) $_SESSION['user_id'],
            "program_rows" => $inserted
        ]);
    }

    if ($action === 'submit') {
        [$reportId, $inserted] = saveReport($conn, $data, 'pending', isset($data['draft_id']) ? (int) $data['draft_id'] : null);
        sendJson([
            "success" => true,
            "message" => "Report submitted with $inserted program row(s).",
            "report_id" => $reportId,
            "user_id" => (int) $_SESSION['user_id']
        ]);
    }

    sendJson(["success" => false, "message" => "Invalid action."], 400);
} catch (Exception $e) {
    sendJson(["success" => false, "message" => $e->getMessage()], 500);
}
?>
