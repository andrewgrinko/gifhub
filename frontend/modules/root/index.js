import cloneDeep from "lodash/cloneDeep";

const GET_TEST_DATA = "root/get-test-data";

const initialState = {
  data: null,
  error: null
};

export const actions = {
  fetchData: () => ({
    type: GET_TEST_DATA,
    payload: { data: "wow" }
  })
};

export default (state = cloneDeep(initialState), action) => {
  switch (action.type) {
    case GET_TEST_DATA:
      return { ...state, data: action.payload.data };

    default:
      return state;
  }
};

export const selectors = {
  getTestData: state => state.root.data,
  getError: state => state.root.error
};
