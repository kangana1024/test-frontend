/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';

import { userlogin, isLogin } from '../actions/auth_action';

const NormalLoginForm = (props) => {
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  useEffect(() => {
    props.isLogin((status) => {
      if (status === 'success') {
        history.push('/sendmail');
      }
    });
    resizePage();
    document.addEventListener('resize', resizePage);
    return () => {
      document.removeEventListener('resize', resizePage);
    };
  }, []);
  const resizePage = () => {
    const wh = window.innerHeight;
    const rootPage = document.getElementById('contrainer-login');
    rootPage.style.maxHeight = wh + 'px';
    rootPage.style.height = wh + 'px';
  };
  const onFinish = (values) => {
    setLoading(true);
    try {
      props.userlogin(values, (status) => {
        if (status === 'success') {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Login has success',
            showConfirmButton: false,
            timer: 1800,
          }).then(() => {
            history.push('/sendmail');
          });
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'Login has error!',
            text: 'username password invalid',
          });
        }
        setLoading(false);
      });
    } catch (error) {}
  };

  return (
    <div id="contrainer-login">
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Please input your Username!' }]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item>
          <Button loading={loading} type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
          &nbsp;Or <Link to="/signup">register now!</Link>
        </Form.Item>
      </Form>
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = {
  userlogin,
  isLogin,
};

export default connect(mapStateToProps, mapDispatchToProps)(NormalLoginForm);
