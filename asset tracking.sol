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
mapping(address => mapping(string => bool)) private walletStore;

event AssetCreate(address account, string uuid, address manufacturer);
event RejectCreate(address account, string uuid, string message);
event AssetTransfer(address from, address to, string uuid);
event RejectTransfer(address from, address to, string uuid, string message);

function createAsset(string memory name, string memory description, string memory uuid) public {
 
    if(assetStore[uuid].initialized) {
       emit RejectCreate(msg.sender, uuid, "Asset with this UUID already exists.");
        return;
      }
 
      assetStore[uuid] = Asset(name, description, msg.sender,true);
      locations[uuid] = tracking(msg.sender, uuid);
      walletStore[msg.sender][uuid] = true;
     emit AssetCreate(msg.sender, uuid, msg.sender);
  }
function transferAsset(address to, string memory uuid) public {
 
    if(!assetStore[uuid].initialized) {
        emit RejectTransfer(msg.sender, to, uuid, "No asset with this UUID exists");
        return;
        }
 
    if(!walletStore[msg.sender][uuid]) {
       emit RejectTransfer(msg.sender, to, uuid, "Sender does not own this asset.");
        return;
         }
    walletStore[msg.sender][uuid] = false;
    walletStore[to][uuid] = true;
    locations[uuid]= tracking(to, uuid);
   emit AssetTransfer(msg.sender, to, uuid);
   }
function assetDetails(string memory uuid)public view returns (string memory, string memory, address, address) {
 
    return (assetStore[uuid].name, assetStore[uuid].description, assetStore[uuid].manufacturer, locations[uuid].location);
         }
}