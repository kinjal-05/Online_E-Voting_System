import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import "./RegisterCandidate.css";

const RegisterCandidate = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [party, setParty] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [aadhaarFile, setAadhaarFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [aadhaarPreview, setAadhaarPreview] = useState("");
  const [faceDetection, setPhotoValid] = useState(0);
  const [aadhaarDetection, setAadhaarValid] = useState(0);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) {
      setError("You must be logged in to register as a candidate.");
    } else {
      const fetchUserId = async () => {
        try {
          const response = await axios.get(`https://online-e-voting-system.onrender.com/api/users/by-email/${user.email}`);
          if (response.status === 200 && response.data) {
            setUserId(response.data._id);
          }
        } catch (err) {
          setError("Failed to fetch user information. Please try again.");
        }
      };
      fetchUserId();
    }
  }, [user]);

  if (!user) {
    return <div>Please log in to register as a candidate.</div>;
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handlePhotoUpload = async () => {
    if (!photoFile) {
      alert("Please select a photo first!");
      return;
    }

    const formData = new FormData();
    formData.append("", photoFile);

    try {
      const response = await axios.post("http://127.0.0.1:8000/detect", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.detections.length === 1) {
        setPhotoValid(1);
        alert("Face detection successful!");
      } else {
        alert("Please upload an image with a single face.");
        setPhotoValid(0);
      }
    } catch (error) {
      alert("Failed to process the photo.");
      setPhotoValid(0);
    }
  };

  const handleAadhaarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAadhaarFile(file);
      setAadhaarPreview(URL.createObjectURL(file));
    }
  };

  const handleAadhaarUpload = async () => {
    if (!aadhaarFile) {
      alert("Please select an Aadhaar image first!");
      return;
    }

    const formData = new FormData();
    formData.append("", aadhaarFile);
    formData.append("userId", userId);

    try {
      const response = await axios.post("http://127.0.0.1:8080/extract-aadhaar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.status === "exists") {
        alert("This Aadhaar ID is already registered.");
        setAadhaarValid(0);
      } else if (response.data.status === "success") {
        setAadhaarValid(1);
        alert("Aadhaar verified successfully!");
      } else {
        alert("Aadhaar verification failed. Please try again.");
        setAadhaarValid(0);
      }
    } catch (error) {
      alert("Failed to process the Aadhaar image.");
      setAadhaarValid(0);
    }
  };

  const handlePayment = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setMessage("");

    try {
      const { data } = await axios.post("https://online-e-voting-system.onrender.com/api/payment-intent", { amount: 50 });

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setMessage(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        setMessage("Payment Successful ✅");
        setPaymentSuccess(true);
      }
    } catch (error) {
      setMessage("Payment Failed ❌");
      console.error(error);
    }

    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (faceDetection !== 1) {
      setError("Face detection failed. Please upload a valid photo.");
      setLoading(false);
      return;
    }

    if (aadhaarDetection !== 1) {
      setError("Aadhaar verification failed. Please upload a valid Aadhaar image.");
      setLoading(false);
      return;
    }

    if (!paymentSuccess) {
      setError("Please complete the payment before registering.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("https://online-e-voting-system.onrender.com/api/candidates/candidates/register", {
        userId,
        firstName,
        lastName,
        party,
        district,
        state,
        faceDetection,
        aadhaarDetection,
        paymentSuccess,
      });

      if (response.status === 201) {
        navigate("/candidate-panel");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Register as a Candidate</h2>

      <form onSubmit={handleSubmit} className="register-form">
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First Name"
          required
        />
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last Name"
          required
        />
        <input
          type="text"
          value={party}
          onChange={(e) => setParty(e.target.value)}
          placeholder="Party"
        />
        <input
          type="text"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          placeholder="District"
        />
        <input
          type="text"
          value={state}
          onChange={(e) => setState(e.target.value)}
          placeholder="State"
        />

        <label>Upload Photo:</label>
        <input type="file" accept="image/*" onChange={handlePhotoChange} />
        {photoPreview && <img src={photoPreview} alt="Preview" className="image-preview" />}
        <button type="button" onClick={handlePhotoUpload}>Upload Photo</button>

        <label>Upload Aadhaar:</label>
        <input type="file" accept="image/*" onChange={handleAadhaarChange} />
        {aadhaarPreview && <img src={aadhaarPreview} alt="Preview" className="image-preview" />}
        <button type="button" onClick={handleAadhaarUpload}>Upload Aadhaar</button>

        {/* Payment Section */}
        <CardElement />
        <button type="button" onClick={handlePayment} disabled={!stripe || loading}>
          {loading ? "Processing..." : `Pay $50`}
        </button>
        {message && <p>{message}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Register"}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default RegisterCandidate;
