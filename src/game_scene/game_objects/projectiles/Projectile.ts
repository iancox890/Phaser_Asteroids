import { ArcadeSprite } from "../ArcadeSprite";

export class Projectile extends ArcadeSprite
{
    projectileScale: number = 0.015;

    // The amount of time it takes for the projectile to deactivate.
    timeTillDeactivation: number = 1;

    // How much time is left until the projectile deactivates.
    activeTimeRemaining: number = 0;

    constructor(scene: Phaser.Scene, position: Phaser.Math.Vector2)
    {
        super(scene, position.x, position.y, "projectile");
    }

    public launch(position: Phaser.Math.Vector2, velocity: Phaser.Math.Vector2, angle: number): void
    {
        this.enableBody(true, position.x, position.y, true, true);

        this.activeTimeRemaining = 0;

        this.setAngle(angle)
        this.scale = this.projectileScale;

        this.setVelocity(velocity.x, velocity.y);
    }

    protected preUpdate(time: number, delta: number): void
    {
        super.preUpdate(time, delta);

        if (!this.active) return;

        if (this.activeTimeRemaining > this.timeTillDeactivation)
        {
            this.setActive(false);
            return;
        }

        this.activeTimeRemaining += delta * 0.001;
        this.alpha = Phaser.Math.Linear(1, 0, (this.activeTimeRemaining / this.timeTillDeactivation) * (this.activeTimeRemaining / this.timeTillDeactivation));
    }
}