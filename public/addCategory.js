import { message, token } from "./index.js";
let addCategoryButton = null
let categorySelectElement = null

export const handleCategory = async () => {
  addCategoryButton = document.getElementById('add-category')
  categorySelectElement = document.getElementById("category");

  addCategoryButton.addEventListener("click", async (e) => {
    e.preventDefault()

    const title = (prompt('New Category:') || '').trim()

    if(!title) return;
    // Match value with any chars length between 3 - 30 chars only
    if(!title.match(/^.{3,30}$/))
      return message.textContent = "Category's name should be between 3 - 30 chars!"

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

      const optionElement = document.createElement('option')
      optionElement.text = category.title
      optionElement.value = category._id
      optionElement.selected = true
      categorySelectElement.appendChild(optionElement)
    } catch (err) {
      console.log(err);
      message.textContent = "A communications error has occurred, Try again.";
    }
  })
}