import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all career timeline events, sorted by order
export const getAllEvents = query({
  handler: async (ctx) => {
    const events = await ctx.db
      .query("careerTimeline")
      .withIndex("by_order")
      .order("asc")
      .collect();
    return events;
  },
});

// Add a new career timeline event
export const addEvent = mutation({
  args: {
    year: v.string(),
    title: v.string(),
    description: v.string(),
    location: v.optional(v.string()),
    iconName: v.string(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const eventId = await ctx.db.insert("careerTimeline", {
      year: args.year,
      title: args.title,
      description: args.description,
      location: args.location,
      iconName: args.iconName,
      order: args.order,
      createdAt: now,
      updatedAt: now,
    });
    return eventId;
  },
});

// Update an existing career timeline event
export const updateEvent = mutation({
  args: {
    id: v.id("careerTimeline"),
    year: v.string(),
    title: v.string(),
    description: v.string(),
    location: v.optional(v.string()),
    iconName: v.string(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    await ctx.db.patch(id, {
      ...updateData,
      updatedAt: Date.now(),
    });
  },
});

// Delete a career timeline event
export const deleteEvent = mutation({
  args: {
    id: v.id("careerTimeline"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Reorder events (update order for multiple events)
export const reorderEvents = mutation({
  args: {
    updates: v.array(
      v.object({
        id: v.id("careerTimeline"),
        order: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    for (const update of args.updates) {
      await ctx.db.patch(update.id, {
        order: update.order,
        updatedAt: now,
      });
    }
  },
});

// Seed initial career timeline data
export const seedTimeline = mutation({
  handler: async (ctx) => {
    // Check if data already exists
    const existing = await ctx.db.query("careerTimeline").collect();
    if (existing.length > 0) {
      return { message: "Timeline already seeded", count: existing.length };
    }

    const now = Date.now();
    const events = [
      {
        year: "2013",
        title: "I Am a First-Generation College Graduate",
        description:
          "Graduated from University of North Florida with Bachelor of Arts with a concentration in Multimedia Journalism & Production",
        location: "Jacksonville, FL",
        iconName: "GraduationCap",
        order: 0,
        createdAt: now,
        updatedAt: now,
      },
      {
        year: "2013-2016",
        title: "Lights, Camera, Action",
        description: "I Started a Career in Video Editing and Production",
        location: "Jacksonville, FL",
        iconName: "Video",
        order: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        year: "2016",
        title: "I Enjoyed Coding My Personal Website So Much I Switched Careers",
        description:
          "Decided to switch from video production to web design after designing personal website",
        location: "Jacksonville, FL",
        iconName: "Star",
        order: 2,
        createdAt: now,
        updatedAt: now,
      },
      {
        year: "2017",
        title: "Front-End Web Development (jQuery Days)",
        description:
          "Began working with WordPress Theme and Plugin Development, JavaScript, jQuery, and the MERN Stack",
        location: "Jacksonville, FL",
        iconName: "Lightbulb",
        order: 3,
        createdAt: now,
        updatedAt: now,
      },
      {
        year: "2018",
        title: "We Moved to the Mountains, Because Why Not?",
        description:
          "Relocated to Harrisonburg, Virginia in the Shenandoah Mountains",
        location: "Harrisonburg, VA",
        iconName: "Mountain",
        order: 4,
        createdAt: now,
        updatedAt: now,
      },
      {
        year: "2019",
        title: "Moved Once Again — Moving Companies Love Us",
        description:
          "Picked Living Among the Cows to Be Near the Mountains and Richmond, VA.",
        location: "Louisa, VA",
        iconName: "Home",
        order: 5,
        createdAt: now,
        updatedAt: now,
      },
      {
        year: "2023",
        title: "WordPress Meetup Host",
        description:
          "Started leading Richmond's local WordPress meetup with monthly sessions.",
        location: "Louisa, VA",
        iconName: "Users",
        order: 6,
        createdAt: now,
        updatedAt: now,
      },
      {
        year: "2024",
        title: "React Developer That Also Does WordPress",
        description:
          "Shifted More to React After Seeing the Animations (I Still Do WordPress Too)",
        location: "Louisa, VA",
        iconName: "Code2",
        order: 7,
        createdAt: now,
        updatedAt: now,
      },
    ];

    for (const event of events) {
      await ctx.db.insert("careerTimeline", event);
    }

    return { message: "Timeline seeded successfully", count: events.length };
  },
});
