export const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req.body)).catch((err) => next(err));
  };
};
