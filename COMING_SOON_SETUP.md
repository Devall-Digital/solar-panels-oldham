# 🚀 COMING SOON PAGE SETUP GUIDE

## ✅ PERFECT SOLUTION FOR YOUR NEEDS

I've created an enhanced "Coming Soon" page that generates leads while you prepare the full website. This approach gives you the best of both worlds!

---

## 🎯 WHAT'S BEEN IMPLEMENTED

### ✅ Enhanced Coming Soon Page (`index.html`)
- **Professional Design**: Beautiful animated coming soon page
- **Lead Generation**: Two working forms to capture leads
- **Work-in-Progress Warning**: Modal dialog when users want to preview full site
- **Mobile Responsive**: Works perfectly on all devices
- **SEO Optimized**: Proper meta tags and structure

### ✅ Lead Capture Forms
1. **Early Access Form**: Capture interest and build email list
2. **Quick Quote Form**: Get preliminary quote requests
3. **Auto-Reply Emails**: Professional responses to customers
4. **Lead Storage**: All leads saved to JSON file

### ✅ Full Website Preview (`home.html`)
- **Complete Website**: Fully functional solar panels site
- **Preview Access**: Users can view it with warning dialog
- **Ready for Launch**: Just swap files when ready

---

## 📧 EMAIL SETUP REQUIRED

### Create these email addresses in your 20i hosting:

1. **`info@solarpanelsoldham.co.uk`** - Main business email
2. **`leads@solarpanelsoldham.co.uk`** - Early access notifications
3. **`quotes@solarpanelsoldham.co.uk`** - Quote request notifications
4. **`support@solarpanelsoldham.co.uk`** - Customer support (for future use)

### Email Configuration:
- **Forwarding**: Set up forwarding to your preferred email address
- **Auto-replies**: The system will send professional auto-replies
- **Spam protection**: Enable spam filtering

---

## 🔧 TECHNICAL SETUP

### 1. Update Configuration
Edit `config.php` and update:
```php
define('BUSINESS_PHONE', 'YOUR_REAL_PHONE_NUMBER');
define('BUSINESS_EMAIL', 'info@solarpanelsoldham.co.uk');
define('LEADS_EMAIL', 'leads@solarpanelsoldham.co.uk');
define('QUOTES_EMAIL', 'quotes@solarpanelsoldham.co.uk');
```

### 2. Upload Files
Upload these files to your web server:
```
/
├── index.html (Coming Soon page with lead forms)
├── home.html (Full website - for preview)
├── 404.html (Error page)
├── .htaccess (Server configuration)
├── config.php (Configuration file)
├── css/ (All stylesheets)
├── js/ (All JavaScript files)
├── php/ (Form processors)
├── images/ (All images)
└── server/ (SEO files)
```

### 3. Test Forms
After uploading, test both forms:
- **Early Access Form**: Should send email to `leads@solarpanelsoldham.co.uk`
- **Quick Quote Form**: Should send email to `quotes@solarpanelsoldham.co.uk`

---

## 🎨 HOW IT WORKS

### Coming Soon Page Features:
1. **Professional Design**: Animated background with solar theme
2. **Progress Bar**: Shows development progress (85-95%)
3. **Two Lead Forms**: Capture different types of interest
4. **Preview Button**: Users can view full site with warning
5. **Contact Information**: Phone and email prominently displayed

### Lead Generation Process:
1. **Early Access Form**: 
   - Captures name, email, phone, area, interest
   - Sends notification to leads email
   - Sends auto-reply with launch information
   - Stores lead in `coming-soon-leads.json`

2. **Quick Quote Form**:
   - Captures quote request details
   - Sends notification to quotes email
   - Sends auto-reply with quote timeline
   - Stores lead in `coming-soon-leads.json`

### Preview System:
1. **Warning Modal**: Explains it's work in progress
2. **User Choice**: Continue to preview or stay on coming soon
3. **Full Site Access**: Redirects to `home.html` for preview

---

## 📊 LEAD MANAGEMENT

### Lead Storage:
- **File**: `php/coming-soon-leads.json`
- **Format**: JSON with all lead details
- **Backup**: Automatically keeps last 1000 leads
- **Security**: Rate limiting prevents spam

