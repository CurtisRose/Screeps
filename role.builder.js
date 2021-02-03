var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.targetID = null;
            creep.memory.building = false;
            creep.say('🔄 gather');
        }
        if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.targetID = null;
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        if(creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            var target = creep.pos.findClosestByPath(targets);
            if(target != null) {
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#00ff00'}});
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

module.exports = roleBuilder;