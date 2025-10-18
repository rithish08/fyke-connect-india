# 📱 FYKE CONNECT - COMPLETE SCREEN-BY-SCREEN DOCUMENTATION

## 🎯 Purpose
This document provides **EXTREMELY DETAILED** documentation for every screen, feature, function, transition, and interaction in the Fyke Connect app. Perfect for new developers, designers, and team members to understand every inch of the product.

---

## 🌍 SCREEN 1: LANGUAGE SELECTION (`/`)

### **What It Does**
First screen users see when opening the app. Allows users to select their preferred language for the entire app experience.

### **Visual Design**
- **Background**: Beautiful gradient from blue-50 → indigo-50 → purple-50
- **Main Card**: Floating white card with glassmorphism effect (white/80 opacity with backdrop blur)
- **Logo**: Black circular logo with "fyke" text in white, centered at top
- **Title**: "Select Your Language" in large, bold font
- **Subtitle**: "Choose your preferred language to continue"

### **Supported Languages (12 total)**
Each language displays as a card with:
1. **English** (E) - Blue circle
2. **Hindi** (ह) - Orange circle  
3. **Tamil** (த) - Pink circle
4. **Telugu** (త) - Green circle
5. **Bengali** (ব) - Purple circle
6. **Marathi** (म) - Red circle
7. **Gujarati** (ગ) - Yellow circle
8. **Kannada** (ಕ) - Teal circle
9. **Malayalam** (മ) - Indigo circle
10. **Punjabi** (ਪ) - Lime circle
11. **Urdu** (ا) - Emerald circle
12. **Arabic** (ع) - Gray circle

### **How Language Cards Work**
- **Layout**: 2-5 columns responsive grid (2 on mobile, 5 on desktop)
- **Each Card Shows**:
  - Colored circle with native letter
  - Language name in native script (e.g., "हिंदी")
  - Language name in English (e.g., "Hindi")
  - Green checkmark when selected
- **Selection Behavior**:
  - Click/tap any card to select
  - Card gets blue border + ring-2 ring-blue-200 + shadow-xl
  - Circle scales up (scale-110)
  - "Selected" text appears below with checkmark icon
- **Keyboard Navigation**: Tab through cards, Enter/Space to select

### **Continue Button**
- **Position**: Fixed at bottom, sticky
- **Style**: Black gradient button, full width (80% max-w-lg)
- **Text**: "Continue" with arrow-right icon
- **Behavior**: 
  - Disabled until language selected (gray, no hover)
  - Enabled once selected (black gradient, hover effect)
  - Click → saves language to localStorage + Context
  - Navigates to `/login`

### **Accessibility Message**
Small text below button: "This app supports screen readers and accessibility features"

### **Logic Flow**
```
1. App loads → Check if user authenticated
   - If YES → Redirect to /home
   - If NO → Show language selection
2. User clicks language card → setSelectedLanguage(code)
3. User clicks Continue → setLanguage(code) → navigate('/login')
4. Language saved in LocalizationContext + localStorage
5. All text in app will now use selected language
```

### **State Management**
- `selectedLanguage` - currently selected language code
- `language` from LocalizationContext - active language
- Uses `getSupportedLanguages()` to fetch all available languages

---

## 🔐 SCREEN 2: LOGIN SCREEN (`/login`)

### **What It Does**
User enters phone number → receives OTP → enters OTP → authenticated.

### **Visual Design (Phone Entry)**
- **Background**: Gradient from blue-50 to indigo-100
- **Card**: White card with shadow-xl, rounded-3xl corners
- **Icon**: Blue gradient circle with Phone icon (from-blue-600 to-indigo-600)
- **Title**: "Welcome to Fyke" (bold, 2xl)
- **Subtitle**: "Enter your phone number to get started"

### **Phone Input Field**
- **Prefix**: Shows "+91" (India country code) on left side
- **Input**: 
  - Type: "tel"
  - Placeholder: "9876543210"
  - MaxLength: 10 digits
  - Auto-filters to only numbers
  - Large text (text-lg)
  - Rounded-2xl border
  - Focus: Blue ring (focus:ring-2 focus:ring-blue-500)

### **Send OTP Button**
- **Style**: Full width, gradient (from-blue-600 to-indigo-600)
- **Text**: "Send OTP" or "Sending..." when loading
- **Disabled When**:
  - Phone length ≠ 10 digits
  - Currently sending OTP (loading=true)
- **Click Behavior**:
  1. Validates phone (must be 10 digits)
  2. If invalid → Shows toast error + haptic vibration
  3. If valid → Calls `sendOTP(phone)`
  4. Shows loading spinner
  5. If success → Shows OTP input view
  6. If error → Shows toast with error message

### **Test Mode Hint**
If phone is 7777777777, 8888888888, or 9999999999:
- Shows blue text: "🧪 Test Mode: This number will use test OTP"

### **Visual Design (OTP Entry)**
After OTP sent, screen transitions to OTP verification:

- **Background**: White
- **Logo**: Simple "F" in gray circle at top
- **Title**: "Verify Your Phone"
- **Subtitle**: "Enter the 6-digit code sent to +91 {phone}"

### **OTP Input (EnhancedOTPInput)**
- **6 Boxes**: One for each digit
- **Design**: Large square boxes, centered, with space between
- **Behavior**:
  - User types → auto-moves to next box
  - Backspace → moves to previous box
  - Auto-submits when 6 digits entered
  - Green pulse indicator: "Code will be verified automatically"
- **Test Mode OTP Hints**:
  - Phone 7777777777 → OTP: 333333
  - Phone 8888888888 → OTP: 111111
  - Phone 9999999999 → OTP: 222222

### **Resend OTP**
- **Timer**: Shows "Resend in 60s" countdown
- **After Timer**: Shows "Resend OTP" link (blue, clickable)
- **Click**: Sends new OTP, resets timer to 60s

### **Change Number Button**
- Left side, gray text: "← Change Number"
- Click → Goes back to phone entry screen

### **Security Info**
- Green shield icon (🛡️)
- Text: "Secure Verification"
- Subtitle: "This helps us keep your account safe and secure"

