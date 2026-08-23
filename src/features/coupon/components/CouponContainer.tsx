import { useCallback, useMemo, useState } from "react";

import { useAppDispatch, useAppSelector } from "app/hooks";

import { clearCoupon, removeItem, selectCouponItems } from "../store/couponSlice";
import styles from "./Coupon.module.css";

const CouponContainer = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCouponItems);

  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = useCallback(() => setIsOpen((open) => !open), []);

  const list = useMemo(() => Object.values(items), [items]);
  const totalOdd = useMemo(
    () => list.reduce((total, item) => total * Number(item.odd), 1),
    [list]
  );

  return (
    <div className={isOpen ? styles.wrapper : `${styles.wrapper} ${styles.collapsed}`}>
      <div
        className={styles.header}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        onClick={toggleOpen}
      >
        <span>Kuponum</span>
        <span className={styles.count}>{list.length}</span>
        {list.length > 0 && (
          <button
            type="button"
            className={styles.clear}
            onClick={(clickEvent) => {
              clickEvent.stopPropagation();
              dispatch(clearCoupon());
            }}
          >
            Temizle
          </button>
        )}
      </div>

      <div className={styles.list}>
        {list.length === 0 ? (
          <div className={styles.empty}>Kuponunuz boş. Bültenden oran seçin.</div>
        ) : (
          list.map((item) => (
            <div className={styles.item} key={item?.eventId}>
              <div className={styles.itemInfo}>
                <span>Kod:{item.eventCode ?? '-'}</span>
                <span className={styles.eventName}>{item?.eventName ?? '-'}</span>
                <span className={styles.market}>
                  {item?.marketName} · {item?.outcomeName}
                </span>
              </div>
              <span className={styles.itemOdd}>{item?.odd}</span>
              <button
                type="button"
                className={styles.remove}
                aria-label="Kupondan çıkar"
                onClick={() => dispatch(removeItem(item.eventId))}
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>

      <div className={styles.footer}>
        <span>Toplam Oran</span>
        <strong>{totalOdd > 1 ? totalOdd.toFixed(2) : '0.00'}</strong>
      </div>
    </div>
  );
};

export default CouponContainer;
