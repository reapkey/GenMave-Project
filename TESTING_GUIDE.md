# Testing & Validation Guide for GenMave

## Overview
This document provides a comprehensive testing checklist for the GenMave platform. Follow these steps to ensure all features work correctly before deployment.

---

## 1. User Flow Testing

### 1.1 Complete User Journey (Happy Path)

**Test Flow:**
1. ✅ Visit landing page (http://localhost:5174/)
2. ✅ Click "Mulai Sekarang" → Redirects to /signup
3. ✅ Sign up with new account (email + password)
4. ✅ Auto-redirect to /dashboard after signup
5. ✅ Navigate to /psikotes
6. ✅ Complete all 15 questions
7. ✅ Submit psikotes → Redirect to /compass
8. ✅ View Personal Compass with clarity score
9. ✅ Navigate to /dashboard → See widgets populated
10. ✅ Navigate to /journal → Write new entry
11. ✅ Auto-save triggers after 30 seconds
12. ✅ Navigate to /skills → Browse skills
13. ✅ Start a 7-day challenge
14. ✅ Complete Day 1 with reflection
15. ✅ Navigate to /profile → View stats
16. ✅ Logout → Redirects to landing page

**Expected Results:**
- No console errors
- All data persists correctly in Supabase
- Smooth transitions between pages
- Loading states display properly

---

### 1.2 Authentication Flow

**Sign Up Testing:**
```
Test Cases:
1. Valid email + password (min 8 chars) → Success
2. Invalid email format → Error: "Email tidak valid"
3. Password < 8 chars → Error: "Password minimal 8 karakter"
4. Duplicate email → Error: "Email sudah terdaftar"
5. Already logged in → Redirect to /dashboard
```

**Login Testing:**
```
Test Cases:
1. Correct credentials → Success + redirect to /dashboard
2. Wrong password → Error: "Password salah"
3. Non-existent email → Error: "User tidak ditemukan"
4. Empty fields → Error: "Field tidak boleh kosong"
5. Already logged in → Redirect to /dashboard
```

**Session Persistence:**
```
Test Cases:
1. Refresh page while logged in → Stay logged in
2. Close browser and reopen → Session persists
3. Logout → Session cleared, redirect to landing
4. Try accessing /dashboard after logout → Redirect to /login
```

---

### 1.3 Psikotes Assessment

**Test Checklist:**
- [ ] All 15 questions display correctly
- [ ] Progress bar updates on each answer
- [ ] Cannot proceed without answering (validation works)
- [ ] Back button works correctly
- [ ] Multiple choice questions (single selection)
- [ ] Checkbox questions (multiple selection)
- [ ] Scale questions (1-5 slider)
- [ ] localStorage backup works (refresh mid-test, data persists)
- [ ] Submit redirects to /compass
- [ ] Data saves to `psikotes_results` table
- [ ] Clarity score calculated correctly (0-100 range)

**Score Calculation Verification:**
```javascript
// Test scenarios:
1. Q3 = "Hampir tiap hari" → Score should decrease by 20
2. Q4 = 5 (very self-aware) → Score should increase by 20
3. Q5 = Multiple "hilang" factors → Score decreases by 3 per factor
4. Final score should be between 0-100
```

---

### 1.4 Personal Compass

**Test Checklist:**
- [ ] Clarity score displays correctly (matches psikotes)
- [ ] Circular progress renders with correct percentage
- [ ] Color changes based on score (red < 40, amber 40-60, green > 60)
- [ ] Personal narrative text displays
- [ ] Energy pattern shows correct value
- [ ] Learning style shows correct value
- [ ] Recommended skills list displays (array)
- [ ] Growth edges list displays (array)
- [ ] "Retake Psikotes" button works
- [ ] Query param ?id=[compass_id] loads specific compass

**Data Verification:**
- Check `compass_data` table in Supabase
- Verify `psikotes_result_id` foreign key is set
- Confirm `recommended_skills` JSONB array is valid

---

### 1.5 Dashboard

**Test Checklist:**
- [ ] Clarity Score widget loads latest compass data
- [ ] Trend indicator shows (if multiple compass results)
- [ ] Reflection prompt card displays random prompt
- [ ] "Tulis di Journal" pre-fills prompt in journal
- [ ] Journal Streak calculates correctly
  - 0 days: "Mulai streak hari ini!"
  - 1-2 days: "Bagus! Keep going 🔥"
  - 3-6 days: "Streak kamu on fire! 🔥🔥"
  - 7+ days: "Amazing! X hari berturut-turut! 🔥🔥🔥"
- [ ] Skill Progress card shows active challenge (if any)
- [ ] Quick actions buttons navigate correctly
- [ ] Navigation menu highlights active page
- [ ] Desktop: Sidebar navigation displays
- [ ] Mobile: Bottom navigation displays

**Streak Calculation Test:**
```
Scenario 1: User journals today → Streak continues
Scenario 2: User journals yesterday but not today → Streak at risk
Scenario 3: User missed yesterday → Streak resets to 0
Scenario 4: User journals multiple times same day → Count as 1 day
```

---

### 1.6 Journal System

**Write Tab Testing:**
- [ ] Date and time auto-fill correctly (Indonesian format)
- [ ] Textarea accepts input
- [ ] Character counter updates in real-time
- [ ] Character limit enforced (2000 max)
- [ ] Auto-save triggers after 30 seconds of no typing
- [ ] Auto-save indicator updates ("Menyimpan..." → "Tersimpan")
- [ ] Manual save button works
- [ ] Success toast shows on manual save
- [ ] Unsaved changes warning on navigation attempt
- [ ] Browser confirmation dialog shows if dirty state
- [ ] Batal button clears textarea with confirmation
- [ ] Privacy notice displays at top

**Past Entries Tab Testing:**
- [ ] Entries display in reverse chronological order (newest first)
- [ ] Each entry shows date, preview (100 chars), and button
- [ ] "Baca Selengkapnya" opens modal with full content
- [ ] Edit button loads entry into Write tab
- [ ] Editing updates existing entry (UPDATE not INSERT)
- [ ] Delete button shows confirmation modal
- [ ] Delete removes entry from database
- [ ] Empty state displays if 0 entries
- [ ] "Mulai Menulis" button switches to Write tab

**RLS Policy Verification:**
```sql
-- Test in Supabase SQL Editor:
-- 1. User can only see their own entries
SELECT * FROM journal_entries WHERE user_id = auth.uid();

-- 2. User cannot see other users' entries
SELECT * FROM journal_entries WHERE user_id != auth.uid(); -- Should return 0 rows

-- 3. User can only delete their own entries
DELETE FROM journal_entries WHERE id = '[other_user_entry_id]'; -- Should fail
```

---

### 1.7 Skill Pathway

**Skills Library Testing:**
- [ ] All 3 skills display (UI/UX, Web Dev, Content Writing)
- [ ] Each skill card shows icon, name, description
- [ ] "7 days" and "Beginner" labels display
- [ ] Active challenge banner shows if user has one
- [ ] "Start Challenge" button works
- [ ] Confirmation modal shows if switching challenges
- [ ] Cannot start new challenge if one is active (button disabled)
- [ ] Completed skills show "Completed" badge
- [ ] "Retake Challenge" button works for completed skills

**7-Day Challenge Testing:**
- [ ] Challenge header shows skill name and icon
- [ ] Progress bar displays correct percentage
- [ ] Day X of 7 counter is accurate
- [ ] Day cards render in order (1-7)
- [ ] Current day is unlocked and highlighted
- [ ] Future days are locked (gray, not clickable)
- [ ] Past days remain accessible
- [ ] Completed days show ✓ icon
- [ ] Task description displays on card expansion
- [ ] Resources list displays (if any)
- [ ] Reflection prompt displays
- [ ] Reflection textarea accepts input
- [ ] "Tandai Selesai" requires reflection text
- [ ] Completing day unlocks next day
- [ ] Reflection saves to database (JSONB format)
- [ ] Day 7 completion triggers celebration modal
- [ ] Survey options display correctly
- [ ] Survey response saves and marks challenge complete
- [ ] Auto-redirect to /skills after survey (2s delay)
- [ ] "Keluar Challenge" shows confirmation
- [ ] Quitting sets status to 'abandoned'

**Data Verification:**
```javascript
// Check skill_progress table:
{
  user_id: UUID,
  skill_id: "uiux-design",
  current_day: 3,
  completed_days: [1, 2, 3],
  reflections: {
    day1: "This is my reflection...",
    day2: "Another reflection...",
    day3: "Today I learned..."
  },
  status: "active", // or "completed", "abandoned"
  survey_response: null // or "love-it", "like-it", "not-for-me"
}
```

---

### 1.8 Profile Page

**Personal Info Card Testing:**
- [ ] Avatar color generates from email hash
- [ ] First letter of email displays in avatar
- [ ] Email displays correctly
- [ ] "Member since" date formats correctly (Indonesian)

**Stats Card Testing:**
- [ ] Psikotes Taken count is accurate
- [ ] Journal Entries count is accurate
- [ ] Skills Explored count (distinct skill_id)
- [ ] Days Active count (distinct dates from journal_entries)

**Compass History Testing:**
- [ ] All past compass results display
- [ ] Sorted newest first
- [ ] Each shows clarity score and date
- [ ] "Lihat" button navigates to /compass?id=[id]
- [ ] Empty state shows if no compass results
- [ ] "Retake Psikotes" button works

**Settings Testing:**
- [ ] Email Notifications toggle works
- [ ] Reflection Reminders toggle works
- [ ] Settings persist to `user_settings` table
- [ ] "Ubah Password" opens modal
- [ ] Password change form validates:
  - Min 8 characters
  - Confirm password matches
- [ ] Password update succeeds via Supabase Auth
- [ ] "Hapus Akun" opens confirmation modal
- [ ] Checkbox required to enable delete button
- [ ] Delete account signs out and redirects
- [ ] Data cascade deletes (all user data removed)

**Support Links Testing:**
- [ ] "Help Center" navigates to /help
- [ ] "Contact Support" opens email client (mailto:)

---

### 1.9 Admin Dashboard

**Access Control Testing:**
- [ ] Admin route protected (only admin users can access)
- [ ] Non-admin users redirect to /dashboard
- [ ] Admin role check works (if implemented)

**Metrics Testing:**
- [ ] Total Users count is accurate
- [ ] New Users (date range) count is accurate
- [ ] Active Users (date range) count is accurate
- [ ] Psikotes Completion Rate calculates correctly
- [ ] Average Clarity Score calculates correctly
- [ ] Total Journal Entries count is accurate
- [ ] Average Entries/User calculates correctly

**Charts Testing:**
- [ ] User Growth line chart renders
- [ ] Skills Breakdown bar chart renders
- [ ] Tooltips display on hover
- [ ] Data updates when date range changes

**Controls Testing:**
- [ ] Date range dropdown works (7/30/90/365 days)
- [ ] Refresh button re-fetches data
- [ ] Export buttons show coming soon message (or work if implemented)

---

## 2. Supabase Database Validation

### 2.1 Schema Verification

**Run in Supabase SQL Editor:**
```sql
-- Check all tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Expected tables:
-- psikotes_results
-- compass_data
-- journal_entries
-- skill_progress
-- reflection_prompts
-- user_settings
```

**Verify Foreign Keys:**
```sql
-- Check FK constraints
SELECT
  tc.table_name, 
  kcu.column_name, 
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY';

-- Verify CASCADE DELETE is set
```

---

### 2.2 RLS Policies Testing

**Test Each Policy:**

1. **psikotes_results:**
```sql
-- User can view own results
SELECT * FROM psikotes_results WHERE user_id = auth.uid(); -- Should work

-- User cannot view others' results
SELECT * FROM psikotes_results WHERE user_id != auth.uid(); -- Should return 0
```

2. **compass_data:**
```sql
-- User can view own compass
SELECT * FROM compass_data WHERE user_id = auth.uid(); -- Should work

-- User cannot view others' compass
SELECT * FROM compass_data WHERE user_id != auth.uid(); -- Should return 0
```

3. **journal_entries:**
```sql
-- User can view own entries
SELECT * FROM journal_entries WHERE user_id = auth.uid(); -- Should work

-- User can insert own entries
INSERT INTO journal_entries (user_id, content) VALUES (auth.uid(), 'Test'); -- Should work

-- User can update own entries
UPDATE journal_entries SET content = 'Updated' WHERE user_id = auth.uid(); -- Should work

-- User can delete own entries
DELETE FROM journal_entries WHERE user_id = auth.uid(); -- Should work

-- User cannot access others' entries
SELECT * FROM journal_entries WHERE user_id != auth.uid(); -- Should return 0
```

4. **skill_progress:**
```sql
-- Similar tests for skill_progress table
-- Verify users can only access their own progress
```

---

### 2.3 Seed Data Verification

**Check reflection_prompts:**
```sql
SELECT COUNT(*) FROM reflection_prompts; -- Should return 33

SELECT * FROM reflection_prompts ORDER BY RANDOM() LIMIT 1; -- Test random selection
```

---

## 3. Accessibility Testing (WCAG AA)

### 3.1 Keyboard Navigation
- [ ] All interactive elements focusable via Tab key
- [ ] Focus indicators visible (outline or ring)
- [ ] Logical tab order (top to bottom, left to right)
- [ ] Enter/Space triggers buttons and links
- [ ] Escape closes modals
- [ ] No keyboard traps

### 3.2 Screen Reader Testing
- [ ] All images have alt text (or are decorative)
- [ ] Form inputs have associated labels
- [ ] Buttons have descriptive text or aria-label
- [ ] Headings in logical order (h1 → h2 → h3)
- [ ] Links have descriptive text (not "click here")
- [ ] Loading states announced
- [ ] Error messages announced

### 3.3 Color Contrast
Use browser DevTools or online tools to check:
- [ ] Text on background: minimum 4.5:1 ratio
- [ ] Large text (18pt+): minimum 3:1 ratio
- [ ] Primary color (#81B29A) on white: Check contrast
- [ ] Secondary color (#E07A5F) on white: Check contrast
- [ ] Error messages visible to colorblind users

### 3.4 Responsive Text
- [ ] Text scales with browser zoom (up to 200%)
- [ ] No horizontal scrolling at 200% zoom
- [ ] Line height sufficient for readability (1.5x minimum)

---

## 4. Cross-Browser Testing

### 4.1 Desktop Browsers
Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest) - if on Mac
- [ ] Edge (latest)

**Test Checklist per Browser:**
- [ ] All pages load correctly
- [ ] CSS renders properly (Tailwind)
- [ ] JavaScript executes (no console errors)
- [ ] Form submissions work
- [ ] Auto-save functionality works
- [ ] Charts render (Recharts)
- [ ] Modal overlays display correctly
- [ ] Animations smooth (transitions, progress bars)

### 4.2 Mobile Browsers
Test on:
- [ ] Chrome Mobile (Android)
- [ ] Safari (iOS)
- [ ] Firefox Mobile

**Mobile-Specific Tests:**
- [ ] Touch interactions work (tap, swipe)
- [ ] Bottom navigation displays correctly
- [ ] Modals don't exceed screen height
- [ ] Forms usable on small screens
- [ ] Text readable without zoom
- [ ] No horizontal overflow

---

## 5. Responsive Design Testing

### 5.1 Breakpoints
Test at these viewport widths:
- [ ] 320px (Mobile S)
- [ ] 375px (Mobile M)
- [ ] 425px (Mobile L)
- [ ] 768px (Tablet)
- [ ] 1024px (Laptop)
- [ ] 1440px (Desktop)

### 5.2 Layout Checks
For each breakpoint:
- [ ] Navigation adapts (sidebar ↔ bottom bar)
- [ ] Grid layouts stack appropriately
- [ ] Cards maintain readability
- [ ] Buttons accessible (not too small)
- [ ] Forms usable (inputs not too narrow)
- [ ] Modals fit within viewport
- [ ] Images scale correctly (not distorted)

---

## 6. Performance Testing

### 6.1 Lighthouse Audit
Run in Chrome DevTools → Lighthouse:

**Target Scores:**
- [ ] Performance: ≥ 80
- [ ] Accessibility: ≥ 90
- [ ] Best Practices: ≥ 90
- [ ] SEO: ≥ 80

**Common Issues to Fix:**
- Lazy load images
- Minify CSS/JS (Vite does this in production)
- Optimize images (compress, use WebP)
- Enable caching headers
- Remove unused code

### 6.2 Page Load Times
Test with slow 3G throttling:
- [ ] Landing page loads < 3s
- [ ] Dashboard loads < 2s after auth
- [ ] Psikotes loads < 2s
- [ ] Journal entries load < 2s

### 6.3 Bundle Size
Check production build:
```bash
npm run build

# Check dist/assets folder
ls -lh dist/assets

# Target: Main JS bundle < 500KB gzipped
```

---

## 7. Security Testing

### 7.1 Authentication Security
- [ ] Passwords hashed (Supabase handles this)
- [ ] JWT tokens expire correctly
- [ ] Session timeout works
- [ ] Cannot access protected routes while logged out
- [ ] Cannot access other users' data

### 7.2 Data Validation
- [ ] SQL injection prevented (Supabase sanitizes)
- [ ] XSS prevented (React escapes by default)
- [ ] Form inputs validated (client + server)
- [ ] File uploads disabled (not implemented)

### 7.3 RLS Policy Testing
- [ ] Users can only read their own data
- [ ] Users can only write their own data
- [ ] Admin users have appropriate elevated permissions
- [ ] Cascade deletes work correctly

---

## 8. Error Handling

### 8.1 Network Errors
Simulate offline mode:
- [ ] Friendly error messages display
- [ ] Auto-save fails gracefully (journal)
- [ ] Retry mechanism works (if implemented)
- [ ] Data cached in localStorage (if applicable)

### 8.2 User Input Errors
- [ ] Empty form submissions show validation errors
- [ ] Invalid email format caught
- [ ] Short passwords rejected
- [ ] Character limits enforced
- [ ] Error messages clear and actionable

### 8.3 Edge Cases
- [ ] User deletes account → All data removed
- [ ] User has 0 journal entries → Empty state shows
- [ ] User has 0 compass results → Empty state shows
- [ ] User quits challenge mid-way → Progress saved
- [ ] User refreshes during psikotes → Progress restored

---

## 9. Final Pre-Deployment Checklist

Before deploying to production:

### Code Quality
- [ ] No console.log() statements in production code
- [ ] No commented-out code blocks
- [ ] No TODO comments left unresolved
- [ ] All imports used (no unused imports)
- [ ] ESLint passes (if configured)

### Environment Variables
- [ ] .env.local contains correct Supabase keys
- [ ] .env.example provided for reference
- [ ] Supabase URL and Anon Key correct
- [ ] No hardcoded secrets in code

### Database
- [ ] All tables created in Supabase
- [ ] RLS policies enabled on all tables
- [ ] Indexes created for performance
- [ ] Seed data inserted (reflection_prompts)
- [ ] Database backup configured

### Documentation
- [ ] README.md complete with setup instructions
- [ ] DEPLOYMENT_GUIDE.md reviewed
- [ ] API documentation (if applicable)
- [ ] User guide (if applicable)

### Testing
- [ ] All user flows tested manually
- [ ] All breakpoints tested
- [ ] All browsers tested
- [ ] Accessibility audit passed
- [ ] Performance audit passed

### Deployment
- [ ] Production build succeeds (`npm run build`)
- [ ] No build warnings
- [ ] Assets optimized
- [ ] Vercel project configured
- [ ] Environment variables set in Vercel
- [ ] Custom domain configured (optional)
- [ ] SSL/HTTPS enabled

---

## 10. Post-Deployment Verification

After deploying to production:

### Smoke Tests
- [ ] Visit production URL
- [ ] Sign up with test account
- [ ] Complete one full user journey
- [ ] Check Supabase production database
- [ ] Verify no console errors in production

### Monitoring
- [ ] Set up error tracking (Sentry, LogRocket)
- [ ] Monitor Supabase usage
- [ ] Check Vercel analytics
- [ ] Set up uptime monitoring (UptimeRobot)

### User Feedback
- [ ] Share with beta testers
- [ ] Collect feedback
- [ ] Monitor support requests
- [ ] Track analytics (user behavior)

---

## Testing Notes

**When to Re-Test:**
- After any code changes
- After dependency updates
- After database schema changes
- Before each deployment
- After production incidents

**Bug Reporting Format:**
```
Title: [Component] Brief description
Steps to Reproduce:
1. Navigate to...
2. Click...
3. Observe...

Expected Result: What should happen
Actual Result: What actually happened
Browser: Chrome 120
Device: Desktop/Mobile
Screenshot: [if applicable]
```

---

## Automated Testing (Future Enhancement)

For production applications, consider adding:
- Unit tests (Jest + React Testing Library)
- Integration tests (Cypress, Playwright)
- E2E tests for critical user flows
- Continuous Integration (GitHub Actions)
- Pre-commit hooks (Husky + lint-staged)

**Test Coverage Target:** ≥ 70%

---

## Conclusion

This comprehensive testing guide ensures GenMave is production-ready. Follow each section systematically, document any issues found, and resolve them before deployment.

**Testing Status:** 
- Manual testing: In Progress
- Automated testing: Not Implemented
- Production readiness: Pending completion of checklist

**Next Steps:**
1. Complete all checklist items
2. Document any bugs found
3. Fix critical issues
4. Deploy to Vercel
5. Conduct post-deployment smoke tests
