/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('spawnController');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    execute: function(print) {
        for(const spawnIndexer in Game.spawns) {
            // Build Units if needed
            var currentSpawn = Game.spawns[spawnIndexer];
            var currentRoom = currentSpawn.room;
            
            // Check if spawn is active
            if (!currentSpawn.isActive()) {
                //console.log(currentSpawn + " is NOT active");
                continue;
            } else {
                //console.log(currentSpawn + " is active");
            }
            
            var basicHarvesters = _.filter(currentRoom.find(FIND_MY_CREEPS), (creep) =>creep.memory.role == 'basicHarvester');
            var stationaryHarvestersNode0 = _.filter(currentRoom.find(FIND_MY_CREEPS), (creep) =>creep.memory.role == 'stationaryHarvesterNode0');
            var stationaryHarvestersNode1 = _.filter(currentRoom.find(FIND_MY_CREEPS), (creep) =>creep.memory.role == 'stationaryHarvesterNode1');
            var stationaryHarvestersNode2 = _.filter(currentRoom.find(FIND_MY_CREEPS), (creep) =>creep.memory.role == 'stationaryHarvesterNode2');
            var carriers =  _.filter(currentRoom.find(FIND_MY_CREEPS), (creep) =>creep.memory.role == 'carrier');
            var upgraders = _.filter(currentRoom.find(FIND_MY_CREEPS), (creep) =>creep.memory.role == 'upgrader');
            var builders = _.filter(currentRoom.find(FIND_MY_CREEPS), (creep) =>creep.memory.role == 'builder');
            var mechanics = _.filter(currentRoom.find(FIND_MY_CREEPS), (creep) =>creep.memory.role == 'mechanic');
            var controllers = _.filter(currentRoom.find(FIND_MY_CREEPS), (creep) =>creep.memory.role == 'controller');
            var legionaires = _.filter(currentRoom.find(FIND_MY_CREEPS), (creep) =>creep.memory.role == 'legion');
        
            var carrierGoalCount = 2;
            var upgraderGoalCount = 1;
            var builderGoalCount = 2;
            var stationaryHarvesterGoalCount = 1; // Only need 1 for max efficiency of harvesting per node
            var mechanicGoalCount = 1; // Tower can be a mechanic I guess, no need for mechanics
            var controllerGoalCount = 0;
            var basicHarvestersGoalCount = 0;
            var legionairesGoalCount = 0;
            
            var targets = currentRoom.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION);
                }
            });
            // If the number of extensions in the room is less than 5 then focus on building and harvesting with one upgrader
            if (targets == null || targets.length < 5) {
                carrierGoalCount = 2;
                upgraderGoalCount = 1;
                builderGoalCount = 3;
                stationaryHarvesterGoalCount = 1; // Only need 1 for max efficiency of harvesting per node
                mechanicGoalCount = 0; // Tower can be a mechanic I guess, no need for mechanics
                controllerGoalCount = 0;
                basicHarvestersGoalCount = 0;
                legionairesGoalCount = 0;
            }
            // If there are less sources in the room, don't build as many units
            var sources = currentRoom.find(FIND_SOURCES);
            if (sources.length < 2) {
                carrierGoalCount = 1;
                builderGoalCount = 3;
            }
            
            var hostiles = currentRoom.find(FIND_HOSTILE_CREEPS);
            if (hostiles.length > 0) {
                legionairesGoalCount = 0;
            }
            
            
            if (print) {
                console.log("=========================================");
                console.log(currentSpawn.name);
                console.log('Stationary Harvesters Node 0: ' + stationaryHarvestersNode0.length+'/'+stationaryHarvesterGoalCount);
                //console.log('Stationary Harvesters Node 1: ' + stationaryHarvestersNode1.length+'/'+stationaryHarvesterGoalCount);
                //console.log('Stationary Harvesters Node 2: ' + stationaryHarvestersNode2.length+'/'+stationaryHarvesterGoalCount);
                console.log('Carriers: ' + carriers.length+'/'+carrierGoalCount);
                console.log('Upgraders: ' + upgraders.length+'/'+upgraderGoalCount);
                console.log('Builders: ' + builders.length+'/'+builderGoalCount);
                console.log('Mechanics: ' + mechanics.length+'/'+mechanicGoalCount);
                //console.log('Controllers: ' + controllers.length+'/'+controllerGoalCount);
                //console.log('Basic Harvesters: ' + basicHarvesters.length+'/'+basicHarvestersGoalCount);
                console.log('Legionaires: ' + legionaires.length+'/'+legionairesGoalCount);
            }
            var currentEnergy = currentRoom.energyAvailable;
            var maxEnergy = currentSpawn.room.energyCapacityAvailable;
            var body = [];
            var maxBodyParts = 50;
            
            ///////////////////////////////////////////////////////
            // Stationary Harvester 0
            ///////////////////////////////////////////////////////
            if(stationaryHarvestersNode0.length < stationaryHarvesterGoalCount) {
                var newName = 'StationaryHarvestersNode0' + Game.time;
                body = [WORK,WORK,MOVE];
                var i = 0;
                maxEnergy-=250;
                while (i < 3 && maxEnergy >= 100) {
                    i++;
                    body.push(WORK);
                    maxEnergy -= 100;
                }
                currentSpawn.spawnCreep(body, newName,
                    {memory: {role: 'stationaryHarvesterNode0', targetID: 0}});
            }
            ///////////////////////////////////////////////////////
            // Stationary Harvester 1
            ///////////////////////////////////////////////////////
            else if(sources.length >= 2 && stationaryHarvestersNode1.length < stationaryHarvesterGoalCount) {
                var sources = currentRoom.find(FIND_SOURCES);
                // Only want to build this if there are enough sources
                    var newName = 'StationaryHarvestersNode1' + Game.time;
                    body = [WORK,WORK,MOVE];
                    var i = 0;
                    maxEnergy-=300;
                    while (i < 3 && maxEnergy >= 100) {
                        i++;
                        body.push(WORK);
                        maxEnergy -= 100;
                    }
                    currentSpawn.spawnCreep(body, newName,
                        {memory: {role: 'stationaryHarvesterNode1', targetID: 1}});
            }
            ///////////////////////////////////////////////////////
            // Carriers
            ///////////////////////////////////////////////////////
            else if(carriers.length < carrierGoalCount) {
                var newName = 'Carriers' + Game.time;
                while (maxBodyParts >= 4 && maxEnergy >= 300) {
                    body.push(CARRY);
                    body.push(CARRY);
                    body.push(MOVE);
                    maxBodyParts -= 3*6; // should be 3 and 75 but thats WAY too much
                    maxEnergy -= 75*6; // Don't actually want that many on my carriers
                }
                currentSpawn.spawnCreep(body, newName,
                    {memory: {role: 'carrier', targetID: 0}});
            }
            ///////////////////////////////////////////////////////
            // Legionaires
            ///////////////////////////////////////////////////////
            else if (legionaires < legionairesGoalCount) {
                var newName = 'Legionaire' + Game.time;
                currentSpawn.spawnCreep([ATTACK,ATTACK,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE], newName,
                    {memory: {role: 'legion', targetID: 0}});
            }
            ///////////////////////////////////////////////////////
            // Upgraders
            ///////////////////////////////////////////////////////
            else if(upgraders.length < upgraderGoalCount) {
                // Create dynamic body
                while (maxBodyParts >= 4 && maxEnergy >= 300) {
                    body.push(WORK);
                    body.push(WORK);
                    body.push(CARRY);
                    body.push(MOVE);
                    maxBodyParts -= 4;
                    maxEnergy -= 300;
                }
                var newName = 'Upgrader' + Game.time;
                currentSpawn.spawnCreep(body, newName,
                    {memory: {role: 'upgrader', targetID: 0}});
            }
            ///////////////////////////////////////////////////////
            // Builders
            ///////////////////////////////////////////////////////
            else if(builders.length < builderGoalCount && Game.spawns[spawnIndexer].room.find(FIND_MY_CONSTRUCTION_SITES).length > 0) {
                var newName = 'Builder' + Game.time;
                while (maxBodyParts >= 4 && maxEnergy >= 250) {
                    body.push(WORK);
                    body.push(CARRY);
                    body.push(CARRY);
                    body.push(MOVE);
                    maxBodyParts -= 4;
                    maxEnergy -= 200;
                }
                currentSpawn.spawnCreep(body, newName,
                    {memory: {role: 'builder', targetID: 0}});
        
            }
            ///////////////////////////////////////////////////////
            // Controllers
            ///////////////////////////////////////////////////////
            else if(controllers.length < controllerGoalCount) {
                var newName = 'Controller' + Game.time;
                currentSpawn.spawnCreep([CLAIM,MOVE], newName,
                    {memory: {role: 'controller', targetID: 0}});
            }
            ///////////////////////////////////////////////////////
            // Basic Harvesters
            ///////////////////////////////////////////////////////
            else if(basicHarvesters.length < basicHarvestersGoalCount) {
                var newName = 'BasicHarvester' + Game.time;
                currentSpawn.spawnCreep([WORK,CARRY,MOVE], newName,
                    {memory: {role: 'basicHarvester', targetID: 0}});
            }
            ///////////////////////////////////////////////////////
            // Mechanics
            ///////////////////////////////////////////////////////
            else if(mechanics.length < mechanicGoalCount) {
                var newName = 'mechanic' + Game.time;
                currentSpawn.spawnCreep([WORK,CARRY,MOVE], newName,
                    {memory: {role: 'mechanic', targetID: 0}});
            }
            
            
            // Give visual indicator if spawning unit
            if(currentSpawn.spawning) {
                var spawningCreep = Game.creeps[Game.spawns[spawnIndexer].spawning.name];
                currentRoom.visual.text(
                    '🛠️' + spawningCreep.memory.role,
                    Game.spawns[spawnIndexer].pos.x + 1,
                    Game.spawns[spawnIndexer].pos.y,
                    {align: 'left', opacity: 0.8});
            }
        }
    }
};