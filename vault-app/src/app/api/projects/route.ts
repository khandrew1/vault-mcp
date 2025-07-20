import { client } from "@/lib/redis";

export const POST = async (req: Request) => {
  await client.connect();

  const id = "123";
  const name = "Jane Doe"

  const result = await client.ft.search("vault:users", `@id:${id}`);

  const { project } = await req.json();

  if (result.total === 0) return Response.json({});

  if (result.total > 0) {
    const doc = result.documents[0];

    const projects = doc.value.projects?.split(",") ?? [];

    client.hSet(`user:${id}`, {
      id: id,
      name: name,
      projects: projects.push(project),
      createdAt:  Math.floor(Date.now() / 1000)
    });
  } else {
    return Response.json({});
  }
};
