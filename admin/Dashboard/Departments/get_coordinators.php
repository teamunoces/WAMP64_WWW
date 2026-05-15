<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);

header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "accounts";

$department = trim($_GET['department'] ?? '');
$allowedDepartments = ["ELEM", "SHS", "CBMA", "STHM", "CCIS", "CCJE", "CAS", "CTE", "CSF", "LRC"];
$departmentAliases = [
    "CBMA" => ["CBMA", "CBM"],
    "STHM" => ["STHM", "CTHM"],
    "CSF" => ["CSF", "CCF"]
];

if ($department === '' || !in_array($department, $allowedDepartments, true)) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid department selected.",
        "coordinators" => []
    ]);
    exit;
}

try {
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $departmentsToMatch = $departmentAliases[$department] ?? [$department];
    $placeholders = implode(',', array_fill(0, count($departmentsToMatch), '?'));

    $sql = "
        SELECT id, name
        FROM users
        WHERE LOWER(role) = 'coordinator'
            AND is_active = 1
            AND department IN ($placeholders)
        ORDER BY name ASC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($departmentsToMatch);
    $coordinators = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "coordinators" => $coordinators
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Failed to fetch coordinators.",
        "coordinators" => []
    ]);
}
?>
