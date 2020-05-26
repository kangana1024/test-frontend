import React from 'react';

const SendMail = React.lazy(() => import('./views/SendMail'));
const Contact = React.lazy(() => import('./views/Contact'));
const ContactGroup = React.lazy(() => import('./views/ContactGroup'));
const TaxCal = React.lazy(() => import('./views/TaxCal'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/sendmail', name: 'SendMail', component: SendMail },
  { path: '/contact', exact: true, name: 'Contact', component: Contact },
  { path: '/contact/group/:id', exact: true, name: 'Contact Group', component: ContactGroup },
  { path: '/taxcal', name: 'Tax Calculator', component: TaxCal },
];

export default routes;
