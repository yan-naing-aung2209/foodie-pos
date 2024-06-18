// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { CreateTablePayload } from "@/types/table";
import { qrCodeImageUpload } from "@/utils/assetUpload";
import { prisma } from "@/utils/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  if (method === "POST") {
    const { name, locationId } = req.body as CreateTablePayload;
    const valid = name && locationId !== undefined;
    if (!valid) {
      return res.status(400).send("Bad request!");
    }
    let table = await prisma.table.create({
      data: { name, locationId, assetUrl: "" },
    });

    const assetUrl = await qrCodeImageUpload(table.id);

    table = await prisma.table.update({
      data: { assetUrl },
      where: { id: table.id },
    });

    res.status(200).json({ table: table });
  } else if (method === "PUT") {
    const { id, name, locationId } = req.body;

    //client data validation
    const validTable = id && name && locationId !== undefined;
    if (!validTable) {
      return res.status(400).send("Bad request.");
    }
    //server data validation
    const existTable = await prisma.table.findFirst({ where: { id } });
    if (!existTable) {
      return res.status(401).send("Unauthorized");
    }

    //update data to table -- table
    const updatedTable = await prisma.table.update({
      data: { name, locationId },
      where: { id },
    });

    res.status(200).json({
      table: updatedTable,
    });
  } else if (method === "DELETE") {
    const tableId = Number(req.query.id);

    const existTable = await prisma.table.findFirst({ where: { id: tableId } });

    if (!existTable) {
      return res.status(400).send("Bad request.");
    }

    await prisma.table.update({
      data: { isArchived: true },
      where: { id: tableId },
    });

    res.status(200).send("OK");
  }
}
