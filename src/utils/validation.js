const editProfileValidation = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "photoUrl",
    "about",
    "skills",
  ];
  const isEditAllowed = Object.keys(req.body).every((val) =>
    allowedEditFields.includes(val)
  );
  return isEditAllowed;
};
module.exports = { editProfileValidation };
