import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

function SearchBar() {
  return (
    <Paper
        component="form"
        sx={{ p: '2px 4px', display: 'flex',  width: '500px'}}
    >
    <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search Courses"
    />
    <IconButton type="button" sx={{ p: '10px' }}>
        <SearchIcon />
    </IconButton>
    </Paper>
  );
}

export default SearchBar;