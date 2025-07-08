<?php
/**
 * Solar Panels Oldham - Lead Capture Processor
 * Handles quote form submissions with lead scoring and CRM integration
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
    'lead_database' => 'leads.json',
    'target_areas' => ['oldham', 'saddleworth', 'uppermill', 'delph', 'dobcross', 'greenfield', 'greater manchester'],
    'high_value_areas' => ['saddleworth', 'uppermill', 'delph', 'dobcross', 'greenfield'],
    'spam_protection' => true,
    'honeypot_field' => 'company', // Hidden field to catch bots
    'rate_limit_minutes' => 10,
    'rate_limit_attempts' => 2
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
    $clean = preg_replace('/[^0-9]/', '', $phone);
    return strlen($clean) >= 10 && strlen($clean) <= 15;
}

// Validate UK postcode
function validatePostcode($postcode) {
    $postcode = strtoupper(preg_replace('/\s/', '', $postcode));
    return preg_match('/^[A-Z]{1,2}[0-9R][0-9A-Z]?[0-9][ABD-HJLNP-UW-Z]{2}$/', $postcode);
}

// Calculate lead score
function calculateLeadScore($data) {
    global $config;
    
    $score = 0;
    $factors = [];
    
    // Phone number provided (+30 points)
    if (!empty($data['phone'])) {
        $score += 30;
        $factors[] = 'Phone provided';
    }
    
    // Address validation (+20-40 points)
    if (!empty($data['address'])) {
        $address_lower = strtolower($data['address']);
        
        // Check if in target areas
        $in_target_area = false;
        foreach ($config['target_areas'] as $area) {
            if (strpos($address_lower, $area) !== false) {
                $in_target_area = true;
                break;
            }
        }
        
        if ($in_target_area) {
            $score += 40;
            $factors[] = 'Target area address';
            
            // Check if in high-value areas
            foreach ($config['high_value_areas'] as $area) {
                if (strpos($address_lower, $area) !== false) {
                    $score += 20;
                    $factors[] = 'High-value area';
                    break;
                }
            }
        } else {
            $score += 20;
            $factors[] = 'Non-target area';
        }
    }
    
    // Property type (+10-30 points)
    if (!empty($data['propertyType'])) {
        switch ($data['propertyType']) {
            case 'detached':
                $score += 30;
                $factors[] = 'Detached property';
                break;
            case 'semi-detached':
                $score += 20;
                $factors[] = 'Semi-detached property';
                break;
            case 'terraced':
                $score += 15;
                $factors[] = 'Terraced property';
                break;
            case 'bungalow':
                $score += 25;
                $factors[] = 'Bungalow property';
                break;
        }
    }
    
    // Monthly bill (+10-30 points)
    if (!empty($data['monthlyBill'])) {
        switch ($data['monthlyBill']) {
            case '300+':
                $score += 30;
                $factors[] = 'High energy usage';
                break;
            case '200-300':
                $score += 20;
                $factors[] = 'Medium-high energy usage';
                break;
            case '150-200':
                $score += 15;
                $factors[] = 'Medium energy usage';
                break;
            case '100-150':
                $score += 10;
                $factors[] = 'Low-medium energy usage';
                break;
        }
    }
    
    // Interest level (+10-30 points)
    if (!empty($data['interest'])) {
        if (is_array($data['interest'])) {
            if (in_array('complete-system', $data['interest'])) {
                $score += 30;
                $factors[] = 'Complete system interest';
            } elseif (in_array('battery-storage', $data['interest'])) {
                $score += 20;
                $factors[] = 'Battery storage interest';
            } elseif (in_array('solar-panels', $data['interest'])) {
                $score += 15;
                $factors[] = 'Solar panels interest';
            }
        }
    }
    
    // Additional information (+5-15 points)
    if (!empty($data['message']) && strlen($data['message']) > 20) {
        $score += 15;
        $factors[] = 'Detailed message';
    } elseif (!empty($data['message'])) {
        $score += 5;
        $factors[] = 'Basic message';
    }
    
    // Determine lead quality
    if ($score >= 100) {
        $quality = 'high';
    } elseif ($score >= 70) {
        $quality = 'medium';
    } else {
        $quality = 'low';
    }
    
    return [
        'score' => $score,
        'quality' => $quality,
        'factors' => $factors
    ];
}

// Rate limiting
function checkRateLimit($ip) {
    global $config;
    
    $rate_file = sys_get_temp_dir() . '/lead_capture_' . md5($ip) . '.txt';
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
    
    $content = $data['message'] . ' ' . $data['firstName'] . ' ' . $data['lastName'] . ' ' . $data['email'];
    
    foreach ($suspicious_patterns as $pattern) {
        if (preg_match($pattern, $content)) {
            return 'Spam detected: suspicious content';
        }
    }
    
    return null;
}

// Save lead to database
function saveLead($lead_data) {
    global $config;
    
    $leads = [];
    if (file_exists($config['lead_database'])) {
        $leads = json_decode(file_get_contents($config['lead_database']), true) ?? [];
    }
    
    // Add lead with unique ID
    $lead_id = 'lead_' . time() . '_' . uniqid();
    $lead_data['id'] = $lead_id;
    $lead_data['created_at'] = date('Y-m-d H:i:s');
    
    $leads[] = $lead_data;
    
    // Keep only last 1000 leads
    if (count($leads) > 1000) {
        $leads = array_slice($leads, -1000);
    }
    
    file_put_contents($config['lead_database'], json_encode($leads, JSON_PRETTY_PRINT));
    
    return $lead_id;
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
        'firstName' => $_POST['firstName'] ?? '',
        'lastName' => $_POST['lastName'] ?? '',
        'email' => $_POST['email'] ?? '',
        'phone' => $_POST['phone'] ?? '',
        'address' => $_POST['address'] ?? '',
        'propertyType' => $_POST['propertyType'] ?? '',
        'monthlyBill' => $_POST['monthlyBill'] ?? '',
        'interest' => $_POST['interest'] ?? [],
        'message' => $_POST['message'] ?? '',
        'company' => $_POST['company'] ?? '', // Honeypot field
        'form_type' => 'quote',
        'timestamp' => date('Y-m-d H:i:s'),
        'ip_address' => $client_ip,
        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown',
        'referrer' => $_SERVER['HTTP_REFERER'] ?? 'unknown'
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
    
    if (empty($form_data['firstName'])) {
        $errors[] = 'First name is required';
    } elseif (strlen($form_data['firstName']) < 2) {
        $errors[] = 'First name must be at least 2 characters';
    }
    
    if (empty($form_data['lastName'])) {
        $errors[] = 'Last name is required';
    } elseif (strlen($form_data['lastName']) < 2) {
        $errors[] = 'Last name must be at least 2 characters';
    }
    
    if (empty($form_data['email'])) {
        $errors[] = 'Email is required';
    } elseif (!validateEmail($form_data['email'])) {
        $errors[] = 'Please enter a valid email address';
    }
    
    if (empty($form_data['phone'])) {
        $errors[] = 'Phone number is required';
    } elseif (!validatePhone($form_data['phone'])) {
        $errors[] = 'Please enter a valid phone number';
    }
    
    if (empty($form_data['address'])) {
        $errors[] = 'Property address is required';
    } elseif (strlen($form_data['address']) < 10) {
        $errors[] = 'Please enter a complete address including postcode';
    }
    
    if (!empty($errors)) {
        sendResponse(false, 'Please correct the following errors: ' . implode(', ', $errors));
    }
    
    // Sanitize data
    foreach ($form_data as $key => $value) {
        if ($key !== 'message' && $key !== 'interest') { // Don't sanitize message content or arrays
            $form_data[$key] = sanitizeInput($value);
        }
    }
    
    // Calculate lead score
    $lead_score = calculateLeadScore($form_data);
    $form_data['lead_score'] = $lead_score;
    
    // Save lead to database
    $lead_id = saveLead($form_data);
    
    // Prepare email content
    $email_subject = $config['subject_prefix'] . 'New Lead: ' . $form_data['firstName'] . ' ' . $form_data['lastName'];
    
    $email_body = "
NEW LEAD CAPTURED - Solar Panels Oldham

Lead ID: {$lead_id}
Lead Quality: {$lead_score['quality']} ({$lead_score['score']}/150 points)

Contact Information:
Name: {$form_data['firstName']} {$form_data['lastName']}
Email: {$form_data['email']}
Phone: {$form_data['phone']}
Address: {$form_data['address']}

Property Details:
Type: {$form_data['propertyType']}
Monthly Bill: {$form_data['monthlyBill']}
Interests: " . implode(', ', $form_data['interest']) . "

Lead Score Factors:
" . implode("\n", $lead_score['factors']) . "

Message:
{$form_data['message']}

---
Submitted: {$form_data['timestamp']}
IP Address: {$form_data['ip_address']}
Referrer: {$form_data['referrer']}

PRIORITY: " . strtoupper($lead_score['quality']) . " QUALITY LEAD
    ";
    
    // Email headers
    $headers = [
        'From: ' . $config['admin_name'] . ' <' . $config['admin_email'] . '>',
        'Reply-To: ' . $form_data['firstName'] . ' ' . $form_data['lastName'] . ' <' . $form_data['email'] . '>',
        'Content-Type: text/plain; charset=UTF-8',
        'X-Mailer: Solar Panels Oldham Lead Capture',
        'X-Lead-Quality: ' . $lead_score['quality'],
        'X-Lead-Score: ' . $lead_score['score']
    ];
    
    // Send email
    $mail_sent = mail(
        $config['admin_email'],
        $email_subject,
        $email_body,
        implode("\r\n", $headers)
    );
    
    if (!$mail_sent) {
        error_log('Failed to send lead capture email: ' . error_get_last()['message']);
        sendResponse(false, 'Sorry, there was an error processing your request. Please try again or call us directly.');
    }
    
    // Send confirmation email to user
    $user_subject = 'Your Solar Quote Request - Solar Panels Oldham';
    $user_body = "
Dear {$form_data['firstName']},

Thank you for your solar panel quote request. We have received your information and our expert team will contact you within 1 hour to discuss your requirements.

Your Details:
Name: {$form_data['firstName']} {$form_data['lastName']}
Address: {$form_data['address']}
Property Type: {$form_data['propertyType']}
Monthly Bill: {$form_data['monthlyBill']}

What happens next:
1. Our solar expert will call you within 1 hour
2. We'll arrange a free home assessment
3. You'll receive a detailed quote within 24 hours
4. Installation can begin within 2 weeks

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
    $log_entry = date('Y-m-d H:i:s') . " - Lead captured: {$form_data['firstName']} {$form_data['lastName']} ({$form_data['email']}) - Quality: {$lead_score['quality']} ({$lead_score['score']} points)\n";
    file_put_contents('leads_log.txt', $log_entry, FILE_APPEND | LOCK_EX);
    
    // Return success
    sendResponse(true, 'Thank you for your quote request! We will call you within 1 hour.', [
        'lead_id' => $lead_id,
        'name' => $form_data['firstName'] . ' ' . $form_data['lastName'],
        'email' => $form_data['email'],
        'quality' => $lead_score['quality']
    ]);
    
} catch (Exception $e) {
    error_log('Lead capture error: ' . $e->getMessage());
    sendResponse(false, 'An unexpected error occurred. Please try again or call us directly.');
}
?>