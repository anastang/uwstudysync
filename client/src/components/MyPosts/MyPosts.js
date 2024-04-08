import {useState, useEffect} from 'react';
import Navigation from "../Navigation";
import PostsGrid from '../Home/PostsGrid';
import { Grid, Typography } from '@mui/material';
import SignIn from '../SignIn/index'

const MyPosts = ({authenticated, authUser}) => {

    if (authUser) {
        
        const [posts, setPosts] = useState([]);

        const callApiLoadMyPosts = async (id) => {
            const url = `/api/getMyPosts/${id}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
            });
            const body = await response.json();
            if (response.status !== 200) throw Error(body.message);
            return body;
        };

        useEffect(() => {
                callApiLoadMyPosts(authUser.uid).then(res => {
                    const data = JSON.parse(res.express);
                    setPosts(data);
                });
        }, [authUser]);

        return (
            <>
                <Navigation />
                <Grid padding={3}>
                    <Typography sx={{fontSize: "25px", fontWeight: 700}}>My Posts</Typography>
                    <PostsGrid posts={posts}/>
                </Grid>
            </>
        );
    }
    return (
        <SignIn />
    );
}

export default MyPosts;