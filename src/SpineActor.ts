import {
  AtlasAttachmentLoader,
  Skeleton,
  TextureAtlas,
  SkeletonJson,
  AnimationState,
  AnimationStateData,
  TrackEntry,
  Event as SpineEvent,
} from '@esotericsoftware/spine-core';
import { AkashicTexture } from './AkashicTexture';
import { renderSkeleton } from './renderSkeleton';

export interface SpineActorParameterObject extends g.EParameterObject {
  images: g.ImageAsset[];
  skeleton: g.TextAsset;
  atlas: g.TextAsset;
  animationDefaultMix?: number;
  debug?: boolean;
}

export class SpineActor extends g.E {
  get skeleton(): Skeleton {
    return this._skeleton;
  }

  private _skeleton!: Skeleton;
  private _animationState!: AnimationState;
  private _debug: boolean;

  private _onAnimationStart: g.Trigger<TrackEntry>;
  private _onAnimationInterrupt: g.Trigger<TrackEntry>;
  private _onAnimationEnd: g.Trigger<TrackEntry>;
  private _onAnimationDispose: g.Trigger<TrackEntry>;
  private _onAnimationComplete: g.Trigger<TrackEntry>;
  private _onAnimationEvent: g.Trigger<[TrackEntry, SpineEvent]>;

  constructor(params: SpineActorParameterObject) {
    super(params);
    this._debug = params.debug || false;
    this._onAnimationStart = new g.Trigger();
    this._onAnimationInterrupt = new g.Trigger();
    this._onAnimationEnd = new g.Trigger();
    this._onAnimationDispose = new g.Trigger();
    this._onAnimationComplete = new g.Trigger();
    this._onAnimationEvent = new g.Trigger();

    this._createSkeleton(params);
    this._createAnimation(params);

    this.onUpdate.add(this._handleUpdate.bind(this));
  }

  get onAnimationStart() {
    return this._onAnimationStart;
  }

  get onAnimationInterrupt() {
    return this._onAnimationInterrupt;
  }

  get onAnimationEnd() {
    return this._onAnimationEnd;
  }

  get onAnimationDispose() {
    return this._onAnimationDispose;
  }

  get onAnimationComplete() {
    return this._onAnimationComplete;
  }

  get onAnimationEvent() {
    return this._onAnimationEvent;
  }

  get debug() {
    return this._debug;
  }

  set debug(value: boolean) {
    this._debug = value;
  }

  private _createSkeleton(params: SpineActorParameterObject) {
    const atlas = new TextureAtlas(params.atlas.data);
    atlas.pages.forEach((page) => {
      const image = params.images.find((image) => image.originalPath.endsWith(page.name));
      if (!image) return;
      const texture = new AkashicTexture(image);
      page.setTexture(texture);
    });

    const atlasLoader = new AtlasAttachmentLoader(atlas);
    const skeletonJson = new SkeletonJson(atlasLoader);
    const skeletonData = skeletonJson.readSkeletonData(params.skeleton.data);
    this._skeleton = new Skeleton(skeletonData);
    this._skeleton.setToSetupPose();
    this._skeleton.updateWorldTransform();
  }

  private _createAnimation(params: SpineActorParameterObject) {
    const animationStateData = new AnimationStateData(this._skeleton.data);
    animationStateData.defaultMix = params.animationDefaultMix || 0;
    this._animationState = new AnimationState(animationStateData);

    this._animationState.addListener({
      start: (track: TrackEntry) => this._onAnimationStart.fire(track),
      interrupt: (track: TrackEntry) => this._onAnimationInterrupt.fire(track),
      end: (track: TrackEntry) => this._onAnimationEnd.fire(track),
      dispose: (track: TrackEntry) => this._onAnimationDispose.fire(track),
      complete: (track: TrackEntry) => this._onAnimationComplete.fire(track),
      event: (track: TrackEntry, event: SpineEvent) => this._onAnimationEvent.fire([track, event]),
    });
  }

  private _handleUpdate() {
    this._animationState.update(1 / this.scene.game.fps);
    this.modified();
  }

  setAnimation(name: string, loop: boolean = false) {
    this._animationState.setAnimation(0, name, loop);
  }

  appendAnimation(name: string, loop: boolean = false) {
    this._animationState.addAnimation(this._animationState.tracks.length, name, loop);
  }

  clearAnimation() {
    this._animationState.clearTracks();
  }

  renderSelf(renderer: g.Renderer, _camera?: g.Camera) {
    this._skeleton.scaleY = -1;
    this._animationState.apply(this._skeleton);
    this._skeleton.updateWorldTransform();

    renderSkeleton(renderer, this._skeleton, this._debug);

    return true;
  }
}
