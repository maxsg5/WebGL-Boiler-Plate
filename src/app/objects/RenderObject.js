class RenderObject{
    constructor(gl, shader){
        //context
        this.gl = gl;
        //shader program
        this.shader = shader;
        //max amount to render
        this.max = 10000;
        //holds all instances
        this.instances = []
        //buffer data for instances
        this.instanceBufferData = {
            transform: [],
            colour: [],
            normal: [],
        };
    }

    /**
    * Sets up the required buffers for the render object in 
    * order for proper rendering. The instanced buffers 
    * are designed to be big enough to hold the max amount of
    * instances
    *
    * @param {array} vertexPositions array of vertex positions
    * @param {array} vertexNormals array of vertex normals
    * @param {array} indices array of vertex indices / triangles
    * @return {none}
    */
    initBuffers(vertexPositions, vertexNormals, indices){
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

        //create our normal buffer
        var vertexNormalBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexNormalBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertexNormals), this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(
            this.shader.info.attribs.vertexNormals,
            3, 
            this.gl.FLOAT, 
            false, 
            0, 
            0
        );
        this.gl.enableVertexAttribArray(this.shader.info.attribs.vertexNormals);
        
        
        //buffer for indexed drawing
        let ibo = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, ibo);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW)

        //make these attributes incase we need to modify this buffer data later
        this.transformBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.transformBuffer);
        //create buffer big enough for max transforms
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(16 * 4 * this.max), this.gl.DYNAMIC_DRAW);
        
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

        //do the normal matrix instanced buffer
        this.normalMatBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalMatBuffer);
        //create bufffer big enough
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(16 * 4 * this.max), this.gl.DYNAMIC_DRAW);
        
        //setup attribs
        for(var i = 0; i < 4; i++){
            var location = this.shader.info.attribs.normalMatrix + i;
            this.gl.enableVertexAttribArray(location);
            var offset = i * 16;
            this.gl.vertexAttribPointer(
                location, 
                4, 
                this.gl.FLOAT, 
                false, 
                4 * 16, 
                offset
            );
            this.gl.vertexAttribDivisor(location, 1);
        }
        
        
        //do our instanced colour buffer
        this.colourBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colourBuffer);
         //create buffer big enough for max colours
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(3 * 4 * this.max), this.gl.DYNAMIC_DRAW);

        this.gl.vertexAttribPointer(
            this.shader.info.attribs.vertexColours, 
            3, 
            this.gl.FLOAT, 
            false, 
            0, 
            0
        );
        this.gl.enableVertexAttribArray(this.shader.info.attribs.vertexColours);
        this.gl.vertexAttribDivisor(this.shader.info.attribs.vertexColours, 1);
        
        //good practice to unbind the vao once done
        this.gl.bindVertexArray(null);
    }

    /**
    * Rotates an instance by a certain angle around the 
    * axis of rotation
    *
    * @param {vec3} rotation axis of rotation
    * @param {float} amgle angle of rotation in degrees
    * @param {int} instance specific instance to be rotated
    * @return {none}
    */
    rotate(rotationAxis, angle, instance){
        var rotation = this.instances[instance].rotation;
        mat4.rotate(rotation, rotation, degToRad(angle), rotationAxis);
    }

    /**
    * translates an instance by a given vector
    *
    * @param {vec3} translationVector vector to move by
    * @param {int} instance specific instance to be translated
    * @return {none}
    */
    translate(translationVector, instance){
        var position = this.instances[instance].position;
        vec3.add(position, position, translationVector);
    }

    /**
    * scales an instance by a given vector
    *
    * @param {vec3} scaleAxis the axis to be scaled by
    * @param {float} scaleFactor amount to be scaled by
    * @param {int} instance specific instance to be translated
    * @return {none}
    */
    scale(scaleAxis, scaleFactor, instance){
        var scale = this.instances[instance].scale;
        if(scaleAxis[0] === 1){
            scale[0] *= scaleFactor;
        }
        if(scaleAxis[1] === 1){
            scale[1] *= scaleFactor;
        }
        if(scaleAxis[2] === 1){
            scale[2] *= scaleFactor;
        }
    }

    /**
    * updates all dynamic buffer data for the instances
    *
    * @param {none}
    * @return {none}
    */
    updateBufferData(){
        //update the buffer
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

    /**
    * adds a new instance to render as long as the 
    * current amount of instances is less than the max
    * render amount
    *
    * @param {object} instance newly added instance
    * @return {none}
    */
    addInstance(instance){
        if(this.instances.length < this.max){
            this.instances.push(instance)
        }
        else{
            console.log("MAXIMUM INSTANCES REACHED");
        }
    }

    /**
    * calculates the centroid of the object
    *
    * @param {none}
    * @return {none}
    */
    getCentroid(){  
        var centroid = vec3.fromValues(0, 0, 0);
        var average = 1.0 / (this.vertexPositions.length / 3.0);
        for(var i = 0; i < this.vertexPositions; i += 3){
            var vertexPosition = vec3.fromValues(this.vertexPositions[i], this.vertexPositions[i + 1], this.vertexPositions[i + 2]);
            vec3.add(centroid, centroid, vertexPosition);
        }
        vec3.scale(centroid, centroid, average);
        return centroid;
    }
}