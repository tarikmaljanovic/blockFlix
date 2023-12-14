// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

contract BlockFlix{

    struct Member{
        address addr;
        string first_name;
        string last_name;
        
    }

    struct MemberPlus{
        address addr;
        string first_name;
        string last_name;
        string date; 
        string[] movies;
    }

    address owner; 

    mapping (address => Member) members;
    mapping (address => MemberPlus) plus_members;

    constructor(){
        owner == msg.sender;
    }

     modifier onlyOwner{
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    event MoviePurchased(string);

    
     modifier onlyMember{
        require(members[msg.sender].addr == msg.sender, "Only member can call this function");
        _;
    }

     modifier onlyMemberPlus{
        require(plus_members[msg.sender].addr == msg.sender, "Only plus member can call this function");
        _;
    }

    function buyMovie() public payable onlyOwner onlyMember {
        require(msg.value == 1000000000000000000, "Insufficient funds");
        

    }
}