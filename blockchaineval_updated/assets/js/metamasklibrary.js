export const web3 = new Web3(window.ethereum);
export const getWalletAddress = async () => {
  return (await web3.eth.getAccounts())[0];
};

export const sendTransaction = async (receiveraddress, val) => {
  return await web3.eth.sendTransaction({
    to: receiveraddress,
    from: await getWalletAddress(),
    value: web3.utils.toWei(val),
  });
};

export const switchChain = async (chainId) => {
  return await web3.currentProvider.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: web3.utils.toHex(chainId) }],
  });
};

export const balanceOfToken = async (contractInstance, walletAddress) => {
  return await contractInstance.methods.balanceOf(walletAddress);
};
