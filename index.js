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
  const address = "0xc4c9994c7b1f767050b94dccf975d0b4096580f6";
  const abi = [{"constant":false,"inputs":[{"name":"name","type":"string"},{"name":"description","type":"string"},{"name":"uuid","type":"string"}],"name":"createAsset","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"uuid","type":"string"}],"name":"transferAsset","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"account","type":"address"},{"indexed":false,"name":"uuid","type":"string"},{"indexed":false,"name":"manufacturer","type":"address"}],"name":"AssetCreate","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"account","type":"address"},{"indexed":false,"name":"uuid","type":"string"},{"indexed":false,"name":"message","type":"string"}],"name":"RejectCreate","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"from","type":"address"},{"indexed":false,"name":"to","type":"address"},{"indexed":false,"name":"uuid","type":"string"}],"name":"AssetTransfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"from","type":"address"},{"indexed":false,"name":"to","type":"address"},{"indexed":false,"name":"uuid","type":"string"},{"indexed":false,"name":"message","type":"string"}],"name":"RejectTransfer","type":"event"},{"constant":true,"inputs":[{"name":"uuid","type":"string"}],"name":"assetDescription","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"uuid","type":"string"}],"name":"assetLocation","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"uuid","type":"string"}],"name":"assetManufacturer","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"uuid","type":"string"}],"name":"assetName","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"}];
  $(function () {
    var supplychain;
    $('#trackAsset').click(function (e) {
      e.preventDefault();
      supplychain.assetName.call(document.getElementById("trackUuid").value, function (err, result1) {
        if (err) {
          return error(err);
        } 
        // The return value is a BigNumber object
        document.getElementById("name").innerHTML = result1;
      });
    });
    $('#trackAsset').click(function (e) {
      e.preventDefault();
            supplychain.assetDescription.call(document.getElementById("trackUuid").value, function (err, result2) {
        if (err) {
          return error(err);
        } 
        // The return value is a BigNumber object
        document.getElementById("description").innerHTML = result2;
      });
     });
     $('#trackAsset').click(function (e) {
      e.preventDefault();
      supplychain.assetManufacturer.call(document.getElementById("trackUuid").value, function (err, result3) {
        if (err) {
          return error(err);
        } 
        // The return value is a BigNumber object
        document.getElementById("manufacturer").innerHTML = result3;
      });
     });
     $('#trackAsset').click(function (e) {
      e.preventDefault();
       supplychain.assetLocation.call(document.getElementById("trackUuid").value, function (err, result4) {
        if (err) {
          return error(err);
        } 
        // The return value is a BigNumber object
        document.getElementById("location").innerHTML = result4;
      });
    });
    $('#createAsset').click(function (e) {
      e.preventDefault();
      if(web3.eth.defaultAccount === undefined) {
        return error("No accounts found. If you're using MetaMask, " +
                     "please unlock it first and reload the page.");
      }
      log("Transaction On its Way...");
      supplychain.createAsset.sendTransaction(document.getElementById("assetName").value,document.getElementById("assetDescription").value,document.getElementById("assetUuid").value,function (err, hash) {
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
      supplychain.transferAsset.sendTransaction(document.getElementById("address").value,document.getElementById("Uuid").value,function (err, hash) {
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
      if (web3.version.network == 3) {
        error("Wrong network detected. Please switch to the Ropsten test network.");
      } else {
        log("Connected to the Ropsten test network.");
        supplychain = web3.eth.contract(abi).at(address);
        }
    }
  });
