let taskArr = JSON.parse(localStorage.getItem("tasks")) || []; //Массив всех тасков
let taskText = ""; //Текст введённый в поле input
let input = null;

//Срабатывает после загрузки окна
window.onload = function init() {
  input = document.getElementById("task-text");

  //Срабатывает при изменении input (если нажать enter или убрать фокус)
  input.addEventListener("change", updateValue);

  render();
};

//Нажатие на кнопку Add
//Задача которая хранилась в taskText добавляется в raskArr
//после чего поля обнуляются и вызывается функция render
const onClickButton = () => {
  taskArr.push({
    text: taskText,
    isCheck: false,
  });

  localStorage.setItem("tasks", JSON.stringify(taskArr));
  taskText = "";
  input.value = "";
  render();
};

const onClickDelete = (index) => {
  taskArr.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(taskArr));
  render();
};

const onClickEdit = (index) => {
  const task = taskArr[index];
  let editText = task.text;

  const container = document.getElementById(`task=${index}`);
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

  editButton.onclick = () => {
    taskArr[index].text = editText;
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

//Записывает данные из input в taskText
const updateValue = (Event) => {
  taskText = Event.target.value;
};

//Отрисовка блоков с тасками
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
    container.id = `task=${index}`;

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
      onClickDelete(index);
    };

    container.appendChild(imageDelete);

    content.appendChild(container);
  });
};

//Нажатие на checkbox
onChangeCheckbox = (index) => {
  taskArr[index].isCheck = !taskArr[index].isCheck;
  localStorage.setItem("tasks", JSON.stringify(taskArr));
  render();
};
