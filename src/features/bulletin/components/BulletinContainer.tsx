import { useCallback, useMemo } from "react";
import { List } from "react-window";

import { useAppSelector } from "app/hooks";
import Spinner from "shared/components/Spinner/Spinner";

import { selectBetsData, selectStatus } from "../store/bulletinSlice";
import BulletinRow, { type IBulletinRowProps } from "./BulletinRow";
import styles from "./Bulletin.module.css";
import { BullentinRowTypes } from "../types/bulletin.types";

const BulletinContainer = () => {
  const betsData = useAppSelector(selectBetsData);
  const status = useAppSelector(selectStatus);

  const rowProps = useMemo<IBulletinRowProps>(
    () => ({ events: betsData ?? [] }),
    [betsData]
  );

  const getRowKey = useCallback(
    (index: number, data: IBulletinRowProps) => data?.events[index]?.NID,
    []
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.listHost}>
        {status === "loading" && (
          <div className={styles.state}>
            <Spinner />
            <span>Bülten yükleniyor…</span>
          </div>
        )}

        {status === "ready" && !rowProps.events.length && (
          <div className={styles.state}>
            <strong>Sonuç bulunamadı</strong>
          </div>
        )}

        {status === "ready" && !!rowProps.events.length && (
          <List
            className={styles.list}
            rowComponent={BulletinRow}
            rowCount={rowProps.events.length}
            rowHeight={BullentinRowTypes.ROW_HEIGH}
            rowProps={rowProps}
            rowKey={getRowKey}
            overscanCount={BullentinRowTypes.OVER_SCAN_ROW_COUNT}
          />
        )}
      </div>
    </div>
  );
};

export default BulletinContainer;
