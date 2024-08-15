import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";

function UserSignup() {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [age, setage] = useState(0);
  const [phoneNumber, setphoneNumber] = useState("");
  const [gender, setgender] = useState("Male");
  const [isShowing, setisShowing] = useState(false);
  const [issubmitting, setissubmitting] = useState(false);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (
        name === "" ||
        email === "" ||
        password === "" ||
        age === 0 ||
        phoneNumber === "" ||
        gender === ""
      ) {
        toast.error("All fields are required!");
        setissubmitting(false);
        return;
      }
      if (gender !== "Male" && gender !== "Female") {
        toast.error("Incorrect gender");
        setissubmitting(false);
        return;
      }
      if (phoneNumber.length !== 11) {
        toast.error("Invalid phone Number");
        setissubmitting(false);
        return;
      }

      await axios.post("http://localhost:5000/user/signup", {
        username: name,
        email,
        password,
        age,
        phoneNumber,
        gender,
      });
      setname("");
      setemail("");
      setage(0);
      setpassword("");
      setphoneNumber("");
      setgender("Male");
      toast.success("Sign Up successfully");
      setissubmitting(false);
    } catch (error) {
      toast.error(error.response?.data|| error.message);
      setissubmitting(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-5 min-h-screen">
      <ToastContainer />
      <h1 className="text-2xl text-blue-600 font-bold">Sign Up Page</h1>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col  gap-3">
          <div className="flex items-center gap-1 w-full">
            <label>Username:</label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5"
              type="text"
              value={name}
              placeholder="Enter your name here"
              onChange={(e) => setname(e.target.value)}
            />
          </div>
          <div className="flex  items-center gap-1">
            <label>Email:</label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5"
              type="email"
              value={email}
              placeholder="Enter your email here"
              onChange={(e) => setemail(e.target.value)}
            />
          </div>
          <div className="flex  items-center gap-1">
            <label>Password:</label>
            <div className="relative w-full">
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5"
                type={isShowing ? "text" : "password"}
                value={password}
                placeholder="Enter your password here"
                onChange={(e) => setpassword(e.target.value)}
              />
              <span
                className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600 "
                onClick={() => setisShowing(!isShowing)}
              >
                {isShowing ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <label>Age:</label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5"
              type="number"
              value={age}
              placeholder="Enter your age here"
              onChange={(e) => setage(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-1">
            <div className="flex gap-2">
              <label>Gender:</label>
              <div className="flex items-center">
                <label className="flex items-center mr-4">
                  <input
                    className="mr-2"
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={gender === "Male"}
                    onChange={(e) => setgender(e.target.value)}
                  />
                  Male
                </label>
                <label className="flex items-center">
                  <input
                    className="mr-2"
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={gender === "Female"}
                    onChange={(e) => setgender(e.target.value)}
                  />
                  Female
                </label>
              </div>
            </div>
          </div>
          <div className="flex  items-center gap-1">
            <label>PhoneNumber:</label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5"
              type="text"
              value={phoneNumber}
              placeholder="Enter your PhoneNumber here"
              onChange={(e) => setphoneNumber(e.target.value)}
            />
          </div>
          
        </div>
       <div className="flex items-center justify-center">
        <button
          type="submit"
          className={`${issubmitting?'disabled':null} p-1 mt-7 w-40 border border-gray-300 rounded-lg bg-blue-600 text-white`}
          onClick={() => setissubmitting(true)}
        >
            Sign Up
        </button>
        </div>
        <div className=" flex items-start">
        <Link to="/PlannerSignup" className="text-blue-700 m-2 hover:underline ">Register as  Planner?</Link>
        </div>
      </form>
    </div>
  );
}










export default UserSignup;
