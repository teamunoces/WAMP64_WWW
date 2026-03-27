<?php
session_start();

require_once 'C:/wamp64/www/SYSTEM_VERSION_!/includes/config.php';

if (isset($_SESSION['user_id'])) {
    // Use the exact same command that works in PowerShell
    $pythonPath = 'c:/python313/python.exe';
    $scriptPath = 'c:/wamp64/www/SYSTEM_VERSION_!/coordinator/Report/3ydpreport/AI_RECOMMENDATION/AI.py';
    
    // Method 1: Use the command exactly as it works in PowerShell
    $command = '"c:/python313/python.exe" "c:/wamp64/www/SYSTEM_VERSION_!/coordinator/Report/3ydpreport/AI_RECOMMENDATION/AI.py" 2>&1';
    $output = shell_exec($command);
    
    // Method 2 (Alternative): Use escapeshellcmd instead of escapeshellarg
    // $command = escapeshellcmd('c:/python313/python.exe') . ' ' . escapeshellcmd($scriptPath) . ' 2>&1';
    // $output = shell_exec($command);
    
    // Debug - check if it worked
    if ($output === null) {
        error_log("Python script execution failed - no output");
    } elseif (trim($output) === '') {
        error_log("Python script executed but produced no output");
    } else {
        error_log("Python script output: " . $output);
    }
    
    // Your redirect logic
    switch ($_SESSION['role']) {
        case 'admin':
            header("Location: " . BASE_URL . "/admin/Dashboard/Dashboard.html");
            break;
        case 'coordinator':
            header("Location: " . BASE_URL . "/coordinator/Dashboard/dashboard.html");
            break;
        case 'encoder':
            header("Location: " . BASE_URL . "/encoder/encoder.html");
            break;
        default:
            session_destroy();
            header("Location: " . BASE_URL . "/login/login.html");
            break;
    }
    exit();
} else {
    header("Location: " . BASE_URL . "/login/login.html");
    exit();
}
?>