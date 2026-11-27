// 部屋のゲーム処理（元: good day/good-boy/index.js）
// 犬の位置・カメラ・メッセージは、DOM を直接書き換えて動かす

type RoomElements = {
  gameScreen: HTMLElement;
  gameWorld: HTMLElement;
  dog: HTMLElement;
  messageBox: HTMLElement;
  messageText: HTMLElement;
  locationLabel: HTMLElement;
};

// CSS Module のクラス名（見た目を切り替えるのに使う）
type RoomClassNames = {
  walking: string;
  facingLeft: string;
  visible: string;
};

// ========================================
// ゲームの設定
// ========================================

const WORLD_WIDTH = 4000;
const DOG_WIDTH = 74;
const DOG_SPEED = 240;

// 犬の x 座標がこの値より小さいときに表示する場所の名前
const LOCATIONS: { untilX: number; name: string }[] = [
  { untilX: 950, name: "LIVING ROOM" },
  { untilX: 1700, name: "DINING ROOM" },
  { untilX: 2450, name: "DARK HALLWAY" },
  { untilX: 3400, name: "BACK ROOM" },
  { untilX: Infinity, name: "ENTRANCE" },
];

export function startRoomGame(
  elements: RoomElements,
  classNames: RoomClassNames,
): () => void {
  const { gameScreen, gameWorld, dog, messageBox, messageText, locationLabel } =
    elements;

  let dogX = 100;
  let cameraX = 0;
  let lastTime = 0;
  let messageTimer = 0;
  let frameId = 0;

  const keys = new Set<string>();

  // 調べられる場所（data-message 属性を持つ要素）
  const interactables = Array.from(
    gameWorld.querySelectorAll<HTMLElement>("[data-message]"),
  );

  // ========================================
  // メッセージを表示
  // ========================================

  function showMessage(text: string, duration = 2500) {
    messageText.textContent = text;
    messageBox.classList.add(classNames.visible);
    messageTimer = performance.now() + duration;
  }

  function hideMessage() {
    messageBox.classList.remove(classNames.visible);
  }

  // ========================================
  // 犬と障害物の当たり判定
  // ========================================

  function canMoveTo(nextX: number) {
    // 家の左右の端だけをチェックする
    // 家具・ドアとの当たり判定は一時的に無効
    return nextX >= 0 && nextX + DOG_WIDTH <= WORLD_WIDTH;
  }

  // ========================================
  // 犬を移動
  // ========================================

  function updateMovement(deltaTime: number) {
    let direction = 0;

    if (keys.has("arrowleft") || keys.has("a")) direction -= 1;
    if (keys.has("arrowright") || keys.has("d")) direction += 1;

    if (direction === 0) {
      dog.classList.remove(classNames.walking);
      return;
    }

    const nextX = dogX + direction * DOG_SPEED * deltaTime;

    if (canMoveTo(nextX)) {
      dogX = nextX;
    }

    dog.classList.toggle(classNames.facingLeft, direction < 0);
    dog.classList.add(classNames.walking);
  }

  // ========================================
  // カメラを犬に追従させる
  // ========================================

  function updateCamera() {
    const screenWidth = gameScreen.clientWidth;
    const targetCameraX = dogX + DOG_WIDTH / 2 - screenWidth / 2;

    cameraX = Math.max(0, Math.min(targetCameraX, WORLD_WIDTH - screenWidth));

    gameWorld.style.transform = `translate3d(${-cameraX}px, 0, 0)`;
    dog.style.left = `${dogX}px`;
  }

  // ========================================
  // 場所の名前を更新
  // ========================================

  function updateLocation() {
    const location = LOCATIONS.find(({ untilX }) => dogX < untilX);
    if (location) {
      locationLabel.textContent = location.name;
    }
  }

  // ========================================
  // 調べられる場所を探す
  // ========================================

  function getNearestInteractable() {
    const dogCenter = dogX + DOG_WIDTH / 2;

    let nearest: HTMLElement | null = null;
    let nearestDistance = Infinity;

    for (const element of interactables) {
      const itemCenter = element.offsetLeft + element.offsetWidth / 2;
      const distance = Math.abs(dogCenter - itemCenter);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = element;
      }
    }

    return nearestDistance < 100 ? nearest : null;
  }

  // ========================================
  // 調査イベント
  // ========================================

  function interact() {
    const target = getNearestInteractable();

    if (!target) {
      showMessage("近くに調べられるものはない。", 1600);
      return;
    }

    const message = target.dataset.message;

    if (message) {
      showMessage(message, 3500);
    }
  }

  // ========================================
  // キーボード操作
  // ========================================

  const handleKeyDown = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();

    if (key === "arrowleft" || key === "arrowright" || key === " ") {
      event.preventDefault();
    }

    keys.add(key);

    if (key === "e" && !event.repeat) {
      interact();
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    keys.delete(event.key.toLowerCase());
  };

  const handleBlur = () => {
    keys.clear();
    dog.classList.remove(classNames.walking);
  };

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
  window.addEventListener("blur", handleBlur);

  // ========================================
  // ゲームループ
  // ========================================

  function gameLoop(currentTime: number) {
    if (lastTime === 0) {
      lastTime = currentTime;
    }

    const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.05);
    lastTime = currentTime;

    updateMovement(deltaTime);
    updateCamera();
    updateLocation();

    if (
      messageBox.classList.contains(classNames.visible) &&
      messageTimer > 0 &&
      currentTime >= messageTimer
    ) {
      hideMessage();
      messageTimer = 0;
    }

    frameId = requestAnimationFrame(gameLoop);
  }

  // ========================================
  // ゲーム開始
  // ========================================

  dog.style.left = `${dogX}px`;
  updateCamera();
  showMessage("……ここは、どこだろう。", 3000);
  frameId = requestAnimationFrame(gameLoop);

  // ページを離れるときの後片付け
  return () => {
    cancelAnimationFrame(frameId);
    window.removeEventListener("keydown", handleKeyDown);
    window.removeEventListener("keyup", handleKeyUp);
    window.removeEventListener("blur", handleBlur);
  };
}
