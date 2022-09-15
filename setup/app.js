// ****** SELECT ITEMS **********
const alert = document.querySelector('.alert');
const form = document.querySelector('.grocery-form');
const grocery = document.getElementById('grocery');
const submitbtn = document.querySelector('.submit-btn');
const container = document.querySelector('.grocery-container');
const list = document.querySelector('.grocery-list');
const clearbtn = document.querySelector('.clear-btn');

// edit option
let editelement;
let editflag = false;
let editid = '';

// ****** EVENT LISTENERS **********
// submit form

form.addEventListener('submit', additem);

// clear items
clearbtn.addEventListener('click', clearitems);

// load items
window.addEventListener('DOMContentLoaded', setupitems);

// ****** FUNCTIONS **********
function additem(e) {
  e.preventDefault();
  const value = grocery.value;
  const id = new Date().getTime().toString();
  console.log(id);
  // if (value !== '' && editflag === false) {
  if (value && !editflag) {
    createlistitem(id, value);

    // display alert
    displayalert('item added to the list', 'success');

    // show container
    container.classList.add('show-container');

    // add to local storage
    addtolocalstorage(id, value);

    // set back to default
    setbacktodefault();

    console.log('add item to list');
  } else if (value && editflag) {
    console.log('editing');
    editelement.innerHTML = value;
    displayalert('value changed', 'success');
    // edit locAL STORAGE
    editlocalstorage(editid, value);
    setbacktodefault();
  } else {
    console.log('empty value');
    displayalert('please enter value', 'danger');
  }
  // edit flag will be false by default and will only be true once we click the btn
  // console.log(grocery.value);
}

// display alert
function displayalert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);

  // remove alerts
  setTimeout(function () {
    alert.textContent = '';
    alert.classList.remove(`alert-${action}`);
  }, 1500);
}

// clear items
function clearitems() {
  const items = document.querySelectorAll('.grocery-item');

  if (items.length > 0) {
    items.forEach(function (item) {
      list.removeChild(item);
    });
  }
  container.classList.remove('show-container');
  displayalert('empty list', 'danger');
  setbacktodefault();
  localStorage.removeItem('list');
}

// delete function
function deleteitem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;
  list.removeChild(element);
  console.log('item deleted');
  if (list.children.length === 0) {
    container.classList.remove('show-container');
  }
  displayalert('item removed', 'danger');
  setbacktodefault();

  // remove from local storage
  removefromlocalstorage(id);
}
// edit btn
function edititem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  // i.e grocery item

  console.log('edit item');
  // set edit item
  editelement = e.currentTarget.parentElement.previousElementSibling;

  // set form value
  grocery.value = editelement.innerHTML;
  editflag = true;
  editid = element.dataset.id;
  submitbtn.textContent = 'edit';
}

// set back to default
function setbacktodefault() {
  grocery.value = '';
  editflag = false;
  editid = '';
  submitbtn.textContent = 'submit';

  console.log('set back to default');
}

// ****** LOCAL STORAGE **********
function addtolocalstorage(id, value) {
  // console.log('added to local storage');
  // const grocery = {id:id, value:value}
  const grocery = { id, value };
  // console.log(grocery);
  // let items = localStorage.getItem('list')
  //   ? JSON.parse(localStorage.getItem('list'))
  //   : [];
  let items = getlocalstorage();
  console.log(items);

  items.push(grocery);
  localStorage.setItem('list', JSON.stringify(items));
  // console.log(items); = null
  // the first id and value are equal to the parameters. if they both match then you can use the shortcut and remove the last ones
}
function removefromlocalstorage(id) {
  let items = getlocalstorage();
  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
    // if item id does not match the id that i am passing in when deleteing the item then return the item then the one that matches will be removed
  });
  localStorage.setItem('list', JSON.stringify(items));
}

function editlocalstorage(id, value) {
  let items = getlocalstorage();
  // either get our items or an empty array
  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    // if it doesnt then just return the item
    return item;
  });
  localStorage.setItem('list', JSON.stringify(items));
}

function getlocalstorage() {
  return localStorage.getItem('list')
    ? JSON.parse(localStorage.getItem('list'))
    : [];
}

// LOCAL STORAGE REFRESHER
// localStorage.setItem('orange', JSON.stringify(['item', 'item2']));
// // localStorage.setItem('orange', 'baba');
// const orange = JSON.parse(localStorage.getItem('orange'));
// console.log(orange);
// // localStorage.removeItem('orange');

// ****** SETUP ITEMS **********
// to make sure it is still there when we refresh
function setupitems() {
  let items = getlocalstorage();
  if (items.length > 0) {
    items.forEach(function (item) {
      createlistitem(item.id, item.value);
    });
    container.classList.add('show-container');
  }
}

function createlistitem(id, value) {
  const element = document.createElement('article');
  // add class
  element.classList.add('grocery-item');

  // add id
  const attr = document.createAttribute('data-id');
  attr.value = id;
  // WHAT IS THE ID FOR.
  element.setAttributeNode(attr);
  element.innerHTML = `<p class="title">${value}</p>
            <div class="btn-container">
            <button type="button" class="edit-btn">
            <i class="fas fa-edit"></i>
            </button>
            <button type="button" class="delete-btn">
            <i class="fas fa-trash"></i>
            </button>
            </div>`;

  const deletebtn = element.querySelector('.delete-btn');
  const editbtn = element.querySelector('.edit-btn');

  deletebtn.addEventListener('click', deleteitem);
  editbtn.addEventListener('click', edititem);
  // we are selecting them like this because they are not in the index html when our app js loads
  // append child
  list.appendChild(element);
}
// to ensure it is not an existing repo. git remote -v
// if it is you go rm -rf .git to remove on mac
