import React, { useState, useEffect } from 'react';
import { db } from '../../src/lib/firebase'; // Adjust your import path for Firebase
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AdminHowItWorks = () => {
  const [howItWorksData, setHowItWorksData] = useState({
    heading: '',
    subheading: '',
    videos: [],
  });
  const [newVideo, setNewVideo] = useState({ title: '', videoSrc: '' });
  const [editingIndex, setEditingIndex] = useState(null); // Track editing index
  const [loading, setLoading] = useState(true);

  // Fetch existing data from Firebase
  useEffect(() => {
    const fetchHowItWorksData = async () => {
      try {
        const docRef = doc(db, 'content', 'howItWorksSection');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setHowItWorksData(docSnap.data());
        } else {
          console.log('No How It Works data found!');
        }
      } catch (error) {
        console.error('Error fetching How It Works data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHowItWorksData();
  }, []);

  // Save data to Firebase
  const saveDataToFirebase = async () => {
    try {
      const docRef = doc(db, 'content', 'howItWorksSection');
      await setDoc(docRef, howItWorksData);
      alert('How It Works data updated successfully!');
    } catch (error) {
      console.error('Error saving How It Works data:', error);
      alert('Failed to update data. Please try again.');
    }
  };

  // Add a new video
  const addVideo = () => {
    if (!newVideo.title || !newVideo.videoSrc) {
      alert('Please fill out both the title and video URL.');
      return;
    }

    setHowItWorksData((prev) => ({
      ...prev,
      videos: [...prev.videos, { id: Date.now(), ...newVideo }],
    }));
    setNewVideo({ title: '', videoSrc: '' });
  };

  // Edit an existing video
  const saveEditedVideo = () => {
    if (!newVideo.title || !newVideo.videoSrc) {
      alert('Please fill out both the title and video URL.');
      return;
    }

    setHowItWorksData((prev) => {
      const updatedVideos = [...prev.videos];
      updatedVideos[editingIndex] = { ...updatedVideos[editingIndex], ...newVideo };
      return { ...prev, videos: updatedVideos };
    });

    setEditingIndex(null);
    setNewVideo({ title: '', videoSrc: '' });
  };

  // Delete a video
  const deleteVideo = (index) => {
    setHowItWorksData((prev) => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index),
    }));
  };

  if (loading) return <p>Loading admin panel...</p>;

  return (
    <div className="p-6 bg-black min-h-screen flex flex-col gap-8">
      <div className="bg-black border-2 border-white p-6 rounded-md shadow-md w-[80%] mx-auto space-y-6">
        <h2 className="text-3xl font-semibold text-white">Manage How It Works Section</h2>

        {/* Heading */}
        <div className="space-y-4">
          <label className="text-gray-300">Heading</label>
          <input
            type="text"
            value={howItWorksData.heading}
            onChange={(e) =>
              setHowItWorksData((prev) => ({ ...prev, heading: e.target.value }))
            }
            className="w-full border border-gray-700 p-2 rounded-md bg-gray-800 text-white"
          />
        </div>

        {/* Subheading */}
        <div className="space-y-4">
          <label className="text-gray-300">Subheading</label>
          <input
            type="text"
            value={howItWorksData.subheading}
            onChange={(e) =>
              setHowItWorksData((prev) => ({ ...prev, subheading: e.target.value }))
            }
            className="w-full border border-gray-700 p-2 rounded-md bg-gray-800 text-white"
          />
        </div>

        {/* Videos List */}
        <h3 className="text-xl text-gray-300">Videos</h3>
        <table className="w-full text-gray-300 border-collapse border border-gray-700">
          <thead>
            <tr className="bg-gray-700 text-left">
              <th className="p-2 border border-gray-600">Title</th>
              <th className="p-2 border border-gray-600">Video URL</th>
              <th className="p-2 border border-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {howItWorksData.videos.map((video, index) => (
              <tr key={video.id} className="hover:bg-gray-700">
                <td className="p-2 border border-gray-600">{video.title}</td>
                <td className="p-2 border border-gray-600">{video.videoSrc}</td>
                <td className="p-2 border border-gray-600 flex gap-2">
                  <button
                    onClick={() => {
                      setEditingIndex(index);
                      setNewVideo(video);
                    }}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteVideo(index)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Add/Edit Video Form */}
        <div className="space-y-4">
          <h3 className="text-xl text-gray-300">
            {editingIndex === null ? 'Add New Video' : 'Edit Video'}
          </h3>
          <input
            type="text"
            placeholder="Video Title"
            value={newVideo.title}
            onChange={(e) => setNewVideo((prev) => ({ ...prev, title: e.target.value }))}
            className="w-full border border-gray-700 p-2 rounded-md bg-gray-800 text-white"
          />
          <input
            type="text"
            placeholder="Video URL"
            value={newVideo.videoSrc}
            onChange={(e) => setNewVideo((prev) => ({ ...prev, videoSrc: e.target.value }))}
            className="w-full border border-gray-700 p-2 rounded-md bg-gray-800 text-white"
          />
          <button
            onClick={editingIndex === null ? addVideo : saveEditedVideo}
            className="w-full bg-gray-700 text-white py-2 rounded-md mt-4 hover:bg-blue-600 transition"
          >
            {editingIndex === null ? 'Add Video' : 'Save Changes'}
          </button>
        </div>

        {/* Save All Changes Button */}
        <button
          onClick={saveDataToFirebase}
          className="w-full bg-green-500 text-white py-2 rounded-md mt-4 hover:bg-green-600 transition"
        >
          Save All Changes
        </button>
      </div>
    </div>
  );
};

export default AdminHowItWorks;
