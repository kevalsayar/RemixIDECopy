const web3 = new Web3(window.ethereum),
  abi = document.querySelector("#abi"),
  contractAddress = document.querySelector("#contractaddress"),
  submitBtn = document.querySelector("#submitaddressandabi"),
  dynamicTextBox = document.querySelector("#textboxes");

submitBtn.addEventListener("click", () => {
  clearDynamicTextBoxes();
  const jsonAbi = JSON.parse(abi.value);
  for (let object in jsonAbi) {
    if (jsonAbi[object].type === "function") {
      dynamicTextBox.innerHTML += `<div> Function Name: ${jsonAbi[object].name}`;
      for (let i = 0; i < jsonAbi[object].inputs.length; i++) {
        dynamicTextBox.innerHTML += `<input id=${jsonAbi[object].inputs[i].name} type="text" placeholder=${jsonAbi[object].inputs[i].name}>`;
      }
      dynamicTextBox.innerHTML += `<button type="button" id=${
        jsonAbi[object].name
      } onClick=${jsonAbi[object].name}">${
        jsonAbi[object].stateMutability === "view" ? "CALL" : "TRANSACT"
      }</button> </div>`;
    }
  }
});

function clearDynamicTextBoxes() {
  while (dynamicTextBox.firstChild) {
    dynamicTextBox.removeChild(dynamicTextBox.firstChild);
  }
}
