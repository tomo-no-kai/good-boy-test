// 横スクロールのゲーム処理（元: good day/horizontal_scroll/script.js）
// React の画面とは切り離して、canvas に直接描画する

export type Direction = "left" | "right";

type GameOptions = {
  canvas: HTMLCanvasElement;
  // シークレットエンドに入ったときに呼ばれる
  onEnding: () => void;
};

export type HorizontalScrollGame = {
  // 画面のボタンから移動するときに使う
  setPressed: (direction: Direction, pressed: boolean) => void;
  // メニューを開いている間などにゲームを止める
  setPaused: (paused: boolean) => void;
  // ページを離れるときに後片付けをする
  stop: () => void;
};

const IMAGE_DIR = "/images/horizontal-scroll";

export function startHorizontalScrollGame({
  canvas,
  onEnding,
}: GameOptions): HorizontalScrollGame {
  const ctx = canvas.getContext("2d")!;

  const background = new Image();
  background.src = `${IMAGE_DIR}/background.png`;

  const playerImage = new Image();
  playerImage.src = `${IMAGE_DIR}/dog.png`;

  const keyImage = new Image();
  keyImage.src = `${IMAGE_DIR}/key.png`;

  const startX = 100;
  const portalTriggerX = 20;

  let worldWidth = canvas.width;

  const player = {
    x: startX,
    y: 700,
    width: 120,
    height: 180,
    speed: 12,
  };

  const keyItem = {
    x: 0,
    y: player.y + player.height - 120,
    width: 120 * (4357 / 6334),
    height: 120,
    visible: true,
  };

  const camera = { x: 0 };
  const keys = { left: false, right: false };
  let hasKey = false;
  let returnedToStart = false;
  let endingStarted = false;
  let paused = false;
  let frameId = 0;

  background.addEventListener("load", () => {
    worldWidth = Math.max(canvas.width, background.naturalWidth);
    // 背景の右端近くに鍵を置く
    keyItem.x = worldWidth - keyItem.width - 100;
  });

  keyImage.addEventListener("load", () => {
    // 鍵画像の縦横比を保つ
    keyItem.width =
      keyItem.height * (keyImage.naturalWidth / keyImage.naturalHeight);
    keyItem.x = worldWidth - keyItem.width - 100;
  });

  const handleKeyDown = (event: KeyboardEvent) => {
    if (paused) return;

    const key = event.key.toLowerCase();

    if (key === "a" || event.key === "ArrowLeft") keys.left = true;
    if (key === "d" || event.key === "ArrowRight") keys.right = true;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    if (key === "a" || event.key === "ArrowLeft") keys.left = false;
    if (key === "d" || event.key === "ArrowRight") keys.right = false;
  };

  const handleBlur = () => {
    keys.left = false;
    keys.right = false;
  };

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
  window.addEventListener("blur", handleBlur);

  function update() {
    if (endingStarted || paused) return;

    if (keys.left) player.x -= player.speed;
    if (keys.right) player.x += player.speed;

    player.x = Math.max(0, Math.min(worldWidth - player.width, player.x));

    camera.x = Math.max(
      0,
      Math.min(worldWidth - canvas.width, player.x - canvas.width * 0.4),
    );

    // プレイヤーと鍵が重なったら取得する
    const touchingKey =
      player.x < keyItem.x + keyItem.width &&
      player.x + player.width > keyItem.x &&
      player.y < keyItem.y + keyItem.height &&
      player.y + player.height > keyItem.y;

    if (keyItem.visible && touchingKey) {
      keyItem.visible = false;
      hasKey = true;
    }

    // 鍵を取ったあと、開始地点まで戻ると秘密の入口が現れる
    if (hasKey && player.x <= startX + player.speed) {
      returnedToStart = true;
    }

    // 光る入口へ左に進んで入るとシークレットエンドを表示
    if (returnedToStart && keys.left && player.x <= portalTriggerX) {
      endingStarted = true;
      onEnding();
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 背景画像は元のサイズで描き、カメラで横方向だけ動かす
    if (background.complete && background.naturalWidth > 0) {
      ctx.drawImage(background, -camera.x, 0);
    }

    // 地面に置いた鍵を描画
    if (keyItem.visible && keyImage.complete && keyImage.naturalWidth > 0) {
      ctx.drawImage(
        keyImage,
        keyItem.x - camera.x,
        keyItem.y,
        keyItem.width,
        keyItem.height,
      );
    }

    // プレイヤーを描画
    if (playerImage.complete && playerImage.naturalWidth > 0) {
      ctx.drawImage(
        playerImage,
        player.x - camera.x,
        player.y,
        player.width,
        player.height,
      );
    }

    // 鍵を取って開始地点へ戻ったら、左端に光る入口を表示
    if (returnedToStart && !endingStarted) {
      const pulse = 0.65 + Math.sin(performance.now() / 220) * 0.2;
      const glow = ctx.createRadialGradient(20, 760, 8, 20, 760, 420);
      glow.addColorStop(0, `rgba(255, 245, 170, ${pulse})`);
      glow.addColorStop(0.25, `rgba(255, 220, 100, ${pulse * 0.45})`);
      glow.addColorStop(1, "rgba(255, 220, 100, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 300, 440, 650);
    }

    // 鍵を取ったことを画面左上に表示
    if (hasKey) {
      const message = "🔑 鍵を手に入れた！";
      ctx.font = "32px sans-serif";
      const bannerWidth = ctx.measureText(message).width + 48;

      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.fillRect(24, 24, bannerWidth, 64);
      ctx.fillStyle = "#fff";
      ctx.fillText(message, 40, 68);
    }
  }

  function loop() {
    update();
    draw();
    frameId = requestAnimationFrame(loop);
  }

  loop();

  return {
    setPressed(direction, pressed) {
      if (paused && pressed) return;
      keys[direction] = pressed;
    },
    setPaused(value) {
      paused = value;
      // 止めた瞬間に押していたキーは離したことにする（再開時に勝手に動かないように）
      keys.left = false;
      keys.right = false;
    },
    stop() {
      cancelAnimationFrame(frameId);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
    },
  };
}
