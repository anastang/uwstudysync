import React from 'react';
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Navigation from '../Navigation';
import SearchBar from './SearchBar';
import PostsGrid from './PostsGrid';
import Upload from './Upload';
import Fab from '@mui/material/Fab';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarIcon from '@mui/icons-material/Star';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox' ;
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const Home = ({authenticated, authUser}) => {
  
  const [courses, setCourses] = React.useState([]);
  const [selectedCourse, setSelectedCourse] = React.useState();
  const [posts, setPosts] = React.useState([]);
  const [favCourses, setFavCourses] = React.useState([]);
  const [filteredPosts, setFilteredPosts] = React.useState(posts);
  const [filter, setFilter] = React.useState([]);

  const [sort, setSort] = React.useState("oldest");

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

  const callApiGetFavCourses = async (id) => {
    const url = `/api/getFavCourses/${id}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'}, 
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  React.useEffect(() => {
    if (authUser) { 
      callApiGetFavCourses(authUser.uid).then(res => {
        const data = JSON.parse(res.express);
        const courses = data.map(item => item.courseCode);
        setFavCourses(courses);
        console.log(courses);
      });
    }
  }, [authUser]);

  const callApiAddFavCourse = async () => {
    const url = '/api/addFavCourse';
    const response = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ courseCode: selectedCourse, id: authUser.uid }), 
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  const callApiRemoveFavCourse = async () => {
    const url = '/api/removeFavCourse';
    const response = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ courseCode: selectedCourse, id: authUser.uid }), 
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  const handleFavCourse = async () => { 
    try {
      if (favCourses.includes(selectedCourse)) { 
        await callApiRemoveFavCourse();
      } else {
        await callApiAddFavCourse();
      }
      const res = await callApiGetFavCourses(authUser.uid);
      const courses = JSON.parse(res.express).map(item => item.courseCode);
      setFavCourses(courses);
      console.log(courses);
    } catch (error) {
      console.error('Error handling favorite course:', error);
    }
  }

  React.useEffect(() => {
    let sortedFilteredPosts = [...posts];

    if (sort === "newest") {
      sortedFilteredPosts.sort((a, b) => new Date(b.date_posted) - new Date(a.date_posted));
    } else if (sort === "oldest") {
      sortedFilteredPosts.sort((a, b) => new Date(a.date_posted) - new Date(b.date_posted));
    } else if (sort === "rating") {
      sortedFilteredPosts.sort((a, b) => b.rating - a.rating);
    }
    if (filter.length > 0) {
      sortedFilteredPosts = sortedFilteredPosts.filter(post => filter.includes(post.file_type));
    }
    setFilteredPosts(sortedFilteredPosts);
  }, [posts, filter, sort]);
  

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
        <Grid align="center" marginY={'10px'}>
          <SearchBar courses={courses} label="Search Courses" selectedCourse={selectedCourse} setSelectedCourse={setSelectedCourse}/>
        </Grid>

        <Grid>
          <Autocomplete
            multiple
            options={["PDF", "IMG", "Link"]}
            disableCloseOnSelect
            onChange={(event, newValue) => {setFilter(newValue)}}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option}
              </li>
            )}
            style={{ width: 500 }}
            renderInput={(params) => (
              <TextField {...params} label="Filter" />
            )}
          />
        </Grid>

        <Grid paddingTop={2}>
          <FormControl variant="standard">
            <InputLabel>Sort by</InputLabel>
            <Select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              label="Sort by"
            >
              <MenuItem value={"oldest"}>Oldest to newest</MenuItem>
              <MenuItem value={"newest"}>Newest to oldest</MenuItem>
              <MenuItem value={"rating"}>Rating (highest to lowest)</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        
      </Box>
      
      {/* Posts Grid */}
      <Box align="center" marginX={2}>
        <PostsGrid posts={filteredPosts} />
      </Box>
      
      {/* Upload Component */}
      {authUser && <Upload courses={courses} authUser={authUser}/>}
      {(authUser && selectedCourse) && 
        <Fab style={{ position: 'fixed', bottom: 100, right: 25 }} onClick={() => handleFavCourse()}>
          {favCourses.includes(selectedCourse) ? <StarIcon/> : <StarOutlineIcon/>}
        </Fab>
      }
      
    </>
  );
};
export default Home;