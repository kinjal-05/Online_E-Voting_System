import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./RegisterVoter.css";

const RegisterVoter = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    district: "",
    state: "",
    profile: {
      address: "",
      phoneNumber: "",
    },
    faceDetection: 0,
    aadhaarDetection: 0,
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [selectedAadhaar, setSelectedAadhaar] = useState(null);
  const [aadhaarPreview, setAadhaarPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (currentUser) {
      setUser(currentUser);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name.includes("profile.") ? "profile" : name]: name.includes("profile.")
        ? { ...prevData.profile, [name.split(".")[1]]: value }
        : value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleAadhaarChange = (event) => {
    const file = event.target.files[0];
    setSelectedAadhaar(file);
    setAadhaarPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a photo first!");
      return;
    }

    const uploadData = new FormData();
    uploadData.append("", selectedFile);

    try {
      const response = await axios.post("http://127.0.0.1:8000/detect", uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.detections.length === 1) {
        setFormData((prevData) => ({ ...prevData, faceDetection: 1 }));
        alert("Face detection successful!");
      } else {
        alert("Please upload an image with a single face.");
        setFormData((prevData) => ({ ...prevData, faceDetection: 0 }));
      }
    } catch (error) {
      console.error("Photo upload failed:", error);
      alert("Failed to process the photo.");
    }
  };

  const handleAadhaarUpload = async () => {
    if (!selectedAadhaar) {
      alert("Please select an Aadhaar image first!");
      return;
    }

    const uploadData = new FormData();
    uploadData.append("", selectedAadhaar);
    uploadData.append("userId", user._id);

    try {
      const response = await axios.post("https://adhaarcard-detection-1.onrender.com/extract-aadhaar", uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.status === "exists") {
        alert("This Aadhaar ID is already registered.");
        setFormData((prevData) => ({ ...prevData, aadhaarDetection: 0 }));
      } else if (response.data.status === "success") {
        setFormData((prevData) => ({ ...prevData, aadhaarDetection: 1 }));
        alert("Aadhaar verified successfully!");
      } else {
        alert("Aadhaar verification failed. Please try again.");
        setFormData((prevData) => ({ ...prevData, aadhaarDetection: 0 }));
      }
    } catch (error) {
      console.error("Aadhaar upload failed:", error);
      alert("Failed to process the Aadhaar image.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.faceDetection !== 1 || formData.aadhaarDetection !== 1) {
      alert("Face and Aadhaar verification are required before registration.");
      return;
    }

    setLoading(true);
    try {
      await axios.post("https://voteguard-backend.onrender.com/api/voters/voter/register", {
        userId: user?._id,
        ...formData,
      });
      alert("Voter registered successfully!");
      navigate("/voter-dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Error registering voter.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="full-page-wrapper">
    <div className="register-container">
      <h2 className="register-title">Register as a Voter</h2>
      {user && (
        <form onSubmit={handleSubmit} className="register-form">
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            placeholder="Enter your first name"
          />

          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            placeholder="Enter your last name"
          />

          <label>Date of Birth:</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
          />

          <label>District:</label>
          <input
            type="text"
            name="district"
            value={formData.district}
            onChange={handleChange}
            required
            placeholder="Enter your district"
          />

          <label>State:</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
            placeholder="Enter your state"
          />

          <label>Address:</label>
          <input
            type="text"
            name="profile.address"
            value={formData.profile.address}
            onChange={handleChange}
            required
            placeholder="Enter your address"
          />

          <label>Phone Number:</label>
          <input
            type="tel"
            name="profile.phoneNumber"
            value={formData.profile.phoneNumber}
            onChange={handleChange}
            required
            placeholder="Enter your phone number"
          />

          <label>Upload Your Photo:</label>
          <input type="file" accept="image/*" onChange={handleFileChange} required />
          <button type="button" onClick={handleUpload}>Upload</button>
          {preview && <img src={preview} alt="Preview" className="image-preview" />}

          <label>Upload Aadhaar:</label>
          <input type="file" accept="image/*" onChange={handleAadhaarChange} required />
          <button type="button" onClick={handleAadhaarUpload}>Upload Aadhaar</button>
          {aadhaarPreview && <img src={aadhaarPreview} alt="Preview" className="image-preview" />}

          <button type="submit" disabled={loading}>{loading ? "Registering..." : "Register as Voter"}</button>
        </form>
      )}
    </div>
    </div>
  );
};

export default RegisterVoter;
