var roleStationaryHarvester0 = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var containers = creep.room.find(FIND_STRUCTURES,
                    {filter: {structureType: STRUCTURE_CONTAINER}});
        var sources = creep.room.find(FIND_SOURCES);
        if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            if (containers[0] != null) {
                creep.moveTo(containers[0], {visualizePathStyle: {stroke: '#ff0000'}});
            } 
            else {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ff0000'}});
            }
        }
    }
};

module.exports = roleStationaryHarvester0;