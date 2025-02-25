import {
  inputEnabled,
  setDiv,
  message,
  setToken,
  token,
  enableInput,
  emptyTables,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showAddEdit } from "./addEdit.js";
import { showCategories } from "./categories.js";

const EXPENSE_DEFAULT_SORT = 'createdAt'
const PAGE_SIZE = 10;

let expensesDiv = null;
let expensesTable = null;
let expensesTableHeader = null;
let showCategoriesBtn = null;
let sortAmount = null;
let sortCreatedAt = null;
let sortUpdatedAt = null;
let sort = EXPENSE_DEFAULT_SORT;
let categoryFilterId = null;
let categoryFilterTitle = null;
let removeCategoryFilterBtn = null;
let page = 1;
let size = PAGE_SIZE;

export const handleExpenses = () => {
  expensesDiv = document.getElementById("expenses");
  showCategoriesBtn = document.getElementById("show-categories")
  const addExpense = document.getElementById("add-expense");
  expensesTable = document.getElementById("expenses-table");
  expensesTableHeader = document.getElementById("expenses-table-header");
  sortAmount = document.getElementById('sort-amount')
  sortCreatedAt = document.getElementById('sort-createdAt')
  sortUpdatedAt = document.getElementById('sort-updatedAt')
  removeCategoryFilterBtn = document.getElementById('remove-category-filter')
  const prevBtn = document.getElementById('prevBtn')
  const nextBtn = document.getElementById('nextBtn')
  const pageLimitSelector = document.getElementById('pageLimitSelector')

  expensesDiv.addEventListener("click", (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if(e.target === showCategoriesBtn) {
        message.textContent = "";
        showCategories()
      } else if (e.target === addExpense) {
        message.textContent = "";
        showAddEdit(null);
      } else if (e.target.classList.contains("editButton")) {
        message.textContent = "";
        showAddEdit(e.target.dataset.id);
      } else if (e.target.classList.contains("deleteButton")) {
        message.textContent = "";
        e.target.disabled = true;
        e.target.innerHTML = 'Deleting ...'
        handleDelete(e.target.dataset.id, ()=>e.target.parentNode.parentNode.remove());

      // Sort
      } else if (e.target === sortAmount) {
        sort = sort.includes('amount') ? toggleSort(sort) : 'amount'
        sortAmount.textContent = sort==='amount' ? 'Amount ▼' : 'Amount ▲'
        sortCreatedAt.textContent = 'Created At'
        sortUpdatedAt.textContent = 'Modified At'
        showExpenses()
      } else if (e.target === sortCreatedAt) {
        sort = sort.includes('createdAt') ? toggleSort(sort) : 'createdAt'
        sortCreatedAt.textContent = sort==='createdAt' ? 'Created At ▼' : 'Created At ▲'
        sortAmount.textContent = 'Amount'
        sortUpdatedAt.textContent = 'Modified At'
        showExpenses()
      } else if (e.target === sortUpdatedAt) {
        sort = sort.includes('updatedAt') ? toggleSort(sort) : 'updatedAt'
        sortUpdatedAt.textContent = sort==='updatedAt' ? 'Modified At ▼' : 'Modified At ▲'
        sortAmount.textContent = 'Amount'
        sortCreatedAt.textContent = 'Created At'
        showExpenses()

      // Filter expenses by clicked category
      } else if (e.target.classList.contains("filter-by-category")) {
        categoryFilterId = e.target.dataset.id
        categoryFilterTitle = e.target.textContent
        showExpenses()
      } else if (e.target === removeCategoryFilterBtn) {
        categoryFilterId = null
        categoryFilterTitle = null
        showExpenses()

      // Logout
      } else if (e.target.classList.contains("logoff")) {
        setToken(null);
        message.textContent = "You have been logged off.";
        emptyTables()
        showLoginRegister();

      // Pagination
      } else if (e.target === nextBtn) {
        page++;
        prevBtn.disabled = page===1
        showExpenses()
      } else if (e.target === prevBtn) {
        if(page===0) return;
        page--;
        prevBtn.disabled = page===1
        nextBtn.disabled = false;
        showExpenses()
      }
    }
  });

  pageLimitSelector.addEventListener("change", (e) => {
    size = parseInt(e.target.value);
    showExpenses()
  })
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

export const showExpensesByCategory = async (categoryId, categoryTitle) => {
  categoryFilterId = categoryId
  categoryFilterTitle = categoryTitle
  showExpenses()
}

export const showExpenses = async () => {
  try {
    enableInput(false);

    const params = new URLSearchParams();

    // Filters
    const filterStatusDiv = document.getElementById('filter-status')
    if(categoryFilterId) {
      // Update API params
      params.append('category', categoryFilterId)

      // Update UI
      filterStatusDiv.getElementsByTagName('span')[0].textContent = categoryFilterTitle
      filterStatusDiv.style.display = 'block'
    } else {
      filterStatusDiv.style.display = 'none'
    }

    // Sort
    params.append('sort', sort)

    // Pagination
    params.append('page', page)
    params.append('size', size)

    const response = await fetch(`/api/v1/expenses?${params}`, {
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
        page--;
        nextBtn.disabled = true;
        prevBtn.disabled = page===1
        // expensesTable.replaceChildren(...children); // clear this for safety
      } else {
        for (let i = 0; i < data.expenses.length; i++) {
          const expense = data.expenses[i]
          let rowEntry = document.createElement("tr");

          let editButton = `<button type="button" class="editButton" data-id=${expense._id}>edit</button>`;
          let deleteButton = `<button type="button" class="deleteButton" data-id=${expense._id}>delete</button>`;
          let rowHTML = `
            <td>${expense.title}</td>
            <td>${expense.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
            <td>${expense.card || ''}</td>
            <td><button class="filter-by-category link" data-id=${expense.category?._id || ''}>${expense.category?.title || 'No Category'}</button></td>
            <td>${new Date(expense.createdAt).toDateString()}</td>
            <td>${new Date(expense.updatedAt).toDateString()}</td>
            <td>${editButton} ${deleteButton}</td>`;

          rowEntry.innerHTML = rowHTML;
          children.push(rowEntry);
        }
        expensesTable.replaceChildren(...children);
      }
      nextBtn.disabled = data.expenses.length < size;
      document.getElementById('pageNum').textContent = `Page ${page}`
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

export const toggleSort = (sort) => {
  return sort.startsWith('-') ? sort.slice(1) : `-${sort}`
}