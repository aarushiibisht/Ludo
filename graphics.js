var player_color_map = new Map();
player_color_map.set(0, "red");
player_color_map.set(1, "green");
player_color_map.set(2, "blue");
player_color_map.set(3, "yellow");

var player_to_home_loc = new Map();
var home0 = new Array(new Array(94, 94), new Array(188, 94),  new Array(94, 188), new Array(188, 188));
var home1 = new Array(new Array(517, 94), new Array(611, 94), new Array(517, 188), new Array(611, 188));
var home2 = new Array(new Array(94, 517), new Array(188, 517), new Array(94, 611), new Array(188, 611));
var home3 = new Array(new Array(517, 517), new Array(611, 517), new Array(517, 611), new Array(611, 611));
player_to_home_loc.set(0, home0);
player_to_home_loc.set(1, home1);
player_to_home_loc.set(2, home2);
player_to_home_loc.set(3, home3);

var displayText = new Map();

displayText.set(0, new Array(141, 141));
displayText.set(1, new Array(564, 141));
displayText.set(2, new Array(141, 564));
displayText.set(3, new Array(564, 564));

function refreshGraphics(context, board){
	drawBoardAndPawns(context, board);
	if(board.showActivePawns){
		_drawActivePawns(context, board);
	}
}

function drawBoardAndPawns(context, board){
	context.clearRect(0, 0, 705, 705);
	_drawBoard(context);
	_drawPawns(context, board.players);
}

function _drawActivePawns(context, board){
	
	let player = board.players[board.currentPlayerId];
	let pawns = player.pawnIdToLocId;
	let activePawns = player.active;
	var activePawnCoordinates = new Array();
	for(var i=0; i < activePawns.length; i++){
		let loc = pawns.get(activePawns[i]);
		let arr = getPawnCoordinates(loc, player.playerId, activePawns[i]);
		activePawnCoordinates.push(arr);
	}
	_updateArcs(context, board, activePawnCoordinates);
}

function _drawArcs(context, x, y, s){
    context.beginPath();
	context.arc(x, y, 30, s * Math.PI, (s + 0.33) * Math.PI);
	context.stroke();
}

function _updateArcs(context, board, active, s=0){

	setTimeout(function() {
		if(board.showActivePawns == false) {
			drawBoardAndPawns(context, board);
			return;
		}
		drawBoardAndPawns(context, board);
		for(var i=0; i < active.length; i++){
			context.strokeStyle = player_color_map.get(board.currentPlayerId);
			context.lineWidth = 3;
			_drawArcs(context, active[i][0], active[i][1], s+0);
			_drawArcs(context, active[i][0], active[i][1], s+0.66);
			_drawArcs(context, active[i][0], active[i][1], s+1.33);
			context.lineWidth = 1;
		}	
		_updateArcs(context, board, active, (s+0.005));
	}, 40);

}

function drawDice(context, board) {
    var d = document.getElementById(board.currentPlayerId.toString()+board.currentDiceNumber.toString());
    context.drawImage(d, 0, 0, width = 100, height = 100);
}

function getPawnCoordinates(loc, current_player, pawnId){
	if(loc < 0){
		return player_to_home_loc.get(current_player)[pawnId];
	}else{
		return _getPixelForLocation(loc);
	}
}

function distance(x1, y1, x2, y2){
    return Math.sqrt((x1-x2)**2 + (y1-y2)**2);
}

function _drawPawns(context, players){
	for(var i=0; i< players.length; i++){
		let player = players[i];
		let pawns = player.pawnIdToLocId;
		for(let [pid, loc] of pawns){
			if(loc < 0){
				_drawPawn(player_to_home_loc.get(i)[pid][0], player_to_home_loc.get(i)[pid][1], player_color_map.get(i));
			}else{
				let [x, y] = _getPixelForLocation(loc);
				_drawPawn(x, y, player_color_map.get(i));
			}
		}
	}
}

function _getPixelForLocation(locId){
	var x = (locId%15)*47+23.5;
    var y =  Math.floor((locId/15))*47+23.5;
    return new Array(x, y);
}

