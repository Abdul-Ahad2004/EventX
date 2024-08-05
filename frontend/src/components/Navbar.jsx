import React from 'react'
import { IoHome } from "react-icons/io5";
import { SiGooglemessages } from "react-icons/si";
function Navbar() {
  return (
    <>
      <div className='bg-blue-700 p-4 flex sm:gap-2 gap-1 justify-between font-semibold text-white '>
        <div className='text-xl'>EventX</div>
        <ul className='flex sm:gap-8 gap-4 justify-center items-center'>
          <li><IoHome /></li>
          <li><SiGooglemessages /></li>
        </ul>
      </div>
    </>
  )
}

export default Navbar