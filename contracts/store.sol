// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Store is Ownable(msg.sender) {

    address amount_owner;

    event Deposited(address _sender, uint _amount);
    event Withdrawn(uint _amount);

    modifier onlyWithdrawer() {
        require(msg.sender == amount_owner);
        _;
    }    

    modifier ensureBalance(uint _amount) {
        require(address(this).balance >= _amount);
        _;
    }

    function checkBalance() public view returns (uint) {
        return address(this).balance;
    }

    function deposit() public payable {
        emit Deposited(msg.sender, msg.value);
    }

    function withdraw (uint _amount) public onlyWithdrawer ensureBalance(_amount) {
        payable(msg.sender).transfer(_amount);
        emit Withdrawn(_amount);
    }

    function changeOwner(address _newOwner) public onlyOwner(){
        amount_owner = _newOwner;
    }
}