import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from '../Landing';
import MyCourses from '../MyCourses'
import MyProfile from '../MyProfile'



const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/mycourses" element={<MyCourses />} />
          <Route path="/myprofile" element={<MyProfile />} />

        </Routes>
      </div>
    </Router>
  );
};
export default App;

