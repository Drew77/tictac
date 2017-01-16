var user = '';
var cpu = '';
var usersTurn;
var board = [0,1,2,3,4,5,6,7,8];
var spacesLeft = [0,1,2,3,4,5,6,7,8];
var turns = 0;
var winner = undefined;
var winningCom = [[0,1,2], [3,4,5], [6,7,8], // horizontal
				  [0,3,6], [1,4,7], [2,5,8], // vertical
				  [0,4,8], [2,4,6] ]; // horizontal
				  
					   
$(document).ready(function() 
{	
	initGame();
	});


$("#buttons").on("click","button",function(){ // User selecting what they play as
	user = $(this).attr("selection");
	if (user === 'X'){
		cpu = 'O';
	}
	else {
		cpu = 'X'
	}
	$("#choose").css("visibility","hidden");
	$("#board").css("visibility","visible");
	play();
})

$('.again').on('click', function(){
	initGame();
	play();
})

$(".square").on("click", function(){ // User move
	if (usersTurn){ // user takes turn
		var move = $(this).attr("id");	
		if (spacesLeft.indexOf(Number(move)) === -1){ // if square already chosen
			return;
		}
		board[move] = user; 
		spacesLeft.splice(spacesLeft.indexOf(Number(move)),1);
		turns++;
		usersTurn = false;
		displayMove(move,user);
		checkWin(user);
		setTimeout(play, 1000);
		}
	});

//taking a turn

function initGame(){
	whoFirst();
	board = [0,1,2,3,4,5,6,7,8];
	spacesLeft = [0,1,2,3,4,5,6,7,8];
	turns = 0;
	winner = undefined;
	$('.overlay').removeClass('overlay-active');
	$('.result').addClass('hidden');
	$('.square').html("");
	$('.square').removeClass("player");
	$('.square').removeClass("cpu");
}

function whoFirst(){
	usersTurn = Math.random() >= 0.5;
};


function cpuTurn(){ // place in free space, check if won, set to users turn
	var move = cpuMove();
	spacesLeft.splice(spacesLeft.indexOf(move),1);
	board[move] = cpu;
	usersTurn = true;
	displayMove(move,cpu);
	turns++;
	checkWin(cpu);
	play();

}


	
function play(){ // check if all squares used, else cpu turn
	console.log(usersTurn);
	if (turns === 9){
		displayResult('draw');
	}
	else if (!usersTurn && winner === undefined) {
		cpuTurn();
	}

}

function displayMove(move, player){
	$("#"+move).html(player);
	if (player === user){
		$("#"+move).addClass('player');
	}
	else {
		$("#"+move).addClass('cpu');
	}
}


function checkWin(mark){  // working
	for (var j = 0; j < winningCom.length; j++){ // loop through possible winning combinations
		var count = 0; // track how many of each mark are in combi
		for (var i = 0; i < winningCom[j].length; i++){
			if (board[winningCom[j][i]] === mark){ // increment count if mark is found
				count++;
			}
			if (count === 3){  // if 3 marks, set winner and return true
				winner = mark;
				spacesLeft = [];
				displayResult(winner);
				return true;
			}
		}

	}
	if(turns === 9){
		displayResult(winner);
	}
}


function cpuMove(){
	
	var randomMove = spacesLeft[Math.floor(Math.random() * spacesLeft.length)]; // default move incase no best move
	console.log(randomMove, 'random');
	var cpuWin = checkMark(cpu);
	var playerWin = checkMark(user);
	if (cpuWin){
		return cpuWin;
	}
	if (playerWin){
		return playerWin;
	}
	return randomMove;
}

function findSpace(arr){
	for (var i = 0; i < arr.length; i++){
		if (typeof board[arr[i]] === 'number'){
			console.log(arr[i])
			return arr[i];
		}
	}
}

function checkMark(mark){
		for (var i = 0; i < winningCom.length; i++){ // loop through winning combis
			var count = 0; // count how many of cpu marks or users marks are present
			for (var j = 0; j < winningCom[i].length; j++){ // loop through locations in each combi
				if (board[winningCom[i][j]] === mark){ // if mark to be checked is in space
					count ++;
				}
				if (count === 2){ // if can win/ stop player winning
					return findSpace(winningCom[i]);
				}
			}
		}
}

function displayResult(result){
	$('.overlay').addClass('overlay-active');
	$('.result').removeClass('hidden');
	if (result === user) {
		$('.outcome').html('You Won!');
		$('.result').css('background', 'green');
	}
	else if (result === cpu) {
		$('.outcome').html('You lost!');
		$('.result').css('background', 'red');
	}
	else if (winner === undefined){
		$('.outcome').html('Draw!');
		$('.result').css('background', 'yellow');
		$('.outcome').css('color', 'black');
	}
}