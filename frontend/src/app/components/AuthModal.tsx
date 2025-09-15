"use client";

import { useState } from "react";
import api from "../lib/api";

type AuthModalProps = {
    onLogin: () => void;
};

export default function AuthModal({ onLogin }: AuthModalProps) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isRegister, setIsRegister] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        try {
            if (isRegister) {
                await api.post("/user", { username, password });
            }
            const res = await api.post("/auth/login", { username, password });
            localStorage.setItem("token", res.data.access_token);
            onLogin();
        } catch (error: any) {
            if (error.response) {
                switch (error.response.status) {
                    case 400:
                        setError(error.response.data.message);
                        break;
                    default:
                        setError("Unknown error, try again later");
                }
            } else {
                setError("Network problem");
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-96">
                <h2 className="text-xl font-bold mb-4 text-center text-black">
                    {isRegister ? "Register" : "Login"}
                </h2>
                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

                <label className="block text-sm font-medium mb-1 text-black">Username</label>
                <input
                    type="text"
                    placeholder="Enter your username"
                    className="w-full border border-black p-2 rounded mb-2 text-black placeholder-black"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <label className="block text-sm font-medium mb-1 text-black">Password</label>
                <input
                    type="password"
                    placeholder="Enter your password"
                    className="w-full border border-black p-2 rounded mb-4 text-black placeholder-black"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    onClick={handleSubmit}
                    className="w-full bg-blue-600 text-white rounded p-2 hover:bg-blue-700 mb-2 cursor-pointer"
                >
                    {isRegister ? "Register" : "Login"}
                </button>

                <p className="text-center text-sm text-gray-500">
                    {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
                    <button
                        onClick={() => { setIsRegister(!isRegister); setError(""); }}
                        className="text-blue-600 font-semibold cursor-pointer"
                    >
                        {isRegister ? "Login" : "Register"}
                    </button>
                </p>
            </div>
        </div>
    );
}
