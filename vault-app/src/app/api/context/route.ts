import { client } from "@/lib/redis";
import { NextRequest } from "next/server";

function parseDoc(doc) {
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

  console.log("RESULT", result)

  if (!result || result.total === 0) return Response.json([]);

  const response = result.documents.map((doc) => {      
    return {
      user: doc.value.user,
      project: doc.value.project,
      content: doc.value.content,
    };
  });

  // console.log(response)

  return Response.json(response.filter((data) => data !== null));
};
