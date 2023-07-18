let todolist = [];

function addTodoItem(task) {
    const todoItem = {
        task,
        done: false,
        id: Date.now()
    };

    todolist.push(todoItem);
    refreshTodolist(todoItem);

    saveLocalStorage();
}

function refreshTodolist(todoItem) {
    const ul = document.querySelector("#todo-list");
    const oldItem = document.querySelector(`[data-id="${todoItem.id}"]`);

    if (todoItem.deleted) {
        oldItem.remove();
        return;
    }

    const li = document.createElement("li");
    const isDone = todoItem.done ? "done" : "";
    li.setAttribute("data-id", todoItem.id);
    li.setAttribute("class", `todo-item ${isDone}`);
    li.innerHTML = `<label for="${todoItem.id}" class="tick"></label>
    <input type="checkbox" id="${todoItem.id}"> 
    <span>${todoItem.task}</span>
    <button class="delete"><img src="images/remove.png"></button>`;

    if (oldItem) {
        ul.replaceChild(li, oldItem);
    } else {
        ul.insertBefore(li, ul.firstElementChild);
    }
}

function toggleDone(id) {
    const index = todolist.findIndex(todoItem => todoItem.id === Number(id));

    todolist[index].done = !todolist[index].done;
    refreshTodolist(todolist[index]);
    saveLocalStorage();
}    

function deleteTodoItem(id) {
    const index = todolist.findIndex(todoItem => todoItem.id === Number(id));
    todolist[index].deleted = true;
    refreshTodolist(todolist[index]);
    todolist = todolist.filter(todoItem => todoItem.id !== Number(id));

    saveLocalStorage();
}

function saveLocalStorage() {
    localStorage.setItem("todo-list", JSON.stringify(todolist));
}

const form = document.querySelector("#todo-form");

form.addEventListener("submit", event => {
    event.preventDefault();
    const input = document.querySelector("#todo-input");
    const task = input.value.trim();

    if (task !== "") {
        addTodoItem(task);
        input.value = "";
    } else {
        alert("Please enter an item");
    }
});

const ul = document.querySelector("#todo-list");
ul.addEventListener("click", event => {
    console.log(event.target);
    const id = event.target.parentElement.dataset.id;
    if (event.target.classList.contains("tick")){
        toggleDone(id);
    }  else if (event.target.classList.contains("delete")) {
        console.log(`Delete ID = ${id}`);
        deleteTodoItem(id);
        console.log(todolist);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const todoListstring = localStorage.getItem("todo-list");

    if (todoListstring) {
        todolist = JSON.parse(todoListstring);
        for (let i = 0; i < todolist.length; i++) {
            refreshTodolist(todolist[i]);
        }
    }
});