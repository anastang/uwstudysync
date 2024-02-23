import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

function SearchBar({courses}) {

  return (
    <Autocomplete
      options={courses}
      noOptionsText="No results"
      sx={{ width: '500px' }}
      renderInput={(params) => <TextField {...params} label="Search Courses" />}
    />
  );
}

export default SearchBar;