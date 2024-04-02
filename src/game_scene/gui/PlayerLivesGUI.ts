import { PlayerController } from "../game_objects/player_ship/PlayerController";

export class PlayerLivesGUI
{
    private lifeImages: Phaser.GameObjects.Image[];

    constructor(scene: Phaser.Scene, playerController: PlayerController)
    {
        this.lifeImages = new Array(playerController.deathHandler.playerLives);

        let xPos = 30;

        for (let i = 0; i < playerController.deathHandler.playerLives; i++)
        {
            const lifeImage: Phaser.GameObjects.Image = scene.add.image(xPos, 60, "player");

            lifeImage.setTint(playerController.shipColor);
            this.lifeImages[i] = lifeImage;

            lifeImage.setDepth(1);
            lifeImage.scale = 0.35;
            lifeImage.alpha = 0.45;

            xPos += 30;
        }

        scene.events.addListener("onDeath", () => this.lifeImages[playerController.deathHandler.playerLives].setActive(false).setVisible(false));
    }
}