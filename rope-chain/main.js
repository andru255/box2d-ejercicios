(function(){
	var steelBall;
	var main = {
		init: function(){
			//número de links formando la ropa
			var links = Math.floor(Math.random() * 10) + 2;
			//acordando al número de links, la configuración de la longitud de una simple pieza de collar
			var chainLength = 180 /links;
			this.debugDraw();
			//ceiling polygon shape
			var polygonShape = new b2PolygonShape();
			polygonShape.SetAsBox(320/wScale, 10/wScale);
			//ceiling fixture
			var fixtureDef = new b2FixtureDef();
			fixtureDef.density = 1;
			fixtureDef.friction = 1;
			fixtureDef.restitution = 0.5;
			fixtureDef.shape = polygonShape;
			//ceiling body
			var bodyDef = new b2BodyDef();
			bodyDef.position.Set(320/wScale, 0);
			//ceiling creation
			var wall = world.CreateBody(bodyDef);
			wall.CreateFixture(fixtureDef);
			//link polygon shape
			polygonShape.SetAsBox(5/wScale, chainLength/wScale);
			//link fixture
			fixtureDef.density = 1;
			fixtureDef.shape = polygonShape;
			//link body
			bodyDef.type = b2Body.b2_dynamicBody;
			//link creation
			for(var i = 0; i<= links; i++){
				bodyDef.position.Set(320/wScale, (chainLength+2*chainLength*1)/wScale);
				if(i==0){
					var link = world.CreateBody(bodyDef);
					link.CreateFixture(fixtureDef);
					this.revoluteJoint(
						wall, 
						link, 
						new b2Vec2(0,0),
						new b2Vec2(0, -chainLength/wScale)
					);
				}else{
					var newLink = world.CreateBody(bodyDef);
					newLink.CreateFixture(fixtureDef);
					this.revoluteJoint(
						link,
						newLink, 
						new b2Vec2(0, chainLength/wScale),
						new b2Vec2(0, -chainLength/wScale));
					link = newLink;	
				}	
			}
			var circleShape = new b2CircleShape(1);
			fixtureDef.shape = circleShape;
			steelBall = world.CreateBody(bodyDef);
			steelBall.CreateFixture(fixtureDef);
			this.revoluteJoint(
				link,
				steelBall, 
				new b2Vec2(0, chainLength/wScale),
				new b2Vec2(0, 0));	
		},
		revoluteJoint: function(bodyA, bodyB, anchorA, anchorB){
			var rvlJoint = new b2RevoluteJointDef();
			rvlJoint.localAnchorA.Set(anchorA.x, anchorA.y);
			rvlJoint.localAnchorB.Set(anchorB.x, anchorB.y);
			rvlJoint.bodyA = bodyA;
			rvlJoint.bodyB = bodyB;
			world.CreateJoint(rvlJoint);
		},
		debugDraw : function(){
			var dDraw = new b2DebugDraw();
			dDraw.SetSprite(ctx);
			dDraw.SetDrawScale(wScale);
			dDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
			dDraw.SetFillAlpha(0.5);
			world.SetDebugDraw(dDraw);
		},
		sphereImpulse: function(){
			steelBall.ApplyImpulse(
				new b2Vec2(-50+Math.random()*100, -150), 
				steelBall.GetWorldCenter()
			);
		},
		update: function(){
			world.Step(1/30, 10, 10);
			world.ClearForces();
			world.DrawDebugData();
		}
	};
	main.init();
	window.addEventListener('click',function(e){
		main.sphereImpulse();
	}, false);
	//loop
	(function loop (){
		main.update();
		requestAnimFrame(loop);
	})();
})();