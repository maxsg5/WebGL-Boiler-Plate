//vs shader source code
const vsSource = 
`#version 300 es
in vec3 aVertexPosition;
in vec3 aColour;
in mat4 aTransform;


uniform mat4 uProjection;
uniform mat4 uView;
uniform vec3 uCamPos;

out vec3 oColour;

void main() {
  gl_Position = uProjection * uView * aTransform * vec4(aVertexPosition, 1.0);
  oColour = aColour;
}
`;

//fs source code
const fsSource = 
`#version 300 es
precision highp float;

in vec3 oColour;

out vec4 fragColour;

void main() {
    fragColour = vec4(oColour, 1.0);
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
                vertexColours: this.gl.getAttribLocation(this.program, 'aColour')
            },
            //set uniforms
            uniforms:{
                projection: this.gl.getUniformLocation(this.program, "uProjection"),
                view: this.gl.getUniformLocation(this.program, "uView"),
            },
        };
    }
}