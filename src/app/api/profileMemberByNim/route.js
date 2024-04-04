export async function GET(request) {
  const responseData = {
    code: 200,
    status: 'SUCCESS',
    recordsTotal: 0,
    data: {
      nim: '123456789101',
      roleId: 'MBR',
      divisionId: 'CCI-WBD',
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
      role: {
        id: 'MBR',
        name: 'member',
      },
      division: {
        id: 'CCI-WBD',
        name: 'Web Development',
        description:
          'Divisi Web Development di UKM kampus bertugas membuat dan menjaga situs web atau aplikasi web organisasi. Mereka merancang, mengembangkan, dan memastikan keamanan serta kinerja situs web tersebut. Kerja sama dengan divisi lain untuk memahami kebutuhan mereka juga menjadi bagian dari tugas mereka. Dengan divisi ini, UKM kampus dapat meningkatkan kehadiran online mereka dan memberikan layanan yang lebih efektif kepada anggota.',
        logoUrl:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ66_0v2Yd76CD8eYVBnHGxtMh-tQgO0EX49cVRut8udQ&s',
      },
      contributorAward: [
        {
          id: 'C-AWRD-1',
          memberId: '123456789101',
          awardId: 'AWRD-1',
          award: {
            id: 'AWRD-1',
            issuer: 'Penghargaan Web Development Gemastik',
          },
        },
        {
          id: 'C-AWRD-2',
          memberId: '123456789101',
          awardId: 'AWRD-2',
          award: {
            id: 'AWRD-2',
            issuer: 'Penghargaan Mobile Development Gemastik',
          },
        },
        {
          id: 'C-AWRD-3',
          memberId: '123456789101',
          awardId: 'AWRD-3',
          award: {
            id: 'AWRD-3',
            issuer: 'Penghargaan UI/UX Design Gemastik',
          },
        },
      ],

      contributorProject: [
        {
          id: 'C-PRJ-1',
          memberId: '123456789101',
          projectId: 'PRJ-3',
          project: {
            id: 'PRJ-1',
            name: 'Pengembangan Aplikasi Mobile Gemastik',
          },
        },
        {
          id: 'C-PRJ-2',
          memberId: '123456789101',
          projectId: 'PRJ-3',
          project: {
            id: 'PRJ-2',
            name: 'Pengembangan Website E-commerce Gemastik',
          },
        },
        {
          id: 'C-PRJ-3',
          memberId: '123456789101',
          projectId: 'PRJ-3',
          project: {
            id: 'PRJ-3',
            name: 'Pengembangan Aplikasi Sosial Media Gemastik',
          },
        },
      ],
    },

    error: null,
  };
  return new Response(JSON.stringify(responseData));
}
