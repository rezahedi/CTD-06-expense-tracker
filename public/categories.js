import { showExpenses } from "./expenses.js";
import {
  setDiv,
  message,
  token,
  enableInput,
  inputEnabled,
} from "./index.js";

let categoriesDiv = null;
let categoriesTable = null;
let categoriesTableHeader = null;
let showExpensesBtn = null;

export const handleCategories = () => {
  categoriesDiv = document.getElementById("categories")
  showExpensesBtn = document.getElementById("show-expenses")
  categoriesTable = document.getElementById("categories-table");
  categoriesTableHeader = document.getElementById("categories-table-header");

  categoriesDiv.addEventListener("click", (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if(e.target === showExpensesBtn) {
        showExpenses()
      }
    }
  })
}

export const showCategories = async () => {
  try {
    enableInput(false);

    const response = await fetch("/api/v1/categories", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    let children = [categoriesTableHeader];

    if (response.status === 200) {
      if (data.count === 0) {
        categoriesTable.replaceChildren(...children); // clear this for safety
      } else {
        for (let i = 0; i < data.categories.length; i++) {
          const category = data.categories[i]
          let rowEntry = document.createElement("tr");

          let editButton = `<button type="button" class="editButton" data-id=${category._id}>edit</button>`;
          let deleteButton = `<button type="button" class="deleteButton" data-id=${category._id}>delete</button>`;
          let rowHTML = `
            <td>${category.title}</td>
            <td>0</td>
            <td>${new Date(category.createdAt).toDateString()}</td>
            <td>${new Date(category.updatedAt).toDateString()}</td>
            <td>${editButton} ${deleteButton}</td>`;

          rowEntry.innerHTML = rowHTML;
          children.push(rowEntry);
        }
        categoriesTable.replaceChildren(...children);
      }
    } else {
      message.textContent = data.msg;
    }
  } catch (err) {
    console.log(err);
    message.textContent = "A communication error occurred.";
  }
  enableInput(true);
  setDiv(categoriesDiv);
};