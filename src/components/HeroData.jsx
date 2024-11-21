import React, { useState } from "react";
import axios from "axios";
import { db } from "../../src/lib/firebase"; // Firebase setup
import { doc, setDoc } from "firebase/firestore";
// import { v4 as uuidv4 } from "uuid";

const AdminHeroSection = () => {
  const [logo, setLogo] = useState({ src: "", alt: "logo" });
  const [heading, setHeading] = useState("Effortless Glamour in Every Cluster");
  const [subheading, setSubheading] = useState(
    "Premium eyelash kits for influencers, makeup artists, and professionals"
  );
  const [productImages, setProductImages] = useState([{ src: "" }, { src: "" }, { src: "" }]);
  const [isSaving, setIsSaving] = useState(false);

  // Handle changes for logo and product images
  const handleLogoChange = (e) =>
    setLogo({ ...logo, src: URL.createObjectURL(e.target.files[0]), file: e.target.files[0] });

  const handleImageChange = (index, e) => {
    const updatedImages = [...productImages];
    updatedImages[index] = { src: URL.createObjectURL(e.target.files[0]), file: e.target.files[0] };
    setProductImages(updatedImages);
  };

  // Handle heading and subheading input changes
  const handleHeadingChange = (e) => setHeading(e.target.value);
  const handleSubheadingChange = (e) => setSubheading(e.target.value);

  // Upload image to Cloudinary
  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "lavish_cluster"); // Replace with your Cloudinary preset
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/dq6dotbrs/image/upload`,
      formData
    );
    return response.data.secure_url;
  };

  // Save data to Firestore
  const saveHeroSectionData = async () => {
    setIsSaving(true);
    try {
      const logoUrl = logo.file ? await uploadImageToCloudinary(logo.file) : logo.src;
      const productImageUrls = await Promise.all(
        productImages.map((img) => (img.file ? uploadImageToCloudinary(img.file) : img.src))
      );

      await setDoc(doc(db, "heroSection", "content"), {
        logo: logoUrl,
        heading,
        subheading,
        productImages: productImageUrls,
      });

      alert("Hero section content saved successfully!");
    } catch (error) {
      console.error("Error saving hero section content:", error);
      alert("Failed to save content. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="p-6 bg-black text-white border-2 border-white rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Edit Hero Section</h2>

      {/* Logo Upload */}
      <div className="mb-4">
        <label className="block mb-2">Logo:</label>
        <input type="file" accept="image/*" onChange={handleLogoChange} />
        {logo.src && (
          <div className="mt-2">
            <img src={logo.src} alt={logo.alt} className="rounded-lg" width={100} height={100} />
          </div>
        )}
      </div>

      {/* Heading and Subheading Fields */}
      <div className="mb-4">
        <label className="block mb-2">Heading:</label>
        <input
          type="text"
          value={heading}
          onChange={handleHeadingChange}
          className="w-full p-2 bg-gray-800 border border-gray-600 text-white rounded-lg"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Subheading:</label>
        <input
          type="text"
          value={subheading}
          onChange={handleSubheadingChange}
          className="w-full p-2 bg-gray-800 border border-gray-600 text-white rounded-lg"
        />
      </div>

      {/* Product Images Upload */}
      <div className="mb-4">
        <label className="block mb-2">Product Images:</label>
        {productImages.map((img, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(index, e)}
            />
            {img.src && (
              <div className="ml-4">
                <img src={img.src} alt={`Product ${index + 1}`} className="rounded-lg" width={80} height={80} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Save Button */}
      <button
        onClick={saveHeroSectionData}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        disabled={isSaving}
      >
        {isSaving ? "Saving..." : "Save"}
      </button>

      {/* Preview */}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-2">Preview</h3>
        <div className="text-center">
          {logo.src && (
            <img
              src={logo.src}
              alt={logo.alt}
              className="mx-auto mb-4"
              width={100}
              height={100}
            />
          )}
          <h1 className="text-3xl font-extrabold">{heading}</h1>
          <p className="text-lg mb-4">{subheading}</p>
          <div className="flex justify-center gap-4">
            {productImages.map((img, index) => (
              img.src && (
                <img
                  key={index}
                  src={img.src}
                  alt={`Product ${index + 1}`}
                  className="rounded-lg"
                  width={80}
                  height={80}
                />
              )
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminHeroSection;
