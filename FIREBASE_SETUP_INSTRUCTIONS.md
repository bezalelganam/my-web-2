# 🔥 Firebase Setup Instructions for yo.wanttowin.co

## ⚠️ IMPORTANT: Firebase Domain Authorization Required

Your live website is showing this error:
```
The current domain is not authorized for OAuth operations. This will prevent signInWithPopup, signInWithRedirect, linkWithPopup and linkWithRedirect from working. Add your domain (yo.wanttowin.co) to the OAuth redirect domains list in the Firebase console -> Authentication -> Settings -> Authorized domains tab.
```

## 🚀 How to Fix This:

### Step 1: Go to Firebase Console
1. Open: https://console.firebase.google.com/
2. Select your project: `website-9f7c2`

### Step 2: Add Your Domain
1. Go to **Authentication** → **Settings** → **Authorized domains** tab
2. Click **"Add domain"**
3. Add: `yo.wanttowin.co`
4. Click **"Done"**

### Step 3: Verify Domain List
Your authorized domains should include:
- `localhost` (for development)
- `yo.wanttowin.co` (your live domain)
- `website-9f7c2.firebaseapp.com` (Firebase hosting)

## 🔧 Additional Firebase Configuration

### Firestore Security Rules
Make sure your Firestore rules allow your domain:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow users to read/write their own chats
    match /chats/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow admin to read all chats and orders
    match /chats/{document=**} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    match /orders/{document=**} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## 🎯 After Adding Domain:

1. **Wait 5-10 minutes** for changes to propagate
2. **Clear browser cache** on your live site
3. **Test login/signup** functionality
4. **Test chat functionality**
5. **Test cart functionality**

## 📱 Mobile Testing:
- Test on mobile devices
- Test chat popup functionality
- Test cart operations
- Test admin panel access

## ✅ Expected Results:
- No more Firebase domain errors
- Chat button works properly
- Cart functionality works
- Admin panel shows real-time data
- All features work on mobile

## 🆘 If Issues Persist:
1. Check browser console for errors
2. Verify Firebase project ID matches
3. Check Firestore security rules
4. Ensure all Firebase services are enabled

---
**Note:** This setup is required for your live website to work properly with Firebase authentication and real-time features.
