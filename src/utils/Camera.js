class Camera{
    constructor(position, front, up){
        this.position = position;
        this.front = front;
        this.up = up;
        this.yaw = 0.0;
        this.pitch = -45.0;
        this.zoom = 45.0;
        this.speed = 10.0;
        this.keys = {
            keyW : false,
            keyA: false,
            keyS: false,
            keyD: false,
            
            keyUP: false,
            keyLEFT: false,
            keyRIGHT: false,
            keyDOWN: false
        };
        this.init();
    }

    init(){
        document.addEventListener("keydown", (e) => {
            e.preventDefault();
            switch(e.code){
                case "KeyW": this.keys.keyW = true; break;
                case "KeyA": this.keys.keyA = true; break;
                case "KeyS": this.keys.keyS = true; break;
                case "KeyD": this.keys.keyD = true; break;

                case "ArrowUp": this.keys.keyUP = true; break;
                case "ArrowLeft": this.keys.keyLEFT = true; break;
                case "ArrowRight": this.keys.keyRIGHT = true; break;
                case "ArrowDown": this.keys.keyDOWN = true; break;
            }
        });

        document.addEventListener("keyup", (e) => {
            e.preventDefault();
            switch(e.code){
                case "KeyW": this.keys.keyW = false; break;
                case "KeyA": this.keys.keyA = false; break;
                case "KeyS": this.keys.keyS = false; break;
                case "KeyD": this.keys.keyD = false; break;

                case "ArrowUp": this.keys.keyUP = false; break;
                case "ArrowLeft": this.keys.keyLEFT = false; break;
                case "ArrowRight": this.keys.keyRIGHT = false; break;
                case "ArrowDown": this.keys.keyDOWN = false; break;
            }
        });
    }

    move(deltaTime){

        if(this.pitch > 89.0){
            this.pitch = 89.0;
        }
        if(this.pitch < -89.0){
            this.pitch = -89.0;
        }

        
        
        var front = vec3.fromValues(
            Math.cos(degToRad(this.yaw)) * Math.cos(degToRad(this.pitch)),
            Math.sin(degToRad(this.pitch)),
            Math.sin(degToRad(this.yaw)) * Math.cos(degToRad(this.pitch))
        );
        
        vec3.normalize(this.front, front);
        vec3.scale(this.front, this.front, this.speed * deltaTime);
        
        
        var cross = vec3.create();
        vec3.cross(cross, this.front, this.up);
        vec3.normalize(cross, cross);
        vec3.scale(cross, cross, this.speed * deltaTime);
    
        if(this.keys.keyW){
            vec3.add(this.position, this.position, this.front);
        }

        if(this.keys.keyS){
            this.position = vec3.sub(this.position, this.position, this.front);
        }

        if(this.keys.keyA){
            this.position = vec3.sub(this.position, this.position, cross);
        }

        if(this.keys.keyD){
            this.position = vec3.add(this.position, this.position, cross);
        }

        if(this.keys.keyRIGHT){
            this.yaw += 2.0;
        }

        if(this.keys.keyLEFT){
            this.yaw -= 2.0;
        }

        if(this.keys.keyUP){
            this.pitch += 2.0;
        }

        if(this.keys.keyDOWN){
            this.pitch -= 2.0;
        }

    }

    viewMatrix(){
        var view = mat4.create();
        var front = vec3.create();
        vec3.add(front, this.position, this.front);
        mat4.lookAt(view, this.position, front, this.up);
        return view;
    }
}