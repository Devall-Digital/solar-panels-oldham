<?php
/**
 * API Endpoint: Solar Calculator
 * Purpose: Process calculator requests and provide solar savings calculations
 * Dependencies: None
 * Author: Development Agent
 * Date: November 2024
 */

// Set headers
header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only accept POST and GET requests
if (!in_array($_SERVER['REQUEST_METHOD'], ['POST', 'GET'])) {
    http_response_code(405);
    die(json_encode(['error' => 'Method not allowed']));
}

// Get input data
$input = [];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input && json_last_error() !== JSON_ERROR_NONE) {
        // Fallback to POST data
        $input = $_POST;
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $input = $_GET;
}

// Validate required fields for calculations
$required = ['monthlyBill', 'propertyType', 'roofOrientation'];
$missing = [];

foreach ($required as $field) {
    if (!isset($input[$field])) {
        $missing[] = $field;
    }
}

if (!empty($missing)) {
    http_response_code(400);
    die(json_encode([
        'error' => 'Missing required fields',
        'fields' => $missing
    ]));
}

// Sanitize input
$monthlyBill = filter_var($input['monthlyBill'], FILTER_VALIDATE_FLOAT);
$propertyType = filter_var($input['propertyType'], FILTER_SANITIZE_STRING);
$roofOrientation = filter_var($input['roofOrientation'], FILTER_SANITIZE_STRING);
$shading = filter_var($input['shading'] ?? 'none', FILTER_SANITIZE_STRING);

// Validate input ranges
if ($monthlyBill === false || $monthlyBill < 0 || $monthlyBill > 1000) {
    http_response_code(400);
    die(json_encode(['error' => 'Invalid monthly bill amount']));
}

$validPropertyTypes = ['terraced', 'semi', 'detached', 'bungalow'];
if (!in_array($propertyType, $validPropertyTypes)) {
    http_response_code(400);
    die(json_encode(['error' => 'Invalid property type']));
}

$validOrientations = ['south', 'east-west', 'north'];
if (!in_array($roofOrientation, $validOrientations)) {
    http_response_code(400);
    die(json_encode(['error' => 'Invalid roof orientation']));
}

// Configuration (matches client-side calculations)
$config = [
    'systemSizes' => [
        'terraced' => 3.0,
        'semi' => 4.0,
        'detached' => 5.5,
        'bungalow' => 4.5
    ],
    'efficiencyFactors' => [
        'south' => 1.0,
        'east-west' => 0.85,
        'north' => 0.6
    ],
    'electricityPrice' => 0.34, // £ per kWh (2024 UK)
    'exportRate' => 0.15, // SEG export rate
    'selfConsumption' => 0.6, // 60% self-consumption
    'ukAverageGeneration' => 900 // kWh per kWp per year
];

// Perform calculations
$annualBill = $monthlyBill * 12;
$systemSize = $config['systemSizes'][$propertyType] ?? 4.0;
$efficiency = $config['efficiencyFactors'][$roofOrientation] ?? 1.0;

$annualGeneration = $systemSize * $config['ukAverageGeneration'] * $efficiency;

$selfConsumption = $annualGeneration * $config['selfConsumption'];
$exportAmount = $annualGeneration * (1 - $config['selfConsumption']);

$savingsFromSelfUse = $selfConsumption * $config['electricityPrice'];
$earningsFromExport = $exportAmount * $config['exportRate'];
$annualSavings = min($savingsFromSelfUse + $earningsFromExport, $annualBill * 0.85);

// System cost and ROI calculations
$costPerKW = 1450; // £ per kWp installed (2024 UK average)
$systemCost = $systemSize * $costPerKW;
$paybackPeriod = $systemCost / $annualSavings;
$lifetime25Savings = ($annualSavings * 25) - $systemCost;
$roi25Year = ($lifetime25Savings / $systemCost) * 100;

// Prepare response
$result = [
    'success' => true,
    'input' => [
        'monthlyBill' => $monthlyBill,
        'propertyType' => $propertyType,
        'roofOrientation' => $roofOrientation,
        'shading' => $shading
    ],
    'calculations' => [
        'annualBill' => round($annualBill, 2),
        'systemSize' => round($systemSize, 1),
        'efficiency' => $efficiency,
        'annualGeneration' => round($annualGeneration),
        'annualSavings' => round($annualSavings),
        'systemCost' => round($systemCost),
        'paybackPeriod' => round($paybackPeriod, 1),
        'roi25Year' => round($roi25Year),
        'lifetime25Savings' => round($lifetime25Savings)
    ],
    'breakdown' => [
        'selfConsumption' => round($selfConsumption),
        'exportAmount' => round($exportAmount),
        'savingsFromSelfUse' => round($savingsFromSelfUse, 2),
        'earningsFromExport' => round($earningsFromExport, 2)
    ],
    'config' => $config,
    'timestamp' => date('c'),
    'version' => '1.0'
];

// Log calculator usage (optional)
$logFile = '../storage/analytics/calculator_usage.json';
$logEntry = [
    'timestamp' => date('c'),
    'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown',
    'input' => $result['input'],
    'results' => $result['calculations']
];

// Append to log file
if (is_dir(dirname($logFile))) {
    $existingLogs = [];
    if (file_exists($logFile)) {
        $existingLogs = json_decode(file_get_contents($logFile), true) ?? [];
    }
    $existingLogs[] = $logEntry;

    // Keep only last 1000 entries
    if (count($existingLogs) > 1000) {
        $existingLogs = array_slice($existingLogs, -1000);
    }

    file_put_contents($logFile, json_encode($existingLogs, JSON_PRETTY_PRINT));
}

// Return successful response
echo json_encode($result);

?>
