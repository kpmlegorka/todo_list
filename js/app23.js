// ****** select items **********
(function() {
const form = document.querySelector(".tasks-form");
const alert = document.querySelector(".tasksAlert");
const tasks = document.getElementById("tasks");
const submitBtn = document.querySelector(".tasksSubmit-btn");
const container = document.querySelector(".tasks-container");
const list = document.querySelector(".tasks-list");
const clearBtn = document.querySelector(".tasksClear-btn");
const todayDate = document.getElementById("todayDate");

const alltasksContainer = document.querySelector(".alltasks-container");
const alltasksList = document.querySelector(".alltasks-list");
const alltasksTime = document.querySelector(".alltasks-time");

// edit option 
let editElement;
let editFlag = false;
let editID = "";

const options = { day: 'numeric' , month: 'numeric' };
todayDate.innerText = new Date().toLocaleDateString('ru-RU',options);

// ****** event listeners **********
// submit form 
form.addEventListener("submit", addItem);
// clear list
clearBtn.addEventListener("click", clearItems);
///// display items onload
window.addEventListener("DOMContentLoaded", setupItems);

// ****** functions **********

// add item
function addItem(e) {
  e.preventDefault();
  const value = tasks.value;
  const id = new Date().getTime().toString();
  const acceptFlag = "no";	
  
  if (value !== "" && !editFlag) {
    const element = document.createElement("article");
    let attr = document.createAttribute("data-id");
    attr.value = id;
	let acc = document.createAttribute("data-accept");
    acc.value = acceptFlag;
	element.setAttributeNode(attr);
	element.setAttributeNode(acc);
    element.classList.add("tasks-item");
    element.innerHTML = `<p class="title">${value}</p>
            <div class="btn-container">
			<!-- accept btn -->
              <button type="button" class="accept-btn">
                <i class="fas fa-check-square"></i>
              </button>
              <!-- edit btn -->
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <!-- delete btn -->
              <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          `;
    // add event listeners to both buttons;
    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem);
    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItem);
	const acceptBtn = element.querySelector(".accept-btn");
    acceptBtn.addEventListener("click", acceptItem);
    // append child
    list.appendChild(element);
	
	// alltasks
	const allelement = document.createElement("article");
    let allattr = document.createAttribute("data-id");
    allattr.value = id;
	let allacc = document.createAttribute("data-accept");
    allacc.value = acceptFlag;
	allelement.setAttributeNode(allattr);
	allelement.setAttributeNode(allacc);
    allelement.classList.add("tasks-item");
    allelement.innerHTML = `<p class="title">${value}</p>
            <div class="btn-container">
			<!-- accept btn -->
              <button type="button" class="allaccept-btn">
                <i class="fas fa-check-square"></i>
              </button>
              <!-- edit btn 
              <button type="button" class="alledit-btn">
                <i class="fas fa-edit"></i>
              </button>-->
              <!-- delete btn -->
              <button type="button" class="alldelete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          `;
    // add event listeners to both buttons;
    const alldeleteBtn = allelement.querySelector(".alldelete-btn");
    alldeleteBtn.addEventListener("click", deleteItem);
    //const alleditBtn = allelement.querySelector(".alledit-btn");
    //alleditBtn.addEventListener("click", editItem);
	const allacceptBtn = allelement.querySelector(".allaccept-btn");
    allacceptBtn.addEventListener("click", acceptItem);
    // append child
	alltasksList.appendChild(allelement);

    // display alert
    displayAlert("item added to the list", "success");
    // show container
    container.classList.add("show-container");
	alltasksContainer.classList.add("show-container");
    // set local storage
    addToLocalStorage(id, acceptFlag, value);
    // set back to default
    setBackToDefault();
  } else if (value !== "" && editFlag) {
    editElement.innerHTML = value;
	
	const allelement = document.querySelectorAll("div.alltasks-list > .tasks-item");
	allelement.forEach(function (item) {
	  if(item.dataset.id == editID){
		  item.firstChild.innerHTML = value;
		  }
	});
  
    displayAlert("value changed", "success");
	
    // edit  local storage
    editLocalStorage(editID, acceptFlag, value);
    setBackToDefault();
  } else {
    displayAlert("please enter value", "danger");
  }
}
// display alert
function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);
  // remove alert
  setTimeout(function () {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 1000);
}

