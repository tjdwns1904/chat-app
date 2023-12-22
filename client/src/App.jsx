import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './NotLoggedIn/Login';
import SignUp from './NotLoggedIn/SignUp';
import axios from 'axios';
import Friends from './LoggedIn/Friends';
import Loading from './Loading';
import Main from './LoggedIn/Main';
import Chats from './LoggedIn/Chats';
import Profile from './LoggedIn/Profile';
import ChatRoom from './LoggedIn/ChatRoom';

function App() {
  axios.defaults.withCredentials = true;
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const auth = () => {
    axios.get("http://localhost:3000/auth")
      .then((res) => {
        if (res.data.isLoggedIn) {
          setIsLoggedIn(true);
          setUser(res.data.user[0]);
        } else {
          setIsLoggedIn(false);
        }
      })
      .finally(() => setIsLoading(false));
  };
  useEffect(() => {
    auth();
  }, []);
  if (isLoading) {
    return (
      <Loading />
    )
  } else {
    if(!isLoggedIn){
      return (
        <>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<Login />} />
              {!isLoggedIn && <Route path='/signup' element={<SignUp />} />}
            </Routes>
          </BrowserRouter>
        </>
      )
    }else{
      return(
        <BrowserRouter>
            <Routes>
              <Route path='/' element={<Main user={user} />}>
                <Route path='/' element={<Friends user={user}/>}/>
                <Route path='/chats' element={<Chats user={user}/>}/>
                <Route path='/profile' element={<Profile user={user}/>}/>
              </Route>
            </Routes>
          </BrowserRouter>
      )
    }
  }
}

export default App
