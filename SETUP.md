# CampusConnect Admin Panel — Firebase setup

This package adds a separate admin console (`admin.html`) and live Firestore reads in the student website (`index.html`). It is not live until you connect your own Firebase project and deploy these files together on the same website/domain.

## One-time setup (about 15–25 minutes)
1. Open https://console.firebase.google.com/ and create a Firebase project.
2. In Project settings → Your apps, create a Web app and copy its config into `firebase-config.js` (replace every `PASTE_...` placeholder).
3. In Authentication → Sign-in method, enable **Email/Password**. In Users, add your own admin email and a strong password. Do not use the old demo login shown inside the student prototype.
4. In Firestore Database, create a database. Open Rules and paste the contents of `firestore.rules`. Replace `your-admin-email@example.com` in the rules with the same email used for the admin account. Also update `ADMIN_EMAILS` in `firebase-config.js`. Publish the rules.
5. Deploy the whole `CampusConnect_BBDU_v10` folder to a static web host (Firebase Hosting, Netlify, or Vercel). Do not open the files via `file://`; Firebase modules require HTTP/HTTPS. Keep `index.html`, `admin.html`, `admin.js`, `cloud.js`, `firebase-config.js`, `firestore.rules`, and `assets/` together.
6. Open the deployed student site `index.html` once, then open `admin.html` on the same domain and sign in with the Firebase admin account. Click **Initialize / import starter data** once to publish the current starter records from that browser's local storage. Confirm that records appear in the console.
7. Open the student website in another tab/device. Changes made in the admin console to notices, events, complaints, lost & found, faculty, emergency contacts and map locations should appear live.

## Admin URL
If hosted at `https://your-domain.example/`, the panel is `https://your-domain.example/admin.html`. Do not share this URL as a substitute for authentication; the Firebase sign-in and Firestore rules protect writes.

## Important security notes
- Firestore rules in this starter allow public reads of portal content and admin-only writes. This is appropriate only for content intended to be public. **Complaints may contain private student details**; before accepting real complaints, change rules and the student-facing complaint workflow so complaint records are private to authorized staff/the submitting student. This starter admin panel is a management console for complaint records already stored in Firestore; it does not yet create a secure student complaint submission flow.
- Never put passwords, Aadhaar numbers, bank account details, or other sensitive personal data in public collections.
- The client-side email allowlist is only a UI guard; Firestore Rules are the actual write-security boundary. Keep the rule email list in sync.
- If you change the Firestore rules, test with the Firebase Rules Playground before launch.
- Existing embedded demo admin in the student page is a browser-only prototype. Use `admin.html` for authenticated admin changes. Remove/disable the old demo workspace before a public production launch.

## What you can manage
Notices, events, complaints/status, lost & found, faculty/coordinator entries, emergency contacts, and map locations. Add/edit/delete operations update Firestore; the student page subscribes to the shared collections in real time.

## Version 14 additions
- First screen asks the visitor to choose Student Panel or Admin Panel. Student profile details are saved in the browser and are not university-verified.
- Campus Helpdesk is a floating assistant panel. It uses a local FAQ/keyword response system; it is not a generative AI model or a live human support channel.
- Student complaints and Lost & Found submissions are stored locally immediately. For shared, cross-device live updates, configure Firebase, enable **Anonymous** sign-in under Authentication, publish the supplied `firestore.rules`, and initialize starter data through the admin console.
- Student submissions are publicly readable by the portal as requested. Avoid sensitive details in complaint text. Lost & Found records can be updated by the anonymous Firebase account that created them; admin accounts can manage all records.
- Attendance links to https://mybbd.in/login. This site does not collect BBD passwords.
- The four Google Classroom links are supplied links; access still depends on the signed-in Google account and classroom membership.
