class ShaderProgram{
    constructor(gl){
        this.gl = gl;
    }
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

    checkInfo(attribs, uniforms){
        for(var attrib in attribs){
            if(attribs[attrib] === -1){
                console.log("ERROR: ATTRIB " + attrib + " NOT FOUND");
            }
        }

        for(var uniform in uniforms){
            if(uniforms[uniform] === -1){
                console.log("ERROR: UNIFORM " + uniform + " NOT FOUND");
            }
        }
    }

    setMat4(location, uniform){
        this.gl.uniformMatrix4fv(location, false, uniform);
    }

    setVec3(location, uniform){
        this.gl.uniform3fv(location, uniform);
    }

    setVec2(location, uniform){
        this.gl.uniform2fv(location, uniform);
    }

    setFloat(location, uniform){
        this.gl.uniform1f(location, uniform);
    }

    setInt(location, uniform){
        this.gl.uniform1i(location, uniform);
    }

}