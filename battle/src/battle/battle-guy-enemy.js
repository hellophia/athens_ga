import { BattleGuy } from './battle-guy.js';
import { animateText } from '../misc/text.js';
import { BATTLE_ASSET_KEYS, DATA_ASSET_KEYS, DEPTHS, FIGHTER_ASSET_KEYS, SFX_KEYS } from '../misc/asset-keys.js';
import { HealthBar } from './health-bar.js';

/** @type {import('../types/typedef.js').Coordinate} */
const ENEMY_POSITION = Object.freeze({
  x: 738,
  y: 160,
});

export class EnemyBattleGuy extends BattleGuy {
  /** @protected @type {boolean} */
  _isStunned;
  /** @type {number} */
  #prankedFrameIndex;

  /**
   *
   * @param {import("../types/typedef.js").BattleGuyConfig} config
   */
  constructor(config) {
    super(config, ENEMY_POSITION);
    this._guyGameSprite.setDepth(DEPTHS.ENEMY);
    this._loadAttacksFromCache(DATA_ASSET_KEYS.ENEMY_ATTACKS);
    this._isStunned = false;
    this.#prankedFrameIndex = 0;
    this._guyGameSprite.setScale(.63);

    this._scene.anims.create({
      key: 'enemy-idle-1',
      frames: this._scene.anims.generateFrameNumbers(
        FIGHTER_ASSET_KEYS.ENEMY,
        {
          start: 0,
          end: 0,
        }
      ),
      frameRate: 6,
      repeat: -1,
    });

    this._scene.anims.create({
      key: 'enemy-idle-2',
      frames: this._scene.anims.generateFrameNumbers(
        FIGHTER_ASSET_KEYS.ENEMY,
        {
          start: 1,
          end: 1,
        }
      ),
      frameRate: 6,
      repeat: -1,
    });

    this._scene.anims.create({
      key: 'enemy-idle-3',
      frames: this._scene.anims.generateFrameNumbers(
        FIGHTER_ASSET_KEYS.ENEMY,
        {
          start: 2,
          end: 2,
        }
      ),
      frameRate: 6,
      repeat: -1,
    });

    this._scene.anims.create({
      key: 'enemy-idle-4',
      frames: this._scene.anims.generateFrameNumbers(
        FIGHTER_ASSET_KEYS.ENEMY,
        {
          start: 3,
          end: 3,
        }
      ),
      frameRate: 6,
      repeat: -1,
    });

    this._scene.anims.create({
      key: 'enemy-hurt-1',
      frames: this._scene.anims.generateFrameNumbers(
        FIGHTER_ASSET_KEYS.ENEMY,
        {
          start: 18,
          end: 18,
        }
      ),
      frameRate: 2,
      repeat: 0,
    });

    this._scene.anims.create({
      key: 'enemy-hurt-2',
      frames: this._scene.anims.generateFrameNumbers(
        FIGHTER_ASSET_KEYS.ENEMY,
        {
          start: 19,
          end: 19,
        }
      ),
      frameRate: 2,
      repeat: 0,
    });

    this._scene.anims.create({
      key: 'enemy-hurt-3',
      frames: this._scene.anims.generateFrameNumbers(
        FIGHTER_ASSET_KEYS.ENEMY,
        {
          start: 20,
          end: 20,
        }
      ),
      frameRate: 2,
      repeat: 0,
    });

    this._scene.anims.create({
      key: 'enemy-hurt-4',
      frames: this._scene.anims.generateFrameNumbers(
        FIGHTER_ASSET_KEYS.ENEMY,
        {
          start: 21,
          end: 21,
        }
      ),
      frameRate: 2,
      repeat: 0,
    });

    this._scene.anims.create({
      key: 'enemy-attack-1',
      frames: this._scene.anims.generateFrameNumbers(
        FIGHTER_ASSET_KEYS.ENEMY,
        {
          start: 14,
          end: 14,
        }
      ),
      frameRate: 6,
      repeat: 0,
    });

    this._scene.anims.create({
      key: 'enemy-attack-2',
      frames: this._scene.anims.generateFrameNumbers(
        FIGHTER_ASSET_KEYS.ENEMY,
        {
          start: 15,
          end: 15,
        }
      ),
      frameRate: 6,
      repeat: 0,
    });

    this._scene.anims.create({
      key: 'enemy-attack-3',
      frames: this._scene.anims.generateFrameNumbers(
        FIGHTER_ASSET_KEYS.ENEMY,
        {
          start: 16,
          end: 16,
        }
      ),
      frameRate: 6,
      repeat: 0,
    });

    this._scene.anims.create({
      key: 'enemy-attack-4',
      frames: this._scene.anims.generateFrameNumbers(
        FIGHTER_ASSET_KEYS.ENEMY,
        {
          start: 17,
          end: 17,
        }
      ),
      frameRate: 6,
      repeat: 0,
    });

    this._scene.anims.create({
      key: 'enemy-pranked',
      frames: this._scene.anims.generateFrameNumbers(
        FIGHTER_ASSET_KEYS.ENEMY,
        {
          start: 8,
          end: 11,
        }
      ),
      frameRate: .5,
      repeat: 0,
    });

    this._scene.anims.create({
      key: 'enemy-sulk',
      frames: this._scene.anims.generateFrameNumbers(
        FIGHTER_ASSET_KEYS.ENEMY,
        {
          start: 12,
          end: 12,
        }
      ),
      frameRate: 3,
      repeat: 0,
    });

    this._scene.anims.create({
      key: 'enemy-sus',
      frames: this._scene.anims.generateFrameNumbers(
        FIGHTER_ASSET_KEYS.ENEMY,
        {
          start: 13,
          end: 13,
        }
      ),
      frameRate: 3,
      repeat: 0,
    });

    this._scene.anims.create({
      key: 'enemy-snack',
      frames: this._scene.anims.generateFrameNumbers(
        FIGHTER_ASSET_KEYS.ENEMY,
        {
          start: 4,
          end: 7,
        }
      ),
      frameRate: 2,
      repeat: 0,
    });

    this._scene.anims.create({
      key: 'enemy-dead',
      frames: this._scene.anims.generateFrameNumbers(
        FIGHTER_ASSET_KEYS.ENEMY,
        {
          start: 22,
          end: 22,
        }
      ),
      frameRate: 3,
      repeat: 0,
    });

  }

