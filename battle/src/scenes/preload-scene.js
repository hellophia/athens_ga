import { BATTLE_ASSET_KEYS, BATTLE_BACKGROUND_ASSET_KEYS, DATA_ASSET_KEYS, FIGHTER_ASSET_KEYS, UI_ASSET_KEYS, MUSIC_KEYS } from '../misc/asset-keys.js';
import Phaser from '../lib/phaser.js'
import { SCENE_KEYS } from './scene-keys.js';
import * as WebFontLoader from '../lib/webfontloader.js';

export class PreloadScene extends Phaser.Scene {
    constructor() {
        super({
            key: SCENE_KEYS.PRELOAD_SCENE,
            pack: {
                files: [
                    { type: 'json', key: DATA_ASSET_KEYS.PLAYER_ATTACKS, url: 'assets/player-attacks.json' },
                    { type: 'json', key: DATA_ASSET_KEYS.ENEMY_ATTACKS, url: 'assets/enemy-attacks.json' }
                ]
            }
        });
        console.log(SCENE_KEYS.PRELOAD_SCENE);
        console.log(Phaser.VERSION);
    }

    preload() {

        const barheight = 30;
        const barwidth = 600;

        this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000).setOrigin(0).setPosition(0, 0);
        let progressBox = this.add.graphics();
        let progressBar = this.add.graphics();
        progressBox.fillStyle(0x322b30, 1);
        progressBox.fillRect(this.scale.width / 2 - (barwidth / 2), this.scale.height / 2 - (barheight / 2), barwidth, barheight);

        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0xb89100, 1);
            progressBar.fillRect(this.scale.width / 2 - (barwidth / 2), this.scale.height / 2 - (barheight / 2), barwidth * value, barheight);
        });

        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
        });

        this.load.audio(MUSIC_KEYS.INTRO_MUSIC, 'assets/music/intro.mp3');
        this.load.audio(MUSIC_KEYS.BATTLE_MUSIC, 'assets/music/finalbattle.mp3');
        this.load.audio(MUSIC_KEYS.OUTRO_MUSIC, 'assets/music/internationale.m4a');
        this.load.audio(MUSIC_KEYS.CREDITS_MUSIC, 'assets/music/happyghast.m4a');

        const AssetPath = "assets/images"

        this.load.image(BATTLE_BACKGROUND_ASSET_KEYS.CAVE, `${AssetPath}/cave-background.png`);

        this.load.image(BATTLE_ASSET_KEYS.HEALTH_BAR_BACKGROUND, `${AssetPath}/ui/healthbar-bg.png`);

        this.load.spritesheet(FIGHTER_ASSET_KEYS.PLAYER, `${AssetPath}/danny.png`, {
            frameWidth: 894,
            frameHeight: 1055,
        });
        this.load.spritesheet(FIGHTER_ASSET_KEYS.ENEMY, `${AssetPath}/af.png`, {
            frameWidth: 1259,
            frameHeight: 1523,
        });

        this.load.image(UI_ASSET_KEYS.CURSOR, `${AssetPath}/ui/cursor.png`);
        this.load.image(UI_ASSET_KEYS.SCROLL_UP, `${AssetPath}/ui/scroll-up.png`);
        this.load.image(UI_ASSET_KEYS.SCROLL_DOWN, `${AssetPath}/ui/scroll-down.png`);
        this.load.image(UI_ASSET_KEYS.SCROLL_BAR, `${AssetPath}/ui/scroll-bar.png`);
        this.load.image(UI_ASSET_KEYS.TEXT_WINDOW, `${AssetPath}/ui/text-bg.png`);
        this.load.image(UI_ASSET_KEYS.TEXT_DIALOGUE_WINDOW, `${AssetPath}/ui/text-dialogue-bg.png`);
        this.load.image(UI_ASSET_KEYS.NINESLICE, `${AssetPath}/ui/text-bg-9slice.png`);
        this.load.image(UI_ASSET_KEYS.TEXT_DIALOGUE, `${AssetPath}/ui/text-dialogue.png`);
        this.load.image(UI_ASSET_KEYS.TEXT_WINDOW_TOP, `${AssetPath}/ui/text-bg-top.png`);
        this.load.image(UI_ASSET_KEYS.TEXT_WINDOW_MIDDLE, `${AssetPath}/ui/text-bg-middle.png`);
        this.load.image(UI_ASSET_KEYS.TEXT_WINDOW_BOTTOM, `${AssetPath}/ui/text-bg-bottom.png`);

        for (let i = 0; i < 18; i++) {
            this.load.image(
                `letter-${i}`,
                `assets/images/letters/letters-${i}.png`
            );
        }

        this.load.spritesheet(UI_ASSET_KEYS.BATTLE_PORTRAITS, `${AssetPath}/ui/battle-portraits.png`, {
            frameWidth: 135,
            frameHeight: 135,
        });

        const playerConfigs = this.cache.json.get(DATA_ASSET_KEYS.PLAYER_ATTACKS) || [];
        const enemyConfigs = this.cache.json.get(DATA_ASSET_KEYS.ENEMY_ATTACKS) || [];
        const attackConfigs = [...playerConfigs, ...enemyConfigs];

        attackConfigs.forEach((config) => {
            this.load.spritesheet(config.spriteKey, config.url, {
                frameWidth: config.frameWidth,
                frameHeight: config.frameHeight,
            });
            this.load.audio(config.sound, config.soundurl);
        });

    }

    create() {
        console.log("preload create");
        WebFontLoader.default.load({
            custom: {
                families: ['VT323'],
            },
            active: () => {
                this.scene.start(SCENE_KEYS.INTRO_SCENE);
                //this.scene.start(SCENE_KEYS.BATTLE_SCENE);
                //this.scene.start(SCENE_KEYS.OUTRO_SCENE);
                //this.scene.start(SCENE_KEYS.CREDITS_SCENE);
            },
        });
    }

}