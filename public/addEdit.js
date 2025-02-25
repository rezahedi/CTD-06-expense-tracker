import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showExpenses } from "./expenses.js";
import { getCategories, createCategorySelectElement, showAddCategoryPrompt } from "./categories.js";

let addEditDiv = null;
let title = null;
let amount = null;
let card = null;
let description = null;
let category = null;
let addingExpense = null;

export const handleAddEdit = () => {
  addEditDiv = document.getElementById("edit-expense");
  title = document.getElementById("title");
  amount = document.getElementById("amount");
  card = document.getElementById("card");
  description = document.getElementById("description");
  category = document.getElementById("category");
  const addCategoryToSelect = document.getElementById("add-category-to-select");
  addingExpense = document.getElementById("adding-expense");
  const editCancel = document.getElementById("edit-cancel");

  addEditDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addingExpense) {
        enableInput(false);
  
        let method = "POST";
        let url = "/api/v1/expenses";

        if (addingExpense.textContent === "update") {
          method = "PATCH";
          url += `/${addEditDiv.dataset.id}`;
        }

        try {
          const bodyObject = {
            title: title.value,
            amount: amount.value,
            card: card.value,
            description: description.value,
          }
          if(category.value) bodyObject.category = category.value

          const response = await fetch(url, {
            method: method,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(bodyObject),
          });
  
          const data = await response.json();
          if (response.status === 200 || response.status === 201) {
            // success codes: 201 = create / 200 = update
            message.textContent = (response.status === 200 ? "The expense entry was updated." : "The expense entry was created.");
  
            title.value = "";
            amount.value = "";
            card.value = "";
            description.value = "";
            category.value = "";
  
            showExpenses();
          } else {
            message.textContent = data.msg;
          }
        } catch (err) {
          console.log(err);
          message.textContent = "A communication error occurred.";
        }
  
        enableInput(true);
      } else if(e.target === addCategoryToSelect) {
        e.preventDefault()
        showAddCategoryPrompt(category)
      } else if (e.target === editCancel) {
        message.textContent = "";
        showExpenses();
      }
    }
  });
};

export const showAddEdit = async (expenseId) => {
  try {
    const categories = await getCategories();

    if (!expenseId) {
      title.value = "";
      amount.value = "";
      card.value = "";
      description.value = "";
      addingExpense.textContent = "add";
      message.textContent = "";
  
      createCategorySelectElement(categories)

      setDiv(addEditDiv);
    } else {
      enableInput(false);

      const response = await fetch(`/api/v1/expenses/${expenseId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.status === 200) {
        title.value = data.expense.title;
        amount.value = data.expense.amount;
        card.value = data.expense.card || '';
        description.value = data.expense.description;
        // category.value = data.expense.category;
        addingExpense.textContent = "update";
        message.textContent = "";
        addEditDiv.dataset.id = expenseId;

        createCategorySelectElement(categories, data.expense.category?._id || '')

        setDiv(addEditDiv);
      } else {
        // might happen if the list has been updated since last display
        message.textContent = "The Expense entry was not found";
        showExpenses();
      }

      enableInput(true);
    }
  } catch (err) {
    console.log(err);
    message.textContent = "A communications error has occurred.";
    showExpenses();
  }

};