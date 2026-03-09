# 🧪 Testing Guide - Complete User Flow

## Full Journey Test

### 1. Authentication (New User)

**Desktop:**
1. Open app → See AuthPage
2. Click "Sign Up"
3. Enter:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
   - Confirm password: `password123`
4. Click "Create Account"
5. See QR code for Google Authenticator
6. Use authenticator app (or skip with mock code: `123456`)
7. Enter 6-digit code
8. Click "Verify & Continue"
9. ✅ Should see main app with empty banner

**Mobile:**
- Same flow
- Form should be single-column
- QR code scales properly
- Buttons are touch-friendly (44px+)

---

### 2. Create Player

**Desktop:**
1. Click "⭐ Create Player" in sidebar
2. **Step 1:** Enter name
   - First: `Mike`
   - Last: `Trout`
   - Click "Next"

3. **Step 2:** Choose position
   - Click "Center Field" card
   - Click "Next"

4. **Step 3:** Distribute attributes
   - Adjust sliders (50 points total)
   - Power: 65
   - Contact: 70
   - Speed: 80
   - Watch overall rating update
   - Click "Next"

5. **Step 4:** Physical
   - Height: 6'2" (slider)
   - Weight: 210 lbs
   - Age: 22
   - Throws: Right
   - Bats: Right
   - Click "Review & Create"

6. **Step 5:** Review
   - See summary
   - Click "Create Player 🎉"

7. **Success Screen:**
   - ✅ See celebration icon
   - ✅ See PlayerCard with **FLASHING alert**
   - ✅ Alert should say "You have 5 pending contract offers!"
   - ✅ "View Offers" button should pulse/bounce
   - Click "View Offers →"

**Mobile:**
- All steps should work smoothly
- Single-column layouts
- Sliders should be touch-friendly
- Bottom nav visible at all times

---

### 3. View & Accept Contract Offers

**Desktop:**
1. Should navigate to "My Offers" page
2. See 5 contract offers in grid
3. Cards show:
   - Team name
   - Tier badge (🥉 Bronze, etc.)
   - Salary (50-80K DERBY)
   - Contract length
   - Expiration timer
4. Click "Review Offer" on any card
5. Modal opens with:
   - Full contract details
   - Performance bonuses
   - Scouting report
6. Click "Sign Contract ✍️"
7. See celebration screen
8. Shows signed contract details

**Mobile:**
- Offers stack in single column
- Modal is full-screen friendly
- All buttons easy to tap

---

### 4. Mobile Navigation Test

**Critical Mobile Tests:**

1. **Bottom Nav Bar:**
   - ✅ Should appear at bottom of screen
   - ✅ Should show icons + labels
   - ✅ Scroll horizontally if needed
   - ✅ Active page highlighted
   - ✅ 44px+ tap targets

2. **Content Spacing:**
   - ✅ No overlap with bottom nav
   - ✅ Can scroll to bottom of page
   - ✅ Proper padding on all sides

3. **Responsive Layouts:**
   - ✅ Single-column on phone
   - ✅ Tier tabs scroll horizontally
   - ✅ Tables adapt to narrow screens
   - ✅ Forms stack properly

---

## Expected Behavior Checklist

### Authentication
- [ ] Sign up form validates password match
- [ ] 2FA QR code displays
- [ ] 6-digit code input works
- [ ] Sign in after sign up works
- [ ] Sign out works
- [ ] Returns to auth page on sign out

### Player Creation
- [ ] All 5 steps navigate properly
- [ ] Name validation works
- [ ] 10 positions selectable
- [ ] Attribute points calculate correctly (50 max)
- [ ] Overall rating updates in real-time
- [ ] Physical sliders work smoothly
- [ ] Back button works at each step
- [ ] Can't proceed without required fields

### Contract Alerts (CRITICAL)
- [ ] **Alert appears** on PlayerCard after creation
- [ ] **Border pulses** (gold ↔ red animation)
- [ ] **Mail icon bounces** (📬)
- [ ] **Shine effect** sweeps across card
- [ ] **"View Offers" button pulses**
- [ ] Shows "5 pending contracts"
- [ ] Click navigates to My Offers page

### Contract Offers
- [ ] 5 offers display
- [ ] Each shows tier, salary, duration
- [ ] Expiration timers work
- [ ] Modal opens on "Review Offer"
- [ ] Can accept or reject
- [ ] Signed screen appears
- [ ] Other offers auto-reject

### Mobile Layout
- [ ] **Bottom nav visible** on mobile
- [ ] All pages accessible from bottom nav
- [ ] Content doesn't overlap nav
- [ ] Can scroll to see everything
- [ ] Touch targets are 44px minimum
- [ ] Tier tabs scroll horizontally
- [ ] Forms are single-column
- [ ] Modals are full-screen friendly

---

## Known Issues to Check

### Mobile
- [ ] Bottom nav might hide on scroll (should be fixed position)
- [ ] Content might be cut off (check padding-bottom)
- [ ] Sidebar might not show (should be visible as bottom bar)

### Player Card
- [ ] Alert might not show (check component rendering)
- [ ] Animations might not play (check CSS keyframes)
- [ ] Button might not navigate (check onNavigate prop)

### Auth
- [ ] 2FA QR might not generate (using placeholder service)
- [ ] Mock verification should accept any 6-digit code

---

## Testing on Different Devices

### Desktop (1920x1080)
- Two-column layouts should work
- Sidebar on left
- All spacing generous

### Tablet (768x1024)
- Should adapt to narrower width
- Some grids go single-column
- Sidebar still on left or switch to bottom

### Phone (375x667 - iPhone SE)
- Everything single-column
- Bottom nav bar
- Touch-friendly
- No horizontal scroll

### Phone (360x740 - Android)
- Same as iPhone
- Extra small buttons still tappable

---

## Quick Test Commands

```bash
# Desktop test
npm start
# Open http://localhost:3000

# Mobile test (use Chrome DevTools)
1. Open Chrome DevTools (F12)
2. Click device toolbar (Ctrl+Shift+M)
3. Select "iPhone SE" or "Pixel 5"
4. Test all flows
```

---

## What Should Work Now

✅ Email/password sign up  
✅ Google Authenticator 2FA  
✅ Sign in/out  
✅ Create player (5 steps)  
✅ Player card with FLASHING contract alert  
✅ View contract offers  
✅ Sign contracts  
✅ Mobile bottom navigation  
✅ Proper spacing on all devices  
✅ Touch-friendly controls  

---

## What's Still Mock Data

⚠️ Authentication (uses mock, no real backend)  
⚠️ 2FA verification (accepts any code)  
⚠️ Player storage (not saved to DB)  
⚠️ Contract offers (randomly generated)  
⚠️ Wallet connection (mock address)  

**Next:** Backend API + database + real Solana integration

---

## Vercel Deployment

After pushing to GitHub:
1. Vercel auto-deploys
2. Check build log for errors
3. Test on live URL
4. Share URL for testing

**Expected build time:** 2-3 minutes  
**Expected result:** ✅ Successful deployment

---

**Last Updated:** 2026-03-09 18:28 UTC  
**Status:** Ready for comprehensive testing  
**Priority:** Verify mobile layout + contract alerts working

🦞⚾📱
