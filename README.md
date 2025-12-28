# 🏠 WorkNStay AI - TEVTA Job & Hostel Support Platform

<div align="center">

![WorkNStay AI](https://img.shields.io/badge/WorkNStay-AI%20Platform-1a7f5a?style=for-the-badge&logo=house&logoColor=white)
![Status](https://img.shields.io/badge/Status-In%20Development-blue?style=for-the-badge)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.2-7952b3?style=for-the-badge&logo=bootstrap&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**An AI-powered platform connecting TEVTA students with job opportunities and verified hostels**

[Live Demo](#) • [Documentation](#project-structure) • [Contributing](#-contributing)

</div>

---

## 📌 About The Project

WorkNStay AI is a comprehensive web platform designed specifically for TEVTA (Technical Education and Vocational Training Authority) students in Pakistan. The platform leverages AI-powered matching to connect verified students with:

- **Job Opportunities** - Matched based on skills, education, and preferences
- **Verified Hostels** - Safe, affordable accommodations near institutes

### Key Features

- ✅ **TEVTA Student Verification** - Priority access for verified students
- 🤖 **AI-Powered Matching** - Smart job & hostel recommendations
- 🏅 **Trust Score System** - Verified reviews and ratings
- 📱 **Fully Responsive** - Works on all devices
- 👨‍💼 **Multi-Role Support** - Students, Employers, Hostel Owners, Admin

---

## 🚀 Tech Stack

| Technology | Purpose |
|------------|---------|
| HTML5 | Structure & Semantics |
| CSS3 | Styling & Animations |
| JavaScript | Interactivity |
| Bootstrap 5.3 | UI Framework |
| Bootstrap Icons | Icon Library |
| Google Fonts | Typography (Inter, Poppins) |

---

## 📁 Project Structure

```
workNstay_AI/
├── css/
│   ├── style.css          # Main design system & utilities
│   ├── components.css     # Component-specific styles
│   └── animations.css     # Micro-animations library
├── js/
│   └── main.js            # Core JavaScript functionality
├── index.html             # Landing page
├── login.html             # User login
├── signup.html            # User registration with role selection
├── dashboard.html         # Student dashboard
├── jobs.html              # Job listings with filters
├── job-detail.html        # Individual job view
├── hostels.html           # Hostel listings with map view
├── hostel-detail.html     # Individual hostel view
├── admin.html             # Admin dashboard
├── about.html             # About page with team info
├── contact.html           # Contact form and FAQ
├── 404.html               # Error page
└── README.md              # This file
```

---

## 🎨 Design System

### Colors
- **Primary Green**: `#1a7f5a` - Trust & Growth
- **Secondary Blue**: `#2563eb` - Professional & Reliable
- **Background**: `#f8fafc` - Clean & Modern

### Typography
- **Headings**: Poppins (500-800)
- **Body**: Inter (300-700)

---

## 👥 Development Team

| Developer | Role | GitHub |
|-----------|------|--------|
| **Abdul Rasheed** | Lead Frontend Developer | [@Abdul-Rasheed](https://github.com/) |
| **Taimoor** | Frontend Developer | [@Taimoor](https://github.com/) |
| **Ali Raza** | Frontend Developer | [@AliRaza](https://github.com/) |
| **Imran** | Frontend Developer | [@Imran](https://github.com/) |

---

## 📋 Task Assignments

### 🟢 Abdul Rasheed (Lead - Completed Tasks)
**Status: Core Development Complete ✅**

Completed work includes:
- [x] Project setup and design system (`css/style.css`, `css/animations.css`, `css/components.css`)
- [x] Landing page with hero, features, testimonials (`index.html`)
- [x] Authentication screens (`login.html`, `signup.html`)
- [x] Student dashboard (`dashboard.html`)
- [x] Job portal screens (`jobs.html`, `job-detail.html`)
- [x] Hostel portal screens (`hostels.html`, `hostel-detail.html`)
- [x] Admin panel (`admin.html`)
- [x] Core JavaScript functionality (`js/main.js`)
- [x] About page with mission, vision, and team (`about.html`)
- [x] Contact page with form and FAQ (`contact.html`)
- [x] 404 Error page (`404.html`)

---

### 🔵 Taimoor - Employer & Job Posting Module
**Priority: HIGH | Deadline: Jan 5, 2025**

#### Assigned Tasks:
1. **Create Employer Dashboard** (`employer-dashboard.html`)
   - Company profile section
   - Posted jobs list with status
   - Applications received overview
   - Quick stats cards

2. **Build Job Posting Form** (`post-job.html`)
   - Multi-step form wizard
   - Job details (title, description, requirements)
   - Salary range selector
   - Skills/qualifications input
   - Preview before posting

3. **Create Application Management** (`manage-applications.html`)
   - Table of applicants per job
   - Filter by status (New, Reviewed, Shortlisted, Rejected)
   - View applicant profile modal
   - Quick actions (shortlist, reject, message)

#### How to Contribute:
```bash
# 1. Clone the repository
git clone https://github.com/Abdul-Rasheed-Talal/workNstay_AI.git

# 2. Create your feature branch
git checkout -b feature/employer-module

# 3. Follow the existing design patterns in css/style.css
# 4. Use the same navbar and sidebar components
# 5. Commit your changes
git commit -m "Add employer dashboard"

# 6. Push to the branch
git push origin feature/employer-module

# 7. Open a Pull Request
```

#### Design Guidelines:
- Use `.card-custom` for card components
- Use `.btn-custom.btn-primary` for primary actions
- Follow the color variables in `css/style.css`
- Add responsive styles for mobile

---

### 🟣 Ali Raza - Hostel Owner Module
**Priority: HIGH | Deadline: Jan 5, 2025**

#### Assigned Tasks:
1. **Create Hostel Owner Dashboard** (`hostel-owner-dashboard.html`)
   - Property overview cards
   - Occupancy statistics
   - Booking requests list
   - Revenue summary

2. **Build Hostel Listing Form** (`add-hostel.html`)
   - Property details input
   - Room types and pricing
   - Facilities checklist
   - Image upload section (UI only)
   - Location picker (placeholder for map)

3. **Create Booking Management** (`manage-bookings.html`)
   - Incoming booking requests
   - Approve/reject actions
   - Tenant list with room assignments
   - Payment status tracking

4. **Add Reviews Response Feature** (`hostel-reviews.html`)
   - View all reviews
   - Reply to reviews
   - Report fake reviews

#### How to Contribute:
```bash
git checkout -b feature/hostel-owner-module
# Create files following existing patterns
# Use hostel-detail.html as reference for styling
```

#### Key Components to Reuse:
- Trust score display from `hostel-detail.html`
- Rating bars from hostel reviews section
- Facility icons and tags

---

### 🟠 Imran - Profile & Settings Module
**Priority: MEDIUM | Deadline: Jan 8, 2025**

#### Assigned Tasks:
1. **Create Student Profile Page** (`profile.html`)
   - Personal information section
   - Education details (TEVTA verification badge)
   - Skills showcase with progress bars
   - Work experience timeline
   - Resume upload section

2. **Build Profile Edit Form** (`edit-profile.html`)
   - Form tabs for different sections
   - Avatar upload with preview
   - CNIC verification field
   - Social links input

3. **Create Settings Page** (`settings.html`)
   - Account settings
   - Notification preferences
   - Privacy settings
   - Password change form
   - Delete account option

4. **Add Saved/Favorites Page** (`saved-items.html`)
   - Saved jobs list
   - Favorited hostels list
   - Quick actions (remove, apply, book)

5. **Create My Applications Page** (`my-applications.html`)
   - Application status timeline
   - Filter by status
   - Withdraw application option

#### How to Contribute:
```bash
git checkout -b feature/profile-settings
# Reference dashboard.html for sidebar navigation
# Use the form styles from signup.html
```

#### UI Components to Create:
- Profile completion wizard
- Skill rating component
- Timeline component for experience

---

## 🔧 Development Setup

### Prerequisites
- VS Code or any code editor
- Live Server extension (recommended)
- Git installed

### Getting Started

```bash
# Clone the repository
git clone https://github.com/Abdul-Rasheed-Talal/workNstay_AI.git

# Navigate to project
cd workNstay_AI

# Open in VS Code
code .

# Start Live Server (Right-click index.html > Open with Live Server)
```

### Branch Naming Convention
```
feature/[feature-name]    # New features
fix/[bug-description]     # Bug fixes
style/[component-name]    # Styling updates
```

### Commit Message Format
```
type: short description

[optional body]

Examples:
feat: add employer dashboard page
fix: resolve mobile menu toggle issue
style: update button hover effects
docs: add README documentation
```

---

## 📝 Code Style Guide

### HTML
- Use semantic HTML5 elements
- Add meaningful `id` and `class` names
- Include proper meta tags

### CSS
- Use CSS variables from `:root`
- Follow BEM-like naming (e.g., `.card-custom`, `.card-header`)
- Mobile-first responsive design
- Add `fade-in` class for animated elements

### JavaScript
- Use vanilla JavaScript (no jQuery)
- Add functions to `main.js` or create new files for large modules
- Follow existing patterns like `showToast()`, `toggleFavorite()`

---

## 🧪 Testing Checklist

Before submitting a PR, verify:

- [ ] Page loads without console errors
- [ ] All links work correctly
- [ ] Responsive on mobile (375px), tablet (768px), desktop (1200px)
- [ ] Forms have proper validation
- [ ] Buttons have hover/active states
- [ ] Animations are smooth
- [ ] Colors match the design system

---

## 📊 Progress Tracker

| Phase | Status | Assignee |
|-------|--------|----------|
| Foundation & Design System | ✅ Complete | Abdul Rasheed |
| Landing Page | ✅ Complete | Abdul Rasheed |
| Authentication Screens | ✅ Complete | Abdul Rasheed |
| Student Dashboard | ✅ Complete | Abdul Rasheed |
| Job Portal | ✅ Complete | Abdul Rasheed |
| Hostel Portal | ✅ Complete | Abdul Rasheed |
| Admin Panel | ✅ Complete | Abdul Rasheed |
| Employer Module | 🔄 In Progress | Taimoor |
| Hostel Owner Module | 🔄 In Progress | Ali Raza |
| Profile & Settings | 🔄 In Progress | Imran |
| Backend Integration | ⏳ Pending | TBD |

---

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 📧 Contact

**Project Lead**: Abdul Rasheed  
**Email**: [mabdulrasheedtalal@gmail.com]

---

<div align="center">

**Built with ❤️ for TEVTA Students**

⭐ Star this repo if you find it helpful!

</div>
