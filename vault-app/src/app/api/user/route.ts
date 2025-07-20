import { client } from "@/lib/redis";

export const GET = async () => {
  await client.connect();

  const id = "123";

  const result = await client.ft.search("vault:users", `@id:${id}`);

  await client.close();

  if (!result) return Response.json({});

  if (result.total === 0) return Response.json({});

  if (result.total > 0) {
    const doc = result.documents[0];

    return Response.json({
      id: doc.value.id,
      name: doc.value.name,
      projects: doc.value.projects?.split(",") ?? [],
      createdAt: doc.value.createdAt,
    });
  } else {
    return Response.json({});
  }
};
