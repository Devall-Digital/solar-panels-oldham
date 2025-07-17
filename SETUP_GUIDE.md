# 🚀 SOLAR PANELS OLDHAM - WEBSITE SETUP GUIDE

## ✅ WEBSITE STATUS: READY FOR LAUNCH

Your solar panels website is now **fully functional** and ready to go live! Here's what you need to do to complete the setup.

---

## 📧 EMAIL SETUP REQUIRED

### Create these email addresses in your 20i hosting platform:

1. **`info@solarpanelsoldham.co.uk`** - Main business email
2. **`leads@solarpanelsoldham.co.uk`** - Lead notifications
3. **`support@solarpanelsoldham.co.uk`** - Customer support
4. **`quotes@solarpanelsoldham.co.uk`** - Quote requests

### Email Configuration:
- **Forwarding**: Set up forwarding to your preferred email address
- **Auto-replies**: Configure auto-replies for immediate customer acknowledgment
- **Spam protection**: Enable spam filtering on all addresses

---

## 🔧 TECHNICAL SETUP

### 1. Google Analytics Setup
1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new property for "Solar Panels Oldham"
3. Get your **Measurement ID** (format: G-XXXXXXXXXX)
4. Replace `GA_MEASUREMENT_ID` in `index.html` with your actual ID

### 2. SSL Certificate (Recommended)
1. Enable SSL certificate in your 20i hosting control panel
2. Update `config.php` - set `'enable_https' => true`
3. Uncomment HTTPS redirect in `.htaccess`

### 3. Phone Number Update
1. Update the phone number in `config.php`
2. Replace `0161 123 4567` with your actual business number
3. Update emergency contact number if different

---

## 📁 FILE UPLOAD INSTRUCTIONS

### Upload these files to your web server:
```
/
├── index.html (main website - DONE)
├── 404.html (error page)
├── .htaccess (server config)
├── config.php (configuration)
├── css/ (all CSS files)
├── js/ (all JavaScript files)
├── php/ (form processors)
├── images/ (all images)
└── server/ (robots.txt, sitemap.xml)
```

### Important Notes:
- ✅ **Main website is ready** - `index.html` now contains the full website
- ✅ **All assets included** - CSS, JS, images, and PHP files
- ✅ **Server configuration** - `.htaccess` file for optimal performance
- ✅ **SEO ready** - Meta tags, schema markup, and sitemap

---

## 🧪 TESTING CHECKLIST

### Before Going Live:
- [ ] **Forms work** - Test contact and quote forms
- [ ] **Emails received** - Verify email delivery
- [ ] **Mobile responsive** - Test on mobile devices
- [ ] **Page speed** - Check loading times
- [ ] **Links work** - Test all navigation links
- [ ] **Images load** - Verify all images display correctly

### Test URLs:
- `https://solarpanelsoldham.co.uk/` - Main website
- `https://solarpanelsoldham.co.uk/404.html` - Error page
- `https://solarpanelsoldham.co.uk/php/contact-form.php` - Contact form (should redirect)

---

## 📊 GOOGLE ANALYTICS SETUP

### 1. Create Google Analytics 4 Property
1. Go to [Google Analytics](https://analytics.google.com/)
2. Click "Start measuring"
3. Property name: "Solar Panels Oldham"
4. Reporting time zone: "Europe/London"
5. Currency: "British Pound (GBP)"

### 2. Get Measurement ID
1. In your new property, go to "Admin" → "Data Streams"
2. Click "Web" → "Add stream"
3. Website URL: `https://solarpanelsoldham.co.uk`
4. Stream name: "Solar Panels Oldham Website"
5. Copy the **Measurement ID** (G-XXXXXXXXXX)

### 3. Update Website
1. Open `index.html`
2. Find line with `GA_MEASUREMENT_ID`
3. Replace with your actual Measurement ID
4. Upload updated file

---

## 🎯 SEO OPTIMIZATION

### Current SEO Features:
- ✅ **Meta tags** - Title, description, keywords
- ✅ **Schema markup** - Local business structured data
- ✅ **Open Graph** - Social media sharing
- ✅ **Sitemap** - XML sitemap for search engines
- ✅ **Robots.txt** - Search engine instructions
- ✅ **Fast loading** - Optimized for Core Web Vitals

### Next Steps for SEO:
1. **Submit sitemap** to Google Search Console
2. **Set up Google My Business** listing
3. **Create location-specific pages** (future enhancement)
4. **Build local citations** (directory listings)

---

## 📞 CONTACT INFORMATION UPDATE

### Update these in `config.php`:
```php
define('BUSINESS_PHONE', 'YOUR_ACTUAL_PHONE_NUMBER');
define('BUSINESS_EMAIL', 'info@solarpanelsoldham.co.uk');
define('ADMIN_EMAIL', 'info@solarpanelsoldham.co.uk');
define('LEADS_EMAIL', 'leads@solarpanelsoldham.co.uk');
define('SUPPORT_EMAIL', 'support@solarpanelsoldham.co.uk');
define('QUOTES_EMAIL', 'quotes@solarpanelsoldham.co.uk');
```

---

## 🚀 LAUNCH CHECKLIST

### Pre-Launch:
- [ ] Email addresses created and configured
- [ ] Google Analytics set up and Measurement ID updated
- [ ] Phone numbers updated in config
- [ ] SSL certificate enabled (recommended)
- [ ] All files uploaded to server
- [ ] Forms tested and working
- [ ] Mobile responsiveness verified

### Post-Launch:
- [ ] Submit sitemap to Google Search Console
- [ ] Set up Google My Business
- [ ] Monitor form submissions
- [ ] Check Google Analytics data
- [ ] Test lead generation process

---

## 📈 MONITORING & MAINTENANCE

### Daily Monitoring:
- Check email inboxes for leads
- Monitor form submissions
- Review Google Analytics data

### Weekly Tasks:
- Review lead quality and conversion rates
- Check website performance
- Update content if needed

### Monthly Tasks:
- SEO performance review
- Competitor analysis
- Content updates and improvements

---

## 🆘 SUPPORT & TROUBLESHOOTING

### Common Issues:
1. **Forms not working** - Check PHP configuration on server
2. **Emails not received** - Verify email forwarding setup
3. **Images not loading** - Check file permissions
4. **Slow loading** - Enable compression in .htaccess

### Contact for Support:
- Technical issues: Check server error logs
- Content updates: Edit files directly
- SEO questions: Refer to SEO_STRATEGY.md

---

## 🎉 CONGRATULATIONS!

Your solar panels website is now **ready to generate leads** and start earning revenue. The website includes:

- ✅ **Professional design** with modern UI/UX
- ✅ **Lead capture forms** with validation
- ✅ **SEO optimization** for local search
- ✅ **Mobile responsive** design
- ✅ **Fast loading** performance
- ✅ **Security features** and spam protection
- ✅ **Analytics tracking** for performance monitoring

**Next step**: Create the email addresses and update the configuration, then you're ready to go live!

---

**Last Updated**: December 2024  
**Status**: Ready for Launch  
**Priority**: High - Revenue Generation Focus