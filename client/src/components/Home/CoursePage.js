import React from 'react';
import { useParams } from 'react-router-dom';

const CoursePage = ({ courses }) => {
  const { id } = useParams();

  console.log("Course ID:", id); // Add this line to log the id

  // Find the course with the matching id
  const selectedCourse = courses.find(course => course.id === id);

  return (
    <div>
      <h1>Course Details</h1>
      {selectedCourse ? (
        <div>
          <p>Course ID: {selectedCourse.id}</p>
          <p>Course Title: {selectedCourse.title}</p>
          {/* Render other course details here */}
        </div>
      ) : (
        <p>Course not found</p>
      )}
    </div>
  );
};

export default CoursePage;
