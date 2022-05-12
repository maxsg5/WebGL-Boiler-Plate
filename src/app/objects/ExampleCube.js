class ExampleCube extends RenderObject{
    constructor(gl, shader){
        super(gl, shader);

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

    /**
    * sets this objects uniforms and buffer data
    *
    * @param {mat4} projection projection matrix
    * @param {mat4} view view matrix
    * @return {none}
    */
    updateInstances(projection, view){

        //set uniforms
        this.projection = projection;
        this.view = view;

        //update our buffer data for dynamic rendering
        this.updateBufferData();
    }

    /**
    * updates this objects uniforms and renders all instances
    *
    * @param {none}
    * @return {none}
    */

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