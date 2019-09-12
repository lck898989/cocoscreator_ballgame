const {ccclass, property} = cc._decorator;

@ccclass
export default class backAdapt extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        let minScale = Math.min(this.node.width / cc.view.getCanvasSize().width,this.node.height / cc.view.getCanvasSize().height);
        this.node.scale = minScale;
        let maxScale = Math.max(this.node.width / cc.view.getCanvasSize().width,this.node.height / cc.view.getCanvasSize().height);
        this.node.scale = maxScale;
    }

    start () {

    }

    // update (dt) {}
}