### **Logic Flow**
```
1. User enters phone → Clicks "Send OTP"
2. System validates phone (10 digits)
3. If test number → Bypass Firebase, show OTP input
4. If real number → Firebase sends SMS OTP
5. User sees OTP input screen
6. User types 6 digits → Auto-submits
7. System calls verifyOTP(phone, code)
8. If correct → Authentication success
   - Shows success toast
   - Navigates to '/' (RouteGuard handles next screen)
9. If incorrect → Shows error, clears OTP, lets user retry
```

### **State Management**
- `phone` - entered phone number
- `otp` - array of 6 strings for each digit
- `showOTP` - boolean to switch between phone/OTP views
- `loading` - shows spinner during API calls
- `resendTimer` - countdown for resend button

---

## 👤 SCREEN 3: ROLE SELECTION (`/role-selection`)

### **What It Does**
After phone verification, user chooses their role: Job Seeker or Employer.

### **Visual Design**
- **Background**: Gradient from gray-50 to blue-50
- **Logo**: Large circular gradient icon (blue-600 to indigo-600) with "f"
- **Title**: "Choose Your Role" (3xl, bold)
- **Subtitle**: "How do you want to use Fyke?"

### **Role Cards (2 Cards)**

#### **Card 1: Job Seeker (Find Work)**
- **Icon**: User2 icon (Lucide React) in white on blue-500 circle
- **Background**: Gradient from-blue-50 to-indigo-50
- **Title**: "Find Work"
- **Subtitle**: "Browse jobs and earn money"
- **Features List**:
  - ✓ Quick applications
  - ✓ Daily payments
  - ✓ Verified employers
- **Selection State**:
  - Unselected: Border-gray-100, hover:border-gray-300
  - Selected: Border-gray-900, shadow-xl, scale-105, shows arrow icon

#### **Card 2: Employer (Hire Workers)**
- **Icon**: Users2 icon in white on green-500 circle
- **Background**: Gradient from-green-50 to-emerald-50
- **Title**: "Hire Workers"
- **Subtitle**: "Find skilled people instantly"
- **Features List**:
  - ✓ Verified workers
  - ✓ Quick hiring
  - ✓ Secure payments
- **Selection State**: Same as Job Seeker

### **How Selection Works**
1. User clicks/taps any card
2. `setSelectedRole(type)` updates state
3. Card border becomes black (border-2 border-gray-900)
4. Card scales up slightly (scale-105)
5. Arrow icon appears in top-right of card
6. Continue button becomes enabled

### **Continue Button (StickyActionButton)**
- **Position**: Fixed at bottom of screen
- **Style**: Black gradient, full width
- **Text**: Changes based on selection:
  - No selection: "Select your role" (disabled)
  - Job Seeker selected: "Continue as Job Seeker"
  - Employer selected: "Continue as Employer"
- **Click Behavior**:
  1. Calls `setRole(selectedRole)` in AuthContext
  2. Updates profile: `{ role: selectedRole, profileComplete: false }`
  3. Clears localStorage/sessionStorage
  4. Navigates to `/profile-setup` (replace: true)

### **Switch Role Hint**
Bottom text: "You can switch roles anytime in the app"

### **Logic Flow**
```
1. User authenticated → Sees role selection
2. User clicks "Job Seeker" or "Employer"
3. selectedRole state updates
4. Continue button enabled
5. User clicks Continue
6. Role saved to database (profiles table)
7. Navigate to /profile-setup to complete profile
8. User can switch roles later from settings
```

### **State Management**
- `selectedRole` - 'jobseeker' | 'employer' | null
- Uses `setRole()` from AuthContext to persist to database

---

## 📝 SCREEN 4: PROFILE SETUP (`/profile-setup`)

### **What It Does**
Multi-step wizard for new users to complete their profile. Different steps for Job Seekers vs Employers.

### **Visual Design**
- **Background**: Beautiful gradient from-violet-50 via-blue-50 to-cyan-50
- **Header Card**: Floating card with violet gradient icon (BadgeCheck) + "Complete Your Profile"
- **Content**: Each step shown in floating card with smooth transitions

### **STEP 1: NAME ENTRY (ProfileNameStep)**

#### **What It Shows**
- **Title**: "What's your name?" (2xl, bold)
- **Subtitle**: "This helps employers/workers recognize you"
- **Input Field**:
  - Placeholder: "Enter your full name"
  - MaxLength: 50 characters
  - Large, rounded-2xl
  - Auto-focused
- **Continue Button**: Disabled until name entered

#### **How It Works**
1. User types name into input
2. Continue button enables when name.length > 0
3. User clicks Continue
4. Calls `updateProfile({ name })`
5. Shows loading state
6. Navigates to next step (category selection)

---

### **STEP 2: CATEGORY SELECTION (ModernCategoryStep)**

#### **What It Shows**
- **Title**: "What kind of work are you interested in?" (or "What workers do you need?")
- **Category Grid**: 2-column grid (3 columns on larger screens)
- **Each Category Card**:
  - Large emoji/icon (3xl, centered)
  - Category name (bold, centered)
  - Subcategory count (e.g., "12 specializations")
  - Hover effect: scale-102, shadow-md
  - Selected state: Blue background, white text, checkmark

#### **How Selection Works**
1. User clicks any category card
2. Card background becomes blue (bg-blue-600)
3. Text becomes white
4. Checkmark icon appears
5. Subcategory popup opens (floating modal)

#### **Subcategory Popup (SubcategoryCardPopup)**
- **Design**: White card, rounded corners, centered on screen
- **Header**: Category icon + name
- **Content**: List of subcategories as chips
- **Each Subcategory Chip**:
  - Rounded-full border
  - Unselected: White bg, gray border
  - Selected: Blue bg (bg-blue-600), white text
  - Multiple selection allowed
- **Confirm Button**: Blue gradient, full width
- **Click**: Saves selections, closes popup

#### **Logic Flow**
```
1. User clicks Construction category
2. Popup opens with subcategories:
   - Mason
   - Carpenter
   - Electrician
   - Plumber
   - Painter
   (and more...)
3. User clicks "Mason" and "Carpenter"
4. Both chips turn blue
5. User clicks "Confirm"
6. selectedCategories = { 'construction': ['Mason', 'Carpenter'] }
7. Popup closes
8. User can select up to 3 categories total
9. Continue button enabled
10. User clicks Continue → Next step
```

---

### **STEP 3: WAGES/SALARY (Job Seekers Only) - WagesPopup**

