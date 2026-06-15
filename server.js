const express=require("express");
const cors=require("cors");
const fs=require("fs");

const app=express();

app.use(cors());
app.use(express.json());


const FILE="./tasks.json";


function getTasks(){

return JSON.parse(fs.readFileSync(FILE));

}


function saveTasks(data){

fs.writeFileSync(
FILE,
JSON.stringify(data,null,2)
);

}


// GET

app.get("/tasks",(req,res)=>{

res.json(getTasks());

});



// POST

app.post("/tasks",(req,res)=>{


let tasks=getTasks();


let newTask={

id:Date.now(),

text:req.body.text,

completed:false,

updatedAt:Date.now()

};


tasks.push(newTask);


saveTasks(tasks);


res.status(201).json(newTask);


});




// UPDATE

app.put("/tasks/:id",(req,res)=>{


let tasks=getTasks();


tasks=tasks.map(t=>{


if(t.id==req.params.id)

return {

...t,
...req.body,
updatedAt:Date.now()

}


return t;


});


saveTasks(tasks);


res.json("updated");


});




// DELETE

app.delete("/tasks/:id",(req,res)=>{


let tasks=getTasks();


tasks=tasks.filter(
t=>t.id!=req.params.id
);


saveTasks(tasks);


res.json("deleted");


});





app.listen(5000,()=>{

console.log("Server started on 5000");

});