import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Minimal load for the loading bar itself
        // this.load.image('logo', 'assets/logo.png'); // Example
    }

    create() {
        // Create loading bar UI here
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.add.text(width / 2, height / 2, 'Loading...', {
            font: '20px monospace',
            color: '#ffffff'
        }).setOrigin(0.5, 0.5);

        // Simulate lazy loading of heavy assets or start loading main assets
        // In a real app, we would load the MainScene assets here

        // For now, just transition to MainScene
        this.scene.start('MainScene');
    }
}
