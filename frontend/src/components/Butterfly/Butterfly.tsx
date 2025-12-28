
import styles from './Butterfly.module.css';


const Butterfly = () => {
    return (
        <div className={styles.container}>
            <div className={styles.butterfly}>
                <div className={styles.wing}>
                    <div className={styles.bit}></div>
                    <div className={styles.bit}></div>
                </div>
                <div className={styles.wing}>
                    <div className={styles.bit}></div>
                    <div className={styles.bit}></div>
                </div>
            </div>
        </div>
    );
};

export default Butterfly;
