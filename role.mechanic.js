var roleMechanic = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.repairing && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.targetID = null;
            creep.memory.repairing = false;
            creep.say('🔄 pickup');
        }
        if(!creep.memory.repairing && creep.store.getFreeCapacity() == 0) {
            creep.memory.targetID = null;
            creep.memory.repairing = true;
            creep.say('⚡ repairing');
        }
        
        if(creep.memory.repairing) {
            var target = Game.getObjectById(creep.memory.targetID);
            if (target == null) {
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER ||
                            structure.structureType == STRUCTURE_ROAD);
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
                creep.memory.targetID = target.id;
            }
            else {
                if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffff00'}});
                }
            }
        }
        else { // picking up resources
            var targetContainer = Game.getObjectById(creep.memory.targetID);
            if (targetContainer == null) {
                var containers = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_STORAGE ||
                                structure.structureType == STRUCTURE_CONTAINER)}});
                // Find fullest container
                var i;
                var container;
                for (i = 0; i < containers.length; i++) {

                    if (container == null) {
                        container = containers[i];
                    } else {
                        if (container.store[RESOURCE_ENERGY] < containers[i].store[RESOURCE_ENERGY]) {
                            container = containers[i];
                            if(container.structureType == STRUCTURE_STORAGE) {
                                break;
                            }
                        } 
                        // 50% of the time just choose the other container...
                        else if (container.store[RESOURCE_ENERGY] == containers[i].store[RESOURCE_ENERGY]) {
                            var random = Math.random();
                            if (random < 0.5) {
                                container = containers[i];
                            }
                        }
                    }
                }
                targetContainer = container;
                // If there is no target container, maybe there is dropped resource
                if (targetContainer == null) {
                    const resourcesFound = creep.room.find(FIND_DROPPED_RESOURCES);
                    var status = creep.pickup(resourcesFound[0]);
                    if (status == ERR_NOT_IN_RANGE) {
                        creep.moveTo(resourcesFound[0], {visualizePathStyle: {stroke: '#ff0000'}});
                    }
                }
                else {
                    creep.memory.targetID = targetContainer.id;
                }
            } 
            else {
                // There may be loose material on the ground at this location check, and grab first
                // This can definitely be done better... but it works
                var targetContainer = Game.getObjectById(creep.memory.targetID);
                var status = -1;
                const resourcesFound = creep.room.find(FIND_DROPPED_RESOURCES);
                const resourceFound = creep.pos.findClosestByPath(resourcesFound);
                if (resourceFound != null) {
                    status = creep.pickup(resourceFound);
                }
                if (status != OK) {
                    status = creep.withdraw(targetContainer, RESOURCE_ENERGY);
                    if (status == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targetContainer, {visualizePathStyle: {stroke: '#ff0000'}});
                    } else {
                        //console.log("Took Resource From Container");
                    }
                } else {
                    //console.log("Picked up dropped resource");
                }
            }
        }
    }
};

module.exports = roleMechanic;