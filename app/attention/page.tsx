import Link from "next/link";
import styles from "./attention.module.css";

export default function AttentionPage() {
  return (
    <main className={styles.screen}>
      <img
        src="/images/attention/ATTENTION.png"
        alt="ATTENTION"
        className={styles.attentionImage}
      />
      <div>
        <Link href="/horizontal-scroll" className={styles.nextButton}>
          次へ
        </Link>
        <p className={styles.explanation}>
          本作品には、ホラー表現や不気味な演出が含まれています。
          <br />
          プレイ中に気分が悪くなった場合は、すぐにプレイを中断してください。
          <br />
          心臓の弱い方や、刺激の強い表現が苦手な方はご注意ください。
          <br />
          無理をせず、自分のペースでお楽しみください。
        </p>
      </div>
    </main>
  );
}
