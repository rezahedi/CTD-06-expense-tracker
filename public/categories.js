import { showExpenses, toggleSort, showExpensesByCategory } from "./expenses.js";
import {
  setDiv,
  message,
  token,
  enableInput,
  inputEnabled,
} from "./index.js";
const CATEGORY_DEFAULT_SORT = 'title'

let categoriesDiv = null;
let categoriesTable = null;
let categoriesTableHeader = null;
let showExpensesBtn = null;
let sortTitle = null;
let sort = CATEGORY_DEFAULT_SORT;

export const handleCategories = () => {
  categoriesDiv = document.getElementById("categories")
  showExpensesBtn = document.getElementById("show-expenses")
  const addCategory = document.getElementById("add-category");
  categoriesTable = document.getElementById("categories-table");
  categoriesTableHeader = document.getElementById("categories-table-header");
  sortTitle = document.getElementById('sort-title')

  categoriesDiv.addEventListener("click", (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if(e.target === showExpensesBtn) {
        message.textContent = "";
        showExpenses()
      } else if (e.target === addCategory) {
        message.textContent = "";
        showAddCategoryPrompt()
      } else if (e.target.classList.contains("editButton")) {
        message.textContent = "";
        showEditCategoryPrompt(e.target.dataset.title, e.target.dataset.id);
      } else if (e.target.classList.contains("deleteButton")) {
        message.textContent = "";
        e.target.disabled = true;
        e.target.innerHTML = 'Deleting ...'
        handleCategoryDelete(e.target.dataset.id, ()=>e.target.parentNode.parentNode.remove());
      } else if (e.target === sortTitle) {
        sort = sort.includes('title') ? toggleSort(sort) : 'title'
        sortTitle.textContent = sort==='title' ? 'Title ▼' : 'Title ▲'
        showCategories()

      } else if (e.target.classList.contains("filter-by-category")) { // Show expenses linked to the clicked category
        showExpensesByCategory(e.target.dataset.id, e.target.dataset.title)
      }
    }
  })
}

export const showCategories = async () => {
  try {
    enableInput(false);

    // Sort
    const params = new URLSearchParams();
    params.append('sort', sort)

    const response = await fetch(`/api/v1/categories?${params}`, {
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

          let editButton = `<button type="button" class="editButton" data-id="${category._id}" data-title="${category.title}">edit</button>`;
          let deleteButton = `<button type="button" class="deleteButton" data-id="${category._id}">delete</button>`;
          let rowHTML = `
            <td>${category.title}</td>
            <td>${category.expenses ? `<button class="filter-by-category" data-id=${category._id} data-title="${category.title}">${category.expenses}</button>` : '0'}</td>
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

// Get categories
export const getCategories = async () => {
  const { categories } = await fetch(`/api/v1/categories`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(data => data.json())

  return categories
}

export const createCategorySelectElement = (categories, selectedId='') => {
  const defaultOption = {
    title:'Select a category',
    _id:''
  }

  //Empty previous added cats to select/options
  category.innerHTML = '';

  [defaultOption, ...categories].forEach(cat => {
    createOptionElement(cat.title, cat._id, (cat._id == selectedId), category)
  });
}

export const showAddCategoryPrompt = async (selectElement=null) => {
  const title = promptCategory()

  if(!title) return;

  let method = "POST";
  let url = "/api/v1/categories";

  try {
    const { category } = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title }),
    }).then(data => data.json())

    if(selectElement)
      createOptionElement(category.title, category._id, true, selectElement)
    else
      showCategories()
  } catch (err) {
    console.log(err);
    message.textContent = "A communications error has occurred, Try again.";
  }
}

export const showEditCategoryPrompt = async (categoryTitle, categoryId) => {
  const newTitle = promptCategory(`Edit Category '${categoryTitle}':`, categoryTitle)

  if(!newTitle) return;

  let method = "PATCH";
  let url = `/api/v1/categories/${categoryId}`;

  try {
    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: newTitle }),
    }).then(data => data.json())

    showCategories()
  } catch (err) {
    console.log(err);
    message.textContent = "A communications error has occurred, Try again.";
  }
}

export const promptCategory = (msg='New Category:', _default='') => {
  const title = (prompt(msg, _default) || '').trim()

  if(!title) return '';
  // Match value with any chars length between 3 - 30 chars only
  if(!title.match(/^.{3,30}$/)) {
    message.textContent = "Category's name should be between 3 - 30 chars!"
    return ''
  }

  return title;
}

export const createOptionElement = (text='', value='', selected=false, selectElement) => {
  const optionElement = document.createElement('option')
  optionElement.text = text
  optionElement.value = value
  optionElement.selected = selected
  selectElement.appendChild(optionElement)
}

export const handleCategoryDelete = async (categoryId, onDeleteAction) => {
  enableInput(false);

  try {
    const response = await fetch(`/api/v1/categories/${categoryId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      message.textContent = "The category entry was removed.";
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