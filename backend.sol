// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

contract Blockflix {
    struct Member {
        address addr;
        string first_name;
        string last_name;
        string[] movies;
    }
    
    struct MemberPlus {
        address addr;
        string first_name;
        string last_name;
        string date;
    }

    address owner;
    address blockFlix = 0x174Ea06678e76f5453Bc43D45976fb3461f76867;

    mapping (address => Member) members;
    mapping (address => MemberPlus) plus_members;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner, "Not owner.");
        _;
    }

    modifier onlyMember {
        require(members[msg.sender].addr == msg.sender, "Not Member");
        _;
    }

    event MoviePurchased(string);

    modifier onlyMemberPlus {
        require(plus_members[msg.sender].addr == msg.sender, "Not MemberPlus");
        _;
    }

    function buyMovie(string memory movieName) public payable onlyOwner onlyMember {
        require(msg.value == 1000000000000000000, "Insufficient funds");
        members[msg.sender].movies.push(movieName);
        
        (bool sent, ) = blockFlix.call{value: msg.value}("");
        require(sent, "Transaction failed");
        emit MoviePurchased("Movie purchased successfully!");
    }

    function subscribe() public payable onlyOwner onlyMemberPlus {
        
    }


}