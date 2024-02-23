import React from 'react';
import Navigation from '../Navigation';
import SearchBar from './SearchBar';
import Box from '@mui/material/Box';

const Home = () => {
  const [courses, setCourses] = React.useState([]);

  React.useEffect(() => {
    callApiLoadCourses().then(res => {
      const data = JSON.parse(res.express);
      const formattedCourses = data.map(course => `${course.courseCode}: ${course.courseTitle}`);
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
      <Box align="center" sx={{marginTop: '50px', marginBottom: '100px'}}>
        <SearchBar courses={courses}/>
      </Box>
    </>
  );
};
export default Home;
