class App{
    constructor(){
        this.initState();
    }

    /**
     * Inits the state of the current webgl app such as getting 
     * the html canvas and making sure webl will work
     *
     * @param {none} 
     * @return {none}
     */
    initState(){
        console.log("Initializing application");
    
        //get current canvas 
        this.canvas = document.querySelector("#WebGlApp");
    
        //init webgl
        this.gl = this.canvas.getContext("webgl2");
    
        // Only continue if WebGL2 is available and working
        if (this.gl === null) {
            alert("ERROR INITIALIZING WEBGL!");
        }

        console.log("Initialization finished\n");
    }
 

    /**
     * Runs once on app start, this method is designed to perform actions
     * only required once such as adding new shaders, cameras, starting objects,
     * lights etc
     *
     * @param {none} 
     * @return {none}
     */
    onStart(){
        console.log("Starting application\n");

        //initialize our state objects
        this.mainShader = new MainShader(this.gl);
    
        //add our camera to our scene and give it a location, front and up vector
        this.camera = new Camera(vec3.fromValues(-25 ,30, -20), vec3.fromValues(0.0, 0.0, -1.0), vec3.fromValues(0.0, 1.0, 0.0));

        //create our example cube
        this.exampleCube = new ExampleCube(this.gl, this.mainShader);

        //add example cube instances
        var pos = vec3.fromValues(0, 0, 0)
        for(var i = 0; i < 5; i++){
            this.exampleCube.addInstance({
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
        this.light = new Light(
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
            this.gl, 
            //shader you want the light to use
            this.mainShader
        );
    }

    /**
     * Prepares the frame for rendering, here we set the background colour,
     * set any universal parameters for rendering and clear the desired buffers
     *
     * @param {none} 
     * @return {none}
     */
    startFrame(){
        //background colour
        this.gl.clearColor(0.5, 0.5, 0.5, 1.0);
        //clear everything
        this.gl.clearDepth(1.0);
        //enable depth testing
        this.gl.enable(this.gl.DEPTH_TEST);
        //clear the depth and colour buffer
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        //render near things first
        this.gl.depthFunc(this.gl.LEQUAL);
    }

    /**
     * Runs every frame, moving the camera updating object instances and uniforms, 
     * dynamically changing rendering settings happen here
     *
     * @param {float} deltaTime the frame rate
     * @return {none}
     */
    update(deltaTime){
        //update render time
        this.deltaTime = deltaTime;
        this.time += this.deltaTime;

        //move camera and get the view matrix
        this.camera.move(this.deltaTime);
        var view = this.camera.viewMatrix();
 
        //setup projection matrix
        var projectionMatrix = mat4.create();
        mat4.perspective(
            projectionMatrix, 
            degToRad(45.0),
            this.canvas.clientWidth / this.canvas.clientHeight,
            0.1, 
            100.0
        );
        
        //give our cubes some new transformation data
        var numCubes = this.exampleCube.instances.length;
        for(var i = 0; i < numCubes; i++){
            var cube = this.exampleCube.instances[i];
            if(cube.type === "exampleCube"){
                //rotate
                this.exampleCube.rotate(vec3.fromValues(1, 1, 1), 15.0 * deltaTime * i, i);

                //move 
                var cube = this.exampleCube.instances[i];
                this.exampleCube.translate(vec3.fromValues(cube.speed * deltaTime * i, cube.speed * deltaTime * i, 0), i);
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
                this.exampleCube.scale(vec3.fromValues(1, 1, 1), 1 + cube.scaleFactor, i);
            }
        }

        //update our example cubes with whatever new transforms we did above
        //this method will update our instances with whatever action is performed above
        this.exampleCube.updateInstances(projectionMatrix, view);

        //update scene lights
        this.light.update(this.camera.position);
    }

    /**
    * Renders objects to the canvas, all render calls will 
    * happen here
    *
    * @param {none} 
    * @return {none}
    */
    render(){
        //render our cubes
        this.exampleCube.renderInstances();
    }

    /**
     * End of the current frame, can add post processing here
     *
     * @param {none} 
     * @return {none}
     */
    endFrame(){

    }

}
