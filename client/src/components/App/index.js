import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../Home';
import MyCourses from '../MyCourses/index'
import MyProfile from '../MyProfile/index'
import MyPosts from '../MyPosts/MyPosts'
import Post from '../Post/Post'
import SignIn from '../SignIn/index'
import Notifications from '../Notifications/index'
import SignUp from '../SignUp';

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post/:post_id" element={<Post />} />
          <Route path="/mycourses" element={<MyCourses />} />
          <Route path="/myprofile" element={<MyProfile />} />
          <Route path="/myposts" element={<MyPosts />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/signup" element={<SignUp />} />


        </Routes>
      </div>
    </Router>
  );
};
export default App;