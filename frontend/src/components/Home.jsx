import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

function Home() {
  const [events, setevents] = useState([]);
  const [applicantNumbers, setApplicantNumbers] = useState({});
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
      <Navbar />
      <div>
        <div>
          <button>Post New event</button>
        </div>
        <div>
          <h1>Your Events</h1>
          {events?.length === 0 ? (
            <div> No Events posted by You</div>
          ) : (
            <div>
              {events.map((event) => (
                <div key={event._id}>
                  <h2>{event.eventType}</h2>
                  <div>
                    <div>Event date: {getdate(event.date)}</div>
                    <div>Event Location: {event.location}</div>
                    {!event.isAssigned && (
                      <>
                        <div>
                          Number of Applicants: {applicantNumbers[event._id]}
                        </div>
                        <button>View Applicants</button>
                      </>
                    )}
                    <div>Having an assigned Planner</div>
                    <button>Manage Event Tasks</button>
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
