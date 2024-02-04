// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    uint256 public balance;

    event Deposit(string from, uint256 amount, uint256 timestamp);
    event Withdraw(string from, uint256 amount, uint256 timestamp);

    struct Transaction {
        string from;
        uint256 amount;
        uint256 timestamp;
    }

    Transaction[] public tx_History;

    constructor(uint256 initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    function fetch_balance() public view returns (uint256) {
        return balance;
    }

    function deposit(uint256 _amount) public payable {
        uint256 _previousBalance = balance;
        require(msg.sender == owner, "You are not the owner of this account");
        balance += _amount;
        assert(balance == _previousBalance + _amount);
        tx_History.push(
            Transaction({
                from: address_to_string(msg.sender),
                amount: _amount,
                timestamp: block.timestamp
            })
        );
        emit Deposit(address_to_string(msg.sender), _amount, block.timestamp);
    }

    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint256 _previousBalance = balance;
        if (balance < _withdrawAmount) {
            revert
                InsufficientBalance({
                    balance: balance,
                    withdrawAmount: _withdrawAmount
                });
        }
        balance -= _withdrawAmount;
        assert(balance == (_previousBalance - _withdrawAmount));
        tx_History.push(
            Transaction({
                from: address_to_string(msg.sender),
                amount: _withdrawAmount,
                timestamp: block.timestamp
            })
        );
        emit Withdraw(address_to_string(msg.sender), _withdrawAmount, block.timestamp);
    }

    function address_to_string(address _addr) internal pure returns (string memory) {
        bytes32 value = bytes32(uint256(uint160(_addr)));
        bytes memory alphabet = "0123456789abcdef";
        bytes memory str = new bytes(42);
        str[0] = '0';
        str[1] = 'x';
        for (uint256 i = 0; i < 20; i++) {
            str[2 + i * 2] = alphabet[uint8(value[i + 12] >> 4)];
            str[3 + i * 2] = alphabet[uint8(value[i + 12] & 0x0f)];
        }
        return string(str);
    }


    function fetch_tx_History() public view returns (Transaction[] memory) {
        return tx_History;
    }
}