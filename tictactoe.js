// TODO

// create a game state machine
// study text alignment
// build up moves log
// store moves in mongo
// build a computer opponent
// build a network opponent system

function setup() 
{
  screen_size = 400;
  sidebar_width = Math.floor(screen_size * 0.334);  
  createCanvas(screen_size + sidebar_width, screen_size);
  
  // console.log("Initializing screen:" + width + "," + height);
  // console.log("Sidebar width:" + sidebar_width);
  label_height = Math.floor(height * 0.067);
  // console.log("Label height:" + label_height);   
  
  move_fontsize = Math.floor(screen_size * 0.4);
  // console.log("Move Font Size:" + move_fontsize);
  columns=""; rows = "";

  // This is how you determine columns and rows on a 3 x 3 grid
  /* 
  for(i = 0;i<9;i++)
    {
      columns += i % 3 + ",";
      rows += Math.floor(i / 3) + ","; 
    }
  console.log("Columns:" + columns.substr(0,columns.length-1));
  console.log("Rows:" + rows.substr(0,rows.length-1));
  */  
  
  snd_switch = loadSound("assets/switch22.ogg");
  snd_switch2 = loadSound("assets/switch26.ogg");
  snd_gameEnd = loadSound("assets/threeTone2.ogg");
  init();
}

function init()
{
  moves = '         ';
  // moves = 'xo xo xo ';
  // console.log("Board initialized to:" + moves);
  lastCell = 0;
  gameStart = true;
  gameEnd = false;
  player = 'x';
  movecount = 0;
}

function draw() 
{
  if (gameStart) 
  {
    fill(222);
    rect(0,0,width,height);
    textFont('monospace');
    textSize(move_fontsize * 0.25);
    fill(64,222,64);
    text("TIC TAC TOE",width * 0.25,height * 0.5);
    textSize(move_fontsize * 0.2);
    text("Click to play",width * 0.26,height * 0.6);
  }
  else
  {
    background('skyblue');      
    draw_sidebar(); 
    check_mouse();   
    draw_board();
    draw_moves();      
  }  
}

function mousePressed()
{
  if (gameEnd) 
  {
    init();
  }

  if(gameStart)
  {
    gameStart = false;
  }   
  else
  {
    if (moves[cell]===' ' && !gameEnd)
    {
      moves = moves.replaceAt(cell,player);
      movecount++;
      victory_check();
      if (!gameEnd) 
      {
        if (player==='x') player = 'o'; else player = 'x';
        snd_switch2.play();
      }
      else
      {
        snd_gameEnd.play();
      }        
    }
  }  
}

function check_mouse()
{
  if (mouseX > sidebar_width && mouseX < width
    && mouseY > 0 && mouseY < height) 
  {
    fill(0);
    textSize(18);
    // text('Mouse:' + mouseX + ',' + mouseY,5,label_height * 2);

    // determine cell
    col = Math.floor(mouseX / sidebar_width)-1;
    row = Math.floor(mouseY / sidebar_width);
    // text('Col:' + col,5,label_height * 3);
    // text('Row:' + row,5,label_height * 4);
    cell = col + row * 3;
    // text('Cell:' + cell,5,label_height * 5);
    if (moves[cell]===' ' && !gameEnd)
    {
      // light up cell
      x = col * sidebar_width + sidebar_width;
      y = row * sidebar_width;
      // text('Light:' + x + ',' + y,5,label_height * 6);
      fill(128,64,64);
      rect(x,y,sidebar_width,sidebar_width);
      fill(0);
      textSize(move_fontsize * 0.15);
      text('Click to play here',x,y,sidebar_width,sidebar_width);
      // play sound
      if (!snd_switch.isPlaying() && cell != lastCell)
      {
        snd_switch.play();
        lastCell = cell;
      }
    }     
  }
  else cell = 10;
}

String.prototype.replaceAt = function(index, replacement) {
  return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}

function victory_check()
{
  // check horizontal rows
  // row 1
  if(moves[0] === moves[1] && moves[1] === moves[2] && moves[0] != ' ')
  {
    gameEnd = true;  
  }
  // row 2
  if(moves[3] === moves[4] && moves[4] === moves[5] && moves[3] != ' ')
  {
    gameEnd = true;  
  }
  // row 3
  if(moves[6] === moves[7] && moves[7] === moves[8] && moves[6] != ' ')
  {
    gameEnd = true;  
  }
  // check vertical columns
  // col 1
  if(moves[0] === moves[3] && moves[3] === moves[6] && moves[0] != ' ')
  {
    gameEnd = true;  
  }
  // col 2
  if(moves[1] === moves[4] && moves[4] === moves[7] && moves[1] != ' ')
  {
    gameEnd = true;  
  }
  // col 3
  if(moves[2] === moves[5] && moves[5] === moves[8] && moves[2] != ' ')
  {
    gameEnd = true;  
  }
  // check diagonal top left to bottom right  
  if(moves[0] === moves[4] && moves[4] === moves[8] && moves[0] != ' ')
  {
    gameEnd = true;  
  }
  // check diagonal bottom left to top right
  if(moves[6] === moves[4] && moves[4] === moves[2] && moves[6] != ' ')
  {
    gameEnd = true;  
  } 
  // check for tie
  if(!gameEnd && movecount===9)
  {
    gameEnd = true;
    player = 't';  
  }
}

function draw_sidebar() 
{
  stroke(0);
  fill(64,128,64);
  rect(0,0,sidebar_width,label_height);
  fill(64,255,64);
  rect(0,label_height,sidebar_width,height-2);
  label_textsize = label_height * 0.5;
  textSize(label_textsize);
  label = "TIC TAC TOE";
  x = sidebar_width * 0.5 - (label_textsize * label.length * 0.28);
  y = label_height * 0.75;
  text(label,x,y);
  fill(0);
  if (gameEnd)
  {
    fill(255,64,64);
    if (player != 't')
    {
      text("Player " + player + " WINS!",10,label_height * 2);
    }
    else
    {
      text("Nobody WINS!",10,label_height * 2);
    }     
    fill(64,64,128);
    text("To play again",10,label_height * 3);
    text("Click Mouse",10,label_height * 3.5);
  }
  else 
  {
    text("Player " + player + " move",10,label_height * 2); 
  }  
}

function draw_board() 
{
  line(sidebar_width,sidebar_width,width,sidebar_width);
  line(sidebar_width,sidebar_width * 2,width,sidebar_width * 2);
  line(sidebar_width * 2,0,sidebar_width * 2,height);
  line(sidebar_width * 3,0,sidebar_width * 3,height);  
}

function draw_moves()
{
  for (i=0;i<9;i++)
    {
      textSize(move_fontsize);
      fill(0);
      cell_col = i % 3;
      cell_row = Math.floor(i/3);
      x_left = sidebar_width * cell_col + sidebar_width;
      x_offset = sidebar_width * 0.5 - move_fontsize * 0.25;
      y_bottom = sidebar_width * cell_row + sidebar_width;
      y_offset = -x_offset;
      text(moves[i],x_left + x_offset,y_bottom + y_offset);
    }
}