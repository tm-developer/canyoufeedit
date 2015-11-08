var tweet = [];
var spheres = [];
var hunger = 0;

$(function() {

	//Starter height
	$('#starter').css('height',innerHeight);

	// sounds load
	var audioWhack = document.createElement('audio');
	var audioFeel = document.createElement('audio');

	audioWhack.setAttribute('src', 'whack.mp3');
	audioFeel.setAttribute('src', 'feel.mp3');


	audioWhack.addEventListener("load", function() {
		console.log("sound loaded !")
	}, true);

	$('#validator').click(function() {
		$('#word form').submit().parent().hide();
    	$('h2').hide();
    	$('#startRequest, h3').show();
	})

    $('#startRequest').click(function() {

    	audioFeel.play();
    	audioFeel.volume = 0.3;

    	$('#starter').show();

    	$( "#starter" ).animate({
		    opacity: 1
		}, 7100 , function() {
		  	$(this).hide();
		  	$('.hunger').show();
		});

        $.get('/twit', function(res) {

        	// create an new instance of a pixi stage
			var stage = new PIXI.Stage(0x467BBB);

			stage.setInteractive(true);
		 	
		 	var w = window.innerWidth - 5;
		 	var h = window.innerHeight - 5;
			// create a renderer instance.
			var renderer = PIXI.autoDetectRenderer(w,h);
		 
			// add the renderer view element to the DOM
			document.body.appendChild(renderer.view);
		 
			requestAnimFrame( animate );

			// create a texture from an image path
			var texture = PIXI.Texture.fromImage("../images/sphere.png");
			var texturePop = PIXI.Texture.fromImage("../images/spherePop.png");

			var result = res.statuses;

        	for(key in result){
		       console.log(result[key]);
		       tweet.push(result[key]);

				// create a new Sprite using the texture
				var sphere = new PIXI.Sprite(texture);

			 	// create a random direction in radians
    			sphere.direction = Math.random() * Math.PI * 2;

				// center the sprites anchor point
				sphere.anchor.x = 0.5;
				sphere.anchor.y = 0.5;

				// this number will be used to modify the direction of the sprite over time
			    sphere.turningSpeed = Math.random() - 0.8;

			    // create a random speed between 0 - 2
			    sphere.speed = (2 + Math.random() * 2) * 0.5;

			    sphere.offset = Math.random() * 100;
			 
				// move the sprite t the center of the screen
				sphere.position.x = Math.random() + w/2;
				sphere.position.y = Math.random() + h/2;

				
			 	
			 	spheres.push(sphere);

			 	// make interactive...
				sphere.interactive = true;

				sphere.mousedown = function(moveData) {
	            	this.setTexture(texturePop);
				};

				sphere.mouseup = function(moveData) {
					console.log( "You eat that tweet !" );
					audioWhack.play();
	            	this.visible = false;

	            	if (hunger < 500) {

	            		hunger += 10;
	            		$('.hunger').text(hunger);

	            	} else{

	            		$('.alert').show();
	            		audioFeel.pause();
	            		for (var i = stage.children.length - 1; i >= 0; i--) {
							stage.removeChild(stage.children[i]);
						};
						
	            	};
	            	
				};

				stage.addChild(sphere);
			 
			}
			

		 	var tick = 0;
			function animate() {

			    // iterate through the sprites and update their position
			    for (var i = 0; i < spheres.length; i++)
			    {
			        var sphere = spheres[i];
			        sphere.scale.y = 0.95 + Math.sin(tick + sphere.offset) * 0.05;
			        sphere.direction += sphere.turningSpeed * 0.01;
			        sphere.position.x += Math.sin(sphere.direction) * (sphere.speed * sphere.scale.y);
			        sphere.position.y += Math.cos(sphere.direction) * (sphere.speed * sphere.scale.y);
			        sphere.rotation = -sphere.direction + Math.PI;
			    }

			     // increment the ticker
    			tick += 0.1;

			    // time to render the stage !
			    renderer.render(stage);

			    // request another animation frame...
			    requestAnimationFrame(animate);
			}

        });
		
		$(this).slideUp();
		$('h3').hide();

    });
});

