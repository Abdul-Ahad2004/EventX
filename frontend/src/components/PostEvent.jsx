import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./Navbar";
function PostEvent() {
  const [event, setevent] = useState("");
  const [date, setdate] = useState("");
  const [location, setlocation] = useState("");
  const [budget, setbudget] = useState("");
  const [preferences, setpreferences] = useState("");
  const [issubmitting, setissubmitting] = useState(false);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (
        event === "" ||
        date === "" ||
        location === "" ||
        budget === ""||
        preferences === ""
      ) {
        toast.error("All fields are required!");
        setissubmitting(false);
        return;
      }
    const preferencesArray = preferences.split(" ");
      await axios.post("http://localhost:5000/user/post-event", {
        eventType: event,
        date,
        location,
        budget,
        preferences:preferencesArray,
      },{withCredentials:true});
      setevent("");
      setdate("");
      setlocation("");
      setbudget("");
      setpreferences("");
      toast.success("Event posted successfully");
      setissubmitting(false);
    } catch (error) {
      toast.error(error.response?.data|| error.message);
      setissubmitting(false);
    }
  };

  return (
    <>
    <Navbar isClient={true}/>
    <div>
    <div className="flex flex-col justify-center  min-w-full items-center gap-5 min-h-screen">
      <ToastContainer />
      <h1 className="text-2xl text-blue-600 font-bold">Post Event </h1>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col  gap-3">
          <div className="flex items-center gap-1 w-full">
            <label>Event Type:</label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5"
              type="text"
              value={event}
              placeholder="Enter eventType"
              onChange={(e) => setevent(e.target.value)}
            />
          </div>
          <div className="flex  items-center gap-1">
            <label>Location:</label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5"
              type="text"
              value={location}
              placeholder="Enter location"
              onChange={(e) => setlocation(e.target.value)}
            />
          </div>
          <div className="flex  items-center gap-1">
            <label>Date:</label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5"
              type="date"
              value={date}
              placeholder="Enter location"
              onChange={(e) => setdate(e.target.value)}
            />
          </div>
          
          
          <div className="flex items-center gap-1">
            <label>Budget:</label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5"
              type="number"
              value={budget}
              placeholder="Enter budget"
              onChange={(e) => setbudget(e.target.value)}
            />
          </div>
          <div className="flex  items-center gap-1">
            <label>Preferences:</label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5"
              type="text"
              value={preferences}
              placeholder="Enter your preferences here"
              onChange={(e) => setpreferences(e.target.value)}
            />
          </div>
          
        </div>
        <div className="flex justify-center">
        <button
          type="submit"
          className={`${issubmitting?'disabled':null} inline-flex items-center px-3 py-2 text-sm font-medium text-center m-6 text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300`}
          onClick={() => setissubmitting(true)}
        >
            Post Event
        </button>
        </div>
      </form>
    </div>
    </div>
    </>
  );
}

export default PostEvent;
