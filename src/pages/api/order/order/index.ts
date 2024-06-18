import { CartItem } from "@/types/cart";
import { getCartTotalPrice } from "@/utils/generals";
import { prisma } from "@/utils/prisma";
import { ORDERSTATUS } from "@prisma/client";
import { nanoid } from "nanoid";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;

  if (method === "GET") {
    const { orderSeq } = req.query;
    if (!orderSeq) return res.status(400).send("Bad request");

    const orders = await prisma.order.findMany({
      where: { orderSeq: String(orderSeq) },
    });
    if (!orders.length) return res.status(401).send("unauthorized");

    res.status(200).json({ orders });
  } else if (method === "POST") {
    const { tableId, cartItems } = req.body;
    const valid = tableId && cartItems.length > 0;

    if (!valid) return res.status(400).send("Bad request");

    const order = await prisma.order.findFirst({
      where: { tableId, status: ORDERSTATUS.PENDING || ORDERSTATUS.COOKING },
    });

    const orderSeq = order ? order.orderSeq : nanoid();
    const totalPrice = order ? order.totalPrice : getCartTotalPrice(cartItems);

    for (const item of cartItems as CartItem[]) {
      const menuId = item.menu.id;
      const addons = item.addons;
      const quantity = item.quantity;
      if (addons.length > 0) {
        for (const addon of addons) {
          await prisma.order.create({
            data: {
              menuId,
              addonId: addon.id,
              quantity,
              itemId: item.id,
              orderSeq,
              status: ORDERSTATUS.PENDING,
              totalPrice,
              tableId,
            },
          });
        }
      } else {
        await prisma.order.create({
          data: {
            menuId,
            quantity,
            itemId: item.id,
            orderSeq,
            status: ORDERSTATUS.PENDING,
            totalPrice,
            tableId,
          },
        });
      }
    }

    await prisma.order.updateMany({
      data: { totalPrice },
      where: { orderSeq },
    });
    const orders = await prisma.order.findMany({ where: { orderSeq } });
    res.status(200).json({ orders });
  }
}
