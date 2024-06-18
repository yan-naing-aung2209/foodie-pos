// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@/utils/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  if (method === "PUT") {
    const { id, name, street, township, city } = req.body;

    const existCompany = await prisma.company.findFirst({ where: { id } });
    if (!existCompany) {
      return res.status(400).send("Bad request!");
    }
    const updateCompany = await prisma.company.update({
      where: { id },
      data: { name, street, township, city },
    });
    res.status(200).json({ company: updateCompany });
    res.status(200).send(method);
  }
}
