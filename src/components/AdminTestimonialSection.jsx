


import React, { useState, useEffect } from "react";
import axios from "axios";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../src/lib/firebase"; // Adjust the path to your Firebase setup

const AdminTestimonial = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null); // Index of the testimonial being edited
  const [newTestimonial, setNewTestimonial] = useState({
    name: "",
    role: "",
    image: "",
    comment: "",
    rating: 5,
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch testimonials from Firebase
  const fetchTestimonials = async () => {
    try {
      const docRef = doc(db, "content", "testimonials");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setTestimonials(docSnap.data().testimonials || []);
      } else {
        console.log("No testimonials found!");
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // Handle changes in the input fields
  const handleInputChange = (field, value) => {
    setNewTestimonial((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Upload image to Cloudinary
  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "lavish_cluster"); // Replace with Cloudinary upload preset

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/dq6dotbrs/image/upload`,
      formData
    );
    return response.data.secure_url;
  };

  // Save the testimonials back to Firebase
  const saveTestimonials = async (updatedTestimonials) => {
    try {
      const docRef = doc(db, "content", "testimonials");
      await setDoc(docRef, { testimonials: updatedTestimonials });
      setSuccessMessage("Testimonials updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000); // Clear success message after 3 seconds
    } catch (error) {
      console.error("Error saving testimonials:", error);
    }
  };

  // Add a new testimonial
  const addNewTestimonial = async () => {
    try {
      setLoading(true);
      let imageUrl = newTestimonial.image;

      if (newTestimonial.image instanceof File) {
        imageUrl = await uploadImageToCloudinary(newTestimonial.image);
      }

      const updatedTestimonials = [...testimonials, { ...newTestimonial, image: imageUrl }];
      setTestimonials(updatedTestimonials);
      saveTestimonials(updatedTestimonials);

      setNewTestimonial({ name: "", role: "", image: "", comment: "", rating: 5 });
    } catch (error) {
      console.error("Error adding testimonial:", error);
    } finally {
      setLoading(false);
    }
  };

  // Edit an existing testimonial
  const saveEditedTestimonial = async () => {
    try {
      setLoading(true);
      let imageUrl = newTestimonial.image;

      if (newTestimonial.image instanceof File) {
        imageUrl = await uploadImageToCloudinary(newTestimonial.image);
      }

      const updatedTestimonials = testimonials.map((testimonial, index) =>
        index === editingIndex ? { ...newTestimonial, image: imageUrl } : testimonial
      );

      setTestimonials(updatedTestimonials);
      saveTestimonials(updatedTestimonials);

      setEditingIndex(null);
      setNewTestimonial({ name: "", role: "", image: "", comment: "", rating: 5 });
    } catch (error) {
      console.error("Error editing testimonial:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete a testimonial
  const deleteTestimonial = (index) => {
    const updatedTestimonials = testimonials.filter((_, i) => i !== index);
    setTestimonials(updatedTestimonials);
    saveTestimonials(updatedTestimonials);
  };

  return (
    <div className="p-6 bg-black min-h-screen flex flex-col gap-8">
      <div className="bg-black border-2 border-gray-600 p-6 rounded-md shadow-md w-[80%] mx-auto space-y-6">
        <h2 className="text-3xl font-semibold text-white">Manage Testimonials</h2>

        {successMessage && <p className="text-green-400">{successMessage}</p>}

        {/* Testimonials Table */}
        <table className="w-full text-gray-300 border-collapse border border-gray-700">
          <thead>
            <tr className="bg-gray-700 text-left">
              <th className="p-2 border border-gray-600">Name</th>
              <th className="p-2 border border-gray-600">Role</th>
              <th className="p-2 border border-gray-600">Comment</th>
              <th className="p-2 border border-gray-600">Rating</th>
              <th className="p-2 border border-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {testimonials.map((testimonial, index) => (
              <tr key={index} className="hover:bg-gray-700">
                <td className="p-2 border border-gray-600">{testimonial.name}</td>
                <td className="p-2 border border-gray-600">{testimonial.role}</td>
                <td className="p-2 border border-gray-600">{testimonial.comment}</td>
                <td className="p-2 border border-gray-600">{testimonial.rating}</td>
                <td className="p-2 border border-gray-600 flex gap-2">
                  <button
                    onClick={() => {
                      setEditingIndex(index);
                      setNewTestimonial(testimonials[index]);
                    }}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTestimonial(index)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Form for Adding/Editing */}
        <h3 className="text-xl text-gray-400">{editingIndex === null ? "Add New Testimonial" : "Edit Testimonial"}</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={newTestimonial.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-600"
          />
          <input
            type="text"
            placeholder="Role"
            value={newTestimonial.role}
            onChange={(e) => handleInputChange("role", e.target.value)}
            className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-600"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleInputChange("image", e.target.files[0])}
            className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-600"
          />
          <textarea
            placeholder="Comment"
            value={newTestimonial.comment}
            onChange={(e) => handleInputChange("comment", e.target.value)}
            className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-600"
          ></textarea>
          <input
            type="number"
            placeholder="Rating (1-5)"
            value={newTestimonial.rating}
            onChange={(e) => handleInputChange("rating", e.target.value)}
            className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-600"
          />
        </div>
        <button
          onClick={editingIndex === null ? addNewTestimonial : saveEditedTestimonial}
          className={`w-full bg-blue-500 text-white py-2 rounded-md mt-4 hover:bg-blue-600 transition ${
            loading ? "opacity-50" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Saving..." : editingIndex === null ? "Add Testimonial" : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default AdminTestimonial;
