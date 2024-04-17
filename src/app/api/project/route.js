export async function GET(request) {
  const responseData = {
    code: 200,
    status: 'SUCCESS',
    recordsTotal: 0,
    data: [
      {
        id: 'PRJ-1',
        name: 'Web App Ecomerce by AkuBangkrut',
        description:
          'Pemenang Web Development Acara Gemastik. Penghargaan ini diberikan kepada individu atau tim yang berhasil merancang dan mengembangkan situs web yang inovatif, fungsional, dan memiliki dampak positif dalam konteks kompetisi Gemastik. Pemenangnya menonjol dalam kreativitas desain, kemampuan teknis, dan kecakapan dalam membangun pengalaman pengguna yang memikat. Dengan pencapaian ini, pemenang berperan penting dalam menginspirasi dan memajukan industri pengembangan web di Indonesia.',
        productionUrl: 'https://github.com/Central-Computer-Improvement-Org',
        repositoryUrl: 'https://github.com/Central-Computer-Improvement-Org',
        budget: 1000000,
      },
    ],
    error: null,
  };
  return new Response(JSON.stringify(responseData));
}
