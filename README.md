# @rutan/akashic-spine

[Spine](https://esotericsoftware.com/) で作成したアニメーションを [Akashic Engine](https://akashic-games.github.io/) 上で再生します。

## Support version
- Akashic Engine 3.x
- Spine 4.1

## How to use

### Install

```
akashic install @rutan/akashic-spine
```

### Usage

```typescript
import { SpineActor } from '@rutan/akashic-spine';

const skeleton = scene.asset.getText('/path/to/my-spine-animation.json');
const atlas = scene.asset.getText('/path/to/my-spine-animation.atlas');
const images = [scene.asset.getImage('/path/to/my-spine-animation.png')];

const actor = new SpineActor({
  scene,
  skeleton,
  atlas,
  images,
  debug: true,
});
actor.setAnimation('walk', true);
scene.append(actor);
```

具体的な例は `demo/sample` を参照してください。

## License

- `@rutan/akashic-spine` is released under the MIT License.
- `@esotericsoftware/spine-core` and `@esotericsoftware/spine-canvas` are released under [Spine Runtimes License Agreement](http://ja.esotericsoftware.com/spine-runtimes-license)
