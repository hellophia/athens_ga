import Phaser from '../lib/phaser.js';
import { BATTLE_ASSET_KEYS, DEPTHS } from '../misc/asset-keys.js';
import { Attack } from './attacks.js';

export class AttackAnimations {

    static get registry() {
        return {
            NANCY: this.nancy,
            STATUES: this.statues,
            SWAN: this.swan,
            CHUPA: this.chupa,
            POOL: this.pool,
            DIRTBIKE: this.dirtbike,
            CHICKEN: this.chicken,
            HEMAN: this.heman,
            MUSHROOM: this.mushroom,
            PORKCHOP: this.porkchop,
            CAPITAL: this.capital,
            BEES: this.bees,
            BIKE: this.bike,
            THROAT: this.throat,
            ARI: this.ari,
            CANDY: this.candy,
            SOCCER: this.soccer,
            FROG: this.frog,
            GODZILLA: this.godzilla,
            MONSTER: this.monster,
            EYE: this.eye,
            DWARF: this.dwarf,
            POTATO: this.potato,
        };
    }

    static #context = {
        scene: null,
        sprite: null,
        width: 0,
        height: 0,
        player: null,
        enemy: null,
    };

    /**
     * @param {string} key
     * @param {Attack} attack
     * @param {() => void} callback
     * @param {() => void} cleanup
     */
    static play(key, attack, callback, cleanup) {

        const scene = attack._scene;
        const sprite = attack._attackGameSprite;

        this.#context.scene = scene;
        this.#context.sprite = sprite;
        this.#context.width = scene.scale.width;
        this.#context.height = scene.scale.height;
        this.#context.player = attack._player;
        this.#context.enemy = attack._enemy;

        const fn = this.registry[key] || this.default;
        fn.call(this, attack, callback, cleanup);
    }

    static default(attack, callback, cleanup) {
        console.log("reverted to default")
        attack._playDefaultAnimation(callback);
    }

    static playSound(attack) {
        attack._scene.sound.play(attack._sound);
    }

    static getEnemyLocation() {
        const { width, height, enemy } = this.#context;
        const percent = enemy.currentHealth / enemy.maxHealth;

        if (percent >= 0.75) { return { x: width * 0.63, y: height * 0.15, } };
        if (percent >= 0.5) { return { x: width * 0.62, y: height * 0.12, } };
        if (percent >= 0.25) { return { x: width * 0.63, y: height * 0.15, } };
        return {
            x: width * 0.65, y: height * 0.21,
        }
    }

    /*
      _   _                        
     | \ | | __ _ _ __   ___ _   _ 
     |  \| |/ _` | '_ \ / __| | | |
     | |\  | (_| | | | | (__| |_| |
     |_| \_|\__,_|_| |_|\___|\__, |
                             |___/ 
    */
    static nancy(attack, callback, cleanup) {

        const { scene, sprite, width, height } = this.#context;

        const groundY = scene.scale.height * .3;

        sprite
            .setPosition(-100, groundY)
            .setAlpha(1)
            .setDepth(DEPTHS.ATTACKS);

        sprite.play(attack._spriteKey);

        scene.tweens.chain({

            targets: sprite,

            tweens: [

                {
                    x: scene.scale.width * 0.33,
                    y: groundY - 180,
                    duration: 400,
                    ease: 'Sine.Out',
                },

                {
                    x: scene.scale.width * 0.33,
                    y: groundY,

                    duration: 250,
                    ease: 'Bounce.Out',

                    onComplete: () => {
                        this.playSound(attack);
                    },
                },

                {
                    x: scene.scale.width * 0.75,
                    y: groundY - 120,
                    duration: 350,
                    ease: 'Sine.Out',
                },

                {
                    x: scene.scale.width * 0.75,
                    y: groundY,

                    duration: 250,
                    ease: 'Bounce.Out',

                    onComplete: () => {
                        this.playSound(attack);
                        callback();
                    },
                },

                {
                    x: scene.scale.width + 150,
                    y: groundY - 40,
                    duration: 500,
                    ease: 'Sine.In',
                },

            ],

            onComplete: cleanup,
        });
    }

    /*
      ____                     
     / ___|_      ____ _ _ __  
     \___ \ \ /\ / / _` | '_ \ 
      ___) \ V  V / (_| | | | |
     |____/ \_/\_/ \__,_|_| |_|
    */
    static swan(attack, callback, cleanup) {

        const { scene, sprite, width, height } = this.#context;

        sprite.setDepth(DEPTHS.ATTACKS);

        this.playSound(attack);

        const path = new Phaser.Curves.Spline([
            -100, 50,
            scene.scale.width * 0.33, scene.scale.height * 0.33,
            scene.scale.width * 0.66, scene.scale.height * 0.33,
            scene.scale.width + 100, 50,
        ]);

        scene.tweens.add({
            delay: 0,
            duration: 200,
            targets: attack._attackGameSprite,
            alpha: {
                from: 0,
                start: 0,
                to: 1,
            }
        });

        const data = { t: 0 };

        scene.tweens.add({
            targets: data,
            t: 1,
            duration: 1500,
            ease: 'Linear',

            onUpdate: () => {

                const point = path.getPoint(data.t);

                sprite.setPosition(point.x, point.y);
            },

            onComplete: () => {
                cleanup();
            },
        });

        scene.time.delayedCall(1000, () => {
            callback();
        });
    }

    /*
      ____  _        _                   
     / ___|| |_ __ _| |_ _   _  ___  ___ 
     \___ \| __/ _` | __| | | |/ _ \/ __|
      ___) | || (_| | |_| |_| |  __/\__ \
     |____/ \__\__,_|\__|\__,_|\___||___/                        
    */
    static statues(attack, callback, cleanup) {

        const { scene, sprite, width, height } = this.#context;

        const startX = -sprite.width;
        const centerX = scene.scale.width * .42;
        const y = 30 + (sprite.height / 2);

        sprite
            .setPosition(startX, y)
            .setDepth(DEPTHS.ATTACKS)
            .setAlpha(1)
            .setScale(.8);

        scene.tweens.add({
            targets: sprite,
            x: centerX,
            duration: 1000,
            ease: 'Sine.Out',

            onComplete: () => {

                scene.time.delayedCall(500, () => {

                    this.playSound(attack);

                    const laser = scene.add.graphics().setDepth(DEPTHS.ATTACKS);
                    const laser2 = scene.add.graphics().setDepth(DEPTHS.ATTACKS);

                    laser.lineStyle(6, 0xff0000);
                    laser2.lineStyle(6, 0xff0000);

                    const startLaserX = sprite.x - (sprite.width / 4);
                    const startLaserY = sprite.y - (sprite.height / 4);

                    let { x: endLaserX, y: endLaserY } = this.getEnemyLocation();
                    endLaserX += 60;

                    laser.beginPath();
                    laser.moveTo(startLaserX, startLaserY);
                    laser.lineTo(endLaserX, endLaserY);
                    laser.strokePath();

                    laser2.beginPath();
                    laser2.moveTo(startLaserX + 160, startLaserY + 28);
                    laser2.lineTo(endLaserX, endLaserY);
                    laser2.strokePath();

                    scene.tweens.add({
                        targets: laser,
                        alpha: 0,
                        duration: 250,
                        onComplete: () => {
                            laser.destroy();
                            callback();
                        }
                    });

                    scene.tweens.add({
                        targets: laser2,
                        alpha: 0,
                        duration: 250,
                    });

                    scene.time.delayedCall(500, () => {
                        scene.tweens.add({
                            targets: sprite,
                            x: startX,
                            duration: 1000,
                            ease: 'Sine.In',
                            onComplete: cleanup
                        });
                    });

                });

            },
        });
    }

    /*
      __  __           _                               
     |  \/  |_   _ ___| |__  _ __ ___   ___  _ __ ___  
     | |\/| | | | / __| '_ \| '__/ _ \ / _ \| '_ ` _ \ 
     | |  | | |_| \__ \ | | | | | (_) | (_) | | | | | |
     |_|  |_|\__,_|___/_| |_|_|  \___/ \___/|_| |_| |_|
    */
    static mushroom(attack, callback, cleanup) {

        const { scene, sprite, width, height, player } = this.#context;
        const key = attack._spriteKey;

        sprite.setAlpha(0);

        const { x: startX, y: startY } = this.getEnemyLocation();

        const targetX = width * 0.25;
        const targetY = height * 0.45;

        let finished = 0;

        for (let frame = 0; frame < 5; frame++) {

            scene.time.delayedCall(frame * 100, () => {

                const mushroom = scene.add.sprite(
                    startX,
                    startY,
                    key,
                    frame
                ).setScale(0.25);

                this.playSound(attack);

                scene.tweens.add({
                    targets: mushroom,
                    x: targetX,
                    y: targetY,
                    scale: .5,
                    duration: 500,

                    onComplete: () => {

                        if (frame === 0) {
                            callback();
                        }

                        const angle =
                            Phaser.Math.FloatBetween(0, Math.PI * 2);

                        const distance =
                            Phaser.Math.Between(500, 900);

                        const endX =
                            targetX + Math.cos(angle) * distance;

                        const endY =
                            targetY + Math.sin(angle) * distance;

                        scene.tweens.add({
                            targets: mushroom,
                            x: endX,
                            y: endY,
                            rotation:
                                Phaser.Math.FloatBetween(
                                    -10,
                                    10
                                ),
                            duration: 500,

                            onComplete: () => {

                                mushroom.destroy();

                                finished++;

                                if (finished === 5) {
                                    cleanup();
                                }
                            }
                        });
                    }
                });
            });
        }
    }

    /*
      ____            _        _                 
     |  _ \ ___  _ __| | _____| |__   ___  _ __  
     | |_) / _ \| '__| |/ / __| '_ \ / _ \| '_ \ 
     |  __/ (_) | |  |   < (__| | | | (_) | |_) |
     |_|   \___/|_|  |_|\_\___|_| |_|\___/| .__/ 
                                          |_|    
    */
    static porkchop(attack, callback, cleanup) {

        const { scene, sprite, width, height, player } = this.#context;
        const key = attack._spriteKey;

        sprite.setAlpha(0);

        const bounceY = scene.scale.height * 0.66;

        let finished = 0;

        scene.time.delayedCall(500, () => {
            callback();
        })

        for (let i = 0; i < 15; i++) {

            const x =
                Phaser.Math.Between(
                    50,
                    scene.scale.width - 50
                );

            const pork = scene.add.sprite(
                x,
                -100,
                key
            ).setDepth(DEPTHS.TOP);

            scene.tweens.chain({

                delay: i * 60,

                targets: pork,

                tweens: [

                    {
                        y: bounceY,
                        duration: 500,
                        ease: 'Quad.In',
                        onComplete: () => {
                            this.playSound(attack);
                        }
                    },

                    {
                        y: bounceY - 80,
                        duration: 200,
                        ease: 'Quad.Out',
                    },

                    {
                        y: scene.scale.height + 200,
                        duration: 500,
                        ease: 'Quad.In',
                    },

                ],

                onComplete: () => {

                    pork.destroy();

                    finished++;

                    if (finished === 15) {
                        cleanup();
                    }
                },
            });
        }
    }

    /*
       ____ _                       
      / ___| |__  _   _ _ __   __ _ 
     | |   | '_ \| | | | '_ \ / _` |
     | |___| | | | |_| | |_) | (_| |
      \____|_| |_|\__,_| .__/ \__,_|
                       |_|          
    */
    static chupa(attack, callback, cleanup) {

        const { scene, sprite, width, height } = this.#context;

        sprite.setDepth(DEPTHS.TOP);

        const marginX = sprite.width / 2;
        const marginY = sprite.height / 2;

        sprite.setAlpha(1);

        let jumps = 0;

        const teleport = () => {

            this.playSound(attack);

            const x = Phaser.Math.Between(
                marginX,
                scene.scale.width - marginX
            );

            const y = Phaser.Math.Between(
                marginY,
                scene.scale.height - marginY
            );

            sprite.setPosition(x, y);

            sprite.setAngle(
                Phaser.Math.Between(-30, 30)
            );

            jumps++;

            if (jumps === 4) {
                callback();
            }

            if (jumps >= 7) {
                cleanup();
                return;
            }

            scene.time.delayedCall(
                250,
                teleport
            );
        };

        teleport();
    }

    /*
      ____  _      _   _     _ _        
     |  _ \(_)_ __| |_| |__ (_) | _____ 
     | | | | | '__| __| '_ \| | |/ / _ \
     | |_| | | |  | |_| |_) | |   <  __/
     |____/|_|_|   \__|_.__/|_|_|\_\___|
    */
    static dirtbike(attack, callback, cleanup) {

        const { scene, sprite, width, height } = this.#context;

        const startX = -(sprite.width);
        const stopX = width * .4;
        const endX = width + sprite.width;

        const y = height * 0.4;

        sprite
            .setPosition(startX, y)
            .setAlpha(1)
            .setScale(.5)
            .setDepth(DEPTHS.ATTACKS);

        this.playSound(attack);

        scene.tweens.add({
            targets: sprite,
            x: stopX,
            duration: 1000,
            ease: 'Back.Out',

            onComplete: () => {

                sprite.play(attack._spriteKey);

                scene.time.delayedCall(500, () => {
                    callback();
                });

                sprite.once(
                    Phaser.Animations.Events.ANIMATION_COMPLETE,
                    () => {

                        scene.tweens.add({
                            targets: sprite,
                            x: endX,
                            duration: 600,
                            ease: 'Quad.In',

                            onComplete: () => {
                                cleanup();
                            }
                        });

                    }
                );
            }
        });
    }

    /*
       ____ _     _      _              
      / ___| |__ (_) ___| | _____ _ __  
     | |   | '_ \| |/ __| |/ / _ \ '_ \ 
     | |___| | | | | (__|   <  __/ | | |
      \____|_| |_|_|\___|_|\_\___|_| |_|
    */
    static chicken(attack, callback, cleanup) {

        const { scene, sprite, width, height } = this.#context;

        const startX = -sprite.width;
        const endX = width + sprite.width;

        const groundY = height * 0.25;

        sprite
            .setPosition(startX, groundY)
            .setAlpha(1)
            .setScale(.5)
            .setDepth(DEPTHS.ATTACKS);

        scene.tweens.chain({

            tweens: [

                {
                    targets: sprite,
                    x: width * 0.15,
                    y: groundY - 120,
                    duration: 300,
                    ease: 'Sine.Out',
                },
                {
                    targets: sprite,
                    y: groundY,
                    duration: 250,
                    ease: 'Sine.In',
                    onComplete: () => {
                        this.playSound(attack);
                    }
                },

                {
                    targets: sprite,
                    x: width * 0.45,
                    y: groundY - 80,
                    duration: 250,
                    ease: 'Sine.Out',
                },
                {
                    targets: sprite,
                    y: groundY,
                    duration: 200,
                    ease: 'Sine.In',
                    onComplete: () => {
                        this.playSound(attack);
                    }
                },
                {
                    targets: sprite,
                    x: width * 0.7,
                    y: groundY - 50,
                    duration: 200,
                    ease: 'Sine.Out',
                },
                {
                    targets: sprite,
                    y: groundY,
                    duration: 150,
                    ease: 'Sine.In',
                    onComplete: () => {
                        this.playSound(attack);
                        callback();
                    }
                },

                {
                    targets: sprite,
                    x: endX,
                    duration: 300,
                    ease: 'Sine.In',
                },

            ],

            onComplete: () => {
                cleanup();
            }

        });
    }

    /*
      ____             _ 
     |  _ \ ___   ___ | |
     | |_) / _ \ / _ \| |
     |  __/ (_) | (_) | |
     |_|   \___/ \___/|_|
    */
    static pool(attack, callback, cleanup) {

        const { scene, sprite, width, height } = this.#context;

        const startX = -sprite.width;
        const hoverX = width * 0.5;
        const hoverY = height * 0.2;

        sprite
            .setPosition(startX, hoverY)
            .setRotation(0)
            .setAlpha(1)
            .setScale(.75)
            .setOrigin(.5, .75)
            .setDepth(DEPTHS.ATTACKS);

        scene.tweens.chain({

            tweens: [

                {
                    targets: sprite,
                    x: hoverX,
                    duration: 700,
                    ease: 'Sine.Out',
                },
                {
                    targets: sprite,
                    alpha: 1,
                    duration: 250,
                },
                {
                    targets: sprite,
                    angle: 180,
                    duration: 300,

                    onStart: () => {
                        this.playSound(attack);
                        callback();
                        attack._enemy.playWetAnimation();
                        sprite.play(attack._spriteKey);
                    }
                },
                {
                    targets: sprite,
                    alpha: 1,
                    duration: 250,
                },
                {
                    targets: sprite,
                    x: startX,
                    duration: 500,
                    ease: 'Quad.In',

                    onComplete: () => {
                        sprite.setAngle(0);

                        cleanup();
                    }
                }

            ]

        });
    }

    /*
       ____            _ _        _ 
      / ___|__ _ _ __ (_) |_ __ _| |
     | |   / _` | '_ \| | __/ _` | |
     | |__| (_| | |_) | | || (_| | |
      \____\__,_| .__/|_|\__\__,_|_|
                |_|                 
    */
    static capital(attack, callback, cleanup) {

        const { scene, sprite, width, height, player } = this.#context;

        const startX = width * .3;
        const groundY = height * 0.5;

        sprite
            .setPosition(startX, -sprite.height)
            .setAlpha(1)
            .setAngle(0)
            .setScale(.6)
            .setDepth(DEPTHS.ATTACKS);

        attack._scene.tweens.chain({

            targets: sprite,

            tweens: [

                {
                    y: groundY,
                    duration: 300,
                    ease: "Cubic.In",
                    onComplete: () => {
                        this.playSound(attack);
                        callback();
                    }
                },

                {
                    y: groundY - 25,
                    duration: 120,
                    ease: "Quad.Out",
                    yoyo: true,
                },

                {
                    duration: 500,
                },

                {
                    alpha: 0,
                    duration: 300,
                },
            ],

            onComplete: () => {
                cleanup();
            },
        });
    }

    /*
      ____                 
     | __ )  ___  ___  ___ 
     |  _ \ / _ \/ _ \/ __|
     | |_) |  __/  __/\__ \
     |____/ \___|\___||___/
    */
    static bees(attack, callback, cleanup) {

        const { scene, sprite, width, height } = this.#context;

        sprite.setAlpha(0);

        const beeCount = 5;
        let finishedBees = 0;

        const bees = [];

        this.playSound(attack);

        function buzz(bee, remainingMoves) {

            if (remainingMoves <= 0) {

                scene.tweens.add({
                    targets: bee,
                    x: -100,
                    y: Phaser.Math.Between(0, height),
                    angle: bee.angle + 360,
                    duration: 400,
                    ease: "Quad.In",
                    onComplete: () => {

                        bee.destroy();

                        finishedBees++;

                        if (finishedBees === beeCount) {
                            callback();
                            cleanup();
                        }
                    },
                });

                return;
            }

            scene.tweens.add({
                targets: bee,

                x: Phaser.Math.Between(
                    width * 0.2,
                    width * 0.8
                ),

                y: Phaser.Math.Between(
                    height * 0.2,
                    height * 0.8
                ),

                angle: Phaser.Math.Between(-45, 45),

                duration: Phaser.Math.Between(150, 350),

                ease: "Sine.InOut",

                onComplete: () => {
                    buzz(bee, remainingMoves - 1);
                },
            });
        }

        for (let i = 0; i < beeCount; i++) {

            const bee = scene.add.sprite(
                width + 50,
                height * 0.5 + Phaser.Math.Between(-80, 80),
                attack._spriteKey
            );

            bee
                .setScale(0.4)
                .setAlpha(1);

            bees.push(bee);

            scene.tweens.add({
                targets: bee,

                x: width * 0.3,

                y: bee.y + Phaser.Math.Between(-50, 50),

                duration: 400 + i * 50,

                ease: "Quad.Out",

                onComplete: () => {
                    buzz(bee, 5);
                },
            });
        }
    }

    /*
      ____  _ _        
     | __ )(_) | _____ 
     |  _ \| | |/ / _ \
     | |_) | |   <  __/
     |____/|_|_|\_\___|
    */
    static bike(attack, callback, cleanup) {

        const { scene, sprite, width, height } = this.#context;

        const startX = width * 0.7;
        const startY = height * 0.2;

        const landY = height * 0.5;

        sprite.setAlpha(0);

        const radius = 250;
        const path1 = new Phaser.Curves.Path(startX, startY);
        path1.ellipseTo(
            radius * 1.8,
            radius,
            270,
            180,
            true,
            0
        );
        /*
                scene.add.circle(startX, startY, 5, 0xff0000);
           
           const graphics = scene.add.graphics();
           graphics.lineStyle(4, 0x00ff00, 1);
           path1.draw(graphics);
        */
        const path2 = new Phaser.Curves.Path(startX - (radius * 1.8), landY + radius - 180);
        path2.ellipseTo(
            radius * 1.8,
            radius,
            0,
            270,
            true,
            0
        );
        /*
                scene.add.circle(startX - (radius * 1.8), landY + radius - 180, 5, 0xff0000);
                        const graphics2 = scene.add.graphics();
                        graphics2.lineStyle(4, 0x00ff00, 1);
                        path2.draw(graphics2);
        */
        const follower = scene.add.follower(path1, startX, startY, attack._spriteKey);

        follower
            .setScale(.5)
            .setOrigin(.5)
            .setAlpha(0)
            .setDepth(DEPTHS.ATTACKS);

        follower.flipY = true;
        follower.flipX = true;

        scene.time.delayedCall(100, () => {
            follower.setAlpha(1);
        });

        follower.startFollow({

            duration: 700,
            rotateToPath: true,
            ease: 'Sine.In',
            onComplete: () => {

                callback();
                this.playSound(attack);
                follower.setPath(path2);
                follower.flipX = false;
                follower.flipY = false;

                scene.tweens.add({
                    targets: follower,
                    rotation: -5,
                    duration: 300,
                });

                follower.startFollow({
                    duration: 300,
                    onComplete: () => {

                        follower.destroy();
                        cleanup();

                    }
                });
            }
        });
    }

    static heman(attack, callback, cleanup) {

        const { scene, sprite, width, height } = this.#context;

        sprite
            .setPosition(-sprite.width, height * 0.4)
            .setScale(0.4)
            .setAlpha(1)
            .setDepth(DEPTHS.ATTACKS);

        scene.tweens.add({
            targets: sprite,
            x: width * 0.45,
            duration: 700,
            ease: "Sine.Out",
            onComplete: () => {

                scene.time.delayedCall(500, () => {

                    sprite.play(attack._spriteKey);

                    scene.time.delayedCall(500, () => {

                        this.playSound(attack);

                        scene.tweens.add({
                            targets: sprite,
                            x: width + sprite.width,
                            y: -sprite.height,
                            rotation: 10,
                            duration: 900,
                            onComplete: () => {
                                cleanup();
                            }
                        });

                        scene.time.delayedCall(500, () => {
                            callback();
                        });
                    })
                });
            }
        });
    }

    static throat(attack, callback, cleanup) {

        const { scene, sprite, width, height } = this.#context;

        const sound = attack._scene.sound.add(attack._sound);

        sprite
            .setPosition(width * .7, height * .12)
            .setScale(0.5)
            .setAlpha(1)
            .setDepth(DEPTHS.ATTACKS);

        sprite.play({ key: attack._spriteKey, repeat: -1 });

        scene.time.delayedCall(2000, () => {
            callback();
            cleanup();
        })

        /*
        sound.once("complete", () => {
            
        });
        */

        sound.play();
    }

    static ari(attack, callback, cleanup) {

        const { scene, sprite, width, height } = this.#context;

        const startX = width * 0.28;
        const startY = height * 0.4;

        const landY = height * 0.5;

        sprite.setAlpha(0);

        const radius = 120;
        const path1 = new Phaser.Curves.Path(startX, startY);
        path1.ellipseTo(
            radius * 1.8,
            radius,
            180,
            360,
            false,
            0
        );
        /*
                scene.add.circle(startX, startY, 5, 0xff0000);
                const graphics = scene.add.graphics();
                graphics.lineStyle(4, 0x00ff00, 1);
                path1.draw(graphics);
        */
        const path2 = new Phaser.Curves.Path(startX + (2 * (radius * 1.8)), startY);
        path2.ellipseTo(
            radius * 1.8,
            radius,
            180,
            360,
            false,
            0
        );
        /*
                scene.add.circle(startX + (2 * (radius * 1.8)), startY, 5, 0xff0000);
                const graphics2 = scene.add.graphics();
                graphics2.lineStyle(4, 0x00ff00, 1);
                path2.draw(graphics2);
        */
        const follower = scene.add.follower(path1, startX, startY, attack._spriteKey);

        follower
            .setScale(.35)
            .setOrigin(.5)
            .setAlpha(0)
            .setDepth(DEPTHS.ATTACKS);

        follower.flipY = false;
        follower.flipX = false;

        scene.time.delayedCall(100, () => {
            follower.setAlpha(1);
        });

        scene.tweens.add({
            targets: follower,
            angle: 180,
            ease: 'Sine.In',
            duration: 800,
        });

        follower.startFollow({

            duration: 800,
            ease: 'Sine.In',
            onComplete: () => {

                this.playSound(attack);
                callback();
                follower.setPath(path2);
                follower.flipX = false;
                follower.flipY = false;

                scene.tweens.add({
                    targets: follower,
                    angle: 360,
                    duration: 400,
                });

                follower.startFollow({
                    duration: 400,
                    onComplete: () => {

                        follower.destroy();
                        cleanup();

                    }
                });
            }
        });
    }

    static godzilla(attack, callback, cleanup) {

        const { scene, sprite, width, height } = this.#context;

        const startX = -sprite.width;
        const centerX = scene.scale.width * .42;
        const startY = (height * .6) - (sprite.width / 2);

        sprite
            .setPosition(startX, startY)
            .setDepth(DEPTHS.ATTACKS)
            .setAlpha(1)
            .setScale(.8);

        scene.tweens.add({
            targets: sprite,
            x: centerX,
            duration: 1000,
            ease: 'Sine.Out',

            onComplete: () => {

                scene.time.delayedCall(500, () => {

                    this.playSound(attack);

                    const laser = scene.add.graphics()
                        .setDepth(DEPTHS.ATTACKS);

                    const startLaserX = sprite.x + (sprite.width / 8);
                    const startLaserY = sprite.y - (sprite.height / 4);

                    let { x: endLaserX, y: endLaserY } = this.getEnemyLocation();
                    endLaserX += 75;
                    endLaserY -= 20;

                    const dx = endLaserX - startLaserX;
                    const dy = endLaserY - startLaserY;
                    const length = Math.hypot(dx, dy);

                    const perpX = -dy / length;
                    const perpY = dx / length;

                    const redrawBeam = () => {

                        laser.clear();
                        laser.lineStyle(20, 0x7ca7e8);

                        laser.beginPath();
                        laser.moveTo(startLaserX, startLaserY);

                        const segments = 6;

                        for (let i = 1; i < segments; i++) {

                            const t = i / segments;

                            const x = Phaser.Math.Linear(
                                startLaserX,
                                endLaserX,
                                t
                            );

                            const y = Phaser.Math.Linear(
                                startLaserY,
                                endLaserY,
                                t
                            );

                            const offset = Phaser.Math.Between(-18, 18);

                            laser.lineTo(
                                x + perpX * offset,
                                y + perpY * offset
                            );
                        }

                        laser.lineTo(endLaserX, endLaserY);
                        laser.strokePath();
                    };

                    redrawBeam();

                    const beamTimer = scene.time.addEvent({
                        delay: 70,
                        loop: true,
                        callback: redrawBeam,
                    });

                    callback();

                    scene.time.delayedCall(1000, () => {

                        beamTimer.remove();
                        laser.destroy();

                        scene.tweens.add({
                            targets: sprite,
                            x: startX,
                            duration: 1000,
                            ease: 'Sine.In',
                            onComplete: cleanup
                        });

                    })
                });
            },
        });
    }

    static frog(attack, callback, cleanup) {

        const { scene, sprite, width, height } = this.#context;

        const startX = -sprite.width;
        const endX = width + sprite.width;

        const groundY = height * 0.35;

        sprite
            .setPosition(startX, groundY)
            .setAlpha(1)
            .setScale(.5)
            .setDepth(DEPTHS.ATTACKS);

        scene.tweens.chain({

            tweens: [

                {
                    targets: sprite,
                    x: width * 0.15,
                    y: groundY - 200,
                    duration: 300,
                    ease: 'Sine.Out',
                },
                {
                    targets: sprite,
                    y: groundY,
                    duration: 250,
                    ease: 'Sine.In',
                    onComplete: () => {
                        this.playSound(attack);
                    }
                },

                {
                    targets: sprite,
                    x: width * 0.45,
                    y: groundY - 150,
                    duration: 250,
                    ease: 'Sine.Out',
                },
                {
                    targets: sprite,
                    y: groundY,
                    duration: 200,
                    ease: 'Sine.In',
                    onComplete: () => {
                        this.playSound(attack);
                    }
                },
                {
                    targets: sprite,
                    x: width * 0.7,
                    y: groundY - 100,
                    duration: 200,
                    ease: 'Sine.Out',
                },
                {
                    targets: sprite,
                    y: groundY,
                    duration: 150,
                    ease: 'Sine.In',
                    onComplete: () => {
                        this.playSound(attack);
                        callback();
                    }
                },

                {
                    targets: sprite,
                    x: endX,
                    duration: 300,
                    ease: 'Sine.In',
                },

            ],

            onComplete: () => {
                cleanup();
            }

        });
    }

    static candy(attack, callback, cleanup) {

        const { scene, sprite, width, height } = this.#context;

        const totalFrames = scene.anims.get(attack._spriteKey).getTotalFrames();

        let currentFrame = 0;

        const marginX = sprite.width / 2;
        const marginY = sprite.height / 2;

        let jumps = 0;

        sprite
            .setDepth(DEPTHS.TOP)
            .setScale(.5)
            .setAlpha(1);

        const teleport = () => {

            this.playSound(attack);

            const x = Phaser.Math.Between(
                marginX,
                scene.scale.width - marginX
            );

            const y = Phaser.Math.Between(
                marginY,
                scene.scale.height - marginY
            );

            sprite.setPosition(x, y);

            sprite.setFrame(currentFrame);
            currentFrame = (currentFrame + 1) % totalFrames;

            sprite.setAngle(
                Phaser.Math.Between(-30, 30)
            );

            jumps++;

            if (jumps === 5) {
                callback();
            }

            if (jumps >= 7) {
                cleanup();
                return;
            }

            scene.time.delayedCall(
                250,
                teleport
            );
        };

        teleport();
    }

    static soccer(attack, callback, cleanup) {

        const { scene, sprite, width, height } = this.#context;

        const impactX = width * 0.70;
        const impactY = height * 0.18;

        sprite
            .setPosition(-sprite.width, height * .6)
            .setScale(0.45)
            .setAlpha(1)
            .setDepth(DEPTHS.ATTACKS);

        scene.tweens.add({
            targets: sprite,
            x: impactX,
            y: impactY,
            angle: 720,
            duration: 700,
            ease: "Quad.In",

            onComplete: () => {

                callback();
                this.playSound(attack);

                scene.tweens.add({
                    targets: sprite,
                    x: -sprite.width,
                    y: impactY - 70,
                    angle: 1800,
                    scale: 0.35,
                    duration: 400,
                    ease: "Quad.Out",

                    onComplete: () => {
                        cleanup();
                    }
                });
            }
        });

    }

    static monster(attack, callback, cleanup) {

        const { scene, sprite, width, height } = this.#context;

        const { x: startX, y: startY } = this.getEnemyLocation();

        sprite
            .setPosition(startX, startY)
            .setScale(0.5)
            .setDepth(DEPTHS.TOP)
            .setAlpha(1);

        sprite.play(attack._spriteKey);

        this.playSound(attack);

        scene.tweens.add({
            targets: sprite,
            x: width * 0.25,
            y: height * 0.75,
            scale: .8,
            duration: 1500,
            onComplete: () => {
                cleanup();
                callback();
            }
        });
    }

    static eye(attack, callback, cleanup) {

        const { scene, sprite, width, height } = this.#context;
        const groundY = height * 0.40;

        sprite
            .setPosition(width * 0.45, -sprite.height)
            .setScale(0.5)
            .setDepth(DEPTHS.ATTACKS)
            .setAlpha(1);

        scene.tweens.add({
            targets: sprite,
            y: groundY,
            duration: 650,
            ease: "Bounce",
            onComplete: () => {

                sprite.setFrame(1);

                scene.time.delayedCall(750, () => {

                    sprite.setFrame(2);

                    scene.time.delayedCall(750, () => {

                        sprite.setFrame(3);

                        this.playSound(attack);

                        scene.tweens.add({
                            targets: sprite,
                            x: -sprite.width,
                            y: height * .8,
                            duration: 500,
                            ease: "Quad.In",
                            onComplete: () => {
                                cleanup();
                                callback();
                            }
                        });
                    })
                })
            }
        });
    }

    static dwarf(attack, callback, cleanup) {

        const { scene, sprite, width, height } = this.#context;

        sprite
            .setPosition(width * .28, height * .60)
            .setAlpha(1)
            .setScale(.5)
            .setDepth(DEPTHS.TOP);

        this.playSound(attack);

        sprite.play(attack._spriteKey);

        sprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + attack._spriteKey, () => {
            callback();
            cleanup();
        });
    }

    static potato(attack, callback, cleanup) {

        const { scene, sprite, width, height } = this.#context;

        const endX = width * .4;
        const endY = height * .3;

        const ian = scene.add.sprite(0, 0, BATTLE_ASSET_KEYS.IAN)
            .setAlpha(0)
            .setPosition(endX, endY)
            .setScale(.22)
            .setDepth(DEPTHS.ATTACKS);

        scene.anims.create({
            key: "ian",
            frames: scene.anims.generateFrameNumbers(
                BATTLE_ASSET_KEYS.IAN,
                {
                    start: 1,
                    end: 4,
                }
            ),
            frameRate: 1,
            repeat: 0,
        });

        const left = scene.add.sprite(0, 0, attack._spriteKey, 1)
            .setAlpha(0)
            .setScale(0.5)
            .setPosition(endX, endY)
            .setDepth(DEPTHS.ATTACKS);

        const right = scene.add.sprite(0, 0, attack._spriteKey, 2)
            .setAlpha(0)
            .setScale(0.5)
            .setPosition(endX, endY)
            .setDepth(DEPTHS.ATTACKS);

        this.#potatoRoll(endX, endY, (data) => {
            this.#potatoSplit(data, ian, left, right, () => {
                this.#potatoReveal(scene, ian, () => {
                    this.#potatoCards(ian, () => {
                        this.#potatoExit(ian, () => {

                            cleanup();
                            callback();

                        });
                    });
                });
            });
        });
    }

    static #potatoRoll(endX, endY, callback) {

        const { scene, sprite, width, height } = this.#context;

        sprite
            .setScale(0.5)
            .setPosition(-sprite.width, endY)
            .setDepth(DEPTHS.ATTACKS)
            .setAlpha(1);

        const container = scene.add.container(sprite.x, sprite.y, [sprite]);

        scene.tweens.add({
            targets: container,
            x: endX,
            duration: 1800,
            ease: "Sine.Out",
            onUpdate: () => {
                sprite.angle += 10;
                const r = Phaser.Math.DegToRad(sprite.angle);
                sprite.y = Math.abs(Math.sin(r)) * 5;
                sprite.x = Math.cos(r) * 4;
            },
            onComplete: () => {
                scene.time.delayedCall(800, () => {
                    callback({
                        container
                    });
                })
            }
        });
    }

    static #potatoSplit(data, ian, left, right, callback) {

        const { sprite, scene, width, height } = this.#context;

        const x = data.container.x;
        const y = data.container.y;

        data.container.destroy();

        ian.setFrame(0);

        left.setAlpha(1);
        right.setAlpha(1);
        ian.setAlpha(1);

        scene.tweens.add({
            targets: left,
            x: -100,
            y: height * .5,
            angle: -120,
            duration: 700,
        });

        scene.tweens.add({
            targets: right,
            x: width + 100,
            y: height * .3,
            angle: 120,
            duration: 700,
            onComplete: () => {
                left.destroy();
                right.destroy();
                callback(ian);
            }
        });

    }

    static #potatoReveal(scene, ian, callback) {

        console.log("potato reveal");

        scene.time.delayedCall(500, () => {

            ian.play("ian");

            scene.time.delayedCall(2000, () => {
                callback();
            })
        })
    }

    static #potatoCards(ian, callback) {

        const { enemy, scene } = this.#context;

        let emitted = 0;

