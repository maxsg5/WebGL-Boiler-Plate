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

        this.vertexNormals = [
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,

            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,
            0.0, 0.0, -1.0,

            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,

            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,
            0.0, -1.0, 0.0,
            

            -1.0, 0.0, 0.0, 
            -1.0, 0.0, 0.0, 
            -1.0, 0.0, 0.0, 
            -1.0, 0.0, 0.0, 

            1.0, 0.0, 0.0, 
            1.0, 0.0, 0.0, 
            1.0, 0.0, 0.0, 
            1.0, 0.0, 0.0, 

        ];

         this.indices = [
            0,  1,  2,      0,  2,  3,
            4,  5,  6,      4,  6,  7,   
            8,  9,  10,     8,  10, 11,  
            12, 13, 14,     12, 14, 15, 
            16, 17, 18,     17, 18, 19,  
            20, 21, 22,     21, 22, 23
         ];
        
        this.initBuffers(this.vertexPositions, this.vertexNormals, this.indices);
    }

    //updates each instances transforms
    updateInstances(projection, view){

        //update uniforms
        this.projection = projection;
        this.view = view;

        //update each instance and add its required data to the buffers for updating
        var transforms = [];
        var normalMats = [];
        var colours = [];
        this.instances.forEach( (instance) => {
            var transform = mat4.create();
            var normalMat = mat4.create();
            var centroid = this.getCentroid();

            //move object to desired position
            mat4.translate(transform, transform, instance.position);
            //move object to centroid
            mat4.translate(transform, transform, centroid);
            //perform rotation
            mat4.mul(transform, transform, instance.rotation);
            //move object back from centroid
            vec3.negate(centroid, centroid);
            mat4.translate(transform, transform, centroid);
            //scale the object
            mat4.scale(transform, transform, instance.scale);

            //update normal matrix
            mat4.transpose(normalMat, transform);
            mat4.invert(normalMat, normalMat);

            //add buffer to instance buffers
            transforms.push(transform);
            normalMats.push(normalMat);
            colours.push(instance.colour);
        })
        //update and flatten each instance buffer
        this.instanceBufferData.transform = flatten(transforms);
        this.instanceBufferData.colour = flatten(colours);
        this.instanceBufferData.normal = flatten(normalMats);
    }

    renderInstances(){
        //use our shader program
        this.gl.useProgram(this.shader.program);

        ///bind our vao for rendering
        this.gl.bindVertexArray(this.vao);

        //update uniforms
        this.shader.setMat4(this.shader.info.uniforms.view, this.view);
        this.shader.setMat4(this.shader.info.uniforms.projection, this.projection);

        //update our transform buffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.transformBuffer);
        this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, this.instanceBufferData.transform);

        //update our colour buffers
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colourBuffer);
        this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, this.instanceBufferData.colour);

        //update normal matrix buffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalMatBuffer);
        this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, this.instanceBufferData.normal);

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