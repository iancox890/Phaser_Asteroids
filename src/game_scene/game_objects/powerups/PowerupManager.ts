import { Math } from "phaser";
import { ArcadeSprite } from "../ArcadeSprite";
import { PlayerController } from "../player_ship/PlayerController";
import { BlasterPowerup } from "./BlasterPowerup";
import { Powerup } from "./Powerup";

/**
 * Manages spawning and the active powerups duration for the player controller.
 */
export class PowerupManager
{
    private playerController: PlayerController;
    private dropChance: number = 0.5;

    private powerupTypes: (typeof Powerup)[] = [];
    private powerupTimers: Map<typeof Powerup, number> = new Map<typeof Powerup, number>();

    constructor(scene: Phaser.Scene, playerController: PlayerController)
    {
        this.playerController = playerController;

        this.addPowerupType(BlasterPowerup);

        scene.events.addListener("asteroidProjectileCollision", (asteroid: ArcadeSprite) =>
        {
            if (Math.FloatBetween(0, 1) <= this.dropChance)
            {
                this.spawnPowerUp(new Math.Vector2(asteroid.x, asteroid.y));
            }
        });
    }

    /**
     * Iterates over the currently active powerups and updates
     * their timers, deactivating them when the timer is finished.
     * 
     * @param Delta The delta time from a given update method.
     */
    public updatePowerupTimers(delta: number)
    {
        this.powerupTimers.forEach((timer: number, powerupType: typeof Powerup) =>
        {
            timer -= delta * 0.001;

            if (timer <= 0)
            {
                this.powerupTimers.delete(powerupType);
            }
            else
            {
                this.powerupTimers.set(powerupType, timer);
            }
        });
    }

    private addPowerupType(powerupTypeToAdd: typeof Powerup)
    {
        // If the type already exists in the array, do not add it twice.
        if (this.powerupTypes.some(powerupType => powerupType === powerupTypeToAdd)) return;
        this.powerupTypes.push(powerupTypeToAdd);
    }

    /**
     * Spawns a random powerup and registers a collision between it and the player controller.
     * The collision callback activates the powerup and adds the powerup duration to the timers map.
     * 
     * @param position The spawn position of this powerup.
     */
    private spawnPowerUp(position: Math.Vector2): void
    {
        const powerupType: typeof Powerup = this.powerupTypes[Math.Between(0, this.powerupTypes.length - 1)];
        const powerup: Powerup = new powerupType(this.playerController, position);

        this.playerController.scene.physics.world.addOverlap(powerup, this.playerController, () =>
        {
            let currentPowerupTimer: number = 0;

            /** 
             * If this powerup is active, grab the current time remaining and add 
             * it to the powerups duration.
             */
            if (this.powerupTimers.has(powerupType))
            {
                currentPowerupTimer = this.powerupTimers.get(powerupType) as number;
            }
            else
            {
                powerup.activate();
            }

            this.powerupTimers.set(powerupType, powerup.getDuration() + currentPowerupTimer);

            powerup.destroy();
        });
    }
}