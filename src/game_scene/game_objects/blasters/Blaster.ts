import { Math } from "phaser";
import { ArcadeSprite } from "../ArcadeSprite";
import { ProjectileGroup } from "../projectiles/ProjectileGroup";

/**
 * Base class data/functionality for all Player blasters.
 */
export class Blaster
{
    protected arcadeSprite: ArcadeSprite;
    protected projectileGroup: ProjectileGroup;
    protected scene: Phaser.Scene;

    /**
     * Sets the speed at which a projectile is launched from this blaster.
     */
    protected blasterForce: number = 1000;

    /**
     * @param arcadeSprite The arcade sprite this blaster belongs to.
     * @param projectileGroup The projectile physics group to use when firing.
     * @param scene The scene this blaster belongs to.
     */
    constructor(arcadeSprite: ArcadeSprite, projectileGroup: ProjectileGroup)
    {
        this.arcadeSprite = arcadeSprite;
        this.projectileGroup = projectileGroup;
        this.scene = this.arcadeSprite.scene;

        this.scene.input.keyboard.addCapture([Phaser.Input.Keyboard.KeyCodes.SPACE]);
        this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE, true).on("down", this.fire, this);
    }

    /**
     * Calculates the launch velocity given a direction.
     * 
     * @param direction The direction to launch in.
     * @returns The velocity given by multiplying the direction from this blasters force.
     */
    public getLaunchVelocity(direction: Math.Vector2): Math.Vector2
    {
        return direction.multiply(new Math.Vector2(this.blasterForce, this.blasterForce));
    }

    /**
     * Override this method to implement the fire functionality for a given blaster.
     */
    public fire(): void { }
}