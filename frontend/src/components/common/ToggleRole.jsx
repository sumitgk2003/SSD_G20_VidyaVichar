import React from "react";
import "./ToggleRole.css";

export default function ToggleRole({ role, setRole }) {
  return (
    <div className="role-toggle">
      <label>
        <input
          type="radio"
          name="role"
          value="student"
          checked={role === "student"}
          onChange={() => setRole("student")}
        />
        Student
      </label>
      <label>
        <input
          type="radio"
          name="role"
          value="instructor"
          checked={role === "instructor"}
          onChange={() => setRole("instructor")}
        />
        Instructor
      </label>
    </div>
  );
}
