

import React, { useState } from "react";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

// ImageUpload Component to handle image uploading
const ImageUpload = ({ label, field, onChange, currentSrc }) => (
  <div className="space-y-4">
    <label className="text-gray-300">{label}</label>
    <input
      type="file"
      accept="image/*"
      onChange={(e) => onChange(field, e.target.files[0])}
      className="w-full border border-gray-700 p-2 rounded-md bg-gray-700 text-white"
    />
    {currentSrc && (
      <div>
        <img src={currentSrc} alt={`${label} Preview`} className="w-32 h-32 object-contain" />
      </div>
    )}
  </div>
);

const AdminAboutSection = ({ initialContent = {} }) => {
  const [aboutContent, setAboutContent] = useState({
    welcomeLine: initialContent.welcomeLine || "",
    logo: { src: initialContent.logo?.src || null },  // Set to null instead of an empty string
    heroImg: { src: initialContent.heroImg?.src || null },
    AjImg: { src: initialContent.AjImg?.src || null },
    socialMediaMarquee: {
      links: initialContent.socialMediaMarquee?.links || [
        { label: "Facebook", href: "", icon: FaFacebookF },
        { label: "Instagram", href: "", icon: FaInstagram },
        { label: "Twitter", href: "", icon: FaTwitter },
        { label: "YouTube", href: FaYoutube },
      ],
    },
    sections: initialContent.sections || [
      {
        title: "Section 1 Title",
        blockquote: "",
        founder: "",
        description: "",
      },
      {
        title: "Section 2 Title",
        subtitle: "",
        bio: "",
        blockquote: "",
      },
    ],
  });

  const handleInputChange = (field, value) => {
    setAboutContent((prevContent) => ({
      ...prevContent,
      [field]: value,
    }));
  };

  const handleSectionChange = (index, field, value) => {
    setAboutContent((prevState) => {
      const updatedSections = [...prevState.sections];
      updatedSections[index] = { ...updatedSections[index], [field]: value };
      return {
        ...prevState,
        sections: updatedSections,
      };
    });
  };

  const handleSocialMediaChange = (index, field, value) => {
    setAboutContent((prevState) => {
      const updatedLinks = [...prevState.socialMediaMarquee.links];
      updatedLinks[index] = { ...updatedLinks[index], [field]: value };
      return {
        ...prevState,
        socialMediaMarquee: { links: updatedLinks },
      };
    });
  };


  const uploadImageToCloudinary = async (file) => {
    const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dq6dotbrs/upload";  // Replace with your Cloudinary URL
    const CLOUDINARY_UPLOAD_PRESET = "lavish_cluster";  // Replace with your Cloudinary preset
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  
    try {
      const response = await axios.post(CLOUDINARY_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      // Cloudinary response will contain the URL of the uploaded image
      console.log("Image URL: ", response.data.secure_url)
      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      throw new Error("Image upload failed");
    }
  };


  
  const handleImageChange = async (field, file) => {
    try {
      // Upload image to Cloudinary
      const imageUrl = await uploadImageToCloudinary(file);
      
      // Update the state with the new image URL
      setAboutContent((prevState) => ({
        ...prevState,
        [field]: { src: imageUrl }
      }));
    } catch (error) {
      console.error("Error handling image change:", error);
      // Optionally show error to user
    }
  };

  const saveContentData = async () => {
    try {
      // 1. Upload image and get URL
      console.log(aboutContent)
      if (aboutContent.logo.src) {
        const imageUrl = await uploadImageToCloudinary(aboutContent.logo.src); // Function to upload image and get URL
        setAboutContent((prevContent) => ({
          ...prevContent,
          logo: { ...prevContent.logo, src: imageUrl }, // Update the logo URL in the state
        }));
      }
      if (aboutContent.heroImg.src) {
        const imageUrl = await uploadImageToCloudinary(aboutContent.heroImg.src); // Function to upload image and get URL
        setAboutContent((prevContent) => ({
          ...prevContent,
          heroImg: { ...prevContent.heroImg, src: imageUrl }, 
        }));
      }

      if (aboutContent.AjImg.src) {
        const imageUrl = await uploadImageToCloudinary(aboutContent.AjImg.src); // Function to upload image and get URL
        setAboutContent((prevContent) => ({
          ...prevContent,
          AjImg: { ...prevContent.AjImg, src: imageUrl }, 
        }));
      }
      console.log(aboutContent)
      const parsedData = JSON.parse(JSON.stringify(aboutContent));
      const docRef = doc(db, "content", "aboutContent");
    await setDoc(docRef, parsedData); // Save the updated state (with image URLs) to Firestore

    alert("Content saved successfully!");
  } catch (error) {
    console.error("Error saving data:", error.message);
    alert("Failed to save content. Please try again.");
  }
};


  return (
    <div className="m-8 p-8 border-2 border-white rounded-md">
      <div className="imageInputs my-8 space-y-3">

      <div className="space-y-4">
        <label className="text-gray-300">Welcome Line</label>
        <input
          type="text"
          value={aboutContent.welcomeLine}
          onChange={(e) => handleInputChange("welcomeLine", e.target.value)}
          className="w-full border border-gray-700 p-2 rounded-md bg-gray-700 text-white"
        />
      </div>
        {/* Image Inputs */}
        <ImageUpload
          label="Logo Image"
          field="logo"
          onChange={handleImageChange}
          currentSrc={aboutContent.logo.src}
        />
        <ImageUpload
          label="Hero Image"
          field="heroImg"
          onChange={handleImageChange}
          currentSrc={aboutContent.heroImg.src}
        />
        <ImageUpload
          label="Aj Image"
          field="AjImg"
          onChange={handleImageChange}
          currentSrc={aboutContent.AjImg.src}
        />

      </div>

      {/* Social Media Links */}
      {aboutContent.socialMediaMarquee.links.map((link, index) => (
        <div key={index} className="space-y-4 my-8">
          <input
            type="text"
            value={link.href}
            placeholder="Social Media URL"
            onChange={(e) => handleSocialMediaChange(index, "href", e.target.value)}
            className="w-full border border-gray-700 p-2 rounded-md bg-gray-700 text-white"
          />
          <input
            type="text"
            value={link.label}
            placeholder="Social Media Label"
            onChange={(e) => handleSocialMediaChange(index, "label", e.target.value)}
            className="w-full border border-gray-700 p-2 rounded-md bg-gray-700 text-white"
          />
        </div>
      ))}

      {/* Section Inputs */}
      {aboutContent.sections.map((section, index) => (
        <div key={index} className="space-y-4 my-8">
          <input
            type="text"
            placeholder="Section Title"
            value={section.title}
            onChange={(e) => handleSectionChange(index, "title", e.target.value)}
            className="w-full border border-gray-700 p-2 rounded-md bg-gray-700 text-white"
          />
          <input
            type="text"
            placeholder="Section Subtitle"
            value={section.subtitle}
            onChange={(e) => handleSectionChange(index, "subtitle", e.target.value)}
            className="w-full border border-gray-700 p-2 rounded-md bg-gray-700 text-white"
          />
          <textarea
            placeholder="Section Description"
            value={section.description}
            onChange={(e) => handleSectionChange(index, "description", e.target.value)}
            className="w-full border border-gray-700 p-2 rounded-md bg-gray-700 text-white"
          />
          <textarea
            placeholder="Section Blockquote"
            value={section.blockquote}
            onChange={(e) => handleSectionChange(index, "blockquote", e.target.value)}
            className="w-full border border-gray-700 p-2 rounded-md bg-gray-700 text-white"
          />
        </div>
      ))}

      {/* Save Button */}
      <button
        onClick={saveContentData}
        className="mt-4 px-6 py-2 rounded-md bg-blue-500 text-white"
      >
        Save Changes
      </button>
    </div>
  );
};

export default AdminAboutSection;
