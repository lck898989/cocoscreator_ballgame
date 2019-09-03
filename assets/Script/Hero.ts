const {ccclass, property} = cc._decorator;

@ccclass
export default class Hero extends cc.Component {

    private targetPoint: cc.Vec2;
    private sourcePoint: cc.Vec2;
    // 水平初速度设置为刚体的水平线速度
    private speed: number = 300;
    // 水平线速度的衰减系数
    private downRate: number = 1;
    private run: boolean = false;
    // 运动方向 0： 向左  1：向右
    private direction: number = -1;
    // 物理引擎
    private Pmanager: cc.PhysicsManager;
    // 碰撞管理器
    private CManager: cc.CollisionManager;
    private rigidBody: cc.RigidBody;
    // 是否遇到障碍物
    private crashBarrier: boolean = false;
    // 与之碰撞的物体节点
    private otherNode: cc.Node = null;
    // 匀减速直线运动的

    onLoad () {
        // 开启物理系统
        this.Pmanager = cc.director.getPhysicsManager();
        this.Pmanager.enabled = true;
        // 开启碰撞组件
        this.CManager = cc.director.getCollisionManager();
        this.CManager.enabled = true;

        this.rigidBody = this.node.getComponent(cc.RigidBody);
        this.rigidBody.linearDamping = this.downRate;
    }
    
    start () {

    }
    // 开始运动
    goRun(direction: number): void {
        // 开启运动
        this.run = true;
        this.direction = direction;
        // if(this.crashBarrier) {
        //     let action = cc.moveBy(1,20);
        //     this.node.runAction(action);
        // }
    }
    update (dt) {
        if(!this.crashBarrier) {
            switch(this.direction) {
                case 1:
                    if(this.rigidBody.active) {
                        this.rigidBody.linearVelocity = cc.v2(-this.speed,-300);
                    }
                break;
                case 2:
                    if(this.rigidBody.active) {
                        this.rigidBody.linearVelocity = cc.v2(this.speed,-300);
                    }
                break;  
            }
            
        } else {
            // 碰撞了之后自己跟随与之碰撞的物体移动
            if(this.otherNode) {
                this.followOther(this.otherNode);
            }
            // 控制左右移动
            switch(this.direction) {
                case 1:
                    this.node.x -= (this.speed * 0.5) * dt;
                break;
                case 2:
                    this.node.x += (this.speed * 0.5) * dt;
                break;  
            }
        }
        // 边界检测
        if(this.node.x >= 360 - this.node.width / 10) {
            this.node.x = 360 - this.node.width / 10;
        } else if (this.node.x <= -360 + this.node.width / 10) {
            this.node.x = -360 + this.node.width / 10;
        }
        // 重置方向
        // this.direction = -1;
    }
    // 节点跟随
    private followOther(other: cc.Node): void {
        this.node.y = other.y + other.height / 2 + this.node.height * this.node.scale / 2;
    }
    /**
     * 当碰撞产生的时候调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionEnter(other: any, self: any): void {
        console.log('on collision enter');
        // 撞到障碍物了
        this.crashBarrier = true;
        // 使刚体的active属性为false
        this.rigidBody.active = false;
        this.rigidBody.linearVelocity = cc.v2(0,0);
        this.node.y = other.node.y + other.node.height / 2 + this.node.height * this.node.scale / 2;
        // 主角的坐标跟随与之碰撞的物体移动
        this.otherNode = other.node;
        console.log("====>>>> other.node.y is ",other.node.y);
        // this.node.y = other
        // 碰撞系统会计算出碰撞组件在世界坐标系下的相关的值，并放到 world 这个属性里面
        var world = self.world;
        console.log("world is ",world);
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
    /**
     * 当碰撞结束后调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionExit(other: any, self: any): void {
        console.log('<<<<on collision exit>>>>');
        this.rigidBody.active = true;
        this.crashBarrier = false;
    }
}
