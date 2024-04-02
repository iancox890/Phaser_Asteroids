import { Math, Scene } from "phaser";
import { ArcadeSprite } from "../ArcadeSprite";
import { ProjectileGroup } from "../projectiles/ProjectileGroup";
import { PlayerDeathHandler } from "./PlayerDeathHandler";
import { Blaster } from "../blasters/Blaster";
import { BasicBlaster } from "../blasters/BasicBlaster";
import { SpreadBlaster } from "../blasters/SpreadBlaster";

/**
 * Controls player movement, blaster, and updates
 * for all of the players additional components. (i.e. death handling, invincibility, etc.)
 */
export class PlayerController extends ArcadeSprite
{
    public readonly projectileGroup: ProjectileGroup;
    public readonly deathHandler: PlayerDeathHandler;
    public readonly shipColor: number = 0x9BEF9A;

    public blaster: Blaster;

    private playerAcceleration: number = 250;
    private playerTurnSpeed: number = 250;

    private keyInput!: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor(scene: Scene, x: number, y: number, texture: string)
    {
        super(scene, x, y, texture);

        this.deathHandler = new PlayerDeathHandler(this, x, y, scene);

        this.keyInput = scene.input.keyboard.createCursorKeys();
        this.projectileGroup = new ProjectileGroup(scene);
        this.blaster = new BasicBlaster(this, this.projectileGroup);

        this.configureShipPhysics();

        this.setTint(this.shipColor)
    }

    private configureShipPhysics(): void
    {
        if ("setMaxSpeed" in this.body)
        {
            this.body.setMaxSpeed(325);
        }

        this.setDamping(true);

        this.scale = 0.35;
        this.setBodySize(0.05, 0.05);

        this.setDrag(0.5);

        this.refreshBody();
    }

    private updatePlayerMovement(): void
    {
        const turnDirection = this.scene.physics.velocityFromAngle(this.angle - 90).normalize();

        if (this.keyInput.up.isDown)
        {
            this.setAcceleration(turnDirection.x * this.playerAcceleration, turnDirection.y * this.playerAcceleration);
        }
        else
        {
            this.setAcceleration(0);
        }

        if (this.keyInput.left.isDown)
        {
            this.setAngularVelocity(-this.playerTurnSpeed);
        }
        else if (this.keyInput.right.isDown)
        {
            this.setAngularVelocity(this.playerTurnSpeed);
        }
        else
        {
            this.setAngularVelocity(0);
        }
    }

    protected preUpdate(time: number, delta: number): void
    {
        super.preUpdate(time, delta);

        this.updatePlayerMovement();
        this.deathHandler.invincibilityHandler.updatePlayerInvincibility(delta);
    }
}