import styles from "./ErrorBanner.module.css";

interface ErrorBannerProps {
  message: string;
}

export default function ErrorBanner({ message }: ErrorBannerProps) {
  if (!message) return null;

  return (
    <div className={styles.wrap}>
      <span className={styles.icon}>⚠</span>
      <p className={styles.message}>{message}</p>
    </div>
  );
}