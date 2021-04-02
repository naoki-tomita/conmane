import { NextApiHandler } from "next";
import { app } from "../../../../src";

const entities: NextApiHandler = (req, res) => {
  app.container;
  res.json({});
};

export default entities;
