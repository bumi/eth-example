pragma solidity ^0.4.15;

contract Token {
  uint256 public exchangeRate;
  address public owner;
  address public oracle;

  function Token(uint _rate, address _oracle) public {
    exchangeRate = _rate;
    owner = msg.sender;
    oracle = _oracle;
  }

  function setExchangeRate(uint _rate) public {
    require(msg.sender == owner || msg.sender == oracle);
    exchangeRate = _rate;
  }
}
