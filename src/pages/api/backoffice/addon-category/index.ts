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
    const { name, isRequired, menuIds } = req.body;
    const valid = name && isRequired !== undefined && menuIds.length > 0;
    if (!valid) {
      return res.status(400).send("Bad request!");
    }
    //addonCategory table
    const newAddonCatetgory = await prisma.addonCategory.create({
      data: { name, isRequired },
    });
    const addonCategoryId = newAddonCatetgory.id;

    //menuAddonCategory table
    const newMenuAddonCategory = await prisma.$transaction(
      menuIds.map((menuId: number) =>
        prisma.menuAddonCategory.create({ data: { menuId, addonCategoryId } })
      )
    );

    res
      .status(200)
      .json({
        addonCategory: newAddonCatetgory,
        menuAddonCategory: newMenuAddonCategory,
      });
  } else if (method === "PUT") {
    const { id, name, isRequired, menuIds } = req.body;

    //<--addon category table-->
    //client data validation
    const validAddonCategory = id && name && isRequired !== undefined;
    if (!validAddonCategory) {
      return res.status(400).send("Bad request.");
    }
    //server data validation
    const existAddonCategory = await prisma.addonCategory.findFirst({
      where: { id },
    });
    if (!existAddonCategory) {
      return res.status(401).send("Unauthorized");
    }

    //update data to addonCategory
    const updateAddonCategory = await prisma.addonCategory.update({
      data: { name, isRequired },
      where: { id },
    });

    //<--for menuAddonCategory-->
    //client data validation
    if (!menuIds.length) {
      return res.status(400).send("Bad request");
    }

    const clientMenuIds = menuIds.join(",");

    //server data validation
    const outdateMenuAddonCategory = await prisma.menuAddonCategory.findMany({
      where: { addonCategoryId: id },
    });

    const serverMenuIds = outdateMenuAddonCategory
      .map((item) => item.menuId)
      .join(",");

    const sameJoinTable = clientMenuIds === serverMenuIds;

    if (sameJoinTable) {
      return res.status(200).json({
        updateAddonCategory,
      });
    }

    //to remove
    const toRemove = outdateMenuAddonCategory.filter(
      (item) => !menuIds.includes(item.menuId)
    );
    if (toRemove.length) {
      await prisma.menuAddonCategory.deleteMany({
        where: { id: { in: toRemove.map((item) => item.id) } },
      });
    }
    //to add
    const toAdd = menuIds.filter(
      (menuId: number) =>
        !outdateMenuAddonCategory.find((item) => item.menuId === menuId)
    );
    if (toAdd.length) {
      await prisma.$transaction(
        toAdd.map((menuId: number) =>
          prisma.menuAddonCategory.create({
            data: { menuId, addonCategoryId: id },
          })
        )
      );
    }

    //1st. current companyId <-- menuCategory <-- menuCategoryMenu <-- current menu
    const menuCategoryMenu = await prisma.menuCategoryMenu.findMany({
      where: { menuId: { in: menuIds } },
    });
    const menuCategoryId = menuCategoryMenu[0].menuCategoryId;
    const menuCategory = await prisma.menuCategory.findFirst({
      where: { id: menuCategoryId },
    });
    const currentCompanyId = menuCategory.companyId;

    //2nd. menuAddonCategory <-- menu <-- menuCategoryMenu <-- menuCategory <-- company
    const currentMenuCategories = await prisma.menuCategory.findMany({
      where: { companyId: currentCompanyId },
    });
    const currentMenuCategoryIds = currentMenuCategories.map((item) => item.id);

    const currentMenuCategoryMenu = await prisma.menuCategoryMenu.findMany({
      where: { menuCategoryId: { in: currentMenuCategoryIds } },
    });
    const currentMenuIds = currentMenuCategoryMenu.map((item) => item.menuId);
    const currentMenuAddonCategory = await prisma.menuAddonCategory.findMany({
      where: { menuId: { in: currentMenuIds } },
    });
    const currentAddonCategoryIds = currentMenuAddonCategory.map(
      (item) => item.addonCategoryId
    );

    const updateMenuAddonCategory = await prisma.menuAddonCategory.findMany({
      where: { addonCategoryId: { in: currentAddonCategoryIds } },
    });

    res.status(200).json({
      updateAddonCategory,
      menuAddonCategory: updateMenuAddonCategory,
    });
  } else if (method === "DELETE") {
    const addonCategoryId = Number(req.query.id);

    const existAddonCategory = await prisma.addonCategory.findFirst({
      where: { id: addonCategoryId },
    });

    if (!existAddonCategory) {
      return res.status(400).send("Bad request.");
    }

    await prisma.addonCategory.update({
      data: { isArchived: true },
      where: { id: addonCategoryId },
    });

    res.status(200).send("OK");
  }
}
