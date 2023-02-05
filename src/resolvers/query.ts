import { Context } from "..";

export const Query = {
  me: async (_: any, __: any, { prisma, userInfo }: Context) => {
    if (!userInfo) return null;
    const user = await prisma.user.findUnique({
      where: {
        id: userInfo.userId,
      },
    });

    return user;
  },

  profile: (_: any, { userId }: { userId: string }, { prisma }: Context) => {
    return prisma.profile.findUnique({
      where: {
        userId: Number(userId),
      },
    });
  },

  posts: (_: any, __: any, { prisma }: Context) => {
    return prisma.post.findMany({
      where: {
        published: true,
      },
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
    });
  },
};
