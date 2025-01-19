// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { doc, getDoc, setDoc } from "firebase/firestore";
// import { db } from "../../src/lib/firebase"; // Adjust based on your Firebase setup

// const AdminBundleOptions = () => {
//   const [bundleData, setBundleData] = useState({
//     heading: "",
//     subheading: "",
//     images: { largeImage: "", smallImages: [], parallaxImages: "" },
//     listItems: [],
//     button: { text: "", href: "" },
//   });

//   const [newListItem, setNewListItem] = useState({ boldText: "", description: "" });
//   const [newSmallImage, setNewSmallImage] = useState(null);

//   // Fetch data from Firestore
//   useEffect(() => {
//     const fetchBundleData = async () => {
//       try {
//         const docRef = doc(db, "bundles", "bundleOptions");
//         const docSnap = await getDoc(docRef);

//         if (docSnap.exists()) {
//           setBundleData(docSnap.data());
//         } else {
//           console.log("No bundle data found!");
//         }
//       } catch (error) {
//         console.error("Error fetching bundle data:", error);
//       }
//     };

//     fetchBundleData();
//   }, []);

//   // Cloudinary image upload handler
//   const uploadImageToCloudinary = async (file) => {
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", "lavish_cluster"); // Replace with your Cloudinary upload preset
//     const response = await axios.post(
//       "https://api.cloudinary.com/v1_1/dq6dotbrs/image/upload",
//       formData
//     );
//     return response.data.secure_url;
//   };

//   // Save data to Firestore
//   const saveBundleData = async () => {
//     try {
//       const docRef = doc(db, "bundles", "bundleOptions");
//       await setDoc(docRef, bundleData);
//       alert("Bundle data updated successfully!");
//     } catch (error) {
//       console.error("Error saving bundle data:", error);
//       alert("Failed to save data. Please try again.");
//     }
//   };

//   // Add new list item
//   const handleAddListItem = () => {
//     setBundleData((prev) => ({
//       ...prev,
//       listItems: [...prev.listItems, newListItem],
//     }));
//     setNewListItem({ boldText: "", description: "" });
//   };

//   // Add small image to the list
//   const handleAddSmallImage = async () => {
//     if (newSmallImage) {
//       const imageUrl = await uploadImageToCloudinary(newSmallImage);
//       setBundleData((prev) => ({
//         ...prev,
//         images: {
//           ...prev.images,
//           smallImages: [...prev.images.smallImages, imageUrl],
//         },
//       }));
//       setNewSmallImage(null);
//     }
//   };

//   return (
//     <div className="p-6 bg-black min-h-screen flex flex-col gap-8">
//       <div className="bg-black border-2 border-gray-300 p-6 rounded-md shadow-md w-[80%] mx-auto space-y-6">
//         <h2 className="text-3xl font-semibold text-white">Manage Bundle Options</h2>

//         {/* Heading */}
//         <div>
//           <label className="text-gray-300">Heading</label>
//           <input
//             type="text"
//             value={bundleData.heading}
//             onChange={(e) =>
//               setBundleData((prev) => ({ ...prev, heading: e.target.value }))
//             }
//             className="w-full border border-gray-700 p-2 rounded-md bg-gray-800 text-white"
//           />
//         </div>

//         {/* Subheading */}
//         <div>
//           <label className="text-gray-300">Subheading</label>
//           <input
//             type="text"
//             value={bundleData.subheading}
//             onChange={(e) =>
//               setBundleData((prev) => ({ ...prev, subheading: e.target.value }))
//             }
//             className="w-full border border-gray-700 p-2 rounded-md bg-gray-800 text-white"
//           />
//         </div>

//         {/* Parallax Image */}
//         <div>
//           <label className="text-gray-300">Parallax Image</label>
//           <input
//             type="file"
//             onChange={async (e) => {
//               const imageUrl = await uploadImageToCloudinary(e.target.files[0]);
//               setBundleData((prev) => ({
//                 ...prev,
//                 images: { ...prev.images, parallaxImages: imageUrl },
//               }));
//             }}
//             className="w-full border border-gray-700 p-2 rounded-md bg-gray-800 text-white"
//           />
//         </div>

//         {/* Large Image */}
//         <div>
//           <label className="text-gray-300">Large Image</label>
//           <input
//             type="file"
//             onChange={async (e) => {
//               const imageUrl = await uploadImageToCloudinary(e.target.files[0]);
//               setBundleData((prev) => ({
//                 ...prev,
//                 images: { ...prev.images, largeImage: imageUrl },
//               }));
//             }}
//             className="w-full border border-gray-700 p-2 rounded-md bg-gray-800 text-white"
//           />
//         </div>

