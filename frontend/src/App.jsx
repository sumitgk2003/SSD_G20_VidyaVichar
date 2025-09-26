import React from "react";
import HomePage from "./pages/HomePage";

export default function App() {
  return (
    <div>
      <HomePage />
    </div>
  );
}

// src/pages/Home.jsx
// comment
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const [role, setRole] = useState("student");

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md text-center p-8 shadow-xl rounded-2xl bg-white">
        <CardContent>
          {/* Welcome Text */}
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            Welcome to VidyaVichar
          </h1>

          {/* Role Toggle */}
          <div className="mb-6 flex justify-center space-x-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="role"
                value="student"
                checked={role === "student"}
                onChange={() => setRole("student")}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-gray-700">Student</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="role"
                value="instructor"
                checked={role === "instructor"}
                onChange={() => setRole("instructor")}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-gray-700">Instructor</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button
              variant="default"
              className="px-6 py-2 text-lg"
              onClick={() => console.log(`Login as ${role}`)}
            >
              Login
            </Button>
            <Button
              variant="outline"
              className="px-6 py-2 text-lg"
              onClick={() => console.log(`Signup as ${role}`)}
            >
              Signup
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
