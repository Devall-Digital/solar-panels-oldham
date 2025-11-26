<?php
/**
 * Solar Panel Calculator Quote Form Handler
 * Processes quote requests from the calculator form
 */

// Set content type to JSON
header('Content-Type: application/json');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Sanitize and validate input
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

function validatePhone($phone) {
    // Remove spaces, dashes, and parentheses
    $phone = preg_replace('/[\s\-\(\)]/', '', $phone);
    // Check if it's a valid UK phone number format
    return preg_match('/^(\+44|0)[1-9]\d{8,9}$/', $phone);
}

// Load email config
if (file_exists(__DIR__ . '/email-config.php')) {
    require_once __DIR__ . '/email-config.php';
}

// Get and validate form data
$name = isset($_POST['name']) ? sanitizeInput($_POST['name']) : '';
$email = isset($_POST['email']) ? sanitizeInput($_POST['email']) : '';
$phone = isset($_POST['phone']) ? sanitizeInput($_POST['phone']) : '';
$address = isset($_POST['address']) ? sanitizeInput($_POST['address']) : '';
$message = isset($_POST['message']) ? sanitizeInput($_POST['message']) : '';

// Calculator results
$systemSize = isset($_POST['system_size']) ? sanitizeInput($_POST['system_size']) : '';
$numPanels = isset($_POST['num_panels']) ? sanitizeInput($_POST['num_panels']) : '';
$installCost = isset($_POST['install_cost']) ? sanitizeInput($_POST['install_cost']) : '';
$annualSavings = isset($_POST['annual_savings']) ? sanitizeInput($_POST['annual_savings']) : '';
$roi = isset($_POST['roi']) ? sanitizeInput($_POST['roi']) : '';
$paybackPeriod = isset($_POST['payback_period']) ? sanitizeInput($_POST['payback_period']) : '';
$location = isset($_POST['location']) ? sanitizeInput($_POST['location']) : '';

// Validation
$errors = [];

if (empty($name)) {
    $errors[] = 'Name is required';
}

if (empty($email)) {
    $errors[] = 'Email is required';
} elseif (!validateEmail($email)) {
    $errors[] = 'Invalid email address';
}

if (empty($phone)) {
    $errors[] = 'Phone number is required';
} elseif (!validatePhone($phone)) {
    $errors[] = 'Invalid phone number format';
}

if (empty($address)) {
    $errors[] = 'Address is required';
}

// If there are validation errors, return them
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
    exit;
}

// Prepare data for storage/email
$quoteData = [
    'timestamp' => date('Y-m-d H:i:s'),
    'name' => $name,
    'email' => $email,
    'phone' => $phone,
    'address' => $address,
    'message' => $message,
    'calculator_results' => [
        'location' => $location,
        'system_size' => $systemSize . ' kW',
        'num_panels' => $numPanels,
        'install_cost' => '£' . number_format($installCost),
        'annual_savings' => '£' . number_format($annualSavings),
        'roi' => $roi . '%',
        'payback_period' => $paybackPeriod . ' years'
    ]
];

// Save to file (quotes directory)
$quotesDir = __DIR__ . '/quotes';
if (!is_dir($quotesDir)) {
    mkdir($quotesDir, 0755, true);
}

$filename = $quotesDir . '/quote_' . date('Y-m-d_His') . '_' . uniqid() . '.json';
$fileSaved = file_put_contents($filename, json_encode($quoteData, JSON_PRETTY_PRINT));

if ($fileSaved === false) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to save quote request']);
    exit;
}

// Send email notification
if (file_exists(__DIR__ . '/email-config.php')) {
    require_once __DIR__ . '/email-config.php';
    
    if (isset($QUOTE_EMAIL) && !empty($QUOTE_EMAIL) && $QUOTE_EMAIL !== 'your-email@example.com') {
        $to = $QUOTE_EMAIL;
        $subject = 'New Solar Panel Quote Request - ' . $name;
        
        $emailMessage = "New quote request received:\n\n";
        $emailMessage .= "CONTACT DETAILS:\n";
        $emailMessage .= "Name: $name\n";
        $emailMessage .= "Email: $email\n";
        $emailMessage .= "Phone: $phone\n";
        $emailMessage .= "Address: $address\n";
        $emailMessage .= "Location: $location\n\n";
        
        $emailMessage .= "CALCULATOR RESULTS:\n";
        $emailMessage .= "System Size: $systemSize kW\n";
        $emailMessage .= "Number of Panels: $numPanels\n";
        $emailMessage .= "Installation Cost: £" . number_format($installCost) . "\n";
        $emailMessage .= "Annual Savings: £" . number_format($annualSavings) . "\n";
        $emailMessage .= "ROI: $roi%\n";
        $emailMessage .= "Payback Period: $paybackPeriod years\n";
        
        if (!empty($message)) {
            $emailMessage .= "\nADDITIONAL MESSAGE:\n$message\n";
        }
        
        $emailMessage .= "\n---\n";
        $emailMessage .= "This quote was submitted via the Solar Panels Oldham calculator.\n";
        $emailMessage .= "Timestamp: " . date('Y-m-d H:i:s') . "\n";
        
        $fromEmail = isset($EMAIL_FROM) ? $EMAIL_FROM : 'noreply@solar-panels-oldham.co.uk';
        $fromName = isset($EMAIL_FROM_NAME) ? $EMAIL_FROM_NAME : 'Solar Panels Oldham';
        
        $headers = "From: $fromName <$fromEmail>\r\n";
        $headers .= "Reply-To: $email\r\n";
        $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
        
        $mailSent = mail($to, $subject, $emailMessage, $headers);
        
        // Log email attempt (optional)
        if (!$mailSent) {
            error_log("Failed to send quote email to: $to");
        }
    }
}

// Return success response
echo json_encode([
    'success' => true,
    'message' => 'Quote request submitted successfully'
]);

