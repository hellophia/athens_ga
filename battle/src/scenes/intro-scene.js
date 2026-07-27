import { BATTLE_BACKGROUND_ASSET_KEYS, DEPTHS, FIGHTER_ASSET_KEYS, MUSIC_KEYS, UI_ASSET_KEYS } from '../misc/asset-keys.js';
import { TextMenu } from '../battle/text-menu.js';
import { SCENE_KEYS } from './scene-keys.js';

export class IntroScene extends Phaser.Scene {
    /** @type {TextMenu} */
    #textMenu;
    /** @type {number} */
    #pause;
    /** @type {Object} */
    #lines;
    /** @type {number} */
    #totalTime;
    /** @type {number} */
    #defaultCharacterDelay;

    constructor() {
        super({
            key: SCENE_KEYS.INTRO_SCENE,
        });

        this.#totalTime = 49500;
        this.#lines = [
            {
                character: "danny",
                mood: "worried",
                text: "... hello?",
            },
            {
                character: "danny",
                mood: "yelling",
                text: "Is anyone there??",
            },
            {
                character: "mystery",
                mood: "none",
                text: "... well done, Danny...",
                characterDelay: 75,
            },
            {
                character: "danny",
                mood: "surprised",
                text: "Who said that?!",

            },
            {
                character: "danny",
                mood: "yelling",
                text: "Who are you!!!",

            },
            {
                character: "mystery",
                mood: "none",
                text: "You have completed my quest...",
                characterDelay: 75,
            },
            {
                character: "mystery",
                mood: "none",
                text: "... and you have arrived at my secret lair...",
                characterDelay: 75,
            },
            {
                character: "mystery",
                mood: "none",
                text: "I see that your friends have given you some little trinkets...",
                characterDelay: 75,
            },
            {
                character: "mystery",
                mood: "none",
                text: "... that was certainly kind of them.",
                characterDelay: 75,
            },
            {
                character: "mystery",
                mood: "none",
                text: "... but will it be enough, Danny?",
                characterDelay: 75,
            }
        ];

        this.#defaultCharacterDelay = 25;

        const revealTime = this.#lines.reduce((sum, line) => {
            const characterDelay =
                line.characterDelay ?? this.#defaultCharacterDelay;

            return sum + line.text.length * characterDelay;
        }, 0);

        this.#pause = Math.max(
            0,
            (this.#totalTime - revealTime) / Object.keys(this.#lines).length
        );
    }

    init() {
    }

    create() {

        console.log("intro create");

        const introMusic = this.sound.add(MUSIC_KEYS.INTRO_MUSIC);
        introMusic.play();

        this.#createBackground();

        //black bg
        //this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000).setOrigin(0).setPosition(0, 0);

        this.time.delayedCall(3000, () => {
            this.#textMenu = new TextMenu(this, "danny");
            this.time.delayedCall(500, () => {
                this.playLine(0);
            })
        }
        );

    }

    /**
* @param {number} index
*/
    playLine(index) {

        if (index === Object.keys(this.#lines).length) {
            this.#textMenu.finalMessage(
                "... will it be enough...",
                " to defeat me...?",
                this.#pause,
                100,
                () => {
                    this.time.delayedCall(1500, () => {
                        this.scene.start(SCENE_KEYS.BATTLE_SCENE);
                    })
                });
            return;
        }

        const line = this.#lines[index];

        this.#textMenu.updateMessageNoInputRequired(line.character, line.mood, line.text, this.#pause, line.characterDelay ?? this.#defaultCharacterDelay,
            () => this.playLine(index + 1)
        );
    }

    #createBackground() {

        this.add.image(
            0,
            0,
            BATTLE_BACKGROUND_ASSET_KEYS.CAVE_BACK
        ).setOrigin(0).setScale(.576).setPosition(0, 0);

        const scale = 0.576;

        const makeFire = (key, x, y, animKey) => {
            const fire = this.add.sprite(0, 0, key);
            fire
                .setOrigin(0)
                .setAlpha(0)
                .setScale(scale)
                .setPosition(x, y)
                .setDepth(DEPTHS.BACKGROUND);

            this.anims.create({
                key: animKey,
                frames: this.anims.generateFrameNumbers(key),
                frameRate: 6,
                repeat: -1,
            });

            fire.play(animKey);

            return fire;
        };

        const bgFire1 =
            makeFire(
                BATTLE_BACKGROUND_ASSET_KEYS.BG_FIRE_1,
                87,
                147,
                "bg-fire-1"
            );

        const bgFire2 =
            makeFire(
                BATTLE_BACKGROUND_ASSET_KEYS.BG_FIRE_2,
                531,
                120,
                "bg-fire-2"
            );

        this.add.image(
            0,
            0,
            BATTLE_BACKGROUND_ASSET_KEYS.CAVE_FRONT
        ).setOrigin(0).setScale(.576).setPosition(0, 0);

        const fgFire1 =
            makeFire(
                BATTLE_BACKGROUND_ASSET_KEYS.FG_FIRE_1,
                289,
                116,
                "fg-fire-1"
            );

        const fgFire2 =
            makeFire(
                BATTLE_BACKGROUND_ASSET_KEYS.FG_FIRE_2,
                838,
                104,
                "fg-fire-2"
            );

        this.add.sprite(555, 200, FIGHTER_ASSET_KEYS.SHADOW).setScale(.63);

        const blackout = this.add.rectangle(
            0,
            0,
            this.scale.width,
            this.scale.height,
            0x000000
        )
            .setOrigin(0)
            .setDepth(DEPTHS.BACKGROUND);

        this.time.delayedCall(11000, () => {
            bgFire2.setAlpha(1);
            blackout.setAlpha(.9);
        });

        this.time.delayedCall(28000, () => {
            bgFire1.setAlpha(1);
            blackout.setAlpha(.85);
        });

        this.time.delayedCall(45000, () => {
            fgFire1.setAlpha(1);
            blackout.setAlpha(.8);
        });

        this.time.delayedCall(59000, () => {
            fgFire2.setAlpha(1);
            blackout.setAlpha(.75);
        });
    }

}