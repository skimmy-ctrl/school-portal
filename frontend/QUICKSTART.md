# 🚀 Quick Start Guide - Mavade School Portal

## ⚡ Get Running in 30 Seconds

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Installation & Run

```bash
# Already done! Navigate to project
cd Mavade-portal

# Install dependencies (if needed)
npm install

# Start development server
npm run dev

# Server ready at: http://localhost:5173/
```

---

## 🔑 Demo Credentials

### Try Each Role
Click "Try demo accounts" on login page or use:

| Role | Email | Password |
|------|-------|----------|
| **Student** | `student@school.com` | `password` |
| **Teacher** | `teacher@school.com` | `password` |
| **Admin** | `admin@school.com` | `password` |

---

## 📍 What to Explore

### 1. Public Pages (No Login)
- **Home** `/` - Landing page with features
- **About** `/about` - School information
- **Admissions** `/admissions` - Application process
- **Contact** `/contact` - Contact form
- **Login** `/login` - Authentication

### 2. Student Dashboard
After logging in as student, explore:
- **Dashboard** - Overview with stats
- **Courses** - Enrolled courses (6 total)
- **Assignments** - Track submissions
- **Timetable** - Weekly schedule
- **Grades** - Academic performance

### 3. Responsive Design
- Open DevTools (F12)
- Toggle device toolbar (Ctrl+Shift+M)
- Resize to see mobile responsiveness

---

## 📁 Project Structure at a Glance

```
src/
├── components/         ← Reusable UI components
├── context/           ← Global auth state
├── hooks/             ← Custom React hooks
├── pages/             ← Full pages
├── services/          ← API functions
├── types/             ← TypeScript interfaces
└── App.tsx            ← Main routing
```

---

## 🎯 Key Features

✅ **Authentication** - Login with 3 demo accounts  
✅ **Role-Based Access** - Student/Teacher/Admin  
✅ **Dashboard Layout** - Sidebar navigation  
✅ **Responsive Design** - Works on mobile/tablet/desktop  
✅ **Data Tables** - Grade and assignment lists  
✅ **Animations** - Smooth transitions  
✅ **Type-Safe** - Full TypeScript  
✅ **Production Ready** - Ready for backend integration  

---

## 🔧 Common Tasks

### Add a New Page
1. Create file: `src/pages/newpage/PageName.tsx`
2. Add route in `src/App.tsx`
3. If protected, wrap with `<ProtectedRoute>`

### Create New Component
1. Create file: `src/components/common/NewComponent.tsx`
2. Export from component
3. Import in pages

### Modify Styling
- Edit Tailwind classes in components
- Update `tailwind.config.js` for theme changes
- Global styles in `src/index.css`

### Integrate with API
1. Update `src/services/authService.ts` with real endpoints
2. Create new service files for other features
3. Replace mock data with API calls in components

---

## 🏗️ Project Structure (Detailed)

```
Mavade-portal/
│
├── src/
│   ├── components/
│   │   ├── common/              # Basic UI components
│   │   │   ├── Button.tsx       # Reusable button
│   │   │   ├── Input.tsx        # Form input
│   │   │   ├── Card.tsx         # Card container
│   │   │   ├── Table.tsx        # Data table
│   │   │   └── Badge.tsx        # Status badges
│   │   │
│   │   ├── layouts/
│   │   │   ├── AuthLayout.tsx   # Public pages layout
│   │   │   └── DashboardLayout.tsx # Admin area layout
│   │   │
│   │   ├── ProtectedRoute.tsx   # Route protection
│   │   └── forms/               # Form components
│   │
│   ├── context/
│   │   └── AuthContext.tsx      # Auth state management
│   │
│   ├── hooks/
│   │   └── useAuth.ts           # Auth hook
│   │
│   ├── pages/
│   │   ├── public/
│   │   │   ├── HomePage.tsx
│   │   │   ├── AboutPage.tsx
│   │   │   ├── AdmissionsPage.tsx
│   │   │   ├── ContactPage.tsx
│   │   │   └── LoginPage.tsx
│   │   │
│   │   └── dashboard/
│   │       ├── student/
│   │       │   ├── Dashboard.tsx
│   │       │   ├── CoursesPage.tsx
│   │       │   ├── AssignmentsPage.tsx
│   │       │   ├── TimetablePage.tsx
│   │       │   └── GradesPage.tsx
│   │       │
│   │       ├── teacher/
│   │       │   └── Dashboard.tsx
│   │       │
│   │       └── admin/
│   │           └── Dashboard.tsx
│   │
│   ├── services/
│   │   └── authService.ts       # Authentication
│   │
│   ├── types/
│   │   └── index.ts             # Type definitions
│   │
│   ├── utils/                   # Helper functions
│   ├── App.tsx                  # Main app & routing
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global styles
│
├── public/                      # Static assets
├── index.html                   # HTML template
├── package.json                 # Dependencies
├── vite.config.ts               # Vite config
├── tailwind.config.js           # Tailwind config
├── tsconfig.json                # TypeScript config
├── PROJECT_DOCUMENTATION.md     # Full documentation
├── ARCHITECTURE.md              # Architecture guide
└── README.md                    # Original README
```

