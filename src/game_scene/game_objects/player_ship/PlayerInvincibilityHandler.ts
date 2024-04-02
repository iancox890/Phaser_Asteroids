import { ArcadeSprite } from "../ArcadeSprite";

/**
 * Holds the settings for player invincibility such as duration and flash count,
 * as well as enabling/updating the current invincibility state.
 */
export class PlayerShipInvincibility
{
    private playerController: ArcadeSprite;

    private invincibilityDuration: number = 3;
    private invincibilityTimer: number = 0;
    private invincibilityFlashes: number = 3;
    private isInvincible: boolean = false;

    /** 
     * Calculated from the invincibility duration and the flash count. 
     * This value is the 'a' parameter in the pingPong method. 
     */
    private currentFlashAlpha: number = 0;

    constructor(playerController: ArcadeSprite)
    {
        this.playerController = playerController;
    }

    /**
     * Enables invincibility for the player for a given duration.
     */
    public enable(): void
    {
        this.isInvincible = true;
        this.playerController.body.checkCollision.none = true;
    }

    /**
     * Enables invincibility for the player ship for a given duration if isInvincible is true,
     * flashing the player sprites alpha a set number of times.
     *      
     * This must be called in an update method to ensure that invincibility is properly displayed and disabled.
     * 
     * @param deltaTime The delta time from a given update method. 
     */
    public updatePlayerInvincibility(deltaTime: number): void
    {
        if (this.isInvincible == false) return;

        this.playerController.alpha = Phaser.Math.Linear(1, 0.25, this.pingPong(this.currentFlashAlpha, 1));

        // Convert from ms to seconds.
        deltaTime *= 0.001;

        if (this.invincibilityTimer >= this.invincibilityDuration)
        {
            this.isInvincible = false;
            this.invincibilityTimer = 0;
            this.playerController.body.checkCollision.none = false;
        }

        this.invincibilityTimer += deltaTime;
        this.currentFlashAlpha += ((this.invincibilityFlashes / this.invincibilityDuration) * 2) * (deltaTime);
    }

    // Maths stuff //
    private pingPong(a: number, b: number): number
    {
        if (b == 0) return 0;
        return this.abs(this.fract((a - b) / (b * 2)) * b * 2 - b);
    }

    private fract(a: number): number
    {
        return a - Phaser.Math.FloorTo(a);
    }

    private abs(a: number): number
    {
        if (a < 0) return -a;
        return a;
    }
}