var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.room.name == "W37N47") {
            var exits = creep.room.find(FIND_EXIT_TOP);
            var exit = creep.pos.findClosestByPath(exits);
            var value = creep.moveTo(exit, {visualizePathStyle: {stroke: '#00ffff'}});
        }
        else {
            if(creep.memory.transporting && creep.store[RESOURCE_ENERGY] == 0) {
                creep.memory.transporting = false;
                creep.say('🔄 gather');
            }
            if(!creep.memory.transporting && creep.store.getFreeCapacity() == 0) {
                target = null;
                creep.memory.transporting = true;
                creep.say('⚡ transporting');
            }
            
            if(creep.memory.transporting) {
                var target = creep.room.find(FIND_CONSTRUCTION_SITES);
                if(target != null) {
                    var buildStatus = creep.build(target);
                    if(buildStatus == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                    } else {
                        
                    }
                }
            } else {
                var sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
    }
};

module.exports = roleHarvester;