# CampusConnect BBDU — Version 14

## What's new
- First-entry Student Panel / Admin Panel choice.
- Student profile setup before entering the student dashboard.
- Floating Campus Helpdesk assistant, open by default in the student experience and closable/reopenable from a corner icon.
- Student complaint registration and Lost & Found submission form.
- Lost items use red styling; Found items use green styling. Student-created Lost & Found records can be edited/marked Found from the same authenticated browser account.
- Four Google Classroom cards with the supplied course names and URLs.
- Attendance instructions and official MyBBD login link.
- Firebase anonymous authentication support for student submissions and live content snapshots; admin remains email/password authenticated.

## Important setup
See `SETUP.md`. Shared live sync needs your own Firebase configuration, enabled Email/Password and Anonymous Authentication, deployed Firestore rules, admin account allowlisting, and HTTPS hosting. Until configured, student-submitted records are stored only in that browser. The helpdesk is a local FAQ assistant, not a generative AI model. Student profile details are not university-verified.
