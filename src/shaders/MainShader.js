//vs shader source code
const vsSource = 
`#version 300 es
in vec3 aVertexPosition;

uniform mat4 uProjection;
uniform mat4 uTransform;
uniform mat4 uView;

void main() {
  gl_Position = uProjection * uView * uTransform * vec4(aVertexPosition, 1.0);
}
`;

//fs source code
const fsSource = 
`#version 300 es
precision highp float;

out vec4 oColour;

void main() {
    oColour = vec4(1.0, 0.0, 0.0, 1.0);
  }
`;

class MainShader extends ShaderProgram{
    constructor(gl){
        super(gl);

        this.init(vsSource, fsSource);

        //bundle the info about the shader program into this variable
        this.info = {
            program: this.program,
            //set any attrib locations here
            attribLocations:{
                vertexPosition: this.gl.getAttribLocation(this.program, "aVertexPosition"),
            },
            //set uniforms
            uniformLocations:{
                projection: this.gl.getUniformLocation(this.program, "uProjection"),
                transform: this.gl.getUniformLocation(this.program, "uTransform"),
                view: this.gl.getUniformLocation(this.program, "uView"),
            },
        };
    }
}