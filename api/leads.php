<?php
/**
 * API Endpoint: Lead Capture
 * Purpose: Process and store lead form submissions
 * Author: Initial Setup Agent
 * Date: November 2024
 */

// Set headers
header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die(json_encode(['error' => 'Method not allowed']));
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    die(json_encode(['error' => 'Invalid JSON input']));
}

// Validate required fields
$required = ['formId', 'timestamp'];
$missing = [];

foreach ($required as $field) {
    if (empty($input[$field])) {
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

// Sanitize input data
$lead = [
    'id' => uniqid('lead_'),
    'timestamp' => date('Y-m-d H:i:s'),
    'form_id' => filter_var($input['formId'], FILTER_SANITIZE_STRING),
    'ip_address' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown',
    
    // Contact information
    'name' => filter_var($input['name'] ?? '', FILTER_SANITIZE_STRING),
    'email' => filter_var($input['email'] ?? '', FILTER_SANITIZE_EMAIL),
    'phone' => filter_var($input['phone'] ?? '', FILTER_SANITIZE_STRING),
    'postcode' => filter_var($input['postcode'] ?? '', FILTER_SANITIZE_STRING),
    
    // Property information
    'property_type' => filter_var($input['property_type'] ?? '', FILTER_SANITIZE_STRING),
    'roof_orientation' => filter_var($input['roof_orientation'] ?? '', FILTER_SANITIZE_STRING),
    'monthly_bill' => filter_var($input['monthly_bill'] ?? 0, FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION),
    
    // Additional data
    'message' => filter_var($input['message'] ?? '', FILTER_SANITIZE_STRING),
    'calculator_results' => $input['calculator_results'] ?? null,
    'source' => filter_var($input['source'] ?? 'website', FILTER_SANITIZE_STRING),
    'utm_source' => filter_var($input['utm_source'] ?? '', FILTER_SANITIZE_STRING),
    'utm_medium' => filter_var($input['utm_medium'] ?? '', FILTER_SANITIZE_STRING),
    'utm_campaign' => filter_var($input['utm_campaign'] ?? '', FILTER_SANITIZE_STRING)
];

// Additional validation
if (!empty($lead['email']) && !filter_var($lead['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    die(json_encode(['error' => 'Invalid email address']));
}

// Store lead (file-based for now)
$storage_dir = '../storage/leads';
if (!is_dir($storage_dir)) {
    mkdir($storage_dir, 0755, true);
}

// Create daily file
$filename = $storage_dir . '/' . date('Y-m-d') . '.json';
$leads = [];

// Load existing leads
if (file_exists($filename)) {
    $existing = file_get_contents($filename);
    $leads = json_decode($existing, true) ?? [];
}

// Add new lead
$leads[] = $lead;

// Save leads
if (file_put_contents($filename, json_encode($leads, JSON_PRETTY_PRINT), LOCK_EX) === false) {
    http_response_code(500);
    die(json_encode(['error' => 'Failed to save lead']));
}

// Send email notification (if configured)
$admin_email = 'leads@solar-panels-oldham.co.uk'; // Change this
$email_subject = 'New Solar Panel Lead - ' . $lead['name'];
$email_body = "New lead received:\n\n";
$email_body .= "Name: {$lead['name']}\n";
$email_body .= "Email: {$lead['email']}\n";
$email_body .= "Phone: {$lead['phone']}\n";
$email_body .= "Postcode: {$lead['postcode']}\n";
$email_body .= "Property Type: {$lead['property_type']}\n";
$email_body .= "Monthly Bill: £{$lead['monthly_bill']}\n";
$email_body .= "\nMessage:\n{$lead['message']}\n";

// Uncomment to enable email notifications
// mail($admin_email, $email_subject, $email_body, "From: noreply@solar-panels-oldham.co.uk");

// Return success response
echo json_encode([
    'success' => true,
    'message' => 'Thank you for your interest! We\'ll contact you within 24 hours.',
    'lead_id' => $lead['id']
]);
?>
