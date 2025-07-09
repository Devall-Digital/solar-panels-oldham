<?php
/**
 * Solar Panels Oldham - Contact Form Processor
 * Handles contact form submissions with validation and email sending
 */

// Prevent direct access
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die('Method Not Allowed');
}

// Start session for CSRF protection
session_start();

// Configuration
$config = [
    'admin_email' => 'info@solarpanelsoldham.co.uk',
    'admin_name' => 'Solar Panels Oldham',
    'subject_prefix' => '[Solar Panels Oldham] ',
    'max_message_length' => 2000,
    'spam_protection' => true,
    'honeypot_field' => 'website', // Hidden field to catch bots
    'rate_limit_minutes' => 5,
    'rate_limit_attempts' => 3
];

// Response function
function sendResponse($success, $message, $data = []) {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data
    ]);
    exit;
}

// Sanitize input
function sanitizeInput($input) {
    return htmlspecialchars(strip_tags(trim($input)), ENT_QUOTES, 'UTF-8');
}

// Validate email
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Validate phone number (UK format)
function validatePhone($phone) {
    // Remove all non-digit characters
    $clean = preg_replace('/[^0-9]/', '', $phone);
    return strlen($clean) >= 10 && strlen($clean) <= 15;
}

// Rate limiting
function checkRateLimit($ip) {
    global $config;
    
    $rate_file = sys_get_temp_dir() . '/contact_form_' . md5($ip) . '.txt';
    $current_time = time();
    
    if (file_exists($rate_file)) {
        $attempts = file_get_contents($rate_file);
        $attempts = json_decode($attempts, true);
        
        // Remove old attempts
        $attempts = array_filter($attempts, function($timestamp) use ($current_time) {
            return ($current_time - $timestamp) < ($config['rate_limit_minutes'] * 60);
        });
        
        if (count($attempts) >= $config['rate_limit_attempts']) {
            return false;
        }
    } else {
        $attempts = [];
    }
    
    // Add current attempt
    $attempts[] = $current_time;
    file_put_contents($rate_file, json_encode($attempts));
    
    return true;
}

// Spam protection
function checkSpam($data) {
    global $config;
    
    // Check honeypot field
    if (!empty($data[$config['honeypot_field']])) {
        return 'Spam detected: honeypot field filled';
    }
    
    // Check for suspicious content
    $suspicious_patterns = [
        '/\b(viagra|casino|loan|debt|weight loss)\b/i',
        '/\b(click here|buy now|limited time)\b/i',
        '/\b(http|www\.)\b/i',
        '/\b[A-Z]{5,}\b/', // All caps words
        '/\b\w{20,}\b/' // Very long words
    ];
    
    $content = $data['message'] . ' ' . $data['name'] . ' ' . $data['email'];
    
    foreach ($suspicious_patterns as $pattern) {
        if (preg_match($pattern, $content)) {
            return 'Spam detected: suspicious content';
        }
    }
    
    return null;
}

