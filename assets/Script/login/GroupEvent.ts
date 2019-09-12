const {ccclass, property} = cc._decorator;
import Global from "../Global";
@ccclass
export default class NewClass extends cc.Component {


    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    }

    start () {

    }

    update (dt) {

    }
    changeEvent(event: cc.Event,data: any): void {
        event.stopPropagation();
        switch(data) {
            case "1":
                Global.level = "1";
                break;
            case "2":
                Global.level = "2";
                break;
            case "3":
                Global.level = "3";
                break;
        }
    }
}
