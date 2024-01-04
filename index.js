const abi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"","type":"string"}],"name":"MoviePurchased","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"","type":"string"}],"name":"Subscribed","type":"event"},{"inputs":[{"internalType":"uint256","name":"movieId","type":"uint256"}],"name":"buyMovie","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"string","name":"movieName","type":"string"},{"internalType":"uint256","name":"price","type":"uint256"}],"name":"createMovie","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getAllMovies","outputs":[{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"price","type":"uint256"}],"internalType":"struct Blockflix.Movie[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getMemberMovies","outputs":[{"internalType":"string[]","name":"","type":"string[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getSubscriptionDate","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getUserType","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"date","type":"string"}],"name":"subscribe","outputs":[],"stateMutability":"payable","type":"function"}]
const address = "0x048D0f806Ca2E7d78694Fe09B1658685135BE7DA"

$("#movies").hide();
$('.alert').hide();

$("#connectBtn").click(async function () {
    if (window.ethereum) {
        let addresses = await window.ethereum.request({ method: 'eth_requestAccounts' });
        window.web3 = new Web3(window.ethereum);

        console.log(addresses);

        if(addresses.includes('0x8756ce22ab4ea8bb5b0d1e6fa8447cde6b25f355') == false) {
            $('#create-movie').hide()
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
                <button type="button" class="btn btn-success">Buy</button>
            </div>
        `
    }
    $('#movies').append(html)
}

async function createMovie(movieName, price) {
    const contract = new web3.eth.Contract(abi, address);
    let addresses = await window.ethereum.request({ method: 'eth_requestAccounts' });

    contract.methods.createMovie(movieName, price).send({ from: addresses[0] }).then(function (result) {	
        console.log(result);
    })
}

async function getUserType() {
    const contract = new web3.eth.Contract(abi, address);
    let type = await contract.methods.getUserType().call();

    console.log(type)
}

