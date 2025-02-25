  import React from "react";
  import { Routes, Route } from "react-router-dom"; 
  import { AuthProvider } from "./context/AuthContext"; 
  import Dashboard from "./components/Dashboard"; 
  import Login from "./components/Login"; 
  import Register from "./components/Register"; 
  import { BrowserRouter as Router } from "react-router-dom";
  import CandidatePanel from "./components/CandidatePanel";
  import RegisterCandidate from "./components/RegisterCandidate";
  import EditCandidateProfile from "./components/EditCandidateProfile";
  import AddEvent from "./components/AddEvent"; 
  import CandidatePosts from "./components/CandidatePosts";
  import CandidateEvents from './components/CandidateEvents';
  import AdminDashboard from "./components/AdminDashboard";
  import AddElection from "./components/AddElection";
  import AllElections from "./components/AllElections";
  import UpdateElection from "./components/UpdateElection";
  import ManageCandidates from "./components/ManageCandidates"; 
  import VoterDashboard from "./components/VoterDashboard";
  import RegisterVoter from "./components/RegisterVoter"; 
  import UpdateProfile from "./components/UpdateProfile";
  import ViewProfile from "./components/ViewProfile";
  import AdminVoterManagement from "./components/AdminVoterManagement";
  import ElectionPage from "./components/ElectionPage";
  import ShowAllElections from './components/ShowAllElections'; 
  import ElectionCandidatesPage from "./components/ElectionCandidatesPage";
  import DeclareResults from "./components/DeclareResults";
  import ViewResults from "./components/ViewResults ";
  import ForCandidate from "./components/ForCandidate";
  import ForVoter from "./components/ForVoter";
  import ForAdmin from "./components/ForAdmin";
  import UpdateEvent from "./components/UpdateEvent";
  import ViewCandidateProfile from "./components/ViewCandidateProfile";
  import ManageSupportTeam from "./components/ManageSupportTeam";
  import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe("YOUR_STRIPE_KEY"); 
  const App = () => {
    return (
      <Router> 
        <AuthProvider> 
          <Routes>
            <Route path="/" element={<Dashboard />} /> 
            <Route path="/dashboard" element={<Dashboard />} /> 
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/edit-candidate-profile" element={<EditCandidateProfile />} />
            <Route path="/candidate-panel" element={<CandidatePanel />} />
            <Route
          path="/register-candidate"
          element={
            <Elements stripe={stripePromise}>
              <RegisterCandidate />
            </Elements>
          }
        />
            <Route path="/candidate-posts" element={<AddEvent />} />
            <Route path="/candidate-posts" element={<CandidatePosts />} />
            <Route path="/candidate-events" element={<CandidateEvents />} />
            <Route path="/admin-panel" element={<AdminDashboard />} />
            <Route path="/add-election" element={<AddElection />} />
            <Route path="/all-elections" element={<AllElections />} />
            <Route path="/update-election/:electionId" element={<UpdateElection />} />
            <Route path="/manage-candidates" element={<ManageCandidates />} />
            <Route path="/voter-dashboard" element={<VoterDashboard />} />
            <Route path="/register-voter" element={<RegisterVoter />} />
            <Route path="/update-profile" element={<UpdateProfile />} />
            <Route path="/profile" element={<ViewProfile />} />
            <Route path="/manage-voters" element={<AdminVoterManagement />} />
            <Route path="/election" element={<ElectionPage />} /> 
            <Route path="/elections" element={<ShowAllElections />} />
            <Route path="/election-candidates/:electionId" element={<ElectionCandidatesPage />} />
            <Route path="/declare-results" element={<DeclareResults />} />
            <Route path="/view-results" element={<ViewResults />} />
            <Route path="/view-resultscandidate" element={<ForCandidate />} />
            <Route path="/view-resultsvoter" element={<ForVoter />} />
            <Route path="/view-resultsadmin" element={<ForAdmin />} />
            <Route path="/update-event/:eventId" element={<UpdateEvent />} />
            <Route path="/view-candidate-profile" element={<ViewCandidateProfile />} />
            <Route path="/manage-support" element={<ManageSupportTeam />} />
          </Routes>
        </AuthProvider>
      </Router>
    );
  };

  export default App;
