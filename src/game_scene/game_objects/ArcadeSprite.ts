import Phaser, { Physics, Scene, Cameras } from "phaser";

export class ArcadeSprite extends Phaser.Physics.Arcade.Sprite
{
    mainCamera: Cameras.Scene2D.Camera;

    constructor(scene: Scene, x: number, y: number, texture: string)
    {
        super(scene, x, y, texture);

        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.mainCamera = scene.cameras.main;
    }

    /**
     * Wraps a sprite object around the borders of the screen taking into account
     * its display width/height.
     * @param body The sprite objects body.
     * @param mainCamera The main camera in the scene.
     */
    protected updateScreenWrap()
    {
        const bodyScale = (this.displayWidth + this.displayHeight) / 2;
        if (this.x < -bodyScale)
        {
            this.x = this.mainCamera.width + bodyScale;
        }
        else if (this.x > this.mainCamera.width + bodyScale)
        {
            this.x = -bodyScale;
        }

        if (this.y < -bodyScale)
        {
            this.y = this.mainCamera.height + bodyScale;
        }
        else if (this.y > this.mainCamera.height + bodyScale)
        {
            this.y = -bodyScale;
        }
    }

    protected preUpdate(time: number, delta: number): void
    {
        super.preUpdate(time, delta);
        this.updateScreenWrap();
    }
}