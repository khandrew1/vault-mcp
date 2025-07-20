import { client } from "@/lib/redis";
import { v4 as uuidv4 } from "uuid";
import { currentUser } from "@clerk/nextjs/server";

export const POST = async (req: Request) => {
  await client.connect();

  const id = "123";
  const name = "Jane Doe";

  const result = await client.ft.search("vault:users", `@id:${id}`);

  const { project } = await req.json();

  const project_id = project + uuidv4();

  await client.close();

  if (result.total === 0) return Response.json({});

  if (result.total > 0) {
    const doc = result.documents[0];

    const projects = doc.value.projects?.split(",") ?? [];

    client.hSet(`user:${id}`, {
      id: id,
      name: name,
      projects: projects.push(project_id),
      createdAt: Math.floor(Date.now() / 1000),
    });
  } else {
    return Response.json({});
  }
};

export const GET = async () => {
  const user = await currentUser();

  if (!user) return Response.json({ status: 403 });

  const { primaryEmailAddressId } = user;

  await client.connect();

  const result = await client.ft.search(
    "vault:users",
    `@id:${primaryEmailAddressId}`,
  );
  // const result = await client.ft.search("vault:users", `@project:${project}`);

  if (!result) return Response.json([]);

  if (result.total === 0) return Response.json([]);

  await client.close();

  if (result.total > 0) {
    const doc = result.documents[0];

    return Response.json(doc.value.projects?.split(",") ?? []);
  } else {
    return Response.json([]);
  }
};
