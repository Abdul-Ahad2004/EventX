import React, { useState,useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";

function Applications() {
  const location = useLocation();
  const { eventId } = location.state;

  const [planners, setplanners] = useState([]);
  const [review, setreview] = useState("");

  async function getplanners() {
    try {
      const response = await axios.get(
        `http://localhost:5000/user/get-planners/${eventId}`,
        {
          withCredentials: true,
        }
      );
      setplanners(response.data);
    } catch (error) {
      console.log("Error", error);
    }
  }

  useEffect(() => {
    try {
      getplanners();
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      <Navbar />
      <div>
        <h1 className="mb-2 m-2 text-2xl font-bold tracking-tight text-center text-gray-900 dark:text-white">
          Applicants Profile for Event
        </h1>
        {planners?.length === 0 ? (
          <div className="mb-3 font-normal text-gray-700 ">
            No planners Applied for this event
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 ">
            {planners.map((planner) => (
              <div
                key={planner._id}
                className="ml-2 max-w-sm p-6 bg-white border  border-gray-200 rounded-lg shadow"
              >
                <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
                  {planner.username}
                </h2>
                <div className="flex flex-col gap-1">
                  <div className="mb-3 font-normal text-gray-700">
                    Phone Number: {planner.phoneNumber}
                  </div>
                  <div className="mb-3 font-normal text-gray-700">
                    Portfolio: <a href="http://">{planner.portfolio}</a>
                  </div>
                  <div className="mb-3 font-normal text-gray-700">
                    Age: {planner.age}
                  </div>
                  <div className="mb-3 font-normal text-gray-700">
                    Gender: {planner.gender}
                  </div>
                  <div className="mb-3 font-normal text-gray-700">
                    Experience: {planner.experience} years
                  </div>
                  {review === planner._id
                    ?
                    planner.reviews.length===0?
                    <div>
                      No reviews for this Planner
                    </div>
                    : planner.reviews.map((review) => (
                        <>
                          <div className="mb-3 font-normal text-gray-700">
                            Rating: {review.ratings}
                          </div>
                          <div className="mb-3 font-normal text-gray-700">
                            Feedback: {review.feedback}
                          </div>
                        </>
                      ))
                    : null}
                    <div className="flex gap-2">
                  <button
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
                    onClick={() => {
                      review===""?
                      setreview(planner._id): setreview("")
                    }}
                  >
                    View Reviews
                  </button>
                  <button
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
                    onClick={() => {}}
                  >
                    Chat
                  </button>
                  <button
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
                    onClick={() => {}}
                  >
                    Select
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

export default Applications;
