import React, { useEffect } from "react";
import axios from "axios";

function Home() {
  const [events, setevents] = useState([]);
async function getApplicantsNumber(eventId){
try {
    const number= await axios.get(`http://localhost:5000/user//numberOfApplicants/${eventId}`)
    return number
} catch (error) {
    console.log("Error", error?.response.data || error.message);
}
}
  async function getevents() {
    try {
      const { eventList } = await axios.get(
        "http://localhost:5000/user/get-events"
      );
      setevents(eventList);
    } catch (error) {
      console.log("Error", error?.response.data || error.message);
    }
  }
  useEffect(() => {
    try {
      getevents();
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <div>
      <div>
        <button>Post New event</button>
      </div>
      <div>
        <h1>Your Events</h1>
        {events.length === 0 && <div> No Events posted by You</div>}
        <div>
          {events.map((event) => (
            <div key={event._id}>
              <h2>{event.eventType}</h2>
              <div>
                <div>Event date: {event.date}</div>
                <div>Event Location: {event.location}</div>
                {!event.isAssigned && (
                  <>
                    <div>
                      Number of Applicants: {getApplicantsNumber(event._id)}
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
      </div>
    </div>
  );
}

export default Home;
