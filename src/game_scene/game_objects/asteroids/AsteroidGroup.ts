import { Math } from "phaser";
import { Asteroid } from "./Asteroid";
import { ArcadeSprite } from "../ArcadeSprite";

/**
 * Controls the Asteroid physics group and its life cycle. (i.e., enabling and disabling)
 */
export class AsteroidGroup extends Phaser.Physics.Arcade.Group
{
    private readonly largeAsteroidSizeRange: Math.Vector2 = new Math.Vector2(0.85, 1.5);
    private readonly smallAsteroidSizeRange: Math.Vector2 = new Math.Vector2(0.35, 0.65);

    private splitCount: number = 2;

    constructor(scene: Phaser.Scene)
    {
        super(scene.physics.world, scene);

        this.createMultiple
            ({
                key: "asteroid",
                active: false,
                visible: false,
                classType: Asteroid,
            });

        const destructionParticlesManager = scene.add.particles("particle", 0);
        const destructionParticlesEmitter: Phaser.GameObjects.Particles.ParticleEmitter = destructionParticlesManager.createEmitter({
            lifespan: 500,
            speed: { min: 10, max: 100 },
            scale: { start: 0.025, end: 0 },
            tint: [0x767676, 0x5D5D5D],
            timeScale: 0.5,
            gravityY: 200,
            active: false
        });

        destructionParticlesManager.setDepth(1);

        scene.events.addListener("asteroidProjectileCollision", (asteroid: ArcadeSprite) =>
        {
            asteroid.disableBody(true, true);

            if (this.isAsteroidSplittable(asteroid))
            {
                this.spawnAsteroidSplit(new Math.Vector2(asteroid.x, asteroid.y));
            }

            destructionParticlesEmitter.active = true;
            destructionParticlesEmitter.explode(25 * asteroid.scale, asteroid.x, asteroid.y)
        })
    }

    public spawnAsteroid(): void
    {
        const asteroid: Asteroid = this.getFirstDead(true);
        const spawnPosition = this.getOffscreenSpawnPosition((asteroid.displayHeight + asteroid.displayWidth) / 2);

        asteroid.setRandomSize(this.largeAsteroidSizeRange.x, this.largeAsteroidSizeRange.y);
        asteroid.launchAsteroid(spawnPosition);
    }

    public spawnAsteroidSplit(position: Math.Vector2)
    {
        for (let i = 0; i < this.splitCount; i++)
        {
            const asteroid: Asteroid = this.getFirstDead(true);

            asteroid.setRandomSize(this.smallAsteroidSizeRange.x, this.smallAsteroidSizeRange.y);
            asteroid.launchAsteroid(position);
        }
    }

    /**
     * Checks if a given asteroid is splittable via its scale.
     * An asteroid is considered splittable if it is within the large asteroid size range.
     * 
     * @param asteroid An asteroid which inherits from ArcadeSprite.
     * @returns True if the asteroid is splittable, false if it isn't.
     */
    private isAsteroidSplittable(asteroid: ArcadeSprite): boolean
    {
        if (asteroid.scale >= this.largeAsteroidSizeRange.x) return true;
        return false;
    }

    private getOffscreenSpawnPosition(scale: number): Phaser.Math.Vector2
    {
        let spawnPosition: Phaser.Math.Vector2 = Phaser.Math.Vector2.ZERO;

        enum SpawnQuadrant { Left, Right, Top, Bottom }

        const quadrant = Phaser.Math.Between(0, 3);
        const mainCamera: Phaser.Cameras.Scene2D.Camera = this.scene.cameras.main;

        if (quadrant == SpawnQuadrant.Left)
        {
            spawnPosition.x = -scale;
            spawnPosition.y = Phaser.Math.Between(-scale, mainCamera.height);
        }
        else if (quadrant == SpawnQuadrant.Left)
        {
            spawnPosition.x = mainCamera.width + scale;
            spawnPosition.y = Phaser.Math.Between(-scale, mainCamera.height);
        }
        else if (quadrant == SpawnQuadrant.Top)
        {
            spawnPosition.x = Phaser.Math.Between(-scale, mainCamera.width);
            spawnPosition.y = mainCamera.height + scale;
        }
        else if (quadrant == SpawnQuadrant.Bottom)
        {
            spawnPosition.x = Phaser.Math.Between(-scale, mainCamera.width);
            spawnPosition.y = -scale;
        }

        return spawnPosition;
    }
}