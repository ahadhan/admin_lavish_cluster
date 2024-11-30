// import React, { useState } from "react";
// import axios from "axios";
// import { db } from "../../src/lib/firebase"; // Firebase setup
// import { doc, setDoc } from "firebase/firestore";

// const AdminHeroSection = () => {
//   const [logo, setLogo] = useState({ src: "", alt: "logo" });
//   const [heading, setHeading] = useState("Effortless Glamour in Every Cluster");
//   const [subheading, setSubheading] = useState(
//     "Premium eyelash kits for influencers, makeup artists, and professionals"
//   );
//   const [productImages, setProductImages] = useState([{ src: "" }, { src: "" }, { src: "" }]);
//   const [isSaving, setIsSaving] = useState(false);

//   const handleLogoChange = (e) =>
//     setLogo({ ...logo, src: URL.createObjectURL(e.target.files[0]), file: e.target.files[0] });

//   const handleImageChange = (index, e) => {
//     const updatedImages = [...productImages];
//     updatedImages[index] = { src: URL.createObjectURL(e.target.files[0]), file: e.target.files[0] };
//     setProductImages(updatedImages);
//   };

//   const handleHeadingChange = (e) => setHeading(e.target.value);
//   const handleSubheadingChange = (e) => setSubheading(e.target.value);

//   const uploadImageToCloudinary = async (file) => {
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", "lavish_cluster"); // Replace with your Cloudinary preset
//     const response = await axios.post(
//       `https://api.cloudinary.com/v1_1/dq6dotbrs/image/upload`,
//       formData
//     );
//     return response.data.secure_url;
//   };

//   const saveHeroSectionData = async () => {
//     setIsSaving(true);
//     try {
//       const logoUrl = logo.file ? await uploadImageToCloudinary(logo.file) : logo.src;
//       const productImageUrls = await Promise.all(
//         productImages.map((img) => (img.file ? uploadImageToCloudinary(img.file) : img.src))
//       );

//       await setDoc(doc(db, "heroSection", "content"), {
//         logo: logoUrl,
//         heading,
//         subheading,
//         productImages: productImageUrls,
//       });

//       alert("Hero section content saved successfully!");
//     } catch (error) {
//       console.error("Error saving hero section content:", error);
//       alert("Failed to save content. Please try again.");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   return (
//     <section className="p-6 bg-black text-white border-2 border-white rounded-lg max-w-5xl mx-auto">
//       <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">Edit Hero Section</h2>

//       {/* Logo Upload */}
//       <div className="mb-4">
//         <label className="block mb-2 text-sm sm:text-base">Logo:</label>
//         <input
//           type="file"
//           accept="image/*"
//           onChange={handleLogoChange}
//           className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-white"
//         />
//         {logo.src && (
//           <div className="mt-4">
//             <img
//               src={logo.src}
//               alt={logo.alt}
//               className="rounded-lg mx-auto sm:mx-0"
//               width={120}
//               height={120}
//             />
//           </div>
//         )}
//       </div>

//       {/* Heading and Subheading Fields */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
//         <div>
//           <label className="block mb-2 text-sm sm:text-base">Heading:</label>
//           <input
//             type="text"
//             value={heading}
//             onChange={handleHeadingChange}
//             className="w-full p-2 bg-gray-800 border border-gray-600 text-white rounded-lg"
//           />
//         </div>
//         <div>
//           <label className="block mb-2 text-sm sm:text-base">Subheading:</label>
//           <input
//             type="text"
//             value={subheading}
//             onChange={handleSubheadingChange}
//             className="w-full p-2 bg-gray-800 border border-gray-600 text-white rounded-lg"
//           />
//         </div>
//       </div>

//       {/* Product Images Upload */}
//       <div className="mb-4">
//         <label className="block mb-2 text-sm sm:text-base">Product Images:</label>
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//           {productImages.map((img, index) => (
//             <div key={index} className="flex flex-col items-center">
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => handleImageChange(index, e)}
//                 className="text-sm text-gray-300 file:py-1 file:px-2 file:rounded-lg file:border-0 file:font-semibold file:bg-gray-700 file:text-white"
//               />
//               {img.src && (
//                 <div className="mt-2">
//                   <img
//                     src={img.src}
//                     alt={`Product ${index + 1}`}
//                     className="rounded-lg"
//                     width={100}
//                     height={100}
//                   />
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Save Button */}
//       <button
//         onClick={saveHeroSectionData}
//         className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
//         disabled={isSaving}
//       >
//         {isSaving ? "Saving..." : "Save"}
//       </button>

