function addNewTodo() {
  let maxId = 0;

  const allElements = document.getElementsByTagName('main')[0].childNodes.forEach((child) => {
    if (child.id !== undefined && child.id !== 'todo-template') {
    let childId = +child.id.substr(5, child.id.length - 5);

    if (maxId < childId) {
      maxId = childId;
    }
  }
});

  const newId = ++maxId;

  //const text = prompt('Please enter your TODO');
  const text = document.getElementById('new-todo-text').value;

  if (text.trim() === "") {
    alert("Bitte ToDo-Text eingeben.");
    return;
  }

  const todoItem = {
    id : newId,
    text : text
  };

  addTodo(todoItem);
  // document.getElementById("myList").appendChild(node);
  document.getElementById('new-todo-text').value = "";
  
  upload();
}

function deleteTodo(id) {
  document.getElementById(`todo-${id}`).remove();
  upload();
}

async function getData() {
  const data = await fetch("https://api.jsonbin.io/b/5ed00ba679382f568bceb307/latest");
  const json = data.json();
  return json;
}

function download() {
  getData().then(data =>{
    clear();
  addTodos(data.main);
  console.log(data);
});
}

function clear(){
  console.log(Array.from(document.getElementsByTagName('main')[0].children));
  Array.from(document.getElementsByTagName('main')[0].children).forEach((child) => {
    console.log(1);
    if (child.id !== undefined && child.id !== 'todo-template') {
      console.log(2);
      child.remove();
    }
  });
}

function addTodos(todos){
  todos.forEach(todo => addTodo(todo));
}

function addTodo(todo){
  let newTodo = document.getElementById('todo-template').cloneNode(true);

  newTodo.setAttribute("id", "todo-" + todo.id);
  newTodo.querySelector('#todo-text').innerText = todo.text;
  newTodo.querySelector('#todo-delete').setAttribute('onClick', 'deleteTodo(' + todo.id +')');

  console.log(newTodo);

  document.getElementsByTagName('main')[0].appendChild(newTodo);
}

async function putData() {
  const html = [];
  document.getElementsByTagName('main')[0].childNodes.forEach((child) => {
    if (child.id !== undefined && child.id !== 'todo-template') {
    const todoId = +child.id.substr(5, child.id.length - 5);
    const todoText = child.querySelector('#todo-text').innerText;
    console.log(todoId);
    console.log(todoText);
    const todoItem = {
      id : todoId,
      text : todoText
    };
    html.push(todoItem);
  }
});
  console.log(html);
  const data = { "main" : html };

  fetch('https://api.jsonbin.io/b/5ed00ba679382f568bceb307', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(response => response.json())
.then(data => {
    console.log('Success:', data);
  return data;
})
.catch((error) => {
    console.error('Error:', error);
  return error;
});
}

function upload() {
  console.log("upload1");
  putData().then(data =>{
    console.log(data);
});
}

function toggleSearch() {
  const searchTextDisplay = document.getElementById('search-text').style.display;
  if (searchTextDisplay === "unset") {
    searchText("");
  }
  else {
    search();
  }
  document.getElementById('search-text').style.display = searchTextDisplay === "none" ? "unset" : "none";
  
  /*const searchText = document.getElementById('search-text').value;
  document.getElementsByTagName('main')[0].childNodes.forEach((child) => {
    if (child.id !== undefined && child.id !== 'todo-template') {
    const todoText = child.querySelector('#todo-text').innerText;
      if (!todoText.includes(searchText)) {
        child.setAttribute("style", "display: none");
      }
      
  }
});*/
  
}

function searchText(text) {
  text = text.toLowerCase().trim();
  document.getElementsByTagName('main')[0].childNodes.forEach((child) => {
    if (child.id !== undefined && child.id !== 'todo-template') {
    const todoText = child.querySelector('#todo-text').innerText.toLowerCase().trim();
      if (!todoText.includes(text)) {
        child.setAttribute("style", "display: none");
      }
      else {
        child.setAttribute("style", "display: flex"); 
      }
  }
});
}

function search() {
  const text = document.getElementById('search-text').value;
  searchText(text);
}



