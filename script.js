
		//canvas variables
		var canvas;
		var context;
		
		//Game variables
		var pause = false;
		var singlePlayerMode = true;
		var requestId = 0;
		var gameLvl = 1;
		
		//players's points
		var player1 = 0;
		var player2 = 0;

		//variables defining balls
		var anglePercent = 0;
		var alfa = 0;
		var r = 8;
		var x = 320;
		var y = 200;
		var dx = 3;
		var dy = 3;
		var speed = 10;
		
		//variables defining paddles dimensions
		var paddleXDimension = 40; //dimension from the left/rigth side
		var paddle1YDimension = 66;
		var paddle2YDimension = 66;
		var paddleSpeed = 5;

		//paddles positions
		var paddle1Y = 200;
		var paddle2Y = 200;
		
		//array defining direction of paddle's movement
		var keyMap ={87: false, 83: false, 38: false, 40: false};
		
		//variables defining extra-bonus
		var t = 300;
		var bonusActive = false;
		var bonusX = 0;
		var bonusY = 0;
		var bonusR = 32 + r;
		var bonusEventArr = ['minusPoint', 'plusPoint', 'increasePaddleSize', 'decreasePaddleSize', 'fasterBall'];
		var currentBonus = bonusEventArr[0];
		
		bonusImage = new Image();
		bonusImage.src = 'question-mark-button.png';
		
		
		//starts game
		function draw() 
		{
			"use strict";
			document.getElementById('menu').style.display = "none"
			document.getElementById('canvasSpace').style.display = "initial";
			document.getElementById('menuInGame').style.display = "initial";
			canvas = document.getElementById('canvasSpace');
			context = canvas.getContext('2d');
			document.addEventListener("keydown", controlDown);
			document.addEventListener("keyup", controlUp);		
			document.addEventListener("keypress", keyPressed);
			anim();
			//setInterval(anim, 17);
		}

		//refresh frames
		function anim() 
		{
			"use strict";
			if (pause == false)
			{
				context.clearRect(0,0,640,400);
				bonusInit();
				ballInit();
				paddlesInit();
				scoreHandler();	
			}
			pauseGame();
			requestId = requestAnimationFrame(anim);
		}
		
		//draw ball
		function ballInit()
		{
			moveBall();
			context.beginPath();
			context.fillStyle = 'black';
			context.arc(x, y, r, 0, Math.PI*2);
			context.fill();
			context.closePath();
		}
		
		function moveBall()
		{
			//change direction in OY axis 
			if((y + dy < r) || (y + dy > 400 - r))
			{
				dy = -dy;
			}
			//ball hit the paddle, changing direction in OX axis
			if(x + dx > 640 -  r)
			{
				//point for the player 1
				player1++;
				resetMatch();
			}
			if (x + dx < r)
			{
				//point for the player 1
				player2++;
				resetMatch();
			}
			//ball hit by right paddle
			if((x + dx > 640 - r - paddleXDimension) && ((y > paddle2Y) && (y < paddle2Y + paddle2YDimension)))
			{
				changeAngle2();
			}
			//ball hit by left paddle
			if((x + dx <r + paddleXDimension) && ((y > paddle1Y) && (y < paddle1Y + paddle1YDimension)))
			{
				changeAngle1();
			}	
			x = x + dx;
			y = y + dy;	
		}
		//change angle of the ball direction after hit by padlle
		function changeAngle1()
		{
			anglePercent = Math.abs((Math.abs(paddle1Y - y) - (paddle1YDimension/2))/(paddle1YDimension/2));
			if(anglePercent > 1)
				anglePercent = 1;
			alfa = (2*Math.PI/3) * anglePercent; 
			if (alfa > 2*Math.PI/3)
				alfa = 2*Math.PI/3;
			dx = speed*Math.cos(alfa);
			if(dy >= 0)
				dy = speed*Math.sin(alfa);
			else
				dy = -speed*Math.sin(alfa);
		}
		
		function changeAngle2()
		{
			anglePercent = Math.abs((Math.abs(paddle2Y - y) - (paddle2YDimension/2))/(paddle2YDimension/2));
			if(anglePercent > 1)
				anglePercent = 1;
			alfa = (2*Math.PI/3) * anglePercent;
			if (alfa > 2*Math.PI/3)
				alfa = 2*Math.PI/3;		
			dx = -speed*Math.cos(alfa);
			if(dy >= 0)
				dy = speed*Math.sin(alfa);
			else
				dy = -speed*Math.sin(alfa)
		}
				
		//draw paddles
		function paddlesInit()
		{
			movePaddle();
			//left paddle
			context.fillStyle = 'blue';
			context.fillRect(30,paddle1Y,paddleXDimension-30,paddle1YDimension);
			//right paddle
			context.fillStyle = 'red';
			context.fillRect(640-paddleXDimension,paddle2Y,paddleXDimension-30,paddle2YDimension);
		}
		
		//reset some variables to the initial values after one player scores a point
		function resetMatch()
		{
			x = 350;
			y = 300;
			paddle1Y = 200;
			paddle2Y = 200;
			paddle1YDimension = 66;
			paddle2YDimension = 66;
			t = 300;
			if(dx > 0)
			{
				dx = -3;
				dy = 3;
			}
			else
			{
				dx = 3;
				dy = -3;
			}
			if(gameLvl == 3)
			{
				speed = 15;
			}
			else if(gameLvl == 1)
			{
				speed = 6;
			}
			else
			{
				speed = 10;
			}
			
		}
		
		
		//function handling keypress event
		function keyPressed(e)
		{
		if (e.keyCode == 112)
			{
				pause = !pause;
			}	
		}
		
		
		//functions for multiple key pressing handling
		function controlDown(e)
		{
			if (e.keyCode in keyMap)
			{
				keyMap[e.keyCode] = true;
			}	
		}
		function controlUp(e)
		{
			if (e.keyCode in keyMap)
			{
				keyMap[e.keyCode] = false;
			}	
		}
	
		//controlling paddle - start movement
		function movePaddle()
		{
			
		if(singlePlayerMode == false)
		{
			//1st player's controls:
			//W key code is 87
			if(keyMap[87] == true)
			{
				if(paddle1Y >= 0)
				{
					paddle1Y = paddle1Y - paddleSpeed;
				}
			}
			//S key code is 83
			else if(keyMap[83] == true)
			{
				if(paddle1Y <= 400-paddle1YDimension)
				{
					paddle1Y = paddle1Y + paddleSpeed;
				}
			}
		}
		else
		{
			botPaddle();
		}		
			//2nd player's controls:
			//UP Arrow key code is 38
			if(keyMap[38] == true)
			{
				if(paddle2Y >= 0)
				{
					paddle2Y = paddle2Y - paddleSpeed;
				}
					
			}
			//DOWN Arrow key code is 40
			else if(keyMap[40] == true)
			{
				if(paddle2Y <= 400-paddle2YDimension)
				{
					paddle2Y = paddle2Y + paddleSpeed;
				}
			}
		}
		
		//BOT paddle, I assume that bot is on the left side
		function botPaddle()
		{
			if(paddle1Y < y && paddle1Y <= 400-paddle1YDimension)
			{
				//move down
				paddle1Y = paddle1Y + paddleSpeed
			}
			if(paddle1Y > y && paddle1Y >= 0)
			{
				//move up 
				paddle1Y = paddle1Y - paddleSpeed
			}
		}
		
		//handling bonus event
		function bonusInit()
		{
			//chcecks if ball reaches the bonus fieldse
			if((bonusActive == true) && (Math.abs(x - bonusX - 32) < bonusR) && (Math.abs(y - bonusY - 32) < bonusR))
			{
				useBonus();
				bonusActive = false;
			}
		
			//if bonus is already in game it stays the same
			if(bonusActive == true)
			{
				//draw the same one as the moment before
				context.drawImage(bonusImage,bonusX, bonusY, 64, 64);
			}
			//if there is no bonus it wait 3 seconds to make it
			else
			{
				t--;
				if (t == 0)
				{
				    bonusPicker();
					bonusX = ((640-100)/2) + Math.random()*100;
					bonusY = ((400-200)/2) + Math.random()*100;
					context.drawImage(bonusImage,bonusX, bonusY, 64, 64);
					bonusActive = true;
					t = 300;
				}
			}
		}
		//randomize bonus event and sets proper styles
		function bonusPicker()
		{
			currentBonus = bonusEventArr[Math.floor(Math.random() * (5))];;
		}
		
		//make picked event occurs in the game
		function useBonus()
		{	
			if(bonusActive == true)
			{
				switch(currentBonus)
				{
					//minusPoint event
					case "minusPoint":		
						if( dx > 0 )
						{
							player1--;
						}
						else
						{
							player2--;
						}
						break;
					
					//plusPoint event
					case "plusPoint":			
						if( dx > 0 )
						{
							player1++;
						}
						else
						{
							player2++;
						}	
						break;
					//increasePaddleSize event
					case "increasePaddleSize":
						if( dx > 0 &&  paddle1YDimension < 320)
						{
							paddle1YDimension = paddle1YDimension + 12;
						}
						if(dx < 0 &&  paddle2YDimension < 320)
						{
							paddle2YDimension = paddle2YDimension + 12;
						}
						break;
					//decreasePaddleSize event
					case "decreasePaddleSize":
						if(dx > 0 && paddle1YDimension > 10)
						{
							paddle1YDimension = paddle1YDimension - 12;
						}
						if(dx < 0 && paddle2YDimension > 10)
						{
							paddle2YDimension = paddle2YDimension - 12;
						}
						break;
					//fasterBall event
					case "fasterBall":
						speed = speed + 3;
						break;
					default:
						break;
				}
			}
		}
	
		//game pause function - display "PAUSE" 
		function pauseGame()
		{
			if(pause == true)
			{
				context.font = "26px Indie Flower";
				context.fillStyle = "red";
				context.fillText("PAUSE", 290, 230);
			}
			
		}
		
		//display points
		function scoreHandler()
		{
			context.font = "14px Indie Flower";
			context.fillStyle = "blue";
			context.fillText("points: "+player1, 160, 20);
			context.fillStyle = "red";
			context.fillText("points: "+player2, 400, 20);
		}
		
		//player modes
		function singlePlayerMode()
		{
			singlePlayerMode = true;
		}
		
		function multiPlayerMode()
		{
			singlePlayerMode = false;
		}
		
		//functions changing level of the game
		function easyLevel(A_lvl)
		{	
			document.getElementById('dif2').style.fontWeight = "normal";
			document.getElementById('dif3').style.fontWeight = "normal";
			document.getElementById('dif2').style.color = "#000000"
			document.getElementById('dif3').style.color = "#000000"
			A_lvl.style.color = "#7A0000";
			A_lvl.style.fontWeight = "bold";
			gameLvl = 1;
			speed = 6;
			
		}
		
		function mediumLevel(A_lvl)
		{
			document.getElementById('dif1').style.fontWeight = "normal";
			document.getElementById('dif3').style.fontWeight = "normal";
			document.getElementById('dif1').style.color = "#000000"
			document.getElementById('dif3').style.color = "#000000"
			A_lvl.style.color = "#7A0000";
			A_lvl.style.fontWeight = "bold";
			gameLvl = 2;
			speed = 10;
		}
		
		function hardLevel(A_lvl)
		{
			document.getElementById('dif1').style.fontWeight = "normal";
			document.getElementById('dif2').style.fontWeight = "normal";
			document.getElementById('dif1').style.color = "#000000"
			document.getElementById('dif2').style.color = "#000000"
			A_lvl.style.color = "#7A0000";
			A_lvl.style.fontWeight = "bold";
			gameLvl = 3;
			speed = 15;

		}
		//functions changing single/multi player mode
		function singlePlayerON(A_obj)
		{
			document.getElementById('playerMode2').style.fontWeight = "normal";
			document.getElementById('playerMode2').style.color = "#000000"
			A_obj.style.color = "#7A0000";
			A_obj.style.fontWeight = "bold";
			singlePlayerMode = true;
		}
		
		function multiPlayerON(A_obj)
		{
			document.getElementById('playerMode1').style.fontWeight = "normal";
			document.getElementById('playerMode1').style.color = "#000000"
			A_obj.style.color = "#7A0000";
			A_obj.style.fontWeight = "bold";
			singlePlayerMode = false;
		}
		
		//functions handling changing screen between menu and settings
		function settings()
		{
			document.getElementById('menu').style.display = "none";
			document.getElementById('settings').style.display = "initial";
		}
				
		function backToMainMenu()
		{
			document.getElementById('settings').style.display = "none";
			document.getElementById('menu').style.display = "initial";
		}
		//function handling going back to main menu from game
		function backToMenuFromGame()
		{
			resetMatch();
			cancelAnimationFrame(requestId);
			document.getElementById('canvasSpace').style.display = "none";
			document.getElementById('menuInGame').style.display = "none";
			document.getElementById('settings').style.display = "none";
			document.getElementById('menu').style.display = "initial";
		}
		
		//disable arrow keys to scroll the page
		window.addEventListener("keydown", function(e) 
		{
			if([38, 40].indexOf(e.keyCode) > -1) 
			{
			e.preventDefault();
			}
		}, false)
		
		