(function (Box2D) {

    "use strict";

    var b2Vec2 = Box2D.Common.Math.b2Vec2,
        b2AABB = Box2D.Collision.b2AABB,
        b2BodyDef = Box2D.Dynamics.b2BodyDef,
        b2Body = Box2D.Dynamics.b2Body,
        b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
        b2Fixture = Box2D.Dynamics.b2Fixture,
        b2World = Box2D.Dynamics.b2World,
        b2MassData = Box2D.Collision.Shapes.b2MassData,
        b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
        b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
        b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
        b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef;

    window.Physics = {

        createFixture: function () {

        },

        createWorld: function () {
            var world = new b2World(
                new b2Vec2(0, 10),    //gravity
                true                 //allow sleep
            );

            var fixDef = this.fixDef = new b2FixtureDef();
            fixDef.density = 1.0;
            fixDef.friction = 0.5;
            fixDef.restitution = 0.2;

            // Ground
            this.createBox(world, 0, 11, 40, 0.1, true);

            this.createTest(world);
            // walls
            this.createBox(world, 0, 0, 0.1, 11, true);
            this.createBox(world, 40 - 0.1, 0, 0.1, 11, true);

            //setup debug draw
            var debugDraw = new b2DebugDraw();
            debugDraw.SetSprite(document.getElementById("board").getContext("2d"));
            debugDraw.SetDrawScale(20.0);
            debugDraw.SetFillAlpha(0.5);
            debugDraw.SetLineThickness(1.0);
            debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
            world.SetDebugDraw(debugDraw);
            return world;
        },

        createGround: function (world) {

            var bodyDef = new b2BodyDef();

            //create ground
            bodyDef.type = b2Body.b2_staticBody;
            this.fixDef.shape = new b2PolygonShape();

            this.fixDef.shape.SetAsBox(30, 0.1); // Top bar
            bodyDef.position.Set(30, 11);
            world.CreateBody(bodyDef).CreateFixture(this.fixDef);


        },

        createBox: function(world, x, y, width, height, isStatic) {
            var bodyDef = new b2BodyDef();

            //create some objects
            bodyDef.type = isStatic ? b2Body.b2_staticBody : b2Body.b2_dynamicBody;
            this.fixDef.shape = new b2PolygonShape();
            this.fixDef.shape.SetAsBox(
                width / 2,
                height / 2
            );
            bodyDef.position.x = x + (width / 2);
            bodyDef.position.y = y + (height / 2);
            world.CreateBody(bodyDef).CreateFixture(this.fixDef);
        },

        createTest: function (world) {
            var bodyDef = new b2BodyDef();

            //create some objects
            bodyDef.type = b2Body.b2_dynamicBody;
            for(var i = 0; i < 10; ++i) {
               if(Math.random() > 0.5) {
                  this.fixDef.shape = new b2PolygonShape;
                  this.fixDef.shape.SetAsBox(
                        Math.random() + 0.1 //half width
                     ,  Math.random() + 0.1 //half height
                  );
               } else {
                  this.fixDef.shape = new b2CircleShape(
                     Math.random() + 0.1 //radius
                  );
               }
               bodyDef.position.x = Math.random() * 10 + 1;
               bodyDef.position.y = Math.random() * 10 + 1;
               world.CreateBody(bodyDef).CreateFixture(this.fixDef);
            }
        }
    };

}(window.Box2D));
