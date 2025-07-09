<?php
/**
 * Solar Panels Oldham - Form Processor
 * Handles contact and quote form submissions
 */

// Security headers
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');

// Configuration
$to_email = 'info@solarpanelsoldham.co.uk';
$site_name = 'Solar Panels Oldham';
$success_url = '/thank-you.html';
$error_url = '/contact.html?error=1';

// Start session for CSRF protection
session_start();

// Validate request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ' . $error_url);
    exit;
}

// Basic CSRF protection
if (!isset($_POST['csrf_token']) || $_POST['csrf_token'] !== $_SESSION['csrf_token']) {
    header('Location: ' . $error_url);
    exit;
}

// Sanitize and validate input
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Get form type
$form_type = isset($_POST['form_type']) ? sanitize_input($_POST['form_type']) : 'contact';

// Common fields
$name = sanitize_input($_POST['name'] ?? '');
$email = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);
$phone = sanitize_input($_POST['phone'] ?? '');
$message = sanitize_input($_POST['message'] ?? '');

// Validation
$errors = [];

if (empty($name)) {
    $errors[] = 'Name is required';
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Valid email is required';
}

// If errors, redirect back
if (!empty($errors)) {
    $_SESSION['form_errors'] = $errors;
    header('Location: ' . $error_url);
    exit;
}

// Build email content based on form type
if ($form_type === 'quote') {
    $subject = "New Quote Request - $site_name";
    
    // Additional quote fields
    $address = sanitize_input($_POST['address'] ?? '');
    $property_type = sanitize_input($_POST['propertyType'] ?? '');
    $monthly_bill = sanitize_input($_POST['monthlyBill'] ?? '');
    $interests = $_POST['interest'] ?? [];
    
    $email_content = "New Quote Request\n";
    $email_content .= "==================\n\n";
    $email_content .= "Contact Information:\n";
    $email_content .= "Name: $name\n";
    $email_content .= "Email: $email\n";
    $email_content .= "Phone: $phone\n";
    $email_content .= "Address: $address\n\n";
    $email_content .= "Property Details:\n";
    $email_content .= "Property Type: $property_type\n";
    $email_content .= "Monthly Bill: £$monthly_bill\n";
    $email_content .= "Interests: " . implode(', ', array_map('sanitize_input', $interests)) . "\n\n";
    $email_content .= "Message:\n$message\n";
    
} else {
    $subject = "New Contact Form Submission - $site_name";
    $contact_subject = sanitize_input($_POST['subject'] ?? 'General Inquiry');
    
    $email_content = "New Contact Form Submission\n";
    $email_content .= "===========================\n\n";
    $email_content .= "Name: $name\n";
    $email_content .= "Email: $email\n";
    $email_content .= "Phone: $phone\n";
    $email_content .= "Subject: $contact_subject\n\n";
    $email_content .= "Message:\n$message\n";
}

// Email headers
$headers = "From: $name <$email>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Send email
$mail_sent = mail($to_email, $subject, $email_content, $headers);

// Send confirmation email to user
$user_subject = "Thank you for contacting $site_name";
$user_message = "Dear $name,\n\n";
$user_message .= "Thank you for your " . ($form_type === 'quote' ? 'quote request' : 'message') . ".\n";
$user_message .= "We've received your inquiry and will respond within 24 hours.\n\n";
$user_message .= "Best regards,\n";
$user_message .= "$site_name Team\n";
$user_message .= "Tel: 0161 123 4567\n";

$user_headers = "From: $site_name <noreply@solarpanelsoldham.co.uk>\r\n";
mail($email, $user_subject, $user_message, $user_headers);

// Clear CSRF token
unset($_SESSION['csrf_token']);

// Redirect to success page
header('Location: ' . $success_url);
exit;
?> 