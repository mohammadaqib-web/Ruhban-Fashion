import dayjs from "dayjs";
import { useSelector } from "react-redux";

const userTokenValidity = () => {
  const { loginTime } = useSelector((state) => state.auth);

  const checkTokenValidity = (time) => {
    if (!time) return false;
    const currentTime = dayjs().valueOf();
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
    return currentTime - time < sevenDaysInMs;
  };

  return checkTokenValidity(loginTime);
};

export default userTokenValidity;
