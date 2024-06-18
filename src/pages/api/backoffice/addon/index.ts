// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { CreateAddonPayload } from "@/types/addon";
import { prisma } from "@/utils/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  if (method === "POST") {
    const { name, price, addonCategoryId } = req.body as CreateAddonPayload;
    const valid = name && price !== undefined && addonCategoryId !== undefined;
    if (!valid) {
      return res.status(400).send("Bad request!");
    }
    const addon = await prisma.addon.create({
      data: { name, price, addonCategoryId },
    });

    res.status(200).json({ addon });
  } else if (method === "PUT") {
    const { id, name, price, addonCategoryId } = req.body;

    //client data validation
    const validAddon =
      id && name && price !== undefined && addonCategoryId !== undefined;
    if (!validAddon) {
      return res.status(400).send("Bad request.");
    }
    //server data validation
    const existAddon = await prisma.addon.findFirst({ where: { id } });
    if (!existAddon) {
      return res.status(401).send("Unauthorized");
    }

    //update data to addon table
    const updatedAddon = await prisma.addon.update({
      data: { name, price, addonCategoryId },
      where: { id },
    });

    res.status(200).json({
      addon: updatedAddon,
    });
  } else if (method === "DELETE") {
    const addonId = Number(req.query.id);

    const existAddon = await prisma.addon.findFirst({ where: { id: addonId } });

    if (!existAddon) {
      return res.status(400).send("Bad request.");
    }

    await prisma.addon.update({
      data: { isArchived: true },
      where: { id: addonId },
    });

    res.status(200).send("OK");
  }
}
