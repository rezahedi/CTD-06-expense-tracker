import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showExpenses } from "./expenses.js";

let addEditDiv = null;
let title = null;
let amount = null;
let description = null;
let category = null;
let addingExpense = null;

export const handleAddEdit = () => {
  addEditDiv = document.getElementById("edit-expense");
  title = document.getElementById("title");
  amount = document.getElementById("amount");
  description = document.getElementById("description");
  category = document.getElementById("category");
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
          const response = await fetch(url, {
            method: method,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              title: title.value,
              amount: amount.value,
              description: description.value,
              // FIXME: if category wasn't set on form don't add category as an object's property
              category: category.value,
            }),
          });
  
          const data = await response.json();
          if (response.status === 200 || response.status === 201) {
            // success codes: 201 = create / 200 = update
            message.textContent = (response.status === 200 ? "The expense entry was updated." : "The expense entry was created.");
  
            title.value = "";
            amount.value = "";
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
      } else if (e.target === editCancel) {
        message.textContent = "";
        showExpenses();
      }
    }
  });
};

export const showAddEdit = async (expenseId) => {
  if (!expenseId) {
    title.value = "";
    amount.value = "";
    description.value = "";
    category.value = "";
    addingExpense.textContent = "add";
    message.textContent = "";

    setDiv(addEditDiv);
  } else {
    enableInput(false);

    try {
      // Get categories
      const { categories } = await fetch(`/api/v1/categories`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(data => data.json())
      
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
        description.value = data.expense.description;
        // category.value = data.expense.category;
        addingExpense.textContent = "update";
        message.textContent = "";
        addEditDiv.dataset.id = expenseId;
        //Empty prev added cats to select/options
        category.innerHTML = '';
        [{title:'Select a category', _id:''}, ...categories].forEach(cat => {
          const optionElement = document.createElement('option')
          optionElement.text = cat.title
          optionElement.value = cat._id
          optionElement.selected = (cat._id == data.expense.category?._id)
          category.appendChild(optionElement)
        });

        setDiv(addEditDiv);
      } else {
        // might happen if the list has been updated since last display
        message.textContent = "The Expense entry was not found";
        showExpenses();
      }
    } catch (err) {
      console.log(err);
      message.textContent = "A communications error has occurred.";
      showExpenses();
    }

    enableInput(true);
  }
};