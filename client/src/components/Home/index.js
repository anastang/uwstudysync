import React from 'react';
import Box from '@mui/material/Box';
import Navigation from '../Navigation';
import SearchBar from './SearchBar';
import PostsGrid from './PostsGrid';
import Upload from './Upload';
import Typography from '@mui/material/Typography';


const Home = () => {
  const [courses, setCourses] = React.useState([]);
  const [selectedCourse, setSelectedCourse] = React.useState();
  const [posts, setPosts] = React.useState([]);

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

  React.useEffect(() => {
    if (selectedCourse) { 
      callApiLoadPosts().then(res => {
        const data = JSON.parse(res.express);
        setPosts(data);
      });
    }
  }, [selectedCourse]);

  const callApiLoadPosts = async () => {
    const url = '/api/getPosts';
    const response = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ course: selectedCourse }), 
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  return (
    <>
      <Navigation />
      {/* Gradient Background */}
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#161d20'
        }}
      />
      
      {/* Centered Content */}
      <Box
        align="center"
        sx={{
          marginTop: '250px',
          marginBottom: '100px',
          position: 'relative',
          zIndex: 1, // Ensure content is above the gradient background
        }}
      >
        <Typography variant="h3" gutterBottom color="white">
          Lets Learn, Together
        </Typography>
        <Typography variant="h5" gutterBottom color="white" sx={{ marginBottom: '20px' }}>
          Find student-uploaded content on popular courses.
        </Typography>
        
        {/* Search Bar */}
        <Box align="center" marginY={'10px'}>
          <SearchBar courses={courses} label="Search Courses" selectedCourse={selectedCourse} setSelectedCourse={setSelectedCourse}/>
        </Box>
        
      </Box>
      
      {/* Posts Grid */}
      <Box align="center" marginX={2}>
        <PostsGrid posts={posts}/>
      </Box>
      
      {/* Upload Component */}
      <Upload courses={courses}/>
    </>
  );
};
export default Home;