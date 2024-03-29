export const generateAuthListContainer = (
  authParent,
  index,
  createEditMode
) => {
  const { name, authKey, authValue } = authParent;
  const parentDiv = document.createElement("div");

  //name creation
  const nameDiv = document.createElement("div");
  nameDiv.appendChild(document.createTextNode(name));
  nameDiv.classList.add("title");

  //apply button
  const applyButton = document.createElement("button");
  applyButton.appendChild(document.createTextNode("Login"));
  applyButton.classList.add("primary-btn");
  applyButton.addEventListener("click", () => {
    sendAuthToCurrentOpenTab(authKey, authValue);
  });

  //edit Icon
  const editBtn = document.createElement("img");
  editBtn.src = "assets/edit.svg";
  editBtn.classList.add("edit-svg");
  editBtn.addEventListener("click", () => {
    createEditMode(true, index);
  });

  const rightSideWrapperdiv = document.createElement("div");
  rightSideWrapperdiv.classList.add("right-side-wrapper");
  rightSideWrapperdiv.appendChild(applyButton);
  rightSideWrapperdiv.appendChild(editBtn);

  //appending name and button to parentDiv
  parentDiv.appendChild(nameDiv);
  parentDiv.appendChild(rightSideWrapperdiv);

  return parentDiv;
};

export const createEditMode = (inEditMode = false, index) => {
  const parentDiv = document.createElement("form");

  //name Input field
  const nameInputField = document.createElement("div");
  const nameLabel = document.createElement("label");
  nameLabel.appendChild(document.createTextNode("Enter Name: "));
  nameLabel.setAttribute("for", "name");
  const nameInput = document.createElement("input");
  nameInput.setAttribute("type", "text");
  nameInput.setAttribute("id", "name");
  nameInput.setAttribute("name", "name");
  nameInput.required = "true";
  nameInputField.classList.add("inputField");
  nameInputField.appendChild(nameLabel);
  nameInputField.appendChild(nameInput);

  //authKey Input field
  const authKeyInputField = document.createElement("div");
  const authKeyLabel = document.createElement("label");
  authKeyLabel.appendChild(document.createTextNode("Enter Auth Key: "));
  authKeyLabel.setAttribute("for", "authKey");
  const authKeyInput = document.createElement("input");
  authKeyInput.setAttribute("type", "text");
  authKeyInput.setAttribute("id", "authKey");
  authKeyInput.setAttribute("name", "authKey");
  authKeyInput.required = "true";
  authKeyInputField.classList.add("inputField");
  authKeyInputField.appendChild(authKeyLabel);
  authKeyInputField.appendChild(authKeyInput);

  //authValue Input field
  const authValueInputField = document.createElement("div");
  const authValueLabel = document.createElement("label");
  authValueLabel.appendChild(document.createTextNode("Enter Auth Value: "));
  authValueLabel.setAttribute("for", "authValue");
  const authValueInput = document.createElement("input");
  authValueInput.setAttribute("type", "text");
  authValueInput.setAttribute("id", "authValue");
  authValueInput.setAttribute("name", "authValue");
  authValueInput.required = "true";
  authValueInputField.classList.add("inputField");
  authValueInputField.appendChild(authValueLabel);
  authValueInputField.appendChild(authValueInput);

  //cancel button
  const cancelButton = document.createElement("button");
  cancelButton.appendChild(document.createTextNode("Cancel"));
  cancelButton.setAttribute("type", "button");
  cancelButton.classList.add("delete-btn");

  cancelButton.addEventListener("click", () => {
    // createAuthListContainer();
  });

  //apply button
  const applyButton = document.createElement("button");
  applyButton.appendChild(
    document.createTextNode(`${inEditMode ? "Update" : "Add"}`)
  );
  applyButton.classList.add("primary-btn");
  applyButton.addEventListener("click", () => {
    if (authKeyInput.value.length && authValueInput.value.length) {
      const authList = localStorage.getItem("authList");
      const parsedAuthList = JSON.parse(authList);
      const newData = {
        name: nameInput.value,
        authKey: authKeyInput.value,
        authValue: authValueInput.value,
      };
      if (inEditMode) {
        parsedAuthList[index] = newData;
        localStorage.setItem("authList", JSON.stringify(parsedAuthList));
      } else {
        localStorage.setItem(
          "authList",
          JSON.stringify([...parsedAuthList, newData])
        );
      }
    }
  });

  //wrapping cancel an update buttons
  const buttonWrapperDiv = document.createElement("div");
  buttonWrapperDiv.classList.add("button-wrapper");
  buttonWrapperDiv.appendChild(cancelButton);
  buttonWrapperDiv.appendChild(applyButton);

  //appending name and button to parentDiv
  if (inEditMode) {
    const authList = localStorage.getItem("authList");
    const parsedAuthList = JSON.parse(authList);
    
    authValueInput.value = parsedAuthList[index].authValue;
    nameInput.value = parsedAuthList[index].name;
    authKeyInput.value = parsedAuthList[index].authKey;
  }
  parentDiv.appendChild(nameInputField);
  parentDiv.appendChild(authKeyInputField);
  parentDiv.appendChild(authValueInputField);
  parentDiv.appendChild(buttonWrapperDiv);

  const parentContainer = document.querySelector("#parent");
  if (inEditMode) {
    const existingChild = parentContainer.children[index];
    parentContainer.replaceChild(parentDiv, existingChild);
  } else {
    parentContainer.appendChild(parentDiv);
  }
};

const sendAuthToCurrentOpenTab = (authKey, authValue) => {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    const port = chrome.tabs.connect(tabs[0].id, { name: "authKeyComing" });
    port.postMessage({ authKey, authValue });
    port.onMessage.addListener(function (msg) {
      if (msg.question === "applied succesfully!!") {
        console.log("mission successfull");
      } else {
        console.log("something went wrong!!", authKey, authValue);
      }
    });
  });
};