scene.time.delayedCall(500,()=>{
    enemy.playTakeDamageAnimation(2000);
})

        const timer = scene.time.addEvent({

            delay: 100,
            repeat: 29,

            callback: () => {

                this.#emitCard(ian, emitted);
                emitted++;
                if (emitted === 30) {
                    scene.time.delayedCall(500, callback);
                }
            }
        });
    }

    static #emitCard(ian, emitted) {

        const { scene, width, height } = this.#context;

        const card = scene.add.sprite(
            ian.x + 105,
            ian.y - 60,
            BATTLE_ASSET_KEYS.INNOVATION,
            emitted
        );

        card
            .setDepth(DEPTHS.ATTACKS)
            .setScale(.6);

        const launchAngle = Phaser.Math.Between(0, 30);
        const radians = Phaser.Math.DegToRad(launchAngle);

        const distance = width * .6;

        const targetX = card.x + Math.cos(radians) * distance;
        const targetY = card.y + Math.sin(radians) * distance;

        card.setAngle(launchAngle);

        scene.tweens.add({
            targets: card,
            x: targetX,
            y: targetY,
            duration: Phaser.Math.Between(400, 600),
            onComplete: () => {
                card.destroy();
            }
        });
    }

    static #potatoExit(ian, callback) {

        console.log("potato exit");

        const { scene } = this.#context;

        ian.setFrame(1);

        scene.time.delayedCall(600, () => {
            scene.tweens.add({
                targets: ian,
                x: -ian.width,
                duration: 1500,
                ease: "Sine.In",
                onComplete: () => {
                    ian.destroy();
                    callback();
                }
            });
        })


    }
}