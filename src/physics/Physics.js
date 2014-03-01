(function (Box2D) {

    "use strict";

    var B2Vec2 = Box2D.Common.Math.b2Vec2,
        B2AABB = Box2D.Collision.b2AABB,
        B2BodyDef = Box2D.Dynamics.b2BodyDef,
        B2Body = Box2D.Dynamics.b2Body,
        B2FixtureDef = Box2D.Dynamics.b2FixtureDef,
        //b2Fixture = Box2D.Dynamics.b2Fixture,
        B2World = Box2D.Dynamics.b2World,
        //b2MassData = Box2D.Collision.Shapes.b2MassData,
        B2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
        B2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
        B2DebugDraw = Box2D.Dynamics.b2DebugDraw;
        //b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef;

    window.Physics = {

        getBodyAtXY: function (world, x, y) {
            var mousePVec = new B2Vec2(x, y),
                aabb = new B2AABB(),
                selectedBody = null;
            aabb.lowerBound.Set(x - 0.001, y - 0.001);
            aabb.upperBound.Set(x + 0.001, y + 0.001);

            // Query the world for overlapping shapes.
            world.QueryAABB(function getBodyCB(fixture) {
                if(fixture.GetBody().GetType() != B2Body.b2_staticBody) {
                    if(fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(), mousePVec)) {
                        selectedBody = fixture.GetBody();
                        return false;
                    }
                }
                return true;
            }, aabb);

            return selectedBody;
        },

        createWorld: function (scale) {
            var world = new B2World(
                new B2Vec2(0, 10),    //gravity
                true                 //allow sleep
            );

            var fixDef = this.fixDef = new B2FixtureDef();
            fixDef.density = 1.0;
            fixDef.friction = 0.5;
            fixDef.restitution = 0.9;

            // Ground
            this.createBox(world, 0, 11, 40, 0.1, true);
            //this.createTest(world);

            // walls
            this.createBox(world, 0, 0, 0.1, 11, true);
            this.createBox(world, 40 - 0.1, 0, 0.1, 11, true);

            //setup debug draw
            var debugDraw = new B2DebugDraw();
            debugDraw.SetSprite(document.getElementById("board").getContext("2d"));
            debugDraw.SetDrawScale(scale);
            debugDraw.SetFillAlpha(0.5);
            debugDraw.SetFlags(B2DebugDraw.e_shapeBit | B2DebugDraw.e_jointBit);
            world.SetDebugDraw(debugDraw);
            return world;
        },

        createGround: function (world) {

            var bodyDef = new B2BodyDef();

            //create ground
            bodyDef.type = B2Body.b2_staticBody;
            this.fixDef.shape = new B2PolygonShape();

            this.fixDef.shape.SetAsBox(30, 0.1); // Top bar
            bodyDef.position.Set(30, 11);
            world.CreateBody(bodyDef).CreateFixture(this.fixDef);


        },

        createBox: function(world, x, y, width, height, isStatic) {
            var bodyDef = new B2BodyDef();

            //create some objects
            bodyDef.type = isStatic ? B2Body.b2_staticBody : B2Body.b2_dynamicBody;
            this.fixDef.shape = new B2PolygonShape();
            this.fixDef.shape.SetAsBox(
                width / 2,
                height / 2
            );
            bodyDef.position.x = x + (width / 2);
            bodyDef.position.y = y + (height / 2);
            world.CreateBody(bodyDef).CreateFixture(this.fixDef);
        },

        createCircle: function(world, x, y, radius, isStatic) {
            var bodyDef = new B2BodyDef();

            //create some objects
            bodyDef.type = isStatic ? B2Body.b2_staticBody : B2Body.b2_dynamicBody;
            this.fixDef.shape = new B2CircleShape(radius / 2);
            bodyDef.position.x = x + (radius / 2);
            bodyDef.position.y = y + (radius / 2);
            world.CreateBody(bodyDef).CreateFixture(this.fixDef);
        },

        createTest: function (world) {
            var bodyDef = new B2BodyDef();

            //create some objects
            bodyDef.type = B2Body.b2_dynamicBody;
            for(var i = 0; i < 20; ++i) {
               if(Math.random() > 0.5) {
                  this.fixDef.shape = new B2PolygonShape();
                  this.fixDef.shape.SetAsBox(
                        Math.random() + 0.1, //half width
                        Math.random() + 0.1 //half height
                  );
                } else {
                    this.fixDef.shape = new B2CircleShape(
                        Math.random() + 0.1 //radius
                    );
               }
               bodyDef.position.x = Math.random() * 25+ 1;
               bodyDef.position.y = Math.random() * 4 + 1;
               world.CreateBody(bodyDef).CreateFixture(this.fixDef);
            }
        }
    };

}(window.Box2D));
