import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Navigation from "../Navigation";
import SignIn from '../SignIn'
import PostsGrid from '../Home/PostsGrid';

const MyCourses = ({authenticated, authUser}) => {

    const [favCourses, setFavCourses] = useState([]);

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

    const callApiLoadPosts = async (course) => {
        const url = '/api/getPosts';
        const response = await fetch(url, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ course }), 
        });
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    };

    useEffect(() => {
        if (authUser) { 
            callApiGetFavCourses(authUser.uid).then(res => {
                const data = JSON.parse(res.express);
                const courseCodes = data.map(item => item.courseCode);
                
                const favCoursesWithPostsPromises = courseCodes.map(courseCode => 
                    callApiLoadPosts(courseCode).then(res => {
                        const postsData = JSON.parse(res.express);
                        return { courseCode, posts: postsData };
                    })
                );

                Promise.all(favCoursesWithPostsPromises).then(favCoursesWithPosts => {
                    setFavCourses(favCoursesWithPosts);
                });
            }).catch(error => console.error('Error loading favorite courses:', error));
        }
    }, [authUser]);

    if (!authUser) {
        return <SignIn />;
    }

    return (
        <>
            <Navigation/>
            <Grid padding={3}>
                <Typography sx={{fontSize: "25px", fontWeight: 700}}>My Courses</Typography>
                {favCourses.map(({ courseCode, posts }) => (
                    <Accordion key={courseCode}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                        >
                            <Typography>{courseCode}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <PostsGrid posts={posts} />
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Grid>
        </>
    );
}

export default MyCourses;