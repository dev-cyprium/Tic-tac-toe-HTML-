var Game = function() {
	this.board = new Array(3);
	for(var i=0; i < 3; i++) {
		this.board[i] = new Array(3);
	}
};

var Mark = function() {
	/*
		State can be EMPTY, X or O
	*/
	this.state = "EMPTY";
}

/*
	X html data
*/
Mark.$ohtml = $("<div>", {class: "mark-o"})
	.append($("<div>", {class: "inner-o"}));

/*
	O html data
*/
Mark.$xhtml = $("<div>", {class: "mark-x"})
	.append($("<div>", {class: "left-part-x"}))
	.append($("<div>", {class: "right-part-x"}));

$(document).ready(function() {
	var game = new Game();

	$("#cell-0-0").append(Mark.$ohtml);
	$("#cell-0-1").append(Mark.$xhtml);
});