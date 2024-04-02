import { Math, NONE, Types } from "phaser";
import { ArcadeSprite } from "../ArcadeSprite";
import { PlayerController } from "../player_ship/PlayerController";

export class Powerup extends ArcadeSprite
{
    protected playerController: PlayerController;

    protected duration!: number;
    public getDuration(): number
    {
        return this.duration;
    }

    protected launchForce: number = 50;

    /**
     * How close this powerup must be to the player to apply attraction force.
     */
    protected attractionDistance: number = 100;

    protected attractionForce: number = 0;
    protected attractionAcceleration: number = 10;

    protected isAttractionForceActive: boolean = false;

    constructor(playerController: PlayerController, position: Phaser.Math.Vector2)
    {
        super(playerController.scene, position.x, position.y, "powerup");

        this.playerController = playerController;

        const launchDirection = Phaser.Math.RandomXY(this.body.velocity);
        this.setVelocity(launchDirection.x * this.launchForce, launchDirection.y * this.launchForce);
    }

    public activate(): void { }
    public deactivate(): void { }

    protected preUpdate(time: number, delta: number): void
    {
        const playerPosition: Types.Math.Vector2Like = { x: this.playerController.x, y: this.playerController.y };
        const powerupPosition: Types.Math.Vector2Like = { x: this.x, y: this.y };

        const distanceToPlayerSqr = Math.Distance.BetweenPointsSquared(powerupPosition, playerPosition);
        const isWithinAttractionDistance: boolean = distanceToPlayerSqr > this.attractionDistance * this.attractionDistance;

        // If we're not within attraction distance OR the players collider is disabled, deactivate the attraction force.
        if ((isWithinAttractionDistance && !this.isAttractionForceActive) || this.playerController.body.checkCollision.none)
        {
            this.isAttractionForceActive = false;
            return;
        }
        const displacement: Types.Math.Vector2Like =
        {
            x: (playerPosition.x as number) - (powerupPosition.x as number),
            y: (playerPosition.y as number) - (powerupPosition.y as number)
        }

        const directionToPlayer: Math.Vector2 = new Math.Vector2(displacement.x, displacement.y).normalize();

        this.setVelocity(directionToPlayer.x * this.attractionForce, directionToPlayer.y * this.attractionForce);
        this.attractionForce += this.attractionAcceleration;

        this.isAttractionForceActive = true;
    }
}