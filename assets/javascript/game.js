var Game = function() {
	this.turns = 0;
	this.gameOver = false;
	/*
		Initialize the game board
	*/
	this.board = new Array(3);
	for(var i=0; i < 3; i++) {
		this.board[i] = new Array(3);
	}

	for(var i=0; i < 3; i++) {
		for(var j=0; j < 3; j++) {
			this.board[i][j] = new Mark();
		}
	}

	// Active turn tracking, first player is X
	this.activeTurn = "X";

	/*
		Add Click action listeners to all the divs
	*/

	var gamereferance = this;
	$(".cell").each(function() {
		$(this).click(function() {
			var row = parseInt(this.id.charAt(5));
			var col = parseInt(this.id.charAt(7));
			if(gamereferance.board[row][col].state != "EMPTY" && !gamereferance.gameOver) {
				alert("wrong move!");
			} else if(!gamereferance.gameOver) {
				gamereferance.board[row][col].state = gamereferance.activeTurn;
				gamereferance.nextTurn();
				gamereferance.turns++;
				gamereferance.render(); // TODO: fix calling render twice
				gamereferance.checkVictory();
				gamereferance.render();
			} else {
				alert("Game is over.");
			}
		});
	});

};

Game.prototype.render = function() {
	for(var i=0; i < 3; i++) {
		for(var j=0; j < 3; j++) {
			switch(this.board[i][j].state) {
				case "X":
					$("#cell-"+i+"-"+j).html(Mark.$xhtml.clone());
					break;
				case "O":
					$("#cell-"+i+"-"+j).html(Mark.$ohtml.clone());
					break;
				case "DRAW":
					$("#cell-"+i+"-"+j).children().each(function() {
						var item_class = $(this).attr("class");
						if(item_class == "mark-o") {
							$(this).animate({backgroundColor: "gray"}, 750);
						} else {
							$(this).children().each(function() {
								$(this).animate({backgroundColor: "gray"}, 750);
							});
						}
					});
					break;
			}
		}
	}
}

Game.prototype.checkVictory = function() {
	if(this.turns == 9) {
		for(var i=0; i < 3; i++) {
			for(var j=0; j < 3;j++) {
				this.board[i][j].state = "DRAW";
			}
		}
		$("h3").html("It's a draw");
		return;
	}
	var mark = (this.activeTurn == "X") ? "O" : "X"; // Swap the turn, so the last player is checked
	var counter = 0;
	var cellsToMark = [];
	// Horizontal conditions
	for(var j=0; j < 3; j++) {
		counter = 0;
		cellsToMark = [];
		for(var i=0; i < 3; i++) {
			if(this.board[i][j].state == mark) {
				counter++;
				cellsToMark.push(new Vector2(i, j));
				if(counter == 3) break;
			}
		}
		if(counter == 3) break;
	}
	// Vertical conditions, skip if game is over
	if(counter != 3) {
		for(var i=0; i < 3; i++) {
			counter = 0;
			cellsToMark = [];
			for(var j=0; j < 3; j++) {
				if(this.board[i][j].state == mark) {
					counter++;
					cellsToMark.push(new Vector2(i, j));
					if(counter == 3) break;
				}
			}
			if(counter == 3) break;
		}
	}

	// Cross conditions, skip if game is over
	if(counter != 3) {
		if((this.board[0][0].state == mark && this.board[1][1].state == mark && this.board[2][2].state == mark)) {
			cellsToMark.push(new Vector2(0,0));
			cellsToMark.push(new Vector2(1,1));
			cellsToMark.push(new Vector2(2,2));
			counter = 3;
		}
		else if((this.board[0][2].state == mark && this.board[1][1].state == mark && this.board[2][0].state == mark )) {
			cellsToMark.push(new Vector2(0,2));
			cellsToMark.push(new Vector2(1,1));
			cellsToMark.push(new Vector2(2,0));
			counter = 3;	
		}

	}

	if(counter == 3) {
		if(mark == "X") {
			$("h3").html("The winner is <span style='color: crimson;'> X </span>");
			for(var i=0; i < cellsToMark.length; i++) {
				var x = cellsToMark[i].x;
				var y = cellsToMark[i].y;
				this.board[x][y].state = "DRAW";
			}
			this.gameOver = true;
		}
		if(mark == "O") {
			$("h3").html("The winner is <span style='color: #33adff;'> O </span>");
			for(var i=0; i < cellsToMark.length; i++) {
				var x = cellsToMark[i].x;
				var y = cellsToMark[i].y;
				this.board[x][y].state = "DRAW";
			}
			this.gameOver = true;
		}
	}

}

Game.prototype.nextTurn = function() {
	this.activeTurn = (this.activeTurn == "X") ? "O" : "X";
	$("#current-player").html(this.activeTurn).css("color",Game.getSymbolColor.call(this, this.activeTurn));
}

Game.getSymbolColor = function() {
	return (this.activeTurn == "X") ? Mark.xColor : Mark.oColor;
}

var Vector2 = function(x, y) {
	this.x = x;
	this.y = y;
}

var Mark = function() {
	/*
		State can be EMPTY, DRAW, X or O
	*/
	this.state = "EMPTY";
}

/*
	X jQuery object, clone it to use it
*/
Mark.$ohtml = $("<div>", {class: "mark-o"})
	.append($("<div>", {class: "inner-o"}));

/*
	O jQuery object, clone it to use it
*/
Mark.$xhtml = $("<div>", {class: "mark-x"})
	.append($("<div>", {class: "left-part-x"}))
	.append($("<div>", {class: "right-part-x"}));

Mark.xColor = "crimson";
Mark.oColor = "#33adff";

$(document).ready(function() {
	var game = new Game();
	$("#current-player").html("X").css("color",Mark.xColor);
});