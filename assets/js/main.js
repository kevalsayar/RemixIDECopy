const web3 = new Web3(window.ethereum),
  abi = document.querySelector("#abi"),
  contractAddress = document.querySelector("#contractaddress"),
  submitBtn = document.querySelector("#submitaddressandabi"),
  dynamicTextBox = document.querySelector("#textboxes");

submitBtn.addEventListener("click", () => {
  if (!abi.value || !contractAddress.value) {
    clearDynamicTextBoxes();
    alert("Input not detected.");
  } else {
    clearDynamicTextBoxes();
    JSON.parse(abi.value)
      .filter((object) => object.type === "function")
      .forEach((object) => {
        const divElement = document.createElement("div");
        divElement.id = object.name;
        divElement.setAttribute("stateMutability", object.stateMutability);
        const buttonElement = document.createElement("button");
        buttonElement.type = "button";
        buttonElement.innerText = object.name;
        buttonElement.onclick = contractInteraction;
        object.inputs.forEach((input) => {
          const inputElement = document.createElement("input");
          inputElement.placeholder = input.name;
          divElement.appendChild(inputElement);
        });
        divElement.appendChild(buttonElement);
        dynamicTextBox.appendChild(divElement);
      });
  }
});

function clearDynamicTextBoxes() {
  while (dynamicTextBox.firstChild) {
    dynamicTextBox.removeChild(dynamicTextBox.firstChild);
  }
}

async function contractInteraction(e) {
  let inputsArray = [];
  const methodName = e.target.innerText;
  const methodElement = document.querySelector(`#${methodName}`);
  methodElement.querySelectorAll("input").forEach((inputElement) => {
    inputsArray.push(inputElement.value);
  });
  const newSmartContract = new web3.eth.Contract(
    JSON.parse(abi.value),
    contractAddress.value
  );
  methodElement.getAttribute("stateMutability") === "view"
    ? newSmartContract.methods[methodName]
        .apply(null, inputsArray)
        .call()
        .then(function (result) {
          alert(result);
        })
    : newSmartContract.methods[methodName]
        .apply(null, inputsArray)
        .send({
          from: (
            await window.ethereum.request({
              method: "eth_requestAccounts",
            })
          )[0],
        })
        .on("receipt", function (receipt) {
          receipt.status === true
            ? alert("Transaction Success!")
            : alert("Transaction Failed!");
        });
}
