//Check if user is COACH or COMMITTEE

export const isOfficial = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "COMMITTEE") { // This is committeeQuarter
    return next();
  }
  return res.status(403).json({
    error: "Access Denied: This area is restricted to Committee Officials.",
  });
};

export const isCoach = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "COACH") {
    return next();
  }
  return res.status(403).json({
    error: "Access Denied: This area is restricted to Coaching Staff.",
  });
};

export const isAdmin = (req, res, next) => {
  // Basic admin check - you can expand this if you add an 'ADMIN' role to the DB
  if (req.isAuthenticated() && req.user.role === "ADMIN") {
    return next();
  }
  return res.status(403).json({
    error: "Access Denied: Administrator privileges required.",
  });
};
