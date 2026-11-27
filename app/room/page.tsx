"use client";

import { useEffect, useRef } from "react";
import { startRoomGame } from "./game";
import styles from "./room.module.css";

// ========================================
// 部屋に置くもの（left は家の左端からの位置 px）
// ========================================

const furniture: { type: "cabinet" | "table" | "sofa"; left: number }[] = [
  { type: "cabinet", left: 520 },
  { type: "table", left: 1120 },
  { type: "sofa", left: 1760 },
  { type: "cabinet", left: 2460 },
  { type: "table", left: 3100 },
];

// 近づいて E キーで調べられる場所
const interactables: {
  type: "door" | "lockedDoor" | "strangeObject" | "exitDoor";
  left: number;
  message: string;
}[] = [
  { type: "door", left: 800, message: "この部屋には入るな、と言われている。" },
  {
    type: "lockedDoor",
    left: 2050,
    message: "ドアノブが動かない。向こう側から音が聞こえる。",
  },
  {
    type: "strangeObject",
    left: 2780,
    message: "床に、見覚えのない首輪が落ちている。",
  },
  { type: "exitDoor", left: 3700, message: "玄関だ。外から鍵がかかっている。" },
];

const furnitureLabels = { cabinet: "棚", table: "テーブル", sofa: "ソファ" };

function Furniture({ type }: { type: (typeof furniture)[number]["type"] }) {
  if (type === "cabinet") {
    return (
      <>
        <div className={styles.cabinetTop} />
        <div className={styles.cabinetDoor} />
        <div className={styles.cabinetKnob} />
      </>
    );
  }

  if (type === "table") {
    return (
      <>
        <div className={styles.tableTop} />
        <div className={`${styles.tableLeg} ${styles.legLeft}`} />
        <div className={`${styles.tableLeg} ${styles.legRight}`} />
      </>
    );
  }

  return (
    <>
      <div className={styles.sofaBack} />
      <div className={styles.sofaSeat} />
      <div className={`${styles.sofaArm} ${styles.armLeft}`} />
      <div className={`${styles.sofaArm} ${styles.armRight}`} />
      <div className={`${styles.sofaLeg} ${styles.sofaLegLeft}`} />
      <div className={`${styles.sofaLeg} ${styles.sofaLegRight}`} />
    </>
  );
}

const interactableClassNames = {
  door: styles.door,
  lockedDoor: `${styles.door} ${styles.lockedDoor}`,
  strangeObject: styles.strangeObject,
  exitDoor: styles.exitDoor,
};

export default function RoomPage() {
  const gameScreenRef = useRef<HTMLElement>(null);
  const gameWorldRef = useRef<HTMLDivElement>(null);
  const dogRef = useRef<HTMLDivElement>(null);
  const messageBoxRef = useRef<HTMLDivElement>(null);
  const messageTextRef = useRef<HTMLParagraphElement>(null);
  const locationLabelRef = useRef<HTMLDivElement>(null);

  // ページを開いたらゲームを始め、離れたら止める
  useEffect(() => {
    const gameScreen = gameScreenRef.current;
    const gameWorld = gameWorldRef.current;
    const dog = dogRef.current;
    const messageBox = messageBoxRef.current;
    const messageText = messageTextRef.current;
    const locationLabel = locationLabelRef.current;

    if (
      !gameScreen ||
      !gameWorld ||
      !dog ||
      !messageBox ||
      !messageText ||
      !locationLabel
    ) {
      return;
    }

    return startRoomGame(
      { gameScreen, gameWorld, dog, messageBox, messageText, locationLabel },
      {
        walking: styles.walking,
        facingLeft: styles.facingLeft,
        visible: styles.visible,
      },
    );
  }, []);

  return (
    <div className={styles.page}>
      <main className={styles.gameContainer}>
        <header className={styles.gameHeader}>
          <h1>good boy</h1>
          <p>STAY CLOSE TO YOUR OWNER.</p>
        </header>

        <section
          className={styles.gameScreen}
          ref={gameScreenRef}
          aria-label="ゲーム画面"
        >
          <div className={styles.gameWorld} ref={gameWorldRef}>
            <div className={styles.roomLight} />

            {/* 壁と床 */}
            <div className={styles.wall} />
            <div className={styles.floor} />

            {/* 背景の装飾 */}
            <div
              className={`${styles.wallDecoration} ${styles.picture} ${styles.pictureOne}`}
            >
              <div className={styles.pictureInner} />
            </div>
            <div
              className={`${styles.wallDecoration} ${styles.picture} ${styles.pictureTwo}`}
            >
              <div className={styles.pictureInner} />
            </div>
            <div className={`${styles.wallDecoration} ${styles.clock}`}>
              <div className={styles.clockHand} />
            </div>

            {/* 窓 */}
            <div className={`${styles.window} ${styles.windowOne}`}>
              <div className={styles.windowGlass} />
            </div>
            <div className={`${styles.window} ${styles.windowTwo}`}>
              <div className={styles.windowGlass} />
            </div>

            {/* 家具 */}
            {furniture.map((item, index) => (
              <div
                key={index}
                className={`${styles.furniture} ${styles[item.type]}`}
                style={{ left: item.left }}
                aria-label={furnitureLabels[item.type]}
              >
                <Furniture type={item.type} />
              </div>
            ))}

            {/* 調べられる場所 */}
            {interactables.map((item, index) => (
              <div
                key={index}
                className={interactableClassNames[item.type]}
                style={{ left: item.left }}
                data-message={item.message}
              >
                {item.type === "strangeObject" ? (
                  <span>?</span>
                ) : (
                  <div className={styles.doorKnob} />
                )}
              </div>
            ))}

            {/* 犬 */}
            <div className={styles.dog} ref={dogRef} aria-label="犬">
              <div className={styles.dogShadow} />

              <div className={styles.dogBody}>
                <div className={styles.dogTail} />
                <div className={styles.dogBackSpot} />

                <div className={`${styles.dogLeg} ${styles.legBack}`}>
                  <div className={styles.dogPaw} />
                </div>

                <div className={`${styles.dogLeg} ${styles.legFront}`}>
                  <div className={styles.dogPaw} />
                </div>

                <div className={styles.dogNeck} />

                <div className={styles.dogHead}>
                  <div className={`${styles.dogEar} ${styles.earLeft}`} />
                  <div className={`${styles.dogEar} ${styles.earRight}`} />
                  <div className={styles.dogEye} />
                  <div className={styles.dogMuzzle} />
                  <div className={styles.dogNose} />
                </div>
              </div>
            </div>
          </div>

          {/* 画面に固定されるUI */}
          <div className={styles.hud}>
            <div>CHAPTER 01 / HOME</div>
            <div className={styles.locationLabel} ref={locationLabelRef}>
              LIVING ROOM
            </div>
          </div>

          <div
            className={styles.messageBox}
            ref={messageBoxRef}
            role="status"
            aria-live="polite"
          >
            <p ref={messageTextRef}>……ここは、どこだろう。</p>
            <span>近づいて E キーで調べる</span>
          </div>

          <div className={styles.screenVignette} />
          <div className={styles.screenNoise} />
        </section>

        <footer className={styles.gameControls}>
          <div className={styles.controlItem}>
            <span className={styles.key}>A</span>
            <span className={styles.key}>D</span>
            <span>移動</span>
          </div>
          <div className={styles.controlItem}>
            <span className={styles.key}>←</span>
            <span className={styles.key}>→</span>
            <span>移動</span>
          </div>
          <div className={styles.controlItem}>
            <span className={styles.key}>E</span>
            <span>調べる</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
