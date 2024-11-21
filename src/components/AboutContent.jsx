import React, { useState } from "react";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../src/lib/firebase"; // Adjust the path based on your project structure
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

const AdminAboutSection = ({ initialContent = {} }) => {
  const [aboutContent, setAboutContent] = useState({
    welcomeLine: initialContent.welcomeLine || "",
    logo: { src: initialContent.logo?.src || "" },
    heroImg: { src: initialContent.heroImg?.src || "" },
    AjImg: { src: initialContent.AjImg?.src || "" },
    socialMediaMarquee: {
      links: initialContent.socialMediaMarquee?.links || [
        { label: "Facebook", href: "", icon: FaFacebookF },
        { label: "Instagram", href: "", icon: FaInstagram },
        { label: "Twitter", href: "", icon: FaTwitter },
        { label: "YouTube", href: "", icon: FaYoutube },
      ],
    },
    sections: initialContent.sections || [
      {
        title: "Section 1 Title",
        subtitle: "",
        founder: "",
        description: "",
        blockquote: "",
        buttonText: "",
      },
      {
        title: "Section 2 Title",
        founder: "",
        subtitle: "",
        quote: "",
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
    setAboutContent((prevContent) => {
      const updatedSections = [...prevContent.sections];
      updatedSections[index] = { ...updatedSections[index], [field]: value };
      return { ...prevContent, sections: updatedSections };
    });
  };

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "your_upload_preset"); // Replace with your Cloudinary upload preset
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/your_cloud_name/image/upload`,
      formData
    );
    return response.data.secure_url;
  };

  const handleImageChange = async (field, file) => {
    const url = await uploadImageToCloudinary(file);
    setAboutContent((prevContent) => ({
      ...prevContent,
      [field]: { src: url, file },
    }));
  };

  const handleSocialMediaLinkChange = (index, field, value) => {
    setAboutContent((prev) => {
      const updatedLinks = [...prev.socialMediaMarquee.links];
      updatedLinks[index] = { ...updatedLinks[index], [field]: value };

      return {
        ...prev,
        socialMediaMarquee: {
          ...prev.socialMediaMarquee,
          links: updatedLinks,
        },
      };
    });
  };

  const saveChanges = async () => {
    try {
      const logoUrl = aboutContent.logo.file
        ? await uploadImageToCloudinary(aboutContent.logo.file)
        : aboutContent.logo.src;
      const heroImgUrl = aboutContent.heroImg.file
        ? await uploadImageToCloudinary(aboutContent.heroImg.file)
        : aboutContent.heroImg.src;
      const AjImgUrl = aboutContent.AjImg.file
        ? await uploadImageToCloudinary(aboutContent.AjImg.file)
        : aboutContent.AjImg.src;

      const contentToSave = {
        ...aboutContent,
        logo: { src: logoUrl },
        heroImg: { src: heroImgUrl },
        AjImg: { src: AjImgUrl },
      };

      const docRef = doc(db, "content", "aboutSection");
      await setDoc(docRef, contentToSave);

      alert("About section content saved successfully!");
    } catch (error) {
      console.error("Error uploading document:", error);
      alert("Failed to save content. Please try again.");
    }
  };

  return (
    <div className="p-6 bg-black min-h-screen flex flex-col gap-8">
      <div className="bg-black border-2 border-white p-6 rounded-md shadow-md w-[80%] mx-auto space-y-6">
        <h2 className="text-3xl font-semibold text-white">Edit About Section</h2>

        <div className="space-y-4">
          <label className="text-gray-300">Welcome Line</label>
          <input
            type="text"
            className="w-full border border-gray-700 p-2 rounded-md bg-gray-700 text-white"
            value={aboutContent.welcomeLine || ""}
            onChange={(e) => handleInputChange("welcomeLine", e.target.value)}
          />
        </div>

        {/* Logo Upload */}
        <div className="space-y-4">
          <label className="text-gray-300">Logo Image</label>
          <input
            type="file"
            onChange={(e) => handleImageChange("logo", e.target.files[0])}
            className="w-full border border-gray-700 p-2 rounded-md bg-gray-700 text-white"
          />
          {aboutContent.logo.src && (
            <img
              src={aboutContent.logo.src}
              alt="Logo Preview"
              width={100}
              height={100}
              className="rounded-lg"
            />
          )}
        </div>

        {aboutContent.sections.map((section, index) => (
          <div key={index} className="space-y-4 border-t border-gray-700 pt-4">
            <h3 className="text-lg font-semibold text-gray-300">Section {index + 1}</h3>
            <label className="text-gray-400">Title</label>
            <input
              type="text"
              className="w-full border border-gray-700 p-2 rounded-md bg-gray-700 text-white"
              value={section.title || ""}
              onChange={(e) => handleSectionChange(index, "title", e.target.value)}
            />
          </div>
        ))}

        <button
          onClick={saveChanges}
          className="w-full bg-black text-white py-2 rounded-md mt-4 hover:bg-gray-700 transition"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default AdminAboutSection;
