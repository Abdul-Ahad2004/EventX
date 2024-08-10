import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

function PlannerHome() {
  const [events, setevents] = useState([]);
  const [isApplied, setisApplied] = useState(false)
  const [Id, setId] = useState()
  const Navigate = useNavigate();

  async function getevents() {
    try {
      const response = await axios.get(
        "http://localhost:5000/planner/get-events",
        {
          withCredentials: true,
        }
      );
      setevents(response.data.events);
    } catch (error) {
      console.log("Error", error);
    }
  }
  async function getId() {
    try {
      const response = await axios.get(
        "http://localhost:5000/planner/get-id",
        {
          withCredentials: true,
        }
      );
      setId(response.data.plannerId);
    } catch (error) {
      console.log("Error", error);
    }
  }
  async function applyEvent(eventId){
    try {
       await axios.post(
          `http://localhost:5000/planner/add-request/${eventId}`,{},
          {
            withCredentials: true,
          }
        );
        setisApplied(true)
        toast.success("Applied Successfully!!")
      } catch (error) {
        console.log("Error", error);
      }
  }

  function getdate(eventDate) {
    const date = new Date(eventDate);
    const formattedDate = date.toISOString().split("T")[0];
    return formattedDate;
  }
  useEffect(() => {
    try {
      getevents();
      getId()
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      <ToastContainer />
      <Navbar isClient={false}/>
      <div className="flex flex-col justify-center gap-6">
        <div className="flex justify-center items-center m-4">
          <button
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
            onClick={() => {
              Navigate("/Events");
            }}
          >
            View your Events
          </button>
        </div>
        <div>
          <h1 className="mb-2 text-2xl font-bold tracking-tight text-center text-gray-900 dark:text-white">
            Posted Events
          </h1>
          {events?.length === 0 ? (
            <div className="mb-3 font-normal text-gray-700 ">
              No Events posted by Clients
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 ">
              {events.map((event) => (
                <>
                  <div key={event._id}>
                    {event.isAssigned ? null : (
                      <>
                        <div className="ml-2 max-w-sm p-6 bg-white border  border-gray-200 rounded-lg shadow">
                          <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
                            {event.eventType}
                          </h2>
                          <div className="flex flex-col gap-1">
                            <div className="mb-3 font-normal text-gray-700">
                              Event date: {getdate(event.date)}
                            </div>
                            <div className="mb-3 font-normal text-gray-700">
                              Event Location: {event.location}
                            </div>
                            <div className="mb-3 font-normal text-gray-700">
                              Budget: {event.budget}
                            </div>
                            <div className="flex gap-1">
                              Preferences:
                              {event.preferences.map((preference) => (
                                <span
                                  key={preference}
                                  className="mb-3 font-bold text-gray-700"
                                >
                                  "{preference}"
                                </span>
                              ))}
                            </div>
                            <button
                              className="inline-flex w-20 items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
                              onClick={() => {
                                applyEvent(event._id);
                              }}
                            >
                             {isApplied || event.planners.includes(Id)? 'Applied' : 'Apply'}
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default PlannerHome;
