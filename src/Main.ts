import Phaser from 'phaser';
import GameScene from './game_scene/Game';

const config =
{
    type: Phaser.AUTO,
    parent: 'game',
    backgroundColor: '#232323',

    scale:
    {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,

        width: 1240,
        height: 724
    },

    physics:
    {
        default: 'arcade',
        arcade:
        {
            gravity: { x: 0, y: 0 },
            debug: false
        }
    },
    pixelArt: true
};

new Phaser.Game(Object.assign(config, { scene: [GameScene] }));