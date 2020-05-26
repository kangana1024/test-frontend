/* eslint-disable react-hooks/exhaustive-deps */
import React, { Suspense, useEffect } from 'react';
import { Layout, Breadcrumb } from 'antd';
import { Redirect, Route, Switch, withRouter, Link, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';

import SlideNav from './slidenav';
import navigation from '../../_nav';
import routes from '../../routes';
import { isLogin } from '../../actions/auth_action';

const { Header, Content, Footer } = Layout;
const breadcrumbNameMap = {
  '/sendmail': 'SendMail',
  '/contact': 'Contact',
  '/taxcal': 'Tax Calculator',
};
const DefaultLayout = withRouter((props) => {
  const history = useHistory();
  useEffect(() => {
    props.isLogin((status) => {
      if (status !== 'success') {
        history.push('/login');
      }
    });
    onResize();
    document.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('resize', onResize);
    };
  }, []);
  const onResize = () => {
    const windowH = window.innerHeight - 194;

    document.getElementById('maincontent').style.maxHeight = windowH + 'px';
    document.getElementById('maincontent').style.height = windowH + 'px';
  };
  const { location } = props;
  const pathSnippets = location.pathname.split('/').filter((i) => i);
  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    return (
      <Breadcrumb.Item key={url}>
        <Link to={url}>{breadcrumbNameMap[url] ? breadcrumbNameMap[url] : 'Contact Group'}</Link>
      </Breadcrumb.Item>
    );
  });
  const breadcrumbItems = [
    <Breadcrumb.Item key="home">
      <Link to="/">Home</Link>
    </Breadcrumb.Item>,
  ].concat(extraBreadcrumbItems);
  const loading = () => (
    <div className="animated fadeIn pt-1 text-center">
      <div className="sk-spinner sk-spinner-pulse"></div>
    </div>
  );
  return (
    <Layout className="layout">
      <Header>
        <div className="logo" />
        <SlideNav navConfig={navigation} />
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>{breadcrumbItems}</Breadcrumb>
        <div id="maincontent" className="site-layout-content">
          <Suspense fallback={loading()}>
            <Switch>
              {routes.map((route, idx) => {
                return route.component ? (
                  <Route
                    key={idx}
                    path={route.path}
                    exact={route.exact}
                    name={route.name}
                    render={(props) => <route.component {...props} />}
                  />
                ) : null;
              })}
              <Redirect from="/" to="/sendmail" />
            </Switch>
          </Suspense>
        </div>
      </Content>
      <Footer className="">Demo.</Footer>
    </Layout>
  );
});
const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = {
  isLogin,
};

export default connect(mapStateToProps, mapDispatchToProps)(DefaultLayout);
