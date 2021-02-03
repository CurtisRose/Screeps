//How to build units
//Game.spawns.Spawn1.createCreep( [WORK, CARRY, MOVE], 'Builder1',     { role: 'builder' } );

//How to set role
//Game.creeps.Maya.memory.role = 'upgrader';

//BODYPART_COST: { "move": 50, "carry": 50, "work": 100, "attack": 80, "heal": 250, "ranged_attack": 150, "tough": 10, "claim": 600 }

// TODO
// Figure out a traffic control function...
// Like a function that is attached to a container
// All units trying to use that container add themselves to the queue
// It will prioritize units based on role/need/et cetera
 
// Game.spawns['Spawn2'].spawnCreep([WORK,WORK,MOVE], 'newName', {memory: {role: 'stationaryHarvesterNode0', container: 0}});
// Game.spawns['Spawn2'].spawnCreep([CARRY,MOVE], 'newCarrier', {memory: {role: 'carrier'}});
// Game.spawns['Spawn2'].spawnCreep([WORK, CARRY, CARRY, CARRY,MOVE], 'newUpgrader1', {memory: {role: 'upgrader'}});
// Game.spawns['Spawn2'].spawnCreep([WORK,WORK,CARRY,MOVE], "builder", {memory: {role: 'builder'}});