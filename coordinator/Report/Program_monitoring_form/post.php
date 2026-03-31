<?php
/**
 * save_pmf_report.php
 * Receives JSON data from Program Monitoring Form and saves to database
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
// HELPER FUNCTIONS
// ========================

function getIssueStatus($naChecked, $yesChecked) {
    if ($naChecked) return 'N/A';
    if ($yesChecked) return 'YES';
    return 'Not marked';
}

function getFollowUpValue($followUpInput) {
    $val = strtoupper(trim($followUpInput));
    if ($val === 'Y' || $val === 'YES') return 'Y';
    if ($val === 'N' || $val === 'NO') return 'N';
    return null;
}

function getRecApplicability($yesChecked, $naChecked) {
    if ($yesChecked) return 'Yes';
    if ($naChecked) return 'N/A';
    return 'Not specified';
}

function formatDate($dateStr) {
    if (empty($dateStr)) {
        return null;
    }
    $timestamp = strtotime($dateStr);
    if ($timestamp !== false) {
        return date('Y-m-d', $timestamp);
    }
    return null;
}

// ========================
// EXTRACT DATA FROM JSON
// ========================

$type = $data['reportType'] ?? 'Program Monitoring Form';
$department = $_SESSION['department'] ?? $_SESSION['user_department'] ?? '';

$programTitle = trim($data['header']['programTitle'] ?? '');
$activityConducted = trim($data['header']['activityConducted'] ?? '');
$location = trim($data['header']['location'] ?? '');
$beneficiaries = trim($data['header']['beneficiaries'] ?? '');
$monitoringDate = formatDate($data['header']['dateOfMonitoring'] ?? '');
$monitoredBy = trim($data['header']['monitoredBy'] ?? '');

$issuesData = $data['issuesAndChallenges'] ?? [];

// Initialize issue variables
$issue1Status = 'Not marked';
$issue1FollowUp = null;
$issue2Status = 'Not marked';
$issue2FollowUp = null;
$issue3Status = 'Not marked';
$issue3FollowUp = null;
$issue4Status = 'Not marked';
$issue4FollowUp = null;
$issue5Status = 'Not marked';
$issue5FollowUp = null;
$issue6Status = 'Not marked';
$issue6FollowUp = null;
$issue7Status = 'Not marked';
$issue7FollowUp = null;
$issue8Status = 'Not marked';
$issue8FollowUp = null;
$issue9OtherSpecify = '';

foreach ($issuesData as $issue) {
    $indicator = $issue['indicator'] ?? '';
    $status = $issue['status'] ?? 'Not marked';
    $followUp = $issue['followUpRequired'] ?? '';
    
    $naChecked = ($status === 'N/A');
    $yesChecked = ($status === 'YES');
    $followUpValue = getFollowUpValue($followUp);
    
    if (strpos($indicator, 'Low Participation') !== false) {
        $issue1Status = getIssueStatus($naChecked, $yesChecked);
        $issue1FollowUp = $followUpValue;
    } elseif (strpos($indicator, 'Resource Constraints') !== false) {
        $issue2Status = getIssueStatus($naChecked, $yesChecked);
        $issue2FollowUp = $followUpValue;
    } elseif (strpos($indicator, 'Lack of Proper Coordination') !== false) {
        $issue3Status = getIssueStatus($naChecked, $yesChecked);
        $issue3FollowUp = $followUpValue;
    } elseif (strpos($indicator, 'Cultural and Social Barriers') !== false) {
        $issue4Status = getIssueStatus($naChecked, $yesChecked);
        $issue4FollowUp = $followUpValue;
    } elseif (strpos($indicator, 'Sustainability Challenges') !== false) {
        $issue5Status = getIssueStatus($naChecked, $yesChecked);
        $issue5FollowUp = $followUpValue;
    } elseif (strpos($indicator, 'Inadequate Monitoring') !== false) {
        $issue6Status = getIssueStatus($naChecked, $yesChecked);
        $issue6FollowUp = $followUpValue;
    } elseif (strpos($indicator, 'Limited Training') !== false) {
        $issue7Status = getIssueStatus($naChecked, $yesChecked);
        $issue7FollowUp = $followUpValue;
    } elseif (strpos($indicator, 'Mismanagement') !== false) {
        $issue8Status = getIssueStatus($naChecked, $yesChecked);
        $issue8FollowUp = $followUpValue;
    } elseif (strpos($indicator, 'Others') !== false) {
        $issue9OtherSpecify = $issue['details'] ?? '';
    }
}

// Feedback data
$feedbackData = $data['participantFeedback'] ?? [];

$positiveChecked = 0;
$positiveSummary = '';
$positiveAction = '';
$negativeChecked = 0;
$negativeSummary = '';
$negativeAction = '';
$suggestionsChecked = 0;
$suggestionsSummary = '';
$suggestionsAction = '';

foreach ($feedbackData as $feedback) {
    $fbType = $feedback['feedbackType'] ?? '';
    $isChecked = $feedback['isChecked'] ?? false;
    $summary = $feedback['summary'] ?? '';
    $action = $feedback['actionsToImprove'] ?? '';
    
    if (strpos($fbType, 'Positive') !== false) {
        $positiveChecked = $isChecked ? 1 : 0;
        $positiveSummary = $summary;
        $positiveAction = $action;
    } elseif (strpos($fbType, 'Negative') !== false) {
        $negativeChecked = $isChecked ? 1 : 0;
        $negativeSummary = $summary;
        $negativeAction = $action;
    } elseif (strpos($fbType, 'Suggestions') !== false) {
        $suggestionsChecked = $isChecked ? 1 : 0;
        $suggestionsSummary = $summary;
        $suggestionsAction = $action;
    }
}



// Recommendations data
$recommendationsData = $data['actionsForNextActivity']['standardRecommendations'] ?? [];
$otherRecommendations = $data['actionsForNextActivity']['otherRecommendations'] ?? '';

$rec1Applicability = 'Not specified';
$rec2Applicability = 'Not specified';
$rec3Applicability = 'Not specified';
$rec4Applicability = 'Not specified';
$rec5Applicability = 'Not specified';
$rec6Applicability = 'Not specified';
$rec7Applicability = 'Not specified';

foreach ($recommendationsData as $rec) {
    $recommendation = $rec['recommendation'] ?? '';
    $applicability = $rec['applicability'] ?? 'Not specified';
    $yesChecked = ($applicability === 'Yes');
    $naChecked = ($applicability === 'N/A');
    
    if (strpos($recommendation, 'Raise awareness') !== false) {
        $rec1Applicability = getRecApplicability($yesChecked, $naChecked);
    } elseif (strpos($recommendation, 'Diversify funding') !== false) {
        $rec2Applicability = getRecApplicability($yesChecked, $naChecked);
    } elseif (strpos($recommendation, 'Define roles') !== false) {
        $rec3Applicability = getRecApplicability($yesChecked, $naChecked);
    } elseif (strpos($recommendation, 'Involve the community') !== false) {
        $rec4Applicability = getRecApplicability($yesChecked, $naChecked);
    } elseif (strpos($recommendation, 'Secure ongoing funding') !== false) {
        $rec5Applicability = getRecApplicability($yesChecked, $naChecked);
    } elseif (strpos($recommendation, 'Set clear goals') !== false) {
        $rec6Applicability = getRecApplicability($yesChecked, $naChecked);
    } elseif (strpos($recommendation, 'Offer continuous training') !== false) {
        $rec7Applicability = getRecApplicability($yesChecked, $naChecked);
    }
}

// User information from session
$createdByName =$_SESSION['name'] ?? 'Unknown User';
$userRole = $_SESSION['role'] ?? $_SESSION['user_role'] ?? '';
$userId = $_SESSION['user_id'] ?? $_SESSION['id'] ?? '';
$dean = $_SESSION['dean'] ?? $_SESSION['department_head'] ?? '';

$status = 'pending';
$archived = 'not archived';

// Validate required fields
if (empty($programTitle)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Program Title is required'
    ]);
    $conn->close();
    exit();
}

// ========================
// BUILD AND EXECUTE SQL
// ========================

$sql = "INSERT INTO program_monitoring_form (
    type, department, program_title, activity_conducted, location, 
    beneficiaries, monitoring_date, monitored_by,
    issue1_low_participation_status, issue1_follow_up,
    issue2_resource_constraints_status, issue2_follow_up,
    issue3_lack_coordination_status, issue3_follow_up,
    issue4_cultural_barriers_status, issue4_follow_up,
    issue5_sustainability_status, issue5_follow_up,
    issue6_inadequate_monitoring_status, issue6_follow_up,
    issue7_limited_training_status, issue7_follow_up,
    issue8_mismanagement_status, issue8_follow_up,
    issue9_other_specify,
    positive_feedback_checked, positive_feedback_summary, positive_feedback_action,
    negative_feedback_checked, negative_feedback_summary, negative_feedback_action,
    suggestions_feedback_checked, suggestions_feedback_summary, suggestions_feedback_action,
    rec1_applicability, rec2_applicability, rec3_applicability,
    rec4_applicability, rec5_applicability, rec6_applicability, rec7_applicability,
    other_recommendations,
    created_by_name, feedback, status, archived, role, user_id, dean
) VALUES (
    ?, ?, ?, ?, ?,
    ?, ?, ?,
    ?, ?,
    ?, ?,
    ?, ?,
    ?, ?,
    ?, ?,
    ?, ?,
    ?, ?,
    ?, ?,
    ?,
    ?, ?, ?,
    ?, ?, ?,
    ?, ?, ?,
    ?, ?, ?,
    ?, ?, ?, ?,
    ?,
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

// Count carefully: there must be exactly 49 's' for 49 '?'
$stmt->bind_param(
    "sssssssssssssssssssssssssssssssssssssssssssssssss", // Ensure 49 's' here
    $type, 
    $department, 
    $programTitle, 
    $activityConducted, 
    $location,
    $beneficiaries, 
    $monitoringDate, 
    $monitoredBy,
    $issue1Status, $issue1FollowUp,
    $issue2Status, $issue2FollowUp,
    $issue3Status, $issue3FollowUp,
    $issue4Status, $issue4FollowUp,
    $issue5Status, $issue5FollowUp,
    $issue6Status, $issue6FollowUp,
    $issue7Status, $issue7FollowUp,
    $issue8Status, $issue8FollowUp,
    $issue9OtherSpecify,
    $positiveChecked, $positiveSummary, $positiveAction,
    $negativeChecked, $negativeSummary, $negativeAction,
    $suggestionsChecked, $suggestionsSummary, $suggestionsAction,
    $rec1Applicability, $rec2Applicability, $rec3Applicability,
    $rec4Applicability, $rec5Applicability, $rec6Applicability, $rec7Applicability,
    $otherRecommendations,
    $createdByName, 
    $feedbackText, 
    $status, 
    $archived, 
    $userRole, 
    $userId, 
    $dean
);

if ($stmt->execute()) {
    $insertedId = $conn->insert_id;
    error_log("Report submitted successfully - ID: $insertedId, Program: $programTitle, By: $createdByName");
    
    echo json_encode([
        'success' => true,
        'message' => 'Program Monitoring Form submitted successfully',
        'report_id' => $insertedId,
        'submission_date' => date('Y-m-d H:i:s'),
        'program_title' => $programTitle,
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