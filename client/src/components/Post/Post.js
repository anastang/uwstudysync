import { useParams } from 'react-router-dom';
import React from "react";
import Grid from "@mui/material/Grid";
import { TextField, Typography, Rating } from '@mui/material';
 
const Post = () => {
    let { post_id } = useParams();
    const [post, setPost] = React.useState();

    React.useEffect(() => {
        callApiLoadPost(post_id).then(res => {
          const data = JSON.parse(res.express);
          setPost(data[0]);
          console.log(data);
        });
    }, [post_id]);
      
    const callApiLoadPost = async (post_id) => {
        const url = `/api/getPost/${post_id}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        });
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    };

    if (post) { 
        return (
            <Grid container>
                <Grid item xs={8}>
                    <img src={`${post.file}`} width={250} height={250}>
                    </img>
                    <Typography>
                        {post.title}
                    </Typography>
                    <Typography>
                        {post.date_posted}
                    </Typography>
                    <Typography>
                        {post.description}
                    </Typography>
                </Grid>
                <Grid item xs={4}>
                    <Rating />
                    <TextField label="Comments"/>
                </Grid>
            </Grid>
        );
    }

}
export default Post;