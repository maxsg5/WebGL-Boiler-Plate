main();

function main(){

    const app = new App();
    app.onStart();

    var then = 0.0;
    //main render loop
    function render(now) {
        now *= 0.001;
        const deltaTime = now - then;
        then = now;

        app.startFrame();
        app.update(deltaTime);
        app.render();
        app.endFrame();

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

