export async function GET(request) {
  const responseData = {
    code: 200,
    status: "SUCCESS",
    recordsTotal: 0,
    data: {
      id: "DVS-1232213",
      name: "Design",
      description: "Ini Adalah Deskripsi Divisi Desain",
      logo_uri: "https://images/design.png",
      createdAt: "2013-02-26 21:28:37.261134+01:00",
      updatedAt: "2013-02-26 21:28:37.261134+01:00",
    },
    error: null,
  };
  return new Response(JSON.stringify(responseData));
}
