import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

function SearchBar({courses, label, selectedCourse, setSelectedCourse}) {
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
        }
      }}
      renderInput={params => (
        <TextField
          {...params}
          label={label}
          InputProps={{
            ...params.InputProps,
            style: {color: 'black'}
          }}
          variant="outlined"
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