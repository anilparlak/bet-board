import { useAppDispatch, useAppSelector } from "app/hooks";
import {
  fetchBulletin,
  selectError,
  selectStatus,
} from "features/bulletin/store/bulletinSlice";
import { lazy, Suspense, useCallback, useEffect } from "react";
import styles from "./home.module.css";
import ErrorState from "shared/components/ErrorState/ErrorState";

const BulletinContainer = lazy(
  () => import("features/bulletin/components/BulletinContainer")
);

const CouponContainer = lazy(
  () => import("features/coupon/components/CouponContainer")
);

const Home = () => {
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectError);
  const status = useAppSelector(selectStatus);

  useEffect(() => {
    dispatch(fetchBulletin());
  }, [dispatch]);

  const handleRetry = useCallback(() => {
    dispatch(fetchBulletin());
  }, [dispatch]);
  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <span className={styles.title}>NGAMING Bet Board</span>
      </header>
      <div className={styles.body}>
        <main className={styles.main}>
          {status === "failed" ? (
            <ErrorState
              message={error ?? "Bülten yüklenemedi."}
              onRetry={handleRetry}
            />
          ) : (
            <div className={styles.listArea}>
              <Suspense fallback={<></>}>
                <BulletinContainer />
              </Suspense>
            </div>
          )}
        </main>
        <aside className={styles.aside}>
          <Suspense fallback={<></>}>
            <CouponContainer />
          </Suspense>
        </aside>
      </div>
    </div>
  );
};

export default Home;
