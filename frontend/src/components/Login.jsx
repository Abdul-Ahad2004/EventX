import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [name, setname] = useState("");
  const [password, setpassword] = useState("");
  const [isShowing, setisShowing] = useState(false);
  const [issubmitting, setissubmitting] = useState(false);
  const [user, setuser] = useState("Client");

  const Navigate = useNavigate();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (name === "" || password === "") {
        toast.error("All fields are required!");
        setissubmitting(false);
        return;
      }

      if (user === "Client") {
        await axios.post(
          "http://localhost:5000/user/login",
          {
            username: name,
            password,
          },{
            withCredentials:true
          }
        );
        Navigate("/Home");
      } else {
        await axios.post("http://localhost:5000/planner/login", {
          username: name,
          password,
        },
        {
          withCredentials:true
        });
        Navigate("/PlannerHome");
      }
      setname("");
      setpassword("");
      setuser("Client");
      toast.success("Login successfully");
     
      setissubmitting(false);
    } catch (error) {
      toast.error(error.response?.data || error.message);
      setissubmitting(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-5 min-h-screen">
      <ToastContainer />
      <h1 className="text-2xl text-blue-600 font-bold">Login Page</h1>
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
            <label>Password:</label>
            <div className="relative w-full">
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5"
                type={isShowing ? "text" : "password"}
                value={password}
                placeholder="Enter password here"
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
            <div className="flex gap-2">
              <label>Login As?:</label>
              <div className="flex items-center">
                <label className="flex items-center mr-4">
                  <input
                    className="mr-2"
                    type="radio"
                    name="user"
                    value="Client"
                    checked={user === "Client"}
                    onChange={(e) => setuser(e.target.value)}
                  />
                  Client
                </label>
                <label className="flex items-center">
                  <input
                    className="mr-2"
                    type="radio"
                    name="user"
                    value="Planner"
                    checked={user === "Planner"}
                    onChange={(e) => setuser(e.target.value)}
                  />
                  Planner
                </label>
              </div>
            </div>
          </div>
        </div>
        <button
          type="submit"
          className={`${
            issubmitting ? "disabled" : null
          } p-1 mt-7 m-2 w-40 border border-gray-300 rounded-lg bg-blue-600 text-white`}
          onClick={() => setissubmitting(true)}
        >
          Login
        </button>
        <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
            Not registered? <Link to="/UserSignup" className="text-blue-700 hover:underline ">Create account</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
