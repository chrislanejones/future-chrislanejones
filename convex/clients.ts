import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db
      .query("clients")
      .withIndex("by_order")
      .order("asc")
      .collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    url: v.string(),
    logo: v.string(),
    logoAlt: v.optional(v.string()),
    order: v.number(),
  },
  handler: async (ctx, args) => {

    return ctx.db.insert("clients", {
      ...args,
      logoAlt: args.logoAlt ?? `${args.name} logo`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("clients"),
    name: v.optional(v.string()),
    url: v.optional(v.string()),
    logo: v.optional(v.string()),
    logoAlt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {

    const { id, ...fields } = args;
    return ctx.db.patch(id, { ...fields, updatedAt: Date.now() });
  },
});

export const deleteClient = mutation({
  args: { id: v.id("clients") },
  handler: async (ctx, args) => {

    return ctx.db.delete(args.id);
  },
});

export const reorder = mutation({
  args: {
    items: v.array(v.object({ id: v.id("clients"), order: v.number() })),
  },
  handler: async (ctx, args) => {

    for (const item of args.items) {
      await ctx.db.patch(item.id, { order: item.order, updatedAt: Date.now() });
    }
  },
});

export const seedClients = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("clients").collect();
    if (existing.length > 0) {
      return { success: true, message: "Clients already seeded" };
    }

    const seed = [
      { name: "Allianz Travel", logo: "/client-icons/Allianz-Travel-Logo.webp", url: "https://www.allianztravelinsurance.com/" },
      { name: "Blue Triangle", logo: "/client-icons/Blue-Triangle-Logo.webp", url: "https://bluetriangle.com/" },
      { name: "VITA", logo: "/client-icons/VITA-Logo.webp", url: "https://www.vita.virginia.gov/" },
      { name: "Adecco", logo: "/client-icons/Adecco-Logo.webp", url: "https://www.adeccousa.com/" },
      { name: "RS&H", logo: "/client-icons/RSandH-Logo.webp", url: "https://www.rsandh.com/" },
      { name: "American Airlines", logo: "/client-icons/American-Airlines-Logo.webp", url: "https://www.aa.com/" },
      { name: "Asponte", logo: "/client-icons/Asponte-Logo.webp", url: "https://asponte.com/" },
      { name: "Florida Dept of Transportation", logo: "/client-icons/Florida-Dept-of-Transportation-Logo.webp", url: "https://www.fdot.gov/" },
      { name: "AIS Network", logo: "/client-icons/AIS-Network-Logo.webp", url: "https://aisn.net/" },
      { name: "Amtrak", logo: "/client-icons/Amtrak-Logo.webp", url: "https://www.amtrak.com/home" },
      { name: "USDOT", logo: "/client-icons/USDOT-Logo.webp", url: "https://transportation.gov/" },
      { name: "StubHub", logo: "/client-icons/StubHub-Logo.webp", url: "https://www.stubhub.com/" },
      { name: "Gov of Virginia - Abigail Spanberger", logo: "/client-icons/Gov-of-Virginia-Abigail Spanberger-Logo.webp", url: "https://www.governor.virginia.gov/" },
      { name: "Elvacomm", logo: "/client-icons/Elvacomm-Logo.webp", url: "https://elvacomm.com/" },
      { name: "Engage Marketing", logo: "/client-icons/Engage-Marketing-Logo.webp", url: "https://engagemarketing.biz/" },
      { name: "Fisher Design", logo: "/client-icons/Fisher-Design-Logo.webp", url: "https://www.fisherdesignandadvertising.com/" },
      { name: "WorldStrides", logo: "/client-icons/WorldStrides-Logo.webp", url: "https://worldstrides.com/" },
      { name: "Azzly", logo: "/client-icons/AZZLY-Logo.webp", url: "https://azzly.com/" },
      { name: "Alembic", logo: "/client-icons/Alembic-Logo.webp", url: "https://getalembic.com/" },
      { name: "Provision Partners", logo: "/client-icons/Provision-Partners-Logo.webp", url: "https://www.provisionpartners.com/" },
      { name: "Marko & Partners", logo: "/client-icons/Marko-and-Partners-Logo.webp", url: "https://markoandpartners.com/" },
    ];

    for (let i = 0; i < seed.length; i++) {
      await ctx.db.insert("clients", {
        ...seed[i],
        logoAlt: `${seed[i].name} logo`,
        order: i,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    return { success: true, inserted: seed.length };
  },
});
