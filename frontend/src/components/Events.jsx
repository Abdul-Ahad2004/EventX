import React, { useState, useEffect } from "react";
import {  useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";

function Events() {

  const [events, setevents] = useState([]);
  const [Id, setId] = useState()
  const Navigate = useNavigate();
  async function getevents() {
    try {
      const response = await axios.get(
        "http://localhost:5000/planner/my-events",
        {
          withCredentials: true,
        }
      );
      setevents(response.data.events);
    } catch (error) {
      console.log("Error1", error);
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

  useEffect(() => {
    try {
      getevents();
      getId();
    } catch (error) {
      console.log(error);
    }
  }, []);

  function getdate(eventDate) {
    const date = new Date(eventDate);
    const formattedDate = date.toISOString().split("T")[0];
    return formattedDate;
  }

  return (
    <>
      <Navbar isClient={false} />
      <div>
        <h1 className="mb-2 m-2 text-2xl font-bold tracking-tight text-center text-gray-900 dark:text-white">
          Your Events
        </h1>
        {events?.length === 0 ? (
          <div className="mb-3 font-normal text-gray-700 ">
            You have no events
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 ">
            {events.map((event) => (
              <div
                key={event._id}
                className="ml-2 max-w-sm p-6 bg-white border  border-gray-200 rounded-lg shadow"
              >
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
                  <div className="flex gap-2">
                    <button
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
                      onClick={() => {
                        Navigate("/ManageTasks", {
                            state: { eventId: event._id,isClient:false },
                          });
                      }}
                    >
                      View Tasks
                    </button>
                    <button
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
                      onClick={() => {Navigate("/Messages", {
                        state: {
                          senderId: Id,
                          senderModel: "Planner",
                          receiverId: event.user,
                          receiverModel: "User",
                        },
                      });}}
                    >
                      Chat
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Events;
