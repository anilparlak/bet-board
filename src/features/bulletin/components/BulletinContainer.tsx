import { useAppDispatch, useAppSelector } from "app/hooks";
import { useEffect } from "react";
import { fetchBulletin, selectBetsData, selectError, selectStatus } from "../store/bulletinSlice";

const BulletinContainer = () => {
  const dispatch = useAppDispatch();
  const betsData = useAppSelector(selectBetsData);
  const status = useAppSelector(selectStatus);
  const error = useAppSelector(selectError);

  useEffect(() => {
    dispatch(fetchBulletin());
  }, [dispatch]);

  console.log("betsData",betsData)
  console.log("status",status)
  return (
    <div>Hello case</div>
  )
}

export default BulletinContainer;