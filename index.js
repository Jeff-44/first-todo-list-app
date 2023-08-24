import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";

const app = express();
const port = 3000;


// Middlewares
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

// MONGOOSE CONNECTION
function mongooseConnection(){
    try {
        mongoose.connect(process.env.CONNECTION_STRING);
        console.log("successfully connected to database");
    } catch (error) {
        console.log(error.message);
    }
}

//TASK SCHEMA
const taskSchema = new mongoose.Schema({
    taskName: String
});

// LIST SCHEMA
const listSchema = new mongoose.Schema({
    listName: {
        type: String,
        required: [1]
    },
    tasks: [taskSchema]
});

// TASK MODEL
const Task = mongoose.model("Task", taskSchema);

// LIST MODEL
const List = mongoose.model("List", listSchema);

app.get("/", async (req, res)=>{
    mongooseConnection();
    try {
        const tasks = await Task.find({});
        res.render("index.ejs", 
        {
            listTitle: toDay(),
            tasks: tasks
        });
    } catch (error) {
        console.log(error);
        res.send(error.message);
    }

});



// today's tasks creation handler
app.post("/", async (req, res)=>{
    const newTask = new Task({
        taskName: req.body.task
    });
    mongooseConnection();
    try {
        newTask.save();
        console.log("Task saved successfully");
    } catch (error) {
        console.log(error.message);
    }
    res.redirect("/");
});

// ROUTE PARAMETER

app.get("/:listTitle", async (req, res)=>{

    const listTitle = req.params.listTitle;
    const foundList = await List.findOne({listName: listTitle});

    if(foundList){
        res.render("index.ejs", {
            listTitle: listTitle,
            tasks: foundList.tasks
        });
    } else{
        const newList = new List({
            listName: listTitle,
            tasks: []
        });
        
        newList.save();
        res.redirect("/" + listTitle);
    }
});

app.post("/:listTitle", async (req, res)=>{    
    const listTitle = req.body.listTitle;
    const listToUpdate = List.findOne({listName: listTitle});
    listToUpdate.tasks.push(req.body.task);
    try {
        listToUpdate.save();
        console.log(`${listTitle} list has been updated successfully`);
    } catch (error) {
        console.log(error);
    }
    res.redirect("/" + listTitle);
});

// GET TODAY'S FULL DATE
function toDay() {
    let day = new Date();

    const days = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
        ];

    const months = [
                "January",
                "February",
                "March",
                "May",
                "April",
                "June",
                "July",
                "August",
            ];

    return days[day.getDay()] +", "+ months[day.getMonth()] +" "+ day.getDate();

}


app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
});