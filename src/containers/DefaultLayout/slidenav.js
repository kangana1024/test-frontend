/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { Menu } from 'antd';
const SlideNav = (props) => {
  const [activeIndex, setActiveIndex] = useState('0');
  const { children, navConfig } = props;

  useEffect(() => {
    hashChangeHandle();
    window.addEventListener('hashchange', hashChangeHandle);

    return () => {
      window.removeEventListener('hashchange', hashChangeHandle);
    };
  }, []);

  const hashChangeHandle = () => {
    const findKey = currentkey();
    setActiveIndex(findKey.toString());
  };
  const navList = (items) => {
    return items.map((item, index) => navType(item, index));
  };

  const navType = (item, idx) => {
    return item.title
      ? navTitle(item, idx)
      : item.divider
      ? navDivider(item, idx)
      : navTitle(item, idx);
  };

  const navDivider = (divider, key) => {
    const classes = classNames('divider', divider.class);
    return <li key={key} className={classes} />;
  };

  const navTitle = (title, key) => {
    const classes = classNames('nav-title', title.class, title.className);
    return (
      <Menu.Item key={key} className={classes}>
        <a href={'#' + title.url}>{navWrapper(title)}</a>
      </Menu.Item>
    );
  };

  const navWrapper = (item) => {
    return item.wrapper && item.wrapper.element
      ? React.createElement(item.wrapper.element, item.wrapper.attributes, item.name)
      : item.name;
  };

  const currentkey = () => {
    const windowUrl = window.location.hash.replace('#', '');
    const findActive = navConfig.items.findIndex((item) => {
      return windowUrl.indexOf(item.url) > -1;
    });

    return findActive || 0;
  };

  return (
    <Menu theme="dark" mode="horizontal" selectedKeys={[activeIndex]}>
      {children || navList(navConfig.items)}
    </Menu>
  );
};

export default SlideNav;