#### **What It Shows**
- **Floating Modal**: White card, rounded, shadow-xl
- **Title**: "Set Your Expected Wages"
- **For Each Selected Category**:
  - Category name header
  - Wage input field (₹ symbol)
  - Period selector: Daily / Weekly / Monthly
  - Info text: "This helps employers find you"

#### **How It Works**
1. Shows wage fields for each category user selected
2. User enters expected wage (e.g., ₹500)
3. User selects period (Daily, Weekly, Monthly)
4. Can set different wages for different categories
5. Skip button: Can skip this step
6. Save button: Saves wages to profile

#### **Data Structure**
```javascript
wages: {
  'construction': { rate: 500, unit: 'daily' },
  'delivery': { rate: 3000, unit: 'weekly' }
}
```

#### **Logic Flow**
```
1. After category selection, wages popup shows
2. User sets wages for each category
3. User clicks "Save" or "Skip"
4. Wages saved to profile: updateProfile({ wages })
5. profileComplete = true
6. Navigate to /home
```

---

### **For Employers**
- **No wage step** - directly goes to /home after category selection
- Just need to know what type of workers they need

---

## 🏠 SCREEN 5: HOME SCREEN (`/home`)

### **What It Does**
Main dashboard after login. Different for Job Seekers vs Employers.

### **Common Elements (Both Roles)**
1. **StickyHeader**: Shows app logo, notifications icon
2. **DynamicRoleSwitcher**: Toggle between Job Seeker ↔ Employer roles
3. **BottomNavigation**: 5 tabs (Home, Search, Jobs, Requests, Profile)

---

### **JOB SEEKER HOME (JobSeekerHome.tsx)**

#### **1. HomeGreeting Component**
- **What It Shows**: Carousel of slides with tips and updates
- **Design**: Rounded card with gradient background
- **Slides**:
  - Slide 1: "New jobs added daily!" + image
  - Slide 2: "Get hired faster" + image
  - Slide 3: "Showcase your skills" + image
