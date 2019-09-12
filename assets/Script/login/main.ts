const {ccclass, property} = cc._decorator;
import Global from "../Global";
@ccclass
export default class NewClass extends cc.Component {
    @property({
        type: cc.Node
    })
    musicNode: cc.Node = null;
    @property({
        type: cc.Node
    })
    startNode: cc.Node = null;
    // 弹出窗
    @property({
        type: cc.Node
    })
    menuNode: cc.Node = null;
    @property({
        type: cc.Node
    })
    mask: cc.Node = null;
    // 背景音效
    @property({
        type: cc.AudioClip
    })
    backAudio: cc.AudioClip = null;
    private audioId: number = -1;

    onLoad () {
        let self = this;
        this.mask.active = false;
        this.menuNode.active = false;
        if(this.backAudio && Global.musicStatus) {
            this.audioId = cc.audioEngine.play(this.backAudio,true,1);
            console.log("audioid is ",this.audioId);
            console.log("========>>>",cc.audioEngine.isMusicPlaying());
        }
        let scale1 = cc.scaleTo(0.8,1.2);
        let scale2 = cc.scaleTo(0.8,1);
        this.musicNode.runAction(cc.sequence([scale1,scale2]).repeatForever());
        this.startNode.runAction(cc.sequence([cc.scaleTo(0.8,1.2),cc.scaleTo(0.8,1)]).repeatForever());

    }

    start () {

    }
    public async btn(event,data) {
        console.log("data is ",data);
        switch(data) {
            case "start":
                cc.director.loadScene("main");
                break;
            case "music":
                let musicSprite = this.musicNode.getChildByName("Background").getComponent(cc.Sprite);
                Global.musicStatus = !Global.musicStatus;
                if(Global.musicStatus) {
                    await this.loadTexture("laba",musicSprite);
                    if(!cc.audioEngine.isMusicPlaying()) {
                        this.audioId = cc.audioEngine.play(this.backAudio,true,1);
                    } 
                } else {
                    await this.loadTexture("jingyin",musicSprite);
                    console.log("music is playing: ",cc.audioEngine.isMusicPlaying());
                    console.log("audio id is ",this.audioId);
                    cc.audioEngine.stop(this.audioId);
                    // cc.audioEngine.stopAllEffects();
                }
                break;
            // 设置游戏等级       
            case "level":
                this.mask.active = true;
                this.menuNode.scale = 0.3;
                this.menuNode.active = true;
                this.mask.on("touchstart",this.hideMask.bind(this));
                cc.tween(this.menuNode).to(0.5,{
                    scale: 1
                },{progress: null,easing: "backOut"}).call(() => {

                }).start();
                break;

        }
    }
    private hideMask(event: cc.Event): void {
        console.log("event.target is ",event.target);
        console.log("event.target.node.name is ",event.target.name);
        if(event.target.name === "tc" ) {
            return;
        }
        this.mask.active = false;
        this.menuNode.active = false;
    }
    public loadTexture(url: string,spriteNode: cc.Sprite) {
        return new Promise((resolve,reject) => {
            cc.loader.loadRes(url,(err,res) => {
                if(err) {
                    reject(err);
                    return;
                }
                spriteNode.spriteFrame.setTexture(res);
                resolve();
            })
        })
    }
    update (dt) {

    }
}
