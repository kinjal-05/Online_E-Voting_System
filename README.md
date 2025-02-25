# 🗳️ Online E-Voting System (MERN Stack)

📌 **Project Overview**

The Online E-Voting System is a web-based application built using the MERN (MongoDB, Express.js, React.js, Node.js) stack. It integrates Machine Learning (ML) for voter and candidate verification via facial recognition and document validation. The system includes three main roles:

- **Admin**: Manages voters, candidates, elections, and results.
- **Candidates**: Register, post events, and participate in elections.
- **Voters**: Register, verify, and cast votes securely.

---

📑 **Features**

### 🏛️ Admin Functionalities
✅ Approve or reject voter & candidate registrations (facial/document verification via ML).
✅ Manage elections, including creation, activation, and result declaration.
✅ View voting statistics and generate reports (district/state/country-wise).
✅ Restrict event postings during elections.
✅ Verify candidate payments via Stripe.

### 🏃 Candidate Functionalities
✅ Register and complete document & facial scan verification.
✅ Pay registration fees via Stripe.
✅ Create, update, and delete campaign events (restricted during elections).
✅ Receive election results via email notification.

### 👥 Voter Functionalities
✅ Register and complete document & facial scan verification.
✅ Vote only during the election period (one vote per voter per district).
✅ View and update profile details.
✅ Receive email notifications for registration and voting actions.

### 🔗 System Integrations
✅ Facial Recognition ML API for voter and candidate verification.
✅ Document Verification ML API for document authentication.
✅ Stripe Payment Gateway for candidate registration fees.
✅ Email Notifications for user approvals, voting confirmations, and results.

---

🚀 **Tech Stack**

- **Frontend**: React.js, Redux, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ORM)
- **Machine Learning**: TensorFlow/Keras for facial recognition, OCR for document validation
- **Payment Gateway**: Stripe API
- **Authentication**: JWT-based authentication
- **Deployment**: Docker, AWS/Heroku (optional)

---

📂 **Project Structure**