// clear items
function clearItems() {
  const items = document.querySelectorAll("div.tasks-list > .tasks-item");
  if (items.length > 0) {
    items.forEach(function (item) {
      list.removeChild(item);
    });
  }
  container.classList.remove("show-container");
  displayAlert("empty list", "danger");
  setBackToDefault();
  localStorage.removeItem("task");
}

// delete item
function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;
  
  const elem = document.querySelectorAll("div.tasks-list > .tasks-item");
  elem.forEach(function (item) {
	  if(item.dataset.id == id){
		  list.removeChild(item);
		  }
  });
  const allelement = document.querySelectorAll("div.alltasks-list > .tasks-item");
  allelement.forEach(function (item) {
	  if(item.dataset.id == id){
		  alltasksList.removeChild(item);
		  }
  });
  
  if (list.children.length === 0) {
    container.classList.remove("show-container");
  }
  if (alltasksList.children.length === 0) {
    alltasksContainer.classList.remove("show-container");
  }
  
  displayAlert("item removed", "danger");
  setBackToDefault();
  // remove from local storage
  removeFromLocalStorage(id);
}
// edit item
function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  // set edit item
  editElement = e.currentTarget.parentElement.previousElementSibling;
  // set form value
  tasks.value = editElement.innerHTML;
  editFlag = true;
  editID = element.dataset.id;
  //
  submitBtn.textContent = "edit";
  const titleClass = element.querySelector(".title");
  titleClass.classList.remove("acceptClass");
  element.setAttribute("data-accept", "no");
  
  const allelement = document.querySelectorAll("div.alltasks-list > .tasks-item");
  allelement.forEach(function (item) {
	  if(item.dataset.id == editID){
		  item.firstChild.classList.remove("acceptClass");
		  item.setAttribute("data-accept", "no");
		  }
  });
  
}
// accept item
function acceptItem(e) {
	const element = e.currentTarget.parentElement.parentElement;
	const id = element.dataset.id;
	const titleClass = element.querySelector(".title");
	let titleValue = titleClass.innerHTML;
	let titleAcc = element.getAttributeNode('data-accept');
	const elem = document.querySelectorAll("div.tasks-list > .tasks-item");
	const allelement = document.querySelectorAll("div.alltasks-list > .tasks-item");
	
	if (titleAcc.value == "no"){
		elem.forEach(function (item) {
			if(item.dataset.id == id){
				item.firstChild.classList.add("acceptClass");
				item.setAttribute("data-accept", "yes");
			}
		});
		allelement.forEach(function (item) {
			if(item.dataset.id == id){
				item.firstChild.classList.add("acceptClass");
				item.setAttribute("data-accept", "yes");
			}
		});
	} else {
		elem.forEach(function (item) {
			if(item.dataset.id == id){
				item.firstChild.classList.remove("acceptClass");
				item.setAttribute("data-accept", "no");
			}
		});
		allelement.forEach(function (item) {
			if(item.dataset.id == id){
				item.firstChild.classList.remove("acceptClass");
				item.setAttribute("data-accept", "no");
			}
		});
	}
	editLocalStorage(id, titleAcc.value, titleValue);	
}
// set backt to defaults
function setBackToDefault() {
  tasks.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "submit";
}

// ****** local storage **********

// add to local storage
function addToLocalStorage(id, acceptFlag, value) {
  const tasks = {  id, acceptFlag, value };
  
  let items = getLocalStorage();
  items.push(tasks);
  localStorage.setItem("task", JSON.stringify(items));
  
  let allitems = getLocalStorageForAll();
  allitems.push(tasks);
  localStorage.setItem("alltask", JSON.stringify(allitems)); 
}

function getLocalStorage() {
  return localStorage.getItem("task")
    ? JSON.parse(localStorage.getItem("task"))
    : [];
}
function getLocalStorageForAll() {
  return localStorage.getItem("alltask")
    ? JSON.parse(localStorage.getItem("alltask"))
    : [];
}

