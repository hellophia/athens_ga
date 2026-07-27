import { BATTLE_BACKGROUND_ASSET_KEYS, FIGHTER_ASSET_KEYS, MUSIC_KEYS } from '../misc/asset-keys.js';
import { TextMenu } from '../battle/text-menu.js';
import { SCENE_KEYS } from './scene-keys.js';
import Phaser from '../lib/phaser.js';

export class OutroScene extends Phaser.Scene {
    /** @type {TextMenu} */
    #textMenu;
    /** @type {number} */
    #pause;
    /** @type {Object} */
    #lines;
    /** @type {number} */
    #defaultCharacterDelay;
    /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
    #cursorKeys;
    #outroMusic;

    constructor() {
        super({
            key: SCENE_KEYS.OUTRO_SCENE,
        });

        this.#lines = [
            {
                character: "af",
                mood: "dead",
                text: "You... have... defeated me...",
            },
            {
                character: "af",
                mood: "dead",
                text: "... well done, Danny.",
            },
            {
                character: "af",
                mood: "dead",
                text: "For you see... I wasn't really the final boss.",
            },
            {
                character: "af",
                mood: "dead",
                text: "This was... only a test. The real boss... is called...",
            },
            {
                character: "af",
                mood: "dead",
                text: "... capitalism.",
            },
            {
                character: "danny",
                mood: "neutral",
                text: ".....",
                characterDelay: 100,
            },
            {
                character: "af",
                mood: "dead",
                text: "You see, Danny... capitalism is one of many possible ways that human society can organize itself.",
                characterDelay: 40,
            },
            {
                character: "af",
                mood: "dead",
                text: "Under capitalism, there is one class that controls the means of production, and leverages that control over the working class, who need to earn money for food and other necessities by selling their labor. Workers become alienated from their labor, and survival becomes a constant struggle.",
                characterDelay: 20,
            },
            {
                character: "danny",
                mood: "surprised",
                text: "...???",
                characterDelay: 75,
            },
            {
                character: "af",
                mood: "dead",
                text: "Throughout human history there have been other economic paradigms, and human beings did not always have to depend on the market for basic survival, but in the modern era a culture of increased privatization has made it less possible for people to control their own means of production. By creating an environment of scarcity, capitalism convinces people that the only way to live is to hoard resources.",
                characterDelay: 10,
            },
            {
                character: "danny",
                mood: "yelling",
                text: "???????????????????????????????????????????????",
                characterDelay: 20,
            },
            {
                character: "af",
                mood: "dead",
                text: "Capitalism says that we shouldn't share, and that we shouldn't be friends with each other, but actually...",
            },
            {
                character: "af",
                mood: "dead",
                text: "Sharing is good, and friendship is good too.",
            },
            {
                character: "af",
                mood: "dead",
                text: "And even though I pretended to be evil and dropped a big book on your head, I'm also your friend.",
            },
            {
                character: "af",
                mood: "dead",
                text: "And your friends will always try to help you, because we love you very much.",
            },
            {
                character: "danny",
                mood: "neutral",
                text: ".....",
                characterDelay: 300,
            },
            {
                character: "danny",
                mood: "yelling",
                text: "BORING!!!!!",
            },
        ];

        this.#pause = 1000;
        this.#defaultCharacterDelay = 35;
    }

    init() {
    }

    create() {

        this.sound.stopAll();
        this.#outroMusic = this.sound.add(MUSIC_KEYS.OUTRO_MUSIC);

        this.#cursorKeys = this.input.keyboard.createCursorKeys();

        this.#createBackground()

        this.#textMenu = new TextMenu(this, "af");
        this.time.delayedCall(500, () => {
            this.playLine(0);
        })

    }

    update() {

        if (Phaser.Input.Keyboard.JustDown(this.#cursorKeys.space) || Phaser.Input.Keyboard.JustDown(this.#cursorKeys.shift)) {
            this.#textMenu.handlePlayerInput('OK');
        }

    }

    /**
    * @param {number} index
    */
    playLine(index) {

        if (index === 5) {
            this.#outroMusic.play();
        }

        if (index === Object.keys(this.#lines).length - 1) {
            this.sound.stopAll();
        }

        if (index === Object.keys(this.#lines).length) {

            this.cameras.main.fadeOut(1000, 0, 0, 0);

            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
                this.time.delayedCall(1000, () => {
                    this.scene.start(SCENE_KEYS.CREDITS_SCENE);
                })
            });

            return;
        }

        const line = this.#lines[index];

        this.#textMenu.updateMessageWaitForInput(
            line.character,
            line.mood,
            line.text,
            line.characterDelay ?? this.#defaultCharacterDelay,
            () => this.playLine(index + 1)
        );
    }

    #createBackground() {

        this.add.image(
            0,
            0,
            BATTLE_BACKGROUND_ASSET_KEYS.CAVE_BACK
        ).setOrigin(0).setScale(.576).setPosition(0, 0);

        this.add.image(
            0,
            0,
            BATTLE_BACKGROUND_ASSET_KEYS.CAVE_FRONT
        ).setOrigin(0).setScale(.576).setPosition(0, 0);

        this.add.sprite(585, 190, FIGHTER_ASSET_KEYS.ENEMY).setScale(.63).setFrame(22);

        this.add.sprite(300, 250, FIGHTER_ASSET_KEYS.PLAYER).setScale(.35).setFrame(26);

    }

}