import { ArmyData } from "../../general/ArmyProxy";
import GeneralCommand from "../../general/GeneralCommand";
import ArmyCommand from "../../general/ArmyCommand";
import { GeneralData } from "../../general/GeneralProxy";
import { MapCityData } from "../MapCityProxy";
import MapCommand from "../MapCommand";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RightArmyItemLogic extends cc.Component {
    @property(cc.Label)
    labelInfo: cc.Label = null;
    @property(cc.Node)
    bottomNode: cc.Node = null; \
    @property(cc.Sprite)
    headIcon: cc.Sprite = null;
    @property(cc.Label)
    labelSoldierCnt: cc.Label = null;
    @property(cc.Label)
    labelStrength: cc.Label = null;
    @property(cc.Label)
    labelMorale: cc.Label = null;
    @property(cc.Node)
    btnBack: cc.Node = null;
    @property(cc.Node)
    btnSetting: cc.Node = null;

    protected _data: ArmyData = null;


    protected onLoad(): void {
        this.bottomNode.active = false;
    }

    protected onDestroy(): void {
        this._data = null;
    }

    protected onClickTop(): void {
        this.bottomNode.active = !this.bottomNode.active;
    }

    protected onClickBack(): void {
        if (this._data) {
            ArmyCommand.getInstance().generalAssignArmy(this._data.id, 3, this._data.toX, this._data.toY, null);
        }
    }

    protected onClickSetting(): void {
        if (this._data) {

        }
    }

    protected updateItem(): void {
        if (this._data) {
            this.node.active = true;
            let stateStr: string = this._data.state == 0 ? "[行军]" : "[停留]";
            let cityData: MapCityData = MapCommand.getInstance().cityProxy.getMyMainCity();
            let generalData: GeneralData = GeneralCommand.getInstance().proxy.getMyGeneral(this._data.generals[0]);
            let nameStr: string = generalData ? generalData.name + "队" : "";
            let posStr: string = "(" + this._data.x + ", " + this._data.y + ")";
            this.labelInfo.string = stateStr + " " + nameStr + " " + posStr;
            this.headIcon.spriteFrame = GeneralCommand.getInstance().proxy.getGeneralTex(generalData.cfgId);
            this.labelSoldierCnt.string = "骑兵 " + (this._data.soldiers[0] + this._data.soldiers[1] + this._data.soldiers[2]);
            if (this._data.state == 1) {
                //停留的时候才能配置队伍和撤退
                if (this._data.cmd == 0) {
                    //代表在城池里面
                    this.btnSetting.active = true;
                    this.btnBack.active = false;
                } else {
                    this.btnSetting.active = false;
                    this.btnBack.active = true;
                }
            } else {
                this.btnSetting.active = false;
                this.btnBack.active = false;
            }
        } else {
            this.node.active = false;
        }
    }

    public setArmyData(data: ArmyData): void {
        this._data = data;
        this.updateItem();
    }
}