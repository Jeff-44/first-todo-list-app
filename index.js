import express from "express";

const app = express();
const port = 3000;

const tasks = [];
const workTasks = [];

// Middlewares
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.get("/", (req, res)=>{
    res.render("index.ejs", {tasks: tasks});
});

// today's tasks creation handler
app.post("/", (req, res)=>{
    let task = req.body["task"];
    tasks.push(task);
    res.redirect("/");
});

// work tasks handler
app.get("/work", (req, res)=>{
    res.render("work.ejs", {tasks: workTasks});
})

app.post("/work", (req, res)=>{
    let work = req.body["task"];
    workTasks.push(work);
    res.redirect("/work");
})
app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
})