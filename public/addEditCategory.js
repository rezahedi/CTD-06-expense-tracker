import { enableInput, inputEnabled, setMessage, setDiv, token } from "./index.js";
import { showCategories } from './categories.js'

let addEditDivCategory = null;
let addingCategory = null;
let catTitle = null;
let catBudget = null;

export const handleAddEditCategory = () => {
  addEditDivCategory = document.getElementById("edit-category");
  addingCategory = document.getElementById("adding-category");
  catTitle = document.getElementById("catTitle");
  catBudget = document.getElementById("catBudget");
  const editCancel = document.getElementById("cat-edit-cancel")

  addEditDivCategory.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addingCategory) {
        enableInput(false);
  
        let method = "POST";
        let url = "/api/v1/categories";

        if (addingCategory.textContent === "update") {
          method = "PATCH";
          url += `/${addEditDivCategory.dataset.id}`;
        }

        try {
          const bodyObject = {
            title: catTitle.value,
            budget: catBudget.value,
          }

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
            setMessage(response.status === 200 ? "The category entry was updated." : "The category entry was created.");
  
            catTitle.value = "";
            catBudget.value = "";
  
            showCategories();
          } else {
            setMessage(data.msg, true);
          }
        } catch (err) {
          console.log(err);
          setMessage("A communication error occurred.", true);
        }
  
        enableInput(true);
      } else if (e.target === editCancel) {
        showCategories();
      }
    }
  });
};

export const showAddEditCategory = async (categoryId) => {
  try {
    if (!categoryId) {
      catTitle.value = "";
      catBudget.value = "";
      addingCategory.textContent = "add";
  
      setDiv(addEditDivCategory);
    } else {
      enableInput(false);

      const response = await fetch(`/api/v1/categories/${categoryId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log(data.category)
      if (response.status === 200) {
        catTitle.value = data.category.title;
        catBudget.value = data.category.budget;
        addingCategory.textContent = "update";
        addEditDivCategory.dataset.id = categoryId;

        setDiv(addEditDivCategory);
      } else {
        // might happen if the list has been updated since last display
        setMessage("The Category entry was not found", true);
        showCategories();
      }

      enableInput(true);
    }
  } catch (err) {
    console.log(err);
    setMessage("A communications error has occurred.", true);
    showCategories();
  }
}