// src/pages/LoginPage.jsx

import React, { useState } from "react";
// Only using components you confirmed were imported earlier
import { Card, CardContent } from "@/components/ui/card"; 
import { Button } from "@/components/ui/button";
import { login } from "../services/authService"; // Import the login function

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault(); 
    setError(null);
    setLoading(true);

    try {
      const user = await login(email, password);
      
      console.log("Login successful! User:", user);
      // In a real app, this is where navigation happens: navigate('/dashboard'); 
      
    } catch (err) {
      // The error is thrown from authService, we catch it here
      setError(err.message || "An unknown error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Outer container for centering and background
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      
      {/* The main card container */}
      <Card className="w-full max-w-md shadow-xl rounded-xl bg-white p-6">
        
        {/* Card Header Content (Using Tailwind for h1 style) */}
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Sign In to VidyaVichar
        </h1>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Error Message Display */}
            {error && (
              <p className="text-red-600 bg-red-100 p-3 rounded-lg text-sm mb-4">
                {error}
              </p>
            )}

            {/* Email Input Group */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Password Input Group */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Login Button */}
            <Button 
              type="submit" 
              className="w-full py-2.5 text-lg bg-indigo-600 hover:bg-indigo-700 text-white" 
              disabled={loading}
            >
              {loading ? 'Logging In...' : 'Login'}
            </Button>
            
          </form>
          
          <p className="mt-4 text-center text-sm text-gray-500">
            Don't have an account? 
            <a href="/signup" className="text-indigo-600 hover:underline ml-1">
              Sign Up
            </a>
          </p>
          
        </CardContent>
      </Card>
    </div>
  );
}