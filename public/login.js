import {
  inputEnabled,
  setDiv,
  enableInput,
  setToken,
  setMessage,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showExpenses } from "./expenses.js";

let loginDiv = null;
let email = null;
let password = null;

export const handleLogin = () => {
  loginDiv = document.getElementById("login-div");
  email = document.getElementById("email");
  password = document.getElementById("password");
  const loginButton = document.getElementById("login-button");
  const loginCancel = document.getElementById("login-cancel");

  loginDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === loginButton) {
        enableInput(false);

        try {
          const response = await fetch("/api/v1/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: email.value,
              password: password.value,
            }),
          });

          const data = await response.json();
          if (response.status === 200) {
            setMessage(`login successful. Welcome ${data.user.name}`)
            setToken(data.token, data.user.name);

            email.value = "";
            password.value = "";

            showExpenses();
          } else {
            setMessage(data.msg, true);
          }
        } catch (err) {
          console.error(err);
          setMessage("A communications error occurred.", true);
        }

        enableInput(true);
      } else if (e.target === loginCancel) {
        email.value = "";
        password.value = "";
        showLoginRegister();
      }
    }
  });
};

export const showLogin = () => {
  email.value = null;
  password.value = null;
  setDiv(loginDiv);
};