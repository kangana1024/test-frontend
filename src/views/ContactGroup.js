/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Form, DatePicker, Input, Modal, Divider, List, Button } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { PlusCircleFilled } from '@ant-design/icons';
import Swal from 'sweetalert2';

import { groupContactApi } from '../configs/api';
const ContactGroup = (props) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    // console.log(props);
    fetchGroupData();
  }, []);

  const fetchGroupData = async () => {
    const response = await fetch(groupContactApi + '/' + props.match.params.id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: 'Bearer ' + props.auth.token.atoken,
      },
    });
    let resjson = await response.json();

    if (resjson.statusCode) {
      // error handle
      return;
    }
    setData(resjson);
  };

  const createContactData = async (data) => {
    setLoading(true);
    const response = await fetch(groupContactApi + '/' + props.match.params.id, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: 'Bearer ' + props.auth.token.atoken,
      },
      body: JSON.stringify(data),
    });
    const resjson = await response.json();
    if (resjson.statusCode) {
      // error handle
      return null;
    }
    setLoading(false);
    console.log(resjson);
    return resjson;
  };

  const handleVisibleModal = () => {
    setModalVisible(true);
  };
  const handleCloseModal = () => {
    setModalVisible(false);
  };
  const onFinishCreateGroup = async (values) => {
    values.bod = values.bod.format('YYYY-MM-DD');
    if (values.email === '') {
      delete values.email;
    }
    if (values.phone === '') {
      delete values.phone;
    }
    if (values.url === '') {
      delete values.url;
    }

    try {
      const res = await createContactData(values);
      if (res) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Create Group has success',
          showConfirmButton: false,
          timer: 900,
        }).then(() => {
          setData([...data, { id: res.id, firstname: res.firstname, lastname: res.lastname }]);
        });
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Create Group has error!',
          text: 'Create Group invalid',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'warning',
        title: 'Create Group has error!',
        text: 'Create Group invalid',
      });
    }
    setModalVisible(false);
  };
  return (
    <div className="animated fadeIn">
      <Modal
        title="Create Contact Groups"
        onCancel={handleCloseModal}
        visible={modalVisible}
        footer={null}
      >
        <Form name="creatgroup_form" className="creatgroup-form" onFinish={onFinishCreateGroup}>
          <Form.Item
            name="firstname"
            rules={[{ required: true, message: 'Please input Contact FirstName!' }]}
          >
            <Input placeholder="FirstName." />
          </Form.Item>
          <Form.Item
            name="lastname"
            rules={[{ required: true, message: 'Please input Contact LastName!' }]}
          >
            <Input placeholder="LastName." />
          </Form.Item>
          <Form.Item
            name="bod"
            rules={[{ required: true, message: 'Please input Contact LastName!' }]}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item name="phone" initialValue="">
            <Input placeholder="Phone Number." />
          </Form.Item>
          <Form.Item name="email" initialValue="">
            <Input placeholder="Email." />
          </Form.Item>
          <Form.Item name="url" initialValue="">
            <Input placeholder="Web Site." />
          </Form.Item>

          <Form.Item style={{ textAlign: 'center' }}>
            <Button type="primary" htmlType="submit" block>
              Create Groups
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Divider orientation="left">Contact Groups #{props.match.params.id}</Divider>
      <List
        bordered
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <Link to={'/contact/' + item.id}>
              <h3>{item.firstname + ' ' + item.lastname}</h3>
            </Link>
          </List.Item>
        )}
      />

      <Button
        type="primary"
        loading={loading}
        onClick={handleVisibleModal}
        icon={<PlusCircleFilled />}
        block
      >
        Create Contact
      </Button>
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ContactGroup);