  get isStunned() {
    return this._isStunned;
  }

  stun() {
    this._isStunned = true;
  }

  unStun() {
    this._isStunned = false;
  }

  /**
   * @param {() => void} callback
   * @returns {void}
   */
  playGuyAppearAnimation(callback) {
    this.playIdleAnimation();
    const startXPos = -this._guyGameSprite.width;
    const endXPos = ENEMY_POSITION.x;
    this._guyGameSprite.setPosition(startXPos, ENEMY_POSITION.y);
    this._guyGameSprite.setAlpha(1);

    this._scene.time.delayedCall(2000, () => {
      this._scene.tweens.add({
        duration: 1625,
        x: {
          from: startXPos,
          start: startXPos,
          to: endXPos,
        },
        ease: 'Sine.easeOut',
        targets: this._guyGameSprite,
        onComplete: () => {
          callback();
        },
      });
    });
  }

  /**
   * @param {() => void} callback
   * @returns {void}
   */
  playGuyHealthBarAppearAnimation(callback) {
    const duration = 4500;
    const nameduration = duration - 2000;

    this._guyNameGameText.text = '';
    this._healthBar.setMeterPercentage(0);

    this.healthBarContainer.setAlpha(1);

    this._healthBar.appearAnimated(1, { duration });

    const nameLength = Math.max(1, this.name.length);
    const perCharDelay = Math.max(1, Math.floor(nameduration / nameLength));

    this._scene.time.delayedCall((duration - nameduration) / 2, () => {
      animateText(this._scene, this._guyNameGameText, this.name.toUpperCase(), { delay: perCharDelay });
    })

    this._scene.time.delayedCall(duration, () => {
      if (callback) callback();
    });
  }

  playIdleAnimation() {
    if (this._currentHealth >= 75) {
      this._guyGameSprite.play("enemy-idle-1");
    } else if (this._currentHealth >= 50) {
      this._guyGameSprite.play("enemy-idle-2");
    } else if (this._currentHealth >= 25) {
      this._guyGameSprite.play("enemy-idle-3");
    } else {
      this._guyGameSprite.play("enemy-idle-4");
    }
  }