---

## 🎨 Styling Guide

### Using Tailwind Classes
```jsx
// Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

// Colors (Primary blue)
<button className="bg-primary-600 hover:bg-primary-700">

// Spacing
<div className="px-4 py-2 mb-6">

// Animations
<div className="hover:shadow-lg transition-shadow">
```

### Custom Theme
Edit `tailwind.config.js`:
```js
colors: {
  primary: { 600: '#0284c7' },
  school: { light: '#f8fafc' }
}
```

---

## 🔐 Authentication Explained

### Login Flow
1. User fills email/password
2. Click "Sign In" or "Demo Account"
3. `useAuth().login(email, password)` called
4. Validates against mock users
5. Stores user in localStorage
6. Redirects to dashboard

### Protected Routes
```jsx
<ProtectedRoute allowedRoles={['student']}>
  <CoursesPage />
</ProtectedRoute>
```
- Checks: Is user logged in?
- Checks: Does user have correct role?
- Allows or redirects to login

---

## 📊 Data Structure Overview

### User
```js
{
  id: "STU001",
  name: "Alex Johnson",
  email: "student@school.com",
  role: "student",
  avatar: "https://..."
}
```

### Course
```js
{
  id: "C001",
  name: "Advanced Mathematics",
  code: "MTH-301",
  instructor: "Dr. Robert Johnson",
  credits: 4
}
```

### Assignment
```js
{
  id: "A001",
  courseId: "C001",
  title: "Calculus Problem Set 5",
  dueDate: "2024-02-05",
  submissionStatus: "pending"
}
```

---

## 🚀 Build & Deploy

### Build for Production
```bash
npm run build
npm run preview  # Test locally before deploying
```

### Deploy to Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Drag dist/ folder to Netlify
```

### Deploy to Any Server
```bash
npm run build
# Upload dist/ folder contents to server
```

---

## 🐛 Troubleshooting

### Port 5173 already in use?
```bash
# Kill the process
lsof -ti:5173 | xargs kill -9
npm run dev
```

### Components not showing?
- Check imports are correct
- Verify TypeScript has no errors
- Check browser console for errors (F12)

### Styling not applied?
- Clear Tailwind cache: delete `.next` folder
- Verify tailwind.config.js has correct content paths
- Check class names are spelled correctly

### Login not working?
- Verify email: `student@school.com`
- Verify password: `password`
- Check browser console for errors

---

## 📚 Useful Links & Docs

### Technologies
- [React Docs](https://react.dev)
- [React Router Docs](https://reactrouter.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [Vite Docs](https://vitejs.dev)
- [Framer Motion Docs](https://www.framer.com/motion)

### Related Files
- [Full Documentation](./PROJECT_DOCUMENTATION.md)
- [Architecture Guide](./ARCHITECTURE.md)
- [Type Definitions](./src/types/index.ts)

---

## ✨ Next Steps

### To Extend the App:

1. **Connect Backend**
   - Update API endpoints in `src/services/`
   - Replace mock data with real API calls

2. **Add Features**
   - New pages in `src/pages/`
   - New components in `src/components/`

3. **Enhance UI**
   - Modify Tailwind colors
   - Add custom animations
   - Create additional layouts

4. **Improve Performance**
   - Add code splitting
   - Implement lazy loading
   - Optimize images

---

## 🎓 Learning Resources

### Understanding the Codebase
1. **Start here**: Read `src/App.tsx` (main routing)
2. **Auth**: Check `src/context/AuthContext.tsx`
3. **Components**: Review `src/components/common/`
4. **Pages**: Study `src/pages/dashboard/student/Dashboard.tsx`

### Building New Features
1. Plan component structure
2. Create types in `src/types/index.ts`
3. Build component in appropriate folder
4. Add routing in `src/App.tsx`
5. Use `<ProtectedRoute>` if needed

---

## 💡 Pro Tips

✅ **Use browser DevTools** (F12) to inspect components  
✅ **Check React DevTools** extension for debugging  
✅ **Use `console.log()`** to debug issues  
✅ **Read error messages** carefully  
✅ **Test on mobile** with device toolbar  
✅ **Keep components small** and focused  
✅ **Reuse components** from `common/`  

---

## ❓ FAQ

**Q: How do I add a new dashboard page?**  
A: Create file in `src/pages/dashboard/{role}/`, add route in `App.tsx`, wrap with `ProtectedRoute`.

**Q: How do I change colors?**  
A: Edit `tailwind.config.js` colors section.

**Q: Can I use this in production?**  
A: Yes! Just add real backend API integration.

**Q: How do I deploy?**  
A: Run `npm run build` then upload `dist/` folder to hosting.

**Q: How do I add dark mode?**  
A: Enable `darkMode: 'class'` in `tailwind.config.js`.

---

## 📞 Support

For detailed documentation, see:
- [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md) - Complete reference
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System design
- Inline code comments throughout the codebase

---

**Happy Coding! 🚀**

Last Updated: January 28, 2026
