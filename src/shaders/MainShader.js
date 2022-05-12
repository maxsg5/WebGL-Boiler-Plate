//vs shader source code
const vsSource = 
`#version 300 es
in vec3 aVertexPosition;
in vec3 aNormal;
in vec3 aColour;
in mat4 aTransform;
in mat4 aNormalMat;

uniform mat4 uProjection;
uniform mat4 uView;
uniform vec3 uCamPos;

out vec3 oColour;
out vec3 oNormal;
out vec3 oCamPos;
out vec3 oFragPos;

void main() {
  gl_Position = uProjection * uView * aTransform * vec4(aVertexPosition, 1.0);
  oFragPos = (aTransform * vec4(aVertexPosition, 1.0)).xyz;
  oColour = aColour;
  oNormal = (aNormalMat * vec4(aNormal, 0.0)).xyz;
  oCamPos = uCamPos;
}
`;

//fs source code
const fsSource = 
`#version 300 es
precision highp float;

in vec3 oColour;
in vec3 oNormal;
in vec3 oFragPos;
in vec3 oCamPos;

uniform vec3 uLightColour;
uniform vec3 uLightPos;
uniform float uLightStr;
uniform float uShine;

out vec4 fragColour;

void main() {
    float ambientStrength = 0.1;
    vec3 ambient = ambientStrength * uLightColour * uLightStr;

    vec3 normal = normalize(oNormal);
    vec3 lightDir = normalize(uLightPos - oFragPos);

    float diff = max(dot(normal, lightDir), 0.0);
    vec3 diffuse = diff * uLightColour;

    vec3 viewDir = normalize(oCamPos - oFragPos);
    vec3 halfVec = normalize(lightDir + viewDir);
    float spec = pow(max(dot(normal, halfVec), 0.0), uShine);
    vec3 specular = spec * uLightColour;

    fragColour = vec4((ambient + diffuse + specular) * oColour, 1.0);
  }
`;

class MainShader extends ShaderProgram{
    constructor(gl){
        super(gl);

        //compiles, links and creates the shader program from the sources above
        this.init(vsSource, fsSource);

        //bundle the info about the shader program into this variable
        this.info = {
            program: this.program,
            //set any attrib locations here
            attribs:{
                transformMatrix: this.gl.getAttribLocation(this.program, "aTransform"),
                normalMatrix: this.gl.getAttribLocation(this.program, "aNormalMat"),
                vertexPositions: this.gl.getAttribLocation(this.program, "aVertexPosition"),
                vertexColours: this.gl.getAttribLocation(this.program, 'aColour'),
                vertexNormals: this.gl.getAttribLocation(this.program, "aNormal")
            },
            //set uniforms
            uniforms:{
                projection: this.gl.getUniformLocation(this.program, "uProjection"),
                view: this.gl.getUniformLocation(this.program, "uView"),
                cameraPos: this.gl.getUniformLocation(this.program, "uCameraPos"),
                lightColour: this.gl.getUniformLocation(this.program, "uLightColour"),
                lightPos: this.gl.getUniformLocation(this.program, "uLightPos"),
                lightStr: this.gl.getUniformLocation(this.program, "uLightStr"),
                lightShine: this.gl.getUniformLocation(this.program, "uShine"),
            },
        };

        //validates info of shader program
        this.checkInfo();
    }
}