"use client";

import { useSyncExternalStore } from "react";

// ゲーム画面の基準サイズ（16:9）。ページはすべてこの大きさで作る。
export const STAGE_WIDTH = 1920;
export const STAGE_HEIGHT = 1080;

// ウィンドウに収まるように、基準サイズを何倍にすればいいか
function getScale() {
  return Math.min(
    window.innerWidth / STAGE_WIDTH,
    window.innerHeight / STAGE_HEIGHT,
  );
}

function subscribe(onChange: () => void) {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
}

/*
 * 全ページを 1920×1080 で描いてから、ウィンドウに合わせて拡大・縮小する枠。
 * ウィンドウの大きさや形が変わっても、中身は常に 16:9 で同じ見た目になる。
 * （余ったところは黒帯。見た目は globals.css の .stage / .stageInner）
 */
export default function Stage({ children }: { children: React.ReactNode }) {
  // サーバーではウィンドウの大きさが分からないので null（表示しない）
  const scale = useSyncExternalStore(subscribe, getScale, () => null);

  return (
    <div className="stage">
      <div
        className="stageInner"
        style={{
          width: STAGE_WIDTH,
          height: STAGE_HEIGHT,
          transform: `scale(${scale ?? 1})`,
          visibility: scale === null ? "hidden" : undefined,
        }}
      >
        {children}
      </div>
    </div>
  );
}