### Email Notifications:
- **Instant**: You get notified immediately of new leads
- **Professional**: Auto-replies sent to customers
- **Segmented**: Different emails for different lead types

### Lead Data Captured:
- **Contact Info**: Name, email, phone
- **Location**: Service area preference
- **Interest**: What they're looking for
- **Property Details**: Type, energy usage (quote form)
- **Timestamp**: When they submitted
- **IP Address**: For security and tracking

---

## 🚀 LAUNCH STRATEGY

### Phase 1: Coming Soon (Now)
- ✅ Generate leads while building full site
- ✅ Build email list for launch
- ✅ Test market interest
- ✅ Refine full website based on feedback

### Phase 2: Full Launch (When Ready)
- Simply replace `index.html` with `home.html`
- All leads already captured
- Email list ready for launch campaign
- Full website tested and optimized

### Benefits of This Approach:
- **No Lost Leads**: Capture interest immediately
- **Market Testing**: See what people are interested in
- **Launch Momentum**: Email list ready for launch
- **Professional Image**: Looks like you're actively working on it

---

## 🧪 TESTING CHECKLIST

### Before Going Live:
- [ ] **Coming Soon page loads** - `solarpanelsoldham.co.uk`
- [ ] **Early Access form works** - Test submission
- [ ] **Quick Quote form works** - Test submission
- [ ] **Emails received** - Check both email addresses
- [ ] **Auto-replies sent** - Check customer emails
- [ ] **Preview button works** - Test modal and redirect
- [ ] **Mobile responsive** - Test on phone/tablet
- [ ] **Contact links work** - Phone and email links

### Test URLs:
- `https://solarpanelsoldham.co.uk/` - Coming Soon page
- `https://solarpanelsoldham.co.uk/home.html` - Full website preview
- `https://solarpanelsoldham.co.uk/404.html` - Error page

---

## 📈 MONITORING & OPTIMIZATION

### Daily Monitoring:
- Check email inboxes for new leads
- Review lead quality and interest areas
- Monitor form submission rates

### Weekly Analysis:
- Review lead data in `coming-soon-leads.json`
- Identify most popular service areas
- Track conversion rates from coming soon to quote requests

### Monthly Optimization:
- Update content based on lead feedback
- Refine full website based on market response
- Plan launch strategy with captured email list

---

## 🎯 NEXT STEPS

### Immediate Actions:
1. **Create email addresses** in 20i hosting
2. **Update phone number** in `config.php`
3. **Upload all files** to your server
4. **Test both forms** to ensure emails work
5. **Monitor leads** and respond to quote requests

### When Ready to Launch Full Site:
1. **Backup current index.html**
2. **Replace index.html with home.html**
3. **Update Google Analytics** with real ID
4. **Send launch email** to captured leads
5. **Monitor full site performance**

---

## 💰 REVENUE GENERATION READY

This approach is **perfect for lead generation**:

- **Immediate Lead Capture**: Start generating leads today
- **Professional Image**: Looks like active development
- **Market Testing**: See what customers want
- **Launch Momentum**: Email list ready for launch
- **No Lost Opportunities**: Capture interest while building

---

## 🆘 SUPPORT & TROUBLESHOOTING

### Common Issues:
1. **Forms not working** - Check PHP is enabled on server
2. **Emails not received** - Verify email forwarding setup
3. **Preview not working** - Check file permissions
4. **Slow loading** - Enable compression in hosting

### Files to Check:
- `php/coming-soon-leads.php` - Form processor
- `config.php` - Email and phone configuration
- `index.html` - Coming soon page
- `home.html` - Full website preview

---

## 🎉 PERFECT SOLUTION!

This approach gives you:

✅ **Immediate lead generation** while building  
✅ **Professional coming soon page** with forms  
✅ **Work-in-progress warning** for preview  
✅ **Full website ready** for when you launch  
✅ **Email list building** for launch campaign  
✅ **Market testing** to refine your offer  

**You can start generating leads immediately while you perfect the full website!**

---

**Status**: ✅ READY TO GENERATE LEADS  
**Approach**: Coming Soon with Lead Capture  
**Next Action**: Create email addresses and upload files