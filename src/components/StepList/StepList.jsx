import styles from './StepList.module.css';

export default function StepList({ title, steps }) {
  return (
    <section className={styles.card}>
      <h2 className={styles.heading}>{title}</h2>
      <ol className={styles.list}>
        {steps.map((step, index) => (
          <li key={step.title} className={styles.item}>
            <span className={styles.dot} aria-hidden="true">
              {index + 1}
            </span>
            <div>
              <p className={styles.title}>{step.title}</p>
              <p className={styles.description}>{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
