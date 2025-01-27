import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showExpenses } from "./expenses.js";

let addEditDiv = null;
let company = null;
let position = null;
let status = null;
let addingExpense = null;

export const handleAddEdit = () => {
  addEditDiv = document.getElementById("edit-expense");
  company = document.getElementById("company");
  position = document.getElementById("position");
  status = document.getElementById("status");
  addingExpense = document.getElementById("adding-expense");
  const editCancel = document.getElementById("edit-cancel");

  addEditDiv.addEventListener("click", (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addingExpense) {
        showExpenses();
      } else if (e.target === editCancel) {
        showExpenses();
      }
    }
  });
};

export const showAddEdit = (expense) => {
  message.textContent = "";
  setDiv(addEditDiv);
};