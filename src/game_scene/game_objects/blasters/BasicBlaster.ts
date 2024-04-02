import { ProjectileGroup } from "../projectiles/ProjectileGroup";
import { Blaster } from "./Blaster";
import { ArcadeSprite } from "../ArcadeSprite";

export class BasicBlaster extends Blaster
{
    constructor(arcadeSprite: ArcadeSprite, projectileGroup: ProjectileGroup)
    {
        super(arcadeSprite, projectileGroup);
    }

    public override fire(): void
    {
        const launchDirection: Phaser.Math.Vector2 = this.scene.physics.velocityFromAngle(this.arcadeSprite.angle - 90).normalize();
        this.projectileGroup.spawnProjectile(this.arcadeSprite.getTopCenter(), this.getLaunchVelocity(launchDirection), this.arcadeSprite.angle);
    }
}