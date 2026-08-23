import { useMemo } from "react";
import type { RowComponentProps } from "react-window";

import { useAppDispatch, useAppSelector } from "app/hooks";
import { selectSelectionKey, toggleOutcome } from "features/coupon/store/couponSlice";

import type { IBetEvent, IOutcome } from "../types/betsApi.types";
import { ODD_COLUMNS } from "../types/bulletin.types";
import styles from "./BulletinRow.module.css";

export interface IBulletinRowProps {
  events: IBetEvent[];
}

const flattenOdds = (event: IBetEvent) => {
  const odds: Record<string, IOutcome> = {};

  for (const groupId in event.OCG) {
    const group = event.OCG[groupId];
    for (const outcomeId in group.OC) {
      const outcome = group.OC[outcomeId];
      odds[`${groupId}-${outcome.N}`] = outcome;
    }
  }
  return odds;
};
const BulletinRow = ({
  index,
  style,
  ariaAttributes,
  events,
}: RowComponentProps<IBulletinRowProps>) => {
  const dispatch = useAppDispatch();
  const event = events[index];
  const odds = useMemo(() => flattenOdds(event), [event]);
  const marketCount = Object.keys(event.OCG).length;
  const selectionKey = useAppSelector(selectSelectionKey(event.NID));

  return (
    <div className={styles.block} style={style} {...ariaAttributes}>
      <div className={`${styles.line} ${styles.groupLine}`}>
        <div className={`${styles.cell} ${styles.info}`}>
          <span>{event.D}</span>
          <span>{event.DAY}</span>
          <span>{event.LN}</span>
        </div>
        <div className={`${styles.cell} ${styles.comment}`}>Yorumlar</div>
        <div className={styles.cell} />
        {ODD_COLUMNS.map((column) => (
          <div className={styles.cell} key={column.key}>
            {column.label}
          </div>
        ))}
        <div className={styles.cell}>+99</div>
      </div>

      <div className={`${styles.line} ${styles.eventLine}`}>
        <div className={`${styles.cell} ${styles.info}`}>
          <span className={styles.code}>{event.C}</span>
          <span>{event.T}</span>
          <span className={styles.matchName}>{event.N}</span>
        </div>
        <div className={`${styles.cell} ${styles.comment}`}>Yorumlar</div>
        <div className={styles.cell}>{event.OCG["1"]?.MBS}</div>

        {ODD_COLUMNS.map((column) => {
          const marketId = column.g;
          const outcome = marketId ? odds[`${marketId}-${column.n}`] : undefined;

          if (!marketId || !outcome) {
            return <div className={styles.cell} key={column.key} />;
          }

          const isSelected = selectionKey === `${marketId}:${outcome.ID}`;

          return (
            <div className={styles.cell} key={column.key}>
              <button
                type="button"
                className={isSelected ? `${styles.odd} ${styles.oddActive}` : styles.odd}
                onClick={() =>
                  dispatch(
                    toggleOutcome({
                      eventCode: event.C,
                      eventId: event.NID,
                      eventName: event.N,
                      marketId,
                      marketName: event.OCG[marketId].N,
                      outcomeId: outcome.ID,
                      outcomeName: outcome.N,
                      odd: outcome.O,
                    })
                  )
                }
              >
                {outcome.O}
              </button>
            </div>
          );
        })}

        <div className={styles.cell}>{marketCount}</div>
      </div>
    </div>
  );
};

export default BulletinRow;
