let todoList = [];

const setInLS = (tdList) =>
  localStorage.setItem("items", JSON.stringify(tdList));

const getFromLS = () => JSON.parse(localStorage.getItem("items")) || [];

const newToDo = document.getElementById("newToDo");
const res = document.getElementById("result");
const todoCount = document.getElementById("todo-count");
const filterAll = document.getElementById("filter-all");
const filterActive = document.getElementById("filter-active");
const filterCompleted = document.getElementById("filter-completed");
const clearCompleted = document.getElementById("clear-completed");
const completedTodo = document.getElementById("completedTodo");

const addTodo = (updatedToDo, index) => {
  if (updatedToDo) {
    todoList = getFromLS();
    todoList.splice(index, 1, { text: updatedToDo, completed: false });
    setInLS(todoList);
    showList();
    return;
  }

  const exectToDo = newToDo.value.trim();
  if (exectToDo) {
    todoList = getFromLS();
    todoList.push({ text: exectToDo, completed: false });
    setInLS(todoList);
    showList();
    newToDo.value = "";
  }
};

const editTodo = (index) => {
  const all = getFromLS();
  if (all[index].completed) return; // Prevent editing if completed

  const oldToDo=all[index].text;

  const todoItem = document.querySelectorAll('.todo-item')[index];
  const todoTextElement = document.querySelectorAll(".todo-text")[index];
  const checkboxElement = document.querySelectorAll(".checkmark")[index];

 

  // Enable content editing
  todoTextElement.setAttribute("contenteditable", "true");
  todoTextElement.focus();

  todoItem.classList.add('shadow-editable');
  // Hide the checkbox
  checkboxElement.style.visibility = "hidden";

  // Prevent line breaks on Enter key
  todoTextElement.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const updatedText = todoTextElement.textContent.trim();
      if (updatedText) {
        addTodo(updatedText, index);
      }
      todoTextElement.removeAttribute("contenteditable");
      checkboxElement.style.visibility = "visible"; // Show the checkbox
    }
  });

  // Save on blur (lose focus)
  todoTextElement.addEventListener("blur", () => {
    todoTextElement.removeAttribute("contenteditable");
    let updatedText = todoTextElement.textContent.trim();
    if(!updatedText)updatedText=oldToDo;
    if (updatedText) {
      addTodo(updatedText, index);
    }
    checkboxElement.style.visibility = "visible"; // Show the checkbox
  });
};

const showList = (filter = "all") => {
  res.innerHTML = "";
  const all = getFromLS();
  let filteredTodos = all;

  if (filter === "active") {
    filteredTodos = all.filter((todo) => !todo.completed);
  } else if (filter === "completed") {
    filteredTodos = all.filter((todo) => todo.completed);
  }

  filteredTodos.forEach((each, index) => {
    const newLI = document.createElement("li");
    if (each.completed) newLI.classList.add("completed");

    newLI.innerHTML = `
      <div class="w-[576px] m-auto bg-white flex rounded-sm border text-xl" ondblclick="editTodo(${index})" >

        <div class="m-auto pl-5">
        <label class="custom-checkbox">
          <input type="checkbox" ${each.completed ? "checked" : ""} 
          onclick="toggleTodoCompleted(${index})" >
          <span class="checkmark"></span>
        </label>
        </div>

        <div class="todo-item w-[515px] m-auto px-2 py-5 overflow-x-auto todo-text">
          <span>${each.text}</span>
        </div>
      </div>`;
    res.appendChild(newLI);
  });
  updateTodoCount();
};

const updateTodoCount = () => {
  const all = getFromLS();
  const activeTodos = all.filter((todo) => !todo.completed).length;
  todoCount.textContent = `${activeTodos} item${
    activeTodos !== 1 ? "s" : ""
  } left`;
};

const toggleTodoCompleted = (index) => {
  todoList = getFromLS();
  todoList[index].completed = !todoList[index].completed;
  setInLS(todoList);
  showList();
};

const allTodoCompleted = () => {
  const todoList = getFromLS();
  todoList.forEach((todo) => {
    todo.completed = true;
  });
  setInLS(todoList);
  showList();

};

const clearCompletedTodos = () => {
  todoList = getFromLS().filter((todo) => !todo.completed);
  setInLS(todoList);
  showList();
};

newToDo.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTodo();
  }
});

filterAll.addEventListener("click", () => showList("all"));
filterActive.addEventListener("click", () => showList("active"));
filterCompleted.addEventListener("click", () => showList("completed"));
clearCompleted.addEventListener("click", clearCompletedTodos);

showList();
