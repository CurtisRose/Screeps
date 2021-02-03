var roleStationaryHarvester1 = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var containers = creep.room.find(FIND_STRUCTURES,
                    {filter: {structureType: STRUCTURE_CONTAINER}});
        var sources = creep.room.find(FIND_SOURCES);
        if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
            if (containers[1] != null) {
                creep.moveTo(containers[1], {visualizePathStyle: {stroke: '#ff0000'}});
            } 
            else {
                creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#ff0000'}});
            }
        }
    }
};

module.exports = roleStationaryHarvester1;