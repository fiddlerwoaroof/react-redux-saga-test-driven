import {summaryEvent} from "./summaryDispatch";
import * as R from "ramda";
import summaryModel from "./summaryModel";

const fetchSummarySuccess = (state, event) => R.pipe(
    R.set(summaryModel.profileCount, event.profileCount),
    R.set(summaryModel.taskCount, event.taskCount))(state)

const summaryReducers = {
    [summaryEvent.FETCH_SUMMARY_SUCCESS]: fetchSummarySuccess
}

export default summaryReducers
