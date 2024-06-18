// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { qrCodeImageUpload } from "@/utils/assetUpload";
import { prisma } from "@/utils/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  const method = req.method;

  if (method === "GET") {
    if (session) {
      //validation
      const { user } = session;
      console.log("##############################");
      console.log("session :", session);
      console.log("##############################");

      const name = user.name as string;
      const email = user.email as string;

      const existUser = await prisma.user.findFirst({ where: { email } });
      if (existUser) {
        //get companyId from user
        const companyId = existUser.companyId;

        //get company
        const company = await prisma.company.findFirst({
          where: { id: companyId },
        });

        //get location by using companyId
        const locations = await prisma.location.findMany({
          orderBy: [{ id: "asc" }],
          where: { companyId, isArchived: false },
        });

        //get locationIds from location
        const locationIds = locations.map((item) => item.id);

        //get table by using locationId
        const tables = await prisma.table.findMany({
          orderBy: [{ id: "asc" }],
          where: { locationId: { in: locationIds }, isArchived: false },
        });

        //user-->company-->menuCategory-->menuCategoryMenu-->menu(get menu step-by-step)

        //get menuCategories
        const menuCategories = await prisma.menuCategory.findMany({
          orderBy: [{ id: "asc" }],
          where: { companyId, isArchived: false },
        });
        //get menuCategoryIds from menuCategories
        const menuCategoryIds = menuCategories.map((item) => item.id);

        //get menuCategoryMenu
        const menuCategoryMenu = await prisma.menuCategoryMenu.findMany({
          where: { menuCategoryId: { in: menuCategoryIds } },
        });

        //get disabledLocationMenuCategory
        const disabledLocationMenuCategory =
          await prisma.disabledLocationMenuCategory.findMany({
            where: { menuCategoryId: { in: menuCategoryIds } },
          });

        //get  menuIds from menuCategoryMenu
        const menuIds = menuCategoryMenu.map((item) => item.menuId);

        //get menu
        const menus = await prisma.menu.findMany({
          orderBy: [{ id: "asc" }],
          where: { id: { in: menuIds }, isArchived: false },
        });

        //get disabledLocationMenu
        const disabledLocationMenu = await prisma.disabledLocationMenu.findMany(
          {
            where: { menuId: { in: menuIds } },
          }
        );

        //get menuAddonCategory
        const menuAddonCategory = await prisma.menuAddonCategory.findMany({
          where: { menuId: { in: menuIds } },
        });

        //get addonCategoryIds  from menuAddonCategory
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

        const orders = await prisma.order.findMany({
          where: { tableId: { in: tables.map((item) => item.id) } },
        });

        res.status(200).json({
          company,
          locations,
          tables,
          menuCategories,
          menus,
          addonCategories,
          addons,
          orders,
          menuCategoryMenu,
          menuAddonCategory,
          disabledLocationMenuCategory,
          disabledLocationMenu,
        });
      } else {
        //default company
        const newCompany = await prisma.company.create({
          data: {
            name: "default company",
            street: "default street",
            township: "default township",
            city: "default city",
          },
        });

        //get companyId from company
        const companyId = newCompany.id;

        //create default user
        const newUser = await prisma.user.create({
          data: { name, email, companyId },
        });

        //default location
        const newLocation = await prisma.location.create({
          data: {
            name: "default location",
            street: "default street",
            township: "default township",
            city: "default city",
            companyId,
          },
        });

        //get locationId from location
        const locationId = newLocation.id;

        //default table
        let newTable = await prisma.table.create({
          data: {
            name: "default table",
            assetUrl: "",
            locationId,
          },
        });

        //set assetUrl
        const assetUrl = await qrCodeImageUpload(newTable.id);

        newTable = await prisma.table.update({
          data: { assetUrl },
          where: { id: newTable.id },
        });

        //default menuCategory
        const defaultMenuCategoryData = {
          name: "default menu Category",
          companyId,
        };
        const newMenuCategory = await prisma.menuCategory.create({
          data: defaultMenuCategoryData,
        });

        //default menu
        const defaultMenuData = { name: "default menu" };

        const newMenu = await prisma.menu.create({ data: defaultMenuData });

        //get menuCategoryId and menuId from menuCategory and menu
        const menuCategoryId = newMenuCategory.id;
        const menuId = newMenu.id;

        //join table menuCategoryMenu
        const menuCategoryMenu = await prisma.menuCategoryMenu.create({
          data: { menuCategoryId, menuId },
        });

        //default addonCategory
        const newAddonCategory = await prisma.addonCategory.create({
          data: { name: "default addon category" },
        });

        //get addonCategoroyId from addonCategory
        const addonCategoryId = newAddonCategory.id;

        //join table menuAddonCategory
        const menuAddonCategory = await prisma.menuAddonCategory.create({
          data: { menuId, addonCategoryId },
        });

        //default addon
        const defaultAddonDatas = [
          { name: "default-1 addon", addonCategoryId },
          { name: "default-2 addon", addonCategoryId },
          { name: "default-3 addon", addonCategoryId },
        ];
        const newAddon = await prisma.$transaction(
          defaultAddonDatas.map((item) => prisma.addon.create({ data: item }))
        );

        res.status(200).json({
          company: newCompany,
          locations: [newLocation],
          tables: [newTable],
          menuCategories: [newMenuCategory],
          menus: [newMenu],
          addonCategories: [newAddonCategory],
          addons: newAddon,
          orders: [],
          menuCategoryMenu: [menuCategoryMenu],
          menuAddonCategory: [menuAddonCategory],
          disabledLocationMenuCategory: [],
          disabledLocationMenu: [],
        });
      }
    } else {
      res.status(401).send("unauthorized");
    }
  }
}
