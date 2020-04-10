    pragma solidity ^0.5.0;
 
   contract AssetTracker {
    struct Asset {
    string name;
    string description;
    address manufacturer;
    bool initialized;    
         }
         
    struct tracking {
    address location;
    string uuid;
          }
    mapping(string => tracking) locations;
    mapping(string  => Asset) private assetStore;

      event AssetCreate(address manufacturer, string uuid, address location);
      event AssetTransfer(address from, address to, string uuid);

      function createAsset(string memory name, string memory description, string memory uuid) public {
      require(!assetStore[uuid].initialized, "Asset With This UUID Already Exists");
 
      assetStore[uuid] = Asset(name, description, msg.sender,true);
      locations[uuid] = tracking(msg.sender, uuid);
      emit AssetCreate(msg.sender, uuid, msg.sender);
                }
                
       function transferAsset(address to, string memory uuid) public {
         require(locations[uuid].location==msg.sender, "You are Not Authorized to Transfer This Asset");
         
        locations[uuid]= tracking(to, uuid);
        emit AssetTransfer(msg.sender, to, uuid);
               }
               
          function names(string memory uuid)public view returns (string memory) {
 
               return (assetStore[uuid].name);
                   }
          function getAssetLocation(string memory uuid)public view returns (address) {
 
            return (locations[uuid].location);
                  }
          function Descriptions(string memory uuid)public view returns (string memory) {
 
            return (assetStore[uuid].description);
                  }
          function Manufacturers(string memory uuid)public view returns (address) {
 
            return (assetStore[uuid].manufacturer);
                  }
     
       }
