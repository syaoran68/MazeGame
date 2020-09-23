// Eddie Huang
// edhuang04@csu.fullerton.edu
// Salvador Chavez
// schavez95@csu.fullerton.edu
// Dylan Lackey
// schavez95@csu.fullerton.edu
// CPSC-386 Game Development
// Project 1

var maze;

function setup()
{
    // set the canvas height and width
    createCanvas(800, 800);
    //set the block size
    var s = 20;
    //generate the row and columns based on the canvas size and the block size
	var rows = floor(height / s);
	var cols = floor(width / s);
    
    //setting up the maze functionality
	maze = new mazeConstruction(rows, cols, s);
    maze.initialize();
    //setting the framerate for refreshing (theres a limitation to p5 how fast it can refresh)
	frameRate(1000);
}


function draw() {
	background(51);
	maze.constructOneStep();
	maze.display();
}


function mazeConstruction(rows, cols, s)
{
    //importing data for rows, columns, and square size
	this.rows = rows;
	this.cols = cols;
    this.size = s;                        
    //new array for the walls
    this.walls = [];            
    //function for joining the two subsets together.
	this.uSet = new joinSets();           
    this.wallIndex = 0;
    //creating the walls
	this.initialize = function(){
        //generating all the row walls
		for(var i = 0; i <= this.rows; i++){
			for(var j = 0; j < this.cols; j++){
				this.walls.push(new wall(i, j, i, j + 1, this.size));
			}
        }
        //generating all the column walls
		for(var j = 0; j <= this.cols; j++){
			for(var i = 0; i < this.rows; i++){
				this.walls.push(new wall(i, j, i + 1, j, this.size));
			}
		}
		//randomization of the walls
		this.walls.sort(function randomSort(a, b){return Math.random() > 0.5 ? - 1 : 1;});
		for(var i = 0; i < this.rows; i++){
			for(var j = 0; j < this.cols; j++){
				this.uSet.uset.push(new cell(i, j, this.rows, this.cols));
			}
		}
	}
	//displaying walls
	this.display = function(){
		for(var i = 0; i < this.walls.length; i++){
			this.walls[i].isHighlight(false);
		}
		this.walls[this.wallIndex].isHighlight(true);
		for(var i = 0; i < this.walls.length; i++){
			this.walls[i].show();
		}
	}
	//
	this.constructOneStep = function(){
        var wall = this.walls[this.wallIndex];
        //setting all the walls on the proper sides    
		var isBorder = (wall.i1 == wall.i2 && (wall.i1 == 0 || wall.i1 == this.rows)) || (wall.j1 == wall.j2 && (wall.j1 == 0 || wall.j1 == this.cols));
		if(isBorder == false){
			var c1Index, c2Index;
			if(wall.i1 == wall.i2){
				c1Index = (wall.i1 - 1) * this.cols + wall.j1;
				c2Index = wall.i1 * this.cols + wall.j1;
			}else if(wall.j1 == wall.j2){
				c1Index = wall.i1 * this.cols + wall.j1 - 1;
				c2Index = wall.i1 * this.cols + wall.j1;
            }
            //hunting for the parent node of each set we're trying to combine
			var p1 = this.uSet.findParent(c1Index);          
			var p2 = this.uSet.findParent(c2Index);
			if (p1 != p2){
                //mark the walls broken and so they don't display
                this.walls[this.wallIndex].breaked = true
                //merge the two subsets together
				this.uSet.unionTwo(c1Index, c2Index);        
			}
		}
		this.wallIndex++;
		if(this.wallIndex >= this.walls.length){
			this.wallIndex = this.walls.length - 1;
		}
	}
}

//joining the subsets
function joinSets(){
    this.uset = [];
    // hunting for the parent subset
	this.findParent= function(ind){
        var pind = this.uset[ind].parent;
        //if its already the parent set then just return the index
		if(pind == ind){
			return ind;
		}
		var res = this.findParent(pind);
		this.uset[ind].parent = res;
		return res;
    }
    //joing one subset under the other
	this.unionTwo = function(ind1, ind2){
		var p1 = this.findParent(ind1);
		var p2 = this.findParent(ind2);
		this.uset[p1].parent = p2;
	}
}

// cell setup
function cell(i, j, rows, cols){
	this.i = i;      
	this.j = j;      
	this.rows = rows;
	this.cols = cols;
	this.parent = i * cols + j;
	this.index = i * cols + j;
}

// wall setup
function wall(i1, j1, i2, j2, s){
	this.i1 = i1;
	this.j1 = j1;
	this.i2 = i2;
	this.j2 = j2;
	this.s = s;
    this.breaked = false;
    //highlighted wall being processed at the moment
	this.ishigh = false;                  
	this.isHighlight = function(ishigh){
		this.ishigh = ishigh;
    }
    //drawing the walls
	this.show = function(){
		if(this.breaked == false){
			if(this.ishigh){
                
				stroke(255, 0, 0);
				strokeWeight(4);
			}else{
				stroke(255);
				strokeWeight(2);
			}
			line(this.j1 * this.s, this.i1 * this.s, this.j2 * this.s, this.i2 * s);
		}
	}
}

//tremeaux algorithm exploration of maze
function mazeBot(rows, cols, s){
	//give initial location of bot at indice 0,0 of maze
	//indice 800,800 should be end point? 
	var row = 0;
	var col = 0;
	//set the block size
	this.s = s;

	while(this.row != rows && this.col != cols)
	{
	//depth first search, enter first non broken wall
	// -> if wall is hit, backtrack to next open wall until end point found
	colorCell(this.row, this.col);

	}

}
//function to assign color to visited cells
// function colorCell(i, j)
// {
// 	initially color visited cells blue, twice visited cells should be red
// 	if(p5.color != blue){
//     if(cell.visited)
//     {
//         let c = color(blue);

//     }
	
	// fill(c);
	// rect(i, j, i+20, j+20);
	/*}
	else{
	let c = color(red);
	fill(c);
	rect(i, j, i+20, j+20);
	}*/
//}