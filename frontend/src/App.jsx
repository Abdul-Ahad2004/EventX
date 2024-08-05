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
import PostEvent from './components/PostEvent'
import PlannersView from './components/PlannersView'

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
      path: "/UserSignup",
      element: <UserSignup />,
    },
    {
      path: "/PlannerSignup",
      element: <PlannerSignup />,
    },
    {
      path: "/PostEvent",
      element: <PostEvent />,
    },
    {
      path: "/PlannersView",
      element: <PlannersView />,
    },
  ]);
 
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
