    const abi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"","type":"string"}],"name":"MoviePurchased","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"","type":"string"}],"name":"Subscribed","type":"event"},{"inputs":[{"internalType":"uint256","name":"movieId","type":"uint256"}],"name":"buyMovie","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"string","name":"movieName","type":"string"},{"internalType":"uint256","name":"price","type":"uint256"}],"name":"createMovie","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getAllMovies","outputs":[{"components":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"price","type":"uint256"}],"internalType":"struct Blockflix.Movie[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getAllPlusMembers","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getMemberMovies","outputs":[{"internalType":"string[]","name":"","type":"string[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getSubscriptionDate","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"date","type":"string"}],"name":"subscribe","outputs":[],"stateMutability":"payable","type":"function"}]
    const address = "0x9d62344b9105f036eCE7fb1bD69A685E73bA76A1"

        $("#movies").hide();

        $("#connectBtn").click(async function () {
            if (window.ethereum) {
                let addresses = await window.ethereum.request({ method: 'eth_requestAccounts' });
                window.web3 = new Web3(window.ethereum);

                console.log(addresses);
                  
            $("#connect").slideUp("slow", function () {
                setTimeout(function () {
                    $("#movies").toggleClass("hidden");
                    $("#movies").slideDown("slow");
                }, 500); 
            });
            
            }
          
        });