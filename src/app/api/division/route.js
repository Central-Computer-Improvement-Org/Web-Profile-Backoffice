export async function GET(request) {
  const responseData = {
    code: 200,
    status: "SUCCESS",
    recordsTotal: 0,
    data: [
      {
        id: "DVS-1232213",
        name: "Design",
        description: "Ini Adalah Deskripsi Divisi Desain",
        logo_uri: "https://images/design.png",
        createdAt: "2013-02-26 21:28:37.261134+01:00",
        updatedAt: "2013-02-26 21:28:37.261134+01:00",
      },
      {
        id: "DVS-12099832",
        name: "Web Development",
        description: "Ini Adalah Deskripsi Divisi Web Development",
        logo_uri: "https://images/web.png",
        createdAt: "2013-02-26 21:28:37.261134+01:00",
        updatedAt: "2013-02-26 21:28:37.261134+01:00",
      },
      {
        id: "DVS-12091132",
        name: "Data Research",
        description: "Ini Adalah Deskripsi Divisi Data Research",
        logo_uri: "https://images/data.png",
        createdAt: "2013-02-26 21:28:37.261134+01:00",
        updatedAt: "2013-02-26 21:28:37.261134+01:00",
      },
      {
        id: "DVS-12099835",
        name: "Network",
        description: "Ini Adalah Deskripsi Divisi Network",
        logo_uri: "https://images/network.png",
        createdAt: "2013-02-26 21:28:37.261134+01:00",
        updatedAt: "2013-02-26 21:28:37.261134+01:00",
      },
      {
        id: "DVS-12091235",
        name: "Games and Gadget",
        description: "Ini Adalah Deskripsi Divisi Games and Gadget",
        logo_uri: "https://images/gng.png",
        createdAt: "2013-02-26 21:28:37.261134+01:00",
        updatedAt: "2013-02-26 21:28:37.261134+01:00",
      },
      {
        id: "DVS-122491235",
        name: "Media Management",
        description: "Ini Adalah Deskripsi Divisi Media Management",
        logo_uri: "https://images/mm.png",
        createdAt: "2013-02-26 21:28:37.261134+01:00",
        updatedAt: "2013-02-26 21:28:37.261134+01:00",
      },
    ],
    error: null,
  };
  return new Response(JSON.stringify(responseData));
}
