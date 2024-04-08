import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import { format } from 'date-fns';
import Rating from '@mui/material/Rating';

function PostsGrid({ posts }) {
    return (
        <Grid container spacing={3}>
            {posts.map((post) => (
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={post.id} align="center" >
                    <Card sx={{width: "100%"}}>
                        <CardActionArea component={Link} to={`/post/${post.id}`}>
                            <CardContent align="left">
                                <Typography gutterBottom sx={{fontWeight: 700, fontSize: '20px'}}>
                                    {post.title}
                                </Typography>
                                <Typography sx={{fontSize: '15px'}}>
                                   Rating: {post.rating === null ? "Not available" : <Rating readOnly value={post.rating}/>}
                                </Typography>
                                <Typography sx={{fontSize: '15px'}}>
                                   Date Posted: {format(new Date(post.date_posted), 'MM-dd-yyyy')}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}

export default PostsGrid;
