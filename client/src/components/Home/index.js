import React from 'react';
import Navigation from '../Navigation';
import SearchBar from './SearchBar';
import CoursePage from './CoursePage';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';



const Home = () => {
  const [courses, setCourses] = React.useState([]);

  React.useEffect(() => {
    callApiLoadCourses().then(res => {
      const data = JSON.parse(res.express);
      const formattedCourses = data.map(course => ({
        id: course.id, // assuming each course has a unique identifier
        title: `${course.courseCode}: ${course.courseTitle}`
      }));
      setCourses(formattedCourses);
    });
  }, []);

  const callApiLoadCourses = async () => {
    const url = '/api/getCourses';
    const response = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  return (
    <>
      <Navigation />
      <Box align="center" sx={{marginTop: '250px', marginBottom: '100px'}}>
        <Typography variant="h3" gutterBottom>
          Lets Learn, Together
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ marginBottom: '20px' }}>
          Find student-uploaded content on popular courses.
        </Typography>
        <Routes>
          <Route path="/" element={<SearchBar courses={courses} />} />
          {/* Define route for individual course pages */}
          <Route path="/course/:id" element={<CoursePage />} />
        </Routes>
      </Box>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <Home />
    </Router>
  );
};
export default Home;
