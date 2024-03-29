import { generateAuthListContainer, createEditMode } from "./utils.js";

const initialAuthList = [];

const addNewBtn = document.querySelector("#add-new-btn");
addNewBtn.addEventListener("click", () => {
  createEditMode();
});

const createAuthListContainer = () => {
  let authList = localStorage.getItem("authList");
  if (authList === null) {
    localStorage.setItem("authList", JSON.stringify(initialAuthList));
    authList = localStorage.getItem("authList");
  }
  authList = JSON.parse(authList);
  const parentContainer = document.querySelector("#parent");
  authList?.forEach((authParent, index) => {
    const authListContainer = generateAuthListContainer(
      authParent,
      index,
      createEditMode
    );
    authListContainer.classList.add("auth-parent");
    parentContainer.appendChild(authListContainer);
  });
};

createAuthListContainer();
