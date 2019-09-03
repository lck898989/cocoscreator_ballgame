import Game from "./Game";
/***
 * 
 * 障碍物所对应的类
 * 
 */
const {ccclass, property} = cc._decorator;

@ccclass
export default class Barrier extends cc.Component {
    manager: cc.CollisionManager;
    // 是否已经从父节点中被移除了
    public kill: boolean = false;
    onLoad () {
        this.manager = cc.director.getCollisionManager();
        this.manager.enabled = true;
    }
    start () {
        // console.log("Game's prototype is ",Game.prototype);
        
    }

    update (dt) {
        if(this.node.y > 700 && !this.kill) {
            // 节点池回收内存
            // 从父节点删除
            this.node.parent.getComponent("Game").createBarrierNodes(1);
            this.node.parent.getComponent("Game").nodePool.put(this.node);
            // let barrierArr = this.node.parent.getComponent("Game").barrierArr;
            this.kill = true;
        } else {
            this.node.y += dt * 100;
        }
    }
    /**
     * 当碰撞产生的时候调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionEnter(other: any, self: any): void {
        console.log('on collision enter ===>');

        // 碰撞系统会计算出碰撞组件在世界坐标系下的相关的值，并放到 world 这个属性里面
        var world = self.world;

        // 碰撞组件的 aabb 碰撞框
        var aabb = world.aabb;

        // 节点碰撞前上一帧 aabb 碰撞框的位置
        var preAabb = world.preAabb;

        // 碰撞框的世界矩阵
        var t = world.transform;

        // 以下属性为圆形碰撞组件特有属性
        var r = world.radius;
        var p = world.position;

        // 以下属性为 矩形 和 多边形 碰撞组件特有属性
        var ps = world.points;
    }
}
