import { type CollectionEntry, getCollection } from "astro:content";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { getCategoryUrl } from "@utils/url-utils";

// // Retrieve posts and sort them by publication date
async function getRawSortedPosts() {
  const posts = await getCollection("posts", ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  });
  const projects = await getCollection("projects", ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  });
  const events = await getCollection("events", ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  });

  const allBlogPosts = [...posts, ...projects, ...events];

  const sorted = allBlogPosts.sort((a, b) => {
    // Primero ordena por estado de fijado, las publicaciones fijadas van primero.
    if (a.data.pinned && !b.data.pinned) return -1;
    if (!a.data.pinned && b.data.pinned) return 1;

    // Si el estado de fijado es el mismo, ordena por fecha de publicación.
    const dateA = new Date(a.data.published);
    const dateB = new Date(b.data.published);
    return dateA > dateB ? -1 : 1;
  });
  return sorted;
}

export async function getSortedPosts() {
  const sorted = await getRawSortedPosts();

  for (let i = 1; i < sorted.length; i++) {
    sorted[i].data.nextSlug = sorted[i - 1].id;
    sorted[i].data.nextTitle = sorted[i - 1].data.title;
  }
  for (let i = 0; i < sorted.length - 1; i++) {
    sorted[i].data.prevSlug = sorted[i + 1].id;
    sorted[i].data.prevTitle = sorted[i + 1].data.title;
  }

  return sorted;
}
export type PostForList = {
  id: string;
  data: CollectionEntry<"posts">["data"];
};
export async function getSortedPostsList(): Promise<PostForList[]> {
  const sortedFullPosts = await getRawSortedPosts();

  // Eliminar post.body
  const sortedPostsList = sortedFullPosts.map((post) => ({
    id: post.id,
    data: post.data,
  }));

  return sortedPostsList;
}
export type Tag = {
  name: string;
  count: number;
};

export async function getTagList(): Promise<Tag[]> {
  const posts = await getCollection("posts", ({ data }) => import.meta.env.PROD ? data.draft !== true : true);
  const projects = await getCollection("projects", ({ data }) => import.meta.env.PROD ? data.draft !== true : true);
  const events = await getCollection("events", ({ data }) => import.meta.env.PROD ? data.draft !== true : true);
  const allBlogPosts = [...posts, ...projects, ...events];

  const countMap: { [key: string]: number } = {};
  allBlogPosts.forEach((post: { data: { tags: string[] } }) => {
    post.data.tags.forEach((tag: string) => {
      if (!countMap[tag]) countMap[tag] = 0;
      countMap[tag]++;
    });
  });

  // Ordenar etiquetas
  const keys: string[] = Object.keys(countMap).sort((a, b) => {
    return a.toLowerCase().localeCompare(b.toLowerCase());
  });

  return keys.map((key) => ({ name: key, count: countMap[key] }));
}

export type Category = {
  name: string;
  count: number;
  url: string;
};

export async function getCategoryList(): Promise<Category[]> {
  const posts = await getCollection("posts", ({ data }) => import.meta.env.PROD ? data.draft !== true : true);
  const projects = await getCollection("projects", ({ data }) => import.meta.env.PROD ? data.draft !== true : true);
  const events = await getCollection("events", ({ data }) => import.meta.env.PROD ? data.draft !== true : true);
  const allBlogPosts = [...posts, ...projects, ...events];
  const count: { [key: string]: number } = {};
  allBlogPosts.forEach((post: { data: { category: string | null } }) => {
    if (!post.data.category) {
      const ucKey = i18n(I18nKey.uncategorized);
      count[ucKey] = count[ucKey] ? count[ucKey] + 1 : 1;
      return;
    }

    const categoryName = typeof post.data.category === "string" ? post.data.category.trim() : String(post.data.category).trim();

    count[categoryName] = count[categoryName] ? count[categoryName] + 1 : 1;
  });

  const lst = Object.keys(count).sort((a, b) => {
    return a.toLowerCase().localeCompare(b.toLowerCase());
  });

  const ret: Category[] = [];
  for (const c of lst) {
    ret.push({
      name: c,
      count: count[c],
      url: getCategoryUrl(c),
    });
  }
  return ret;
}
