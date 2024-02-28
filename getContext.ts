import config from "./keystone";
import { getContext } from "@keystone-6/core/context";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const context = getContext(config, prisma);
