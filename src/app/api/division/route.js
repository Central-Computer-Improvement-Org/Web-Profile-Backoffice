export async function GET(request) {
  const responseData = {
    code: 200,
    status: 'SUCCESS',
    recordsTotal: 0,
    data: [{}],
    error: null,
  };
  return new Response(JSON.stringify(responseData));
}
