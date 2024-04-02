import { Events, Math } from "phaser";
import { PlayerController } from "./PlayerController";
import { PlayerShipInvincibility as PlayerInvincibilityHandler } from "./PlayerInvincibilityHandler";

/**
 * Sets the number of lives the player has, as well as destroying/respawning the ship.
 */
export class PlayerDeathHandler 
{
    public invincibilityHandler: PlayerInvincibilityHandler;
    public playerLives: number = 3;

    private playerController: PlayerController;
    private spawnPoint: Phaser.Math.Vector2;
    private scene: Phaser.Scene;

    private deathParticlesManager: Phaser.GameObjects.Particles.ParticleEmitterManager;
    private deathParticlesEmitter: Phaser.GameObjects.Particles.ParticleEmitter;

    constructor(playerController: PlayerController, x: number, y: number, scene: Phaser.Scene)
    {
        this.playerController = playerController;
        this.invincibilityHandler = new PlayerInvincibilityHandler(this.playerController);

        this.spawnPoint = new Math.Vector2(x, y);
        this.scene = scene;

        this.deathParticlesManager = scene.add.particles("particle", 0).setDepth(1);
        this.deathParticlesEmitter = this.deathParticlesManager.createEmitter({
            lifespan: 500,
            speed: { min: 10, max: 100 },
            scale: { start: 0.025, end: 0 },
            tint: playerController.shipColor,
            timeScale: 0.5,
            gravityY: 200,
            active: false
        });
    }

    public destroyShip(): void
    {
        this.playerLives--;

        this.deathParticlesEmitter.active = true;
        this.deathParticlesEmitter.explode(50, this.playerController.x, this.playerController.y);

        if (this.playerLives == 0)
        {
            this.scene.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
            this.playerController.destroy(true);
        }
        else
        {
            this.invincibilityHandler.enable();

            this.playerController.setVelocity(0, 0);
            this.playerController.setAngle(0);
            this.playerController.setPosition(this.spawnPoint.x, this.spawnPoint.y);
        }

        this.scene.events.emit("onDeath");
    }
}