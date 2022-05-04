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
        this.state.camera = new Camera(vec3.fromValues(-25.5, 39.5, 26.0), vec3.fromValues(0.7, -0.7, 0.0), vec3.fromValues(0.0, 1.0, 0.0));
  


    }

    //runs every frame, updating objects and moving around 
    //goes in here
    onUpdate(deltaTime){
        //update render time
        this.state.deltaTime = deltaTime;
        this.state.time += this.state.deltaTime;

      

        //move camera and get the view matrix
        this.state.camera.move(deltaTime);
        //console.log(this.state.camera.position);
        let viewMatrix = mat4.create();
        let front = vec3.create();
        vec3.add(front, this.state.camera.position, this.state.camera.front);
        mat4.lookAt(
            viewMatrix,
            this.state.camera.position,
            front,
            this.state.camera.up,
        );

        //setup projection matrix
        let projectionMatrix = mat4.create();
        mat4.perspective(
            projectionMatrix, 
            degToRad(45.0),
            this.state.canvas.clientWidth / this.state.canvas.clientHeight,
            0.1, 
            100.0
        );

       //use our shader program
       this.state.gl.useProgram(this.state.shaders.mainShader.program);
       //update view and projection unifomrs
       this.state.shaders.mainShader.setMat4(this.state.shaders.mainShader.info.uniformLocations.view, viewMatrix);
       this.state.shaders.mainShader.setMat4(this.state.shaders.mainShader.info.uniformLocations.projection, projectionMatrix);


    }

    //render calls go here
    onRender(){
       
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
