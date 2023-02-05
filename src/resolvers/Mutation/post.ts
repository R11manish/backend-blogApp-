import { Post, Prisma } from "@prisma/client";
import { Context } from "../../index";
import { canUserMutatePost } from "../../utlis/canUserMutatePost";

interface postArgs {
  post: { title?: string; content?: string };
}

interface PostPayloadType {
  userErrors: {
    message: string;
  }[];
  post: Post | Prisma.Prisma__PostClient<Post> | null;
}

export const postResolvers = {
  postCreate: async (
    _: any,
    { post }: postArgs,
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType> => {
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: "Forbidden access (unauthenticated)",
          },
        ],
        post: null,
      };
    }

    const { title, content } = post;
    if (!title || !content) {
      return {
        userErrors: [
          {
            message: "You must provide a title and a content to create a post",
          },
        ],
        post: null,
      };
    }

    return {
      userErrors: [],
      post: prisma.post.create({
        data: {
          title,
          content,
          authorId: userInfo.userId,
        },
      }),
    };
  },

  postUpdate: async (
    _: any,
    {
      post,
      postId,
    }: {
      postId: string;
      post: postArgs["post"];
    },
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType> => {
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: "Forbidden access (unauthenticated)",
          },
        ],
        post: null,
      };
    }

    const error = await canUserMutatePost({
      userId: userInfo.userId,
      postId: Number(postId),
      prisma,
    });

    if (error) return error;
    const { title, content } = post;
    if (!title && !content) {
      return {
        userErrors: [
          {
            message: "Need to have at least on field to update",
          },
        ],
        post: null,
      };
    }

    let payloadToUpdate = {
      title,
      content,
    };

    if (!title) delete payloadToUpdate.title;
    if (!content) delete payloadToUpdate.content;

    const existingPost = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });

    if (!existingPost) {
      return {
        userErrors: [
          {
            message: "Post does not exist",
          },
        ],
        post: null,
      };
    }

    return {
      userErrors: [],
      post: prisma.post.update({
        data: {
          ...payloadToUpdate,
        },
        where: {
          id: Number(postId),
        },
      }),
    };
  },

  postDelete: async (
    _: any,
    {
      postId,
    }: {
      postId: string;
    },
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType> => {
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: "Forbidden access (unauthenticated)",
          },
        ],
        post: null,
      };
    }

    const error = await canUserMutatePost({
      userId: userInfo.userId,
      postId: Number(postId),
      prisma,
    });

    const post = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });

    if (error) return error;

    if (!post) {
      return {
        userErrors: [
          {
            message: "Post does not exist",
          },
        ],
        post: null,
      };
    }

    await prisma.post.delete({
      where: {
        id: Number(postId),
      },
    });

    return {
      userErrors: [],
      post,
    };
  },

  postPublish: async (
    _: any,
    {
      postId,
      publish,
    }: {
      postId: string;
      publish: boolean;
    },
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType> => {
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: "Forbidden access (unauthenticated)",
          },
        ],
        post: null,
      };
    }

    const error = await canUserMutatePost({
      userId: userInfo.userId,
      postId: Number(postId),
      prisma,
    });

    if (error) return error;

    const post = await prisma.post.update({
      data: {
        published: publish,
      },
      where: {
        id: Number(postId),
      },
    });

    return {
      userErrors: [],
      post,
    };
  },
};
