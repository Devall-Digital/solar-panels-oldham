<?php
/**
 * GitHub Webhook Auto-Deploy Script
 * This script automatically pulls updates from GitHub when triggered by a webhook
 * Created for solar-panels-oldham.co.uk automatic deployment
 */

// Configuration
// The webhook-config.php file should be created on your server with:
// <?php $SECRET_TOKEN = 'your-github-webhook-secret-here';
if (file_exists('webhook-config.php')) {
    require_once 'webhook-config.php';
} else {
    // Fallback - you should create webhook-config.php on your server
    die('Error: webhook-config.php not found. Please create it on your server.');
}
$REPO_PATH = '/home/sites/34b/b/b9ed38cdb2/public_html';
$BRANCH = 'main';
$LOG_FILE = 'deploy.log';

// Function to log messages
function logMessage($message) {
    global $LOG_FILE;
    $timestamp = date('Y-m-d H:i:s');
    $logEntry = "[$timestamp] $message\n";
    file_put_contents($LOG_FILE, $logEntry, FILE_APPEND | LOCK_EX);
}

// Function to execute shell commands safely
function executeCommand($command) {
    $output = [];
    $returnVar = 0;
    exec($command . ' 2>&1', $output, $returnVar);
    return [
        'output' => implode("\n", $output),
        'success' => $returnVar === 0
    ];
}

// Start logging
logMessage("=== Deployment Request Received ===");
logMessage("Request Method: " . $_SERVER['REQUEST_METHOD']);

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    logMessage("ERROR: Only POST requests are allowed");
    http_response_code(405);
    die('Method Not Allowed');
}

// Get the request body and headers
$payload = file_get_contents('php://input');

// Get headers (compatible with different server configurations)
$headers = [];
if (function_exists('getallheaders')) {
    $headers = getallheaders();
} else {
    // Alternative method for servers without getallheaders()
    foreach ($_SERVER as $key => $value) {
        if (strpos($key, 'HTTP_') === 0) {
            $header = str_replace('_', '-', substr($key, 5));
            $headers[$header] = $value;
        }
    }
}

// Verify GitHub signature (case-insensitive header check)
$githubSignature = null;
foreach ($headers as $name => $value) {
    if (strtolower($name) === 'x-hub-signature-256') {
        $githubSignature = $value;
        break;
    }
}

if (!$githubSignature) {
    logMessage("ERROR: No GitHub signature found");
    http_response_code(401);
    die('Unauthorized: Missing signature');
}

$expectedSignature = 'sha256=' . hash_hmac('sha256', $payload, $SECRET_TOKEN);

if (!hash_equals($expectedSignature, $githubSignature)) {
    logMessage("ERROR: Invalid GitHub signature");
    http_response_code(401);
    die('Unauthorized: Invalid signature');
}

// Parse the payload
$data = json_decode($payload, true);

if (!$data) {
    logMessage("ERROR: Invalid JSON payload");
    http_response_code(400);
    die('Bad Request: Invalid JSON');
}

// Check if this is a push to the main branch
if (!isset($data['ref']) || $data['ref'] !== "refs/heads/$BRANCH") {
    logMessage("INFO: Push to non-main branch, skipping deployment");
    echo "Push to non-main branch, deployment skipped";
    exit;
}

logMessage("SUCCESS: Valid push to $BRANCH branch detected");
logMessage("Repository: " . ($data['repository']['full_name'] ?? 'Unknown'));
logMessage("Pusher: " . ($data['pusher']['name'] ?? 'Unknown'));
logMessage("Commits: " . count($data['commits'] ?? []));

// Change to repository directory
if (!is_dir($REPO_PATH)) {
    logMessage("ERROR: Repository path does not exist: $REPO_PATH");
    http_response_code(500);
    die('Internal Server Error: Repository path not found');
}

// Execute git deployment with conflict resolution
logMessage("Starting deployment process...");

// First, let's check git status
$statusResult = executeCommand("cd $REPO_PATH && git status --porcelain");
if (!empty($statusResult['output'])) {
    logMessage("INFO: Working directory has changes: " . $statusResult['output']);
}

