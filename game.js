class Player {
	constructor(id){
		this.playerId = id;
		this.pawnIdToLocId = new Map();
		let loc = -1;
		for(var i=0; i< 4; i++){
            this.pawnIdToLocId.set(i,loc);
		}
		this.active = new Array();
	}

	setActivePawns(currentDiceNumber){
		let pawns = this.pawnIdToLocId;
		var path = paths[this.playerId];
		this.active = new Array();
		for(let [pid, loc] of pawns){
			if(loc < 0 && currentDiceNumber == 6){
				this.active.push(pid);
			}
			for(var i=0; i< path.length; i++){
				if(path[i] == loc){
					if(i+currentDiceNumber < path.length){
						this.active.push(pid);
					}
				}
			}
		}
		return this.active;
	}

	updatePawnLocation(pawnId, backward=false){
		let update = 1;
		if(backward){
			update = -1;
		} 
		var pawns = this.pawnIdToLocId;
		var path = paths[this.playerId];
		var currentLoc = pawns.get(pawnId);
		if(currentLoc < 0 && backward == false){
			pawns.set(pawnId, path[0]);
		}else{
			for(var i=0; i< path.length; i++){
				if(path[i] == currentLoc){
					if(i+update < 0){
						pawns.set(pawnId, -1);
						break;
					}else{
						pawns.set(pawnId, path[i + update]);
						break;
					}
				}
			}
		}
	}
}

class Board {

	updateCurrentPlayer(){
		if(this.currentDiceNumber == 6) return;
		this.currentPlayerId = (this.currentPlayerId + 1) % this.numberOfPlayers;
	}

	getRandNumber() {
  		return (Math.floor(Math.random() * (7 - 1)) + 1);
	}
	
	getCheckMatedPawns(pawnId){
		let finalLoc = this.players[this.currentPlayerId].pawnIdToLocId.get(pawnId);
		let checkMated = new Array();
		if(this.isSafeLoc(finalLoc)) return checkMated;
		for(let i=0; i< this.numberOfPlayers; i++){
			if(i != this.currentPlayerId){
				for(let[pid, loc] of this.players[i].pawnIdToLocId){
					if(loc == finalLoc){
						checkMated.push(new Array(pid, i));
					}
				}
			}
		}
		return checkMated;
	}

	isSafeLoc(loc){
		for(let i=0; i< this.safeLocations.length;i++){
			if(this.safeLocations[i] == loc) return true;
		}
		return false;
	}


	movePawn(selectionId, playerId = this.currentPlayerId, katti=false){
		board.showActivePawns = false;
		let refreshCount = this.currentDiceNumber;
		let currentLoc = this.players[playerId].pawnIdToLocId.get(selectionId);
		if(currentLoc < 0){
			refreshCount = 1;
		}
		if(katti){
			for(let i=0; i< paths[playerId].length; i++){
				if(currentLoc == paths[playerId][i]){
					refreshCount = i+1;
				}
			}
		}
		this.refresh(refreshCount, selectionId, playerId, katti);
	}

	reachedGoal(pawnId, playerId){
		let currentLoc = board.players[playerId].pawnIdToLocId.get(pawnId);
		let last = path[0].length-1;
		if(paths[playerId][last] == currentLoc){
			return true;
		}
		return false;
	}

	isGameOver(playerId){
		let pawns = board.players[playerId].pawnIdToLocId;
		let done = true;
		for(let [pid, loc] of pawns){
			done = done & this.reachedGoal(pid, playerId);
		}
		return done;
	}

	refresh(count, selectionId, playerId, katti){
		let speed = 300;
		if(katti){
			speed = 100;
		}
		if(count == 0){
			//if katti or pawn reached the goal then simply return, no need to update the current player
			if(katti || board.reachedGoal(selectionId, playerId)) {
				return;
			}
			//if game is over halt
			if(board.isGameOver(playerId)){
				drawWinner(context, board);
				return;
			}

			// if not reached goal and not check mated change current player and return
			let checkMated  = board.getCheckMatedPawns(selectionId);
			if(checkMated.length == 0) {
				board.updateCurrentPlayer();
				return
			}
			// if check mated pawns, return them to home and then return
			for(let i=0; i< checkMated.length; i++){
				board.movePawn(checkMated[i][0], checkMated[i][1], true);
			}
			return;
		}
		setTimeout(function() {
			board.players[playerId].updatePawnLocation(selectionId, katti);
			refreshGraphics(context, board);
			return board.refresh(count-1, selectionId, playerId, katti);
			}, speed);
	}

	getSelection(x, y){
	    let locationId = null;
	    let pawnId = null;
	    let pawns = this.players[board.currentPlayerId].pawnIdToLocId;
	    for(let [pid, loc] of pawns){
	        let coordinates = getPawnCoordinates(loc, this.currentPlayerId, pid);
	        if(distance(coordinates[0], coordinates[1], x, y) < 15){
	            locationId = loc;
	            pawnId = pid;
	            break;
	        }
	    }
	    return new Array(locationId, pawnId);
	}

	constructor(numberOfPlayers){
		this.currentDiceNumber = this.getRandNumber();
		this.numberOfPlayers = numberOfPlayers;
		this.players = new Array();
		for(var i=0; i<this.numberOfPlayers; i++){
			this.players.push(new Player(i));
		}
		this.currentPlayerId = 0;
		this.showActivePawns = false;
		this.safeLocations = [91, 23, 133, 201, 122, 102, 188, 36];
	}
}


var board = new Board(2);

var dice_canvas = document.getElementById("dice_canvas");
var dice_context = dice_canvas.getContext("2d");
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
canvas.addEventListener("click", canvasClicked);
dice_canvas.addEventListener("click", diceCanvasClicked);

var path1 = [91, 92, 93, 94, 95, 81, 66, 51, 36, 21, 6, 7, 8, 23, 38, 53, 68, 83, 99, 100, 101, 102, 103, 104, 119, 134, 133, 132, 131, 130, 129, 143, 158, 173, 188, 203, 218, 217, 216, 201, 186, 171, 156, 141, 125, 124, 123, 122, 121, 120, 105, 106, 107, 108, 109, 110, 111];
var path2 = [23, 38, 53, 68, 83, 99, 100, 101, 102, 103, 104, 119, 134, 133, 132, 131, 130, 129, 143, 158, 173, 188, 203, 218, 217, 216, 201, 186, 171, 156, 141, 125, 124, 123, 122, 121, 120, 105, 90, 91, 92, 93, 94, 95, 81, 66, 51, 36, 21, 6, 7, 22, 37, 52, 67, 82, 97];
var path3 = [];
var path4 = [];

var paths = [path1, path2, path3, path4];

window.onload = function(){
	refreshGraphics(context, board);
    drawDice(dice_context, board);
}

function canvasClicked(e){
    var x = e.offsetX;
    var y = e.offsetY;
    const [locId, pawnId] = board.getSelection(x, y);
    if(pawnId == null) return;
    board.movePawn(pawnId);
}

function diceCanvasClicked(e){
    board.currentDiceNumber = board.getRandNumber();
    drawDice(dice_context, board);
    var availablePawnsId = board.players[board.currentPlayerId].setActivePawns(board.currentDiceNumber);
    if(availablePawnsId.length == 0) {
    	board.updateCurrentPlayer();
    	return;
    }
    board.showActivePawns = true;
    refreshGraphics(context, board);
}
