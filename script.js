let deletedTask = null;

const API = "http://localhost:5000/tasks";


let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


// display local data first
show();


// load server data
loadData();




// GET TASKS

async function loadData(){

    try{

        let res = await fetch(API);

        let serverTasks = await res.json();


        // merge server data with local data
        tasks = serverTasks.map(task => {

            return {

                ...task,

                dueDate: task.dueDate || "",

                priority: task.priority || "Low"

            };

        });


        localStorage.setItem(
            "tasks",
            JSON.stringify(tasks)
        );


        show();

    }
    catch{

        console.log("Offline mode");

    }

}




// ADD TASK

async function addTask(){


    let input = document.getElementById("task");

    let date = document.getElementById("date");

    let priority = document.getElementById("priority");



    if(input.value.trim()==""){

        alert("Enter task");

        return;

    }



    let task = {

        id: Date.now(),

        text: input.value,

        completed:false,

        dueDate: date.value,

        priority: priority.value

    };



    // instant update

    tasks.push(task);


    save();

    show();



    input.value="";

    date.value="";



    // API sync

    try{


        await fetch(API,{

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify(task)

        });


    }

    catch{

        console.log("Saved locally");

    }


}







// DISPLAY


function show(){


    let list = document.getElementById("list");


    list.innerHTML="";



    tasks.forEach(task=>{


        let li=document.createElement("li");



        li.innerHTML = `


        <span onclick="completeTask(${task.id})"
        class="${task.completed ? 'done':''}">


        ${task.text}


        <br>

        Due:
        ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No date"}


        <br>

        Priority:
        ${task.priority || "Low"}


        </span>


        <button onclick="deleteTask(${task.id})">

        Delete

        </button>

        `;



        list.appendChild(li);



    });


}








// COMPLETE


function completeTask(id){


    tasks = tasks.map(task=>{


        if(task.id==id){

            task.completed = !task.completed;

        }


        return task;


    });



    save();

    show();


}









// DELETE


async function deleteTask(id){


    deletedTask = tasks.find(
        task=>task.id==id
    );



    tasks = tasks.filter(
        task=>task.id!=id
    );



    save();

    show();



    try{


        await fetch(API+"/"+id,{

            method:"DELETE"

        });


    }

    catch{

        console.log("Offline delete");

    }


}








// UNDO


function undoDelete(){


    if(deletedTask){


        tasks.push(deletedTask);


        save();


        show();


        deletedTask=null;


    }


}







// LOCAL STORAGE


function save(){


    localStorage.setItem(

        "tasks",

        JSON.stringify(tasks)

    );


}