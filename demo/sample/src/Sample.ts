import { SpineActor } from '@rutan/akashic-spine';

export class SampleScene extends g.Scene {
  private _wrapper!: g.E;
  private _actor!: SpineActor;
  private _buttonFont: g.DynamicFont;

  constructor(params: g.SceneParameterObject) {
    super(params);
    this._buttonFont = new g.DynamicFont({
      game: this.game,
      fontFamily: 'sans-serif',
      size: 40,
      fontWeight: 'bold',
    });

    this.onLoad.addOnce(() => {
      this._createWrapper();
      this._createActor();
      this._createScreenButtons();
      this._createAnimationButtons();
    });
  }

  private _createWrapper() {
    this._wrapper = new g.E({
      scene: this,
      anchorX: 0.5,
      anchorY: 0.5,
      x: this.game.width / 2,
      y: this.game.height / 2,
    });
    this.append(this._wrapper);
  }

  private _createActor() {
    const image = this.asset.getImage('/assets/spineboy.png');
    const atlas = this.asset.getText('/assets/spineboy.atlas');
    const skeleton = this.asset.getText('/assets/spineboy-ess.json');

    this._actor = new SpineActor({
      scene: this,
      skeleton,
      atlas,
      images: [image],
      animationDefaultMix: 0.2,
      debug: true,
      y: 200,
      scaleX: 0.5,
      scaleY: 0.5,
    });
    this._actor.setAnimation('idle', true);
    this._wrapper.append(this._actor);
  }

  private _createScreenButtons() {
    let timer = -1;
    this._wrapper.onUpdate.add(() => {
      if (timer < 0) return;

      this._wrapper.x = this.game.width / 2 + Math.sin(timer / 120) * 300;
      this._wrapper.y = this.game.height / 2 + Math.sin(timer / 155) * 200;
      this._wrapper.angle += 1;
      this._wrapper.scaleX = this._wrapper.scaleY = 1 + Math.sin(timer / 60);
      this._wrapper.modified();
      ++timer;
    });

    const button = this._createButtonEntity('spin');
    button.onPointDown.add(() => {
      if (timer >= 0) {
        timer = -1;
        this._wrapper.x = this.game.width / 2;
        this._wrapper.y = this.game.height / 2;
        this._wrapper.angle = 0;
        this._wrapper.scaleX = this._wrapper.scaleY = 1;
        this._wrapper.modified();
      } else {
        timer = 0;
      }
    });
    this.append(button);
  }

  private _createAnimationButtons() {
    let lastLoopAnimation = 'idle';

    (
      [
        ['idle', true],
        ['walk', true],
        ['run', true],
        ['jump', false],
        ['aim', false],
        ['shoot', false],
        ['hit', false],
        ['death', false],
      ] as const
    ).forEach(([animationName, loop], i) => {
      const button = this._createButtonEntity(animationName);
      button.x = 110 * i;
      button.y = this.game.height - 50;
      button.onPointDown.add(() => {
        this._actor.setAnimation(animationName, loop);

        if (loop) {
          lastLoopAnimation = animationName;
        } else {
          this._actor.onAnimationComplete.addOnce(() => {
            this._actor.setAnimation(lastLoopAnimation, true);
          });
        }
      });
      this.append(button);
    });
  }

  private _createButtonEntity(text: string) {
    const button = new g.FilledRect({
      scene: this,
      width: 100,
      height: 50,
      cssColor: '#fff',
      touchable: true,
    });
    const label = new g.Label({
      scene: this,
      text,
      font: this._buttonFont,
      textAlign: 'center',
      x: button.width / 2,
      y: button.height / 2,
      width: button.width,
      height: button.height,
      anchorX: 0.5,
      anchorY: 0.5,
      scaleX: 0.5,
      scaleY: 0.5,
    });
    button.append(label);

    return button;
  }
}
