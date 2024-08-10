import React, { useState,useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import { toast } from "react-toastify";

function Applications() {
  const location = useLocation();
  const { eventId } = location.state;
  const [Id, setId] = useState()

  const [planners, setplanners] = useState([]);
  const [review, setreview] = useState("");
const Navigate=useNavigate()
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
      console.log("Error1", error);
    }
  }
  async function getId() {
    try {
      const response = await axios.get(
        "http://localhost:5000/user/get-id",
        {
          withCredentials: true,
        }
      );
      setId(response.data.userId);
    } catch (error) {
      console.log("Error", error);
    }
  }
async function assignPlanner(plannerId){
  try {
     await axios.post(
      `http://localhost:5000/user/set-planner/${eventId}/${plannerId}`,{},
      {
        withCredentials: true,
      }
    );
    toast.success("Planner has been assigned to this planner")
    Navigate('/Home')
  } catch (error) {
    console.log("Error2", error);
  }
}
  useEffect(() => {
    try {
      getplanners();
      getId()
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      <Navbar isClient={true} />
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
                    Portfolio: <a href="http://" target="_blank">{planner.portfolio}</a>
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
                    ?<>
                      <h3 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">Reviews</h3>
                    {planner.reviews.length===0?
                    <div>
                      No reviews for this Planner
                    </div>
                    : planner.reviews.map((review,index) => (
                        <>
                        <div key={index} className="h-0.5 bg-gray-700 gray"></div>
                          <div className="mb-3 font-normal text-gray-700">
                          <span className="font-bold"> Rating: </span>{review.ratings}
                          </div>
                          <div className="mb-3 font-normal text-gray-700">
                            <span className="font-bold"> Feedback: </span> {review.feedback}
                          </div>
                          
                        </>
                      ))
                    }</>: null}
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
                    onClick={() => {
                      Navigate("/Messages", {
                        state: {
                          senderId: Id,
                          senderModel: "User",
                          receiverId: planner._id,
                          receiverModel: "Planner",
                        },
                      });
                    }}
                  >
                    Chat
                  </button>
                  <button
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
                    onClick={() => {assignPlanner(planner._id)}}
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
