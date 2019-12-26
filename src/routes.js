import splash from './screens/splash';
import home from './screens/home';
import categories from './screens/categories';
import post from './screens/post';
import pages from './screens/pages';
import page from './screens/page';

/*
refs.
- https://github.com/mathiasbynens/he
  - he.encode('foo \0 bar')
- https://stackoverflow.com/questions/3700326/decode-amp-back-to-in-javascript
- 
*/

const routes = [
  {
    path: '/splash/',
    component: splash
  },
  {
    path: '/home/',
    component: home
  },
  {
    path: '/pages/',
    component: pages
  },
  {
    path: '/page/',
    component: page
  },
  {
    path: '/categories/',
    component: categories
  },
  {
    path: '/post/',
    component: post,
  }
];

export default routes;