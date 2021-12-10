let taskArr = [];
let taskText = "";
let input = null;

window.onload = async () => {
  input = document.getElementById("task-text");
  input.addEventListener("change", updateValue);
  render();
};

const onClickButton = async () => {
  if (taskText != "") {
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
    taskText = "";
    input.value = "";
    render();
  } else alert("Empty field");
};

const onClickDelete = async (index) => {
  const resp = await fetch(`http://localhost:8000/deleteTask?id=${index}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  });

  render();
};

const onClickEdit = async (index) => {
  const task = taskArr[index];
  const { _id, text } = task;
  let editText = text;

  const container = document.getElementById(`task=${_id}`);
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
        id: _id,
        text: editText,
        isCheck: false,
      }),
    });

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
};

const updateValue = (Event) => {
  taskText = Event.target.value;
};

const render = async () => {
  const resp = await fetch("http://localhost:8000/allTasks", {
    method: "GET",
  });

  const result = await resp.json();
  taskArr = result.data;

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
    const { _id, text, isCheck } = item;
    console.log(_id, text, isCheck);
    const container = document.createElement("div");
    container.id = `task=${_id}`;

    const checkbox = document.createElement("input");
    const textBlock = document.createElement("p");
    textBlock.innerText = item.text;
    container.appendChild(textBlock);
    checkbox.type = "checkbox";
    checkbox.checked = isCheck;

    checkbox.onchange = () => {
      onChangeCheckbox(index);
    };

    container.className = isCheck ? "task-block done-task" : "task-block";

    container.appendChild(checkbox);

    const imageEdit = document.createElement("img");
    imageEdit.src =
      "https://img.icons8.com/material-outlined/24/000000/pencil--v1.png";

    imageEdit.onclick = () => {
      onClickEdit(index);
    };

    if (!isCheck) container.appendChild(imageEdit);

    const imageDelete = document.createElement("img");
    imageDelete.src =
      "https://img.icons8.com/material-outlined/24/000000/delete-sign.png";

    imageDelete.onclick = () => {
      onClickDelete(_id);
    };

    container.appendChild(imageDelete);

    content.appendChild(container);
  });
};

const onChangeCheckbox = async (index) => {
  const task = taskArr[index];
  const { _id, text } = task;
  const resp = await fetch(`http://localhost:8000/updateTask`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      id: _id,
      text: text,
      isCheck: !task.isCheck,
    }),
  });
  render();
};
