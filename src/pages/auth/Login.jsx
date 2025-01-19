import React, { useState, useContext  } from "react";
import { useNavigate } from "react-router-dom"; // React Router for navigation
import image from "../../assets/Aj.webp";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase"; // Adjust the path to your Firebase configuration file
import { IoMdArrowRoundBack } from "react-icons/io";
import '../../App.css'
import '../../index.css'
import { AuthContext } from "../../context/AuthContext";


const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { setIsLogin } = useContext(AuthContext);

    
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("Logged in:", userCredential.user);
            setIsLogin(true); // Set login state to true
            navigate("/dashboard");
        } catch (error) {
            console.error("Error logging in:", error);
            setError("Invalid email or password");
        }
    };

    const handleGoBack = () => {
        navigate("/");
    };

    return (
        <div className="flex w-[100vw] items-center justify-center min-h-screen bg-black text-white">
            {/* Left Column - Login Form */}
            <div className=" md:w-[50%] h-auto  flex basis-1/3 gap-5 items-center justify-center p-8  rounded-lg border border-gray-500">
                <div className=" w-full  flex flex-col    bg-black ">
                    <div className=" flex gap-4 items-center mb-4 justify-center">

                        <h2 className="text-lg font-poppins font-bold md:text-2xl text-center">
                            ADMIN LOGIN
                        </h2>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-12">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium ">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-600 rounded-md focus:outline-none text-black"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-600 rounded-md focus:outline-none text-black"
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <button
                            type="submit"
                            className="w-full py-3 mt-8 mx-auto bg-white text-gray-800 rounded-md font-medium hover:scale-105 hover:bg-gray-300 transition-colors duration-300"
                        >
                            Login
                        </button>
                    </form>
                </div>

                {/* Right Column - Image */}
                {/* <div className="hidden lg:flex h-[500px] items-center basis-1/2 justify-center">
                    <img
                        src={image}
                        alt="Lavish Clusters Founder"
                        style={{ objectFit: "cover", objectPosition: "top", height: "500px" }}
                        className="w-[]"
                    />
                </div> */}
            </div>
        </div>
    );
};

export default LoginPage;
