const todoInput = document.querySelector('#input'),
      addButton = document.querySelector('.add-btn'),
      deleteButton = document.querySelector('.delete-btn'),
      todoList = document.querySelector('.todo-list')

const TODOS_LIST = 'toDos'
let todos = []

function loadTodos() {
    const loadedTodos = localStorage.getItem(TODOS_LIST)
    if(loadedTodos !== null) {
        const parsedTodos = JSON.parse(loadedTodos)
        parsedTodos.forEach(toDo => {
            showTodo(toDo.name)
        })
    }
}

function deleteTodo(event) {
    const btn = event.target
    const li = btn.parentNode
    todoList.removeChild(li)
    const filteredTodos = todos.filter(todo => {
        return todo.id !== parseInt(li.id)
    })
    todos = filteredTodos
    saveTodo()
}

function saveTodo() {
    localStorage.setItem(TODOS_LIST, JSON.stringify(todos))
}

function showTodo(value) {
    const li = document.createElement('li')
    const newId = todos.length + 1
    const task = document.createElement('div')
    task.textContent = value
    const deleteBtn = document.createElement('button')
    deleteBtn.className = 'delete-btn'
    deleteBtn.textContent = 'X'
    deleteBtn.addEventListener('click', deleteTodo)
    li.append(task, deleteBtn)
    li.id = newId
    todoList.append(li)
    const todoObject = {
        name: value,
        id: newId,
    }
    todos.push(todoObject)
    saveTodo()
}

function addTodo(event) {
    event.preventDefault()
    const taskValue = todoInput.value
    showTodo(taskValue)
    todoInput.value = ''
}

function init() {
    loadTodos()
    addButton.addEventListener('click', addTodo)
}

init()