const {ccclass, property} = cc._decorator;

@ccclass
export default class Game extends cc.Component {
    @property({
        type: cc.Node
    })
    hero: cc.Node = null;
    @property({
        type: cc.Node
    })
    back: cc.Node = null;
    @property({
        type: [cc.Prefab]
    })
    barrierPrefabArr: cc.Prefab[] = [];
    @property({
        type: cc.Node
    })
    mask: cc.Node = null;
    // 再来一次按钮
    @property({
        type: cc.Node
    })
    againBtn: cc.Node = null;
    // 点击音效
    @property({
        type: cc.AudioClip
    })
    clickAudio: cc.AudioClip = null;
    // 游戏玩法指引龙骨动画
    @property({
        type: dragonBones.ArmatureDisplay
    })
    guideDragonNode: dragonBones.ArmatureDisplay;

    nodePool: cc.NodePool;
    barrierArr: cc.Node[] = [];

    public gameOver: boolean = false;
    onLoad() {
        // 播放龙骨动画
        this.guideDragonNode.getComponent(dragonBones.ArmatureDisplay).playAnimation("hand2",4);
        this.guideDragonNode.addEventListener(dragonBones.EventObject.COMPLETE,this.dragonOver.bind(this))

        this.mask.active = false;
        this.againBtn.active = false;
        // 背景适配
        // let minScale = Math.min(this.back.width / cc.view.getCanvasSize().width,this.back.height / cc.view.getCanvasSize().height);
        // this.back.scale = minScale;
        // let maxScale = Math.max(this.back.width / cc.view.getCanvasSize().width,this.back.height / cc.view.getCanvasSize().height);
        // this.back.scale = maxScale;
        this.node.on("touchstart",this.moveHero.bind(this));
    }
    // 龙骨动画播放完成
    private dragonOver(): void {
        this.guideDragonNode.node.active = false;
    }
    // 移动主角
    public moveHero(event: cc.Touch): void {  
        let location = event.getLocation();
        // 转换为节点坐标系
        let localLocation = this.node.convertToNodeSpaceAR(location);
        console.log("locallocation is ",localLocation);
        if(localLocation.x >= 0 && localLocation.x <= 360) {
            // 向右运动
            this.hero.getComponent("Hero").goRun(2);
        } else {
            // 向左运动
            this.hero.getComponent("Hero").goRun(1);
        }
    }
    start () {
        // init logic
        // 创建对象池存放障碍物
        this.nodePool = new cc.NodePool();
        for(let i = 0; i < 10; i++) {
            let index: number = this.createRandom(0,2);
            this.nodePool.put(cc.instantiate(this.barrierPrefabArr[index]));
        }
        this.createBarrierNodes(3);
    }
    public createBarrierNodes(num: number): void {
        let nodexArr = [-150,150];
        // let nodeyArr = [100,-300,-600];
        if(this.barrierArr.length === 0) {
            for(let i = 0; i < num; i++) {
                let node = this.nodePool.get();
                if(!node) {
                    let index: number = this.createRandom(0,2);
                    node = cc.instantiate(this.barrierPrefabArr[index]);
                    this.nodePool.put(node);
                }
                console.log("node is ",node);
                node.getComponent("Barrier").kill = false;
                let xIndex: number = this.createRandom(0,nodexArr.length);
                node.y = -400 * i + 150;
                this.createBarrier(node,nodexArr,xIndex);
                // 原数组中没有该节点的时候进行删除
                if(this.barrierArr.indexOf(node) < 0) {
                    this.barrierArr.push(node);
                }
            }
        } else {
            // 找到坐标最小值
            let min: number = this.barrierArr[0].y;
            
            this.barrierArr.map((value,index,arr) => {
                let yItem: number = value.y;
                if(yItem < min) {
                    min = yItem;
                }
            })
            for(let i = 0; i < num; i++) {
                // 在最小值坐标下面添加一个新的障碍物
                let node = this.nodePool.get();
                if(!node) {
                    let index: number = this.createRandom(0,2);
                    node = cc.instantiate(this.barrierPrefabArr[index]);
                    this.nodePool.put(node);
                }
                
                node.getComponent("Barrier").kill = false;
                // 可以动态的设置它的纹理从而控制生成的障碍物有所改变
                let xIndex: number = this.createRandom(0,nodexArr.length);
                node.y = min - 400;
                this.createBarrier(node,nodexArr,xIndex);
                if(this.barrierArr.indexOf(node) < 0) {
                    this.barrierArr.push(node);
                }
            }
        }
    }  
    createRandom(min: number,max: number): number {
        let res = Math.floor(Math.random() * (max - min) + min);
        return res;
    }
    createBarrier(node: cc.Node,nodexArr: number[],xIndex: number): void {
        if(!node.parent){
            node.parent = this.node;
        }
        node.x = nodexArr[xIndex];
    }
    // 再来一次
    again(): void {
        this.mask.active = false;
        this.againBtn.active = false;
        cc.game.restart();
        // cc.director.runScene("main");
        cc.director.runSceneImmediate(new cc.Scene("main"));
    }
    update(dt: number) {
        // if(this.back) {
        //     this.back.y += dt * 100;
        //     if(this.back.y >= 251) {
        //         this.back.y = -251;
        //     }
        // }
        if(this.hero.y <= - this.node.height / 2 || this.hero.y >= this.node.height / 2) {
            this.node.off("touchstart",this.moveHero.bind(this));
            // 游戏结束
            this.gameOver = true;
            // // 暂停游戏
            // cc.director.pause();
            // 退出游戏
            // cc.game.end();
            this.mask.active = true;
            this.mask.zIndex = 100;
            this.againBtn.active = true;
            this.againBtn.zIndex = 101;
            cc.game.pause();
            
        }
    }
    public onDestroy(): void {
        this.node.off("touchstart",this.moveHero.bind(this));
    }
}
