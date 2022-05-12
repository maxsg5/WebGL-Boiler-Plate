class Light{
    constructor(type, position, colour, strength, shininess, gl, shader){
        this.type = type;
        this.position = position;
        this.colour = colour;
        this.strength = strength,
        this.shininess = shininess;
        this.gl = gl;
        this.shader = shader;
    }

    /**
    * updates light uniforms
    *
    * @param {vec3} cameraPos current camera position
    * @return {none}
    */
    update(cameraPos){
        this.cameraPos = cameraPos;

        this.gl.useProgram(this.shader.program);
        this.shader.setVec3(this.shader.info.uniforms.lightColour, this.colour);
        this.shader.setVec3(this.shader.info.uniforms.lightPos, this.position);
        this.shader.setVec3(this.shader.info.uniforms.cameraPos, this.cameraPos);
        this.shader.setFloat(this.shader.info.uniforms.lightStr, this.strength);
        this.shader.setFloat(this.shader.info.uniforms.lightShine, this.shininess);
    }
}