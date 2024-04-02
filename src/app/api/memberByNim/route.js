export async function GET(request) {
  const responseData = {
    code: 200,
    status: 'SUCCESS',
    recordsTotal: 0,
    data: {
      nim: '123456789101',
      roleId: {
        id: 1,
        name: 'member',
      },
      divisionId: {
        id: 1,
        name: 'Web Developmentt',
        description:
          'Divisi Web Development di UKM kampus bertugas membuat dan menjaga situs web atau aplikasi web organisasi. Mereka merancang, mengembangkan, dan memastikan keamanan serta kinerja situs web tersebut. Kerja sama dengan divisi lain untuk memahami kebutuhan mereka juga menjadi bagian dari tugas mereka. Dengan divisi ini, UKM kampus dapat meningkatkan kehadiran online mereka dan memberikan layanan yang lebih efektif kepada anggota.',
        logoUrl:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ66_0v2Yd76CD8eYVBnHGxtMh-tQgO0EX49cVRut8udQ&s',
      },
      name: 'Tasya Syifaunnisa',
      email: 'tsaya.siifa@gmail.com',
      major: 'S1 Informatika',
      linkedinUrl: 'https://www.linkedin.com/in/tasya-syifaunnisa-4b489927a/',
      phoneNumber: '083167889342',
      profileUrl:
        'https://web-images.pixpa.com/rdMS2x9jy_NhIrbG0o7QZSX-TF707z98CMMQ5e97XgM/rs:fit:1200:0/q:80/aHR0cHM6Ly9waXhwYWNvbS1pbWcucGl4cGEuY29tL2NvbS9hcnRpY2xlcy8xNjg1NzAxMTk0LTExODkwNC1wcm9tb3Rpb25hbC1tb2RlbGpwZy5wbmc=',
      isActive: true,
      yearUniversityEnrolled: '2013-02-26 21:28:37.261134+01:00',
      yearCommunityEnrolled: '2013-02-26 21:28:37.261134+01:00',
      createdAt: '2013-02-26 21:28:37.261134+01:00',
      updatedAt: '2013-02-26 21:28:37.261134+01:00',
    },
    error: null,
  };
  return new Response(JSON.stringify(responseData));
}
