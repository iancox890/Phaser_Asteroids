import { PlayerController } from "./game_objects/player_ship/PlayerController";
import { AsteroidGroup as AsteroidGroup } from "./game_objects/asteroids/AsteroidGroup";
import { ArcadeSprite } from "./game_objects/ArcadeSprite";
import { PlayerLivesGUI } from "./gui/PlayerLivesGUI";
import { ScoreManager } from "./ScoreManager";
import { PowerupManager } from "./game_objects/powerups/PowerupManager";

export default class GameScene extends Phaser.Scene
{
    private powerupManager!: PowerupManager;

    constructor()
    {
        super('GameScene');
    }

    public preload(): void
    {
        this.load.image("player", "assets/player_ship.png");
        this.load.image("projectile", "assets/projectile.png");
        this.load.image("asteroid", "assets/asteroid.png");
        this.load.image("particle", "assets/particle.png");
        this.load.image("powerup", "assets/powerup.png");
    }

    public create(): void
    {
        new ScoreManager(this);

        const mainCamera = this.cameras.main;

        const playerController = new PlayerController(this, mainCamera.displayWidth / 2, mainCamera.displayHeight / 2, "player");
        const asteroidGroup = new AsteroidGroup(this);

        this.powerupManager = new PowerupManager(this, playerController);

        new PlayerLivesGUI(this, playerController);

        this.time.addEvent
            ({
                delay: 650,
                callback: () => asteroidGroup.spawnAsteroid(),
                loop: true
            });

        this.physics.world.addOverlap(playerController.projectileGroup, asteroidGroup, (projectileObj: Phaser.GameObjects.GameObject, asteroidObj: Phaser.GameObjects.GameObject) =>
        {
            if (!projectileObj.active) return;

            (projectileObj as ArcadeSprite).disableBody(true, true);
            this.events.emit("asteroidProjectileCollision", asteroidObj as ArcadeSprite);
        });

        this.physics.world.addCollider(asteroidGroup, playerController, () => playerController.deathHandler.destroyShip());
    }

    update(time: number, delta: number): void
    {
        this.powerupManager.updatePowerupTimers(delta);
    }
}
