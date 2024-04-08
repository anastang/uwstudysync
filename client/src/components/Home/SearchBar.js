import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

function SearchBar({courses, label, setSelectedCourse}) {
  return (
    <Autocomplete
      options={courses}
      noOptionsText="No results"
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
      renderInput={params => (
        <TextField
          {...params}
          label={label}
          InputLabelProps={{ style: { color: 'white' } }}
          InputProps={{
            ...params.InputProps,
            style: {color: 'white'}
          }}
          variant="outlined"
          sx={{ borderColor: '#000000', backgroundColor: '#192124' }}

        />
      )}
      onChange={(event, value) => {
        if (value) {
          setSelectedCourse(value.split(':')[0]);
        } else {
          setSelectedCourse('');
        }
      }}
    />
  );
}

export default SearchBar;