- **Auto-play**: Changes slide every 10 seconds
- **Close Button**: X icon in top-right
- **Logic**: Shows greeting for 3 seconds, then transitions to carousel
- **State**: Stored in sessionStorage (won't show again after close)

#### **2. Quick Stats Cards (2 columns)**

**Card 1: Set Wages Button**
- **Design**: Blue gradient button, rounded-2xl
- **Text**: "Set Wages"
- **Click**: Opens WagesPopup modal
- **Purpose**: Let user update their wage expectations anytime

**Card 2: Availability Status Dropdown**
- **Shows Current Status**:
  - 🟢 **Available**: "Your profile is actively shown to employers"
  - 🟡 **Busy**: "You won't appear in new searches"
  - 🔴 **Offline**: "You are offline and not visible"
- **Design**: Card with colored icon + text + ChevronDown
- **Click**: Opens dropdown menu
- **Dropdown Options**: All 3 statuses with descriptions
- **Selection**: Updates user.availability in database immediately

**How Availability Works**:
```
1. User clicks availability card
2. Dropdown shows:
   - Available (green) - Active in search
   - Busy (yellow) - Hidden from new searches
   - Offline (gray) - Not visible
3. User selects new status
4. Calls updateProfile({ availability: 'busy' })
5. Toast notification: "Status updated"
6. Dropdown closes
7. Card updates to show new status
```

#### **3. Quick Actions (2 columns)**

**Find Jobs Button**
- Icon: Search icon (blue)
- Text: "Find Jobs"
- Click: Navigate to `/search`

**My Applications Button**
- Icon: TrendingUp icon (green)
- Text: "My Applications"
- Click: Navigate to `/my-jobs`

#### **4. Recommended Jobs Section**
- **Title**: "Recommended for You" with "View All" link
- **Shows**: 5 most recent/relevant jobs
- **Each Job Card (UnifiedJobCard)**:
  - Job title (bold)
  - Company name + location
  - Salary (green, bold): ₹500/day
  - Category + urgent badge
  - Apply button (blue gradient)
  - If already applied: "Applied" badge (green)
- **Empty State**: 
  - Shows when no jobs found
  - Icon: 📋 emoji
  - Text: "No Jobs Found"
  - Subtitle: "Try broadening your search"
  - Button: "Browse Jobs" → /search
- **Loading State**: Shows 2 skeleton loaders

#### **5. Requests Box**
- **Design**: White card with blue border, centered
- **Shows**: Total requests count (sent + received + accepted + rejected)
- **Text**: "{count} Requests"
- **Button**: "View" (black, bold) → Navigate to `/requests`

---

### **EMPLOYER HOME (EmployerHome.tsx)**

#### **1. HomeGreeting Component**
Same as Job Seeker but with employer-specific slides:
- Slide 1: "Find skilled workers nearby"
- Slide 2: "Post a job in minutes"
- Slide 3: "Review top candidates"

#### **2. Quick Actions (2 columns)**

**Post New Job Button**
- **Design**: Blue gradient, large (h-24)
- **Icon**: Plus icon
- **Text**: "Post New Job"
- **Click**: Navigate to `/post-job`

**Find Workers Button**
- **Design**: White with green border
- **Icon**: Users icon (green)
- **Text**: "Find Workers"
- **Click**: Navigate to `/search`

#### **3. Quick Stats (3 columns)**

**Active Jobs Card**
- Number: Count of jobs with status='open'
- Label: "Active Jobs"
- Color: Blue

**Applications Card**
- Number: Total applications received
- Label: "Applications"
- Color: Green

**Requests Card**
- Number: Total requests count
- Label: "Requests"
- Button: "View" → /requests
- Color: Orange

#### **4. Recent Applications Section**
- **Title**: "Recent Applications" with "Manage All" link
- **Shows**: Last 3 applications
- **Each Application**:
  - Applicant name + photo
  - "Applied to {job title}"
  - Status badge (pending/accepted/rejected)
  - Click: Navigate to job details
- **Empty State**: "No new applications yet"
- **Loading**: 2 skeleton loaders

#### **5. Posted Jobs Section**
- **Title**: "Your Job Posts" with "Manage All" link
- **Shows**: Last 3 posted jobs
- **Each Job Card (UnifiedJobCard)**:
  - Job title
  - Location + salary
  - Status badge
  - View button → /jobs/{id}
  - Edit button → /edit-job/{id}
- **Empty State**: "You have not posted any jobs yet"
- **Loading**: 2 skeleton loaders

---

## 🔍 SCREEN 6: JOB SEARCH (`/search`)

### **What It Does**
Different experience for Job Seekers (search jobs) vs Employers (search workers).

---

### **VIEW 1: CATEGORY SELECTION (JobSearchCategoryView)**

#### **What It Shows**
- **Header**: 
  - Icon: Briefcase (Job Seeker) or Users (Employer)
  - Title: "Find Jobs by Category" or "Find Workers by Category"
  - Subtitle: "Select a category to find jobs/workers"
- **Category Grid**: 2 columns, responsive
- **Each Category Card (FloatingCard)**:
  - Icon/emoji (3xl)
  - Category name
  - Subcategory count: "12 specializations"
  - Hover: scale-102, shadow-md
  - Click: Selects category, navigates to results

#### **How It Works**
```
1. User sees all categories (Construction, Delivery, Cleaning, etc.)
2. User clicks "Construction"
3. handleCategorySelect() called
4. selectedCategory = Construction
5. Navigate to results view (currentView = 'results')
6. Results filtered by construction category
```

---

### **VIEW 2: RESULTS VIEW (JobSearchResultsView)**

#### **What It Shows**

**1. Search Header (JobSearchHeader / LocalizedJobSearchHeader)**
- **Back Button**: ← icon, goes back to categories
- **Selected Category Badge**: Shows current category with X to clear
- **Search Input**: "Search by keyword..." with Search icon
- **Location Picker**: Shows current location with dropdown

**2. Subcategory Filter (Horizontal Scrolling Chips)**
- **Shows**: All subcategories for selected category
- **Design**: Horizontal scroll, chips with rounded-full borders
- **Each Chip**:
  - Unselected: White bg, gray border
  - Selected: Blue bg, white text
  - Multiple selection allowed
- **Logic**: Filters results by selected subcategories

**3. Advanced Filters (CompactAdvancedFilters)**
- **Toggle Button**: "Filters" with Filter icon
- **Expands to show**:
  - Distance slider (0-50 km)
  - Min Rating (stars)
  - Price Range slider (₹0 - ₹5000)
  - Availability filter (All / Available Only)
  - Urgent Jobs toggle
- **Apply Button**: Applies all filters, closes panel

**4. Results List**
- **For Job Seekers**: Shows job cards (UnifiedJobCard)
- **For Employers**: Shows worker cards (UnifiedWorkerCard)

**Job Card Components**:
- Job title (bold)
- Company name + location with icons
- Salary range (green, large)
- Category badge + Urgent badge (if urgent)
- Posted time: "Posted 2 hours ago"
- Apply button (blue) or "Applied" badge
- View Details button
- Click card: Opens job details modal

**Worker Card Components**:
- Profile photo (circular)
- Worker name + verification badge
- Category + subcategory
- Rating (stars) + review count
- Hourly rate (green, bold)
- Distance from you: "2.5 km away"
- Availability indicator (green dot if available)
- Action buttons:
  - Call (phone icon) - opens call confirmation
  - Message (chat icon) - opens messaging
  - Request (user-plus icon) - sends work request

**5. Empty State**
- Icon: 🔍 emoji
- Title: "No {jobs/workers} found"
- Subtitle: "Try adjusting your filters"
- Button: "Clear Filters"

**6. Loading State**
- Shows skeleton cards (shimmer effect)
- 3-5 skeleton cards displayed

#### **How Filtering Works**
```
1. User selects "Construction" category
2. Results = All jobs/workers with category='construction'
3. User selects "Mason" subcategory
4. Results filtered: category='construction' AND subcategory='Mason'
5. User opens filters
6. User sets distance to 10km
7. Results filtered: + distance < 10km
8. User sets min rating to 4 stars
9. Results filtered: + rating >= 4
10. Results update in real-time
```

#### **How Search Works**
```
1. User types "plumber" in search box
2. Search query debounced (500ms delay)
3. Results filtered:
   - Title contains "plumber" OR
   - Description contains "plumber" OR
   - Skills include "plumber"
4. Results update in real-time
5. User clears search
6. All results shown again (with category filter still active)
```

---

## 📋 SCREEN 7: MY JOBS (`/my-jobs`)

### **What It Does**
Different for Job Seekers (track applications) vs Employers (manage posted jobs).

---

### **JOB SEEKER VIEW**

#### **Header**
- Title: "My Applications"
- Subtitle: "Track your job applications"

#### **Tabs (3 Tabs)**

**Tab 1: Applied ({count})**
- Shows all applications with status='pending'
- Applications user submitted but not yet responded to
- Each card shows:
  - Job title + company
  - Location
  - Salary
  - "Applied 2 hours ago"
  - Status badge: "Pending"
  - View Job button
  - Withdraw button (red)

**Tab 2: In-Progress ({count})**
- Shows applications with status='accepted'
- Jobs user is currently working on or scheduled for
- Each card shows:
  - Same as Applied
  - Status badge: "Accepted" (green)
  - View Job button
  - No withdraw button (already accepted)

**Tab 3: Archive ({count})**
- Shows applications with status='rejected' or 'completed'
- Past applications no longer active
- Each card shows:
  - Same as Applied
  - Status badge: "Rejected" (red) or "Completed" (blue)
  - View Job button

#### **Empty States**
Each tab has empty state:
- Icon: 📋 emoji
- Title: "No jobs here"
- Subtitle: "You don't have any {applied/in-progress/archived} applications yet"
- Button: "Browse Jobs" → /search

#### **Actions**

**Withdraw Application**
1. User clicks "Withdraw" on pending application
2. Confirmation dialog opens: "Withdraw Application?"
3. Description: "Are you sure you want to withdraw?"
4. Buttons: Cancel / Withdraw (red)
5. User clicks Withdraw
6. Calls `withdrawApplication(id)`
7. Application deleted from database
8. Toast: "Application withdrawn"
9. Card removed from list

---

### **EMPLOYER VIEW**

#### **Header**
- Title: "My Job Posts"
- Subtitle: "Manage your active and completed job posts"
- Button: "Post Job" (blue) → /post-job

#### **Tabs (2 Tabs)**

**Tab 1: Active ({count})**
- Shows jobs with status='posted' or 'open'
- Jobs currently accepting applications
- Each card shows:
  - Job title (bold)
  - Location + salary
  - Status badge: "Open" (green)
  - Posted time: "Posted 5 hours ago"
  - Buttons:
    - View (eye icon) → /jobs/{id}
    - Edit (edit icon) → /edit-job/{id}
    - Delete (trash icon, red) → Confirmation dialog

**Tab 2: Completed ({count})**
- Shows jobs with status='filled' / 'expired' / 'draft'
- Past jobs no longer active
- Each card shows:
  - Same as Active
  - Status badge: "Filled" (blue) / "Expired" (gray)
  - View button only (no edit/delete)

#### **Actions**

**Delete Job**
1. User clicks trash icon on job card
2. Confirmation dialog: "Delete Job?"
3. Description: "This action cannot be undone"
4. Buttons: Cancel / Delete (red)
5. User clicks Delete
6. Calls supabase.from('jobs').delete().eq('id', jobId)
7. Job removed from database
8. Toast: "Job deleted successfully"
9. Card removed from list

**Edit Job**
1. User clicks Edit button
2. Navigates to /edit-job/{id}
3. Pre-fills form with existing job data
4. User makes changes
5. Saves → Updates job in database

---

## 💬 SCREEN 8: REQUESTS (`/requests`)

### **What It Does**
Manage work requests between job seekers and employers. Both roles can send/receive requests.

### **Visual Design**
- **Header**: "Requests" title
- **Tab Buttons**: "Pending" and "History" (rounded-full, blue active state)
- **Content Area**: Scrollable list of request cards

---

### **TAB 1: PENDING REQUESTS**

#### **Section 1: Sent by Me**
Shows requests current user sent that are still pending response.

**For Job Seeker**: Requests sent to employers
**For Employer**: Requests sent to workers

**Each Request Card**:
- Worker/Employer profile photo
- Name + category
- Rating (stars)
- Distance
- "Request Sent" badge (yellow)
- Click card: Opens profile modal

**If No Requests**: 
- Empty state: "No pending requests sent"

#### **Section 2: Received**
Shows requests received from others waiting for response.

**For Job Seeker**: Requests from employers
**For Employer**: Requests from workers

**Each Request Card**:
- Profile photo + name
- Category + rating
- Distance
- **Action Buttons** (appears when received):
  - **Accept Button** (green, rounded-full)
    - Text: "Accept"
    - Click: Calls `acceptRequest(id)`
    - Toast: "Request Accepted"
    - Request moves to History → Accepted
    - Both users can now message each other
  - **Reject Button** (red, rounded-full)
    - Text: "Reject"
    - Click: Calls `rejectRequest(id)`
    - Toast: "Request Rejected"
    - Request moves to History → Rejected

**If No Requests**: 
- Empty state: "No pending requests received"

#### **How Request Logic Works**
```
1. Employer browsing workers
2. Finds worker they like
3. Clicks "Request" button on worker card
4. System creates request:
   - applicant_id: worker.id
   - employer_id: employer.id
   - status: 'pending'
   - created_at: now()
5. Worker sees request in "Received" section
6. Worker clicks "Accept"
7. Status changes to 'accepted'
8. Request appears in History → Accepted for both users
9. Now both can message each other
```

---

### **TAB 2: HISTORY**

#### **Section 1: Accepted**
Shows all requests that were accepted.

**Each Request Card**:
- Profile photo + name
- Category + rating
- "Accepted" label (green)
- **Rate Button** (yellow, rounded-full)
  - Only shows if user hasn't rated yet
  - Click: Opens rating modal

**Rating Modal**:
- Title: "Rate this user"
- 5 star buttons (click to select 1-5 stars)
- Stars are yellow (★)
- Click star → Submits rating immediately
- Toast: "Thank you for your rating! You rated {stars} stars"
- Modal closes
- Rating saved to database
- Rate button disappears (already rated)

**Rating System Logic**:
```
1. Request accepted between User A and User B
2. Both see request in Accepted section
3. User A clicks "Rate" next to User B
4. Rating modal opens
5. User A clicks 4 stars
6. System saves rating:
   - from_user_id: A
   - to_user_id: B
   - request_id: request.id
   - rating: 4
   - comment: optional
7. User B's average rating updates
8. User A can't rate again for this request
9. User B can also rate User A (separate rating)
```

#### **Section 2: Rejected**
Shows all requests that were rejected.

**Each Request Card**:
- Profile photo + name
- Category + rating
- "Rejected" label (red)
- No action buttons
- Click: Opens profile (read-only)

**If No History**:
- Empty states for each section
- "No accepted/rejected requests"

---

## 👤 SCREEN 9: PROFILE (`/profile`)

### **What It Does**
View and edit user profile. Different sections for Job Seekers vs Employers.

### **Visual Design**
- **Header (ProfileHeader)**:
  - User name (large, bold)
  - Phone number
  - Role badge (Job Seeker / Employer)
  - Verification badge (if verified)
- **Progress Bar (ProfileProgress)**:
  - Shows profile completion percentage
  - Colorful progress bar
  - Text: "Your profile is 75% complete"

### **Tabs (2 Tabs)**

---

### **TAB 1: OVERVIEW**

#### **Common Sections (Both Roles)**

**1. Profile Photo Upload (ProfilePhotoUpload)**
- **Shows**: Current photo or placeholder with initials
- **Design**: Large circular image (128px)
- **Edit Icon**: Camera icon overlay on hover
- **Click**: Opens file picker
- **Upload Process**:
  1. User clicks photo
  2. File picker opens (accepts images only)
  3. User selects image
  4. Image uploads to Supabase Storage (profile-photos bucket)
  5. Returns photo URL
  6. Calls `updateProfile({ profilePhoto: url })`
  7. Photo updates immediately
  8. Toast: "Profile photo updated"

**2. Profile Info (EnhancedProfileInfo)**
- **Shows**:
  - Full name (editable)
  - Email (editable)
  - Location (editable) with Detect Location button
  - Bio (editable textarea)
- **Edit Mode**:
  - Click edit icon next to any field
  - Field becomes editable input
  - Type changes
  - Click save checkmark
  - Calls `updateProfile({ field: value })`
  - Toast: "Profile updated"

**Detect Location Button**:
- Icon: MapPin
- Click: Calls `getCurrentLocationArea()`
- Uses browser geolocation API
- Gets current lat/lng
- Reverse geocodes to area name
- Updates profile: `{ location: area, latitude: lat, longitude: lng }`
- Toast: "Location updated to {area}"

---

#### **Job Seeker Specific Sections**

**3. Availability & Wages (AvailabilityWages)**
- **Shows**:
  - Current availability status (Available/Busy/Offline)
  - Dropdown to change status
  - Wages for each category
  - Edit button for wages
- **Edit Wages**:
  - Click "Edit Wages"
  - Opens WagesPopup modal
  - Shows wage inputs for each category
  - User updates wages
  - Saves to database

**4. Work Categories (ProfileCategoryManager)**
- **Shows**: List of selected categories as badges
- **Maximum**: 3 categories
- **Manage Button**: "Manage Categories"
- **Click**: Navigates to `/profile-setup/category`
- **User can**:
  - Add new categories (up to 3 total)
  - Remove categories
  - Change primary category

**5. Skills (ProfileSkills)**
- **Shows**: List of skills as badges
- **Edit Mode**: Click edit icon
- **Add Skill**: Input field + Add button
- **Remove Skill**: Click X on badge
- **Save**: Updates profile with new skills list

---

#### **Employer Specific Sections**

**3. Employer Dashboard Card**
- **Shows**:
  - **Active Jobs**: Count of open job posts
  - **Completed**: Count of filled jobs
  - **Pending**: Count of applications pending review
- **Recent Job Posts**:
  - List of last 5 jobs posted
  - Job title + status
  - Click: Navigate to job details
- **Empty State**: "No job posts yet. Post a job"

---

### **TAB 2: SETTINGS**

#### **Sections**

**1. Location Settings**
- **Update Location Button**: MapPin icon
- **Click**: Detects current location
- **Edit Full Profile Button**: 
  - Opens `/profile-setup` to edit complete profile flow

**2. Profile Settings (ProfileSettings)**
- **Account Settings**:
  - Change language
  - Enable/disable notifications
  - Privacy settings
  - Dark mode toggle (if available)
- **Logout Button**:
  - Red, full width
  - Click: Confirmation dialog
  - "Are you sure you want to logout?"
  - Confirm: Calls `logout()`
  - Clears auth state
  - Navigates to `/login`
  - Toast: "Logged out successfully"

---

## 💼 SCREEN 10: POST JOB (`/post-job`)

### **What It Does**
Employers create new job postings. Two modes: Quick Post or Detailed Post.

---

### **MODE SELECTION (Initial View)**

**What It Shows**:
- **Title**: "Post a New Job"
- **Subtitle**: "Choose how you want to post"
- **Two Option Cards**:

**Option 1: Quick Post**
- Icon: Zap (lightning)
- Title: "Quick Post"
- Description: "Post a job in under 1 minute"
- Features:
  - ✓ Essential details only
  - ✓ Fastest way to hire
  - ✓ Perfect for urgent needs
- Click: Opens Quick Post flow

**Option 2: Detailed Post**
- Icon: Clipboard
- Title: "Detailed Post"
- Description: "Add full job requirements"
- Features:
  - ✓ Complete job description
  - ✓ Specific requirements
  - ✓ Better candidate matching
- Click: Opens Detailed Post flow

---

### **QUICK POST FLOW (5 Steps)**

#### **Step 1: Select Category**
- **Shows**: Grid of all categories (2-3 columns)
- **Each Card**: Icon + name
- **Selection**: Click category → blue highlight
- **Continue**: Disabled until category selected

#### **Step 2: Select Specialization**
- **Shows**: Horizontal scrolling chips of subcategories
- **Optional**: Can skip or select multiple
- **Continue**: Always enabled (subcategories optional)

#### **Step 3: Job Details**
- **Fields**:
  - **Job Title**: Input (max 40 chars)
    - Placeholder: "e.g., Mason, Driver"
  - **Description**: Textarea (max 120 chars)
    - Placeholder: "Short description"
    - Optional
  - **Daily Wage**: Number input
    - Shows ₹ symbol
    - Label: "/ day"
- **Continue**: Disabled until title + wage entered

#### **Step 4: Location**
- **Fields**:
  - **Location Input**: Text (max 60 chars)
    - Placeholder: "Enter location or area"
  - **Detect Location Button**:
    - Icon: MapPin
    - Text: "Detect My Location"
    - Click: Uses geolocation API
    - Fills location field automatically
- **Continue**: Disabled until location entered

#### **Step 5: Review & Confirm**
- **Shows**:
  - Category icon + name
  - Specialization (or "—" if none)
  - Job title
  - Description (or "(none)")
  - Daily wage: ₹500 / day
  - Location
- **Confirm Button**: "Confirm & Post"
- **Click**:
  1. Shows loading state
  2. Creates job in database:
     ```javascript
     {
       employer_id: user.id,
       category_id: formData.category_id,
       subcategories: formData.subcategories,
       title: formData.title,
       description: formData.description,
       salary_min: formData.salary_min,
       salary_period: 'daily',
       location: formData.location,
       status: 'open',
       active: true,
       urgent: false
     }
     ```
  3. Navigates to success screen

#### **Step 6: Success**
- **Shows**:
  - 🎉 emoji
  - "Job Posted Successfully!"
  - "Your job is now live"
- **Buttons**:
  - "Go to My Jobs" → /my-jobs
  - "Post Another" → Reloads page

---

### **DETAILED POST FLOW (7 Steps)**

Same as Quick Post, but adds:

**Additional Step: Requirements**
- **Shows**: List to add job requirements
- **Add Requirement Input**: 
  - Text input + Add button
  - Each requirement becomes a chip
  - Can add multiple (max 10)
  - Click X on chip to remove
- **Examples**:
  - "2+ years experience"
  - "Must have own vehicle"
  - "Available weekends"

**Additional Fields in Job Details**:
- Salary range (min and max)
- Salary period dropdown (Daily / Weekly / Monthly / Per Project)
- Job duration (1 day, 1 week, 1 month, ongoing)
- Number of workers needed

**Review Screen Shows More Details**:
- All requirements listed
- Salary range instead of single wage
- Duration and worker count

---

## 📱 BOTTOM NAVIGATION (Always Visible)

### **What It Is**
Fixed navigation bar at bottom of screen on all main pages.

### **Design**
- **Position**: Fixed bottom-0, z-50
- **Background**: White with slight blur (bg-white/95 backdrop-blur-sm)
- **Border**: Top border (border-t border-gray-200)
- **Shadow**: Subtle shadow-lg
- **Layout**: 5 icons evenly spaced

### **5 Navigation Tabs**

#### **Tab Icons & Labels (Job Seeker)**
1. **Home** (House icon)
   - Path: `/home`
   - Label: "Home"
2. **Jobs** (Search icon)
   - Path: `/search`
   - Label: "Jobs"
3. **My Jobs** (ClipboardList icon)
   - Path: `/my-jobs`
   - Label: "My Jobs"
4. **Requests** (Mail icon)
   - Path: `/requests`
   - Label: "Requests"
5. **Profile** (User icon)
   - Path: `/profile`
   - Label: "Profile"

#### **Tab Icons & Labels (Employer)**
1. **Home** (House icon)
   - Path: `/home`
   - Label: "Home"
2. **Workers** (Users icon)
   - Path: `/search`
   - Label: "Workers"
3. **My Posts** (ClipboardList icon)
   - Path: `/my-jobs`
   - Label: "My Posts"
4. **Requests** (Mail icon)
   - Path: `/requests`
   - Label: "Requests"
5. **Profile** (User icon)
   - Path: `/profile`
   - Label: "Profile"

### **Active State**
- **Background**: Dark gray-900
- **Text**: White
- **Icon**: White
- **Shadow**: shadow-md
- **Scale**: scale-105 (slightly larger)
- **Indicator**: Small white dot below label

### **Inactive State**
- **Background**: Transparent
- **Text**: Gray-600
- **Icon**: Gray-500
- **Hover**: Light gray background (hover:bg-gray-100)

### **Behavior**
- Click any tab → Navigate to that screen
- Active tab is disabled (can't click again)
- Smooth transitions between screens
- Tab state persists (stays highlighted on active page)

### **Hidden On**
- Login screen (`/login`)
- OTP verification (`/otp-verification`)
- Role selection (`/role-selection`)
- Profile setup (`/profile-setup`)

---

## 🎨 UI PATTERNS & COMPONENTS

### **1. Floating Cards (FloatingCard)**
- **What**: Elevated card with shadow and subtle animation
- **Variants**:
  - `elevated`: Slight shadow, white bg
  - `glow`: Shadow with color glow
  - `outlined`: Border instead of shadow
- **Sizes**: `sm`, `md`, `lg`
- **Usage**: Main content containers, modals

### **2. Category Icons**
- **Format**: Emoji or SVG icon
- **Size**: 2xl - 4xl depending on context
- **Container**: Circular background with gradient
- **Colors**: Different per category (blue, green, orange, etc.)

### **3. Subcategory Chips**
- **Design**: Rounded-full pills
- **States**:
  - Unselected: White bg, gray border, gray text
  - Selected: Blue bg, white text, shadow
  - Hover: Light blue bg
- **Behavior**: Toggle selection on click
- **Layout**: Flex wrap or horizontal scroll

### **4. Loading States**
- **Skeleton Loaders**: Animated gray boxes matching content shape
- **Spinners**: Rotating circle (Loader2 icon from Lucide)
- **Text**: "Loading..." with spinner

### **5. Empty States**
- **Icon**: Large emoji (3-4xl)
- **Title**: Bold, gray-900
- **Subtitle**: Gray-500, smaller
- **Action Button**: Blue gradient CTA

### **6. Toast Notifications**
- **Position**: Top-right corner
- **Types**:
  - Success: Green with checkmark
  - Error: Red with X icon
  - Info: Blue with info icon
- **Duration**: Auto-dismiss after 3-5 seconds
- **Action**: Can be dismissed by clicking X

### **7. Confirmation Dialogs**
- **Design**: Centered modal with backdrop blur
- **Header**: Title + description
- **Footer**: Cancel (outline) + Confirm (primary)
- **Variants**:
  - Destructive: Red confirm button
  - Primary: Blue confirm button

---

## 🔄 KEY USER FLOWS

### **Flow 1: New User Onboarding**
```
1. Open app → Language Selection
2. Select language → Login Screen
3. Enter phone → OTP sent
4. Enter OTP → Verified
5. Choose Role (Job Seeker or Employer)
6. Enter Name
7. Select Categories (& subcategories)
8. Set Wages (Job Seeker only)
9. Profile Complete → Home Screen
```

### **Flow 2: Job Seeker Finding & Applying for Jobs**
```
1. Home → Click "Find Jobs"
2. See all categories
3. Click "Construction"
4. See construction jobs
5. Filter by "Mason" subcategory
6. See only mason jobs
7. Apply filters (distance, rating, salary)
8. Click on job card
9. View job details
10. Click "Apply"
11. Application submitted
12. Toast: "Application sent!"
13. Job moves to "My Applications"
```

### **Flow 3: Employer Posting Job**
```
1. Home → Click "Post New Job"
2. Choose "Quick Post"
3. Select "Construction" category
4. Select "Mason" specialization
5. Enter job title: "Need Mason"
6. Enter wage: ₹600/day
7. Detect location → Auto-filled
8. Review details
9. Click "Confirm & Post"
10. Job created
11. Success screen
12. Go to My Jobs → See new job
```

### **Flow 4: Request System**
```
EMPLOYER PERSPECTIVE:
1. Search workers → Find perfect mason
2. Click "Request" button on worker card
3. Request sent
4. Wait for worker response

WORKER PERSPECTIVE:
1. Notification: "New request from ABC Construction"
2. Go to Requests page
3. See request in "Received" section
4. View employer profile
5. Click "Accept"
6. Request moves to "Accepted" history
7. Can now message employer
8. After job done → Rate employer

BOTH:
9. View request in History → Accepted
10. Click "Rate" button
11. Select 5 stars
12. Rating submitted
13. Average rating updates on profile
```

### **Flow 5: Availability Management**
```
1. Job Seeker on Home
2. Current status: Available (green)
3. Click status card
4. Dropdown opens
5. Select "Busy" 
6. Status updates in database
7. Profile hidden from new searches
8. Existing conversations still work
9. Employers see "This worker is currently busy"
10. Change back to "Available" when ready
11. Profile visible in searches again
```

---

## 💡 ADVANCED FEATURES

### **1. Real-Time Location**
- Uses browser Geolocation API
- Gets lat/lng coordinates
- Reverse geocodes to human-readable address
- Calculates distance between users
- Shows "2.5 km away" on cards
- Updates when user moves (if permission granted)

### **2. Multi-Language Support**
- 12 languages supported
- All text runs through translation function: `t(key, fallback, params)`
- Stored in LocalizationContext
- RTL support for Arabic/Urdu
- Language saved to localStorage
- Can switch language anytime in settings

### **3. Role Switching**
- DynamicRoleSwitcher component
- Toggle between Job Seeker ↔ Employer
- Preserves profile data for both roles
- Separate categories/wages for each role
- UI changes based on active role
- Bottom nav labels change

### **4. Image Upload**
- Supabase Storage integration
- Bucket: `profile-photos`
- File size limit: 5MB
- Formats: JPG, PNG, WebP
- Auto-resize for optimization
- Returns public URL
- Stored in user profile

### **5. Offline Support**
- Service worker caching
- Offline indicator shows when no connection
- Cached pages work offline
- Data syncs when back online
- Queue actions for later sync

---

## 🎯 KEY BUSINESS LOGIC

### **Matching Algorithm**
Jobs/Workers shown based on:
1. **Category Match**: Primary filter
2. **Subcategory Match**: Secondary filter  
3. **Distance**: Within selected radius
4. **Availability**: Available workers shown first
5. **Rating**: Higher rated shown first
6. **Recency**: Newer listings shown first
7. **Wage Match**: Within expected range

### **Request System Rules**
- Can send unlimited requests
- Can't send duplicate request to same person
- Accepted requests enable messaging
- Rejected requests can't be resent (for 7 days)
- Both parties can rate after acceptance
- Ratings are one-per-request (can't change)

### **Profile Completion**
Required fields:
- ✅ Name
- ✅ Phone (verified)
- ✅ Role
- ✅ At least 1 category
- ✅ Location

Optional fields:
- Profile photo
- Email
- Bio
- Skills
- Wages (recommended for job seekers)

### **Search & Filter Logic**
Filters applied in order:
1. Role filter (Job Seeker sees jobs, Employer sees workers)
2. Category filter (selected category only)
3. Subcategory filter (if selected)
4. Location filter (distance radius)
5. Search query (keyword match)
6. Advanced filters (rating, price, availability)
7. Sort (distance, rating, or date)

---

## 📝 DATA FLOW SUMMARY

### **Authentication Flow**
```
Firebase Phone Auth
→ OTP Verification
→ User ID created
→ Profile created in Supabase
→ Session stored in AuthContext
→ Protected routes accessible
```

### **Profile Update Flow**
```
User changes field
→ updateProfile({ field: value })
→ Supabase update query
→ Local state updates
→ UI re-renders
→ Toast notification
```

### **Job Application Flow**
```
User clicks Apply
→ applyToJob(jobId, employerId)
→ Creates application record
→ Updates job application count
→ Sends notification to employer
→ Shows in My Applications
→ Toast confirmation
```

### **Request Flow**
```
User sends request
→ Creates request record (status: pending)
→ Notification to recipient
→ Shows in "Sent by Me"
→ Recipient sees in "Received"
→ Recipient accepts/rejects
→ Status updates
→ Shows in History
→ Can now message (if accepted)
```

---

## 🔒 SECURITY & PERMISSIONS

### **Row Level Security (RLS)**
- Profiles: Users can only edit their own
- Jobs: Only employer can edit their jobs
- Applications: Only applicant and employer can view
- Requests: Only sender and receiver can view
- Messages: Only conversation participants can view
- Ratings: Anyone can view, only participants can create

### **Data Validation**
- Phone: Must be exactly 10 digits
- OTP: Must be 6 digits
- Name: Max 50 characters
- Job Title: Max 40 characters
- Description: Max 120-500 characters (depends on context)
- Wages: Must be positive number
- Categories: Max 3 per user

---

## 🎨 DESIGN TOKENS

### **Colors**
- Primary: Blue-600
- Secondary: Indigo-600
- Success: Green-600
- Warning: Yellow-500
- Error: Red-600
- Gray scale: Gray-50 to Gray-900

### **Spacing**
- xs: 0.25rem (4px)
- sm: 0.5rem (8px)
- md: 1rem (16px)
- lg: 1.5rem (24px)
- xl: 2rem (32px)

### **Border Radius**
- sm: 0.375rem
- md: 0.5rem
- lg: 0.75rem
- xl: 1rem
- 2xl: 1.5rem
- 3xl: 2rem
- full: 9999px (circular)

### **Shadows**
- sm: subtle
- md: medium
- lg: large
- xl: extra large (cards)
- 2xl: very large (modals)

---

## 📊 PERFORMANCE OPTIMIZATIONS

### **Lazy Loading**
- Images load only when in viewport
- Components code-split by route
- Heavy components (modals) loaded on demand

### **Caching**
- API responses cached for 5 minutes
- Images cached in browser
- Static assets cached indefinitely

### **Debouncing**
- Search input debounced (500ms)
- Filter changes debounced (300ms)
- Auto-save debounced (1000ms)

### **Pagination**
- Jobs: Load 20 at a time
- Workers: Load 20 at a time
- Messages: Load 50 at a time
- Infinite scroll for more

---

## 🐛 ERROR HANDLING

### **Network Errors**
- Shows offline indicator
- Retry button
- Queues actions for later
- Toast notification

### **Validation Errors**
- Inline field errors (red text below input)
- Form-level errors (banner at top)
- Toast for general errors

### **Permission Errors**
- Location permission denied → Shows manual input
- Camera permission denied → Shows file picker
- Notification permission → Shows in-app notifications only

---

## 🎯 SUCCESS METRICS

### **For Job Seekers**
- Time to first application: < 5 minutes from signup
- Application success rate: Track accept/reject ratio
- Profile views: How many employers viewed profile
- Average rating: Rating from employers

### **For Employers**
- Time to first hire: < 24 hours from posting
- Application quality: Rating of applicants
- Job fill rate: % of jobs successfully filled
- Re-post rate: Do they come back to post more jobs?

---

## END OF DOCUMENTATION

This documentation covers every screen, feature, interaction, transition, and logic flow in the Fyke Connect app. Use this as reference for development, design, testing, and onboarding new team members.

**Document Version**: 1.0
**Last Updated**: 2025-10-19
**Maintained By**: Fyke Development Team
