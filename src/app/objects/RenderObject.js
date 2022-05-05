class RenderObject{
    constructor(gl, shader, colour, instances){
        //context
        this.gl = gl;
        //shader program
        this.shader = shader;
        //ambient, diffuse, specular
        this.colour = colour;
        //how many we want to render
        this.instances = instances;

        //instance positions, rotations, scales
        this.positions = [];
        this.rotations = [];
        this.scales = [];

        //transform matrix per instance
        this.transforms = [];
    }

    initBuffers(vertexPositions, indices){
        //create and bind the current vao
        this.vao = this.gl.createVertexArray();
        this.gl.bindVertexArray(this.vao);

        //create our position buffer
        var vertexPositionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexPositionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertexPositions), this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(
            this.shader.info.attribs.vertexPositions, 
            3, 
            this.gl.FLOAT, 
            false, 
            0, 
            0
        );
        this.gl.enableVertexAttribArray(this.shader.info.attribs.vertexPositions);
        
        //buffer for indexed drawing
        let ibo = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, ibo);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW)
        
        //add new position, rotationm, scale and transform per instance
        for(var i = 0; i < this.instances; i++){
            this.positions.push(vec3.create());
            this.rotations.push(mat4.create());
            this.scales.push(vec3.fromValues(1, 1, 1));
            this.transforms.push(mat4.create());
        }

        //convert our array of matricies into one contiguous array of bytes
        this.transformData = new Float32Array(this.transforms.map(transform => [...transform]).flat());

        //make these attributes incase we need to modify this buffer data later
        this.transformBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.transformBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.transformData, this.gl.DYNAMIC_DRAW);
        
        //each matrix is 4 attributes
        for(var i = 0; i < 4; i++){
            var location = this.shader.info.attribs.transformMatrix + i;
            this.gl.enableVertexAttribArray(location);
            //offset per row
            var offset = i * 16;
            this.gl.vertexAttribPointer(
                location, 
                4, 
                this.gl.FLOAT, 
                false, 
                4 * 16, 
                offset
            );
            //tells webgl this attribute is per instance
            this.gl.vertexAttribDivisor(location, 1);
        }

        //good practice to unbind the vao once done
        this.gl.bindVertexArray(null);

    }

}