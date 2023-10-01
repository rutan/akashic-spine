// porting for akashic-engine from @esotericsoftware/spine-canvas/CanvasRenderer

/******************************************************************************
 * Spine Runtimes License Agreement
 * Last updated July 28, 2023. Replaces all prior versions.
 *
 * Copyright (c) 2013-2023, Esoteric Software LLC
 *
 * Integration of the Spine Runtimes into software or otherwise creating
 * derivative works of the Spine Runtimes is permitted under the terms and
 * conditions of Section 2 of the Spine Editor License Agreement:
 * http://esotericsoftware.com/spine-editor-license
 *
 * Otherwise, it is permitted to integrate the Spine Runtimes into software or
 * otherwise create derivative works of the Spine Runtimes (collectively,
 * "Products"), provided that each user of the Products must obtain their own
 * Spine Editor license and redistribution of the Products in any form must
 * include this license and copyright notice.
 *
 * THE SPINE RUNTIMES ARE PROVIDED BY ESOTERIC SOFTWARE LLC "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL ESOTERIC SOFTWARE LLC BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES,
 * BUSINESS INTERRUPTION, OR LOSS OF USE, DATA, OR PROFITS) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THE
 * SPINE RUNTIMES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *****************************************************************************/

import { RegionAttachment, Skeleton, TextureRegion } from '@esotericsoftware/spine-core';
import { AkashicTexture } from './AkashicTexture';

const DEBUG_LINE_COLOR = 'green';

export function renderSkeleton(renderer: g.Renderer, skeleton: Skeleton, debug?: boolean) {
  const skeletonColor = skeleton.color;
  const drawOrder = skeleton.drawOrder;

  for (let i = 0, n = drawOrder.length; i < n; i++) {
    const slot = drawOrder[i];
    const bone = slot.bone;
    if (!bone.active) continue;

    const attachment = slot.getAttachment();
    if (!(attachment instanceof RegionAttachment)) continue;

    renderer.save();

    renderer.transform([bone.a, bone.c, bone.b, bone.d, bone.worldX, bone.worldY]);
    renderer.translate(attachment.offset[0], attachment.offset[1]);
    const cos = Math.cos((attachment.rotation * Math.PI) / 180);
    const sin = Math.sin((attachment.rotation * Math.PI) / 180);
    renderer.transform([cos, sin, -sin, cos, 0, 0]);

    const region = <TextureRegion>attachment.region;
    const atlasScale = attachment.width / region.originalWidth;
    renderer.transform([atlasScale * attachment.scaleX, 0, 0, atlasScale * attachment.scaleY, 0, 0]);

    let w = region.width;
    let h = region.height;
    renderer.translate(w / 2, h / 2);

    if (region.degrees === 90) {
      let t = w;
      w = h;
      h = t;
      const cos = Math.cos(-Math.PI / 2);
      const sin = Math.sin(-Math.PI / 2);
      renderer.transform([cos, sin, -sin, cos, 0, 0]);
    }
    renderer.transform([1, 0, 0, -1, 0, 0]);
    renderer.translate(-w / 2, -h / 2);

    if (debug) {
      renderer.setOpacity(1);
      renderer.fillRect(0, 0, w, 1, DEBUG_LINE_COLOR);
      renderer.fillRect(0, h - 1, w, 1, DEBUG_LINE_COLOR);
      renderer.fillRect(0, 1, 1, h - 1, DEBUG_LINE_COLOR);
      renderer.fillRect(w - 1, 1, 1, h - 1, DEBUG_LINE_COLOR);
    }

    const image = (region.texture as AkashicTexture).getSurface();
    const colorAlpha = skeletonColor.a * slot.color.a * attachment.color.a;

    renderer.setOpacity(colorAlpha);
    renderer.drawImage(image, image.width * region.u, image.height * region.v, w, h, 0, 0);

    renderer.restore();
  }
}
