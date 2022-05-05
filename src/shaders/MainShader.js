//vs shader source code
const vsSource = 
`#version 300 es
in vec3 aVertexPosition;
in mat4 aTransform;


uniform mat4 uProjection;
uniform mat4 uView;
uniform vec3 uCamPos;

void main() {
  gl_Position = uProjection * uView * aTransform * vec4(aVertexPosition, 1.0);
}
`;

//fs source code
const fsSource = 
`#version 300 es
precision highp float;

uniform vec3 uDiffuseVal;

out vec4 oColour;

void main() {

    oColour = vec4(uDiffuseVal, 1.0);
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
            attribs:{
                transformMatrix: this.gl.getAttribLocation(this.program, "aTransform"),
                vertexPositions: this.gl.getAttribLocation(this.program, "aVertexPosition"),
            },
            //set uniforms
            uniforms:{
                projection: this.gl.getUniformLocation(this.program, "uProjection"),
                view: this.gl.getUniformLocation(this.program, "uView"),
                diffuse : this.gl.getUniformLocation(this.program, "uDiffuseVal"), 
            },
        };
    }
}