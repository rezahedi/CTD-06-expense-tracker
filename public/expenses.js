import {
  inputEnabled,
  setDiv,
  message,
  setToken,
  token,
  enableInput,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showAddEdit } from "./addEdit.js";

let expensesDiv = null;
let expensesTable = null;
let expensesTableHeader = null;

export const handleExpenses = () => {
  expensesDiv = document.getElementById("expenses");
  const logoff = document.getElementById("logoff");
  const addExpense = document.getElementById("add-expense");
  expensesTable = document.getElementById("expenses-table");
  expensesTableHeader = document.getElementById("expenses-table-header");

  expensesDiv.addEventListener("click", (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addExpense) {
        showAddEdit(null);
      } else if (e.target === logoff) {
        showLoginRegister();
      }
    }
  });
};

export const showExpenses = async () => {
  setDiv(expensesDiv);
};