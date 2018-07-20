pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract Scheduler is Ownable {

  event NewAppointment(string name, string company, string email, uint256 date);

  function makeAppointment(string _name, string _company, string _email, uint256 _date) external {
    require( bytes(_name).length > 0);
    require( bytes(_company).length > 0);
    require( bytes(_email).length > 0);
    require(_date > block.timestamp);
    emit NewAppointment(_name, _company, _email, _date);
  }
  
}