<?php
/**
 * Solar Panels Oldham - Coming Soon Lead Capture
 * Handles early access and quick quote form submissions
 */

// Prevent direct access
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die('Method Not Allowed');
}

// Start session for CSRF protection
session_start();

// Include configuration
require_once '../config.php';

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
    $clean = preg_replace('/[^0-9]/', '', $phone);
    return strlen($clean) >= 10 && strlen($clean) <= 15;
}

// Rate limiting
function checkRateLimit($ip, $form_type) {
    $rate_file = sys_get_temp_dir() . '/coming_soon_' . $form_type . '_' . md5($ip) . '.txt';
    $current_time = time();
    $rate_limit_minutes = 10;
    $rate_limit_attempts = 2;
    
    if (file_exists($rate_file)) {
        $attempts = file_get_contents($rate_file);
        $attempts = json_decode($attempts, true);
        
        // Remove old attempts
        $attempts = array_filter($attempts, function($timestamp) use ($current_time, $rate_limit_minutes) {
            return ($current_time - $timestamp) < ($rate_limit_minutes * 60);
        });
        
        if (count($attempts) >= $rate_limit_attempts) {
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

// Save lead to file
function saveLead($lead_data) {
    $leads_file = 'coming-soon-leads.json';
    $leads = [];
    
    if (file_exists($leads_file)) {
        $leads = json_decode(file_get_contents($leads_file), true) ?: [];
    }
    
    $leads[] = $lead_data;
    
    // Keep only last 1000 leads
    if (count($leads) > 1000) {
        $leads = array_slice($leads, -1000);
    }
    
    return file_put_contents($leads_file, json_encode($leads, JSON_PRETTY_PRINT));
}

// Send email notification
function sendEmailNotification($lead_data, $form_type) {
    $to = $form_type === 'early-access' ? LEADS_EMAIL : QUOTES_EMAIL;
    $subject = $form_type === 'early-access' 
        ? '[Solar Panels Oldham] Early Access Request'
        : '[Solar Panels Oldham] Quick Quote Request';
    
    $message = "
New {$form_type} submission from Solar Panels Oldham Coming Soon page:

Name: {$lead_data['name']}
Email: {$lead_data['email']}
Phone: {$lead_data['phone']}
" . ($form_type === 'early-access' ? "
Area: {$lead_data['area']}
Interest: {$lead_data['interest']}
" : "
Property Type: {$lead_data['propertyType']}
Monthly Bill: {$lead_data['monthlyBill']}
Message: {$lead_data['message']}
") . "
---
Submitted: {$lead_data['timestamp']}
IP Address: {$lead_data['ip_address']}
User Agent: {$lead_data['user_agent']}
";
    
    $headers = [
        'From: ' . BUSINESS_EMAIL,
        'Reply-To: ' . $lead_data['email'],
        'Content-Type: text/plain; charset=UTF-8'
    ];
    
    return mail($to, $subject, $message, implode("\r\n", $headers));
}

// Send auto-reply to customer
function sendAutoReply($lead_data, $form_type) {
    $subject = $form_type === 'early-access' 
        ? 'Thank you for your early access request - Solar Panels Oldham'
        : 'Thank you for your quote request - Solar Panels Oldham';
    
    $message = $form_type === 'early-access' 
        ? "
Dear {$lead_data['name']},

Thank you for your interest in Solar Panels Oldham!

We're excited to let you know that you're now on our early access list. You'll be the first to know when our new website launches in January 2025, and you'll receive exclusive early-bird offers.

What happens next:
• We'll notify you as soon as our full website goes live
• You'll receive exclusive launch offers and discounts
• Our team will contact you to discuss your solar panel requirements

In the meantime, if you have any urgent questions, please don't hesitate to contact us:

📞 Phone: " . BUSINESS_PHONE . "
📧 Email: " . BUSINESS_EMAIL . "

Best regards,
The Solar Panels Oldham Team

---
Solar Panels Oldham
Professional solar installation across Oldham, Saddleworth & Greater Manchester
MCS Certified • Government Approved • 25 Year Warranty
"
        : "
Dear {$lead_data['name']},

Thank you for your quote request for solar panels!

We've received your preliminary quote request and our team will review your requirements. You can expect to hear from us within 24 hours with your personalized quote.

Your request details:
• Property Type: {$lead_data['propertyType']}
• Monthly Electricity Bill: {$lead_data['monthlyBill']}
• Additional Information: {$lead_data['message']}

What happens next:
• Our solar experts will review your requirements
• We'll calculate potential savings and system size
• You'll receive a detailed quote within 24 hours
• We'll schedule a free home assessment if needed

If you need immediate assistance, please contact us:

📞 Phone: " . BUSINESS_PHONE . "
📧 Email: " . BUSINESS_EMAIL . "

Best regards,
The Solar Panels Oldham Team

---
Solar Panels Oldham
Professional solar installation across Oldham, Saddleworth & Greater Manchester
MCS Certified • Government Approved • 25 Year Warranty
";
    
    $headers = [
        'From: ' . BUSINESS_EMAIL,
        'Reply-To: ' . BUSINESS_EMAIL,
        'Content-Type: text/plain; charset=UTF-8'
    ];
    
    return mail($lead_data['email'], $subject, $message, implode("\r\n", $headers));
}

// Main processing
try {
    // Get client IP
    $client_ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    
    // Get form type
    $form_type = $_POST['form_type'] ?? '';
    
    if (!in_array($form_type, ['early-access', 'quick-quote'])) {
        sendResponse(false, 'Invalid form type');
    }
    
    // Rate limiting
    if (!checkRateLimit($client_ip, $form_type)) {
        sendResponse(false, 'Too many attempts. Please try again later.');
    }
    
    // Get form data based on type
    if ($form_type === 'early-access') {
        $form_data = [
            'name' => $_POST['name'] ?? '',
            'email' => $_POST['email'] ?? '',
            'phone' => $_POST['phone'] ?? '',
            'area' => $_POST['area'] ?? '',
            'interest' => $_POST['interest'] ?? '',
            'form_type' => $form_type,
            'timestamp' => date('Y-m-d H:i:s'),
            'ip_address' => $client_ip,
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown'
        ];
    } else {
        $form_data = [
            'name' => $_POST['name'] ?? '',
            'email' => $_POST['email'] ?? '',
            'phone' => $_POST['phone'] ?? '',
            'propertyType' => $_POST['propertyType'] ?? '',
            'monthlyBill' => $_POST['monthlyBill'] ?? '',
            'message' => $_POST['message'] ?? '',
            'form_type' => $form_type,
            'timestamp' => date('Y-m-d H:i:s'),
            'ip_address' => $client_ip,
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown'
        ];
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
    
    if ($form_type === 'quick-quote' && empty($form_data['phone'])) {
        $errors[] = 'Phone number is required for quote requests';
    } elseif (!empty($form_data['phone']) && !validatePhone($form_data['phone'])) {
        $errors[] = 'Please enter a valid phone number';
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
    
    // Save lead
    if (!saveLead($form_data)) {
        sendResponse(false, 'Unable to save your request. Please try again.');
    }
    
    // Send notification email
    if (!sendEmailNotification($form_data, $form_type)) {
        // Log error but don't fail the request
        error_log('Failed to send notification email for ' . $form_type . ' form');
    }
    
    // Send auto-reply
    if (!sendAutoReply($form_data, $form_type)) {
        // Log error but don't fail the request
        error_log('Failed to send auto-reply email for ' . $form_type . ' form');
    }
    
    // Success response
    $success_message = $form_type === 'early-access' 
        ? 'Thank you! You\'ll be the first to know when we launch. Check your email for exclusive early-bird offers!'
        : 'Thank you! We\'ll contact you within 24 hours with your preliminary quote.';
    
    sendResponse(true, $success_message, [
        'form_type' => $form_type,
        'timestamp' => $form_data['timestamp']
    ]);
    
} catch (Exception $e) {
    error_log('Coming soon form error: ' . $e->getMessage());
    sendResponse(false, 'An error occurred. Please try again later.');
}
?>