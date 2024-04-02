import { Projectile } from "./Projectile";

export class ProjectileGroup extends Phaser.Physics.Arcade.Group
{
    constructor(scene: Phaser.Scene)
    {
        super(scene.physics.world, scene);

        this.createMultiple
            ({
                key: "projectile",
                active: false,
                visible: false,
                classType: Projectile
            });
    }

    public spawnProjectile(position: Phaser.Math.Vector2, velocity: Phaser.Math.Vector2, angle: number): void
    {
        const projectile: Projectile = this.getFirstDead(true);
        projectile.launch(position, velocity, angle);
    }
}