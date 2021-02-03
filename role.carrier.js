var roleCarrier = {
    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.transporting && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.targetID = null;
            creep.memory.transporting = false;
            creep.say('🔄 gather');
        }
        if(!creep.memory.transporting && creep.store.getFreeCapacity() == 0) {
            creep.memory.targetID = null;
            creep.memory.transporting = true;
            creep.say('⚡ transporting');
        }
        creep.memory.targetID = null;
        if(creep.memory.transporting) {
            // If target is not cached in memory, find target at cache it
            // else, move to the target and refill it
            var target = Game.getObjectById(creep.memory.targetID);
            if (target == null) {
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                    }
                });
                if (targets != null) {
                    target = creep.pos.findClosestByPath(targets);
                }
                // Fill the extensions and spawn first
                if(target == null) { // Then fill the tower
                    var targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_TOWER) &&
                                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }});
                    if (targets != null && targets.length > 0) {
                        target = creep.pos.findClosestByPath(targets);
                    }
                    // Else fill the storage thing
                    else {
                        var targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_STORAGE) &&
                                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                        }});
                        if (targets != null) {
                            target = creep.pos.findClosestByPath(targets);
                        }
                    }
                }
                if (target != null) {
                    creep.memory.targetID = target.id;
                    var status = creep.transfer(target, RESOURCE_ENERGY);
                    // something went wrong tranferring, null the target ID
                    if (status == ERR_FULL) {
                        creep.memory.targetID = null;
                    }
                    if(status == ERR_NOT_IN_RANGE) {
                        status = creep.moveTo(target, {visualizePathStyle: {stroke: '#ff00ff'}});
                        //console.log(status);
                    }
                }
            } else {
                var status = creep.transfer(target, RESOURCE_ENERGY);
                // If target is full,  set memory target to null
                if (target.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
                    creep.memory.targetID = null;
                }
                else {
                    // If felling, it is full or successfull, set target to null
                    if (status == ERR_FULL||OK) {
                        creep.memory.targetID = null;
                    }
                    if(status == ERR_NOT_IN_RANGE) {
                        status = creep.moveTo(target, {visualizePathStyle: {stroke: '#00ffff'}});
                        //console.log(status);
                    }
                }
            }
        }
        else { // picking up resources
            var targetContainer = Game.getObjectById(creep.memory.targetID);
            if (targetContainer == null) {
                var containers = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER)}});
                // Find fullest container
                var i;
                var container;
                for (i = 0; i < containers.length; i++) {

                    if (container == null) {
                        container = containers[i];
                    } else {
                        if (container.store[RESOURCE_ENERGY] < containers[i].store[RESOURCE_ENERGY]) {
                            container = containers[i];
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
                    var resourceFound;
                    for (i = 0; i < resourcesFound.length; i++) {
                        if (resourceFound == null) {
                            resourceFound = resourcesFound[i];
                        } else {
                            if (resourceFound.amount < resourcesFound[i].amount) {
                                resourceFound = resourcesFound[i];
                            } 
                        }
                    }
                    if (resourceFound != null) {
                        status = creep.pickup(resourceFound, RESOURCE_ENERGY);
                        if (status == ERR_NOT_IN_RANGE) {
                            creep.moveTo(resourceFound, {visualizePathStyle: {stroke: '#ff0000'}});
                        }
                    }
                }
                else {
                    creep.memory.targetID = targetContainer.id;
                    if (status != OK) {
                        status = creep.withdraw(targetContainer, RESOURCE_ENERGY);
                        if (status == ERR_NOT_IN_RANGE) {
                            creep.moveTo(targetContainer, {visualizePathStyle: {stroke: '#ff0000'}});
                        }
                    }
                }
            } 
            else {
                // There may be loose material on the ground at this location check, and grab first
                // This can definitely be done better... but it works
                var targetContainer = Game.getObjectById(creep.memory.targetID);
                var status = -1;
                if (targetContainer.store[RESOURCE_ENERGY].getFreeCapacity > 0) {
                    const resourcesFound = creep.room.find(FIND_DROPPED_RESOURCES);
                    const resourceFound = creep.pos.findClosestByPath(resourcesFound);
                    if (resourceFound != null) {
                        status = creep.pickup(resourceFound);
                    }
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

module.exports = roleCarrier;