  playTakeDamageAnimation(duration = 1000) {
    if (this._currentHealth >= 75) {
      this._guyGameSprite.play("enemy-hurt-1");
    } else if (this._currentHealth >= 50) {
      this._guyGameSprite.play("enemy-hurt-2");
    } else if (this._currentHealth >= 25) {
      this._guyGameSprite.play("enemy-hurt-3");
    } else {
      this._guyGameSprite.play("enemy-hurt-4");
    }
    this.damageTween();

    this._guyGameSprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      if (this.isFainted) {
        this._scene.sound.play(SFX_KEYS.OUCH);
        this.playDeathAnimation();
      } else {
        this.playIdleAnimation();
      }
    });

  }

  playAttackAnimation() {
    if (this._currentHealth >= 75) {
      this._guyGameSprite.play("enemy-attack-1");
    } else if (this._currentHealth >= 50) {
      this._guyGameSprite.play("enemy-attack-2");
    } else if (this._currentHealth >= 25) {
      this._guyGameSprite.play("enemy-attack-3");
    } else {
      this._guyGameSprite.play("enemy-attack-4");
    }
    this._scene.time.delayedCall(1000, () => {
      this.playIdleAnimation();
    });
  };

  playPrankedAnimation() {

    this._guyGameSprite.stop();

    const anim = this._scene.anims.get("enemy-pranked");
    const frame = anim.frames[this.#prankedFrameIndex];

    console.log(frame);

    this._guyGameSprite.setFrame(frame.textureFrame);

    if (this.#prankedFrameIndex < anim.frames.length - 1) {
      this.#prankedFrameIndex++;
    }

  }

  playSulkAnimation() {

    this._guyGameSprite.play("enemy-sulk");
    this._scene.time.delayedCall(1000, () => {
      this._guyGameSprite.stop();
      const anim = this._scene.anims.get("enemy-pranked");
      const frame = anim.frames[this.#prankedFrameIndex];
      this._guyGameSprite.setFrame(frame.textureFrame);
      this.#prankedFrameIndex = 0;
    });
  };

  playSusAnimation() {
    this._guyGameSprite.play("enemy-sus");
    this._scene.time.delayedCall(1000, () => {
      this.playIdleAnimation();
    });
  };

  playSnackAnimation() {
    const enemyX = this._guyGameSprite.x;
    const enemyY = this._guyGameSprite.y;

    this._guyGameSprite.setDepth(DEPTHS.PLAYER);

    this._scene.tweens.chain({

      tweens: [
        {
          targets: this._guyGameSprite,
          x: this._scene.scale.width * .4,
          y: this._scene.scale.height * .45,
          scale: 1,
          duration: 500,
          ease: "Sine.easeInOut",
        },
        {
          targets: this._guyGameSprite,
          x: enemyX,
          y: enemyY,
          scale: .63,
          duration: 500,
          ease: "Sine.easeInOut",
        },
      ],
    });

    this._guyGameSprite.play("enemy-snack");
    this._guyGameSprite.once(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + "enemy-snack", () => {
      this._guyGameSprite.setDepth(DEPTHS.ENEMY);
      this.playIdleAnimation();
    });

  };

  playDeathAnimation() {
    this._guyGameSprite.play("enemy-dead");
  };

  /**
 * @returns {void}
 */
  rotateAttacksLeft() {
    if (!Array.isArray(this._guyAttacks) || this._guyAttacks.length < 2) return;
    this._guyAttacks.push(this._guyAttacks.shift());
  }

  createHealthBarComponents() {
    this._healthBar = new HealthBar(this._scene, 21, 66);

    this._guyNameGameText = this._scene.add.text(20, 0, this.name.toUpperCase(), {
      color: '#9a0000',
      fontSize: '40px',
      fontFamily: 'VT323'
    });

    this._healthBarBgImage = this._scene.add.image(0, 0, BATTLE_ASSET_KEYS.HEALTH_BAR_BACKGROUND)
      .setOrigin(0).setScale(.25).setPosition(0, 40);

    this.healthBarContainer = this._scene.add.container(0, 0, [
      this._healthBarBgImage,
      this._guyNameGameText,
      this._healthBar.container,
    ]).setAlpha(0);

    this.healthBarContainer.setPosition(76, 29).setDepth(DEPTHS.ENEMY_HEALTH);
  }

}