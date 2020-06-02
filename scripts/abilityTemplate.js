export class AbilityTemplate extends MeasuredTemplate {
    handlers = {};
    moveTime = 0;
   // active = true;

    drawPreview() {
        this.layer.activate();
        const initialLayer = canvas.activeLayer;
        this.draw();
        this.layer.preview.addChild(this);
        this.activatePreviewListeners(initialLayer);
    }

    kill(){
        console.log("killed template");
        this.handlers.rc(event);
    }

    activatePreviewListeners(initialLayer) {
        

        this.handlers.mm = event => {
            event.stopPropagation();
            let now = Date.now();
            if (now - this.moveTime <= 20) return;
            const center = event.data.getLocalPosition(this.layer);
            const snapped = canvas.grid.getSnappedPosition(center.x, center.y, 2);
            this.data.x = snapped.x;
            this.data.y = snapped.y;
            this.refresh();
            this.moveTime = now;
        }

        this.handlers.rc = event => {
            this.layer.preview.removeChildren();
            canvas.stage.off("mousemove", this.handlers.mm);
            canvas.stage.off("mousedown", this.handlers.lc);
            canvas.app.view.oncontextmenu = null;
            canvas.app.view.onwheel = null;
            initialLayer.activate();
           // this.active = false;
        }

        this.handlers.lc = event => {
            //if(!this.active) return;
            this.handlers.rc(event);
            
            const destination = canvas.grid.getSnappedPosition(this.x,this.y,2);
            this.data.x=destination.x;
            this.data.y=destination.y;

            canvas.scene.createEmbeddedEntity("MeasuredTemplate", this.data);
        }

        this.handlers.mw = event => {
            if (event.ctrlKey ) event.preventDefault();
            event.stopPropagation();
            let delta = canvas.grid.type > CONST.GRID_TYPES.SQUARE ? 30 : 15;
            let snap = event.shiftKey ? delta : 5;
            this.data.direction += (snap * Math.sign(event.deltaY));
            this.refresh();
        }

        canvas.stage.on("mousemove", this.handlers.mm);
        canvas.stage.on("mousedown", this.handlers.lc);
        canvas.app.view.oncontextmenu = this.handlers.rc;
        canvas.app.view.onwheel = this.handlers.mw;
    }
}