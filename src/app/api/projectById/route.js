export async function GET(request) {
  const responseData = {
    code: 200,
    status: 'SUCCESS',
    recordsTotal: 0,
    data: {
      id: 'PRJ-1',
      name: 'Web App Ecomerce by AkuBangkrut',
      productionUrl: 'https://github.com/name/example',
      repositoryUrl: 'https://github.com/name/example',
      contributors: [{}],
    },
    error: null,
  };
  return new Response(JSON.stringify(responseData));
}
