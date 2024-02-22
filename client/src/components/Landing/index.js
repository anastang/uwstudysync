import Navigation from "../Navigation";
import SearchBar from "./SearchBar";
import Box from '@mui/material/Box';

const Landing = () => {
    return (

        <>
            <Navigation/>
            <Box align='center' sx={{marginTop: '50px', marginBottom: '100px'}}>
                <SearchBar/>
            </Box>
        </>
    )
}
export default Landing;