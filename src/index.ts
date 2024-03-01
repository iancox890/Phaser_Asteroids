import Phaser from 'phaser';
import GameScene from './scenes/GameScene';

const config = {
    type: Phaser.AUTO,
    parent: 'game',
    backgroundColor: '#33A5E7',

    scale: {
        width: 800,
        height: 600,
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

new Phaser.Game(Object.assign(config, { scene: [GameScene] }));

