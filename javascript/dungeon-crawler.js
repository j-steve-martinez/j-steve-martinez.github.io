(function() {
    /*
    Objective: Build a CodePen.io app that is functionally similar to this: https://codepen.io/FreeCodeCamp/full/PNJRyd/.
    User Story: I have health, a level, and a weapon. I can pick up a better weapon. I can pick up health items.
    User Story: All the items and enemies on the map are arranged at random.
    User Story: I can move throughout a map, discovering items.
    User Story: I can move anywhere within the map's boundaries, but I can't move through an enemy until I've beaten it.
    User Story: Much of the map is hidden. When I take a step, all spaces that are within a certain number of spaces from me are revealed.
    User Story: When I beat an enemy, the enemy goes away and I get XP, which eventually increases my level.
    User Story: When I fight an enemy, we take turns damaging each other until one of us loses. I do damage based off of my level and my weapon. The enemy does damage based off of its level. Damage is somewhat random within a range.
    User Story: When I find and beat the boss, I win.
    User Story: The game should be challenging, but theoretically winnable.
    */
    'use strict';
    
    // object to keep tract of type of cells
    var Type = {
        'a': 'player',
        'b': 'empty',
        'ch': 'h-wall',
        'cv': 'v-wall',
        'd': 'door',
        'f': 'floor',
        'h': 'heal',
        'm': 'monster',
        'p': 'portal',
        'w': 'weapon',
    };
    
    var weapons = [
      ['Knife' , 10],
      ['Club'  , 20],
      ['Sword' , 30],
      ['Spear' , 40],
      ['Axe'   , 50]
    ];
    
    var monsters = [
      ['Rat'    ,5 , 25],
      ['Goblin' ,10, 50],
      ['Orc'    ,15, 75],
      ['Ogar'   ,20, 100],
      ['Cyclops',150, 1000]
    ];
    
    // create a random number in range of min to max
    function random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    // provite a random elements from an array
    function randomList(len, type){
      if (len <= 0){
        return false;
      }
      var half = 0;
      if (type === 'monster') {
        half = len;
      } else if (type == 'heal') {
        half = Math.round(len/2);
      }
    
      var listOfNumbers = [];
      var results = [];
      // fill the array from 0 to len
      for(var i=0;i<len;i++){
        listOfNumbers.push(i);
      }
    
      var count = 0;
      while (true){
        var randomNum = random(0, listOfNumbers.length);
        var result = listOfNumbers.splice(randomNum, 1);
        // console.log(result.toString());
        if (result.toString() !== "") {
          // console.log('adding to results');
          results.push(result.toString());
        }
    
        if(count === half){
          break;
        }
        count++
      }
      // console.log(results);
      return results;
    }
    
    // constructor for cell obj
    var Cell = function(type, x, y, id, index) {
        this.type = type;
        this.xloc = x;
        this.yloc = y;
        this.roomID = id;
        this.index = index;
    }
    
    // constructor for grid obj
    var Grid = function(size, level) {
        // fill the level map with empty objects array
        var myGrid = [],
            i, j, myCell, count = 10;
        for (i = 0; i < size; i++) {
            myGrid[i] = [];
            for (j = 0; j < size; j++) {
                count++;
                myCell = new Cell(Type.b, j, i, null, count);
                myGrid[i][j] = myCell;
            }
        }
        return myGrid;
    }
    
    // constructor for room obj
    var Room = function(id) {
        this.id = id;
        this.width = Math.round(random(8, 15));
        this.height = Math.round(random(8, 15));
        this.x = 0;
        this.y = 0;
        this.isPlaced = false;
        this.hasMonster = false;
        this.hasWeapon = false;
        this.adjacentRooms = 0;
        this.door = {
            x: 0,
            y: 0
        };
        this._top = false;
        this._right = false;
        this._bottom = false;
        this._left = false;
        this.walls = [];
        this.floors = [];
        this.add = function() {
            if (this.adjacentRooms < 5) {
                // console.log('adding to adjacent room count...');
                this.adjacentRooms++;
            }
        }
    }
    
    // constructor for level obj
    var Level = function(size, level) {
        this.size = size;
        this.grid = new Grid(size, level);
        this.rooms = [];
        this.level = level;
        this.center = size / 2;
        this.playerLoc = [];
        this.currentLoc = '';
        this.startRoom = null;
        this.heal = 10 * level;
        this.weaponType = weapons[level - 1];
        this.monsterType = monsters[level - 1];
        if (level === 4) {
          this.boss = monsters[level];
        }
        // This sets only 1 room for the boss fight
        var roomCount = 0;
        if (this.level === 5) {
          roomCount = 1;
        } else {
          roomCount = (5 + this.level);
        }
        var x, myRooms = [];
        for (x = 0; x < roomCount; x++) {
            myRooms.push(new Room(x));
        }
        this.rooms = myRooms;
        this.lastIndex = this.grid[size - 1][size - 1].index;
        this.getNextIndex = function(){
          this.lastIndex++;
          return this.lastIndex;
        }
    }
    
    var Player = function(){
      // this.health = 300;
      // this.level = 7;
      this.health = 100;
      this.level = 1;
      this.weapon = ["Fist", 5];
      this.xp = 0;
      this.heal = function(amount){
        this.health += amount;
      }
      this.damage = function(amount){
        this.health -= amount;
      }
      this.setXP = function(amount){
        this.xp += amount;
        if (this.xp >= 100) {
          this.xp -= 100;
          this.level++;
        }
      }
    }
    
    var Message = function(){
      this.text = 'Go Fight!';
      this.hitMonster = function(monster, damage){
        this.text = 'You hit a ' + monster + ' for ' + damage + ' damage!';
      }
      this.hitPlayer = function(monster, damage){
        this.text = 'A ' + monster + ' hits you for ' + damage + ' damage!';
      }
      this.heal = function(amount){
        this.text = 'You get ' + amount + ' more health!';
      }
      this.weapon = function(weapon){
        this.text = 'You find a ' + weapon[0] + ' that does ' + weapon[1] + ' damage!'
      }
      this.portal = function(level){
        this.text = 'You magically port to level ' + level + '!';
      }
    }
    
    // start jsx code
    function init() {
        // console.log(document.body);
        // prevent the mouse from doing anything.
        // lol
        document.body.onmousedown = function(e){
          e.preventDefault();
        };
    }
    
    window.onload = init;
    
    // create some global objects
    var map = {};
    var player = {};
    
    // check room for an available Wall
    function check(room, door, wall){
      var cellCount = 0;
      var x = room.x;
      var y = room.y;
      var dx = door.x;
      var dy = door.y;
      var isDoorOk = true;
      var isWallGood = true;
      var floorLoc = fillRoom(room, 'check');
      // console.log('x' + x);
      // console.log('y' + y);
      // console.log('room:');
      // console.log(room);
      // console.log('room.height ' + room.height);
      // console.log('room.width  ' + room.width);
      // console.log('door.y      ' + door.y);
      // console.log('door.x      ' + door.x);
      // console.log('target wall ' + wall);
    
      // check where a door is being placed
      // this checks if a wall is blocking a door
      // hopefully :/
      switch (wall) {
        case '_top':
          dy--;
          if (map.grid[dy][dx].type === 'wall') {
            isDoorOk = false;
          }
       // console.log(map.grid[dy][dx].type);
          break;
        case '_bottom':
          dy++;
          if (map.grid[dy][dx].type === 'wall') {
            isDoorOk = false;
          }
       // console.log(map.grid[dy][dx].type);
          break;
        case '_left':
          dx--;
          if (map.grid[dy][dx].type === 'wall') {
            isDoorOk = false;
          }
       // console.log(map.grid[dy][dx].type);
          break;
        case '_right':
          dx++;
          if (map.grid[dy][dx].type === 'wall') {
            isDoorOk = false;
          }
       // console.log(map.grid[dy][dx].type);
          break;
      }
      // check to see if the door will be placed on a floor
      // it should only be placed in a wall
      var myDoor = dx + '-' + dy;
      if (floorLoc.indexOf(myDoor) === -1) {
        isDoorOk = false;
      }
      // x = room.x;
      // y = room.y;
      // room.isPlaced = true;
      var wallTotal = ((room.height - 2) * 2) + ((room.width) * 2);
      // console.log('wall total: ' + wallTotal);
      var xStop = x + room.width;
      var yStop = y + room.height;
      // console.log('xStop: ' + xStop);
      // console.log('yStop: ' + yStop);
      // console.log(map);
      // start is x,y coordinates
      var j, i, count = 0, top = 0, bottom = 0, left = 0, right = 0;
      for (i = y; i < yStop; i++) {
        // cellCount++;
        // console.log('y: ' + i);
        // console.log(count);
        for (j = x; j < xStop; j++) {
          // console.log('x' + map.grid[i][j].xloc + 'y' + map.grid[i][j].yloc);
          // console.log('i' + i);
          // console.log('j' + j);
            // debug
            if (map.grid[i][j] === undefined) {
           // console.log('j: ' + j);
           // console.log('i: ' + i);
              continue;
            }
            if (map.grid[i][j].type === 'door') {
              isWallGood = false;
           // console.log('hit a door');
            }
            if (map.grid[i][j].type === 'empty'){
    
              // console.log('EMPTY');
              if (i === y) {
                  // top wall
                  cellCount++;
                  top++;
                  // console.log('top');
                  // console.log('x' + map.grid[i][j].xloc + 'y' + map.grid[i][j].yloc);
              }
              if (i === yStop - 1) {
                  // bottom wall
                  cellCount++;
                  bottom++;
                  // console.log('bottom');
                  // console.log('x' + map.grid[i][j].xloc + 'y' + map.grid[i][j].yloc);
              }
              if (j === x && i > y && i < yStop - 1) {
                  // left wall
                  cellCount++;
                  left++;
                  // console.log('left');
                  // console.log('x' + map.grid[i][j].xloc + 'y' + map.grid[i][j].yloc);
              }
              if (j === xStop - 1 && i > y && i < yStop - 1) {
                  // right wall
                  cellCount++;
                  right++;
                  // console.log('right');
                  // console.log('x' + map.grid[i][j].xloc + 'y' + map.grid[i][j].yloc);
              }
            }
        }
        // count++;
        // console.log('count' + count);
      }
      // console.log('top    ' + top);
      // console.log('bottom ' + bottom);
      // console.log('left   ' + left);
      // console.log('right  ' + right);
      // console.log('total placed ' + (top + bottom + left + right));
      // console.log('isDoorOk ' + isDoorOk);
      // console.log('isWallGood ' + isWallGood);
      var total = (cellCount/wallTotal);
      // console.log('% of room placed ' + total);
    
      if (total < 0.6){
        return false;
      } else {
        return true;
      }
    }
    
    function placeRooms(room) {
      var x, y, i, j, xStop, yStop, count = 0, tabIndex,
          door = {
              x: 0,
              y: 0
          },
          startRoom, rx, ry, walls, rWall, wall,
          pCount = 0, xEnd, yEnd, backup;
    
    
        // console.log('placing room in map: ');
            // console.log(room);
        // calculate where to start placing a room
        // first room at center of grid
        // then pick a random room to place all remaining rooms
        while(true){
          if (room.id === 0) {
              // start room in center
              // console.log('center ' + center);
              x = Math.round(map.center - (room.height / 2));
              y = Math.round(map.center - (room.width / 2));
          } else {
              // select a random room to put
              // the new room next to
              // console.log('id: ' + room.id);
              if (room.id === 1) {
                  // startRoom has to be 0
                  startRoom = map.rooms[0];
                  // else choose between 0 and highest room not placed
              } else {
                // NOTE: add loop to check if room has 4 wall with rooms
                    // if it does get another room
    
                  var wCount = 0;
                  while(true){
                    startRoom = map.rooms[random(0, room.id - 1)];
                    if (startRoom.adjacentRooms === 4){
                      // console.log('has 4 rooms attached: continue');
                      continue;
                    } else {
                      // console.log('breaking out of room check: less than 4: ' + wCount + ' id: ' + startRoom.id);
                      break;
                    }
                    wCount++;
                    if (wCount === 25){
                   // console.log('random room emergency break out at 25');
                      break;
                    }
                  }
              }
    
              // do calc for remaining rooms
              // console.log('random room:');
              // console.log(startRoom.id);
              // up the count of rooms next to current room
              startRoom.add();
              room.add();
              walls = ['_top', '_right', '_bottom', '_left', ];
              // var availableWalls = [];
              // check to see if any walls have a room
              if(startRoom.adjacentRooms > 0){
                walls = walls.filter(function(item){
                  var test = startRoom[item];
                  // console.log(startRoom[item]);
                  if(test === false){
                    return true;
                  }
                });
              }
              // console.log('availableWalls');
              // console.log(walls);
    
              rWall = random(1, walls.length) - 1;
              wall = walls[rWall];
              // tmp
              // wall = '_bottom'; // tmp test
              // tmp
              // console.log('rWall ' + rWall);
              // ---------tmp-----------
              // console.log('wall ' + wall);
           // console.log('room ' + room.id + ' being placed on ' + wall + ' of room ' + startRoom.id);
              // console.log('start room wall ' + wall + ' is ' + startRoom[wall]);
              // ---------end tmp-----------
              rx = random(startRoom.x + 2, startRoom.x + startRoom.width - 2);
              ry = random(startRoom.y + 2, startRoom.y + startRoom.height - 2);
              // console.log(startRoom);
              // console.log('rx ' + rx + ' ry ' + ry);
              // console.log('start     x ' + (startRoom.x + 1));
              // console.log('start x end ' + (startRoom.x + startRoom.width - 1));
              // console.log('start     y ' + (startRoom.y + 1));
              // console.log('start y end ' + (startRoom.y + startRoom.height - 1));
              var newCenter = {
                  x: 0,
                  y: 0
              };
              // this willl do the following:
              // set the location of the door
              //    (door.x and door.y)
              // set the center for the new room being placed
              //    (newCenter.x and newCenter.y)
              // update the room wall property
              // to help keep track of rooms placed
              // against a wall
              //    (startRoom.top...)
              switch (wall) {
                case '_top':
                    // top
                    door.x = rx;
                    door.y = startRoom.y;
                    newCenter.x = door.x;
                    newCenter.y = (door.y - room.height / 2) + 1;
                    // startRoom._top = true;
                    // room._bottom = true;
                    break;
                case '_right':
                    // right
                    door.x = (startRoom.x + startRoom.width) - 1;
                    door.y = ry;
                    newCenter.x = (door.x + room.width / 2);
                    newCenter.y = door.y;
                    // startRoom._right = true;
                    // room._left = true;
                    break;
                case '_bottom':
                    // bottom
                    door.x = rx;
                    door.y = (startRoom.y + startRoom.height) - 1;
                    newCenter.x = door.x;
                    newCenter.y = (door.y + room.height / 2);
                    // startRoom._bottom = true;
                    // room._top = true;
                    break;
                case '_left':
                    // left
                    door.x = startRoom.x;
                    door.y = ry;
                    newCenter.x = (door.x - room.width / 2) + 1;
                    newCenter.y = door.y;
                    // startRoom._left = true;
                    // room._right = true;
                    break;
              }
    
              // find random
              // console.log('newCenter');
              // console.log(newCenter);
              x = Math.round(newCenter.x - (room.width / 2));
              y = Math.round(newCenter.y - (room.height / 2));
          }
          // console.log('start x:' + x + ' y:' + y);
          // console.log('width: ' + room.width);
          // console.log('height: ' + room.height);
          // NOTE: check to see if room width or height will exceed room size
          //        if so continue and select another room to place current room
          // console.log('end x: ' + (x + room.width));
          // console.log('end y: ' + (y + room.height));
          // console.log('map size: ' + map.size);
          xEnd = x + room.width - 1;
          yEnd = y + room.height - 1;
          if(xEnd > map.size - 1 || x < 0){
         // console.log('x continue');
            continue;
          } else if(yEnd > map.size - 1 || y < 0){
         // console.log('y continue');
            continue;
          }
    
          room.x = x;
          room.y = y;
          // console.log(check(room, door, wall));
          if (check(room, door, wall) === false) {
            continue;
          }
          // x = room.x;
          // y = room.y;
          // fillRoom(room);
          room.isPlaced = true;
          xStop = x + room.width;
          yStop = y + room.height;
          // console.log('xStop: ' + xStop);
          // console.log('yStop: ' + yStop);
          // console.log(map);
          // start is x,y coordinates
          var roomCoords = [];
          for (i = y; i < yStop; i++) {
              // console.log('i: ' + i);
              // console.log(count);
              for (j = x; j < xStop; j++) {
                  // debug
                  if (map.grid[i][j] === undefined) {
                 // console.log('j: ' + j);
                 // console.log('i: ' + i);
                  }
    
                  if(map.grid[i][j].type === 'empty'){
                    if (i === y) {
                        // console.log('top');
                        // console.log('x' + map.grid[i][j].xloc + 'y' + map.grid[i][j].yloc);
                        map.grid[i][j] = new Cell(Type.ch, j, i, room.id);
                        roomCoords.push(map.grid[i][j].xloc + '-' + map.grid[i][j].yloc);
                    }
                    if (i === yStop - 1) {
                        // console.log('bottom');
                        // console.log('x' + map.grid[i][j].xloc + 'y' + map.grid[i][j].yloc);
                        map.grid[i][j] = new Cell(Type.ch, j, i, room.id);
                        roomCoords.push(map.grid[i][j].xloc + '-' + map.grid[i][j].yloc);
                    }
                    if (j === x && i > y && i < yStop - 1) {
                        // console.log('left');
                        // console.log('x' + map.grid[i][j].xloc + 'y' + map.grid[i][j].yloc);
                        map.grid[i][j] = new Cell(Type.cv, j, i, room.id);
                        roomCoords.push(map.grid[i][j].xloc + '-' + map.grid[i][j].yloc);
                    }
                    if (j === xStop - 1 && i > y && i < yStop - 1) {
                        // console.log('right');
                        // console.log('x' + map.grid[i][j].xloc + 'y' + map.grid[i][j].yloc);
                        map.grid[i][j] = new Cell(Type.cv, j, i, room.id);
                        roomCoords.push(map.grid[i][j].xloc + '-' + map.grid[i][j].yloc);
                    }
                  }
              }
              // count++;
          }
          room.walls = roomCoords;
          // console.log(room);
    
          // place the door
          if(room.id > 0){
            // console.log('door ');
            // console.log(door);
            startRoom.door = door;
            // console.log(map.grid[door.y][door.x].type);
            var nextId = map.getNextIndex();
            var myType = map.grid[door.y][door.x].type;
            map.grid[door.y][door.x] = new Cell(Type.d, door.x, door.y, startRoom.id, nextId);
            // check to see if the door is being placed in a wall
            // if (myType === 'floor') {
            //   console.log(map.grid[door.y][door.x]);
            //   console.log(room);
            //   removeRoom(room.walls, room.floors, door);
            //   var currentId = room.id;
            //   map.rooms[currentId] = new Room(currentId);
            //   continue;
            // };
          }
    
          // update the used walls
          switch (wall) {
              case '_top':
                  startRoom._top = true;
                  room._bottom = true;
                  break;
              case '_right':
                  startRoom._right = true;
                  room._left = true;
                  break;
              case '_bottom':
                  startRoom._bottom = true;
                  room._top = true;
                  break;
              case '_left':
                  startRoom._left = true;
                  room._right = true;
                  break;
          }
    
    
       // console.log('---------------------------------------');
    
          break;
          // pCount++;
          // if(pCount === 25){
          //   console.log('place emergency break out at 25');
          //   break;
          // };
        }
        return wall;
    }
    
    function fillRoom(room, type){
      var startX, startY, endX, endY, x, y, floor = [];
      // console.log('room: ');
      // console.log(room);
      startX = room.x + 1;
      startY = room.y + 1;
      endX = startX + room.width - 1;
      endY = startY + room.height - 1;
      for(y=startY;y<endY;y++){
        for(x=startX;x<endX;x++){
          if(map.grid[y][x].type === 'empty'){
            if (type === 'check') {
              floor.push(map.grid[y][x].xloc + '-' + map.grid[y][x].yloc);
            } else {
              map.grid[y][x] = new Cell(Type.f, x, y, room.id, map.getNextIndex());
              // floor.push('x' + map.grid[y][x].xloc + 'y' + map.grid[y][x].yloc);
              floor.push(map.grid[y][x].xloc + '-' + map.grid[y][x].yloc);
            }
          }
        }
      }
      if (type === 'check') {
        return floor;
      } else {
        room.floors = floor;
      }
    }
    
    function initPlayer(type){
    
      // get a random room
      var startPlayerRoom = random(0, (map.rooms.length - 1));
      var startPlayerCell = '';
      // console.log('startPlayerRoom: ' + startPlayerRoom);
      var count = 0;
      while (true) {
        // try to place the player if not a monster or heal spot
        // console.log('testing loop...');
        // merge the monsters and heal arrays
        var allTakenCells = map.monsters.concat(map.heals);
        // get random cell location in the room from the floors array
        var startPlayerCellNum = random(0, (map.rooms[startPlayerRoom].floors.length - 1));
        // console.log(startPlayerCellNum);
        startPlayerCell = map.rooms[startPlayerRoom].floors[startPlayerCellNum];
        // console.log('startPlayerCell ' + startPlayerCell);
        var index = allTakenCells.indexOf(startPlayerCell);
        // console.log('index: ' + index);
        if (index === -1) {
          break;
        }
    
        if (count === 15) {
          break;
        }
        count++;
      }
      // split the startPlayerCell xx-yy into an array
      var xyArr = startPlayerCell.split('-');
      // console.log(xyArr);
      // get the cell id and room number
      var startPlayerCellId = map.grid[xyArr[1]][xyArr[0]].index;
      if (type === 'weapon') {
        startPlayerCellId = 2;
        map.weaponLoc = xyArr;
      } else if (type === 'portal') {
        startPlayerCellId = 3;
        map.portal = xyArr;
      } else {
        map.playerLoc = xyArr;
        map.currentLoc = 'x' + xyArr[0] + 'y' + xyArr[1];
        map.startRoom = startPlayerRoom;
      }
      var startPlayerCellRoomId = map.grid[xyArr[1]][xyArr[0]].roomID;
      // create a new cell of type player
      map.grid[xyArr[1]][xyArr[0]] = new Cell(type, xyArr[0], xyArr[1], startPlayerCellRoomId, startPlayerCellId);
      if (true) {
    
      }
    }
    
    function initMonsters(){
      var randomMonsterCount = random(map.rooms.length / 2, (map.rooms.length - 1));
      // console.log('randomMonsterCount ' + randomMonsterCount);
      var currentLevel = map.level;
      var roomsPlaced = map.rooms.length;
      var list = [];
      // console.log('roomsPlaced ' + roomsPlaced);
    //   console.log('monster map level ' + currentLevel);
      // list of random rooms to put a monster
      // if level is 6 it's the boss and set room to zero
      if (currentLevel !== 5) {
        list = randomList(roomsPlaced, Type.m);
      } else {
        list = [0];
      }
      // to hold the location of monsters
      var monstersArray = [];
      // put a monster in a random spot in a room
      list.forEach(function(room, count, array){
        var len = map.rooms[room].floors.length;
        var rand = random(1, len);
        // console.log(map.rooms[room].floors[rand]);
        monstersArray.push(map.rooms[room].floors[rand]);
      });
      // create a map to hold the position as key and a monster location as value
      map.monsterMap = new Map();
      // put the monster location in the map.grid
      monstersArray.forEach(function(startMonsterCell, count, array){
        // TODO: sometime the startMonsterCell is undefined and needs to be checked
        // TODO: make an array checker for undefined to remove the check hack
        if (startMonsterCell !== undefined) {
          map.monsterMap.set(startMonsterCell, monsters[map.level - 1][2]);
          var xyArr = startMonsterCell.split('-');
          // console.log(xyArr);
          // get the cell id and room number
          var startMonsterCellId = map.grid[xyArr[1]][xyArr[0]].index;
          var startMonsterCellRoomId = map.grid[xyArr[1]][xyArr[0]].roomID;
          // map.grid[xyArr[1]][xyArr[0]] = new Cell(Type.m, xyArr[0], xyArr[1], startMonsterCellRoomId, startMonsterCellId);
          map.grid[xyArr[1]][xyArr[0]] = new Cell(Type.m, xyArr[0], xyArr[1], startMonsterCellRoomId, 0);
        }
    
      });
      map.monsters = monstersArray;
    }
    
    function initHeals(){
      var randomHealCount = map.rooms.length;
      // console.log('randomHealCount ' + randomHealCount);
      var currentLevel = map.level;
      var roomsPlaced = map.rooms.length;
      // console.log('roomsPlaced ' + roomsPlaced);
      var list = randomList(roomsPlaced, Type.h);
      // console.log(list);
      // var roomList = getRandomRoomList();
      var heals = [];
      list.forEach(function(room){
        var count = 0;
        while (true) {
          var len = map.rooms[room].floors.length;
          // pick a random tile
          var rand = random(1, len);
          // check to see if a monster is on the tile
          // console.log(map.rooms[room].floors[rand]);
          // get the random cell
          var cell = map.rooms[room].floors[rand];
          // console.log(cell);
          // see if it's a monster cell
          var index = map.monsters.indexOf(cell);
          // console.log(index);
          // if not push and exit the loop
          if (index === -1) {
            heals.push(map.rooms[room].floors[rand]);
            break;
          }
    
          if (count === 5) {
            // in case of emergency break
            // console.log('emergency break');
            break;
          }
          count++;
        }
    
      });
      // console.log(Heals);
      heals.forEach(function(startHealCell, count, array){
        if (startHealCell !== undefined) {
          var xyArr = startHealCell.split('-');
          // console.log(xyArr);
          // get the cell id and room number
          var startHealCellId = map.grid[xyArr[1]][xyArr[0]].index;
          var startHealCellRoomId = map.grid[xyArr[1]][xyArr[0]].roomID;
          // map.grid[xyArr[1]][xyArr[0]] = new Cell(Type.m, xyArr[0], xyArr[1], startHealCellRoomId, startHealCellId);
          map.grid[xyArr[1]][xyArr[0]] = new Cell(Type.h, xyArr[0], xyArr[1], startHealCellRoomId, 1);
        }
    
      });
      map.heals = heals;
    }
    
    function initGame(){
      initMonsters();
      initHeals();
      initPlayer(Type.w);
      initPlayer(Type.a);
      initPlayer(Type.p);
    }
    
    var Game = React.createClass({
        displayName: 'Game',
        getInitialState: function() {
        //   console.log('getInitialState');
          // create a new level
          map = new Level(55, 1);
        //   console.log(map);
    
          for (var i = 0; i < map.rooms.length; i++) {
            placeRooms(map.rooms[i]);
            // console.log('fill the room with floor objects...');
            fillRoom(map.rooms[i]);
          }
          initGame();
          player = new Player();
        //   console.log(player);
          var message = new Message();
          var isShow = false;
          var buttonTxt = 'Show Dungeon';
          var monsterHealth = map.monsterType[2];
          return {
              map: map,
              player: player,
              message: message,
              isShow : false,
              buttonTxt : buttonTxt,
              monsterHealth : monsterHealth
          };
        },
        doMove: function(id, direction) {
          // console.log('cell move:');
          // console.log('id: ' + id);
          // console.log('direction: ' + direction);
          var x, y, yl, newId, loc;
          // x = id.indexOf('x');
          yl = id.indexOf('y');
          x = parseInt(id.slice(1, yl));
          y = parseInt(id.slice(yl + 1));
          // console.log(y);
          // console.log(x);
          switch (direction) {
              case 'ArrowDown':
                  y += 1;
                  break;
              case 'ArrowUp':
                  y -= 1;
                  break;
              case 'ArrowRight':
                  x += 1;
                  break;
              case 'ArrowLeft':
                  x -= 1;
                  break;
          }
          // console.log('x' + x + 'y' + y);
          newId = 'x' + x + 'y' + y;
          map.previousLoc = map.currentLoc;
          map.currentLoc = newId;
          loc = x + '-' + y;
          // console.log(document.getElementById(newId).tabIndex);
          if (document.getElementById(newId).tabIndex === 0) {
            this.fightMonster(loc);
          } else if (document.getElementById(newId).tabIndex === 1) {
            this.heal(loc);
          }else if (document.getElementById(newId).tabIndex === 2) {
            this.getWeapon(loc);
          } else if (document.getElementById(newId).tabIndex === 3) {
            this.portal(loc);
          } else {
            document.getElementById(newId).focus();
          }
          if (this.state.isShow === false) {
            this.setState({map : map});
          }
    
        },
        heal : function(loc){
          // console.log('heal found at: ' + loc);
          var xyArr = loc.split('-');
          var message = new Message();
          // console.log(xyArr);
          var roomId = map.grid[xyArr[1]][xyArr[0]].roomID;
          map.grid[xyArr[1]][xyArr[0]] = new Cell(Type.f, xyArr[0], xyArr[1], roomId, map.getNextIndex());
          // console.log('healing player ' + map.heal);
          player.heal(map.heal);
          message.heal(map.heal);
          this.setState({
            map : map, player : player, message : message
          });
        },
        fightMonster : function(startMonsterCell){
          // console.log('Fight the Monster at: ' + startMonsterCell);
    
          var isMonsterDead = false;
          var isPlayerDead = false;
          var damage = 0;
          var message = new Message();
          var monsterHealth = map.monsterMap.get(startMonsterCell);
    
          // the monster level is the map level
          // roll the dice for player and monster
          var mRoll, pRoll;
          function roll(){
              mRoll = random(1, (10 + map.level));
              pRoll = random((1 + player.level) , (10 + player.level));
          }
          roll();
          // console.log('player rolled ' + pRoll);
          // console.log('monster rolled ' + mRoll);
          function hurtMonster(){
            // monsterHealth = map.monsterMap.get(startMonsterCell);
            damage = Math.round(random(player.weapon[1]/player.level, player.weapon[1] * player.level));
            monsterHealth -= damage;
            map.monsterMap.set(startMonsterCell, monsterHealth);
            message.hitMonster(map.monsterType[0], damage);
            // console.log('monster takes damage ' + damage);
            // console.log(monsterHealth);
    
            if (monsterHealth <= 0) {
              monsterHealth = 0;
              isMonsterDead = true;
            }
    
          }
          function hurtPlayer(){
            // do damage to player
            // var currentMonster = map.monsterMap.get(startMonsterCell);
            damage = Math.round(random(map.monsterType[1]/map.level, map.monsterType[1]));
            player.damage(damage);
            message.hitPlayer(map.monsterType[0], damage);
            // console.log('player takes damage ' + damage);
            if (player.health <= 0) {
              isPlayerDead = true;
            }
          }
          if (pRoll > mRoll) {
            hurtMonster();
            // this.setState({monsterHealth : monsterHealth, message : message});
          }
          if(mRoll > pRoll){
            hurtPlayer();
            // this.setState({player : player, message : message});
          }
          if(mRoll == pRoll){
            hurtPlayer();
            hurtMonster();
            // this.setState({player : player, monsterHealth : monsterHealth, message : message});
          }
          if (isPlayerDead) {
            map = new Level(55, 1);
            for (var i = 0; i < map.rooms.length; i++) {
              placeRooms(map.rooms[i]);
              // console.log('fill the room with floor objects...');
              fillRoom(map.rooms[i]);
            };
            initGame();
            player = new Player();
            // monsterHealth = map.monsterType[2];
            message.text = "You Died!";
            // this.setState({map : map, player : player, monsterHealth : monsterHealth, message : message});
          }
          if (isMonsterDead) {
            // if the boss don't reset health
            if (this.state.map.level !== 5) {
              monsterHealth = this.state.map.monsterType[2];
            }
            player.setXP(map.monsterType[2] / map.level);
            var xyArr = startMonsterCell.split('-');
            // console.log('moving to...');
            // get the cell id and room number
            // var startMonsterCellId = map.grid[xyArr[1]][xyArr[0]].index;
            var startMonsterCellRoomId = map.grid[xyArr[1]][xyArr[0]].roomID;
            // map.grid[xyArr[1]][xyArr[0]] = new Cell(Type.m, xyArr[0], xyArr[1], startMonsterCellRoomId, startMonsterCellId);
            map.grid[xyArr[1]][xyArr[0]] = new Cell(Type.f, xyArr[0], xyArr[1], startMonsterCellRoomId, map.getNextIndex());
            if (this.state.map.level == 5) {
              message.text = 'You Killed the Boss - Winner';
            }
            // this.setState({map : map, monsterHealth : monsterHealth, message : message});
          }
          // console.log(message);
          // this.setState({message : message});
          this.setState({map : map, player : player, monsterHealth : monsterHealth, message : message});
        },
        getWeapon : function(loc){
          // console.log('weapon found at: ' + loc);
          var message = new Message();
          var xyArr = loc.split('-');
          // console.log(xyArr);
          var roomId = map.grid[xyArr[1]][xyArr[0]].roomID;
          map.grid[xyArr[1]][xyArr[0]] = new Cell(Type.f, xyArr[0], xyArr[1], roomId, map.getNextIndex());
          player.weapon = map.weaponType;
          message.weapon(map.weaponType);
          this.setState({
            map : map, player : player, message : message
          });
        },
        portal : function(loc){
        //   console.log('portal found at: ' + loc);
          var message = new Message();
          var level = map.level + 1;
    
        //   console.log('new level ' + level);
          map = new Level(55, level);
        //   console.log(map);
          // init the level or start a new game
          if (level !== 6) {
            message.portal(level);
            for (var i = 0; i < map.rooms.length; i++) {
              placeRooms(map.rooms[i]);
              fillRoom(map.rooms[i]);
            }
            initGame();
          } else {
            map = new Level(55, 1);
            message.portal(1);
            for (var j = 0; j < map.rooms.length; j++) {
              placeRooms(map.rooms[j]);
              fillRoom(map.rooms[j]);
            }
            initGame();
            player = new Player();
          }
          var monsterHealth = map.monsterType[2];
          this.setState({
            map : map, player : player, message : message, monsterHealth : monsterHealth
          });
        },
        componentWillMount : function(){
          // console.log('Game componentWillMount');
        },
        componentDidMount : function(){
          // console.log('Game componentDidMount');
          // console.log(document.activeElement);
        },
        componentDidUpdate : function(){
          // console.log('Game componentDidUpdate');
          // console.log(document.activeElement);
          if (document.getElementById(map.currentLoc) !== null) {
            //
            if (document.getElementById(map.currentLoc).tabIndex > 10) {
              document.getElementById(map.currentLoc).focus();
            } else {
              document.getElementById(map.previousLoc).focus();
              map.currentLoc = map.previousLoc;
            }
            // console.log(document.activeElement.tabIndex);
          } else {
            // console.log('must be null id');
          }
        },
        handleClick: function(e) {
          // console.log('handleClick');
          // console.log(e);
          // stop the player from porting on click : set focus
          e.preventDefault();
        },
        show : function(e){
        //   console.log('show map');
          var isShow = this.state.isShow;
          var buttonTxt = this.state.buttonTxt;
          var show = 'Show Dungeon';
          var hide = 'Hide Dungeon';
          var messageTxt = '';
          // toggle the map and messages
          if (isShow === true) {
            isShow = false;
            buttonTxt = hide;
          } else {
            isShow = true;
            buttonTxt = show;
          }
          this.setState({isShow : isShow, buttonTxt : buttonTxt});
        },
        render: function() {
          // console.log('render Game');
          // console.log(this.state.player.health);
          // console.log(this.state.player.level);
          return (
            <div id='grid' onMouseDown = {this.handleClick}>
            <div id='button'><button onClick = {this.show}>{this.state.buttonTxt}</button></div>
              <div className='key-container'>
                <div className='key-heal stats'>Heal</div>
                <div className='key-monster stats'>Monster</div>
                <div className='key-player stats'>Player</div>
                <div className='key-weapon stats'>Weapon</div>
                <div className='key-portal stats'>Portal</div>
              </div>
              <div className='player-container'>
                <div className='stats'>Level: {this.state.player.level}</div>
                <div className='stats'>Weapon: {this.state.player.weapon[0]}</div>
                <div className='stats'>Damage: {this.state.player.weapon[1]}</div>
                <div className='stats'>Experience: {this.state.player.xp}</div>
                <div className='stats'>Health: {this.state.player.health}</div>
              </div>
              <div className='monster-container'>
                <div className='stats'>Dungeon Level: {this.state.map.level}</div>
                <div className='stats'>Monster: {this.state.map.monsterType[0]}</div>
                <div className='stats'>Damage: {this.state.map.monsterType[1]}</div>
                <div className='stats'>Health: {this.state.monsterHealth}</div>
              </div>
              <div className='message-container'>
                <div className='stats message'>{this.state.message.text}</div>
              </div>
              <Table map = {this.state.map} isShow = {this.state.isShow} contentEditable = "true" doMove = {this.doMove}/>
            </div>
          );
        }
    });
    
    var Table = React.createClass({
        displayName: 'Table',
        componentDidMount : function(){
          // console.log('Table componentDidMount');
          var startId = 'x' + this.props.map.playerLoc[0] + 'y' + this.props.map.playerLoc[1];// + 'r' + this.props.map.startRoom;
          // var startId = 'x' + this.props.map.center + 'y' + this.props.map.center;// + 'r' + this.props.map.startRoom;
          // console.log('startId ' + startId);
          // document.getElementById(startId).focus();
          document.getElementById(map.currentLoc).focus();
          // console.log(document.activeElement);
        },
        componentWillMount : function(){
          // console.log('Table componentWillMount');
        },
        componentDidUpdate : function(){
          // console.log('Table componentDidUpdate');
          // if (document.getElementById(map.currentLoc !== null)) {
          //   document.getElementById(map.currentLoc).focus();
          // } else {
          //   console.log('null id');
          // }
        },
        render: function() {
          // console.log('render Table');
          // console.log(this.props);
          var rows = [],
              row, x;
          var cellLen = this.props.map.grid.length;
          for (x = 0; x < cellLen; x++) {
              // console.log(this.props.map.grid[x]);
              row = <TableCol columns = {this.props.map.grid[x]} isShow = {this.props.isShow} currentLoc = {this.props.map.currentLoc} key = {x} doMove = {this.props.doMove}/>;
              rows.push(row);
          }
          // var zero = 0;
          var table = <table><tbody>{rows}</tbody></table>
          return table;
        }
    });
    
    var TableCol = React.createClass({
        displayName: 'TableCol',
        handleMove: function(e) {
          var arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ];
          // console.log('handleMove');
          // console.log(e.key);
          // stop the screen from moving when pressing the arrow keys
          e.preventDefault();
          // window.scrollBy(0,0);
          // call the move function
          if (arrowKeys.indexOf(e.key) !== -1) {
              // console.log(e.target.id);
              this.props.doMove(e.target.id, e.key);
          }
        },
        componentWillMount : function(){
          // console.log('TableCol componentWillMount');
        },
        componentDidMount : function(){
          // console.log('TableCol componentDidMount');
        },
        componentDidUpdate : function(){
          // console.log('TableCol componentDidUpdate');
        },
        render: function() {
          // console.log('render TableCol'); //onKeyDown onKeyPress onKeyUp
          // console.log(this.props);
          var len = this.props.columns.length;
          var cell, cells = [];
          var minX, maxX, minY, maxY, currentLoc, yl, x, y, vision;
          currentLoc = this.props.currentLoc;
          // console.log(currentLoc);
          yl = currentLoc.indexOf('y');
          x = parseInt(currentLoc.slice(1, yl));
          y = parseInt(currentLoc.slice(yl + 1));
          vision = 5;
          minX = x - vision;
          maxX = x + vision;
          minY = y - vision;
          maxY = y + vision;
          for (x = 0; x < len; x++) {
    
            var id = 'x' + this.props.columns[x].xloc + 'x' + this.props.columns[x].yloc + 'r' + this.props.columns[x].roomID;
            var loc = 'x' + this.props.columns[x].xloc + 'y' + this.props.columns[x].yloc;
            var index = this.props.columns[x].index;
            var className = this.props.columns[x].type;
            if (this.props.isShow === false) {
              if (this.props.columns[x].yloc <= minY) {
                className = 'mask';
              }
              if (this.props.columns[x].yloc >= maxY) {
                className = 'mask';
              }
    
              if (this.props.columns[x].xloc <= minX) {
                className = 'mask';
    
              }
              if (this.props.columns[x].xloc >= maxX) {
                className = 'mask';
              }
            }
            cell = <td key = {x} tabIndex = {index} id = {loc} onKeyDown = {this.handleMove} className = {className}><div id = {id} className = 'size'></div></td>;
            cells.push(cell);
    
          }
          var data = <tr>{cells}</tr>
          return data;
        }
    });
    
    ReactDOM.render(React.createElement(Game, null), document.getElementById("dungeon-crawler"));
    
    
    
    })();