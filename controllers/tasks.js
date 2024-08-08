import { Event } from "../models/event.js";


export class TaskController {
  static async getTasks(req,res){
    try {
      const {eventId}=req.params
     const event=await Event.findById(eventId)
     if (!event) {
      return res.status(400).json({ message: "Event does not exist" });
    }
     const tasks=event.tasks
     return res.status(200).json({tasks})

    } catch (error) {
      console.log(error)
    }
  }

  static async saveTasks(req,res){
    try {
      const{Task}=req.body
      const {eventId}=req.params
     
     const event=await Event.findById(eventId)
     if (!event) {
      return res.status(400).json({ message: "Event does not exist" });
    }
    event.tasks.push({task:Task,isdone:false})
    await event.save()
     return res.status(201).json({message:"Task has been added successfully!"})

    } catch (error) {
      console.log(error)
    }
  }

  static async deleteTasks(req,res){
    try {
      const{Task}=req.body
      const {eventId}=req.params
      
     const event=await Event.findById(eventId)
     if (!event) {
      return res.status(400).json({ message: "Event does not exist" });
    }
    const newtasks=event.tasks.filter((item) => item.task !== Task.task);
    event.tasks=newtasks
    await event.save()
     return res.status(201).json({message:"Task has been deleted successfully!"})

    } catch (error) {
      console.log(error)
    }
  }

  static async updateTasks(req,res){
    try {
      const{Task}=req.body
      const {eventId}=req.params
      
     const event=await Event.findById(eventId)
     if (!event) {
      return res.status(400).json({ message: "Event does not exist" });
    }
    const tasks=event.tasks
    
    let index = tasks.findIndex((item) => item.task === Task);
    
    let newtasks = [...tasks];
    newtasks[index].isdone = !newtasks[index].isdone;
    event.tasks=newtasks
    await event.save()
     return res.status(201).json({message:"Task has been updated successfully!"})

    } catch (error) {
      console.log(error)
    }
  }
}