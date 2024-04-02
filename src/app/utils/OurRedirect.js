import { useRouter } from 'next/router'

const OurRedirect = (path) => {
   console.info('redirected')
   const router = useRouter();
   router.push(path);
};

export default OurRedirect;   