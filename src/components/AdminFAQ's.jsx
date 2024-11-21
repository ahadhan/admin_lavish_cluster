import React, { useState, useEffect } from "react";
import { db } from "../../src/lib/firebase"; // Adjust the import based on your project structure
import { doc, getDoc, setDoc } from "firebase/firestore";

const AdminFAQSection = () => {
  const [faqs, setFaqs] = useState([]);
  const [newFaq, setNewFaq] = useState({ question: "", answer: "" });
  const [editingIndex, setEditingIndex] = useState(null); // Index of the FAQ being edited

  // Fetch FAQs from Firestore
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const docRef = doc(db, "content", "faqSection");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setFaqs(docSnap.data().faqs || []);
        } else {
          console.log("No FAQs found!");
        }
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      }
    };

    fetchFaqs();
  }, []);

  // Save FAQs to Firestore
  const saveFaqs = async (updatedFaqs) => {
    try {
      const docRef = doc(db, "content", "faqSection");
      await setDoc(docRef, { faqs: updatedFaqs });
      setFaqs(updatedFaqs);
      alert("FAQs updated successfully!");
    } catch (error) {
      console.error("Error saving FAQs:", error);
      alert("Failed to save FAQs. Please try again.");
    }
  };

  // Add a new FAQ
  const addFaq = () => {
    if (!newFaq.question || !newFaq.answer) {
      alert("Please fill out both the question and answer fields.");
      return;
    }

    const updatedFaqs = [...faqs, { ...newFaq, id: Date.now() }];
    setNewFaq({ question: "", answer: "" });
    saveFaqs(updatedFaqs);
  };

  // Save an edited FAQ
  const saveEditedFaq = () => {
    if (!newFaq.question || !newFaq.answer) {
      alert("Please fill out both the question and answer fields.");
      return;
    }

    const updatedFaqs = faqs.map((faq, index) =>
      index === editingIndex ? { ...newFaq, id: faq.id } : faq
    );
    setNewFaq({ question: "", answer: "" });
    setEditingIndex(null);
    saveFaqs(updatedFaqs);
  };

  // Delete an FAQ
  const deleteFaq = (index) => {
    const updatedFaqs = faqs.filter((_, i) => i !== index);
    saveFaqs(updatedFaqs);
  };

  return (
    <div className="p-6 bg-black min-h-screen flex flex-col gap-8">
      <div className="bg-black border-2 border-gray-600 p-6 rounded-md shadow-md w-[80%] mx-auto space-y-6">
        <h2 className="text-3xl font-semibold text-white">Manage FAQs</h2>

        {/* FAQ List */}
        <table className="w-full text-gray-300 border-collapse border border-gray-700">
          <thead>
            <tr className="bg-gray-700 text-left">
              <th className="p-2 border border-gray-600">Question</th>
              <th className="p-2 border border-gray-600">Answer</th>
              <th className="p-2 border border-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {faqs.map((faq, index) => (
              <tr key={faq.id} className="hover:bg-gray-800">
                <td className="p-2 border border-gray-600">{faq.question}</td>
                <td className="p-2 border border-gray-600">{faq.answer}</td>
                <td className="p-2 border border-gray-600 flex gap-2">
                  <button
                    onClick={() => {
                      setEditingIndex(index);
                      setNewFaq({ question: faq.question, answer: faq.answer });
                    }}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteFaq(index)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Add/Edit Form */}
        <div className="space-y-4">
          <h3 className="text-xl text-gray-400">
            {editingIndex === null ? "Add New FAQ" : "Edit FAQ"}
          </h3>
          <input
            type="text"
            placeholder="Question"
            value={newFaq.question}
            onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
            className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-600"
          />
          <textarea
            placeholder="Answer"
            value={newFaq.answer}
            onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
            className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-600"
          ></textarea>
          <button
            onClick={editingIndex === null ? addFaq : saveEditedFaq}
            className="w-full bg-blue-500 text-white py-2 rounded-md mt-4 hover:bg-blue-600 transition"
          >
            {editingIndex === null ? "Add FAQ" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminFAQSection;
