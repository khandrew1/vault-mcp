import { client } from "@/lib/redis";
import { NextRequest } from "next/server";

function parseDoc(doc) {
  // Assuming doc.id is the array like you showed
  const arr = doc.id;
  const obj = {};

  for (let i = 0; i < arr.length; i += 2) {
    const key = arr[i];
    const value = arr[i + 1];
    obj[key] = value;
  }

  return obj;
}

export const GET = async (req: NextRequest) => {
  const project = req.nextUrl.searchParams.get("p");

  if (!project) return Response.json({});

  await client.connect();

  const result = await client.ft.search("context", `@project:{${project}}`);

  await client.close();

  if (!result || result.total === 0) return Response.json([]);

  const response = result.documents.map((doc) => {
    const result = parseDoc(doc);

    if (Object.keys(result).length !== 4) return null;

    return {
      user: result.user,
      project: result.project,
      content: result.content,
    };
  });

  // console.log(response)

  return Response.json(response.filter((data) => data !== null));
};
