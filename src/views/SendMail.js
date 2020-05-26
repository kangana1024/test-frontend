import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import { sendMail } from '../configs/api';
import { connect } from 'react-redux';
const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8 },
};
const SendMail = (props) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const sendDataMail = async (data) => {
    setLoading(true);
    await fetch(sendMail, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: 'Bearer ' + props.auth.token.atoken,
      },
      body: JSON.stringify(data),
    });
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'SendMail has success',
      showConfirmButton: false,
      timer: 800,
    });
    form.resetFields();
    setLoading(false);
  };
  const onFinish = (values) => {
    sendDataMail(values);
  };
  return (
    <Form {...layout} form={form} name="normal_sendmail" initialValues={{ remember: true }} onFinish={onFinish}>
      <Form.Item
        label="to :"
        name="email"
        rules={[{ type: 'email', required: true, message: 'Please input your Email!' }]}
      >
        <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="TO Email" />
      </Form.Item>
      <Form.Item
        name="message"
        label="Message"
        rules={[{ required: true, message: 'Please input your Text Message!' }]}
      >
        <Input.TextArea />
      </Form.Item>
      <Form.Item wrapperCol={{ span: 4, offset: 4 }}>
        <Button loading={loading} type="primary" htmlType="submit" className="login-form-button">
          SendMail
        </Button>
      </Form.Item>
    </Form>
  );
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SendMail);
