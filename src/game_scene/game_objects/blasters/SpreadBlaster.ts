import { Math } from "phaser";
import { ArcadeSprite } from "../ArcadeSprite";
import { ProjectileGroup } from "../projectiles/ProjectileGroup";
import { Blaster } from "./Blaster";

export class SpreadBlaster extends Blaster
{
    private projectileCount: number = 9;
    private spreadAngle: number = 60;

    constructor(arcadeSprite: ArcadeSprite, projectileGroup: ProjectileGroup)
    {
        super(arcadeSprite, projectileGroup);
    }

    public override fire(): void
    {
        let launchAngle = this.arcadeSprite.angle - this.spreadAngle;

        for (let i = 0; i < this.projectileCount; i++)
        {
            // Since i starts at 0, we subtract 1 from projectile count or else we'd never reach 100%.
            launchAngle = Math.Linear(this.arcadeSprite.angle - (this.spreadAngle / 2), this.arcadeSprite.angle + (this.spreadAngle / 2), i / (this.projectileCount - 1));

            const launchDirection = this.scene.physics.velocityFromAngle(launchAngle - 90).normalize();
            this.projectileGroup.spawnProjectile(this.arcadeSprite.getTopCenter(), this.getLaunchVelocity(launchDirection), this.arcadeSprite.angle);
        }
    }
}