// Main processing
try {
    // Get client IP
    $client_ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    
    // Rate limiting
    if (!$config['spam_protection'] || !checkRateLimit($client_ip)) {
        sendResponse(false, 'Too many attempts. Please try again later.');
    }
    
    // Get form data
    $form_data = [
        'name' => $_POST['name'] ?? '',
        'email' => $_POST['email'] ?? '',
        'phone' => $_POST['phone'] ?? '',
        'subject' => $_POST['subject'] ?? 'General Inquiry',
        'message' => $_POST['message'] ?? '',
        'website' => $_POST['website'] ?? '', // Honeypot field
        'form_type' => 'contact',
        'timestamp' => date('Y-m-d H:i:s'),
        'ip_address' => $client_ip,
        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown'
    ];
    
    // Spam check
    if ($config['spam_protection']) {
        $spam_result = checkSpam($form_data);
        if ($spam_result) {
            sendResponse(false, $spam_result);
        }
    }
    
    // Validation
    $errors = [];
    
    if (empty($form_data['name'])) {
        $errors[] = 'Name is required';
    } elseif (strlen($form_data['name']) < 2) {
        $errors[] = 'Name must be at least 2 characters';
    }
    
    if (empty($form_data['email'])) {
        $errors[] = 'Email is required';
    } elseif (!validateEmail($form_data['email'])) {
        $errors[] = 'Please enter a valid email address';
    }
    
    if (!empty($form_data['phone']) && !validatePhone($form_data['phone'])) {
        $errors[] = 'Please enter a valid phone number';
    }
    
    if (empty($form_data['message'])) {
        $errors[] = 'Message is required';
    } elseif (strlen($form_data['message']) < 10) {
        $errors[] = 'Message must be at least 10 characters';
    } elseif (strlen($form_data['message']) > $config['max_message_length']) {
        $errors[] = 'Message is too long (maximum ' . $config['max_message_length'] . ' characters)';
    }
    
    if (!empty($errors)) {
        sendResponse(false, 'Please correct the following errors: ' . implode(', ', $errors));
    }
    
    // Sanitize data
    foreach ($form_data as $key => $value) {
        if ($key !== 'message') { // Don't sanitize message content
            $form_data[$key] = sanitizeInput($value);
        }
    }
    
    // Prepare email content
    $email_subject = $config['subject_prefix'] . 'Contact Form Submission';
    
    $email_body = "
New contact form submission from Solar Panels Oldham website:

Name: {$form_data['name']}
Email: {$form_data['email']}
Phone: {$form_data['phone']}
Subject: {$form_data['subject']}

Message:
{$form_data['message']}

---
Submitted: {$form_data['timestamp']}
IP Address: {$form_data['ip_address']}
User Agent: {$form_data['user_agent']}
    ";
    
    // Email headers
    $headers = [
        'From: ' . $config['admin_name'] . ' <' . $config['admin_email'] . '>',
        'Reply-To: ' . $form_data['name'] . ' <' . $form_data['email'] . '>',
        'Content-Type: text/plain; charset=UTF-8',
        'X-Mailer: Solar Panels Oldham Contact Form'
    ];
    
    // Send email
    $mail_sent = mail(
        $config['admin_email'],
        $email_subject,
        $email_body,
        implode("\r\n", $headers)
    );
    
    if (!$mail_sent) {
        error_log('Failed to send contact form email: ' . error_get_last()['message']);
        sendResponse(false, 'Sorry, there was an error sending your message. Please try again or call us directly.');
    }
    
    // Send confirmation email to user
    $user_subject = 'Thank you for contacting Solar Panels Oldham';
    $user_body = "
Dear {$form_data['name']},

Thank you for contacting Solar Panels Oldham. We have received your message and will respond within 2 hours during business hours.

Your message:
{$form_data['message']}

If you need immediate assistance, please call us on 0161 123 4567.

Best regards,
The Solar Panels Oldham Team
    ";
    
    $user_headers = [
        'From: ' . $config['admin_name'] . ' <' . $config['admin_email'] . '>',
        'Content-Type: text/plain; charset=UTF-8'
    ];
    
    mail($form_data['email'], $user_subject, $user_body, implode("\r\n", $user_headers));
    
    // Log successful submission
    $log_entry = date('Y-m-d H:i:s') . " - Contact form submitted by {$form_data['name']} ({$form_data['email']})\n";
    file_put_contents('contact_log.txt', $log_entry, FILE_APPEND | LOCK_EX);
    
    // Return success
    sendResponse(true, 'Thank you for your message! We will respond within 2 hours.', [
        'name' => $form_data['name'],
        'email' => $form_data['email']
    ]);
    
} catch (Exception $e) {
    error_log('Contact form error: ' . $e->getMessage());
    sendResponse(false, 'An unexpected error occurred. Please try again or call us directly.');
}
?>