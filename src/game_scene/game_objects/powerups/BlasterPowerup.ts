import { BasicBlaster } from "../blasters/BasicBlaster";
import { SpreadBlaster } from "../blasters/SpreadBlaster";
import { PlayerController } from "../player_ship/PlayerController";
import { Powerup } from "./Powerup";

export class BlasterPowerup extends Powerup
{
    constructor(playerController: PlayerController, position: Phaser.Math.Vector2)
    {
        super(playerController, position);

        this.playerController = playerController;
        this.duration = 10;
    }

    public override activate(): void
    {
        this.playerController.blaster = new SpreadBlaster(this.playerController, this.playerController.projectileGroup);
    }

    public override deactivate(): void
    {
        this.playerController.blaster = new BasicBlaster(this.playerController, this.playerController.projectileGroup);
    }
}