import { SampleScene } from './Sample';

function main() {
  const scene = new SampleScene({
    game: g.game,
    assetPaths: ['/assets/**/*'],
  });

  g.game.pushScene(scene);
}

module.exports = main;
