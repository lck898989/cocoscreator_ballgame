export default class Global {
    constructor() {
        
    }
    // 音乐状态 1： 打开 0： 关闭
    public static musicStatus: boolean = true;
    // 默认难度
    public static level: string = '1';
    // 难度级别对象
    public static levelJson: Object = {
        '1': {
            heroSpeed: 300,
            barrierSpeed: 100
        },
        '2': {
            heroSpeed: 400,
            barrierSpeed: 200
        },
        // 较难
        '3': {
            heroSpeed: 500,
            barrierSpeed: 300
        }
    }
}
