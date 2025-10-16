const todos = JSON.parse(localStorage.getItem("todos")) || [];
// todo: string, completed: boolean

const todoForm = document.querySelector("#todo-form");
const todoText = document.querySelector("#todo-text");
const todoList = document.querySelector(".todo-list");

renderList();

todoList.addEventListener("click", event => {
  let index = event.target.closest(".todo-item").dataset.id;
  if(event.target.closest(".delete-button")){
    todos.splice(index, 1);
  } else {
    todos[index].completed = !todos[index].completed;
  }
  renderList();
});

todoForm.addEventListener("submit", e => {
  e.preventDefault();
  const trimmedTodo = todoText.value.trim();
  if(trimmedTodo) {
    todos.push({
      todo: trimmedTodo,
      completed: false
    });
    renderList();
  } else {
    alert("Do not leave the text field empty.");
  }
  todoText.value = "";
})

function renderList() {
  localStorage.setItem("todos", JSON.stringify(todos));
  todoList.innerHTML = todos.map((todo, index) => {
    // return `
    //   <li data-id="${index}" class='todo-item ${todo.completed ? "completed" : ""}'>
    //     <svg class="blank-checkbox ${todo.completed ? "hide" : ""}" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Z"/></svg>
    //     <svg class="checkbox ${todo.completed ? "" : "hide"}" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="m424-312 282-282-56-56-226 226-114-114-56 56 170 170ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/></svg>
    //     <div class="todo-content" title="${todo.todo}">${todo.todo}</div>
    //     <svg class="delete-button" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
    //   </li>
    // `;
    return `
      <li data-id="${index}" class='todo-item ${todo.completed ? "completed" : ""}'>
        <svg class="blank-checkbox ${todo.completed ? "hide" : ""}" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Z"/></svg>
        <svg class="checkbox ${todo.completed ? "" : "hide"}" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="m424-312 282-282-56-56-226 226-114-114-56 56 170 170ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/></svg>
        <div class="todo-content" title="${todo.todo}">${todo.todo}</div>
        <svg class="delete-button" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
      </li>
    `;
  })
  .join("");
}