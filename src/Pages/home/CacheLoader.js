import { store } from "../../app/store";
import { staffApiSlice } from "../../features/staffs/staffSlice";
import { shiftApiSlice } from "../../features/shifts/shiftSlice";
import { expenseApiSlice } from "../../features/expenses/expenseSlice"

async function getDataToCache() {
  const staffPromise = store.dispatch(staffApiSlice.endpoints.getStaff.initiate());
  const shiftPromise = store.dispatch(shiftApiSlice.endpoints.getShifts.initiate());
  const expensePromise = store.dispatch(expenseApiSlice.endpoints.getExpenses.initiate());

  try {
    const [staffs, shifts, expenses] = await Promise.all([staffPromise.unwrap(), shiftPromise.unwrap(), expensePromise.unwrap()]);
    return { staffs,shifts, expenses };
  } catch (e) {
    console.error("Error fetching employees and tracks:", e);
    return null;
  } finally {
    staffPromise.unsubscribe();
    shiftPromise.unsubscribe();
    expensePromise.unsubscribe();
  }
}

export default async function loadCache() {
  return getDataToCache();
}