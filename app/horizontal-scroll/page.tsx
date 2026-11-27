"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import GameMenu from "../_components/GameMenu";
import {
  startHorizontalScrollGame,
  type Direction,
  type HorizontalScrollGame,
} from "./game";
import styles from "./horizontal-scroll.module.css";

export default function HorizontalScrollPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<HorizontalScrollGame | null>(null);
  const [showEnding, setShowEnding] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // ページを開いたらゲームを始め、離れたら止める
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const game = startHorizontalScrollGame({
      canvas,
      onEnding: () => setShowEnding(true),
    });
    gameRef.current = game;

    return () => {
      game.stop();
      gameRef.current = null;
    };
  }, []);

  // メニューを開いている間はゲームを止める
  useEffect(() => {
    gameRef.current?.setPaused(menuOpen);
  }, [menuOpen]);

  // Esc でメニューを開く（開いているときは GameMenu が Esc で閉じる）
  // シークレットエンドの画面では開かない
  useEffect(() => {
    if (menuOpen || showEnding) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(true);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen, showEnding]);

  // ← → ボタン（押している間だけ移動する）
  // どちらのボタンかは data-direction で見分ける
  const handlePress = (event: React.PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const direction = event.currentTarget.dataset.direction as Direction;
    gameRef.current?.setPressed(direction, true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleRelease = (event: React.PointerEvent<HTMLButtonElement>) => {
    const direction = event.currentTarget.dataset.direction as Direction;
    gameRef.current?.setPressed(direction, false);
  };

  return (
    <div className={styles.screen}>
      <main className={styles.gameWrap}>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          width={1920}
          height={1080}
          aria-label="横スクロール"
        />

        <div className={styles.controls} aria-label="移動方法">
          {(["left", "right"] as const).map((direction) => (
            <button
              key={direction}
              type="button"
              aria-label={direction === "left" ? "左に移動" : "右に移動"}
              data-direction={direction}
              onPointerDown={handlePress}
              onPointerUp={handleRelease}
              onPointerCancel={handleRelease}
              onLostPointerCapture={handleRelease}
            >
              {direction === "left" ? "←" : "→"}
            </button>
          ))}
        </div>

        {showEnding && (
          <section className={styles.endingScreen} aria-label="シークレットエンド">
            <img src="/images/horizontal-scroll/SECRET_END.png" alt="シークレットエンド" />
            <Link href="/" className={styles.clearButton}>
              クリア
            </Link>
          </section>
        )}
      </main>

      {menuOpen && <GameMenu onClose={closeMenu} dimmed />}
    </div>
  );
}
