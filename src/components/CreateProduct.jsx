import React, { useState } from "react";
import { db } from "../../src/lib/firebase"; // Firebase setup
import { collection, addDoc } from "firebase/firestore";
import axios from "axios";

const CreateProduct = () => {
  const [productData, setProductData] = useState({
    title: "",
    description: "",
    price: "",
    brand: "",
    category: "",
    stock: "",
    images: [], // To store Cloudinary URLs
  });

  const [imageFiles, setImageFiles] = useState([]); // Local file uploads
  const [isUploading, setIsUploading] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    setImageFiles([...e.target.files]);
  };

  // Upload a single file to Cloudinary
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "lavish_cluster"); // Cloudinary upload preset

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dq6dotbrs/image/upload", // Cloudinary endpoint
        formData
      );
      return response.data.secure_url; // Return uploaded image URL
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      throw error;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (imageFiles.length === 0) {
      alert("Please upload at least one image.");
      return;
    }

    setIsUploading(true);

    try {
      // Upload all images to Cloudinary
      const uploadedImages = await Promise.all(
        imageFiles.map((file) => uploadToCloudinary(file))
      );

      // Save product data to Firestore
      await addDoc(collection(db, "products"), {
        ...productData,
        images: uploadedImages, // Save Cloudinary URLs
        createdAt: new Date(),
      });

      alert("Product created successfully!");
      setProductData({
        title: "",
        description: "",
        price: "",
        brand: "",
        category: "",
        stock: "",
        images: [],
      });
      setImageFiles([]);
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Error creating product. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-10 bg-black border-2 border-white text-white rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create a New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Product Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium">
            Product Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={productData.title}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full bg-gray-700 text-white rounded"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={productData.description}
            onChange={handleChange}
            required
            className="mt-1 p-2 w-full bg-gray-700 text-white rounded"
          />
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium">
            Price (£)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={productData.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="mt-1 p-2 w-full bg-gray-700 text-white rounded"
          />
        </div>

        {/* Brand */}
        <div>
          <label htmlFor="brand" className="block text-sm font-medium">
            Brand
          </label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={productData.brand}
            onChange={handleChange}
            className="mt-1 p-2 w-full bg-gray-700 text-white rounded"
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium">
            Category
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={productData.category}
            onChange={handleChange}
            className="mt-1 p-2 w-full bg-gray-700 text-white rounded"
          />
        </div>

        {/* Stock */}
        <div>
          <label htmlFor="stock" className="block text-sm font-medium">
            Stock Quantity
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={productData.stock}
            onChange={handleChange}
            required
            min="0"
            className="mt-1 p-2 w-full bg-gray-700 text-white rounded"
          />
        </div>

        {/* Images */}
        <div>
          <label htmlFor="images" className="block text-sm font-medium">
            Upload Images (Multiple Allowed)
          </label>
          <input
            type="file"
            id="images"
            accept="image/*"
            onChange={handleImageChange}
            multiple
            className="mt-1 w-full text-white bg-gray-700"
          />
          {imageFiles.length > 0 && (
            <p className="mt-2 text-sm text-gray-400">
              {imageFiles.map((file) => file.name).join(", ")}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isUploading}
          className="w-full py-2 bg-indigo-600 rounded"
        >
          {isUploading ? "Uploading..." : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
