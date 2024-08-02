import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

function PlannerSignup() {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [age, setage] = useState(0);
  const [phoneNumber, setphoneNumber] = useState("");
  const [portfolio, setportfolio] = useState("");
  const [experience, setexperience] = useState();
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
        gender === ""||
        experience===""||
        portfolio===""
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

      await axios.post("http://localhost:5000/planner/signup", {
        username: name,
        email,
        password,
        age,
        phoneNumber,
        gender,
        experience: Number(experience),
        portfolio
      });
      setname("");
      setemail("");
      setage(0);
      setpassword("");
      setphoneNumber("");
      setportfolio("")
      setexperience("")
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
      <h1 className="text-2xl text-blue-600 font-bold">Planner Sign Up Page</h1>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col  gap-3">
          <div className="flex items-center gap-1 w-full">
            <label>Username:</label>
            <input
              className="p-1 border border-gray-300 rounded-lg w-full focus:outline-none focus:border-gray-600 text-black"
              type="text"
              value={name}
              placeholder="Enter your name here"
              onChange={(e) => setname(e.target.value)}
            />
          </div>
          <div className="flex  items-center gap-1">
            <label>Email:</label>
            <input
              className="p-1 border border-gray-300 rounded-lg w-full focus:outline-none focus:border-gray-600 text-black"
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
                className="p-1 pr-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:border-gray-600 text-black"
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
          <div className="flex  items-center gap-1">
            <label>Portfolio Link:</label>
            <input
              className="p-1 border border-gray-300 rounded-lg w-full focus:outline-none focus:border-gray-600 text-black"
              type="text"
              value={portfolio}
              onChange={(e) => setportfolio(e.target.value)}
            />
          </div>
          <div className="flex  items-center gap-1">
            <label>Experience:</label>
            <input
              className="p-1 border border-gray-300 rounded-lg w-full focus:outline-none focus:border-gray-600 text-black"
              type="text"
              value={experience}
              onChange={(e) => setexperience(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-1">
            <label>Age:</label>
            <input
              className="p-1 border border-gray-300 rounded-lg w-full focus:outline-none focus:border-gray-600 text-black"
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
              className="p-1 border border-gray-300 rounded-lg w-full focus:outline-none focus:border-gray-600 text-black"
              type="text"
              value={phoneNumber}
              placeholder="Enter your PhoneNumber here"
              onChange={(e) => setphoneNumber(e.target.value)}
            />
          </div>
          
        </div>
        <button
          type="submit"
          className={`${issubmitting?'disabled':null} p-1 m-7 w-40 border border-gray-300 rounded-lg bg-blue-600 text-white`}
          onClick={() => setissubmitting(true)}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default PlannerSignup;
