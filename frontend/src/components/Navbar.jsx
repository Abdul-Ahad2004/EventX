import axios from 'axios';
import React from 'react'
import { IoHome } from "react-icons/io5";
import { SiGooglemessages } from "react-icons/si";
import { useNavigate } from 'react-router-dom';
function Navbar({isClient}) {
  const Navigate= useNavigate()

  async function gotoHomeScreen(){
    if(isClient)
    {
      Navigate('/Home')
    }
    else{
      Navigate('/PlannerHome')
    }
  }

  async function gotoMessageScreen(){
    if(isClient)
      {
        try {
          const response=await axios.get(
            "http://localhost:5000/user/get-id",
            {
              withCredentials: true,
            }
          );
          const senderId=response.data.userId
          Navigate("/Messages", {
            state: {
              senderId,
              senderModel: "User",
              receiverId: null,
              receiverModel: "Planner",
            },
          });
        } catch (error) {
          console.log("Error", error);
        }
      }
      else{
        try {
          const response=await axios.get(
            "http://localhost:5000/planner/get-id",
            {
              withCredentials: true,
            }
          );
          const senderId=response.data.plannerId
          Navigate("/Messages", {
            state: {
              senderId,
              senderModel: "Planner",
              receiverId: null,
              receiverModel: "User",
            },
          });
        } catch (error) {
          console.log("Error", error);
        }
      }
  }

  async function Logout(){
    if(isClient)
    {
      try {
        await axios.post(
          "http://localhost:5000/user/logout",{},
          {
            withCredentials: true,
          }
        );
      } catch (error) {
        console.log("Error", error);
      }
    }
    else{
      try {
        await axios.post(
          "http://localhost:5000/planner/logout",{},
          {
            withCredentials: true,
          }
        );
      } catch (error) {
        console.log("Error", error);
      }
    }
    Navigate('/')
  }
  return (
    <>
      <div className='bg-blue-700 p-4 flex sm:gap-2 gap-1 justify-between font-semibold text-white '>
        <div className='text-xl'>EventX</div>
        <ul className='flex sm:gap-8 gap-4 justify-center items-center'>
          <li className="hover:cursor-pointer" onClick={()=>gotoHomeScreen()}><IoHome /></li>
          <li className="hover:cursor-pointer" onClick={()=>gotoMessageScreen()}><SiGooglemessages /></li>
          <li>
            <button
          className=" p-1  w-20 border border-gray-300 rounded-lg bg-white text-blue-600"
          onClick={() => Logout()}
        >
          Logout
        </button>
          </li>
        </ul>
      </div>
    </>
  )
}

export default Navbar