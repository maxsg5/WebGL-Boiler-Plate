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
        this.state.camera = new Camera(vec3.fromValues(-18.5, 35.0, -2.5), vec3.fromValues(0.0, 0.0, -1.0), vec3.fromValues(0.0, 1.0, 0.0));

        //add our example cubes
        var maxCubes = 5;
        this.state.objects.exampleCube = new ExampleCube(this.state.gl, this.state.shaders.mainShader, maxCubes);

        //add example cube instances
        var pos = vec3.fromValues(0, 0, 0)
        for(var i = 0; i < maxCubes; i++){
            this.state.objects.exampleCube.addInstance({
                type: "exampleCube",
                colour: vec3.fromValues(randomFloat(0.0, 1.0), randomFloat(0.0, 1.0), randomFloat(0.0, 1.0)),
                rotation: mat4.create(),
                position: vec3.fromValues(pos[0], pos[1], pos[2]),
                scale: vec3.fromValues(i + 0.5, i + 0.5, i + 0.5)
            });
            pos[2] += 10;
        }

        //add a new scene light
        this.state.objects.light = new Light(
            "SceneLight",
            vec3.fromValues(0.0, 10.0, 0.0),
            vec3.fromValues(1, 1, 1),
            2.5, 
            5.0, 
            this.state.gl, 
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

        //update our example cubes
        this.state.objects.exampleCube.updateInstances(deltaTime, projectionMatrix, view);

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
