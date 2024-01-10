const abi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"","type":"string"}],"name":"MoviePurchased","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"","type":"string"}],"name":"Subscribed","type":"event"},{"inputs":[{"internalType":"uint256","name":"movieId","type":"uint256"}],"name":"buyMovie","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"string","name":"movieName","type":"string"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"string","name":"img","type":"string"}],"name":"createMovie","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getAllMovies","outputs":[{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"string","name":"img","type":"string"}],"internalType":"struct Blockflix.Movie[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getMemberMovies","outputs":[{"internalType":"string[]","name":"","type":"string[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getSubscriptionDate","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getUserType","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"date","type":"string"}],"name":"subscribe","outputs":[],"stateMutability":"payable","type":"function"}]
const address = "0xcEB86A9402cD47B7458eA3D262698df5A7310B6b";

$(document).ready(function () {
    $("#movies").hide();
    $('#creation-error').hide();
    $('#success-msg').hide();

    $("#connectBtn").click(async function () {
        if (window.ethereum) {
            let addresses = await window.ethereum.request({ method: 'eth_requestAccounts' });
            window.web3 = new Web3(window.ethereum);
    
            console.log(addresses);
    
            var owner1 = '0x8756ce22ab4ea8bb5b0d1e6fa8447cde6b25f355';
            var owner2 = '0x39c342a73a510Bc52E059Bac8b1fD530a793B678';

            if(addresses[0] == owner1) {
                $('.admin-name').html('Tarik Maljanovic')
            } else if(addresses[0] == owner2) {
                $('.admin-name').html('Melisa Geca')
            } else {
                $('.admin').hide()
            }
            
            if(addresses.includes(owner1) == false || addresses.includes(owner2)) {
                $("#create-movie").hide()
            }
                
            $("#connect").slideUp("slow", function () {
                setTimeout(function () {
                    $("#movies").toggleClass("hidden");
                    $("#movies").slideDown("slow");
                }, 500); 
            });
    
            getMembersMovies()
            getUserType()
            displayMemberSubscription();

        } 
    });

    $('#create-movie').click(async function () {
        $('#movieModal').show();
    });
    
    $('#cancel-button').click(function () {
        $('#movieModal').hide();
        $('.alert').hide();
    });

    $('#logout').click(function() {
        window.location.reload()
    })
    
    $('#create-button').click(function() {
        if($('#movie-name').val() == '' || $('#movie-price').val() < 0 || $('#movie-img').val() == '') {
            $('#creation-error').show();
        } else {
            createMovie($('#movie-name').val(), $('#movie-price').val(), $('#movie-img').val())
            $('#movieModal').hide();
        }
    })

    $('#pay-subscription').on('click', async function () {
        try {
            const currentDate = new Date();
            currentDate.setMonth(currentDate.getMonth() + 1);
            memberSubscriptionExpiry = currentDate;

            await paySubscription(memberSubscriptionExpiry);
    
            localStorage.setItem('memberSubscriptionExpiry', memberSubscriptionExpiry.toString());
    
            displayMemberSubscription();
        } catch (error) {
            console.error('Error while purchasing subscription:', error);
        }
    });
});

async function getMembersMovies() {
    const contract = new web3.eth.Contract(abi, address);
    let addresses = await window.ethereum.request({ method: 'eth_requestAccounts' });
    let movies = await contract.methods.getAllMovies().call();
    let userMovies = await contract.methods.getMemberMovies().call({from: addresses[0]});
    let isPlusMember = getUserType()

    let content = '';

    for (let movie of movies) {
        let movieId = (await movie).id.toString(); 
        let isMemberMovie = userMovies.includes(movie.name)

        if((await isPlusMember) == 'MemberPlus') {
            content += `
                <div id="${(await movie).id}" class="movie">
                    <div class="img-container">
                        <img src='${(await movie).img}'/>
                    </div>
                    <div class="right">
                        <p class="text"><strong>${(await movie).name}</strong></p>
                        <p class="text">${(await movie).price} Wei</p>
                        ${(await isExpired()) ? '' : '<button type="button" class="btn btn-primary watch-button">Watch Now</button>'}
                    </div>
                </div>
            `;
        } else {
            content += `
                <div id="${(await movie).id}" class="movie">
                    <div class="img-container">
                        <img src='${(await movie).img}'/>
                    </div>
                    <div class="right">
                        <p class="text"><strong>${(await movie).name}</strong></p>
                        <p class="text">${(await movie).price} Wei</p>
                        ${isMemberMovie ? `<button type="button" class="btn btn-primary watch-button">Watch Now</button>` : `<button onclick="buyMovie(${(await movie).id}, ${(await movie).price})" type="button" class="btn btn-success buy-button">Buy</button>`}
                    </div>
                </div>
            `;
        }
    }
    $('.movies-inner').html(content);
}

async function buyMovie(id, price) {
    const contract = new web3.eth.Contract(abi, address);
    let addresses = await window.ethereum.request({ method: 'eth_requestAccounts' });

    contract.methods.buyMovie(id).send({ from: addresses[0], value: price}).then(async function (result) {	
        console.log("Buy Movie Result:", result);
    });

    contract.events.MoviePurchased().on('data', function (event) {
        console.log(event);
        $('#success-msg').html('You have successfully purchased a movie!')
        $('#success-msg').show();

        setTimeout(() => {
            $('#success-msg').hide();

            getMembersMovies()
            
        }, 5000)
    })
}

async function createMovie(movieName, price, img) {
    const contract = new web3.eth.Contract(abi, address);
    let addresses = await window.ethereum.request({ method: 'eth_requestAccounts' });

    contract.methods.createMovie(movieName, price, img).send({ from: addresses[0] }).then(function (result) {	
        console.log(result);
    })

    getMembersMovies()
}

async function getUserType() {
    let addresses = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const contract = new web3.eth.Contract(abi, address);
    let type = await contract.methods.getUserType().call({from: addresses[0]});
    let expired = await isExpired()

    if(type == 'MemberPlus' && expired == false) {
        $('#pay-subscription').hide();
    }

    console.log(type)
    return type
}

async function isExpired() {
    let expirationDate = new Date(await displayMemberSubscription())
    let date = new Date();
    let expired = date.getFullYear() == expirationDate.getFullYear() && date.getMonth() == expirationDate.getMonth() && date.getDate() == expirationDate.getDate()

    return expired
}

async function paySubscription(date) {
    const contract = new web3.eth.Contract(abi, address);
    let addresses = await window.ethereum.request({ method: 'eth_requestAccounts' });

    contract.methods.subscribe(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`).send({ from: addresses[0], value: 1000000}).then(async function (result) {	
        console.log("Subscription:", result);
    });


    contract.events.Subscribed().on('data', function (event) {
        console.log(event);
        $('#success-msg').html('You have successfully subscribed for a month!')
        $('#success-msg').show();

        setTimeout(() => {
            $('#success-msg').hide();
        }, 5000)

        getMembersMovies()

    })
}

async function displayMemberSubscription() {
    let addresses = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const contract = new web3.eth.Contract(abi, address);
    let date = await contract.methods.getSubscriptionDate().call({from: addresses[0]});

    return date;
}