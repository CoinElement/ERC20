pragma solidity >=0.5.8 < 0.6.0;

import "./erc20.sol";
import "./ErcTest.sol";

contract RacePrice is ErcTest{

    uint Price;
    mapping(address => int) rank;

    constructor(uint _price) public{
        Price=_price;
    }

    modifier onlyOwner() {
        require(msg.sender == ErcTest.owner, "not the owner of this contract");
        _;
    }

     /// @dev 排名
    function setRank(address _player, int _rank)public onlyOwner{
        rank[_player]=_rank;
    }

    /// @dev 获取奖励
    function getPrice(address _player) public{
        require(rank[_player] != 0,"You have no price");
        if(rank[_player]==1){
            tokenContract.transferFrom(owner, _player, Price*10/100);
        }
    }
}