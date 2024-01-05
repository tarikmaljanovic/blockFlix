const abi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"","type":"string"}],"name":"MoviePurchased","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"","type":"string"}],"name":"Subscribed","type":"event"},{"inputs":[{"internalType":"uint256","name":"movieId","type":"uint256"}],"name":"buyMovie","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"string","name":"movieName","type":"string"},{"internalType":"uint256","name":"price","type":"uint256"}],"name":"createMovie","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getAllMovies","outputs":[{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"price","type":"uint256"}],"internalType":"struct Blockflix.Movie[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getMemberMovies","outputs":[{"internalType":"string[]","name":"","type":"string[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getSubscriptionDate","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getUserType","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"date","type":"string"}],"name":"subscribe","outputs":[],"stateMutability":"payable","type":"function"}]
const address = "0x1383f90dC91374587c8E1C5E6bf37C04aC86B99a";

$("#movies").hide();
$('.alert').hide();

$("#connectBtn").click(async function () {
    if (window.ethereum) {
        let addresses = await window.ethereum.request({ method: 'eth_requestAccounts' });
        window.web3 = new Web3(window.ethereum);

        console.log(addresses);

        var owner1 = '0x8756ce22ab4ea8bb5b0d1e6fa8447cde6b25f355';
        var owner2 = '0x39c342a73a510Bc52E059Bac8b1fD530a793B678';
        
        if(addresses.includes("0x39c342a73a510bc52e059bac8b1fd530a793b678") == false) {
            $("#create-movie").hide()
        }
        
            
        $("#connect").slideUp("slow", function () {
            setTimeout(function () {
                $("#movies").toggleClass("hidden");
                $("#movies").slideDown("slow");
            }, 500); 
        });

        getMovies()
        getUserType()
    } 
});

$('#create-movie').click(async function () {
    $('#movieModal').show();
});

$('#cancel-button').click(function () {
    $('#movieModal').hide();
    $('.alert').hide();
});

$('#create-button').click(function() {
    if($('#movie-name').val() == '' || $('#movie-price').val() < 0) {
        $('.alert').show();
    } else {
        createMovie($('#movie-name').val(), $('#movie-price').val())
        $('#movieModal').hide();
    }
})

async function getMovies() {
    const contract = new web3.eth.Contract(abi, address);
    let movies = await contract.methods.getAllMovies().call();

    let html = ''
    
    for(let movie of movies) {
        html += `
            <div id="${(await movie).id}" class="movie">
                <p class="text">${(await movie).name}</p>
                <p class="text">${(await movie).price} Wei</p>
                <button type="button" class="btn btn-success buy-button">Buy</button>
            </div>
        `
    }
    $('#movies').append(html)


    $('.buy-button').click(function() {
        let movieId = $(this).parent().attr('id');
        buyMovie(movieId);
    });
}

$('#pay-subscription').on('click', async function () {
    try {
        await paySubscription();

        const currentDate = new Date();
        currentDate.setMonth(currentDate.getMonth() + 1);
        memberSubscriptionExpiry = currentDate;

        localStorage.setItem('memberSubscriptionExpiry', memberSubscriptionExpiry.toString());

        displayMemberSubscription();
    } catch (error) {
        console.error('Error while purchasing subscription:', error);
    }
});

async function paySubscription() {
    const contract = new web3.eth.Contract(abi, address);
    let addresses = await window.ethereum.request({ method: 'eth_requestAccounts' });

    contract.methods.subscribe().send({ from: addresses[0], value: 1000000}).then(async function (result) {	
        console.log("Subscription:", result);

    });
}

function displayMemberSubscription() {
    const storedExpiry = localStorage.getItem('memberSubscriptionExpiry');
    
    if (storedExpiry) {
        memberSubscriptionExpiry = new Date(storedExpiry);

        console.log('Member subscription expiry:', memberSubscriptionExpiry);
    } else {
        console.log('Member has no active subscription.');
    }
}

$(document).ready(function () {
    displayMemberSubscription();
});


async function createMovie(movieName, price) {
    const contract = new web3.eth.Contract(abi, address);
    let addresses = await window.ethereum.request({ method: 'eth_requestAccounts' });

    contract.methods.createMovie(movieName, price).send({ from: addresses[0] }).then(function (result) {	
        console.log(result);
    })
}

async function getUserType() {
    const contract = new web3.eth.Contract(abi, address);
    let type = await contract.methods.getUserType().call({from: '0x39c342a73a510Bc52E059Bac8b1fD530a793B678'});

    console.log(await type)
}

async function buyMovie(id) {
    const contract = new web3.eth.Contract(abi, address);
    let addresses = await window.ethereum.request({ method: 'eth_requestAccounts' });

    contract.methods.buyMovie(id).send({ from: addresses[0], value: 55}).then(async function (result) {	
        console.log("Buy Movie Result:", result);

        onMoviePurchased(id);
    });
}
let memberMovies = [];

async function getMembersMovies() {
    const contract = new web3.eth.Contract(abi, address);
    let addresses = await window.ethereum.request({ method: 'eth_requestAccounts' });
    let movies = await contract.methods.getAllMovies().call();
    let userMovies = await contract.methods.getMemberMovies().call({from: addresses[0]});
    console.log(userMovies)

    let content = '';

    for (let movie of movies) {
        let movieId = (await movie).id.toString(); 

        let isMemberMovie = userMovies.includes(movie.name)
        console.log(isMemberMovie)

        content += `
            <div id="${movieId}" class="movie">
                <p class="text">${(await movie).name}</p>
                <p class="text">${(await movie).price} Wei</p>
                ${isMemberMovie ? `<button type="button" class="btn btn-primary watch-button">Watch Now</button>` : `<button onclick="buyMovie(${(await movie).id})" type="button" class="btn btn-success buy-button">Buy</button>`}
            </div>
        `;
    }
    $('#movies').html(content);
}


function onMoviePurchased(id) {
    console.log("Movie Purchased:", id);
    getMembersMovies();
}




