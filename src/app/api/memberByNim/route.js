export async function GET(request) {
  const responseData = {
    code: 200,
    status: "SUCCESS",
    recordsTotal: 0,
    data: {
      nim: "123456789101",
      role: "member",
      division: "Web Development",
      name: "Tasya Syifaunnisa",
      email: "tsaya.siifa@gmail.com",
      major: "S1 Informatika",
      phoneNumber: "083167889342",
      linkedinUrl: "https://www.linkedin.com/in/tasya-syifaunnisa-4b489927a/",
      profileUrl:
        "https://web-images.pixpa.com/rdMS2x9jy_NhIrbG0o7QZSX-TF707z98CMMQ5e97XgM/rs:fit:1200:0/q:80/aHR0cHM6Ly9waXhwYWNvbS1pbWcucGl4cGEuY29tL2NvbS9hcnRpY2xlcy8xNjg1NzAxMTk0LTExODkwNC1wcm9tb3Rpb25hbC1tb2RlbGpwZy5wbmc=",
      yearUniversityEnrolled: "2013-02-26 21:28:37.261134+01:00",
      yearCommunityEnrolled: "2013-02-26 21:28:37.261134+01:00",
      isActive: true,
      awards: [
        {
          id: "AWD-1",
          issuer: "Penghargaan Web Development Gemastik",
        },
        {
          id: "AWD-2",
          issuer: "Penghargaan UI/UX Gemastik",
        },
      ],
      projects: [
        {
          id: "PRJ-1",
          name: "Web App Ecomerce by AkuBangkrut",
        },
      ],
    },
    error: null,
  };
  return new Response(JSON.stringify(responseData));
}
