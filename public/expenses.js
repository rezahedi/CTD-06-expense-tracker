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
        setToken(null);

        message.textContent = "You have been logged off.";

        expensesTable.replaceChildren([jobsTableHeader]);

        showLoginRegister();
      }
    }
  });
};

export const showExpenses = async () => {
  try {
    enableInput(false);

    const response = await fetch("/api/v1/expenses", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    let children = [expensesTableHeader];

    if (response.status === 200) {
      if (data.count === 0) {
        expensesTable.replaceChildren(...children); // clear this for safety
      } else {
        for (let i = 0; i < data.expenses.length; i++) {
          const expense = data.expenses[i]
          let rowEntry = document.createElement("tr");

          let editButton = `<td><button type="button" class="editButton" data-id=${expense._id}>edit</button></td>`;
          let deleteButton = `<td><button type="button" class="deleteButton" data-id=${expense._id}>delete</button></td>`;
          let rowHTML = `
            <td>${expense.title}</td>
            <td>${expense.amount}</td>
            <td>${expense.category}</td>
            <div>${editButton}${deleteButton}</div>`;

          rowEntry.innerHTML = rowHTML;
          children.push(rowEntry);
        }
        expensesTable.replaceChildren(...children);
      }
    } else {
      message.textContent = data.msg;
    }
  } catch (err) {
    console.log(err);
    message.textContent = "A communication error occurred.";
  }
  enableInput(true);
  setDiv(expensesDiv);
};