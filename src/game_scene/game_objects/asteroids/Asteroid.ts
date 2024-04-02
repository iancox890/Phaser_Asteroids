import { Math } from "phaser";
import { ArcadeSprite } from "../ArcadeSprite";

export class Asteroid extends ArcadeSprite
{
    constructor(scene: Phaser.Scene, position: Phaser.Math.Vector2)
    {
        super(scene, position.x, position.y, "asteroid");
        this.setTint(0x767676);
    }

    public setRandomSize(min: number, max: number): void
    {
        this.scale = Math.FloatBetween(min, max);
    }

    public launchAsteroid(position: Phaser.Math.Vector2): void
    {
        this.enableBody(true, position.x, position.y, true, true);
        this.setAngle(Phaser.Math.Between(0, 360));

        const launchDirection = Phaser.Math.RandomXY(this.body.velocity);
        this.setVelocity(launchDirection.x * 50, launchDirection.y * 50);
    }
}