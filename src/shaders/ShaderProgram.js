class ShaderProgram{
    constructor(gl){
        this.gl = gl;
    }
    /**
    * loads, compiles and links vertex shader and fragment shader
    * and checks for errors
    *
    * @param {string} vertexSource source code of vertex shader
    * @param {string} fragmentSource source code of fragment shader
    * @return {none}
    */
    init(vertexSource, fragmentSource){
        //load the vs and fs 
        this.vertexShader = this.loadShader(this.gl.VERTEX_SHADER, vertexSource);
        this.fragmentShader = this.loadShader(this.gl.FRAGMENT_SHADER, fragmentSource);
        
        //create the shader program and attach the shaders to it
        this.program = this.gl.createProgram();
        this.gl.attachShader(this.program, this.vertexShader);
        this.gl.attachShader(this.program, this.fragmentShader);
        this.gl.linkProgram(this.program);

        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            alert('Unable to initialize the shader program: ' + this.gl.getProgramInfoLog(this.program));
            return null;
        }    
    }

    /**
    * sets this objects uniforms and buffer data
    *
    * @param {number} type type of shader to be loaded
    * @param {string} source source code for shader to load
    * @return {number} id of shader loader
    */
    loadShader(type, source){
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            alert('An error occurred compiling the shaders: ' + this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    /**
    * makes sure that all atributes and uniforms are set and found
    * correctly
    *
    * @param {none} 
    * @return {none} 
    */
    checkInfo(){
        for(var attrib in this.info.attribs){
            if(this.info.attribs[attrib] === -1){
                console.log("ERROR: ATTRIB " + attrib + " NOT FOUND");
            }
        }

        for(var uniform in this.info.uniforms){
            if(this.info.uniforms[uniform] === -1){
                console.log("ERROR: UNIFORM " + uniform + " NOT FOUND");
            }
        }
    }

    /**
    * updates a 4x4 matrix uniform
    * 
    *
    * @param {number} location uniform location
    * @param {mat4} uniform matrix to update uniform
    * @return {none} 
    */
    setMat4(location, uniform){
        this.gl.uniformMatrix4fv(location, false, uniform);
    }

    /**
    * updates a vec3 uniform
    * 
    *
    * @param {number} location uniform location
    * @param {vec3} uniform vec3 to update uniform
    * @return {none} 
    */
    setVec3(location, uniform){
        this.gl.uniform3fv(location, uniform);
    }

    /**
    * updates a vec2 uniform
    * 
    *
    * @param {number} location uniform location
    * @param {vec2} uniform vec2 to update uniform
    * @return {none} 
    */
    setVec2(location, uniform){
        this.gl.uniform2fv(location, uniform);
    }

    /**
    * updates a float uniform
    * 
    *
    * @param {number} location uniform location
    * @param {float} uniform float to update uniform
    * @return {none} 
    */
    setFloat(location, uniform){
        this.gl.uniform1f(location, uniform);
    }

    /**
    * updates a int uniform
    * 
    *
    * @param {number} location uniform location
    * @param {int} uniform int to update uniform
    * @return {none} 
    */
    setInt(location, uniform){
        this.gl.uniform1i(location, uniform);
    }

}