//       {/* Preview */}
//       <div className="mt-8">
//         <h3 className="text-xl font-bold mb-4 text-center sm:text-left">Preview</h3>
//         <div className="text-center sm:text-left">
//           {logo.src && (
//             <img
//               src={logo.src}
//               alt={logo.alt}
//               className="rounded-lg mx-auto sm:mx-0 mb-4"
//               width={120}
//               height={120}
//             />
//           )}
//           <h1 className="text-2xl sm:text-3xl font-extrabold">{heading}</h1>
//           <p className="text-sm sm:text-lg mb-4">{subheading}</p>
//           <div className="flex flex-wrap justify-center sm:justify-start gap-4">
//             {productImages.map(
//               (img, index) =>
//                 img.src && (
//                   <img
//                     key={index}
//                     src={img.src}
//                     alt={`Product ${index + 1}`}
//                     className="rounded-lg"
//                     width={100}
//                     height={100}
//                   />
//                 )
//             )}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default AdminHeroSection;





import React, { useState } from "react";
import axios from "axios";
import { db } from "../../src/lib/firebase"; // Firebase setup
import { doc, setDoc } from "firebase/firestore";

const AdminHeroSection = () => {
  const [logo, setLogo] = useState({ src: "", alt: "logo" });
  const [heading, setHeading] = useState("Effortless Glamour in Every Cluster");
  const [subheading, setSubheading] = useState(
    "Premium eyelash kits for influencers, makeup artists, and professionals"
  );
  const [productImages, setProductImages] = useState([{ src: "" }, { src: "" }, { src: "" }]);
  const [isSaving, setIsSaving] = useState(false);

  const handleLogoChange = (e) =>
    setLogo({ ...logo, src: URL.createObjectURL(e.target.files[0]), file: e.target.files[0] });

  const handleImageChange = (index, e) => {
    const updatedImages = [...productImages];
    updatedImages[index] = { src: URL.createObjectURL(e.target.files[0]), file: e.target.files[0] };
    setProductImages(updatedImages);
  };

  const handleHeadingChange = (e) => setHeading(e.target.value);
  const handleSubheadingChange = (e) => setSubheading(e.target.value);

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

  const saveHeroSectionData = async () => {
    setIsSaving(true);
    try {
      const logoUrl = logo.file ? await uploadImageToCloudinary(logo.file) : logo.src;
      const productImageUrls = await Promise.all(
        productImages.map((img) => (img.file ? uploadImageToCloudinary(img.file) : img.src))
      );

      await setDoc(doc(db, "content", "heroSection"), {
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
    <section className="p-6 bg-black text-white border-2 border-white rounded-lg max-w-5xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">Edit Hero Section</h2>

      {/* Logo Upload */}
      <div className="mb-4">
        <label className="block mb-2 text-sm sm:text-base">Logo:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleLogoChange}
          className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-white"
        />
        {logo.src && (
          <div className="mt-4">
            <img
              src={logo.src}
              alt={logo.alt}
              className="rounded-lg mx-auto sm:mx-0"
              width={120}
              height={120}
            />
          </div>
        )}
      </div>

      {/* Heading and Subheading Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-2 text-sm sm:text-base">Heading:</label>
          <input
            type="text"
            value={heading}
            onChange={handleHeadingChange}
            className="w-full p-2 bg-gray-800 border border-gray-600 text-white rounded-lg"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm sm:text-base">Subheading:</label>
          <input
            type="text"
            value={subheading}
            onChange={handleSubheadingChange}
            className="w-full p-2 bg-gray-800 border border-gray-600 text-white rounded-lg"
          />
        </div>
      </div>

      {/* Product Images Upload */}
      <div className="mb-4">
        <label className="block mb-2 text-sm sm:text-base">Product Images:</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {productImages.map((img, index) => (
            <div key={index} className="flex flex-col items-center">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(index, e)}
                className="text-sm text-gray-300 file:py-1 file:px-2 file:rounded-lg file:border-0 file:font-semibold file:bg-gray-700 file:text-white"
              />
              {img.src && (
                <div className="mt-2">
                  <img
                    src={img.src}
                    alt={`Product ${index + 1}`}
                    className="rounded-lg"
                    width={100}
                    height={100}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={saveHeroSectionData}
        className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        disabled={isSaving}
      >
        {isSaving ? "Saving..." : "Save"}
      </button>

      {/* Preview */}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4 text-center sm:text-left">Preview</h3>
        <div className="text-center sm:text-left">
          {logo.src && (
            <img
              src={logo.src}
              alt={logo.alt}
              className="rounded-lg mx-auto sm:mx-0 mb-4"
              width={120}
              height={120}
            />
          )}
          <h1 className="text-2xl sm:text-3xl font-extrabold">{heading}</h1>
          <p className="text-sm sm:text-lg mb-4">{subheading}</p>
          <div className="flex flex-wrap justify-center sm:justify-start gap-4">
            {productImages.map(
              (img, index) =>
                img.src && (
                  <img
                    key={index}
                    src={img.src}
                    alt={`Product ${index + 1}`}
                    className="rounded-lg"
                    width={100}
                    height={100}
                  />
                )
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminHeroSection;


