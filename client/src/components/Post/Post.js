import { useParams } from 'react-router-dom';
import React from "react";
import Grid from "@mui/material/Grid";
import { Button, TextField, Typography, Rating } from '@mui/material';
import Navigation from '../Navigation';
import { format } from 'date-fns';
import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

const Post = () => {
    let { post_id } = useParams();
    const [post, setPost] = React.useState();

    const [numPages, setNumPages] = React.useState(null);
    const [pageNumber, setPageNumber] = React.useState(1); // Current page number

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    React.useEffect(() => {
        callApiLoadPost(post_id).then(res => {
            const data = JSON.parse(res.express);
            setPost(data[0]);
        });
    }, [post_id]);

    const callApiLoadPost = async (post_id) => {
        const url = `/api/getPost/${post_id}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
        });
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    };

    const changePage = (offset) => {
        setPageNumber(prevPageNumber => prevPageNumber + offset);
    }

    const previousPage = () => {
        changePage(-1);
    }

    const nextPage = () => {
        changePage(1);
    }

    if (post) { 
        return (
            <>
            <Navigation/>
            <Grid container>
                <Grid item xs={8}>
                    <Grid item xs={12} margin={3}>
                        <Typography sx={{ fontWeight: 700, fontSize: '30px' }}>{post.title}</Typography>
                    </Grid>
                    <Document file={post.file} onLoadSuccess={onDocumentLoadSuccess}>
                        <Page pageNumber={pageNumber} />
                    </Document>
                    <div>
                        <Button disabled={pageNumber <= 1} onClick={previousPage}>Previous</Button>
                        <Button disabled={pageNumber >= numPages} onClick={nextPage}>Next</Button>
                    </div>
                    <Typography>Page {pageNumber} of {numPages}</Typography>
                    <Grid item xs={12} margin={3}>
                        <Typography>Description: {post.description}</Typography>
                    </Grid>
                    <Grid item xs={12} margin={3}>
                        <Typography>Date Posted: {format(new Date(post.date_posted), 'MM-dd-yyyy')}</Typography>
                    </Grid>
                </Grid>
                <Grid item xs={4}>
                    <Grid item xs={12} margin={3}>
                        <Typography sx={{ fontWeight: 700, fontSize: '30px' }}>Review this post</Typography>
                    </Grid>
                    <Grid item xs={12} margin={3}>
                        Rating:
                        <Rating/>
                    </Grid>
                    <Grid item xs={12} margin={3}>
                        Comments: <TextField multiline rows={8} sx={{width:"100%"}}/>
                    </Grid>
                </Grid>
            </Grid>
            </>
        );
    }
}
export default Post;
