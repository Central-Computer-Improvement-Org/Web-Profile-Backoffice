export async function GET(request) {
  const responseData = {
    code: 200,
    status: 'SUCCESS',
    recordsTotal: 0,
    data: [
      {
        id: 'PRJ-12345',
        issuer: 'Penghargaan Web Development Gemastik',
        productionUrl: 'https://github.com/name/example',
        repositoryUrl: 'https://github.com/name/example',
      },
      {
        id: 'PRJ-12345',
        issuer: 'Penghargaan Web Development Gemastik',
        productionUrl: 'https://github.com/name/example',
        repositoryUrl: 'https://github.com/name/example',
      },
      {
        id: 'PRJ-12345',
        issuer: 'Penghargaan Web Development Gemastik',
        productionUrl: 'https://github.com/name/example',
        repositoryUrl: 'https://github.com/name/example',
      },
    ],
    error: null,
  };
  return new Response(JSON.stringify(responseData));
}
