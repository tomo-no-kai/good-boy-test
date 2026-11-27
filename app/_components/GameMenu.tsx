"use client";

import { useEffect, useState } from "react";
import styles from "./GameMenu.module.css";

type Tab = "items" | "map" | "sound" | "settings";

const items = [
  {
    name: "鍵",
    image: "/images/menu/kagi.png",
    description: "古びた鍵。\nどこかで使えそうだ",
  },
  {
    name: "骨",
    image: "/images/menu/omotya.png",
    description: "飼い主からもらった骨。\nごほうびのようだ",
  },
  {
    name: "骨",
    image: "/images/menu/omotya.png",
    description: "飼い主からもらった骨。\nごほうびのようだ",
  },
  {
    name: "骨",
    image: "/images/menu/omotya.png",
    description: "飼い主からもらった骨。\nごほうびのようだ",
  },
  {
    name: "骨",
    image: "/images/menu/omotya.png",
    description: "飼い主からもらった骨。\nごほうびのようだ",
  },
  {
    name: "骨",
    image: "/images/menu/omotya.png",
    description: "飼い主からもらった骨。\nごほうびのようだ",
  },
];

// ready: false のタブは、まだデザインがないので押しても何も起こらない
const tabs: { id: Tab; label: string; ready: boolean }[] = [
  { id: "items", label: "もちもの", ready: true },
  { id: "map", label: "マップ", ready: true },
  { id: "sound", label: "サウンド", ready: false },
  { id: "settings", label: "操作設定", ready: true },
];

// 操作方法の画面に表示する内容（左上 → 右上 → 左下 → 右下 の順）
// キーが決まったら keys の "" に文字を入れる
const controls: { keys: string[]; label: string }[] = [
  { keys: ["A", "D"], label: "移動" },
  { keys: ["E"], label: "調べる・話す" },
  { keys: [""], label: "" },
  { keys: ["Esc"], label: "メニューを開く" },
];

type GameMenuProps = {
  // Esc を押したときに呼ばれる（メニューを閉じる）
  onClose: () => void;
  // ゲームの上に重ねるときは true にして、後ろを暗くする
  dimmed?: boolean;
};

export default function GameMenu({ onClose, dimmed = false }: GameMenuProps) {
  const [activeTab, setActiveTab] = useState<Tab>("items");
  const [selectedItem, setSelectedItem] = useState(0);
  const [floor, setFloor] = useState<1 | 2>(1);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      // 操作方法の画面が開いていたら、まずそれを閉じる
      if (showControls) {
        setShowControls(false);
      } else {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showControls, onClose]);

  const handleTabClick = (tab: (typeof tabs)[number]) => {
    if (!tab.ready) return; // デザインがまだのタブは何もしない

    if (tab.id === "settings") {
      setShowControls(true); // 操作設定は全画面で開く
      return;
    }

    setActiveTab(tab.id);
  };

  const currentItem = items[selectedItem];

  return (
    <div className={`${styles.overlay} ${dimmed ? styles.dimmed : ""}`}>
      {/* 左下の赤い光 */}
      <div className={styles.redLight} />

      {/* 犬 */}
      <section className={styles.leftPanel}>
        <img src="/images/menu/inu.png" alt="主人公の犬" className={styles.dog} />
      </section>

      {/* メニュー */}
      <section className={styles.rightPanel}>
        <nav className={styles.menuTabs}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tab} ${
                activeTab === tab.id ? styles.active : ""
              } ${tab.ready ? "" : styles.notReady}`}
              onClick={() => handleTabClick(tab)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className={styles.menuFrame}>
          {/* もちもの */}
          {activeTab === "items" && (
            <div className={styles.inventoryLayout}>
              <div className={styles.itemGrid}>
                {items.map((item, index) => (
                  <button
                    key={index}
                    className={`${styles.itemSlot} ${
                      selectedItem === index ? styles.selected : ""
                    }`}
                    onClick={() => setSelectedItem(index)}
                    aria-label={item.name}
                  >
                    <img src={item.image} alt={item.name} />
                  </button>
                ))}
              </div>

              <div className={styles.itemDetail}>
                <div className={styles.itemImageArea}>
                  <img
                    src={currentItem.image}
                    alt={currentItem.name}
                    className={styles.detailImage}
                  />
                </div>

                <h2>{currentItem.name}</h2>

                <div className={styles.detailLine} />

                <div className={styles.detailBottom}>
                  <p>{currentItem.description}</p>
                  <button className={styles.useButton}>使用する</button>
                </div>
              </div>
            </div>
          )}

          {/* マップ */}
          {activeTab === "map" && (
            <div className={styles.mapLayout}>
              <div className={styles.floorButtons}>
                <button
                  className={floor === 1 ? styles.floorSelected : ""}
                  onClick={() => setFloor(1)}
                >
                  1F
                </button>

                <button
                  className={floor === 2 ? styles.floorSelected : ""}
                  onClick={() => setFloor(2)}
                >
                  2F
                </button>
              </div>

              <div className={styles.mapPlaceholder}>
                <span>MAP IMAGE AREA</span>
                <small>ここに完成したマップ画像を配置</small>
              </div>
            </div>
          )}
        </div>
      </section>

      <p className={styles.closeGuide}>Esc でメニューを閉じる</p>

      {/* 操作方法（全画面） */}
      {showControls && (
        <div className={styles.controlsScreen}>
          <div className={styles.controlsFrame}>
            <h2 className={styles.controlsTitle}>操作方法</h2>
            <div className={styles.controlsLine} />

            <div className={styles.controlsGrid}>
              {controls.map((control, index) => (
                <div key={index} className={styles.controlRow}>
                  <div className={styles.keyArea}>
                    {control.keys.map((key, keyIndex) => (
                      <span key={keyIndex} className={styles.keyBox}>
                        {key}
                      </span>
                    ))}
                  </div>
                  <span className={styles.controlLabel}>{control.label}</span>
                </div>
              ))}
            </div>

            <button
              className={styles.controlsClose}
              onClick={() => setShowControls(false)}
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
