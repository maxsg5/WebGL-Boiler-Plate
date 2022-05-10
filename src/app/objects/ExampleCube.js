class ExampleCube extends RenderObject{
    constructor(gl, shader, max){
        super(gl, shader, max);

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

        //update each instance and add its required data to the buffers for updating
        var transforms = [];
        var colours = [];
        this.instances.forEach( (instance, i) => {
            var transform = mat4.create();

            //perform instance transforms
            mat4.translate(transform, transform, instance.position);
            mat4.rotate(instance.rotation, instance.rotation, degToRad(45) * i * deltaTime, vec3.fromValues(1, 1, 1));
            mat4.mul(transform, transform, instance.rotation);
            mat4.scale(transform, transform, instance.scale);

            //add buffer to instance buffers
            transforms.push(transform);
            colours.push(instance.colour);
        })
        //update and flatten each instance buffer
        this.instanceBufferData.transform = flatten(transforms);
        this.instanceBufferData.colour = flatten(colours);
    }

    renderInstances(){
        //use our shader program
        this.gl.useProgram(this.shader.program);

        ///bind our vao for rendering
        this.gl.bindVertexArray(this.vao);

        //update our transform buffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.transformBuffer);
        this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, this.instanceBufferData.transform);

        //update our colour buffers
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colourBuffer);
        this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, this.instanceBufferData.colour);

        //instanced rendering
        this.gl.drawElementsInstanced(
            this.gl.TRIANGLES, 
            this.indices.length, 
            this.gl.UNSIGNED_SHORT, 
            0,
            this.instances.length,
        );
        //unbind our vao once done
        this.gl.bindVertexArray(null);
    }
}