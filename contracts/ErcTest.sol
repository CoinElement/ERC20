pragma solidity >=0.5.8 < 0.6.0;

import "./erc20.sol";

contract ErcTest{

    address public owner;
    ERC20 public tokenContract;


    constructor(
        address tokenContractAddress,
        address _owner
    ) public{
        tokenContract = ERC20(tokenContractAddress);
        owner=_owner;
    }

     function transferToShop(uint256 _value)
        public
        returns (bool)
    {
        tokenContract.transferFrom(msg.sender, address(this), _value);
        return true;
    }

    /// @dev 收钱
    function getMoneyFromShop(uint256 _value) public {
        tokenContract.transferFrom(address(this), msg.sender, _value);
    }

    /// @dev 玩家间交易
    function transferTo(
        address p1,
        address p2,
        uint256 _value
    ) public returns (bool) {
        tokenContract.transferFrom(p1, p2, _value);
        return true;
    }
}