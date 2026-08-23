import styles from './ErrorState.module.css';

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

const ErrorState = ({ title = 'Bir şeyler ters gitti', message, onRetry }: ErrorStateProps) => (
  <div className={styles.wrapper} role="alert">
    <span className={styles.title}>{title}</span>
    <p className={styles.message}>{message}</p>
    {onRetry && (
      <button type="button" className={styles.retry} onClick={onRetry}>
        Tekrar dene
      </button>
    )}
  </div>
);

export default ErrorState;
