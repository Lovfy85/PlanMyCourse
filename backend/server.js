import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar"; // optional — remove if unused

function Graph() {
  // 🧩 Your static course data
  const coursesData = [
    {
      title: "CMPT 140.3: Introduction to Creative Computing",
      class_name: "CMPT140",
      desc: "Concepts in Computing such as algorithms, programming, and data representation.",
      course_prereq: [],
    },
    {
      title: "CMPT 141.3: Introduction to Computer Science",
      class_name: "CMPT141",
      desc: "An introduction to computer science and problem solving using programming.",
      course_prereq: [],
    },
    {
      title: "CMPT 145.3: Principles of Computer Science",
      class_name: "CMPT145",
      desc: "Builds on CMPT 141 by introducing more advanced programming techniques.",
      course_prereq: ["CMPT 141"],
    },
    {
      title: "CMPT 270.3: Developing Object-Oriented Systems",
      class_name: "CMPT270",
      desc: "Object-oriented programming, modeling, and design patterns.",
      course_prereq: ["CMPT 145"],
    },
    {
      title: "CMPT 317.3: Introduction to Artificial Intelligence",
      class_name: "CMPT317",
      desc: "A survey of essential Artificial Intelligence techniques and applications.",
      course_prereq: ["CMPT 270"],
    },
  ];

  const [query, setQuery] = useState("");
  const [results, setResults] = useState(coursesData);

  // 🔍 Filter courses whenever query changes
  useEffect(() => {
    const lowerQuery = query.toLowerCase().trim();

    if (!lowerQuery) {
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
    <>
      {/* Optional Navbar */}
      <Navbar />

      <div
        className="search-container"
        style={{
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* 🔍 Search Bar */}
        <div
          className="search-bar"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "2rem",
            width: "100%",
            maxWidth: "500px",
          }}
        >
          <input
            type="text"
            placeholder="Search for a course..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
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
              fontWeight: "500",
            }}
          >
            Search
          </button>
        </div>

        {/* 📚 Course Results */}
        <ul style={{ listStyle: "none", width: "100%", maxWidth: "800px", padding: 0 }}>
          {results.length > 0 ? (
            results.map((course, index) => (
              <li
                key={index}
                style={{
                  marginBottom: "1.5rem",
                  padding: "1rem",
                  borderRadius: "10px",
                  backgroundColor: "#f9f9f9",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                }}
              >
                <h3 style={{ marginBottom: "0.25rem", color: "#2740a0" }}>
                  {course.title}
                </h3>
                <p style={{ fontStyle: "italic", color: "gray", margin: 0 }}>
                  {course.class_name}
                </p>

                {/* 🟪 Description */}
                <p style={{ marginTop: "0.5rem" }}>{course.desc}</p>

                {/* 🟫 Prerequisites */}
                {course.course_prereq && course.course_prereq.length > 0 ? (
                  <p
                    style={{
                      color: "gray",
                      fontSize: "14px",
                      marginTop: "0.5rem",
                    }}
                  >
                    <strong>Prerequisites:</strong>{" "}
                    {course.course_prereq.join(", ")}
                  </p>
                ) : (
                  <p
                    style={{
                      color: "gray",
                      fontSize: "14px",
                      marginTop: "0.5rem",
                    }}
                  >
                    <strong>Prerequisites:</strong> None
                  </p>
                )}
              </li>
            ))
          ) : (
            <p>No courses found for "{query}".</p>
          )}
        </ul>
      </div>
    </>
  );
}

export default Graph;