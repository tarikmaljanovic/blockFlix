// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

contract Blockflix {
    struct Member {
        address addr;
        string[] movies;
    }
    
    struct MemberPlus {
        address addr;
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

    modifier createMember {
        if(owner != members[owner].addr) {
            members[owner] = Member({addr: owner, movies: new string[](0)});
        }
        _;
    }

    event MoviePurchased(string);


    function buyMovie(string memory movieName) public payable onlyOwner createMember {
        require(msg.value == 1000000000000000000, "Insufficient funds");

        members[msg.sender].movies.push(movieName);
        
        (bool sent, ) = blockFlix.call{value: msg.value}("");
        require(sent, "Transaction failed");
        emit MoviePurchased("Movie purchased successfully!");
    }

    function subscribe(string memory date) public payable onlyOwner {
        
    }

    function getMemberMovies() public view onlyOwner returns (string[] memory) {
        return members[msg.sender].movies;
    }

}