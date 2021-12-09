let taskArr = JSON.parse(localStorage.getItem("tasks")) || [];
let taskText = "";
let input = null;

window.onload = async function init() {
  input = document.getElementById("task-text");
  input.addEventListener("change", updateValue);
  const resp = await fetch("http://localhost:8000/allTasks", {
    method: "GET",
  });

  let result = await resp.json();
  taskArr = result.data;
  render();
};

const onClickButton = async () => {
  taskArr.push({
    text: taskText,
    isCheck: false,
  });

  const resp = await fetch("http://localhost:8000/createTask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      text: taskText,
      isCheck: false,
    }),
  });

  let result = await resp.json();
  taskArr = result.data;
  localStorage.setItem("tasks", JSON.stringify(taskArr));
  taskText = "";
  input.value = "";
  render();
};

const onClickDelete = async (index) => {
  const resp = await fetch(`http://localhost:8000/deleteTask?id=${index}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  });
  let result = await resp.json();
  taskArr = result.data;
  localStorage.setItem("tasks", JSON.stringify(taskArr));
  render();
};

const onClickEdit = async (index) => {
  const task = taskArr[index];
  let editText = task.text;

  const container = document.getElementById(`task=${task.id}`);
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  const input = document.createElement("input");

  input.value = task.text;
  input.addEventListener("change", (Event) => {
    editText = Event.target.value;
  });

  const editButton = document.createElement("button");
  editButton.innerText = "Edit";

  editButton.onclick = async () => {
    const resp = await fetch(`http://localhost:8000/updateTask`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        id: task.id,
        text: editText,
        isCheck: false,
      }),
    });

    let result = await resp.json();
    taskArr = result.data;

    localStorage.setItem("tasks", JSON.stringify(taskArr));
    render();
  };

  const cancelButton = document.createElement("button");
  cancelButton.innerText = "Cancel";

  cancelButton.onclick = () => {
    render();
  };

  container.appendChild(input);
  container.appendChild(editButton);
  container.appendChild(cancelButton);
  console.log(container);
};

const updateValue = (Event) => {
  taskText = Event.target.value;
};

const render = () => {
  const content = document.getElementById("content-page");

  //delite all child elements
  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }

  taskArr.sort((a, b) => {
    if (a.isCheck > b.isCheck) {
      return 1;
    }

    if (a.isCheck < b.isCheck) {
      return -1;
    }

    return 0;
  });

  taskArr.map((item, index) => {
    const container = document.createElement("div");
    container.id = `task=${item.id}`;

    const checkbox = document.createElement("input");
    const text = document.createElement("p");
    text.innerText = item.text;
    container.appendChild(text);
    checkbox.type = "checkbox";
    checkbox.checked = item.isCheck;

    checkbox.onchange = () => {
      onChangeCheckbox(index);
    };

    container.className = item.isCheck ? "task-block done-task" : "task-block";

    container.appendChild(checkbox);

    const imageEdit = document.createElement("img");
    imageEdit.src =
      "https://img.icons8.com/material-outlined/24/000000/pencil--v1.png";

    imageEdit.onclick = () => {
      onClickEdit(index);
    };

    if (!item.isCheck) container.appendChild(imageEdit);

    const imageDelete = document.createElement("img");
    imageDelete.src =
      "https://img.icons8.com/material-outlined/24/000000/delete-sign.png";

    imageDelete.onclick = () => {
      onClickDelete(item.id);
    };

    container.appendChild(imageDelete);

    content.appendChild(container);
  });
};

const onChangeCheckbox = async (index) => {
  task = taskArr[index];
  const resp = await fetch(`http://localhost:8000/updateTask`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      id: task.id,
      text: task.text,
      isCheck: !task.isCheck,
    }),
  });
  let result = await resp.json();
  taskArr = result.data;
  //taskArr[index].isCheck = !taskArr[index].isCheck;
  localStorage.setItem("tasks", JSON.stringify(taskArr));
  render();
};
