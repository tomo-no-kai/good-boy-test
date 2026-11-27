"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

// タイトルメニューの項目（href がないものは、まだ何も起こらない）
const menuItems: { label: string; href?: string }[] = [
  { label: "はじめから", href: "/attention" },
  { label: "つづきから" },
];

export default function TitlePage() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // ↑↓キーで選択を動かす（端まで行ったら反対側に戻る）
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;

      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      setSelectedIndex(
        (prev) => (prev + step + menuItems.length) % menuItems.length,
      );
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <main className={styles.screen}>
      <section className={styles.menuPanel} aria-label="タイトルメニュー">
        <img
          src="/images/title/title.png"
          alt="GOOD DAYx"
          className={styles.titleImage}
        />

        <nav className={styles.menu} aria-label="ゲームメニュー">
          {menuItems.map((item, index) => {
            const selected = index === selectedIndex;
            const className = `${styles.menuItem} ${selected ? styles.selected : ""}`;
            const commonProps = {
              className,
              "aria-current": selected ? ("true" as const) : undefined,
              onMouseEnter: () => setSelectedIndex(index),
              onFocus: () => setSelectedIndex(index),
            };

            return item.href ? (
              <Link key={item.label} href={item.href} {...commonProps}>
                {item.label}
              </Link>
            ) : (
              <button key={item.label} type="button" {...commonProps}>
                {item.label}
              </button>
            );
          })}
        </nav>
      </section>

      <button
        className={styles.settingsButton}
        type="button"
        aria-label="設定を開く"
      >
        <img src="/images/title/setting.png" alt="設定アイコン" />
      </button>
    </main>
  );
}
