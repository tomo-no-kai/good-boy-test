"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./choice.module.css";

// 選択肢（文字を変えたり、増やしたり減らしたりできる）
const choices = [
  { id: "help", label: "助ける" },
  { id: "notHelp", label: "助けない" },
  { id: "leave", label: "その場から離れる" },
  { id: "watch", label: "様子を見る" },
];

export default function ChoicePage() {
  const [dialogOpen, setDialogOpen] = useState(true);

  // ESC で会話（選択肢）を閉じる
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDialogOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // 選択肢を選んだときの処理（今は何もしない）
  // ストーリーの分岐ができたら、ここに書く
  const handleChoice = (id: string) => {
    console.log("選んだ選択肢:", id);
  };

  return (
    <main className={styles.screen}>
      {/* 背景 */}
      <div className={styles.background} />

      {/* 選択肢が出ている間は背景を暗くする */}
      {dialogOpen && <div className={styles.dim} />}

      {/* 上の帯 */}
      <div className={styles.topBar}>
        <svg className={styles.topArrow} viewBox="0 0 80 14" aria-hidden="true">
          <polyline points="1,1 40,13 79,1" />
        </svg>
      </div>

      {/* 選択肢のウィンドウ */}
      {dialogOpen && (
        <section className={styles.dialog}>
          <h2 className={styles.question}>どうする？</h2>

          <div className={styles.choiceList}>
            {choices.map((choice) => (
              <button
                key={choice.id}
                className={styles.choiceButton}
                onClick={() => handleChoice(choice.id)}
              >
                {choice.label}
              </button>
            ))}
          </div>

          <button
            className={styles.closeButton}
            onClick={() => setDialogOpen(false)}
          >
            閉じる
          </button>
        </section>
      )}

      {/* 左下のメニューボタン（メニュー画面へ移動） */}
      <Link href="/menu" className={styles.menuButton}>
        <svg className={styles.gear} viewBox="0 0 64 64" aria-hidden="true">
          <path d="M28 2h8l1.5 8.2a22 22 0 0 1 6.3 2.6l6.9-4.7 5.7 5.7-4.7 6.9a22 22 0 0 1 2.6 6.3L62 28v8l-8.2 1.5a22 22 0 0 1-2.6 6.3l4.7 6.9-5.7 5.7-6.9-4.7a22 22 0 0 1-6.3 2.6L36 62h-8l-1.5-8.2a22 22 0 0 1-6.3-2.6l-6.9 4.7-5.7-5.7 4.7-6.9a22 22 0 0 1-2.6-6.3L2 36v-8l8.2-1.5a22 22 0 0 1 2.6-6.3L8.1 13.3l5.7-5.7 6.9 4.7a22 22 0 0 1 6.3-2.6Z" />
          <circle cx="32" cy="32" r="14" className={styles.gearHole} />
          <path d="M32 18v14l12 8M32 32l-12 8" className={styles.gearLines} />
        </svg>
        <span>menu</span>
      </Link>

      {/* 右下の操作説明 */}
      <p className={styles.guide}>
        <span>←→A D 移動</span>
        <span>E 調べる</span>
        <span>ESC 会話を閉じる</span>
      </p>
    </main>
  );
}
