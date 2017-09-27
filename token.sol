pragma solidity ^0.4.15;

contract Token {
  uint256 public exchangeRate;
  uint256 public totalSupply;
  address public owner;
  address public oracle;

  mapping(address => uint256) balances;

  function Token(uint _rate, address _oracle) public {
    exchangeRate = _rate;
    owner = msg.sender;
    oracle = _oracle;
  }

  function setExchangeRate(uint _rate) public {
    require(msg.sender == owner || msg.sender == oracle);
    exchangeRate = _rate;
  }
  
  function balanceOf(address _who) public constant returns (uint balance) {
    return balances[_who];
  }
  
  function buy() public payable {
    require(msg.value > 1 finney);
 
    require(owner.send(msg.value)); // forward eth to the owner of the contract - otherwise the eth would be stuck here
    uint256 tokens = msg.value * exchangeRate;
    
    balances[msg.sender] = balances[msg.sender] + tokens;
    totalSupply = totalSupply + tokens;
  }
}
