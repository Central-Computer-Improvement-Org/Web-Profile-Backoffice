export async function GET(request) {
  const responseData = {
    code: 200,
    status: "SUCCESS",
    recordsTotal: 0,
    data: [
      {
        id: "DCA-212121",
        award_id: "AWD-12345",
        award: {
          issuer: "Penghargaan Web Development Gemastik",
          description:
            "Pemenang Web Development Acara Gemastik. Penghargaan ini diberikan kepada individu atau tim yang berhasil merancang dan mengembangkan situs web yang inovatif, fungsional, dan memiliki dampak positif dalam konteks kompetisi Gemastik. Pemenangnya menonjol dalam kreativitas desain, kemampuan teknis, dan kecakapan dalam membangun pengalaman pengguna yang memikat. Dengan pencapaian ini, pemenang berperan penting dalam menginspirasi dan memajukan industri pengembangan web di Indonesia.",
          createdAt: "2013-02-26 21:28:37.261134+01:00",
          updatedAt: "2013-02-26 21:28:37.261134+01:00",
        },
        contributor: [
          {
            nim: 123456789101,
            name: "Tasya Syifaunnisa",
            email: "tsaya.siifa@gmail.com",
            major: "S1 Informatika",
            linkedinUrl:
              "https://www.linkedin.com/in/tasya-syifaunnisa-4b489927a/",
            phoneNumber: "083167889342",
            profileUrl:
              "https://web-images.pixpa.com/rdMS2x9jy_NhIrbG0o7QZSX-TF707z98CMMQ5e97XgM/rs:fit:1200:0/q:80/aHR0cHM6Ly9waXhwYWNvbS1pbWcucGl4cGEuY29tL2NvbS9hcnRpY2xlcy8xNjg1NzAxMTk0LTExODkwNC1wcm9tb3Rpb25hbC1tb2RlbGpwZy5wbmc=",
            isActive: true,
          },
        ],
      },
      {
        award_id: "AWD-12345",
        award: {
          issuer: "Penghargaan Web Development Gemastik",
          description:
            "Pemenang Web Development Acara Gemastik. Penghargaan ini diberikan kepada individu atau tim yang berhasil merancang dan mengembangkan situs web yang inovatif, fungsional, dan memiliki dampak positif dalam konteks kompetisi Gemastik. Pemenangnya menonjol dalam kreativitas desain, kemampuan teknis, dan kecakapan dalam membangun pengalaman pengguna yang memikat. Dengan pencapaian ini, pemenang berperan penting dalam menginspirasi dan memajukan industri pengembangan web di Indonesia.",
          createdAt: "2013-02-26 21:28:37.261134+01:00",
          updatedAt: "2013-02-26 21:28:37.261134+01:00",
        },
        contributor: [
          {
            nim: 123456789101,
            name: "Tasya Syifaunnisa",
            email: "tsaya.siifa@gmail.com",
            major: "S1 Informatika",
            linkedinUrl:
              "https://www.linkedin.com/in/tasya-syifaunnisa-4b489927a/",
            phoneNumber: "083167889342",
            profileUrl:
              "https://web-images.pixpa.com/rdMS2x9jy_NhIrbG0o7QZSX-TF707z98CMMQ5e97XgM/rs:fit:1200:0/q:80/aHR0cHM6Ly9waXhwYWNvbS1pbWcucGl4cGEuY29tL2NvbS9hcnRpY2xlcy8xNjg1NzAxMTk0LTExODkwNC1wcm9tb3Rpb25hbC1tb2RlbGpwZy5wbmc=",
            isActive: true,
          },
        ],
      },
    ],
    error: null,
  };
  return new Response(JSON.stringify(responseData));
}
