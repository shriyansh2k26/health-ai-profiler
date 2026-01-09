export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  
  if (err.name === "ZodError") {
    return res.status(422).json({
      status: "error",
      message: "AI output did not match expected schema",
      details: err.errors
    });
  }

  
  if (err.message.includes("429")) {
    return res.status(429).json({
      status: "error",
      message: "Free tier rate limit reached. Try again in 1 minute."
    });
  }

  res.status(500).json({
    status: "error",
    message: err.message || "Internal Server Error"
  });
};