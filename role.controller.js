var roleController = {
    // Designed to go into a new room and take in under control.
    /** @param {Creep} creep **/
    run: function(creep) {
        // Room: W37N47
        if (creep.room.name == 'W37N47') {
            var exits = creep.room.find(FIND_EXIT_TOP);
            var exit = creep.pos.findClosestByPath(exits);
            //console.log("Exit: " + exit);
            var value = creep.moveTo(exit, {visualizePathStyle: {stroke: '#00ffff'}});
        }
        else if (creep.room.name == 'W37N48') {
            //console.log("Trying to claim new room: " + creep.room.name);
            var status = creep.claimController(creep.room.controller);
            //console.log("Claim Controller Status: " + status);
            if(status == ERR_NOT_IN_RANGE) {
                status = creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#00ffff'}});
                //console.log("Move Status: " + status);
            }
        }
    }
};

module.exports = roleController;