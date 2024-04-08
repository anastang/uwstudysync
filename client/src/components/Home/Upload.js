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
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

const Upload = ({courses, authUser}) => {

    const [selectedCourse, setSelectedCourse] = React.useState();
    const [file, setFile] = React.useState();
    const [fileType, setFileType] = React.useState('');
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
        post.append('fileType', fileType);
        post.append('title', title);
        post.append('description', description);
        post.append('user_id', authUser.uid);
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

    const callApiUploadLink = async () => {
        const url = '/api/uploadLink';
        const payload = {
            course: selectedCourse,
            title,
            description,
            user_id: authUser.uid,
        };
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
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
                    <Typography>Select type:</Typography>
                    <FormControl>
                        <RadioGroup value={fileType} onChange={(event) => {setFileType(event.target.value)}}>
                            <FormControlLabel value="IMG" control={<Radio />} label="IMG (JPG, PNG, etc)" />
                            <FormControlLabel value="PDF" control={<Radio />} label="PDF" />
                            <FormControlLabel value="Link" control={<Radio />} label="Link (please provide the link in the description)" />
                        </RadioGroup>
                    </FormControl>
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
                <Button disabled={fileType === "Link" ? (!selectedCourse || !title || !description) : (!selectedCourse || !file || !title)} onClick={fileType === "Link" ? callApiUploadLink : callApiUploadPost}>Upload</Button>
            </DialogActions>
        </Dialog>
        </>
    );
};
export default Upload;