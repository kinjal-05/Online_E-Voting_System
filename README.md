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

```plaintext
Online-E-Voting-System/
│── client/                # React.js frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── .env
│── server/                # Node.js backend
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API routes
│   ├── controllers/       # Business logic
│   ├── middleware/        # JWT, Authentication, ML Integration
│   ├── config/            # Database & Stripe configuration
│   ├── server.js
│   ├── .env
│── .gitignore
│── README.md
```

## 🛠 <span style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 1.5em;">Setup & Installation</span>

### 🔹 <span style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 1.3em;">Prerequisites</span>

- <span style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Node.js (v16+)</span>
- <span style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">MongoDB (Local/Atlas)</span>
- <span style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Python (For ML Models - Optional)</span>
- <span style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Stripe API Key (For Payments)</span>

### 🔹 <span style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 1.3em;">Installation Steps</span>

### 1️⃣ <span style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 1.1em;">Clone the Repository</span>

```bash
git clone https://github.com/kinjal-05/Online_E-Voting_System.git
cd Online_E-Voting_System
```
### 2️⃣ <span style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 1.1em;">Setup Backend</span>
```bash
cd server
npm install # Install dependencies
```
### <span style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Create a </span><code style="font-family: 'Courier New', Courier, monospace;">.env</code><span style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;"> file in the </span><code style="font-family: 'Courier New', Courier, monospace;">server/</code><span style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;"> directory:</span>
```bash
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
STRIPE_SECRET_KEY=your_stripe_key
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```
### 3️⃣ <span style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 1.1em;">Setup Frontend</span>
```bash
cd client
npm install # Install dependencies
```
### <span style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Create a </span><code style="font-family: 'Courier New', Courier, monospace;">.env</code><span style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;"> file in the </span><code style="font-family: 'Courier New', Courier, monospace;">client/</code><span style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;"> directory:</span>
```bash
REACT_APP_API_URL=http://localhost:5000
REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_public_key
```
```bash
npm start
```
