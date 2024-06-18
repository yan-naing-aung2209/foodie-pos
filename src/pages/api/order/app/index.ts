import { prisma } from "@/utils/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;

  if (method === "GET") {
    //validation
    const { tableId, orderSeq } = req.query;

    const valid = tableId && orderSeq;

    if (!valid) return res.status(500).send("Internal server error");

    const existTable = await prisma.table.findFirst({
      where: { id: Number(tableId), isArchived: false },
    });

    if (!existTable) {
      res.status(400).send("Bad request.");
    }

    //get table
    const table = existTable;

    const orders = await prisma.order.findMany({
      where: { tableId: table.id, orderSeq: String(orderSeq) },
    });

    //get location
    const location = await prisma.location.findFirst({
      where: { id: table.locationId, isArchived: false },
    });

    //get company
    const company = await prisma.company.findFirst({
      where: { id: location.companyId },
    });

    //get menuCategory
    let menuCategories = await prisma.menuCategory.findMany({
      where: { companyId: company.id, isArchived: false },
    });

    const disabledLocationMenuCategory =
      await prisma.disabledLocationMenuCategory.findMany({
        where: { locationId: location.id },
      });

    const filteredMenuCategoryIds = menuCategories
      .map((item) => item.id)
      .filter(
        (menuCategoryId) =>
          !disabledLocationMenuCategory.find(
            (disabledMenuCategory) =>
              disabledMenuCategory.menuCategoryId === menuCategoryId
          )
      );

    menuCategories = await prisma.menuCategory.findMany({
      orderBy: [{ id: "asc" }],
      where: { id: { in: filteredMenuCategoryIds }, isArchived: false },
    });

    //get menuCategoryMenu
    const menuCategoryMenu = await prisma.menuCategoryMenu.findMany({
      where: { menuCategoryId: { in: menuCategories.map((item) => item.id) } },
    });

    const menuIds = menuCategoryMenu.map((item) => item.menuId);

    //get menu
    let menus = await prisma.menu.findMany({
      where: { id: { in: menuIds }, isArchived: false },
    });

    const disabledLocationMenu = await prisma.disabledLocationMenu.findMany({
      where: { locationId: location.id },
    });

    const filteredMenuIds = menus
      .map((item) => item.id)
      .filter(
        (menuId) =>
          !disabledLocationMenu.find(
            (disabledMenu) => disabledMenu.menuId === menuId
          )
      );

    menus = await prisma.menu.findMany({
      orderBy: [{ id: "asc" }],
      where: { id: { in: filteredMenuIds }, isArchived: false },
    });

    //get menuAddonCategory
    const menuAddonCategory = await prisma.menuAddonCategory.findMany({
      where: { menuId: { in: menus.map((item) => item.id) } },
    });

    const addonCategoryIds = menuAddonCategory.map(
      (item) => item.addonCategoryId
    );

    //get addonCategory
    const addonCategories = await prisma.addonCategory.findMany({
      orderBy: [{ id: "asc" }],
      where: { id: { in: addonCategoryIds }, isArchived: false },
    });

    //get addon
    const addons = await prisma.addon.findMany({
      orderBy: [{ id: "asc" }],
      where: {
        addonCategoryId: { in: addonCategories.map((item) => item.id) },
        isArchived: false,
      },
    });

    res.status(200).json({
      company,
      locations: [location],
      tables: [table],
      menuCategories,
      menus,
      addonCategories,
      addons,
      orders,
      menuCategoryMenu,
      menuAddonCategory,
      disabledLocationMenuCategory: [],
      disabledLocationMenu: [],
    });
  }
}
