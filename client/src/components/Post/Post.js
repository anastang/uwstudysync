import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Button, TextField, Typography, Rating, Paper, Box, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

const Post = () => {
    let { post_id } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(5); // Default rating value
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        const loadPostData = async () => {
            const response = await fetch(`/api/getPost/${post_id}`);
            const postData = await response.json();
            if (response.ok) {
                setPost(postData.express ? JSON.parse(postData.express)[0] : {});
            }
        };

        const loadComments = async () => {
            const response = await fetch(`/api/posts/${post_id}/comments`);
            const data = await response.json();
            if (response.ok) {
                setComments(data.comments);
            }
        };

        const loadAverageRating = async () => {
            const response = await fetch(`/api/posts/${post_id}/averageRating`);
            const data = await response.json();
            if (response.ok) {
                setAverageRating(data.average);
            }
        };

        loadPostData();
        loadComments();
        loadAverageRating();
    }, [post_id]);

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const submitComment = async () => {
        try {
            const response = await fetch(`/api/posts/${post_id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ comment }),
            });

            setComment('');

            if (response.ok) {
                const newData = await fetch(`/api/posts/${post_id}/comments`);
                const data = await newData.json();
                setComments(data.comments);
                setSnackbarMessage('Comment submitted successfully!');
                setSnackbarOpen(true);
            } else {
                console.error('Failed to submit comment');
            }
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };

    const submitRating = async () => {
        try {
            await fetch(`/api/posts/${post_id}/ratings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rating }),
            });
            const response = await fetch(`/api/posts/${post_id}/averageRating`);
            const data = await response.json();
            if (response.ok) {
                setAverageRating(data.average);
                setSnackbarMessage('Rating submitted successfully!');
                setSnackbarOpen(true);
            } else {
                console.error('Failed to submit rating');
            }
        } catch (error) {
            console.error('Error submitting rating:', error);
        }
    };

    if (!post) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box sx={{ flexGrow: 1, padding: 4 }}>
            <Paper elevation={3} sx={{ padding: 3, marginBottom: 4 }}>
                <Typography variant="h4" gutterBottom>
                    {post.title}
                </Typography>
                <img src={post.file} alt={post.title} style={{ width: '100%', maxHeight: '500px', objectFit: 'cover', marginBottom: '20px' }} />
                <Typography variant="body1" gutterBottom>
                    {post.description}
                </Typography>
                <Typography variant="caption" display="block" gutterBottom>
                    {`Posted on: ${post.date_posted}`}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 2 }}>
                    <Typography component="legend">Rate this post:</Typography>
                    <Rating
                        name="post-rating"
                        value={rating}
                        onChange={(event, newValue) => setRating(newValue)}
                    />
                    <Button variant="contained" color="primary" onClick={submitRating}>
                        Submit Rating
                    </Button>
                    <Typography variant="subtitle1">({averageRating.toFixed(1)})</Typography>
                </Box>
            </Paper>

            <TextField
                label="Leave a comment"
                multiline
                rows={4}
                fullWidth
                variant="outlined"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                margin="normal"
                sx={{ marginBottom: 2 }}
            />
            <Button variant="contained" color="primary" onClick={submitComment} sx={{ marginBottom: 4 }}>
                Submit Comment
            </Button>

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <MuiAlert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>

            {Array.isArray(comments) && comments.length > 0 && (
                <Typography variant="h6" style={{ marginTop: '20px', marginBottom: '10px' }}>Comments:</Typography>
            )}
            {Array.isArray(comments) && comments.map((comment, index) => (
                <Paper key={index} elevation={2} sx={{ padding: 2, marginBottom: 2 }}>
                    <Typography variant="body1">
                        {comment.comment}
                    </Typography>
                </Paper>
            ))}
            {Array.isArray(comments) && comments.length === 0 && (
                <Typography variant="subtitle1" style={{ marginTop: '20px' }}>No comments yet.</Typography>
            )}
        </Box>
    );
};

export default Post;
