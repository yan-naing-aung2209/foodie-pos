// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { CreateMenuPayload } from "@/types/menu";
import { prisma } from "@/utils/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  if (method === "POST") {
    const { name, price, menuCategoryIds, assetUrl } =
      req.body as CreateMenuPayload;
    const valid = name && price !== undefined && menuCategoryIds.length > 0;
    if (!valid) {
      return res.status(400).send("Bad request!");
    }
    const menu = await prisma.menu.create({ data: { name, price, assetUrl } });
    const menuId = menu.id;

    const menuCategoryMenus = await prisma.$transaction(
      menuCategoryIds.map((item) =>
        prisma.menuCategoryMenu.create({
          data: { menuCategoryId: item, menuId },
        })
      )
    );

    res.status(200).json({ menu, menuCategoryMenus });
  } else if (method === "PUT") {
    const {
      id,
      name,
      price,
      menuCategoryIds,
      locationId,
      isAvailable,
      assetUrl,
    } = req.body;

    //<--for menu update-->
    //client data validation
    const validMenu = id && name && price !== undefined;
    if (!validMenu) {
      return res.status(400).send("Bad request.");
    }
    //server data validation
    const existMenu = await prisma.menu.findFirst({ where: { id } });
    if (!existMenu) {
      return res.status(401).send("Unauthorized");
    }

    //update data to menu table
    const updatedMenu = await prisma.menu.update({
      data: { name, price, assetUrl },
      where: { id },
    });

    //<--for disable-location-menu-->
    //client data validation
    const validDisabledData = locationId && isAvailable !== undefined;
    if (!validDisabledData) {
      return res.status(200).json({ updatedMenu });
    }

    if (isAvailable === false) {
      //server data validation
      const existDisableLocationMenu =
        await prisma.disabledLocationMenu.findFirst({
          where: { locationId, menuId: id },
        });
      if (existDisableLocationMenu) {
        return res.status(200).json({ updatedMenu });
      }

      //update data to disabledLocationMenuCategory
      await prisma.disabledLocationMenu.create({
        data: { menuId: id, locationId },
      });
    } else {
      const disabledData = await prisma.disabledLocationMenu.findFirst({
        where: { menuId: id, locationId },
      });

      disabledData &&
        (await prisma.disabledLocationMenu.delete({
          where: { id: disabledData.id },
        }));
    }

    //disabledLocationMenu <--menu <--menuCategoryMenu <-- menuCategory <-- current company

    //current company
    const currentLocation = await prisma.location.findFirst({
      where: { id: locationId },
    });
    const currentCompanyId = currentLocation.companyId;

    //menuCategories
    const currentMenuCategories = await prisma.menuCategory.findMany({
      where: { companyId: currentCompanyId },
    });
    const currentMenuCategoryIds = currentMenuCategories.map((item) => item.id);

    //menuCategoryMenu
    const CurrentMenuCategoryMenu = await prisma.menuCategoryMenu.findMany({
      where: { menuCategoryId: { in: currentMenuCategoryIds } },
    });

    //menu
    const menuIds = CurrentMenuCategoryMenu.map((item) => item.menuId);

    //disabledLocationMenu
    const disabledLocationMenu = await prisma.disabledLocationMenu.findMany({
      where: { menuId: { in: menuIds } },
    });

    //<--for menuCategoryMenu-->
    //client data validation
    if (!menuCategoryIds.length) {
      return res.status(400).send("Bad request");
    }

    const clientMenuCategoryIds = menuCategoryIds.join(",");

    //server data validation
    const outdateMenuCategoryMenu = await prisma.menuCategoryMenu.findMany({
      where: { menuId: id },
    });

    const serverMenuCategoryIds = outdateMenuCategoryMenu
      .map((item) => item.menuCategoryId)
      .join(",");

    const sameJoinTable = clientMenuCategoryIds === serverMenuCategoryIds;

    if (sameJoinTable) {
      return res.status(200).json({
        updatedMenu,
        disabledLocationMenu,
      });
    }

    //to remove
    const toRemove = outdateMenuCategoryMenu.filter(
      (item) => !menuCategoryIds.includes(item.menuCategoryId)
    );
    if (toRemove.length) {
      await prisma.$transaction(
        toRemove.map((item) =>
          prisma.menuCategoryMenu.delete({ where: { id: item.id } })
        )
      );
    }
    //to add
    const toAdd = menuCategoryIds.filter(
      (menuCategoryId: number) =>
        !outdateMenuCategoryMenu.find(
          (item) => item.menuCategoryId === menuCategoryId
        )
    );

    if (toAdd.length) {
      await prisma.$transaction(
        toAdd.map((menuCategoryId: number) =>
          prisma.menuCategoryMenu.create({
            data: { menuCategoryId, menuId: id },
          })
        )
      );
    }

    const updateMenuCategoryMenu = await prisma.menuCategoryMenu.findMany({
      where: { menuId: { in: menuIds } },
    });

    res.status(200).json({
      updatedMenu,
      disabledLocationMenu,
      menuCategoryMenu: updateMenuCategoryMenu,
    });
  } else if (method === "DELETE") {
    const menuId = Number(req.query.id);

    const existMenu = await prisma.menu.findFirst({ where: { id: menuId } });

    if (!existMenu) {
      return res.status(400).send("Bad request.");
    }

    await prisma.menu.update({
      data: { isArchived: true },
      where: { id: menuId },
    });

    res.status(200).send("OK");
  }
}
