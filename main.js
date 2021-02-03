var roleBasicHarvester = require('role.basicHarvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleCarrier = require('role.carrier');
var roleMechanic = require('role.mechanic');
var roleStationaryHarvesterNode0 = require('role.stationaryHarvesterNode0');
var roleStationaryHarvesterNode1 = require('role.stationaryHarvesterNode1');
var roleStationaryHarvesterNode2 = require('role.stationaryHarvesterNode2');
var roleController = require('role.controller');
var roleLegion = require('role.legion');

var towerController = require('towerController');
var spawnController = require('spawnController');

module.exports.loop = function () {
    clearMemory();

    towerController.execute();
    // spawnController needs to be made more generic
    spawnController.execute(true);

    executeCreepRoles();
    
    if(Game.cpu.bucket == 10000) {
        Game.cpu.generatePixel();
    } else {
        //console.log("[Main]: CPU Bucket: " + Game.cpu.bucket);
    }
}

function executeCreepRoles() {
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'basicHarvester') {
            roleBasicHarvester.run(creep);
            continue;
        }
        if(creep.memory.role == 'stationaryHarvesterNode0') {
            roleStationaryHarvesterNode0.run(creep);
            continue;
        }
        if(creep.memory.role == 'stationaryHarvesterNode1') {
            roleStationaryHarvesterNode1.run(creep);
            continue;
        }
        if(creep.memory.role == 'stationaryHarvesterNode2') {
            roleStationaryHarvesterNode2.run(creep);
            continue;
        }
        if(creep.memory.role == 'carrier') {
            roleCarrier.run(creep);
            continue;
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
            continue;
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
            continue;
        }
        if(creep.memory.role == 'mechanic') {
            roleMechanic.run(creep);
            continue;
        }
        if(creep.memory.role == 'controller') {
            roleController.run(creep);
            continue;
        }
        if(creep.memory.role == 'legion') {
            roleLegion.run(creep);
            continue;
        }
    }
}

function clearMemory() {
    // Clear any dead creep memory
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            //console.log('Clearing non-existing creep memory:', name);
        }
    }
}
