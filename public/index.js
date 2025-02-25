let activeDiv = null;
export const setDiv = (newDiv) => {
  if (newDiv != activeDiv) {
    if (activeDiv) {
      activeDiv.style.display = "none";
    }
    newDiv.style.display = "block";
    activeDiv = newDiv;
  }
};

export let inputEnabled = true;
export const enableInput = (state) => {
  inputEnabled = state;
};

export let token = null;
export let userName = null;
export const setToken = (value, name='') => {
  token = value;
  userName = name;
  if (value) {
    localStorage.setItem("profile", JSON.stringify( {token: value, name} ))
  } else {
    localStorage.removeItem("profile");
  }

  // Update UI
  const profileElement = document.getElementById('profile')
  profileElement.style.display = (token ? 'block' : 'none')
  const profileNameElement = profileElement.getElementsByTagName('span')[0]
  profileNameElement.textContent = userName;
};

export let message = null;

import { showExpenses, handleExpenses } from "./expenses.js";
import { handleCategories } from "./categories.js";
import { handleAddEditCategory } from "./addEditCategory.js"
import { showLoginRegister, handleLoginRegister } from "./loginRegister.js";
import { handleLogin } from "./login.js";
import { handleAddEdit } from "./addEdit.js";
import { handleRegister } from "./register.js";

document.addEventListener("DOMContentLoaded", () => {
  const profile = JSON.parse( localStorage.getItem("profile") )

  setToken(profile?.token, profile?.name)

  message = document.getElementById("message");
  handleLoginRegister();
  handleLogin();
  handleExpenses();
  handleCategories()
  handleAddEditCategory()
  handleRegister();
  handleAddEdit();
  if (token) {
    showExpenses();
  } else {
    showLoginRegister();
  }

  document.querySelector('header button.logoff').addEventListener("click", (e) => {
    setToken(null);
    setMessage("You have been logged off.")
    emptyTables();
    showLoginRegister();
  })
});

export const emptyTables = () => {
  const tables = Array.from( document.getElementsByTagName('table') )
  tables.forEach(tableElement => {
    const tableHeading = tableElement.getElementsByTagName('th')[0]
    tableElement.replaceChildren([tableHeading])
  });
}

export const setMessage = (msg, error=false) => {
  message.textContent = msg
  message.style.backgroundColor =  (error ? '#ffa2a2' : '#a2ffb2')
  message.style.display = 'block'
  setTimeout(()=>{
    message.style.display = 'none'
  }, 3000);
}