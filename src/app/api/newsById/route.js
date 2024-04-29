export async function GET(request) {
  const responseData = {
    code: 200,
    status: "SUCCESS",
    recordsTotal: 0,
    data: {
      id: "NWS-12345",
      title:
        "Menuju Era Baru: Bagaimana Teknologi Mengubah Cara Kita Hidup dan Bekerja",
      description:
        "There is a groundbreaking innovation on the horizon that promises to redefine the world of software engineering. Meet Devin, the first-ever AI software engineer developed by cognition, a leading tech company. This cutting-edge AI tool possesses remarkable capabilities, enabling it to write codes, create websites, and develop software with a single prompt.",
      mediaUrl:
        "https://img.freepik.com/free-photo/light-trails-buildings_1359-715.jpg?t=st=1714378786~exp=1714382386~hmac=fe2d5da937c6da03e86b21fd9c2d33aa1b211618b6cce7fd2b6efe0e0edff1f9&w=2000",
      createdAt: "2013-02-26 21:28:37.261134+01:00",
      updatedAt: "2013-02-26 21:28:37.261134+01:00",
    },
    error: null,
  };
  return new Response(JSON.stringify(responseData));
}
