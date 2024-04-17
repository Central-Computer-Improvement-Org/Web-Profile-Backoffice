export async function GET(request) {
  const responseData = {
    code: 200,
    status: 'SUCCESS',
    recordsTotal: 0,
    data: [
      {
        id: 'AWD-1',
        issuer: 'Penghargaan Web Development Gemastik',
        description:
          'Pemenang Web Development Acara Gemastik. Penghargaan ini diberikan kepada individu atau tim yang berhasil merancang dan mengembangkan situs web yang inovatif, fungsional, dan memiliki dampak positif dalam konteks kompetisi Gemastik. Pemenangnya menonjol dalam kreativitas desain, kemampuan teknis, dan kecakapan dalam membangun pengalaman pengguna yang memikat. Dengan pencapaian ini, pemenang berperan penting dalam menginspirasi dan memajukan industri pengembangan web di Indonesia.',
      },
      {
        id: 'AWD-2',
        issuer: 'Penghargaan UI/UX Gemastik',
        description:
          'Pemenang Web Development Acara Gemastik. Penghargaan ini diberikan kepada individu atau tim yang berhasil merancang dan mengembangkan situs web yang inovatif, fungsional, dan memiliki dampak positif dalam konteks kompetisi Gemastik. Pemenangnya menonjol dalam kreativitas desain, kemampuan teknis, dan kecakapan dalam membangun pengalaman pengguna yang memikat. Dengan pencapaian ini, pemenang berperan penting dalam menginspirasi dan memajukan industri pengembangan web di Indonesia.',
      },
      {
        id: 'AWD-3',
        issuer: 'Penghargaan Networking Gemastik',
        description:
          'Pemenang Web Development Acara Gemastik. Penghargaan ini diberikan kepada individu atau tim yang berhasil merancang dan mengembangkan situs web yang inovatif, fungsional, dan memiliki dampak positif dalam konteks kompetisi Gemastik. Pemenangnya menonjol dalam kreativitas desain, kemampuan teknis, dan kecakapan dalam membangun pengalaman pengguna yang memikat. Dengan pencapaian ini, pemenang berperan penting dalam menginspirasi dan memajukan industri pengembangan web di Indonesia.',
      },
    ],
    error: null,
  };
  return new Response(JSON.stringify(responseData));
}
