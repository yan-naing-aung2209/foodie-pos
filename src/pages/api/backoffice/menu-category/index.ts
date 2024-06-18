// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
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
    const { name, isAvailable, companyId } = req.body;

    const valid = name && companyId && isAvailable !== undefined;
    if (!valid) {
      return res.status(400).send("Bad request!");
    }
    const menuCategory = await prisma.menuCategory.create({
      data: { name, companyId },
    });
    res.status(200).json({ menuCategory });
  } else if (method === "PUT") {
    //<---PUT method--->

    const { id, name, isAvailable, locationId } = req.body;

    //<--menuCategory table-->
    //client data validation
    const validMenuCategory = id && name;
    if (!validMenuCategory) {
      return res.status(400).send("Bad request!");
    }

    //server data validation
    const existMenuCategory = await prisma.menuCategory.findFirst({
      where: { id },
    });

    if (!existMenuCategory) {
      return res.status(400).send("Bad request");
    }
    //update data to menu category table
    const updatedMenuCategory = await prisma.menuCategory.update({
      where: { id },
      data: { name },
    });

    //<--disableLocationMenuCategory table-->

    //client data validation
    const validDisabledData = isAvailable !== undefined && locationId;
    if (!validDisabledData) {
      return res.status(200).json({ updatedMenuCategory });
    }

    if (isAvailable === false) {
      //server data validation
      const existDisableLocationMenuCategory =
        await prisma.disabledLocationMenuCategory.findFirst({
          where: { locationId, menuCategoryId: id },
        });
      if (existDisableLocationMenuCategory) {
        return res.status(200).json({ updatedMenuCategory });
      }

      //update data to disabledLocationMenuCategory
      await prisma.disabledLocationMenuCategory.create({
        data: { menuCategoryId: id, locationId },
      });
    } else {
      const disabledData = await prisma.disabledLocationMenuCategory.findFirst({
        where: { menuCategoryId: id, locationId },
      });
      disabledData &&
        (await prisma.disabledLocationMenuCategory.delete({
          where: { id: disabledData.id },
        }));
    }

    //disabledLocationMenuCategory <-- menuCategory <-- current company

    /*get current menuCategoryIds */

    const currentCompanyId = existMenuCategory.companyId;
    const currentMenuCategory = await prisma.menuCategory.findMany({
      where: { companyId: currentCompanyId },
    });
    const currentMenuCategoryIds = currentMenuCategory.map((item) => item.id);

    //all data from disabledLocationMenuCategory
    const disabledLocationMenuCategory =
      await prisma.disabledLocationMenuCategory.findMany({
        where: { menuCategoryId: { in: currentMenuCategoryIds } },
      });

    res.status(200).json({ updatedMenuCategory, disabledLocationMenuCategory });
  } else if (method === "DELETE") {
    const menuCategoryId = Number(req.query.id);

    const existMenuCategory = await prisma.menuCategory.findFirst({
      where: { id: menuCategoryId },
    });

    if (!existMenuCategory) {
      return res.status(400).send("bad request...");
    }

    await prisma.menuCategory.update({
      data: { isArchived: true },
      where: { id: menuCategoryId },
    });

    res.status(200).send("OK");
  }
}
