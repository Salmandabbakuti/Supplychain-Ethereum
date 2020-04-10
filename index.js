function log(message) {
    $('#log').append($('<p>').text(message));
    $('#log').scrollTop($('#log').prop('scrollHeight'));
  }
  function error(message) {
    $('#log').append($('<p>').addClass('dark-red').text(message));
    $('#log').scrollTop($('#log').prop('scrollHeight'));
  }
  function waitForReceipt(hash, cb) {
    web3.eth.getTransactionReceipt(hash, function (err, receipt) {
      if (err) {
        error(err);
      }
      if (receipt !== null) {
        // Transaction went through
        if (cb) {
          cb(receipt);
        }
      } else {
        // Try again in 1 second
        window.setTimeout(function () {
          waitForReceipt(hash, cb);
        }, 1000);
      }
    });
  }
  const address = "0xafee82fDAe28D3404cE3De18A62cCA28Acb974C7";
  const abi = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "manufacturer",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "uuid",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "location",
          "type": "address"
        }
      ],
      "name": "AssetCreate",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "uuid",
          "type": "string"
        }
      ],
      "name": "AssetTransfer",
      "type": "event"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "uuid",
          "type": "string"
        }
      ],
      "name": "createAsset",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "uuid",
          "type": "string"
        }
      ],
      "name": "transferAsset",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "string",
          "name": "uuid",
          "type": "string"
        }
      ],
      "name": "names",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "string",
          "name": "uuid",
          "type": "string"
        }
      ],
      "name": "getAssetLocation",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "string",
          "name": "uuid",
          "type": "string"
        }
      ],
      "name": "Descriptions",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "internalType": "string",
          "name": "uuid",
          "type": "string"
        }
      ],
      "name": "Manufacturers",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ];
   $(function () {
    var AssetTracker;
    $('#trackAsset').click(function (e) {
      e.preventDefault();
      AssetTracker.names.call(document.getElementById("trackUuid").value, function (err, re) {
        if (err) {
          return error(err);
        } 
        // The return value is a BigNumber object
        document.getElementById("name").innerHTML = re ;
      });
    });
    $('#trackAsset').click(function (e) {
      e.preventDefault();
            AssetTracker.Descriptions.call(document.getElementById("trackUuid").value, function (err, res) {
        if (err) {
          return error(err);
        } 
        // The return value is a BigNumber object
       document.getElementById("description").innerHTML = res;
      });
     });
     $('#trackAsset').click(function (e) {
      e.preventDefault();
      AssetTracker.Manufacturers.call(document.getElementById("trackUuid").value, function (err, resul) {
        if (err) {
          return error(err);
        } 
        // The return value is a BigNumber object
        document.getElementById("manufacturer").innerHTML = resul ;
      });
     });
     $('#trackAsset').click(function (e) {
      e.preventDefault();
       AssetTracker.getAssetLocation.call(document.getElementById("trackUuid").value, function (err, resu) {
        if (err) {
          return error(err);
        } 
        // The return value is a BigNumber object
       document.getElementById("location").innerHTML = resu;
      });
    });
    $('#createAsset').click(function (e) {
      e.preventDefault();
      if(web3.eth.defaultAccount === undefined) {
        return error("No accounts found. If you're using MetaMask, " +
                     "please unlock it first and reload the page.");
      }
      log("Transaction On its Way...");
      AssetTracker.createAsset.sendTransaction(document.getElementById("assetName").value,document.getElementById("assetDescription").value,document.getElementById("assetUuid").value,function (err, hash) {
        if (err) {
          return error(err);
        }
        waitForReceipt(hash, function () {
          log("Transaction succeeded.");
        });
      });
    });
    $('#transferAsset').click(function (e) {
      e.preventDefault();
      if(web3.eth.defaultAccount === undefined) {
        return error("No accounts found. If you're using MetaMask, " +
                     "please unlock it first and reload the page.");
      }
      log("Transaction On its Way...");
      AssetTracker.transferAsset.sendTransaction(document.getElementById("address").value,document.getElementById("Uuid").value,function (err, hash) {
        if (err) {
          return error(err);
        }
        waitForReceipt(hash, function () {
          log("Transaction succeeded.");
        });
      });
    });
    if (typeof(web3) === "undefined") {
      error("Unable to find web3. " +
            "Please run MetaMask (or something else that injects web3).");
    } else {
      log("Found injected web3.");
      web3 = new Web3(web3.currentProvider);
      ethereum.enable();
      if (web3.version.network != 4) {
        error("Wrong network detected. Please switch to the Ropsten test network.");
      } else {
        log("Connected to the Ropsten test network.");
        AssetTracker = web3.eth.contract(abi).at(address);
        }
    }
  });
