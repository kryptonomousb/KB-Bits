import { ethers } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { VerifySignature } from '../typechain-types';

const {  deployContract, getSigners, Signature } = ethers;


describe('Testing Signature Ethers v6', function(){

let deployer: SignerWithAddress, user1:SignerWithAddress;
let verifySignature: VerifySignature;


before(async function(){
[deployer, user1] = await getSigners();
verifySignature = await ethers.deployContract("contracts/VerifySignature.sol:VerifySignature", deployer) as VerifySignature;

});


it("Testing Verification", async function(){
 


 let to = user1.address;
 let amount = 1;
 let message = "Testing this message";
 let nonce = 1;

  // Get a message HASH using getMessageHash.  it will return a string.
let messageHash = await verifySignature.getMessageHash(to, amount, message, nonce);

///   messageHash:STRING -  needs to be converted to Bytes32 with ethers.getBytes
let signMessage = await deployer.signMessage(ethers.getBytes(messageHash));

let sig = await Signature.from(signMessage); /// returns sig.v, sig.r, sig.s
console.log("messageHash: ", messageHash);
console.log("messageHash Converted:", ethers.getBytes(messageHash));
console.log("~~~~~~~ Signed message ~~~~~~~~");
console.log(signMessage);
console.log("");

console.log("~~~~~~~ using ethers Signature to split sig to v r s ~~~~~~~~");
console.log("v: ", sig.v);
console.log("r: ", sig.r);
console.log("s: ", sig.s);


console.log("~~~~~~~ Address matches in Signed Message ~~~~~~~~");
                                         /// Signer, to, amount, message, nonce, SignedMessage
console.log(await verifySignature.verify(deployer.address, to, amount, message, nonce, signMessage));
expect(await verifySignature.verify(deployer.address, to, amount, message, nonce, signMessage)).to.equal(true);
expect(await verifySignature.verify(deployer.address, to, amount+1, message, nonce, signMessage)).to.equal(false);


});

})