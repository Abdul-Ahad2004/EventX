import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

function Home() {
  const [events, setevents] = useState([]);
  const [applicantNumbers, setApplicantNumbers] = useState({});
  const [review, setreview] = useState(false);
  const [rating, setrating] = useState("");
  const [feedback, setfeedback] = useState("");
  const Navigate = useNavigate();
  async function getApplicantsNumber(eventId) {
    try {
      const response = await axios.get(
        `http://localhost:5000/user/numberOfApplicants/${eventId}`,
        {
          withCredentials: true,
        }
      );
      return await response.data.number;
    } catch (error) {
      console.log("Error", error?.response.data || error.message);
    }
  }

  async function postreview(plannerId) {
    try {
      if(rating==="" || feedback==="")
      {
        toast.error("All fields are required")
        return
      }
      if(rating<0 || rating>5){
        toast.error("Rating must be between 1-5")
        return
      }
      await axios.post(
        `http://localhost:5000/user/post-review/${plannerId}`,
        {
          feedback,
          rating,
        },
        {
          withCredentials: true,
        }
      );
      toast.success("Review has been posted!!");
      setreview(false);
      setrating("")
      setfeedback("")
    } catch (error) {
      console.log("Error", error?.response.data || error.message);
    }
  }
  async function getevents() {
    try {
      const response = await axios.get(
        "http://localhost:5000/user/get-events",
        {
          withCredentials: true,
        }
      );
      setevents(response.data.eventlist);

      const applicantsPromises = response.data.eventlist.map(async (event) => {
        const number = await getApplicantsNumber(event._id);
        return { [event._id]: number };
      });

      const applicantsNumbers = await Promise.all(applicantsPromises);
      const applicantNumbersMap = applicantsNumbers.reduce(
        (acc, curr) => ({ ...acc, ...curr }),
        {}
      );
      setApplicantNumbers(applicantNumbersMap);
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
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
     <ToastContainer />
      <Navbar isClient={true} />
      <div className="flex flex-col justify-center gap-6">
        <div className="flex justify-center items-center m-4">
          <button
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
            onClick={() => {
              Navigate("/PostEvent");
            }}
          >
            Post New event
          </button>
        </div>
        <div>
          <h1 className="mb-2 text-2xl font-bold tracking-tight text-center text-gray-900 dark:text-white">
            Your Events
          </h1>
          {events?.length === 0 ? (
            <div className="mb-3 font-normal text-gray-700 ">
              {" "}
              No Events posted by You
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
                    {!event.isAssigned ? (
                      <>
                        <div className="mb-3 font-normal text-gray-700">
                          Number of Applicants: {applicantNumbers[event._id]}
                        </div>
                        {applicantNumbers[event._id] === 0 ? null : (
                          <button
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
                            onClick={() => {
                              Navigate("/Applications", {
                                state: { eventId: event._id },
                              });
                            }}
                          >
                            View Applicants
                          </button>
                        )}
                      </>
                    ) : (
                      <>
                        {review ? (
                          <>
                            <div className="flex gap-1 flex-col">
                              <div className="flex items-center gap-1 w-full">
                                <label>Rating:</label>
                                <input
                                  className="p-1 border border-gray-300 rounded-lg w-full focus:outline-none focus:border-gray-600 text-black"
                                  type="Number"
                                  min="1"
                                  max="5"
                                  value={rating}
                                  onChange={(e) => setrating(e.target.value)}
                                />
                              </div>

                              <div className="flex  items-center gap-1">
                                <label>Feedback:</label>
                                <input
                                  className="p-1 border border-gray-300 rounded-lg w-full focus:outline-none focus:border-gray-600 text-black"
                                  type="text"
                                  value={feedback}
                                  placeholder="Enter your feedback here"
                                  onChange={(e) => setfeedback(e.target.value)}
                                />
                              </div>
                              <button
                                type="submit"
                                className=" p-1 m-7 w-40 border border-gray-300 rounded-lg bg-blue-600 text-white"
                                onClick={() =>
                                  postreview(event.assignedPlanner)
                                }
                              >
                                Post
                              </button>
                            </div>
                          </>
                        ) : null}
                        <div className="mb-3 font-bold  text-gray-700">
                          Having an assigned Planner
                        </div>
                        <div className="flex gap-1">
                          <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
                           onClick={() => {
                            Navigate("/ManageTasks", {
                              state: { eventId: event._id },
                            });
                          }}>
                            Manage Event Tasks
                          </button>
                          <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
                            Chat with Planner
                          </button>
                          <button
                            className={` ${
                              review ? "disabled" : null
                            }inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300`}
                            onClick={() => {
                              setreview(true);
                            }}
                          >
                            Post Reviews
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
