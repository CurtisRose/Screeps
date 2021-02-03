var roleLegion = {
    /** @param {Creep} creep **/
    run: function(creep) {
        // If enemy in current room, attack them
        // Else move to the target room (if provided)
        if (creep.room.name == 'W38N47') {
            var exits = creep.room.find(FIND_EXIT_TOP);
            var exit = creep.pos.findClosestByPath(exits);
            //console.log("Exit: " + exit);
            var value = creep.moveTo(exit, {visualizePathStyle: {stroke: '#ffffff'}});
        }
        else {
            var hostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (hostile != null && hostile.room == creep.room) {
                if(creep.attack(hostile) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(hostile, {visualizePathStyle: {stroke: '#ff0000'}});
                }
            }
            else {
                // This won't work until out of safe mode
                /*var targets = creep.room.find(FIND_HOSTILE_CONSTRUCTION_SITES);
                if (targets != null) {
                    target = creep.pos.findClosestByPath(targets);
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#00ff00'}});
                }*/
            }
        }
    }
};

module.exports = roleLegion;