import React from 'react';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SearchBar from './SearchBar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

const Upload = ({courses}) => {

    const [selectedCourse, setSelectedCourse] = React.useState();
    const [file, setFile] = React.useState();
    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');

    const [open, setOpen] = React.useState(false);
    const handleClick = () => { setOpen(true) };
    const handleClose = () => { setOpen(false) };

    const callApiUploadPost = async () => {
        const url = '/api/uploadPost';
        const post = new FormData();
        post.append('course', selectedCourse);
        post.append('file', file);
        post.append('title', title);
        post.append('description', description);
        try {
            const response = await fetch(url, {
                method: 'POST',
                body: post,
            });
            const body = await response.json();
            if (response.status !== 200) {
                throw Error(body.message || 'Error uploading files.');
            }
            return body;
        } catch (error) {
            console.error('Error during the upload:', error);
        }
    };

    return (
        <>
        <Fab color="primary" style={{ position: 'fixed', bottom: 25, right: 25 }} onClick={handleClick}>
            <AddIcon />
        </Fab>
        <Dialog open={open} onClose={handleClose} PaperProps={{ style: { width: '100%' }}}>
            <DialogTitle>Upload Course Content</DialogTitle>
            <DialogContent>
                <Box sx={{marginTop: "10px"}}>
                    <Typography>Select a course:</Typography>
                    <SearchBar courses={courses} label="" selectedCourse={selectedCourse} setSelectedCourse={setSelectedCourse}/>
                </Box>
                <Box sx={{marginTop: "10px"}}>
                    <Typography>Select file:</Typography>
                    <input type="file" onChange={(event) => setFile(event.target.files[0])}/>
                </Box>
                <Box sx={{marginTop: "10px"}}>
                    <Typography>Add a title:</Typography>
                    <TextField value={title} onChange={(event) => setTitle(event.target.value)}/>
                </Box>
                <Box sx={{marginTop: "10px"}}>
                    <Typography>Add a description:</Typography>
                    <TextField value={description} onChange={(event) => setDescription(event.target.value)}/>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button disabled={!selectedCourse || !file || !title} onClick={callApiUploadPost}>Upload</Button>
            </DialogActions>
        </Dialog>
        </>
    );
};
export default Upload;