//         {/* Small Images */}
//         <div>
//           <label className="text-gray-300">Small Images</label>
//           <input
//             type="file"
//             onChange={(e) => setNewSmallImage(e.target.files[0])}
//             className="w-full border border-gray-700 p-2 rounded-md bg-gray-800 text-white"
//           />
//           <button
//             onClick={handleAddSmallImage}
//             className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
//           >
//             Add Small Image
//           </button>
//         </div>

//         {/* List Items */}
//         <div>
//           <h3 className="text-gray-300">List Items</h3>
//           <div className="flex gap-2">
//             <input
//               type="text"
//               placeholder="Bold Text"
//               value={newListItem.boldText}
//               onChange={(e) =>
//                 setNewListItem((prev) => ({ ...prev, boldText: e.target.value }))
//               }
//               className="w-1/2 border border-gray-700 p-2 rounded-md bg-gray-800 text-white"
//             />
//             <input
//               type="text"
//               placeholder="Description"
//               value={newListItem.description}
//               onChange={(e) =>
//                 setNewListItem((prev) => ({ ...prev, description: e.target.value }))
//               }
//               className="w-1/2 border border-gray-700 p-2 rounded-md bg-gray-800 text-white"
//             />
//             <button
//               onClick={handleAddListItem}
//               className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
//             >
//               Add Item
//             </button>
//           </div>
//         </div>

//         {/* Button */}
//         <div>
//           <label className="text-gray-300">Button Text</label>
//           <input
//             type="text"
//             value={bundleData.button.text}
//             onChange={(e) =>
//               setBundleData((prev) => ({
//                 ...prev,
//                 button: { ...prev.button, text: e.target.value },
//               }))
//             }
//             className="w-full border border-gray-700 p-2 rounded-md bg-gray-800 text-white"
//           />
//           <label className="text-gray-300">Button Link</label>
//           <input
//             type="text"
//             value={bundleData.button.href}
//             onChange={(e) =>
//               setBundleData((prev) => ({
//                 ...prev,
//                 button: { ...prev.button, href: e.target.value },
//               }))
//             }
//             className="w-full border border-gray-700 p-2 rounded-md bg-gray-800 text-white"
//           />
//         </div>

//         {/* Save Changes */}
//         <button
//           onClick={saveBundleData}
//           className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
//         >
//           Save Changes
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AdminBundleOptions;




// 'use client';

// import React, { useState, useEffect } from "react";
// import axios from 'axios';
// import { doc, getDoc, setDoc } from "firebase/firestore";
// import { db } from "../../src/lib/firebase"; // Adjust based on your Firebase setup

// const AdminBundleOptions = () => {
//   // Initial state structure
//   const [bundleData, setBundleData] = useState({
//     heading: "",
//     subheading: "",
//     images: {
//       largeImage: "",
//       smallImages: [],
//       parallaxImages: "",
//     },
//     newListItem: [],
//   });

//   const [loading, setLoading] = useState(false);

