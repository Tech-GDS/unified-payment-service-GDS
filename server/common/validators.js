// Exportable method, to check if the any given object or sting is empty or not. Returns True/False accordingly.
exports.isEmpty = (value) =>
  value === undefined ||
  value === null ||
  (typeof value === "object" && Object.keys(value).length === 0) ||
  (typeof value === "string" && value.trim().length === 0);

// Exportable method, to return the actual type of any given object. Return the type in String, eg:
// type("abc"); will return --> "String", similarly for rest like, "Object", "Number", etc
exports.type = (obj) => {
  return Object.prototype.toString
    .apply(obj)
    .replace(/\[object (.+)\]/i, "$1")
    .toLowerCase();
};
