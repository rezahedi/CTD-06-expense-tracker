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
      } else if (e.target.classList.contains("editButton")) {
        message.textContent = "";
        showAddEdit(e.target.dataset.id);
      } else if (e.target.classList.contains("deleteButton")) {
        message.textContent = "";
        e.target.disabled = true;
        e.target.innerHTML = 'Deleting ...'
        handleDelete(e.target.dataset.id, ()=>e.target.parentNode.parentNode.remove());
      }
    }
  });
};

const handleDelete = async (expenseId, onDeleteAction) => {
  enableInput(false);

  try {
    const response = await fetch(`/api/v1/expenses/${expenseId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      message.textContent = "The expense entry was removed.";
      onDeleteAction();
    } else {
      const data = await response.json();
      throw new Error(data.msg)
    }
  } catch (err) {
    console.log(err);
    message.textContent = "A communication error occurred.";
  }

  enableInput(true);
}

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

          let editButton = `<button type="button" class="editButton" data-id=${expense._id}>edit</button>`;
          let deleteButton = `<button type="button" class="deleteButton" data-id=${expense._id}>delete</button>`;
          let rowHTML = `
            <td>${expense.title}</td>
            <td>$${expense.amount} USD</td>
            <td>${expense.category?.title || 'No Category'}</td>
            <td>${new Date(expense.createdAt).toDateString()}</td>
            <td>${new Date(expense.updatedAt).toDateString()}</td>
            <td>${editButton} ${deleteButton}</td>`;

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