//   // Handle input change
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setBundleData((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   // Handle file change for images
//   const handleFileChange = async (e, imageType) => {
//     const file = e.target.files[0];
//     // const { name, files } = e.target;


//     if (file) {
//       // Upload image to Cloudinary and get URL
//       const uploadedImageUrl = await uploadImageToCloudinary(file);
//       setBundleData((prevState) => ({
//         ...prevState,
//         images: {
//           ...prevState.images,
//           [imageType]: uploadedImageUrl,
//         },
//       }));
//       console.log(uploadedImageUrl)
//     }
//   };

//   const handleAddListItem = () => {
//     setBundleData((prevData) => ({
//       ...prevData,
//       newListItem: [...prevData.newListItem, ""], // Adds an empty string for a new item
//     }));
//   };

//   // Upload image to Cloudinary
//   const uploadImageToCloudinary = async (file) => {
//     const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dq6dotbrs/upload';  // Replace with your Cloudinary URL
//     const CLOUDINARY_UPLOAD_PRESET = 'lavish_cluster'; // Replace with your preset

//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

//     try {
//       const response = await axios.post(CLOUDINARY_URL, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       return response.data.secure_url; // URL of the uploaded image
//     } catch (error) {
//       console.error("Error uploading image to Cloudinary", error);
//       return ''; // Return an empty string if failed
//     }
//   };

//   // Function to save data to Firebase after all images are uploaded
//   const saveDataToFirebase = async () => {
//     setLoading(true);
//     // Check if all images have URLs
//     if (
//       !bundleData.images.largeImage ||
//       !bundleData.images.parallaxImages ||
//       !Array.isArray(bundleData.images.smallImages) ||
//       bundleData.images.smallImages.some((url) => !url)
//     ){
//       alert('Please upload all images before saving.');
//       setLoading(false);
//       return;
//     }

//     try {
//       const docRef = doc(db, "content", "bundleOptions"); // Adjust the document ID as necessary
//       await setDoc(docRef, bundleData);
//       alert("Data saved successfully!");
//       setLoading(false);
//     } catch (error) {
//       console.error("Error saving data to Firebase", error);
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container mx-auto p-6">
//       {/* Form Section */}
//       <div className="bg-black text-white border-2 border-white p-4 rounded-lg shadow-md mb-8">
//         <h2 className="text-2xl font-semibold mb-4">Admin Bundle Options</h2>

//         {/* Input Fields */}
//         <div className="space-y-4">
//           <div>
//             <label className="block">Heading</label>
//             <input
//               type="text"
//               value={bundleData.heading}
//               onChange={(e) => setBundleData({ ...bundleData, heading: e.target.value })}
//               className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
//             />
//           </div>

//           <div>
//             <label className="block">Subheading</label>
//             <input
//               type="text"
//               value={bundleData.subheading}
//               onChange={(e) => setBundleData({ ...bundleData, subheading: e.target.value })}
//               className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
//             />
//           </div>

//           {/* Additional Inputs for images, button, etc. */}
//           {/* You can add fields for images or button data here */}
//         </div>

//         {/* List Items */}
//         <div className="mt-6">
//           <label className="block">List Item</label>
//           <div className="flex space-x-2">
//             <input
//               type="text"
//               placeholder="Bold Text"
//               value={bundleData.newListItem.boldText}
//               onChange={(e) => setNewListItem({ ...newListItem, boldText: e.target.value })}
//               className="w-1/2 px-4 py-2 bg-gray-700 text-white rounded-lg"
//             />
//             <input
//               type="text"
//               placeholder="Description"
//               value={bundleData.newListItem.description}
//               onChange={(e) => setNewListItem({ ...newListItem, description: e.target.value })}
//               className="w-1/2 px-4 py-2 bg-gray-700 text-white rounded-lg"
//             />
//           </div>
//           <button
//             onClick={handleAddListItem}
//             className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
//           >
//             Add List Item
//           </button>
//         </div>
//       </div>

//       <div className="flex flex-col space-y-3 text-white">
//         <div>
//         <label htmlFor="parallaxImage" className="mx-5">Parallax Image</label>
//         <input
//           type="file"
//           id="parallaxImage"
//           accept="image/*"
//           onChange={(e) => handleFileChange(e, "parallaxImages")}
//         />
//       </div>

//       {/* Large Image Upload */}
//       <div>
//         <label htmlFor="largeImage" className="mx-5">Large Image</label>
//         <input
//           type="file"
//           id="largeImage"
//           accept="image/*"
//           onChange={(e) => handleFileChange(e, "largeImage")}
//         />
//       </div>

//       {/* Gallery Image Upload */}
//       <div>
//         <label htmlFor="galleryImages" className="mx-5">Gallery Images</label>
//         <input
//           type="file"
//           id="galleryImages"
//           accept="image/*"
//           multiple
//           onChange={(e) => handleFileChange(e, "smallImages")}
//         />
//       </div>
//       </div>

//       <button onClick={saveDataToFirebase} className="">Save Content</button>

//       {/* Preview Section */}
//       <div className="bg-white text-black p-6 rounded-lg border-2 border-white shadow-lg mt-8">
//         <h2 className="text-2xl font-semibold mb-4">Preview</h2>

//         {/* Display Heading and Subheading */}
//         <div className="mb-4">
//           <h3 className="text-xl font-bold">{bundleData.heading}</h3>
//           <p className="text-lg">{bundleData.subheading}</p>
//         </div>

//         {/* Display List Items */}
//         <div className="space-y-2">
//           {bundleData.newListItem.map((item, index) => (
//             <div key={index} className="flex space-x-2">
//               <strong>{item.boldText}:</strong>
//               <p>{item.description}</p>
//             </div>
//           ))}
//         </div>

//         {/* Display Images if available */}
//         {bundleData.images.largeImage && (
//           <div className="mt-4">
//             <img src={bundleData.images.largeImage} alt="Large Preview" className="w-full rounded-lg" />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminBundleOptions;














'use client';

import React, { useState } from "react";
import axios from 'axios';
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../src/lib/firebase"; // Make sure this is your correct Firebase config path

const AdminBundleOptions = () => {
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");
  const [points, setPoints] = useState([""]); // Array of points
  const [images, setImages] = useState({
    largeImage: null,
    smallImages: [],
    parallaxImage: null
  });

  // Handle changes in text inputs
  const handleHeadingChange = (e) => setHeading(e.target.value);
  const handleSubheadingChange = (e) => setSubheading(e.target.value);
  const handlePointsChange = (index, value) => {
    const updatedPoints = [...points];
    updatedPoints[index] = value;
    setPoints(updatedPoints);
  };
  const handleAddPoint = () => setPoints([...points, ""]);

  // Handle image input change
  const handleImageChange = (e, type) => {
    if (type === "largeImage") {
      setImages({ ...images, largeImage: e.target.files[0] });
    } else if (type === "parallaxImage") {
      setImages({ ...images, parallaxImage: e.target.files[0] });
    } else if (type === "smallImages") {
      setImages({ ...images, smallImages: [...e.target.files] });
    }
  };

  // Upload image to Cloudinary
  const uploadImageToCloudinary = async (image) => {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "lavish_cluster"); // Replace with your Cloudinary upload preset

    try {
      const response = await axios.post("https://api.cloudinary.com/v1_1/dq6dotbrs/image/upload", formData);
      return response.data.secure_url; // Cloudinary URL
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  // Handle form submission and save data to Firebase
  const handleSaveData = async () => {
    if (!heading || !subheading || points.some((point) => !point.trim())) {
      alert("Please fill in all the required fields.");
      return;
    }

    const imageUrls = await Promise.all([
      images.largeImage ? uploadImageToCloudinary(images.largeImage) : null,
      images.parallaxImage ? uploadImageToCloudinary(images.parallaxImage) : null,
      ...images.smallImages.map((image) => uploadImageToCloudinary(image))
    ]);

    const [largeImageUrl, parallaxImageUrl, ...smallImageUrls] = imageUrls;

    const bundleData = {
      heading,
      subheading,
      points,
      images: {
        largeImage: largeImageUrl,
        smallImages: smallImageUrls,
        parallaxImage: parallaxImageUrl
      }
    };

    try {
      const docRef = doc(db, "content", "bundleOptions"); // Ensure this is the correct Firestore path
      await setDoc(docRef, bundleData);
      alert("Bundle data saved successfully!");
    } catch (error) {
      console.error("Error saving data to Firebase:", error);
      alert("Failed to save bundle data.");
    }
  };

  return (
    <div className="text-white border-2 border-white p-4 mx-4 rounded-md">
      {/* <h1 className="text-center my-5">Admin - Bundle Options</h1> */}
      <form onSubmit={(e) => e.preventDefault()} className="space-y-4 mt-8">
        <div className="space-y-4">
          <label className="text-gray-300">Heading:</label>
          <input type="text"
            className="w-full border border-gray-700 p-2 rounded-md bg-gray-700 text-white"
            value={heading} onChange={handleHeadingChange} required />
        </div>
        <div className="space-y-4">
          <label className="text-gray-300">Subheading:</label>
          <input type="text" value={subheading}
            className="w-full border border-gray-700 p-2 rounded-md bg-gray-700 text-white"
            onChange={handleSubheadingChange} required />
        </div>
        <div className="space-y-4">
          <label className="text-gray-300">Points:</label>
          {points.map((point, index) => (
            <input
              key={index}
              type="text"
              value={point}
              onChange={(e) => handlePointsChange(index, e.target.value)}
              required
              className="w-full border border-gray-700 p-2 rounded-md bg-gray-700 text-white"
            />
          ))}
          <button type="button" className="text-gray-900" onClick={handleAddPoint}>Add Point</button>
        </div>
        <div className="space-y-4">
          <label className="mx-4">Large Image:</label>
          <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, "largeImage")} required />
        </div>
        <div>
          <label className="mx-4">Parallax Image:</label>
          <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, "parallaxImage")} />
        </div>
        <div>
          <label className="mx-4">Small Images (Select Multiple):</label>
          <input type="file" accept="image/*" multiple onChange={(e) => handleImageChange(e, "smallImages")} />
        </div>
        <button type="button" className="text-black" onClick={handleSaveData}>Save Bundle Data</button>
      </form>
    </div>
  );
};

export default AdminBundleOptions;
