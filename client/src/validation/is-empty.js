function isEmpty(value) {
  return (
    value === undefined ||
    value === null ||
    value === false ||
    (typeof value === "object" && Object.keys(value).length === 0 && typeof value.getDate !== "function") || // check if Date object
    (typeof value === "string" && value.trim().length === 0)
  );
}
export default isEmpty;
