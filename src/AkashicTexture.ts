import { Texture, TextureFilter, TextureWrap } from '@esotericsoftware/spine-core';

export class AkashicTexture extends Texture {
  private _imageAsset: g.ImageAsset;

  constructor(image: g.ImageAsset) {
    super((image as any).data);
    this._imageAsset = image;
  }

  setFilters(_minFilter: TextureFilter, _magFilter: TextureFilter) {
    // nothing to do
  }

  setWraps(_uWrap: TextureWrap, _vWrap: TextureWrap) {
    // nothing to do
  }

  dispose() {
    // nothing to do
  }

  getSurface() {
    return this._imageAsset.asSurface();
  }
}
