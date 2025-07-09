<?php
/**
 * Solar Panels Oldham - Header Template
 * Consistent header across all pages
 */

// Get current page info
$current_page = basename($_SERVER['PHP_SELF'], '.php');
$page_titles = [
    'index' => 'Solar Panels Oldham | Premium Solar Installation | Saddleworth & Greater Manchester',
    'home' => 'Solar Panels Oldham | Premium Solar Installation | Saddleworth & Greater Manchester',
    'about' => 'About Us | Solar Panels Oldham | Local Solar Experts',
    'services' => 'Solar Services | Solar Panels Oldham | Installation & Maintenance',
    'gallery' => 'Installation Gallery | Solar Panels Oldham | Our Work',
    'contact' => 'Contact Us | Solar Panels Oldham | Get Your Free Quote',
    'quote' => 'Free Solar Quote | Solar Panels Oldham | Get Started Today',
    'testimonials' => 'Customer Reviews | Solar Panels Oldham | What Our Customers Say',
    'faq' => 'FAQ | Solar Panels Oldham | Common Questions Answered'
];

$page_descriptions = [
    'index' => 'Professional solar panel installation in Oldham, Saddleworth, Uppermill & Greater Manchester. Get your free quote today. Government-backed renewable energy solutions.',
    'home' => 'Professional solar panel installation in Oldham, Saddleworth, Uppermill & Greater Manchester. Get your free quote today. Government-backed renewable energy solutions.',
    'about' => 'Learn about Solar Panels Oldham - your trusted local solar experts. MCS certified installations across Oldham and Saddleworth with 25-year warranties.',
    'services' => 'Complete solar panel services in Oldham. Residential installations, battery storage, maintenance and repairs. MCS certified with 25-year warranties.',
    'gallery' => 'View our solar panel installation gallery. See real examples of our work across Oldham, Saddleworth and Greater Manchester.',
    'contact' => 'Contact Solar Panels Oldham for your free solar quote. Call 0161 123 4567 or fill out our contact form. Expert advice guaranteed.',
    'quote' => 'Get your free solar panel quote from Solar Panels Oldham. Professional assessment and detailed proposal. No obligation, expert advice.',
    'testimonials' => 'Read customer reviews and testimonials from Solar Panels Oldham. Real experiences from homeowners across Oldham and Saddleworth.',
    'faq' => 'Frequently asked questions about solar panels in Oldham. Expert answers about installation, costs, savings and more.'
];

$current_title = $page_titles[$current_page] ?? $page_titles['home'];
$current_description = $page_descriptions[$current_page] ?? $page_descriptions['home'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($current_title); ?></title>
    <meta name="description" content="<?php echo htmlspecialchars($current_description); ?>">
    <meta name="keywords" content="solar panels Oldham, solar panels Saddleworth, solar installation Oldham, solar panels installation Oldham, solar energy Oldham, solar panels Uppermill, renewable energy Oldham, solar panels Greater Manchester">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://solarpanelsoldham.co.uk/">
    <meta property="og:title" content="<?php echo htmlspecialchars($current_title); ?>">
    <meta property="og:description" content="<?php echo htmlspecialchars($current_description); ?>">
    <meta property="og:image" content="https://solarpanelsoldham.co.uk/images/og-image.jpg">
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:title" content="<?php echo htmlspecialchars($current_title); ?>">
    <meta property="twitter:description" content="<?php echo htmlspecialchars($current_description); ?>">
    <meta property="twitter:image" content="https://solarpanelsoldham.co.uk/images/og-image.jpg">
    
    <!-- Schema.org markup for Google -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Solar Panels Oldham",
        "image": "https://solarpanelsoldham.co.uk/images/hero/solar-panels-modern-home.jpg",
        "telephone": "0161-123-4567",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Solar Installation Services",
            "addressLocality": "Oldham",
            "addressRegion": "Greater Manchester",
            "postalCode": "OL1",
            "addressCountry": "GB"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 53.5409,
            "longitude": -2.1114
        },
        "url": "https://solarpanelsoldham.co.uk",
        "sameAs": [
            "https://www.facebook.com/solarpanelsoldham",
            "https://www.twitter.com/solarpanelsoldham"
        ],
        "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
                "Monday",
                "Tuesday", 
                "Wednesday",
                "Thursday",
                "Friday"
            ],
            "opens": "08:00",
            "closes": "18:00"
        },
        "areaServed": [
            "Oldham",
            "Saddleworth",
            "Uppermill",
            "Delph",
            "Dobcross",
            "Greenfield",
            "Greater Manchester"
        ],
        "priceRange": "£££",
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "127"
        }
    }
    </script>
    
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    
    <!-- CSS -->
    <link rel="stylesheet" href="/css/main.css">
    <link rel="stylesheet" href="/css/responsive.css">
    <link rel="stylesheet" href="/css/components.css">
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <link rel="apple-touch-icon" href="/images/icons/apple-touch-icon.png">
    
    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'GA_MEASUREMENT_ID');
    </script>
    
    <!-- Preload critical resources -->
    <link rel="preload" href="/css/main.css" as="style">
    <link rel="preload" href="/js/main.js" as="script">
    <link rel="preload" href="/images/hero/solar-panels-modern-home.jpg" as="image">
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-logo">
                <h2>☀️ Solar Panels Oldham</h2>
            </div>
            
            <div class="nav-menu" id="nav-menu">
                <a href="/" class="nav-link">Home</a>
                <a href="/#services" class="nav-link">Services</a>
                <a href="/#technology" class="nav-link">Technology</a>
                <a href="/#process" class="nav-link">Process</a>
                <a href="/#calculator" class="nav-link">Calculator</a>
                <a href="/#testimonials" class="nav-link">Reviews</a>
                <a href="/#contact" class="nav-link">Contact</a>
                <a href="tel:01611234567" class="nav-cta">📞 Call Now</a>
            </div>
            
            <div class="nav-toggle" id="nav-toggle">
                <span class="bar"></span>
                <span class="bar"></span>
                <span class="bar"></span>
            </div>
        </div>
    </nav>