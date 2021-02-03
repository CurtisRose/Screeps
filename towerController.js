/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('towerController');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    execute: function() {
        var maxHeal = 100000;
        for(const spawnIndexer in Game.spawns) {
            var hostiles = Game.spawns[spawnIndexer].room.find(FIND_HOSTILE_CREEPS);
            var towerRoom = Game.spawns[spawnIndexer].room;
            
            var towers = towerRoom.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_TOWER);
                }
            });
            
            if (towers == null) {
                continue;
            }
            
            // If hostiles attack
            if(hostiles.length > 0) {
                var towerIndexer = 0;
                for (towerIndexer = 0; towerIndexer < towers.length; towerIndexer++) {
                    towers[towerIndexer].attack(hostiles[0]);
                }
            } 
            // Else Repair
            else {
                // TOWER ID 600fae20756659cf3cc6e2c3
                var targets = towerRoom.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER ||
                                structure.structureType == STRUCTURE_ROAD ||
                                structure.structureType == STRUCTURE_STORAGE);
                    }
                });
                // Find the most damaged object (by total) and repair it
                var i;
                var target;
                var largestDiff = 0;
                for (i = 0; i < targets.length; i++) {
                    var diff = targets[i].hitsMax - targets[i].hits;
                    if (diff > largestDiff) {
                        target = targets[i];
                        largestDiff = diff;
                    }
                }
                
                if (target == null) {
                    targets = towerRoom.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_RAMPART ||
                                    structure.structureType == STRUCTURE_WALL);
                        }
                    });
                    for (i = 0; i < targets.length; i++) {
                        // Make sure to give some love to the little guys
                        var maxDiff = targets[i].hitsMax;
                        if (maxDiff > maxHeal) {
                            maxDiff = maxHeal;
                        }
                        if (targets[i].hits < maxHeal) {
                            var diff = maxDiff - targets[i].hits;
                            if (diff > largestDiff) {
                                target = targets[i];
                                largestDiff = diff;
                            }
                        }
                    }
                }
                for (towerIndexer = 0; towerIndexer < towers.length; towerIndexer++) {
                    towers[towerIndexer].repair(target);
                }
            }
        }
    }
};