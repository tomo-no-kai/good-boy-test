"use client";

import { useCallback, useEffect, useState } from "react";
import GameMenu from "../_components/GameMenu";
import styles from "./menu.module.css";

// メニューだけを確認するためのページ（部屋の背景の上にメニューを出す）
export default function MenuPage() {
  const [menuOpen, setMenuOpen] = useState(true);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // メニューが閉じているときは Esc で開く（開いているときは GameMenu が閉じる）
  useEffect(() => {
    if (menuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(true);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  return (
    <main className={styles.gameScreen}>
      {/* 部屋の背景 */}
      <div className={styles.room} />

      {menuOpen ? (
        <GameMenu onClose={closeMenu} />
      ) : (
        <button className={styles.openMenu} onClick={() => setMenuOpen(true)}>
          メニューを開く
        </button>
      )}
    </main>
  );
}
