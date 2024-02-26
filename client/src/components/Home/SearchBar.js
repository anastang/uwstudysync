import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useNavigate } from 'react-router-dom';


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
      noOptionsText="No results"
      onChange={handleCourseSelection}
      getOptionLabel={(option) => option.title}
      sx={{
        width: {
          xs: '80%',
          sm: '70%',
          md: '60%',
          lg: '50%',
        },
        '& .MuiOutlinedInput-root': {
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#00695f',
          },
        },
        '& .Mui-focused': {
          color: '#00695f',
        },
      }}
      renderInput={params => (
        <TextField
          {...params}
          label="Search Courses"
          InputProps={{
            ...params.InputProps,
            style: {color: 'black'}
          }}
        />
      )}
    />
  );
}

export default SearchBar;
