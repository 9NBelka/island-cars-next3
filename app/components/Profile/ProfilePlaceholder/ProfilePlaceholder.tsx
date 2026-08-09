import styles from './ProfilePlaceholder.module.scss';

type Props = {
  title: string;
  text: string;
};

export default function ProfilePlaceholder({ title, text }: Props) {
  return (
    <section className={styles.card}>
      <h2>{title}</h2>
      <p>{text}</p>
    </section>
  );
}