// Fetch latest changes first
logMessage("Fetching latest changes...");
$fetchResult = executeCommand("cd $REPO_PATH && git fetch origin $BRANCH");
if (!$fetchResult['success']) {
    logMessage("ERROR: Git fetch failed: " . $fetchResult['output']);
    http_response_code(500);
    die('Deployment failed: Could not fetch changes');
}

// Stash any local changes to avoid conflicts
logMessage("Stashing local changes...");
$stashResult = executeCommand("cd $REPO_PATH && git stash push -m 'Auto-stash before webhook deployment'");
logMessage("Git stash result: " . ($stashResult['success'] ? 'SUCCESS' : 'INFO'));
logMessage("Git stash output: " . $stashResult['output']);

// Reset to clean state and pull
logMessage("Performing hard reset and pull...");
$resetResult = executeCommand("cd $REPO_PATH && git reset --hard origin/$BRANCH");
if (!$resetResult['success']) {
    logMessage("ERROR: Git reset failed: " . $resetResult['output']);
    http_response_code(500);
    die('Deployment failed: Could not reset repository');
}

logMessage("Git reset successful: " . $resetResult['output']);

// Verify the deployment by checking the latest commit
$commitResult = executeCommand("cd $REPO_PATH && git log -1 --pretty=format:'%h - %s (%an, %ar)'");
if ($commitResult['success']) {
    logMessage("Latest commit: " . $commitResult['output']);
}

// Backup critical config files before cleaning
logMessage("Backing up config files...");
$configFiles = ['webhook-config.php', 'email-config.php'];
$backupDir = $REPO_PATH . '/.config-backup';
if (!is_dir($backupDir)) {
    mkdir($backupDir, 0700, true);
}

foreach ($configFiles as $configFile) {
    $filePath = $REPO_PATH . '/' . $configFile;
    if (file_exists($filePath)) {
        $backupPath = $backupDir . '/' . $configFile;
        copy($filePath, $backupPath);
        logMessage("Backed up: $configFile");
    }
}

// Clean up any untracked files that might cause issues (excluding config files)
logMessage("Cleaning untracked files (preserving config files)...");
// Temporarily move config files to backup, clean, then restore
$tempBackupDir = $REPO_PATH . '/.temp-config-backup';
if (!is_dir($tempBackupDir)) {
    mkdir($tempBackupDir, 0700, true);
}

// Move config files to temp backup
foreach ($configFiles as $configFile) {
    $filePath = $REPO_PATH . '/' . $configFile;
    if (file_exists($filePath)) {
        $tempPath = $tempBackupDir . '/' . $configFile;
        rename($filePath, $tempPath);
        logMessage("Temporarily moved: $configFile");
    }
}

// Now clean untracked files
$cleanResult = executeCommand("cd $REPO_PATH && git clean -fd");
logMessage("Git clean result: " . $cleanResult['output']);

// Restore config files from temp backup
foreach ($configFiles as $configFile) {
    $filePath = $REPO_PATH . '/' . $configFile;
    $tempPath = $tempBackupDir . '/' . $configFile;
    
    if (file_exists($tempPath)) {
        rename($tempPath, $filePath);
        logMessage("Restored: $configFile");
    }
}

// Clean up temp backup directory
if (is_dir($tempBackupDir)) {
    rmdir($tempBackupDir);
}

// Restore config files if they were removed
logMessage("Restoring config files...");
foreach ($configFiles as $configFile) {
    $filePath = $REPO_PATH . '/' . $configFile;
    $backupPath = $backupDir . '/' . $configFile;
    
    if (!file_exists($filePath) && file_exists($backupPath)) {
        copy($backupPath, $filePath);
        logMessage("Restored: $configFile");
    } elseif (file_exists($filePath)) {
        logMessage("Config file already exists: $configFile");
    }
}

logMessage("=== Deployment Completed Successfully ===");
echo "Deployment successful! Latest commit: " . ($commitResult['output'] ?? 'Unknown');

logMessage("=== Deployment Process Complete ===");
?> 