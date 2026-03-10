# Issues & Fixes Log

## Issue 1: Lost Hamburger Menu Button
**Reported by:** John
**Date:** 2026-03-10

### Problem
The hamburger menu button (☰) disappeared from the mobile navigation.

### Root Cause
The hamburger button was set to `display: none` by default and only shown inside a `@media` query for screens under 768px. However, the mobile state wasn't being properly triggered or the CSS wasn't applying correctly.

### Fix
Changed `Header.css` to make the hamburger button visible by default (not just in mobile media query):

```css
/* BEFORE */
.hamburger-btn {
  display: none;
  ...
}

/* AFTER */
.hamburger-btn {
  display: flex;
  ...
}
```

The button is now always visible and toggles the mobile menu.

---

## Issue 2: Game Name Update
**Reported by:** John
**Date:** 2026-03-10

### Problem
The game was still called "DiamondChain" but John wanted to rename it to "SimForge Baseball".

### Fix
Updated the name in 4 places:

1. **public/index.html** - Page title and meta description
   ```html
   <title>DiamondChain</title> → <title>SimForge Baseball</title>
   ```

2. **src/components/Header.tsx** - Logo text in header
   ```tsx
   DIAMONDCHAIN → SIMFORGE BASEBALL
   ```

3. **src/pages/AuthPage.tsx** - 2FA QR code issuer
   ```tsx
   otpauth://totp/DiamondChain → otpauth://totp/SimForge
   ```

4. **public/index.html** - Meta description
   ```html
   DiamondChain - Build your dynasty → SimForge Baseball - Build your dynasty
   ```

---

## Issue 3: Contract Offers Wrong Position
**Reported by:** John
**Date:** 2026-03-10

### Problem
John created a **Catcher** but all 5 contract offers said they were for a **CF (Center Field)**. The offers weren't matching the player's actual position.

### Root Cause
The `generateContractOffers()` function in `src/services/localStorage.ts` was generating generic scout reports that didn't consider the player's position. It wasn't passing or using the position information.

### Fix
1. Updated the `StoredContractOffer` interface to include `playerPosition`
2. Modified `generateContractOffers()` to accept a `position` parameter
3. Added position-specific scout reports:
   ```typescript
   const positionReports: Record<string, string[]> = {
     'P': ['Looking for a pitcher to anchor our rotation.', ...],
     'C': ['We need a catcher to lead our defense.', ...],
     '1B': ['Looking for power at first base.', ...],
     '2B': ['Need a versatile second baseman.', ...],
     '3B': ['Hot corner specialist needed.', ...],
     'SS': ['Elite shortstop to anchor our infield.', ...],
     'LF': ['Corner outfield power needed.', ...],
     'CF': ['Center field coverage is a priority.', ...],
     'RF': ['Right field arm strength is key.', ...],
     'DH': ['Designated hitter spot available.', ...]
   };
   ```
4. Now when a catcher creates a player, they get offers like "We need a catcher to lead our defense" instead of generic CF offers.

---

## Deployment Notes

After each fix, run:
```bash
npm run build && npm run deploy
```

The site deploys to: **https://valettavamps.github.io/baseball-game/**
