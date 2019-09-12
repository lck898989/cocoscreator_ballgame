let music = require("./musicJson");
cc.Class({
    extends: cc.Component,

    properties: {
        beatTrack: null,
        beatStack: null,
        beatTrackMain: null,
        beatStackMain: null,
        offset: 0,
        startTimeStamp: null,
        scale: 1
    },

    onLoad () {
        console.log("music is ",music);
        this.beatTrack = music.tracks[2];
        this.beatStack = [];
        let incrementTime = 0;
        for(let item of this.beatTrack) {
            if(item.subtype === "noteOn" || item.subtype === "noteOff") {
                incrementTime += item.deltaTime;
                this.beatStack.push({event: item.subtype,id: item.noteNumber,timeStamp: incrementTime,track: 2});
            }
        }

        this.beatTrackMain = music.tracks[1];
        this.beatStackMain = [];
        for(let item of this.beatTrackMain) {
            if(item.subtype === "noteOn" || item.subtype === "noteOff") {
                incrementTime += item.deltaTime;
                this.beatStackMain.push({event: item.subtype,id: item.noteNumber,timeStamp: incrementTime,track: 1});
            }
        }
        this.node.on("note-on",(e) => {
            console.log("e is ",e);
        })
        this.node.on("note-off",(e) => {
            console.log("e is ",e);
        })
        this.startTimeStamp = Date.now() + this.offset;
    },

    start () {

    },

    update (dt) {
        let currentTimeStamp = Date.now();
        while(true) {
            let item = this.beatStack.shift();
            if(!item) {
                break;
            }
            if((currentTimeStamp - this.startTimeStamp) < item.timeStamp * 1 / this.scale) {
                this.beatStack.unshift(item);
                break;
            } else {
                if(item.event === "noteOn") {
                    this.node.emit("note-on",item);
                } else {
                    this.node.emit("note-off",item);
                }
            }
        }
        while(true) {
            let item = this.beatStackMain.shift();
            if(!item) {
                break;
            }
            if((currentTimeStamp - this.startTimeStamp) < item.timeStamp * 1 / this.scale) {
                this.beatStackMain.unshift(item);
                break;
            } else {
                if(item.event === "noteOn") {
                    this.node.emit("note-on",item);
                } else {
                    this.node.emit("note-off",item);
                }
            }
        }
    },
});
