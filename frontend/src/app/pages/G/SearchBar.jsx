import React, { useState, useEffect } from "react";
import coursesData from "../src/courses.json"; // adjust path if needed

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(coursesData);

  useEffect(() => {
    const lowerQuery = query.toLowerCase();

    if (!lowerQuery.trim()) {
      setResults(coursesData);
      return;
    }

    const filtered = coursesData.filter(
      (course) =>
        course.title.toLowerCase().includes(lowerQuery) ||
        course.class_name.toLowerCase().includes(lowerQuery) ||
        course.desc.toLowerCase().includes(lowerQuery)
    );

    setResults(filtered);
  }, [query]);

  return (
    <div className="search-container" style={{ padding: "2rem" }}>
      {/* Search bar */}
      <div
        className="search-bar"
        style={{
          position: "fixed",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "2rem"
        }}
      >
        <input
          type="text"
          placeholder="Search for a course..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: "400px",
            height: "40px",
            padding: "10px",
            fontSize: "16px",
            borderRadius: "8px 0 0 8px",
            border: "1px solid #ccc",
            outline: "none",
          }}
        />
        <button
          style={{
            height: "40px",
            backgroundColor: "#2740a0",
            color: "white",
            border: "none",
            padding: "0 20px",
            borderRadius: "0 8px 8px 0",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </div>

      {/* Course Results */}
      <ul style={{ listStyle: "none", padding: "1rem 0 0 0" }}>
        {results.length > 0 ? (
          results.map((course, index) => (
            <li
              key={index}
              style={{
                marginBottom: "1.5rem",
                padding: "1rem",
                borderRadius: "10px",
                boxShadow: "0 0 5px rgba(0,0,0,0.1)",
              }}
            >
              <h3 style={{ marginBottom: "0.25rem" }}>{course.title}</h3>
              <p style={{ fontStyle: "italic", color: "gray", margin: 0 }}>
                {course.class_name}
              </p>

              {/* 🟪 Description */}
              <p style={{ marginTop: "0.5rem" }}>{course.desc}</p>

              {/* 🟫 Prerequisites section */}
              {course.course_prereq && course.course_prereq.length > 0 ? (
                <p style={{ color: "gray", fontSize: "14px", marginTop: "0.5rem" }}>
                  <strong>Prerequisites:</strong>{" "}
                  {course.course_prereq.join(", ")}
                </p>
              ) : (
                <p style={{ color: "gray", fontSize: "14px", marginTop: "0.5rem" }}>
                  <strong>Prerequisites:</strong> None
                </p>
              )}
            </li>
          ))
        ) : (
          <p>No courses found.</p>
        )}
      </ul>
    </div>
  );
};

export default SearchBar;