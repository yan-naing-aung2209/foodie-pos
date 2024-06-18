// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { CreateLocationPayload } from "@/types/location";
import { prisma } from "@/utils/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  if (method === "GET") {
    res.status(200).send(method);
  } else if (method === "POST") {
    const { name, street, township, city, companyId } =
      req.body as CreateLocationPayload;
    const valid = name && street && township && city;
    if (!valid) {
      return res.status(400).send("Bad request!");
    }
    const location = await prisma.location.create({
      data: { name, street, township, city, companyId },
    });
    res.status(200).json({ location });
  } else if (method === "PUT") {
    const { id, name, street, township, city } = req.body;

    const existLocation = await prisma.location.findFirst({ where: { id } });
    if (!existLocation) {
      return res.status(400).send("Bad request!");
    }
    const updateLocation = await prisma.location.update({
      where: { id },
      data: { name, street, township, city },
    });
    res.status(200).json({ updateLocation });
    res.status(200).send(method);
  } else if (method === "DELETE") {
    const locationId = Number(req.query.id);

    const existLocation = await prisma.location.findFirst({
      where: { id: locationId },
    });

    if (!existLocation) {
      return res.status(400).send("Bad request.");
    }

    await prisma.location.update({
      data: { isArchived: true },
      where: { id: locationId },
    });

    res.status(200).send("OK");
  }
}
