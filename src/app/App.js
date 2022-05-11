class App{
    constructor(){
        this.initState();
    }

    //initialize our application
    initState(){
        console.log("Initializing application");
    
        //get current canvas 
        const canvas = document.querySelector("#WebGlApp");
    
        //init webgl
        var gl = canvas.getContext("webgl2");
    
        // Only continue if WebGL2 is available and working
        if (gl === null) {
            alert("ERROR INITIALIZING WEBGL!");
        }

        //the state of this application
        this.state = {
            gl: gl,
            canvas: canvas,
            time: 0,
            deltaTime: 0,
            camera: null,
            objects: {
                exampleCube: null,
                light: null,
            },
            shaders: {
                mainShader: null,
            },
        };
        console.log("Initialization finished\n");
    }

    //runs once on app startup
    //you can add new objects to render here as well and perform 
    //any intitial updates 
    onStart(){
        console.log("Starting application\n");

        //initialize our state objects
        this.state.shaders.mainShader = new MainShader(this.state.gl);
    
        //add our camera to our scene and give it a location, front and up vector
        this.state.camera = new Camera(vec3.fromValues(-25 ,30, -20), vec3.fromValues(0.0, 0.0, -1.0), vec3.fromValues(0.0, 1.0, 0.0));

        //add our example cubes
        var maxCubes = 5;
        this.state.objects.exampleCube = new ExampleCube(this.state.gl, this.state.shaders.mainShader, maxCubes);

        //add example cube instances
        var pos = vec3.fromValues(0, 0, 0)
        for(var i = 0; i < maxCubes; i++){
            this.state.objects.exampleCube.addInstance({
                //the type of an instance specifies how it should be treated
                type: "exampleCube",
                //colour of the instance
                colour: vec3.fromValues(randomFloat(0.0, 1.0), randomFloat(0.0, 1.0), randomFloat(0.0, 1.0)),
                //rotation matrix for the instance, when rotating this is what is updated
                rotation: mat4.create(),
                //initial rotation angle of the object, if you dont want the object to rotate make this 0
                theta: degToRad(45),
                //position of the object in world space
                position: vec3.fromValues(pos[0], pos[1], pos[2]),
                //speed of object
                speed: 2.0,
                //size of the object
                scale: vec3.fromValues(1, 1, 1),
                //what do we want to scale by, used later
                scaleFactor: 1.0,
            });
            pos[2] -= 10;
        }

        //add a new scene light
        this.state.objects.light = new Light(
            //light label
            "SceneLight",
            //position
            vec3.fromValues(0.0, 10.0, 0.0),
            //colour
            vec3.fromValues(1, 1, 1),
            //strength
            2.5, 
            //shininess
            5.0,
            //current webgl context
            this.state.gl, 
            //shader you want the light to use
            this.state.shaders.mainShader
        );
       

    }

    //runs every frame, updating objects and moving around 
    //goes in here
    onUpdate(deltaTime){
        //update render time
        this.state.deltaTime = deltaTime;
        this.state.time += this.state.deltaTime;

        //move camera and get the view matrix
        this.state.camera.move(deltaTime);
        var view = this.state.camera.viewMatrix();
 
        //setup projection matrix
        var projectionMatrix = mat4.create();
        mat4.perspective(
            projectionMatrix, 
            degToRad(45.0),
            this.state.canvas.clientWidth / this.state.canvas.clientHeight,
            0.1, 
            100.0
        );
        
        //give our cubes some new transformation data
        var numCubes = this.state.objects.exampleCube.instances.length;
        for(var i = 0; i < numCubes; i++){
            //rotate
            this.state.objects.exampleCube.rotate(vec3.fromValues(1, 1, 1), 15.0 * deltaTime * i, i);

            //move 
            var cube = this.state.objects.exampleCube.instances[i];
            this.state.objects.exampleCube.translate(vec3.fromValues(cube.speed * deltaTime * i, cube.speed * deltaTime * i, 0), i);
            if(cube.position[0] >= 10.0){
                cube.speed *= -1;
            }
            if(cube.position[0] <= -10){
                cube.speed *= -1
            }

            //scale
            //uniform scaling so i only need to check one value of the scale vector
            if(cube.scale[0] >= 5.0){
                cube.scaleFactor = -deltaTime;
            }
            if(cube.scale[0] <= 1.0){
                cube.scaleFactor = deltaTime;
            }
            //the axis represents how we want to scale, for uniform scaling use 1 for all axis
            this.state.objects.exampleCube.scale(vec3.fromValues(1, 1, 1), 1 + cube.scaleFactor, i);
        }

        //update our example cubes with whatever new transforms we did above
        //this method will update our instances with whatever action is performed above
        this.state.objects.exampleCube.updateInstances(projectionMatrix, view);

        //update scene lights
        this.state.objects.light.update(this.state.camera.position);
    }

    //render calls go here
    onRender(){
        //render our cubes
        this.state.objects.exampleCube.renderInstances();
    }

    //start of the frame, things that happen before the 
    //frame is updated go here
    startFrame(){
        //background colour
        this.state.gl.clearColor(0.5, 0.5, 0.5, 1.0);
        //clear everything
        this.state.gl.clearDepth(1.0);
        //enable depth testing
        this.state.gl.enable(this.state.gl.DEPTH_TEST);
        //clear the depth and colour buffer
        this.state.gl.clear(this.state.gl.COLOR_BUFFER_BIT | this.state.gl.DEPTH_BUFFER_BIT);
        //render near things first
        this.state.gl.depthFunc(this.state.gl.LEQUAL);
    }

    //end of the frame, can add post processing here
    endFrame(){

    }

}
