export async function GET(request) {
  const responseData = {
    code: 200,
    status: 'SUCCESS',
    recordsTotal: 0,
    data: [
      {
        id: 'CCI-WEBD',
        name: 'Web Development',
        description:
          'Web Developer adalah perancang sebuah website / www. Web Developer merancang sebuah website dari awal sekali, menciptakan coding dsb, atau bisa juga seorang Web Developer mengembangkan sebuah website yang sudha ada. Web Developer bisa bekerja secara terikat dengan perusahaan, atau menjadi pekerja lepas (freelancer).',
        logoUrl:
          'https://img.freepik.com/free-vector/gradient-code-logo-with-tagline_23-2148811020.jpg?size=338&ext=jpg&ga=GA1.1.1224184972.1711756800&semt=ais',
      },
    ],
    error: null,
  };
  return new Response(JSON.stringify(responseData));
}