function _drawPawn(x, y, color){

	context.strokeStyle = "black";
	context.fillStyle = color;
	context.beginPath();
	context.arc(x, y, 15, 0, 2 * Math.PI);
	context.fill();
	context.stroke();

}

function drawWinner(context, board){
	context.font = "30px Arial";
	context.fillStyle = "black";
	context.fillText("Winner", displayText.get(board.currentPlayerId)[0], displayText.get(board.currentPlayerId)[1]);
}
function _drawBoard(context){
///////////////////////////////////////////////
            // Box width
    var bw = 705;
    // Box height
    var bh = 705;
    // Padding
    var p = 0;
    
/////////////////////////////////////////

    for (var x = 0; x <= bw; x += 47) {
        context.moveTo(0.5 + x + p, p);
        context.lineTo(0.5 + x + p, bh + p);
    }

    for (var x = 0; x <= bh; x += 47) {
        context.moveTo(p, 0.5 + x + p);
        context.lineTo(bw + p, 0.5 + x + p);
    }
    //base grid
    context.strokeStyle = "black";
    context.stroke(); 

    context.fillStyle = 'red';
    context.fillRect(0, 0, 282, 282);
    context.fillStyle = 'white';
    context.fillRect(47, 47, 188, 188);

    context.fillStyle = "red"
    context.beginPath();
	context.arc(94, 94, 23.5, 0, 2 * Math.PI);
	context.fill();
	context.beginPath();
	context.arc(188, 94, 23.5, 0, 2 * Math.PI);
	context.fill();
	context.beginPath();
	context.arc(94, 188, 23.5, 0, 2 * Math.PI);
	context.fill();
	context.beginPath();
	context.arc(188, 188, 23.5, 0, 2 * Math.PI);
	context.fill();

	context.beginPath();
    context.moveTo(282, 282);
    context.lineTo(352.5, 352.5);
    context.lineTo(282, 423);
    context.stroke();
    context.fill();

    context.fillRect(47, 282, 47, 47);
    context.fill();
    context.strokeRect(47, 282, 47, 47);
    context.stroke();

	context.fillRect(47, 329, 47, 47);
    context.fill();
    context.strokeRect(47, 329, 47, 47);
    context.stroke();

    context.fillRect(94, 329, 47, 47);
    context.fill();
    context.strokeRect(94, 329, 47, 47);
    context.stroke();

    context.fillRect(141, 329, 47, 47);
    context.fill();
    context.strokeRect(141, 329, 47, 47);
    context.stroke();

    context.fillRect(188, 329, 47, 47);
    context.fill();
    context.strokeRect(188, 329, 47, 47);
    context.stroke();

    context.fillRect(235, 329, 47, 47);
    context.fill();
    context.strokeRect(235, 329, 47, 47);
    context.stroke();


///////////////////////////////////////////////
    context.fillStyle = 'blue';
    context.fillRect(0, 423, 282, 282);
    context.fillStyle = 'white';
	context.fillRect(47, 470, 188, 188);

	context.fillStyle = "blue"
    context.beginPath();
	context.arc(94, 517, 23.5, 0, 2 * Math.PI);
	context.fill();
	context.beginPath();
	context.arc(188, 517, 23.5, 0, 2 * Math.PI);
	context.fill();
	context.beginPath();
	context.arc(94, 611, 23.5, 0, 2 * Math.PI);
	context.fill();
	context.beginPath();
	context.arc(188, 611, 23.5, 0, 2 * Math.PI);
	context.fill();

	context.beginPath();
    context.moveTo(282, 423);
    context.lineTo(352.5, 352.5);
    context.lineTo(423, 423);
    context.stroke();
    context.fill();

    context.fillRect(329, 423, 47, 47);
    context.fill();
    context.strokeRect(329, 423, 47, 47);
    context.stroke();

    context.fillRect(329, 470, 47, 47);
    context.fill();
    context.strokeRect(329, 470, 47, 47);
    context.stroke();

    context.fillRect(329, 517, 47, 47);
    context.fill();
    context.strokeRect(329, 517, 47, 47);
    context.stroke();

    context.fillRect(329, 564, 47, 47);
    context.fill();
    context.strokeRect(329, 564, 47, 47);
    context.stroke();

    context.fillRect(329, 611, 47, 47);
    context.fill();
    context.strokeRect(329, 611, 47, 47);
    context.stroke();

    context.fillRect(282, 611, 47, 47);
    context.fill();
    context.strokeRect(282, 611, 47, 47);
    context.stroke();
//////////////////////////////////////////////
    context.fillStyle = 'green';
    context.fillRect(423, 0, 282, 282);
    context.fillStyle = 'white';
    context.fillRect(470, 47, 188, 188);

    context.fillStyle = "green"
    context.beginPath();
	context.arc(517, 94, 23.5, 0, 2 * Math.PI);
	context.fill();
	context.beginPath();
	context.arc(611, 94, 23.5, 0, 2 * Math.PI);
	context.fill();
	context.beginPath();
	context.arc(517, 188, 23.5, 0, 2 * Math.PI);
	context.fill();
	context.beginPath();
	context.arc(611, 188, 23.5, 0, 2 * Math.PI);
	context.fill();

	context.beginPath();
    context.moveTo(282, 282);
    context.lineTo(352.5, 352.5);
    context.lineTo(423, 282);
    context.stroke();
    context.fill();

    context.fillRect(329, 47, 47, 47);
    context.fill();
    context.strokeRect(329, 47, 47, 47);
    context.stroke();

    context.fillRect(329, 94, 47, 47);
    context.fill();
    context.strokeRect(329, 94, 47, 47);
    context.stroke();

    context.fillRect(329, 141, 47, 47);
    context.fill();
    context.strokeRect(329, 141, 47, 47);
    context.stroke();

    context.fillRect(329, 188, 47, 47);
    context.fill();
    context.strokeRect(329, 188, 47, 47);
    context.stroke();

    context.fillRect(329, 235, 47, 47);
    context.fill();
    context.strokeRect(329, 235, 47, 47);
    context.stroke();

    context.fillRect(376, 47, 47, 47);
    context.fill();
    context.strokeRect(376, 47, 47, 47);
    context.stroke();
//////////////////////////////////////////////
    context.fillStyle = 'yellow';
    context.fillRect(423, 423, 282, 282);
    context.fillStyle = 'white';
    context.fillRect(470, 470, 188, 188);

    context.fillStyle = "yellow"
    context.beginPath();
	context.arc(517, 517, 23.5, 0, 2 * Math.PI);
	context.fill();
	context.beginPath();
	context.arc(611, 517, 23.5, 0, 2 * Math.PI);
	context.fill();
	context.beginPath();
	context.arc(517, 611, 23.5, 0, 2 * Math.PI);
	context.fill();
	context.beginPath();
	context.arc(611, 611, 23.5, 0, 2 * Math.PI);
	context.fill();

	context.beginPath();
    context.moveTo(423, 423);
    context.lineTo(352.5, 352.5);
    context.lineTo(423, 282);
    context.stroke();
    context.fill();

    context.fillRect(423, 329, 47, 47);
    context.fill();
    context.strokeRect(423, 329, 47, 47);
    context.stroke();

    context.fillRect(470, 329, 47, 47);
    context.fill();
    context.strokeRect(470, 329, 47, 47);
    context.stroke();

    context.fillRect(517, 329, 47, 47);
    context.fill();
    context.strokeRect(517, 329, 47, 47);
    context.stroke();

    context.fillRect(564, 329, 47, 47);
    context.fill();
    context.strokeRect(564, 329, 47, 47);
    context.stroke();

    context.fillRect(611, 329, 47, 47);
    context.fill();
    context.strokeRect(611, 329, 47, 47);
    context.stroke();

    context.fillRect(611, 376, 47, 47);
    context.fill();
    context.strokeRect(611, 376, 47, 47);
    context.stroke();

	context.font = "30px Arial";
	context.fillStyle = "black";
    context.fillText("\u2606", 105, 410);
    context.fillText("\u2606", 290, 125);
    context.fillText("\u2606", 575, 315);
    context.fillText("\u2606", 385, 597);

}