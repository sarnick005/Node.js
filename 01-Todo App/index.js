const mysql = require('mysql2');
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const { v4: uuidv4 } = require('uuid');
const { log } = require('console');


app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use('/public', express.static('public'));

const config = require('./config.js');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'todo_app',
    password: config.mysql.password
});

app.get("/", (req, res)=>{
    res.render("home");
});
//  ADD TASK
app.get("/task/add", (req, res)=>{
    res.render("addTask");
});

app.post("/task/add", (req, res)=>{
    let {taskTitle, task, dueDate, dueTime}= req.body;
    console.log(taskTitle);
    console.log(task);
    console.log(dueDate);
    console.log(dueTime);
    let id = uuidv4();
    let status = false;
    console.log(id);
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1; 
    const day = today.getDate();
    const hours = today.getHours();
    const minutes = today.getMinutes();
    const seconds = today.getSeconds();
    const currentDate = `${year}-${month}-${day}`;
    const currentTime = `${hours}:${minutes}:${seconds}`;
    let q = `INSERT INTO taskDetails VALUES ('${id}','${taskTitle}','${task}','${currentTime}','${currentDate}','${dueTime}','${dueDate}', ${status})`;
    try {
        connection.query(q, (err, taskInfo) => {
            if (err) {
                console.error(err);
                res.send("Some error occurred in DB");
            } else {
                console.log(taskInfo);
                res.redirect("/");
            }
        });
    } catch (err) {
        console.log(err);
        res.send("Some error occurred in DB");
    }
});

// COMPLETE TASK

app.get("/task/complete", (req, res)=>{
    let q = `SELECT * FROM taskDetails WHERE status = 1`;
    try {
        connection.query(q, (err, allTaskInfo) => {
            if (err) {
                console.error(err);
                res.send("Some error occurred in DB");
            } else {
                for (a of allTaskInfo) {
                    const dateCreated = new Date(a.dateCreated);
                    const dateCreatedFormatted = `${dateCreated.getDate()}-${dateCreated.getMonth() + 1}-${dateCreated.getFullYear()}`;
                    const dueDate = new Date(a.dueDate);
                    const dueDateFormatted = `${dueDate.getDate()}-${dueDate.getMonth() + 1}-${dueDate.getFullYear()}`;
                    a.dateCreated = dateCreatedFormatted;
                    a.dueDate = dueDateFormatted;
                    // console.log(a);
                }
                res.render("completed", {allTaskInfo});
            }
        });
    } catch (err) {
        console.log(err);
        res.send("Some error occurred in DB");
    }

});

app.post("/task/:id/complete", (req, res)=>{
    let id = req.params.id;
    let status = 1;
    let q = `UPDATE taskDetails SET status = '${status}' WHERE id = '${id}'`;
    try {
        connection.query(q, (err, allTaskInfo) => {
            if (err) {
                console.error(err);
                res.send("Some error occurred in DB");
            } else {
                    res.redirect("/task/incomplete");
                }
                });
    } catch (err) {
        console.log(err);
        res.send("Some error occurred in DB");
    }   
})


// INCOMPLETE TASK
app.get("/task/incomplete", (req, res)=>{
    let q = `SELECT * FROM taskDetails WHERE status = 0`;
    try {
        connection.query(q, (err, allTaskInfo) => {
            if (err) {
                console.error(err);
                res.send("Some error occurred in DB");
            } else {
                for (a of allTaskInfo) {
                    const dateCreated = new Date(a.dateCreated);
                    const dateCreatedFormatted = `${dateCreated.getDate()}-${dateCreated.getMonth() + 1}-${dateCreated.getFullYear()}`;
                    const dueDate = new Date(a.dueDate);
                    const dueDateFormatted = `${dueDate.getDate()}-${dueDate.getMonth() + 1}-${dueDate.getFullYear()}`;
                    a.dateCreated = dateCreatedFormatted;
                    a.dueDate = dueDateFormatted;
                    // console.log(a);
                }
                
                
                res.render("incompleted", {allTaskInfo});
            }
        });
    } catch (err) {
        console.log(err);
        res.send("Some error occurred in DB");
    }
});

//EDIT TASK

app.get("/task/:id/edit", (req, res)=>{
    let id = req.params.id;
    console.log(id);
    let q = `SELECT * FROM  taskDetails WHERE id = '${id}'`;
    try {
        connection.query(q, (err, editTaskInfo) => {
            if (err) {
                console.error(err);
                res.send("Some error occurred in DB");
            } else {
                res.render("editTask", {editTaskInfo});
            }
        });
    } catch (err) {
        console.log(err);
        res.send("Some error occurred in DB");
    }
});

app.patch("/task/:id/edited", (req, res)=>{
    let id = req.params.id;
    let {taskTitle, task}= req.body;
    let q = `UPDATE taskDetails 
            SET taskTitle = '${taskTitle}', 
            task = '${task}' 
            WHERE id = '${id}'`;
    try {
        connection.query(q, (err, edited) => {
            if (err) {
                console.error(err);
                res.send("Some error occurred in DB");
            } else {
                res.redirect("/task/incomplete");
            }
        });
    } catch (err) {
        console.log(err);
        res.send("Some error occurred in DB");
    }
});

app.delete("/task/:id/delete", (req, res)=>{
    let id = req.params.id;
    let q = `DELETE FROM taskDetails WHERE id = '${id}';`
    try {
        connection.query(q, (err, deleted) => {
            if (err) {
                console.error(err);
                res.send("Some error occurred in DB");
            } else {
                res.redirect("/");
            }
        });
    } catch (err) {
        console.log(err);
        res.send("Some error occurred in DB");
    }
});


app.listen(8080, ()=>{
    console.log("Listening to port : 8080");
});