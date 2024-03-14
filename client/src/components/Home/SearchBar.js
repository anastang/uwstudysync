import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';


// open downwards
function SearchBar({courses}) {
  const navigate = useNavigate();

  const handleCourseSelection = (event, value) => {
    if (value) {
      // Redirect to the course page using its ID
      navigate(`/course/${value.id}`);
    }
  };

  return (
    <Autocomplete
      options={courses}
      noOptionsText="No Results"
      onChange={handleCourseSelection}
      getOptionLabel={(option) => option.title}
      PaperComponent={({ children }) => (
        <Paper style={{ position: 'relative', top: '100%' }} >
          {children}
        </Paper>
      )}
      // PaperComponent={({ children }) => (
      //   <Paper style={{ position: 'absolute' }}>
      //     {children}
      //   </Paper>
      // )}
      sx={{
        width: {
          xs: '80%',
          sm: '70%',
          md: '60%',
          lg: '50%',
        },
        '& .MuiOutlinedInput-root': {
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#000000',
          },
        },
        '& .Mui-focused': {
          color: '#cccccc',
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search Courses"
          InputLabelProps={{ style: { color: 'white' } }}
          InputProps={{
            ...params.InputProps,
            style: { color: 'white' },  
          }}
          variant="outlined"
          sx={{ borderColor: '#000000', backgroundColor: '#192124' }}
        />
      )}
    />
  );
}

export default SearchBar;
