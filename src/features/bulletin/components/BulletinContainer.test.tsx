import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";

import { store } from "app/store";
import CouponContainer from "features/coupon/components/CouponContainer";
import { clearCoupon } from "features/coupon/store/couponSlice";

import { fetchBulletin } from "../store/bulletinSlice";
import type { IBetEvent } from "../types/betsApi.types";
import BulletinContainer from "./BulletinContainer";

const MOCK_EVENT: IBetEvent = {
  C: "2001",
  N: "PSV - AS Roma",
  TYPE: "1",
  NID: "2146483648",
  D: "12.08.2023",
  T: "01:59",
  DAY: "Perşembe",
  S: "Open",
  LN: "UEFA Şampiyonlar Ligi",
  IMF: false,
  HEC: false,
  OCG: {
    "1": {
      ID: "1",
      N: "Maç Sonucu",
      MBS: "4",
      SO: 1,
      OC: {
        "0": { ID: "0", O: "3.60", N: "1", MBS: "4", G: "1", OD: 0, IMF: false },
        "1": { ID: "1", O: "2.74", N: "X", MBS: "4", G: "1", OD: 0, IMF: false },
      },
    },
    "5": {
      ID: "5",
      N: "Alt/Üst 2,5 Gol",
      MBS: "4",
      SO: 2,
      OC: {
        "25": { ID: "25", O: "4.92", N: "Alt", MBS: "4", G: "5", OD: 0, IMF: false },
        "26": { ID: "26", O: "7.09", N: "Üst", MBS: "4", G: "5", OD: 0, IMF: false },
      },
    },
  },
};

/** Bülteni servise gitmeden "ready" duruma taşır. */
const seedBulletin = (events: IBetEvent[]) =>
  store.dispatch(fetchBulletin.fulfilled(events, "test-request-id"));

const renderBoard = () =>
  render(
    <Provider store={store}>
      <BulletinContainer />
      <CouponContainer />
    </Provider>
  );

/** Kupon listesi (footer'daki toplam oranı kapsam dışında bırakır). */
const getCouponList = () => screen.getByText("Kuponum").closest("div")!.parentElement!;

describe("BulletinContainer -> CouponContainer", () => {
  beforeEach(() => {
    store.dispatch(clearCoupon());
    seedBulletin([MOCK_EVENT]);
  });

  it("bülten satırını render eder", () => {
    renderBoard();

    expect(screen.getByText("PSV - AS Roma")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "3.60" })).toBeInTheDocument();
    expect(screen.getByText("Kuponunuz boş. Bültenden oran seçin.")).toBeInTheDocument();
  });

  it("orana tıklanınca seçim kupona eklenir", async () => {
    const user = userEvent.setup();
    renderBoard();

    await user.click(screen.getByRole("button", { name: "3.60" }));

    const coupon = getCouponList();
    expect(within(coupon).getByText("PSV - AS Roma")).toBeInTheDocument();
    expect(within(coupon).getByText("Maç Sonucu · 1")).toBeInTheDocument();
    expect(within(coupon).getByText("Kod:2001")).toBeInTheDocument();
    expect(screen.queryByText("Kuponunuz boş. Bültenden oran seçin.")).not.toBeInTheDocument();

    expect(store.getState().coupon.items[MOCK_EVENT.NID]).toMatchObject({
      eventId: "2146483648",
      marketId: "1",
      outcomeId: "0",
      odd: "3.60",
    });
  });

  it("aynı orana tekrar tıklanınca kupondan çıkarılır", async () => {
    const user = userEvent.setup();
    renderBoard();

    const odd = screen.getByRole("button", { name: "3.60" });
    await user.click(odd);
    await user.click(odd);

    expect(screen.getByText("Kuponunuz boş. Bültenden oran seçin.")).toBeInTheDocument();
    expect(store.getState().coupon.items).toEqual({});
  });
});
