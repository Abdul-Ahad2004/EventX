import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { BiSolidAddToQueue } from "react-icons/bi";
import { ToastContainer, toast } from "react-toastify";
import Navbar from "./Navbar";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function ManageTasks() {
  const location = useLocation();
  const { eventId } = location.state;
  const [tasks, settasks] = useState([]);
  const [Task, setTask] = useState("");
  const [view, setview] = useState("all");

  async function getTasks() {
    try {
      const response = await axios.get(
        `http://localhost:5000/user/get-tasks/${eventId}`,
        {
          withCredentials: true,
        }
      );
      settasks(response.data.tasks);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getTasks();
  }, [tasks]);

  const AddTask = async () => {
    try {
      await axios.post(
        `http://localhost:5000/user/add-tasks/${eventId}`,
        {
          Task,
        },
        {
          withCredentials: true,
        }
      );
      getTasks();
      setTask("");
      toast("Task Added!");
    } catch (error) {
      console.log(error);
    }
  };

  const DeleteTask = async (task) => {
    try {
      await axios.delete(`http://localhost:5000/user/delete-tasks/${eventId}`, {
        data: { Task: task },
        withCredentials: true,
      });
      getTasks();
      toast("Task Deleted!");
    } catch (error) {
      console.log(error);
    }
  };

  const EditTask = async (task) => {
    try {
      await axios.delete(
        `http://localhost:5000/user/delete-tasks/${eventId}`,
       
        {
            data: { Task: task },
          withCredentials: true,
        }
      );
      getTasks();
      setTask(task.task);
    } catch (error) {
      console.log(error);
    }
  };

  const handlecheckbox = async (e) => {
    try {
      let name = e.target.name;
      await axios.put(
        `http://localhost:5000/user/update-tasks/${eventId}`,{
         Task:name
        },
        {
          withCredentials: true,
        }
      );
      getTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const filtertasks = tasks.filter((item) => {
    if (view == "pending") return !item.isdone;
    else if (view == "completed") return item.isdone;
    return true;
  });

  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className=" w-[60%] ml-[20%] ">
        <div className=" flex sm:flex-row  items-center flex-col sm:gap-2 gap-1 sm:m-3 m-1">
          <input
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                AddTask();
              }
            }}
            className="p-1 border border-gray-300 rounded-lg w-full focus:outline-none focus:border-gray-600 text-black"
            value={Task}
            name="input "
            type="text"
            placeholder="Enter your task here"
          />
          <button
            onClick={() => AddTask()}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 "
          >
            <BiSolidAddToQueue />
          </button>
          <ToastContainer position="top-center" autoClose={800} />
        </div>
        <h1 className=" text-center font-bold m-4 text-2xl w-40">
         Event's Tasks
        </h1>
        <div className="buttons flex gap-3 ml-6">
          <button
            className="hover:text-blue-600 active:text-blue-600"
            onClick={() => setview("all")}
          >
            All
          </button>
          <button
            className="hover:text-blue-600 "
            onClick={() => setview("pending")}
          >
            Pending
          </button>
          <button
            className="hover:text-blue-600"
            onClick={() => setview("completed")}
          >
            Completed
          </button>
        </div>
        <div className=" m-3 flex flex-col w-3/4 border-red-900 ">
          {filtertasks.length === 0 ? (
            <div className="m-4"> No Tasks</div>
          ) : (
            <>
              {filtertasks.map((task) => (
                <div
                  key={task.task}
                  className=" flex items-center m-1 p-2 gap-2 sm:gap-5"
                >
                  <div
                    className={`sm:w-2/3 w-full flex ${
                      task.isdone ? "line-through" : ""
                    }`}
                  >
                    <input
                      className="mr-2"
                      onChange={handlecheckbox}
                      name={task.task}
                      checked={task.isdone}
                      type="checkbox"
                    />
                    {task.task}
                  </div>
                  {!task.isdone && (
                    <button
                      onClick={() => EditTask(task)}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 "
                    >
                      <FaEdit />
                    </button>
                  )}
                  <button
                    onClick={() => DeleteTask(task)}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 "
                  >
                    <MdDelete />
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      </main>
    </>
  );
}

export default ManageTasks;
