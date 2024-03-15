import React from 'react';
import Box from '@mui/material/Box';
import Navigation from '../Navigation';
import SearchBar from './SearchBar';
import PostsGrid from './PostsGrid';
import Upload from './Upload';

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
      <Box align="center" marginY={'50px'}>
        <SearchBar courses={courses} label="Search Courses" selectedCourse={selectedCourse} setSelectedCourse={setSelectedCourse}/>
      </Box>
      <Box align="center" marginX={2}>
        <PostsGrid posts={posts}/>
      </Box>
      <Upload courses={courses}/>
    </>
  );
};
export default Home;