<?php
/**
 * Solar Panels Oldham - Configuration File
 * Central configuration for all website settings
 * 
 * IMPORTANT: Update these settings before going live
 */

// Business Information
define('BUSINESS_NAME', 'Solar Panels Oldham');
define('BUSINESS_PHONE', '0161 123 4567'); // Update with real phone number
define('BUSINESS_EMAIL', 'info@solarpanelsoldham.co.uk'); // Update with real email
define('BUSINESS_ADDRESS', 'Oldham, Saddleworth & Greater Manchester');
define('BUSINESS_WEBSITE', 'https://solarpanelsoldham.co.uk');

// Email Configuration
define('ADMIN_EMAIL', 'info@solarpanelsoldham.co.uk'); // Main admin email
define('LEADS_EMAIL', 'leads@solarpanelsoldham.co.uk'); // Lead notifications
define('SUPPORT_EMAIL', 'support@solarpanelsoldham.co.uk'); // Customer support
define('QUOTES_EMAIL', 'quotes@solarpanelsoldham.co.uk'); // Quote requests

// Google Analytics
define('GA_MEASUREMENT_ID', 'GA_MEASUREMENT_ID'); // Replace with actual GA4 ID

// Social Media
define('FACEBOOK_URL', 'https://www.facebook.com/solarpanelsoldham');
define('TWITTER_URL', 'https://www.twitter.com/solarpanelsoldham');
define('INSTAGRAM_URL', 'https://www.instagram.com/solarpanelsoldham');

// Service Areas
define('SERVICE_AREAS', [
    'Oldham',
    'Saddleworth', 
    'Uppermill',
    'Delph',
    'Dobcross',
    'Greenfield',
    'Greater Manchester'
]);

// High Value Areas (for lead scoring)
define('HIGH_VALUE_AREAS', [
    'Saddleworth',
    'Uppermill',
    'Delph',
    'Dobcross',
    'Greenfield'
]);

// Business Hours
define('BUSINESS_HOURS', [
    'Monday' => '08:00-18:00',
    'Tuesday' => '08:00-18:00',
    'Wednesday' => '08:00-18:00',
    'Thursday' => '08:00-18:00',
    'Friday' => '08:00-18:00',
    'Saturday' => '09:00-16:00',
    'Sunday' => 'Closed'
]);

// Contact Information
define('CONTACT_INFO', [
    'phone' => BUSINESS_PHONE,
    'email' => BUSINESS_EMAIL,
    'address' => BUSINESS_ADDRESS,
    'emergency_phone' => '0161 123 4567' // Update with emergency number
]);

// SEO Settings
define('SEO_TITLE', 'Solar Panels Oldham | Premium Solar Installation | Saddleworth & Greater Manchester');
define('SEO_DESCRIPTION', 'Professional solar panel installation in Oldham, Saddleworth, Uppermill & Greater Manchester. Get your free quote today. Government-backed renewable energy solutions.');
define('SEO_KEYWORDS', 'solar panels Oldham, solar panels Saddleworth, solar installation Oldham, solar panels installation Oldham, solar energy Oldham, solar panels Uppermill, renewable energy Oldham, solar panels Greater Manchester');

// Form Settings
define('FORM_SETTINGS', [
    'max_message_length' => 2000,
    'spam_protection' => true,
    'rate_limit_minutes' => 5,
    'rate_limit_attempts' => 3
]);

// Lead Scoring Settings
define('LEAD_SCORING', [
    'phone_provided' => 30,
    'target_area' => 40,
    'high_value_area' => 20,
    'detached_property' => 30,
    'semi_detached_property' => 20,
    'terraced_property' => 15,
    'bungalow_property' => 25,
    'high_energy_usage' => 30,
    'medium_high_energy' => 20,
    'medium_energy' => 15,
    'low_medium_energy' => 10,
    'complete_system_interest' => 30,
    'battery_storage_interest' => 20,
    'solar_panels_interest' => 15,
    'detailed_message' => 15,
    'basic_message' => 5
]);

// Performance Settings
define('PERFORMANCE', [
    'enable_compression' => true,
    'enable_caching' => true,
    'cache_duration' => 31536000, // 1 year in seconds
    'enable_minification' => false // Set to true in production
]);

// Security Settings
define('SECURITY', [
    'enable_https' => false, // Set to true when SSL is active
    'enable_csp' => true,
    'enable_hsts' => false, // Set to true when SSL is active
    'session_timeout' => 3600 // 1 hour
]);

// Email Templates
define('EMAIL_TEMPLATES', [
    'contact_subject' => '[Solar Panels Oldham] Contact Form Submission',
    'lead_subject' => '[Solar Panels Oldham] New Lead - {lead_quality}',
    'quote_subject' => '[Solar Panels Oldham] Quote Request - {property_type}',
    'auto_reply_subject' => 'Thank you for contacting Solar Panels Oldham'
]);

// Database/Storage Settings
define('STORAGE', [
    'leads_file' => 'leads.json',
    'contacts_file' => 'contacts.json',
    'backup_enabled' => true,
    'backup_frequency' => 'daily'
]);

// Development Settings
define('DEVELOPMENT', [
    'debug_mode' => false,
    'log_errors' => true,
    'show_errors' => false,
    'test_mode' => false
]);

// Version Information
define('VERSION', '1.0.0');
define('LAST_UPDATED', '2024-12-19');

/**
 * Get configuration value
 * @param string $key Configuration key
 * @param mixed $default Default value if key not found
 * @return mixed Configuration value
 */
function getConfig($key, $default = null) {
    $keys = explode('.', $key);
    $value = null;
    
    foreach ($keys as $k) {
        if (defined(strtoupper($k))) {
            $value = constant(strtoupper($k));
        } elseif (isset($GLOBALS[$k])) {
            $value = $GLOBALS[$k];
        } else {
            return $default;
        }
    }
    
    return $value;
}

/**
 * Update configuration value
 * @param string $key Configuration key
 * @param mixed $value New value
 * @return bool Success status
 */
function updateConfig($key, $value) {
    // This would typically update a database or config file
    // For now, we'll just return true
    return true;
}

/**
 * Get all configuration as array
 * @return array All configuration values
 */
function getAllConfig() {
    return [
        'business' => [
            'name' => BUSINESS_NAME,
            'phone' => BUSINESS_PHONE,
            'email' => BUSINESS_EMAIL,
            'address' => BUSINESS_ADDRESS,
            'website' => BUSINESS_WEBSITE
        ],
        'emails' => [
            'admin' => ADMIN_EMAIL,
            'leads' => LEADS_EMAIL,
            'support' => SUPPORT_EMAIL,
            'quotes' => QUOTES_EMAIL
        ],
        'analytics' => [
            'ga_id' => GA_MEASUREMENT_ID
        ],
        'service_areas' => SERVICE_AREAS,
        'high_value_areas' => HIGH_VALUE_AREAS,
        'contact_info' => CONTACT_INFO,
        'seo' => [
            'title' => SEO_TITLE,
            'description' => SEO_DESCRIPTION,
            'keywords' => SEO_KEYWORDS
        ]
    ];
}
?>