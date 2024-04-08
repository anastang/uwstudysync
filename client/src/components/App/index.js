import React, {useState, useEffect, useContext} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../Home';
import MyCourses from '../MyCourses/index'
import MyProfile from '../MyProfile/index'
import MyPosts from '../MyPosts/MyPosts'
import Post from '../Post/Post'
import SignIn from '../SignIn/index'
import SignUp from '../SignUp';
import {FirebaseContext} from '../Firebase';

const App = () => {

  const [authUser, setAuthUser] = useState(null);
  const firebase = useContext(FirebaseContext); 
  
  useEffect(() => {
    if (firebase) {
      const listener = firebase.auth.onAuthStateChanged(user => {
        if (user) {
          setAuthUser(user);
        } else {
          setAuthUser(null);
        }
      });
      return () => listener();
    }
  }, [firebase]);

  const authenticated = !!authUser;

  const routes = [
    {path: "/", component: <Home authenticated={authenticated} authUser={authUser} />},
    {path: "/post/:post_id", component: <Post authenticated={authenticated} authUser={authUser} />},
    {path: "/mycourses", component: <MyCourses authenticated={authenticated} authUser={authUser} />},
    {path: "/myprofile", component: <MyProfile authenticated={authenticated} authUser={authUser} />},
    {path: "/myposts", component: <MyPosts authenticated={authenticated} authUser={authUser} />},
    {path: "/signin", component: <SignIn authenticated={authenticated} authUser={authUser} />},
    {path: "/signup", component: <SignUp authenticated={authenticated} authUser={authUser} />},

  ]

  return (
    <Router>
      <div>
        <Routes>
          {routes.map((route) => (
            <Route path={route.path} element={route.component}/>
          ))}
        </Routes>
      </div>
    </Router>
  );
};
export default App;