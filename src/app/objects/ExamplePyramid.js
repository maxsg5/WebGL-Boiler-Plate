class ExamplePyramid extends RenderObject{
    constructor(gl, shader){
        super(gl, shader);
        
        //create the vertex positions of a pyramid
        this.vertexPositions = [
            // Front face
            0.0,  1.0,  0.0,
            -1.0, -1.0,  1.0,
            1.0, -1.0,  1.0,
            // Right face
            0.0,  1.0,  0.0,
            1.0, -1.0,  1.0,
            1.0, -1.0, -1.0,
            // Back face
            0.0,  1.0,  0.0,
            1.0, -1.0, -1.0,
            -1.0, -1.0, -1.0,
            // Left face
            0.0,  1.0,  0.0,
            -1.0, -1.0, -1.0,
            -1.0, -1.0,  1.0

        ];

        //create the vertex normals of a pyramid
        this.vertexNormals = [
            // Front face
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,
            // Right face
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,
            // Back face
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,
            // Left face
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0
        ];

        //create the vertex indices of a pyramid
        this.indices = [
            0, 1, 2,     3, 4, 5,   // front
            6, 7, 8,     9, 10, 11,  // right
            12, 13, 14,  15, 16, 17, // back
            18, 19, 20,  21, 22, 23  // left
        ];

        this.initBuffers(this.vertexPositions, this.vertexNormals, this.indices);
    }

    updateInstances(projection,view){
        
        //set uniforms
        this.projection = projection;
        this.view = view;

        //update our buffer data for dynamic rendering
        this.updateBufferData();
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
            this.gl.TRIANGLES, //mode
            this.indices.length, //count
            this.gl.UNSIGNED_SHORT, //type
            0, //offset
            this.instances.length, //instance count
        );
        //unbind our vao once done
        this.gl.bindVertexArray(null);
    }   
}
