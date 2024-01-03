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

    struct Movie {
        uint id;
        string name;
        uint price;
    }

    address owner;
    address blockFlix;
    uint nextId = 0;
    uint subscriptionPrice;

    mapping (address => Member) members;
    mapping (address => MemberPlus) plus_members;
    mapping (uint => Movie) movies;

    constructor() {
        owner = msg.sender;
        blockFlix = 0x174Ea06678e76f5453Bc43D45976fb3461f76867;
        subscriptionPrice = 10;
    }

    modifier onlyOwner {
        require(msg.sender == owner, "Not owner.");
        _;
    }

    modifier createMember {
        if(msg.sender != members[msg.sender].addr) {
            members[msg.sender] = Member({addr: msg.sender, movies: new string[](0)});
        }
        _;
    }

    event MoviePurchased(string);
    event Subscribed(string);


    function buyMovie(uint movieId) public payable createMember {
        require(msg.value == movies[movieId].price, "Insufficient funds");

        members[msg.sender].movies.push(movies[movieId].name);
        
        (bool sent, ) = blockFlix.call{value: msg.value}("");
        require(sent, "Transaction failed");
        emit MoviePurchased("Movie purchased successfully!");
    }

    function subscribe(string memory date) public payable {
        require(msg.value == subscriptionPrice, "Insufficient funds");

        plus_members[msg.sender] = MemberPlus({addr: msg.sender, date: date});
        (bool sent, ) = blockFlix.call{value: msg.value}("");
        require(sent, "Transaction failed");
        emit Subscribed("Subscribed successfully");
    }

    function getMemberMovies() public view returns (string[] memory) {
        return members[msg.sender].movies;
    }

    function getSubscriptionDate() public view returns (string memory) {
        return plus_members[msg.sender].date;
    }

    function createMovie(string memory movieName, uint price) public onlyOwner {
        movies[nextId] = Movie({id: nextId, name: movieName, price: price});
        nextId++;
    }

    function getAllMovies() public view returns(Movie[] memory) {
        Movie[] memory _movies = new Movie[](nextId);
        for(uint i = 0; i < nextId; i++) {
            _movies[i] = movies[i];
        }
        return  _movies;
    }

    function getAllPlusMembers() public view returns (string memory) {
        return plus_members[msg.sender].date;
    }


}