function removeFromLocalStorage(id) {
  let items = getLocalStorage();
  let allitems = getLocalStorageForAll();
  
  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  });
  allitems = allitems.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  });
  
  localStorage.setItem("task", JSON.stringify(items));
  localStorage.setItem("alltask", JSON.stringify(allitems));
}

function editLocalStorage(id, acceptFlag, value) {
  let items = getLocalStorage();
  let allitems = getLocalStorageForAll();

  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value;
	  item.acceptFlag = acceptFlag; //возможно просто "no"
    }
    return item;
  });
  
  allitems = allitems.map(function (item) {
    if (item.id === id) {
      item.value = value;
	  item.acceptFlag = acceptFlag; //возможно просто "no"
    }
    return item;
  });
  
  localStorage.setItem("task", JSON.stringify(items));
  localStorage.setItem("alltask", JSON.stringify(allitems));
}

// SETUP LOCALSTORAGE.REMOVEITEM('LIST');

// ****** setup items **********

function setupItems() {
  let items = getLocalStorage();
  let allitems = getLocalStorageForAll();

  if (items.length > 0) {
    items.forEach(function (item) {
      createListItem(item.id, item.acceptFlag, item.value);
    });
    container.classList.add("show-container");
  }
  if (allitems.length > 0) {
    allitems.forEach(function (item) {
      createAllListItem(item.id, item.acceptFlag, item.value);
    });
    alltasksContainer.classList.add("show-container");
  }
}

function createListItem(id, acceptFlag, value) {
  const element = document.createElement("article");
  let attr = document.createAttribute("data-id");
  attr.value = id;
  let acc = document.createAttribute("data-accept");
  acc.value = acceptFlag;
  element.setAttributeNode(attr);
  element.setAttributeNode(acc);
  element.classList.add("tasks-item");
  element.innerHTML = `<p class="title">${value}</p>
            <div class="btn-container">
			<!-- accept btn -->
              <button type="button" class="accept-btn">
                <i class="fas fa-check-square"></i>
              </button>
              <!-- edit btn -->
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <!-- delete btn -->
              <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          `;
  // add status atrr
  const titleClass = element.querySelector(".title");
  if (acceptFlag == "yes"){
	  titleClass.classList.add("acceptClass");
  }
  // add event listeners to both buttons;
  const deleteBtn = element.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", deleteItem);
  const editBtn = element.querySelector(".edit-btn");
  editBtn.addEventListener("click", editItem);
  const acceptBtn = element.querySelector(".accept-btn");
  acceptBtn.addEventListener("click", acceptItem);
	
  // append child
  list.appendChild(element);
} 
function createAllListItem(id, acceptFlag, value) { 
 // alltasks
	const allelement = document.createElement("article");
    let allattr = document.createAttribute("data-id");
    allattr.value = id;
	let allacc = document.createAttribute("data-accept");
    allacc.value = acceptFlag;
	allelement.setAttributeNode(allattr);
	allelement.setAttributeNode(allacc);
    allelement.classList.add("tasks-item");
    allelement.innerHTML = `<p class="title">${value}</p>
            <div class="btn-container">
				<span class="taskDate"></span>
			<!-- accept btn -->
              <button type="button" class="allaccept-btn">
                <i class="fas fa-check-square"></i>
              </button>
              <!-- edit btn 
              <button type="button" class="alledit-btn">
                <i class="fas fa-edit"></i>
              </button>-->
              <!-- delete btn -->
              <button type="button" class="alldelete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          `;
    const titleClass = allelement.querySelector(".title");
	if (acceptFlag == "yes"){
	  titleClass.classList.add("acceptClass");
	  }
	// add event listeners to both buttons;
    const alldeleteBtn = allelement.querySelector(".alldelete-btn");
    alldeleteBtn.addEventListener("click", deleteItem);
    //const alleditBtn = allelement.querySelector(".alledit-btn");
    //alleditBtn.addEventListener("click", editItem);
	const allacceptBtn = allelement.querySelector(".allaccept-btn");
    allacceptBtn.addEventListener("click", acceptItem);

	const taskDate = allelement.querySelector(".taskDate");
	taskDate.innerText = new Date(+id).toLocaleDateString('ru-RU',options);
    // append child (prepend)
	alltasksList.appendChild(allelement);
}
})();
