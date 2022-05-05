class ExampleCube extends RenderObject{
    constructor(gl, shader, colour, instances){
        super(gl, shader, colour, instances);

        this.vertexPositions = [
            0.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            1.0, 1.0, 0.0,
            1.0, 0.0, 0.0,

            0.0, 0.0, 1.0,
            0.0, 1.0, 1.0,
            1.0, 1.0, 1.0,
            1.0, 0.0, 1.0,

            0.0, 1.0, 1.0,
            0.0, 1.0, 0.0,
            1.0, 1.0, 0.0,
            1.0, 1.0, 1.0,

            0.0, 0.0, 1.0,
            1.0, 0.0, 1.0,
            1.0, 0.0, 0.0,
            0.0, 0.0, 0.0,

            1.0, 0.0, 1.0,
            1.0, 0.0, 0.0,
            1.0, 1.0, 1.0,
            1.0, 1.0, 0.0,

            0.0, 0.0, 1.0,
            0.0, 0.0, 0.0,
            0.0, 1.0, 1.0,
            0.0 ,1.0, 0.0
        ];

         this.indices = [
            0,  1,  2,      0,  2,  3,
            4,  5,  6,      4,  6,  7,   
            8,  9,  10,     8,  10, 11,  
            12, 13, 14,     12, 14, 15, 
            16, 17, 18,     17, 18, 19,  
            20, 21, 22,     21, 22, 23
         ];
        
        this.initBuffers(this.vertexPositions, this.indices);
    }

    //if objects need to be updated each frame, do it here
    updateInstances(deltaTime){
        for(var i = 0; i < this.instances; i++){
            this.transforms[i] = mat4.create();

            //perform transformations, note the order
            mat4.translate(this.transforms[i], this.transforms[i], this.positions[i]);
            mat4.rotate(this.rotations[i], this.rotations[i], degToRad(45) * i * deltaTime, vec3.fromValues(1, 1, 1));
            mat4.mul(this.transforms[i], this.transforms[i], this.rotations[i]);
            mat4.scale(this.transforms[i], this.transforms[i], vec3.fromValues(i + 0.5, i + 0.5, i + 0.5));
        }

        //convert our array of matricies and normals into one contiguous array of bytes
        this.transformData = new Float32Array(this.transforms.map(transform => [...transform]).flat());
    }

    render(){
        //use our shader program
        this.gl.useProgram(this.shader.program);

        //update uniforms
        this.shader.setVec3(this.shader.info.uniforms.diffuse, this.colour);

        ///bind our vao for rendering
        this.gl.bindVertexArray(this.vao);

        //update our transform buffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.transformBuffer);
        this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, this.transformData);

        //instanced rendering
        this.gl.drawElementsInstanced(
            this.gl.TRIANGLES, 
            this.indices.length, 
            this.gl.UNSIGNED_SHORT, 
            0,
            this.instances
        );
        //unbind our vao once done
        this.gl.bindVertexArray(null);
    }
}