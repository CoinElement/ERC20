pragma solidity >=0.5.8 < 0.6.0;

import "./erc20.sol";

contract TournamentPool {
    address public owner;
    uint public numPlayers;
    uint public minEntryFee;
    uint public feeContractPercentage;
    uint public organizerPercentage;
    ERC20 public tokenContract;

    bool public isCompleted;

    // participants in the torunament, include both backers and players
    mapping(address => uint) public backAmount;
    mapping(address => bool) public participants;
    mapping(address => bool) public players;
    address[] userIndex;

    constructor(
        address tokenContractAddress, // The SPWN token contract    erc20
        //address feeContractAddress,
        uint _feeContractPercentage, // out of 100
        uint _organizerPercentage, // out of 100
        address _owner,
        uint _minEntryFee,
        address[] memory initialParticipants
    ) public {
        tokenContract = ERC20(tokenContractAddress);

        feeContractPercentage = _feeContractPercentage;
        organizerPercentage = _organizerPercentage;
        owner = _owner;
        minEntryFee = _minEntryFee;

        // Register the initial participants
        for (uint i = 0; i < initialParticipants.length; i++) {
            address p = initialParticipants[i];
            addParticipant(p);
            emit LogRegistration(p);
        }
    }

    event LogRegistration(address participant);
    event LogUnregister(address participant);
    event LogPayout(address participant, uint payout);
    event LogBacker(address backer, uint amount);
    event LogRefund(address backer, uint amount);
    event LogComplete();
    event LogCancel();

    modifier onlyOwner() {
        require(msg.sender == owner, "not the owner of this contract");
        _;
    }

    function addParticipant(address p) internal {
        if (!participants[p]) {
            participants[p] = true;
            userIndex.push(p);
        }
    }

    function setBacker(address backer, uint amount) internal {
        backAmount[backer] += amount;
        tokenContract.transferFrom(backer, address(this), amount);
        emit LogBacker(backer, amount);
    }

    function refundBacker(address backer, uint amount) internal {
        require(backAmount[backer] >= amount, "backed amount not enough for refund");
        tokenContract.transferFrom(address(this), backer, amount);
        backAmount[backer] -= amount;
        emit LogRefund(backer, amount);
    }

    // Register as a player. Needs the minimum entry fee
    function register(uint amount) public {
        require(!isCompleted, "tournament is already completed");
        require(amount >= minEntryFee, "pay the minimum entry fee");
        address p = msg.sender;
        addParticipant(p);
        setBacker(p, amount);
        if (!players[p]){
            players[p] = true;
            numPlayers++;
        }
        emit LogRegistration(p);
    }

    // Unregister a player. Refunds all funding
    function unregister() public {
        require(!isCompleted, "tournament is already completed");
        address p = msg.sender;
        require(players[p], "participant not registered");
        refundBacker(p, backAmount[p]);
        players[p] = false;
        numPlayers--;
        emit LogUnregister(p);
    }

    // Contribute some money to the prize pool
    function fund(uint amount) public {
        require(!isCompleted, "tournament is already completed");
        addParticipant(msg.sender);
        setBacker(msg.sender, amount);
    }

    // Pay the prize money to each participant
    function payParticipants(address payable[] memory finalPlacements, uint256[] memory prizeAllocationPerTenThousand) internal {
        uint totalBalance = tokenContract.balanceOf(address(this));
        uint organizerPayout = totalBalance * organizerPercentage /100;
        tokenContract.transferFrom(address(this), owner, organizerPayout);
        for (uint i = 0; i < finalPlacements.length; i++) {
            address payable p = finalPlacements[i];
            uint payout = totalBalance * (100-organizerPercentage-feeContractPercentage) * prizeAllocationPerTenThousand[i] /1000000;
            tokenContract.transferFrom(address(this), p, payout);
            emit LogPayout(p, payout);
        }
    }

    function completeTournament(address payable[] memory finalPlacements, uint256[] memory prizeAllocationPerTenThousand) public onlyOwner {
        require(!isCompleted, "tournament is already completed");
        require(finalPlacements.length == prizeAllocationPerTenThousand.length, "length of finalPlacement and prizeAllocation do not match");
        payParticipants(finalPlacements, prizeAllocationPerTenThousand);
       // tokenContract.transferFrom(address(this), address(feeContract), tokenContract.balanceOf(address(this)));
        isCompleted = true;
        emit LogComplete();
    }

    function cancelTournament() public onlyOwner {
        require(!isCompleted, "tournament is already completed");
        for (uint i = 0; i < userIndex.length; i++) {
            address p = userIndex[i];
            if (backAmount[p] > 0) {
                refundBacker(p, backAmount[p]);
            }
        }
        tokenContract.transferFrom(address(this), owner, tokenContract.balanceOf(address(this)));
        isCompleted = true;
        emit LogCancel();
    }
}