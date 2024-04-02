import { ArcadeSprite } from "./game_objects/ArcadeSprite";

export class ScoreManager
{
    /**
     * This is a flat value which is multiplied by the asteroid scale, making
     * larger asteroids award more points than smaller ones.
     */
    private asteroidPoints: number = 10;

    private currentScore: number = 0;
    public get getCurrentScore(): number { return this.currentScore; }

    constructor(scene: Phaser.Scene)
    {
        let scoreText = scene.add.text(23.5, 20, "0").setDepth(1).setScale(1.25);
        scene.events.on("asteroidProjectileCollision", (asteroid: ArcadeSprite) =>
        {
            this.currentScore += this.asteroidPoints * asteroid.scale;
            scoreText.text = Math.round(this.currentScore).toString();
        });
    }
}