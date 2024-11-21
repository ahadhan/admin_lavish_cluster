import React, { useState, useEffect } from "react";
import axios from "axios";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../src/lib/firebase"; // Adjust based on your Firebase setup

const AdminBundleOptions = () => {
  const [bundleData, setBundleData] = useState({
    heading: "",
    subheading: "",
    images: { largeImage: "", smallImages: [], parallaxImages: "" },
    listItems: [],
    button: { text: "", href: "" },
  });

  const [newListItem, setNewListItem] = useState({ boldText: "", description: "" });
  const [newSmallImage, setNewSmallImage] = useState(null);

  // Fetch data from Firestore
  useEffect(() => {
    const fetchBundleData = async () => {
      try {
        const docRef = doc(db, "bundles", "bundleOptions");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setBundleData(docSnap.data());
        } else {
          console.log("No bundle data found!");
        }
      } catch (error) {
        console.error("Error fetching bundle data:", error);
      }
    };

    fetchBundleData();
  }, []);

  // Cloudinary image upload handler
  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "lavish_cluster"); // Replace with your Cloudinary upload preset
    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/dq6dotbrs/image/upload",
      formData
    );
    return response.data.secure_url;
  };

  // Save data to Firestore
  const saveBundleData = async () => {
    try {
      const docRef = doc(db, "bundles", "bundleOptions");
      await setDoc(docRef, bundleData);
      alert("Bundle data updated successfully!");
    } catch (error) {
      console.error("Error saving bundle data:", error);
      alert("Failed to save data. Please try again.");
    }
  };

  // Add new list item
  const handleAddListItem = () => {
    setBundleData((prev) => ({
      ...prev,
      listItems: [...prev.listItems, newListItem],
    }));
    setNewListItem({ boldText: "", description: "" });
  };

  // Add small image to the list
  const handleAddSmallImage = async () => {
    if (newSmallImage) {
      const imageUrl = await uploadImageToCloudinary(newSmallImage);
      setBundleData((prev) => ({
        ...prev,
        images: {
          ...prev.images,
          smallImages: [...prev.images.smallImages, imageUrl],
        },
      }));
      setNewSmallImage(null);
    }
  };

  return (
    <div className="p-6 bg-black min-h-screen flex flex-col gap-8">
      <div className="bg-black border-2 border-gray-300 p-6 rounded-md shadow-md w-[80%] mx-auto space-y-6">
        <h2 className="text-3xl font-semibold text-white">Manage Bundle Options</h2>

        {/* Heading */}
        <div>
          <label className="text-gray-300">Heading</label>
          <input
            type="text"
            value={bundleData.heading}
            onChange={(e) =>
              setBundleData((prev) => ({ ...prev, heading: e.target.value }))
            }
            className="w-full border border-gray-700 p-2 rounded-md bg-gray-800 text-white"
          />
        </div>

        {/* Subheading */}
        <div>
          <label className="text-gray-300">Subheading</label>
          <input
            type="text"
            value={bundleData.subheading}
            onChange={(e) =>
              setBundleData((prev) => ({ ...prev, subheading: e.target.value }))
            }
            className="w-full border border-gray-700 p-2 rounded-md bg-gray-800 text-white"
          />
        </div>

        {/* Parallax Image */}
        <div>
          <label className="text-gray-300">Parallax Image</label>
          <input
            type="file"
            onChange={async (e) => {
              const imageUrl = await uploadImageToCloudinary(e.target.files[0]);
              setBundleData((prev) => ({
                ...prev,
                images: { ...prev.images, parallaxImages: imageUrl },
              }));
            }}
            className="w-full border border-gray-700 p-2 rounded-md bg-gray-800 text-white"
          />
        </div>

        {/* Large Image */}
        <div>
          <label className="text-gray-300">Large Image</label>
          <input
            type="file"
            onChange={async (e) => {
              const imageUrl = await uploadImageToCloudinary(e.target.files[0]);
              setBundleData((prev) => ({
                ...prev,
                images: { ...prev.images, largeImage: imageUrl },
              }));
            }}
            className="w-full border border-gray-700 p-2 rounded-md bg-gray-800 text-white"
          />
        </div>

        {/* Small Images */}
        <div>
          <label className="text-gray-300">Small Images</label>
          <input
            type="file"
            onChange={(e) => setNewSmallImage(e.target.files[0])}
            className="w-full border border-gray-700 p-2 rounded-md bg-gray-800 text-white"
          />
          <button
            onClick={handleAddSmallImage}
            className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Add Small Image
          </button>
        </div>

        {/* List Items */}
        <div>
          <h3 className="text-gray-300">List Items</h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Bold Text"
              value={newListItem.boldText}
              onChange={(e) =>
                setNewListItem((prev) => ({ ...prev, boldText: e.target.value }))
              }
              className="w-1/2 border border-gray-700 p-2 rounded-md bg-gray-800 text-white"
            />
            <input
              type="text"
              placeholder="Description"
              value={newListItem.description}
              onChange={(e) =>
                setNewListItem((prev) => ({ ...prev, description: e.target.value }))
              }
              className="w-1/2 border border-gray-700 p-2 rounded-md bg-gray-800 text-white"
            />
            <button
              onClick={handleAddListItem}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Add Item
            </button>
          </div>
        </div>

        {/* Button */}
        <div>
          <label className="text-gray-300">Button Text</label>
          <input
            type="text"
            value={bundleData.button.text}
            onChange={(e) =>
              setBundleData((prev) => ({
                ...prev,
                button: { ...prev.button, text: e.target.value },
              }))
            }
            className="w-full border border-gray-700 p-2 rounded-md bg-gray-800 text-white"
          />
          <label className="text-gray-300">Button Link</label>
          <input
            type="text"
            value={bundleData.button.href}
            onChange={(e) =>
              setBundleData((prev) => ({
                ...prev,
                button: { ...prev.button, href: e.target.value },
              }))
            }
            className="w-full border border-gray-700 p-2 rounded-md bg-gray-800 text-white"
          />
        </div>

        {/* Save Changes */}
        <button
          onClick={saveBundleData}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default AdminBundleOptions;
