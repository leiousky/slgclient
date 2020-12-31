import DateUtil from "../../utils/DateUtil";
import { MapBuildData } from "../MapBuildProxy";
import MapCommand from "../MapCommand";
// import MapCommand from "../MapCommand";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BuildWarFreeLogic extends cc.Component {
    @property(cc.Sprite)
    spr: cc.Sprite = null;

    protected _data: MapBuildData = null;
    protected _limitTime: number = 0;

    protected onLoad(): void {
        this._limitTime = MapCommand.getInstance().proxy.getWarFree();
    }

    protected onDestroy(): void {
        this._data = null;
    }

     public setBuildData(data: MapBuildData): void {
        this._data = data;
        this.updateUI();
     }

    public updateUI(): void {
        if (this._data) {
            var diff = DateUtil.getServerTime() - this._data.occupyTime;
            var isShow = diff<this._limitTime && this._data.rid > 0;
            this.spr.node.active = isShow;

            if (isShow){
                this.stopCountDown();
                this.schedule(this.countDown.bind(this), 1.0);
                this.countDown();
            }
        }
    }

    public countDown() {
        var diff = DateUtil.getServerTime() - this._data.occupyTime;
        if (diff>this._limitTime){
            this.stopCountDown();
            this.spr.node.active = false;
        }
    }

    public stopCountDown() {
        this.unscheduleAllCallbacks();
    }
}