var Game = function() {
	this.turns = 0;
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
			if(gamereferance.board[row][col].state != "EMPTY") {
				alert("wrong move!");
			} else {
				gamereferance.board[row][col].state = gamereferance.activeTurn;
				gamereferance.nextTurn();
				gamereferance.turns++;
				gamereferance.render(); // TODO: fix calling render twice
				gamereferance.checkVictory();
				gamereferance.render();
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
	}
}

Game.prototype.nextTurn = function() {
	this.activeTurn = (this.activeTurn == "X") ? "O" : "X";
	$("#current-player").html(this.activeTurn).css("color",Game.getSymbolColor.call(this, this.activeTurn));
}

Game.getSymbolColor = function() {
	return (this.activeTurn == "X") ? Mark.xColor : Mark.oColor;
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