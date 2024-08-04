import React from 'react'
import UserSignup from './components/UserSignup'
import Navbar from './components/Navbar'
import Home from './components/Home'
import PlannerSignup from './components/PlannerSignup'
import Login from './components/Login'
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
} from "react-router-dom";

function App() {

  const Layout = () => {
    return (
      <div>
        <Navbar />
        <div >
            <Outlet />
        </div>
      </div>    
    )
  }

  const router = createBrowserRouter([
    {
      path: "/Home",
      element: <Home />,
    },
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/Signup",
      element: <UserSignup />,
    },
  ]);
 
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
